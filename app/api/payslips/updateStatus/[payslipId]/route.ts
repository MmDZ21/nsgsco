import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import moment from "jalali-moment";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { payslipId: string } }
) => {
  const persianDate = moment().format("jYYYY/jMM/jDD"); // Example date: '1402/06/11'
  // Parse the Persian date
  const payslipId = params.payslipId;
  const data = await prisma.payslip.update({
    where: {
      id: payslipId,
    },
    data: {
      seen: true,
      firstSeen: persianDate,
    },
  });
  return new NextResponse(JSON.stringify(data));
};
