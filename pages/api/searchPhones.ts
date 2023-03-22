import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name } = req.query;
    const currentReviews = await prisma.phone.findMany({
      where: { name: { contains: name as string, mode:"insensitive" } },
      take: 4,
      select: { name: true, url: true, imgUrl: true },
    });
    return res.status(200).send(currentReviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
