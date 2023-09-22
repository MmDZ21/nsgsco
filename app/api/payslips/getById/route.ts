import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;
  try {
    const payslips = await prisma.payslip.findMany({
      where: {
        userId,
      },
    });
    console.log(payslips);

    // Serialize the payslips data to JSON
    const payslipsJson = JSON.stringify(payslips);

    return new NextResponse(payslipsJson, {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
