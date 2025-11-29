import { db } from "~/server/db";

export async function GET(req: Request, { params }: any) {
  const data = await db.restaurant.findUnique({
    where: { id: params.id },
    include: {
      categories: {
        include: {
          dishes: {
            include: { dish: true }
          }
        }
      }
    }
  });

  return Response.json(data);
}
