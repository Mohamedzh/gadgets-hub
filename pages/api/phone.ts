import type { NextApiRequest, NextApiResponse } from "next";
import { getPhoneDetails } from "../../lib/phoneDetails";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name } = req.query;
    const current = await getPhoneDetails(name as string);

    res.status(200).json({ phone: current });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
