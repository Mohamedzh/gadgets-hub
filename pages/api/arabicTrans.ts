import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 } from '@google-cloud/translate'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { Translate } = v2

    async function transArabic(text: string, target: string) {
        const projectId = 'gadgets-hub-368213';
        const credentials = JSON.parse(
            Buffer.from(process.env.TRANSLATE_KEY!, 'base64').toString()
        )
        const translate = new Translate({ projectId, credentials });
        const [translation] = await translate.translate(text, target);
        return translation
    }
    try {

        const { currentPhone } = req.body
        let newPhone;
        for (let i = 0; i < currentPhone.PhoneQuickSpecs.length; i++) {
            currentPhone.PhoneQuickSpecs[i].value = await transArabic(currentPhone.PhoneQuickSpecs[i].value, 'ar')
            if (currentPhone.PhoneQuickSpecs[i].quickspecName === 'OS') {
                currentPhone.PhoneQuickSpecs[i].quickspecName = 'نظام التشغيل'
            } else {
                currentPhone.PhoneQuickSpecs[i].quickspecName = await transArabic(currentPhone.PhoneQuickSpecs[i].quickspecName, 'ar')
            }
        }
        for (let j = 0; j < currentPhone.PhoneSpecs.length; j++) {
            currentPhone.PhoneSpecs[j].spec.categoryName = await transArabic(currentPhone.PhoneSpecs[j].spec.categoryName, 'ar')
            currentPhone.PhoneSpecs[j].spec.name = await transArabic(currentPhone.PhoneSpecs[j].spec.name, 'ar')
            currentPhone.PhoneSpecs[j].value = await transArabic(currentPhone.PhoneSpecs[j].value, 'ar')
        }

        res.status(200).send(newPhone)
    } catch (error) {
        res.status(500).send(error)
    }
}
