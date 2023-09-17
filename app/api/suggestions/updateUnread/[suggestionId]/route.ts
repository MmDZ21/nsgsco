import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { suggestionId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role === "ADMIN") {
    const suggestionId = params.suggestionId;
    if (session) {
      const data = await prisma.suggestion.update({
        where: {
          id: suggestionId,
        },
        data: {
          unread: false,
        },
      });
      return new NextResponse(JSON.stringify(data));
    }
  }
  return new NextResponse();
};
