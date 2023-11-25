import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeSmsService } from "@/lib/smsir";

export const PATCH = async (req: NextRequest) => {
  const min = 100000;
  const max = 999999;
  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const smsService = initializeSmsService();
  try {
    const formData = await req.formData();
    const phoneNumber = formData.get("phoneNumber") as string;
    console.log(phoneNumber);
    const verificationCode = String(getRndInteger(min, max));
    console.log(verificationCode);
    const user = await prisma.user.findFirst({
      where: {
        phone: phoneNumber,
      },
    });

    if (!user) {
      return new NextResponse("کاربر یافت نشد", { status: 404 });
    }

    const res = await smsService.SendVerifyCode(phoneNumber, 100000, [
      { name: "CODE", value: verificationCode },
    ]);

    if (res.status !== 200) {
      return new NextResponse(res.data, { status: res.status });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verification_code: verificationCode,
      },
    });

    return new NextResponse("کد تایید با موفقیت ارسال شد", { status: 200 });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return new NextResponse(
      "An error occurred during sending verification code",
      {
        status: 500,
      }
    );
  }
};
