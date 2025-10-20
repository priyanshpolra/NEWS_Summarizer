import fetch from "node-fetch";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event)); // Debug incoming request

  // Handle preflight OPTIONS request for CORS
  if (event?.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: "",
    };
  }

  let newsUrl = "";
  try {
    if (event.body) {
      // Parse string or object body safely
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      newsUrl = body.url;
    }
  } catch (err) {
    console.error("Error parsing request body:", err);
  }

  if (!newsUrl) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Please provide a URL" }),
    };
  }

  try {
    // Fetch the article text
    const res = await fetch(`https://r.jina.ai/${newsUrl}`);
    if (!res.ok) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Failed to extract article text" }),
      };
    }

    const articleText = await res.text();

    // Prepare prompt for OpenAI
    const prompt = `Summarize the following news article in 3 concise sentences:\n\n${articleText.slice(
      0,
      8000
    )}`;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary: completion.output_text.trim() }),
    };
  } catch (err) {
    console.error("Internal error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
