import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page } = req.query;
    const currentReviews = await prisma.review.findMany({
      orderBy: { id: "desc" },
      skip: (Number(page) - 1) * 30,
      take: 30,
      select: { title: true, link: true, imgUrl: true, reviewDate: true },
    });
    return res.status(200).send(currentReviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
