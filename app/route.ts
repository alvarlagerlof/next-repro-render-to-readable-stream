import { ReactNode } from "react";

export const runtime = "edge";

export async function GET() {
  const string = await renderToString("hello world");

  return new Response(string);
}

export async function renderToString(element: ReactNode): Promise<string> {
  const test = await import("react-dom/server");

  const stream = await test.renderToReadableStream(element);
  const textStream = stream.pipeThrough(new TextDecoderStream());
  const reader = textStream.getReader();

  let result = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += value;
  }
  return result;
}
