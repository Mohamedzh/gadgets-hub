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
        const { id, email } = req.body
        const users = await prisma.user.findMany({ select: { email } })
        if (users.includes(email)) {
            res.status(500).send('Email already exists. Please use another email')
        } else {
            const updatedUser = await prisma.user.update({ where: { id }, data: { email } })
            res.status(200).send('Email updated successfully')
        }
    } catch (error) {
        res.status(500).send(error)
    }
}
