import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  console.log(params);

  const { ticketId } = params; // Destructure the ticketId from params

  if (!ticketId) {
    // Handle the case where ticketId is undefined or not provided
    return new NextResponse("Ticket ID is missing", { status: 400 });
  }
  // Receive and validate data from the client
  try {
    const messages = await prisma.message.findMany({
      where: {
        ticketId: ticketId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(messages);

    const responseBody = JSON.stringify(messages); // Convert to JSON
    return new NextResponse(responseBody, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
