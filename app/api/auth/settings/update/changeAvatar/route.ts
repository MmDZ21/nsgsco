import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

export const PATCH = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const prevFile = formData.get("prevFile") as string;
    if (!file) {
      return NextResponse.json(
        { error: "عکس به درستی آپلود نشده" },
        { status: 400 }
      );
    }

    const fileBlob = file as File;
    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
    console.log("file name: " + path.parse(fileBlob.name).name);
    const uploadDir = path.join(
      process.cwd(),
      "public/assets/img/profiles",
      session.user.id
    );
    console.log("upload dir: ", uploadDir);
    const uploadPath = path.join(uploadDir, fileBlob.name);
    console.log("upload path: ", uploadPath);

    if (prevFile) {
      await fs.promises.unlink(path.join(process.cwd(), "public", prevFile));
    }
    fs.mkdirSync(uploadDir, { recursive: true });

    await writeFile(uploadPath, fileBuffer);

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: "/assets/img/profiles/" + session.user.id + "/" + fileBlob.name,
      },
    });
    return new NextResponse(user.image, { status: 200 });
  } catch (error) {
    console.error("Error changing avatar:", error);
    return new NextResponse("An error occurred during changing avatar", {
      status: 500,
    });
  }
};
