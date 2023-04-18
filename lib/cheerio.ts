import axios from "axios";
import * as cheerio from "cheerio";
import {
  BrandPhone,
  NewsType,
  Page,
  PageData,
  PhoneSpec,
  QuickSpecs,
  ReviewType,
  Spec,
  SpecDetail,
} from "../types";
import { prisma } from "./db";
import wretch from "wretch";
import { Phone } from "@prisma/client";

type newBrand = {
  name: string;
  phonesNum: number;
  gsmArenaUrl: string;
};

export const getPages = async (url: string) => {
  const res = await axios.get(`https://www.gsmarena.com/${url}.php`);
  let html = res.data;

  const $ = cheerio.load(html);

  const pagesData: { number: number }[] = [];
  const pages = $(".review-nav .nav-pages").find("a, strong");
  pages.each((i, el) => {
    const page: Page = {
      number: parseInt($(el).text()),
    };
    if (el.name !== "strong") {
      page.url = $(el).attr("href")?.replace(".php", "");
    } else {
      page.url = `${url}`;

      page.active = true;
    }
    pagesData.push(page);
  });

  let nextPage = $("a.pages-next").attr("href");
  if (nextPage) {
    if (nextPage.indexOf("#") >= 0) {
      nextPage = "";
    } else {
      nextPage = nextPage.replace(".php", "");
    }
  }

  let prevPage = $("a.pages-prev").attr("href");
  if (prevPage) {
    if (prevPage.indexOf("#") >= 0) {
      prevPage = "";
    } else {
      prevPage = prevPage.replace(".php", "");
    }
  }

  const data: PageData = {
    prev: "",
    next: "",
    pages: [],
  };

  if (prevPage) {
    data.prev = prevPage;
  }
  if (nextPage) {
    data.next = nextPage;
  }

  if (pagesData.length) {
    data.pages = pagesData;
  }

  return data;
};

//Create/update quickspecs in the db
export const updateQuickSpecs = async (quick_spec: QuickSpecs[]) => {
  let qSpecs = quick_spec.map((spec) => {
    return { name: spec.name };
  });
  await prisma.quickSpec.createMany({ data: qSpecs, skipDuplicates: true });
};

//Create/ update categories in the db
export const updateCategories = async (spec_detail: SpecDetail[]) => {
  for (let i = 0; i < spec_detail.length; i++) {
    await prisma.category.create({ data: { name: spec_detail[i].category } });
  }
};

//Create/update specs in the db
export const updateSpecs = async (spec_detail: SpecDetail[]) => {
  let newSpecs: { name: string; categoryName: string; alias: string }[] = [];
  for (let i = 0; i < spec_detail.length; i++) {
    spec_detail[i].specs.map((spec) =>
      newSpecs.push({
        name: spec.name,
        categoryName: spec_detail[i].category,
        alias: spec.alias,
      })
    );
  }
  await prisma.spec.createMany({ data: newSpecs, skipDuplicates: true });
};

export const getLatestNews = async () => {
  const res = await axios.get("https://www.gsmarena.com/news.php3");
  let html = res.data;
  const $ = cheerio.load(html);

  let allNews: NewsType[] = [];
  const news = $(".news-item");
  news.each((i, el) => {
    const title = $(el).find("h3").text();
    const body = $(el).find("p").text();
    const link = $(el).find("a").attr("href") || "";
    const imgUrl = $(el).find("img").attr("src") || "";
    const imgAlt = $(el).find("img").attr("alt") || "";
    const newsDate = $(el).find(".meta-line").find("span").text();
    allNews.push({ title, body, link, imgUrl, imgAlt, newsDate });
  });
  return allNews;
};

export const getLatestReviews = async () => {
  const brands = await prisma.brand.findMany({ select: { name: true } });

  let newReviews: ReviewType[] = [];
  const api = wretch("https://www.gsmarena.com/", { mode: "cors" })
    .errorType("text")
    .resolve((r) => r);

  const data = api.get(`reviews.php3?iPage=1`);
  let res = await data.text();
  let html = res;
  const $ = cheerio.load(html);

  let reviewsTag = $(".review-item");
  reviewsTag.each((i, el) => {
    const title = $(el).find("h3").text();
    const link = $(el).find("a").attr("href");
    const imgUrl = $(el).find("img").attr("src");
    const reviewDate = $(el).find(".meta-line").find("span").text();
    let extractedBrand = title.slice(0, title.indexOf(" ")).toLowerCase();
    let brandName;
    if (brands.find((brand) => brand.name === extractedBrand)) {
      brandName = extractedBrand;
    } else if (extractedBrand === "poco") {
      brandName = "xiaomi";
    } else if (extractedBrand === "iqoo") {
      brandName = "vivo";
    } else if (extractedBrand === "nubia") {
      brandName = "zte";
    }
    link &&
      imgUrl &&
      newReviews.push({
        title,
        link,
        imgUrl,
        reviewDate,
        brandName: brandName || "",
      });
  });
  return newReviews;
};

export const getAllBrandNames = async () => {
  const res = await axios.get("https://www.gsmarena.com/makers.php3");
  let html = res.data;
  const $ = cheerio.load(html);
  const json: newBrand[] = [];
  const brands = $("table").find("td");
  brands.each((i, el) => {
    const aBlock = $(el).find("a");
    const brand = {
      name: aBlock.text().replace(" devices", "").replace(/[0-9]/g, ""),
      phonesNum: Number($(el).find("span").text().replace(" devices", "")),
      gsmArenaUrl: aBlock.attr("href")!.replace(".php", ""),
    };
    json.push(brand);
  });

  let allBrands = json.map((brand) => {
    return { ...brand, name: brand.name.toLowerCase() };
  });

  return allBrands;
};

export const getBrandsDetails = async () => {
  let brands = await prisma.brand.findMany();
  let urls = brands.map((item) => {
    return item.gsmArenaUrl;
  });

  let t = 0;
  for (let i = 0; i < urls.length; i++) {
    t++;
    setTimeout(async () => {
      const res = await axios.get(`https://www.gsmarena.com/${urls[i]}.php`);
      let html = res.data;
      const $ = cheerio.load(html);

      const data: PageData = await getPages(urls[i]);

      const json: BrandPhone[] = [];

      if (data.pages.length > 0) {
        for (let j = 0; j < data.pages.length; j++) {
          setTimeout(async () => {
            const res = await axios.get(
              `https://www.gsmarena.com/${data.pages[j].url}.php`
            );
            let html = res.data;

            const $ = cheerio.load(html);

            const phones = $(".makers").find("li");
            phones.each((l, el) => {
              const imgBlock = $(el).find("img");
              const phone = {
                name: $(el).find("span").text(),
                imgUrl: imgBlock.attr("src")!,
                url: $(el).find("a").attr("href")!.replace(".php", ""),
                description: imgBlock.attr("title")!,
                year: Number(
                  imgBlock
                    ?.attr("title")
                    ?.slice(
                      imgBlock?.attr("title")?.indexOf("Announced")! + 14,
                      imgBlock?.attr("title")?.indexOf("Announced")! + 18
                    )
                ),
              };
              if (phone.year > 2018) {
                json.push(phone);
              }
            });
            if (j === data.pages.length - 1) {
              let brandArray = urls[i].split("-");
              brandArray.splice(-2);
              let brandString = brandArray.join();
              let detailedPhone = json.map((phone) => {
                return { ...phone, brandName: brandString };
              });

              await prisma.phone.createMany({
                data: detailedPhone,
                skipDuplicates: true,
              });
            }
          }, 1000 * (t + 2));
        }
      } else {
        const phones = $(".makers").find("li");
        phones.each((i, el) => {
          const imgBlock = $(el).find("img");
          const yearDesc = imgBlock
            .attr("title")
            ?.slice(0, imgBlock.attr("title")?.indexOf("Features"));
          const phone = {
            name: $(el).find("span").text(),
            imgUrl: imgBlock.attr("src")!,
            url: $(el).find("a").attr("href")!.replace(".php", ""),
            description: imgBlock.attr("title")!,
            year: Number(
              yearDesc!.slice(
                yearDesc?.indexOf("20", 20),
                yearDesc?.indexOf("20", 20)! + 4
              )
            ),
          };
          if (phone.year > 2018) {
            json.push(phone);
          }
        });
        let brandArray = urls[i].split("-");
        brandArray.splice(-2);
        let brandString = brandArray.join();
        let detailedPhone = json.map((phone) => {
          return { ...phone, brandName: brandString };
        });

        await prisma.phone.createMany({
          data: detailedPhone,
          skipDuplicates: true,
        });
      }
    }, 1000 * (t + 10));
  }
};

export const getAllPhonesDetails = async (
  min: number,
  max: number,
  allPhones: Phone[]
) => {
  let j = 0;

  for (let i = min; i < max; i++) {
    j++;
    setTimeout(async () => {
      const res = await axios.get(
        `https://www.gsmarena.com/${allPhones[i].url}.php`,
        { headers: { "User-Agent": "request" } }
      );
      let html = res.data;
      const $ = cheerio.load(html);
      const release_date = $("span[data-spec=released-hl]").text();
      const operating_system = $("span[data-spec=os-hl]").text();
      const display_size = $("span[data-spec=displaysize-hl]").text();
      const display_res = $("div[data-spec=displayres-hl]").text();
      const camera_pixels = $(".accent-camera").text();
      const video_pixels = $("div[data-spec=videopixels-hl]").text();
      const ram_size = $(".accent-expansion").text();
      const chipset = $("div[data-spec=chipset-hl]").text();
      const battery_size = $(".accent-battery").text();
      const battery_type = $("div[data-spec=battype-hl]").text();

      const quick_spec = [];

      quick_spec.push({ name: "Release date", value: release_date });
      quick_spec.push({ name: "OS", value: operating_system });
      quick_spec.push({ name: "Display size", value: display_size });
      quick_spec.push({ name: "Display resolution", value: display_res });
      quick_spec.push({ name: "Camera pixels", value: camera_pixels });
      quick_spec.push({ name: "Video pixels", value: video_pixels });
      quick_spec.push({ name: "RAM size", value: ram_size });
      quick_spec.push({ name: "Chipset", value: chipset });
      quick_spec.push({ name: "Battery size", value: battery_size });
      quick_spec.push({ name: "Battery type", value: battery_type });

      const title = $(".specs-phone-name-title").text();
      const img = $(".specs-photo-main a img").attr("src");
      const img_url = $(".specs-photo-main a").attr("href");

      let allSpecs: Spec[] = [];
      let price: string = "0";
      const specNode = $("table");

      const spec_detail: SpecDetail[] = [];
      specNode.each((i, el) => {
        const specList: Spec[] = [];
        const category = $(el).find("th").text();
        const specN = $(el).find("tr");
        specN.each((index, ele) => {
          const a = {
            name: $("td.ttl", ele).text(),
            value: $("td.nfo", ele).text(),
            alias: `${category}${index}`,
          };

          specList.push(a);
          if (a.value.length > 0) {
            allSpecs.push(a);
          }
          if (a.name === "Price") {
            price = a.value;
          }
        });
        if (category) {
          spec_detail.push({
            category: category,
            specs: specList,
          });
        }
      });

      let phoneSpecs: PhoneSpec[] = allSpecs.map((spec) => {
        return {
          value: spec.value,
          specAlias: spec.alias,
          phoneId: allPhones[i].id,
        };
      });

      let qSpecs = quick_spec.map((spec) => {
        return {
          value: spec.value,
          phoneId: allPhones[i].id,
          quickspecName: spec.name,
        };
      });
      await prisma.phoneQuickSpecs.createMany({
        data: qSpecs,
        skipDuplicates: true,
      });

      updateSpecs(spec_detail);

      let usdPrice = Math.round(
        Number(
          price
            .slice(price.indexOf("$") + 2, price.indexOf("/") - 2)
            .replace(",", "")
        )
      );
      let euroPrice = Math.round(
        Number(
          price
            .slice(
              price.indexOf("€") + 2,
              price.indexOf("/", price.indexOf("€") + 2) - 2
            )
            .replace(",", "")
        )
      );
      let gbpPrice = Math.round(
        Number(
          price
            .slice(
              price.indexOf("£") + 2,
              price.indexOf("/", price.indexOf("£") + 2) - 2
            )
            .replace(",", "")
        )
      );
      let indianPrice = Math.round(
        Number(price.slice(price.indexOf("₹") + 2).replace(",", ""))
      );
      let uniPrice: number;
      if (price.indexOf("About") === 0) {
        uniPrice = Number(price.slice(6, price.indexOf(" ", 6)));
        if (uniPrice > 0) {
          await prisma.eURPrice.create({
            data: { phoneId: allPhones[i].id, value: uniPrice },
          });
        }
      }

      if (usdPrice > 0) {
        await prisma.uSDPrice.create({
          data: { phoneId: allPhones[i].id, value: usdPrice },
        });
      }
      if (euroPrice > 0) {
        await prisma.eURPrice.create({
          data: { phoneId: allPhones[i].id, value: euroPrice },
        });
      }
      if (gbpPrice > 0) {
        await prisma.gBPPrice.create({
          data: { phoneId: allPhones[i].id, value: gbpPrice },
        });
      }
      if (indianPrice > 0) {
        await prisma.indianPrice.create({
          data: { phoneId: allPhones[i].id, value: indianPrice },
        });
      }

      await prisma.phoneSpecs.createMany({
        data: phoneSpecs,
        skipDuplicates: true,
      });

      console.log(i);
    }, 1000 * (j * 15));
  }
};

export const getLatestReviewsPics = async (reviews: ReviewType[]) => {
  for (let i = 0; i < reviews.length; i++) {
    reviews[i].imgUrl = reviews[i].imgUrl.replace("-347x151", "-1220x526");
  }
  return reviews;
};
