import amqplib from 'amqplib';
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma/prisma';

export async function POST(req: NextRequest) {
    try {
        // ✅ Get auth session from cookies
        const cookiestore = await cookies();

        const supabase = await createClient(cookiestore);

        // ✅ Parse request body
        const { message } = await req.json(); 
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // ✅ Authenticate user
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user?.email) {
            console.error('Auth error:', error?.message || "User not found");
            return NextResponse.json({ error: "Authentication error" }, { status: 401 });
        }

        const userEmail = data.user.email;

        // ✅ Fetch member data
        const memberData = await prisma.member.findMany({
            where: { member_email: userEmail },
            include: { dependant: true }
        });

        if (memberData.length === 0) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        const memberId = memberData[0].member_id;

        // ✅ Fetch claims, plans, and coverage
        const [claimData, plans] = await Promise.all([
            prisma.claim.findMany({
                where: { member_id: memberId },
                include: { service: true, provider: true }
            }),
            prisma.plan.findMany({
            })
        ]);

        if (plans.length === 0) {
            return NextResponse.json({ error: "No plans found for this member" }, { status: 404 });
        }

        const planCoverages = await prisma.plan_coverage.findMany({
            where: { plan_id: plans[0].plan_id },
            include: { service: true }
        });

        // ✅ Prepare message for RabbitMQ
        const details = { memberData, claimData, plans, planCoverages };
        const chatData = JSON.stringify({ details, message, userEmail });

        // ✅ Connect to RabbitMQ
        const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
        const channel = await connection.createChannel();
        const queue = 'healthcare_claims';

        await channel.assertQueue(queue, { durable: true });
        await channel.sendToQueue(queue, Buffer.from(chatData), { persistent: true });

        // ✅ Close RabbitMQ connection properly
        await channel.close();
        await connection.close();

        return NextResponse.json({ message: 'Message sent successfully' });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
