import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { googleTranslateApiArray } from "../../lib/translationsAPI";
import { ReviewType } from "../../types";
import { getReviewDate } from "../../lib/functions";

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
    const reviewTitles = currentReviews.map((review) => review.title);
    const translatedTitle = await googleTranslateApiArray(reviewTitles);

    let arReviews: ReviewType[] = [];
    for (let y = 0; y < currentReviews.length; y++) {
      arReviews.push({
        ...currentReviews[y],
        newReviewDate: getReviewDate(currentReviews[y].reviewDate),
        arTitle: translatedTitle[y],
      });
    }
    return res.status(200).send(arReviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
