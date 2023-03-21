import * as cheerio from "cheerio";
import axios from "axios";
import { SpecDetailType, SpecsType } from "../types";
import { stringInsert, stringReplace } from "./functions";

export const getPhoneDetails = async (phoneUrl: string) => {
  const res = await axios.get(`https://www.gsmarena.com/${phoneUrl}.php`);
  const html = res.data;
  const $ = cheerio.load(html);

  const display_size = $("span[data-spec=displaysize-hl]").text();
  const display_res = $("div[data-spec=displayres-hl]").text();
  const camera_pixels = $(".accent-camera").text();
  const video_pixels = $("div[data-spec=videopixels-hl]").text();
  const ram_size = $(".accent-expansion").text();
  const chipset = $("div[data-spec=chipset-hl]").text();
  const battery_size = $(".accent-battery").text();
  const battery_type = $("div[data-spec=battype-hl]").text();

  const quick_spec = [];
  quick_spec.push({ name: "Display size", value: display_size });
  quick_spec.push({ name: "Display resolution", value: display_res });
  quick_spec.push({ name: "Camera pixels", value: camera_pixels });
  quick_spec.push({ name: "Video pixels", value: video_pixels });
  quick_spec.push({ name: "RAM size", value: ram_size });
  quick_spec.push({ name: "Chipset", value: chipset });
  quick_spec.push({ name: "Battery size", value: battery_size });
  quick_spec.push({ name: "Battery type", value: battery_type });

  const title = $(".specs-phone-name-title").text();

  const imgUrl = $(".specs-photo-main a img").attr("src");
  const brand = imgUrl?.slice(
    imgUrl?.indexOf("bigpic") + 7,
    imgUrl.indexOf("-", imgUrl?.indexOf("bigpic"))
  );
  let img = imgUrl;
  if (imgUrl) {
    img = stringInsert(imgUrl, imgUrl?.lastIndexOf("."), "-1");
    img = stringReplace(
      img,
      img.indexOf("bigpic"),
      img.indexOf("bigpic") + 6,
      "pics/" + brand
    );
  }

  const urlImg = $(".specs-photo-main a").attr("href");
  const url = phoneUrl;

  const specNode = $("table");
  const spec_detail: SpecDetailType[] = [];
  specNode.each((i, el) => {
    const specList: SpecsType[] = [];
    const category = $(el).find("th").text();
    const specN = $(el).find("tr");
    specN.each((index, ele) => {
      const a = {
        name: $("td.ttl", ele).text(),
        value: $("td.nfo", ele).text(),
      };
      specList.push(a);
    });
    if (category) {
      spec_detail.push({
        category: category,
        specs: specList,
      });
    }
  });

  return {
    title,
    img,
    urlImg,
    url,
    specDetails: spec_detail,
    quickSpecs: quick_spec,
  };
};
