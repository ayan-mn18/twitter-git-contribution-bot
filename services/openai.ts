import OpenAI from "openai";
import { OpenaiConfig } from "../config/config";


const openai = new OpenAI({apiKey: OpenaiConfig.apiKey});

export const generateAiResponse = async ({system, prompt}: {system:string, prompt: string}) => {
  return await openai.chat.completions.create({
    model: OpenaiConfig.model,
    messages: [
        {"role": 'system', "content": system},
        {"role": "user", "content": prompt}
    ]
});
}

