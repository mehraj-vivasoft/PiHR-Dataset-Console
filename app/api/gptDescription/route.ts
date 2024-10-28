import OpenAI from "openai";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

const getGptDescription = async (
  tableData: string,
  prefixMessage: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not defined in the environment variables"
    );
  }

  console.log("api key : ", apiKey);

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert in PiHR which is a SaaS based fully integrated HR and payroll software management system and You can generate Table Description for PiHR Database",
      },
      {
        role: "user",
        content:
          "Here is the schema details of the table: " +
          tableData +
          ".\n\n Please generate and just return the description for this table by appending the description from the prefix below: \n\n " +
          prefixMessage,
      },
    ],
  });

  return completion.choices[0].message.content || "";
};

export async function POST(req: NextRequest) {
  const { tableData, prefixMessage } = await req.json();

  if (typeof tableData !== "string" || typeof prefixMessage !== "string") {
    return NextResponse.json(
      { error: "tableData and prefixMessage needs to be a string" },
      { status: 400 }
    );
  }

  try {
    const description = await getGptDescription(tableData, prefixMessage);
    return NextResponse.json({ description }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
