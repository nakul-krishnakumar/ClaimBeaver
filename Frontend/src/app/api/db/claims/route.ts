import prisma from "@/utils/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const cookiestore = await cookies();
        const supabase = await createClient(cookiestore);

        // Get user from Supabase
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            console.error("Error fetching user:", error);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEmail = data.user.email;
        if (!userEmail) {
            return NextResponse.json({ message: "User email not found" }, { status: 400 });
        }

        // Find member
        const member = await prisma.member.findUnique({
            where: { member_email: userEmail },
        });

        if (!member) {
            return NextResponse.json({ data: [] }, { status: 200 }); // Always return an array
        }

        // Fetch claims
        const claims = await prisma.claim.findMany({
            where: { member_id: member.member_id },
            include: {
                service: {
                    select: {
                        service_name: true, // Assuming 'name' is the field for the service name
                    },
                },
                provider: {
                    select: {
                        provider_name: true, // Assuming 'name' is the field for the provider name
                    },
                },
            },
        });


        return NextResponse.json({ data: claims ?? [] }, { status: 200 }); // Ensure it's always an array
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}



export async function POST(req: NextRequest) {
    try {
        const cookiestore = await cookies();
        const supabase = await createClient(cookiestore);

        // Get user from Supabase
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            console.error("Error fetching user:", error);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEmail = data.user.email;
        if (!userEmail) {
            return NextResponse.json({ message: "User email not found" }, { status: 400 });
        }

        // Find member
        const member = await prisma.member.findUnique({
            where: { member_email: userEmail },
        });

        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        // Parse request body
        const {
            service_id,
            provider_id,
            claim_amount,
            service_date,
            submission_date,
            claim_status,
        } = await req.json();

        // Validate required fields
        if (!service_id || !provider_id || !claim_amount || !claim_status) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const approval_date = new Date(submission_date);
        approval_date.setDate(approval_date.getDate() + 7);


        // Create claim
        const claim = await prisma.claim.create({
            data: {
                member_id: member.member_id,
                service_id: parseInt(service_id),
                provider_id: parseInt(provider_id),
                claim_amount: parseFloat(claim_amount), // Ensure proper decimal handling
                service_date: service_date ? new Date(service_date) : null,
                submission_date: submission_date ? new Date(submission_date) : null,
                approval_date,
                claim_status,
            },
        });

        return NextResponse.json({ data: claim }, { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
