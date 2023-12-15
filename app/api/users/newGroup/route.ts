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
    const { users: newUsers, departmentId } = (await req.json()) as {
      users: any[];
      departmentId: string;
    };

    if (!newUsers.length || !departmentId) {
      return new NextResponse("Invalid username or name or department", {
        status: 400,
      });
    }
    // Fetch existing users
    const existingUsers = await prisma.user.findMany({
      where: {
        // Assuming 'username' is the unique identifier field
        username: {
          in: newUsers.map((user) => user.username),
        },
      },
      select: {
        username: true,
      },
    });

    const existingUsernames = existingUsers.map((user) => user.username);

    // Filter new users that don't exist in the database
    const uniqueNewUsers = newUsers.filter(
      (user) => !existingUsernames.includes(user.username)
    );

    if (uniqueNewUsers.length === 0) {
      return new NextResponse("همه کاربران ثبت شده‌اند", { status: 400 });
    }

    const min = 100000;
    const max = 999999;

    // Generate passwords and prepare users for insertion
    const preparedNewUsers = await Promise.all(
      uniqueNewUsers.map(async (user) => {
        const password = String(getRndInteger(min, max));
        const hashedPassword = await bcrypt.hash(password, 10);

        return {
          ...user,
          password: hashedPassword,
          temporaryPassword: password,
          departmentId,
        };
      })
    );

    // Insert only the new unique users
    await prisma.user.createMany({
      data: preparedNewUsers,
    });

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.error("Error during signup:", error);
    return new NextResponse("An error occurred during signup", { status: 500 });
  }
}
