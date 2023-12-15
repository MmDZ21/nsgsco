import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  // Receive and validate data from the client
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        user: {
          department: {
            active: true,
          },
        },
      },
      include: {
        messages: {
          include: {
            user: {
              select: {
                id: true,
                image: true,
                name: true,
                role: true,
                username: true,
                department: true,
              },
            },
            file: {
              select: {
                ext: true,
                id: true,
                messageId: true,
                name: true,
                path: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            role: true,
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const responseBody = JSON.stringify(tickets); // Convert to JSON
    return new NextResponse(responseBody, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
