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
        const { name, nickName, email, id } = req.body
        const newUser = await prisma.user.create({ data: { name, nickName, email, id } })
        res.status(200).json({ user: newUser })
    } catch (error) {
        res.status(500).send(error)
    }
}
