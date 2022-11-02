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
        const { id, name } = req.body
        const users = await prisma.user.findMany({ select: { nickName: true } })
        if (users.includes(name)) {
            res.status(500).send('Nickname already exists. Please use another name')
        } else {
            const updatedUser = await prisma.user.update({ where: { id }, data: { nickName: name } })
            res.status(200).send('Nickname updated successfully')
        }
    } catch (error) {
        res.status(500).send(error)
    }
}
