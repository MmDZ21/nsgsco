import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
export const PATCH = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;
    const active = formData.get("active") as string;
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
        active: active === "active" ? true : false,
      },
    });

    return new NextResponse("نام کارگاه با موفقیت تغییر کرد", { status: 201 });
  } catch (error) {
    console.error("Error updating department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
