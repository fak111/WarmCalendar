import { GoogleGenAI } from "@google/genai";
import { DayStatus } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateDailyAdvice = async (
  status: DayStatus,
  partnerName: string
): Promise<{ title: string; content: string; actionItem: string }> => {
  const client = getClient();
  
  // Fallback if no API key
  if (!client) {
    if (status.isPeriod) return { title: "特殊时期", content: "她今天身体不适，多点耐心。", actionItem: "煮红糖姜茶" };
    if (status.isPeriodPrep) return { title: "即将到来", content: "她快来例假了，情绪可能波动。", actionItem: "检查暖宝宝库存" };
    if (status.isAnniversary) return { title: "重要日子", content: `今天是${status.anniversaryName}！`, actionItem: "准备惊喜" };
    return { title: "日常关怀", content: "平淡的日子也要有爱。", actionItem: "无论如何，说句我爱你" };
  }

  let promptContext = "";
  if (status.isPeriod) promptContext = "Partner is on her period (Day 1-5). Needs care, warmth, chocolate.";
  else if (status.isPeriodPrep) promptContext = "Partner is 1-3 days before period. PMS symptoms, irritability, bloating. Needs preparation.";
  else if (status.isPeriodRecovery) promptContext = "Partner is recovering from period. Needs iron-rich food.";
  else if (status.isAnniversary) promptContext = `Today is a special anniversary: ${status.anniversaryName}. Needs celebration.`;
  else promptContext = "A normal day. Needs general relationship maintenance.";

  const prompt = `
    You are a relationship assistant for a man caring for his partner named ${partnerName}.
    Context: ${promptContext}
    
    Generate a JSON response with:
    1. title: Short 2-4 word punchy title (Chinese).
    2. content: A warm, empathetic 1-sentence tip (Chinese).
    3. actionItem: A specific, executable task (e.g., "Buy hot cocoa", "Book dinner") (Chinese).
    
    Return ONLY raw JSON.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error", error);
     return { title: "温馨提示", content: "陪伴是最长情的告白。", actionItem: "给个拥抱" };
  }
};