import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
const openai = new OpenAI();

async function* LLMGenerateResponse(content: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: content }],
    stream: true,
  });
  for await (const chunk of stream) {
    const contentChunk = chunk.choices[0]?.delta?.content || "";
    yield contentChunk; // Yield each chunk of content
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the JSON body
    const content = body.content; // Extract the content from the body

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of LLMGenerateResponse(content)) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });
    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error generating response from LLM:", error);
    return NextResponse.json({ message: "Error from server" }, { status: 500 });
  }
}
