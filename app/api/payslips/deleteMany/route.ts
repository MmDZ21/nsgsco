import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { Item } from "@radix-ui/react-dropdown-menu";
export const DELETE = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("عدم دسترسی", { status: 403 });
  }
  const items = await req.json();
  try {
    const deletedPayslips = await prisma.payslip.findMany({
      where: {
        id: {
          in: items,
        },
      },
    });
    const deletedCount = await prisma.payslip.deleteMany({
      where: {
        id: {
          in: items,
        },
      },
    });
    console.log(deletedPayslips);
    deletedPayslips.forEach((dp) => {
      const filePath = path.join(
        process.cwd(),
        "payslips/",
        dp.year,
        dp.month,
        dp.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${filePath} deleted`);
      });
    });
    // Serialize the payslips data to JSON
    const payslipsJson = JSON.stringify(deletedCount);

    return new NextResponse(payslipsJson);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
