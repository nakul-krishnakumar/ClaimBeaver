import prisma from "@/utils/prisma/prisma";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const res = await prisma.provider.findMany({
            select: {
                provider_id: true,
                provider_name: true,
            } 
        })
        return NextResponse.json(res)
    }
    catch (err) {
        return NextResponse.json(err)
    }
}