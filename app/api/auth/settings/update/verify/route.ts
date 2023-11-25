import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const { code } = await req.json();
  console.log(code);
  try {
    const user = await prisma.user.findFirst({
      where: {
        verification_code: code,
      },
    });

    if (!user) {
      return new NextResponse("کد وارد شده صحیح نمی‌باشد", { status: 404 });
    }

    return new NextResponse("موفق", { status: 200 });
  } catch (error) {
    console.error("Error verification code:", error);
    return new NextResponse("An error occurred during verification", {
      status: 500,
    });
  }
};
