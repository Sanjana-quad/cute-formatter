export async function GET() {
  return new Response("KEY=" + process.env.OPENAI_API_KEY);
}
