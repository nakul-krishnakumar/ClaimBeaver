import prisma from "@/utils/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createRedisClient } from 'redis';

export async function POST(req: NextRequest) {
    let redisClient;
    try {
        // Initialize Redis client
        redisClient = createRedisClient({ url: process.env.REDIS_URL });
        await redisClient.connect();

        // Parse request
        const { message, messageId } = await req.json();
        const cookiestore = await cookies();
        const supabase = await createClient(cookiestore);
        
        // Authenticate user
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Authentication error:', error.message || error);
            return NextResponse.json({ message: 'Authentication error' }, { status: 401 });
        }

        const userEmail = data.user.email;
        if (!userEmail) {
            return NextResponse.json({ message: 'User email not found' }, { status: 400 });
        }

        let memberData;

        // Check Redis Cache for member data
        try {
            const cachedMember = await redisClient.get(`member_data:${userEmail}`);
            if (cachedMember) {
                memberData = JSON.parse(cachedMember);
            }
        } catch (redisError) {
            console.error('Redis error when fetching member data:', 
                redisError instanceof Error ? redisError.message : redisError);
        }

        // Query Database only if not cached
        if (!memberData) {
            memberData = await prisma.member.findMany({
                where: { member_email: userEmail },
                include: { dependant: true }
            });

            if (memberData && memberData.length > 0) {
                try {
                    await redisClient.set(`member_data:${userEmail}`, JSON.stringify(memberData), { EX: 3600 });
                } catch (redisCacheError) {
                    console.error('Redis cache error when storing member data:', 
                        redisCacheError instanceof Error ? redisCacheError.message : redisCacheError);
                }
            }
        }

        if (!memberData || memberData.length === 0) {
            return NextResponse.json({ message: 'Member data not found' }, { status: 404 });
        }

        // Fetch Claims and Plans in parallel
        const memberId = memberData[0].member_id;

        const [claimData, plans] = await Promise.all([
            prisma.claim.findMany({
                include: { service: true, provider: true }
            }),
            prisma.plan.findMany({ })
        ]);

        if (!plans || plans.length === 0) {
            return NextResponse.json({ message: 'Plan data not found' }, { status: 404 });
        }

        // Check Redis Cache for Plan Coverages
        let planCoverages;
        try {
            const cachedPlanCoverage = await redisClient.get(`plan_coverage:${plans[0].plan_id}`);
            if (cachedPlanCoverage) {
                planCoverages = JSON.parse(cachedPlanCoverage);
            }
        } catch (redisError) {
            console.error('Redis error when fetching plan coverage:', 
                redisError instanceof Error ? redisError.message : redisError);
        }

        // Fetch from Database only if not cached
        if (!planCoverages) {
            planCoverages = await prisma.plan_coverage.findMany({
                where: { plan_id: plans[0].plan_id },
                include: { service: true }
            });

            if (planCoverages) {
                try {
                    await redisClient.set(`plan_coverage:${plans[0].plan_id}`, JSON.stringify(planCoverages), { EX: 3600 });
                } catch (redisCacheError) {
                    console.error('Redis cache error when storing plan coverage:', 
                        redisCacheError instanceof Error ? redisCacheError.message : redisCacheError);
                }
            }
        }

        const details = {
            memberData,
            claimData,
            plans,
            planCoverages,
            userId: data.user.id,
            userEmail,
            messageId
        };


        // Check if response is already cached
        let aiResponse;
        if (message) {
            try {
                const cachedResponse = await redisClient.get(`message_response:${message}`);
                if (cachedResponse) {
                    const parsedResponse = JSON.parse(cachedResponse);
                    aiResponse = parsedResponse.response || parsedResponse;
                }
            } catch (redisError) {
                console.error('Redis error when fetching cached response:', 
                    redisError instanceof Error ? redisError.message : redisError);
            }
        }

        // Fetch from Backend Service if not cached
        if (!aiResponse) {
            try {
                const response = await axios.post(
                    process.env.BACKEND_API_URL || 'http://localhost:8000/api/claims-inquiry', 
                    { details, message,userEmail }
                );
                
                aiResponse = response.data.response || response.data;
                
                // Cache the response
                if (message) {
                    try {
                        await redisClient.set(`message_response:${message}`, JSON.stringify({
                            response: aiResponse,
                            timestamp: new Date().toISOString()
                        }), { EX: 3600 });
                    } catch (redisCacheError) {
                        console.error('Redis cache error when storing AI response:', 
                            redisCacheError instanceof Error ? redisCacheError.message : redisCacheError);
                    }
                }
            } catch (axiosError) {
                console.error('Error fetching response from backend service:', 
                    axiosError instanceof Error ? axiosError.message : axiosError);
                aiResponse = {
                    message: "I'm sorry, I couldn't process your request at this time. Please try again later."
                };
            }
        }

        return NextResponse.json(aiResponse);

    } catch (error) {
        console.error('Error processing message:', error instanceof Error ? error.message : error);
        return NextResponse.json({ 
            message: 'Error processing message',
            error: error instanceof Error ? error.message : error
        }, { status: 500 });
    } finally {
        // Ensure Redis connection is closed properly
        if (redisClient && redisClient.isOpen) {
            await redisClient.quit().catch(err => {
                console.error('Error closing Redis connection:', 
                    err instanceof Error ? err.message : err);
            });
        }
    }
}