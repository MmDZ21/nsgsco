import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    return new NextResponse(JSON.stringify(department), { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
