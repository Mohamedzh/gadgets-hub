import { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

interface NewHeader extends IncomingHttpHeaders {
  url: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = req.headers as NewHeader;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    const title = await page.$eval(
      "h1.article-info-name",
      (node: any) => node.innerText
    );
    const reviewBody = await page.$("div#review-body");
    let reviewHTML = await page.$eval(
      "div#review-body",
      (node) => node.innerHTML
    );

    await page.$eval("div#review-body", (node) => node.innerHTML)

    let body = await reviewBody?.$$eval("p", (nodes) =>
      nodes.map((node) => node.innerText)
    );
    let sourceLink;
    let sourceBlock = await page.$("p.article-source");
    if (sourceBlock) {
      sourceLink = await sourceBlock.$$eval("a", (nodes) =>
        nodes.map((node) => node.getAttribute("href"))
      );
    }
    await browser.close();
    res.status(200).json({ title, body, sourceLink, reviewHTML });
  } catch (error) {
    res.status(500).send(error);
  }
}
