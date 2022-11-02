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
        const { id } = req.body
        const currentUser = await prisma.user.findFirst({ where: { id }, include: { UserPhones: { include: { phone: true } } } })
        res.status(200).send(currentUser?.UserPhones)
    } catch (error) {
        res.status(500).send(error)
    }
}
