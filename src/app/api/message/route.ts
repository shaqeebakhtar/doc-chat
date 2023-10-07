import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import prisma from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) return new Response("UNAUTHORIZED", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("NOT_FOUND", { status: 404 });

  await prisma.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });
};
