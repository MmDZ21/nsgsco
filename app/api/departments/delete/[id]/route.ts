import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("عدم دسترسی", { status: 403 });
  }
  const id = params.id;
  try {
    const deletedDepartment = await prisma.department.delete({
      where: {
        id: id,
      },
    });
    console.log(deletedDepartment);
    // Serialize the payslips data to JSON
    const departmentJson = JSON.stringify(deletedDepartment);

    return new NextResponse(departmentJson, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
