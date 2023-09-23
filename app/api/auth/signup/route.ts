import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.username || !data.password) {
      return new NextResponse("Invalid username or password", { status: 400 });
    }

    // Check if the user already exists

    const userExists = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (userExists) {
      throw new Error("User already exists");
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error during signup:", error);
    return new NextResponse("An error occurred during signup", { status: 500 });
  }
}
