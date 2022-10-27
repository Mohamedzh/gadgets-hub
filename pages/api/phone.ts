import { IncomingHttpHeaders } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/db'
import { DetailedPhone } from '../../types'

type Data = {
    phone?: DetailedPhone
    error?: unknown
    msg?: string
}

interface ExtendedRequest extends IncomingHttpHeaders {
    phoneName: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const { phoneName } = req.body
        // const { phoneName } = req.headers as ExtendedRequest
        const phone = await prisma.phone.findFirstOrThrow({ where: { name: phoneName }, include: { PhoneQuickSpecs: true, PhoneSpecs: { include: { spec: { include: { category: true } } } } } })
        if (phone) {
            res.status(200).json({ phone })
        } else {
            res.status(404).json({ msg: 'Phone not found' })
        }
    } catch (error) {
        res.status(500).json({ error })
    }

}
