import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const PATCH = async (req: NextRequest) => {
  const { password, code } = await req.json();
  console.log(password);
  try {
    const user = await prisma.user.findFirst({
      where: {
        verification_code: code,
      },
    });

    if (!user) {
      return new NextResponse("کاربر یافت نشد", { status: 404 });
    }

    const newHashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashedPassword,
        verification_code: "",
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
