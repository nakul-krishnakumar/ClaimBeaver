import prisma from "@/utils/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
};
const isValidPhoneNumber = (phone: string) => {
    return phone && phone.length >= 10 && phone.length <= 15;
};

export async function POST(req: NextRequest) {
    try {
        const details = await req.json();

        if (!details.member_name || !details.member_email || !details.date_of_birth) {
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
        }

        if (!isValidEmail(details.member_email)) {
            return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
        }

        if (!isValidDate(details.date_of_birth) || 
            (details.member_effective_start_date && !isValidDate(details.member_effective_start_date)) || 
            (details.member_effective_end_date && !isValidDate(details.member_effective_end_date))) {
            return NextResponse.json({ message: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
        }

        if (details.phone_number && !isValidPhoneNumber(details.phone_number)) {
            return NextResponse.json({ message: "Invalid phone number. It should be 10-15 digits." }, { status: 400 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { member_email: details.member_email },
        });

        if (existingMember) {
            return NextResponse.json({ message: "Email already in use." }, { status: 409 });
        }

        const existingDependent = await prisma.dependant.findFirst({
            where: { dependant_name: details.dependent_name },
        });

        let dependent;
        if (existingDependent) {
            dependent = existingDependent;
        } else {
            dependent = await prisma.dependant.create({
                data: {
                    dependant_name: details.dependent_name,
                    dependant_address: details.dependent_address,
                    dependant_contact: details.dependent_contact,
                }
            });
        }

        const gender = details.gender === "Male" ? "M" : details.gender === "Female" ? "F" : "Other";

        await prisma.member.create({
            data: {
                member_name: details.member_name,
                member_email: details.member_email,
                date_of_birth: new Date(details.date_of_birth),
                gender,
                phone_number: details.phone_number,
                address: details.address,
                member_effective_start_date: details.member_effective_start_date ? new Date(details.member_effective_start_date) : null,
                member_effective_end_date: details.member_effective_end_date ? new Date(details.member_effective_end_date) : null,
                dependant_id: dependent.dependant_id
            }
        });

        return NextResponse.json({ message: "Member added successfully." }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
    }
}
