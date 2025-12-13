import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
    try {
        console.log("PDF ROUTE HIT");
        const form = await req.formData();
        const html = form.get("html");

        if (!html) {
            return NextResponse.json({ error: "HTML missing" }, { status: 400 });
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        const buffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        return new NextResponse(buffer, {
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
