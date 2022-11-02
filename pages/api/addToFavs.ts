import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/db'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { id, phone } = req.body
        console.log(id, phone);
        
        const newFav = await prisma.userPhones.create({ data: { userId: id, phoneName: phone } })
        res.status(200).send(newFav)
    } catch (error) {
        res.status(500).send(error)
    }
}
