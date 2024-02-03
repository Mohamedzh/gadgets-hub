import axios from "axios";
import { v2 } from "@google-cloud/translate";
import { translate } from "@vitalets/google-translate-api";

const { Translate } = v2;

export async function transArabic(text: string, target: string) {
  const projectId = "gadgets-hub-368213";
  const credentials = JSON.parse(
    Buffer.from(process.env.TRANSLATE_KEY!, "base64").toString()
  );
  const translate = new Translate({ projectId, credentials });
  const [translation] = await translate.translate(text, target);
  return translation;
}

// export const microsoftTranslator = async (text: string) => {
//   let translatedText = [];
//   const options = {
//     method: "POST",
//     url: "https://microsoft-translator-text.p.rapidapi.com/translate",
//     params: {
//       "to[0]": "ar",
//       "api-version": "3.0",
//       profanityAction: "NoAction",
//       textType: "plain",
//     },
//     headers: {
//       "Content-Type": "application/json",
//       "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//       "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
//     },
//     data: `[{"Text":"${text}"}]`,
//   };

//   const res = await axios.request(options);
//   translatedText = res.data;
//   console.log(translatedText[0].translations[0].text);
//   return translatedText[0].translations[0].text;
// };

// export const translateText = async (text: string) => {
//   const res = await microsoftTranslator(text);
//   return res;
// };

// export const googleTranslator = async (arr: string[]) => {
//   const options = {
//     method: "POST",
//     url: "https://google-translator9.p.rapidapi.com/v2",
//     headers: {
//       "content-type": "application/json",
//       "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//       "X-RapidAPI-Host": "google-translator9.p.rapidapi.com",
//     },
//     data: `{"q":${JSON.stringify(
//       arr
//     )},"source":"en","target":"ar","format":"text"}`,
//   };

//   const res = await axios.request(options);
//   const translatedText = res.data;

//   return translatedText.data.translations;
// };

export const googleTranslateApiFree = async (subject: string) => {
  const { text } = await translate(subject, { to: "ar" });
  return text;
};

export const googleTranslateApi = async (subject: string) => {
  const text = await transArabic(subject, "ar");
  return text;
};

export const googleTranslateApiArray = async (textArray: string[]) => {
  const resultsArr: string[] = [];
  for (const snippet of textArray) {
    const text = await transArabic(snippet, "ar");
    resultsArr.push(text);
  }
  return resultsArr;
};
