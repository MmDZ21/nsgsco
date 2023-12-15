import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("عدم دسترسی", { status: 403 });
  }
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            phone: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    console.log(departments);

    // Serialize the payslips data to JSON
    const departmentsJson = JSON.stringify(departments);

    return new NextResponse(departmentsJson, {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
