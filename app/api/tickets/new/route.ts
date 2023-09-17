import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  // Receive and validate data from the client
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const file = formData.get("file");
    const receiver =
      session.user.role === "ADMIN"
        ? (formData.get("receiver") as string)
        : null;
    if (!title || !body) {
      return new NextResponse("Title and body are required", { status: 400 });
    }

    let user = null;
    if (receiver) {
      user = await prisma.user.findUnique({
        where: {
          username: receiver,
        },
      });
    }
    // Create a new Request record and associate it with the user
    const ticket = await prisma.ticket.create({
      data: {
        title,
        unreadByAdmin: user ? false : true,
        unreadByUser: user ? true : false,
        status: user ? "REPLIED" : "NOREPLY",
        user: {
          connect: {
            id: user ? user?.id : session.user.id,
          },
        }, // Connect the ticket to the user
      },
    });
    const message = await prisma.message.create({
      data: {
        body,
        userId: session.user.id,
        ticketId: ticket.id,
      },
    });

    if (file) {
      const fileBlob = file as File;
      const fileName = path.parse(fileBlob.name).name;
      const fileExt = path.parse(fileBlob.name).ext;
      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
      console.log("file name: " + fileName);

      // Connect the created file to the message
      const uploadDir = path.join(
        process.cwd(),
        `${user ? "tickets/admin/" : "tickets/basic/"}`,
        ticket.id,
        message.id
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, fileBlob.name);
      const createdFile = await prisma.file.create({
        data: {
          path:
            `${user ? "tickets/admin/" : "tickets/basic/"}` +
            ticket.id +
            "/" +
            message.id,
          name: fileName,
          ext: fileExt,
          Message: { connect: { id: message.id } },
        },
      });
      await writeFile(uploadPath, fileBuffer);
    }

    return new NextResponse(JSON.stringify(ticket), { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
