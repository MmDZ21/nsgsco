import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const PATCH = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }

  try {
    const formData = await req.formData();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    console.log(currentPassword);

    if (!currentPassword || !newPassword) {
      return new NextResponse("پسورد فعلی و پسورد جدید را وارد کنید", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("کاربر یافت نشد", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return new NextResponse("پسورد فعلی اشتباه است", { status: 403 });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: newHashedPassword,
      },
    });

    return new NextResponse("پسورد با موفقیت تغییر کرد", { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return new NextResponse("An error occurred during changing password", {
      status: 500,
    });
  }
};
