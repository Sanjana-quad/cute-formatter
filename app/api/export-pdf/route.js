import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req) {
  try {
    const form = await req.formData();
    const html = form.get("html");

    if (!html) {
      return NextResponse.json({ error: "No HTML provided" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cute-output.pdf",
      },
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}