import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title || !body) {
      return new NextResponse("Title and body are required", { status: 400 });
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        title,
        body,
        user: { connect: { id: session.user.id } }, // Connect the ticket to the user
        unread: true,
      },
    });

    return new NextResponse(JSON.stringify(suggestion), { status: 201 });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
