import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { department } = await req.json(); // Access sent data from req.body
  console.log(department);
  try {
    const users = await prisma.user.findMany({
      where: {
        department: department,
      },
    });
    console.log(users);
    if (users.length < 1) {
      return new NextResponse("کاربری یافت نشد", { status: 404 });
    }
    const phones = users.map((user) => user.phone);
    const phonesJson = JSON.stringify(phones);
    return new NextResponse(phonesJson, {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
