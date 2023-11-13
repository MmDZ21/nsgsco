import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("عدم دسترسی", { status: 403 });
  }
  const fileId = params.fileId;
  try {
    const deletedPayslip = await prisma.payslip.delete({
      where: {
        id: fileId,
      },
    });
    console.log(deletedPayslip);
    const filePath = path.join(
      process.cwd(),
      "payslips/",
      deletedPayslip.year,
      deletedPayslip.month,
      deletedPayslip.filename
    );
    await fs.promises.unlink(filePath);
    // Serialize the payslips data to JSON
    const payslipsJson = JSON.stringify(deletedPayslip);

    return new NextResponse(payslipsJson);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
