import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) => {
  const session = await getServerSession(authOptions);

  const ticketId = params.ticketId;
  if (session) {
    const userRole = session.user.role;
    if (userRole === "ADMIN") {
      const data = await prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          unreadByAdmin: false,
        },
      });
      return new NextResponse(JSON.stringify(data));
    } else {
      const data = await prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          unreadByUser: false,
        },
      });
      return new NextResponse(JSON.stringify(data));
    }
  }
};
