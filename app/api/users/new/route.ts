import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("عدم دسترسی", { status: 403 });
  }
  const min = 100000;
  const max = 999999;
  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const departmentId = formData.get("departmentId") as string;
    const username = formData.get("username") as string;
    const isAdmin = formData.get("isAdmin") as string;
    const phone = formData.get("phone")
      ? (formData.get("phone") as string)
      : "";

    if (!username || !name || !departmentId) {
      return new NextResponse("Invalid username or name or department", {
        status: 400,
      });
    }

    // Check if the user already exists

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userExists) {
      throw new Error("User already exists");
    }

    // Create the user
    const password = String(getRndInteger(min, max));
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        phone,
        password: hashedPassword,
        departmentId,
        temporaryPassword: password,
        role: isAdmin === "true" ? "ADMIN" : "BASIC",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error during signup:", error);
    return new NextResponse("An error occurred during signup", { status: 500 });
  }
}
