import prisma from "@/utils/prisma/prisma";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const res = await prisma.service.findMany({
            select: {
                service_id: true,
                service_name: true,
            }
        })
        return NextResponse.json(res)
    }
    catch (err) {
        return NextResponse.json(err)
    }
}