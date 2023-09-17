import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }

  try {
    const suggestion = await prisma.suggestion.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        uploadDate: "desc",
      },
    });
    const responseBody = JSON.stringify(suggestion); // Convert to JSON
    return new NextResponse(responseBody, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting suggestion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
