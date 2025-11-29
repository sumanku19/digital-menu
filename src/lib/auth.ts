import { cookies } from "next/headers";
import { db } from "../server/db";

export async function getSessionUser() {
  const sessionId = (await cookies()).get("sessionUser")?.value;

  if (!sessionId) return null;

  const user = await db.user.findUnique({
    where: { id: sessionId },
  });

  return user;
}
