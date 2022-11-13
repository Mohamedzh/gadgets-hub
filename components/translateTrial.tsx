import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import  Translate  from '@google-cloud/translate'
const { Translate } = require('@google-cloud/translate').v2;

type Props = {}

function TranslateTrial({ }: Props) {

    // const translate = async (text: string) => {
    //     let res = await axios.post(
    //         `https://translation.googleapis.com/language/translate/v2?key=${process.env.API_KEY}`,
    //         { q: text, target: "tr" }
    //     );
    //     let translation = res.data.data.translations[0].translatedText;
    //     setTrans(translation)

    //     return translation;
    // }

    // const [trans, setTrans] = useState<string>()
    // useEffect(() => {
    //     translate('hello')
    // }, [])

    // const currentTranslation = translate('Hello')
    //     let translationResult;
    //     /**
    //  * TODO(developer): Uncomment the following line before running the sample.
    //  */
    //     const projectId = 'gadgets-hub-368213';

    //     // Instantiates a client
    //     const translate = new Translate({ projectId, key: process.env.API_Key });

    //     async function quickStart() {
    //         // The text to translate
    //         const text = 'Hello, world!';

    //         // The target language
    //         const target = 'ru';

    //         // Translates some text into Russian
    //         const [translation] = await translate.translate(text, target);
    //         console.log(`Text: ${text}`);
    //         console.log(`Translation: ${translation}`);

    //         translationResult = translation
    //     }

    //     quickStart();

    return (
        <div>
            {/* <p>{trans}</p> */}
        </div>
    )
}

export default TranslateTrial