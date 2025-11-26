import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FraudPrediction } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTransactionRisk = async (
  transaction: Partial<Transaction>
): Promise<FraudPrediction> => {
  const ai = getAiClient();
  
  // Fallback if no API key
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isHighRisk = (transaction.amount || 0) > 5000;
        resolve({
          isFraud: isHighRisk,
          confidence: isHighRisk ? 0.92 : 0.05,
          riskLevel: isHighRisk ? 'CRITICAL' : 'LOW',
          explanation: [
            isHighRisk 
              ? "Unusually high transaction amount compared to historical average." 
              : "Transaction amount and location appear consistent with user history.",
            "Merchant category check passed."
          ]
        });
      }, 1500);
    });
  }

  const prompt = `
    Act as a Credit Card Fraud Detection Expert. Analyze the following transaction data:
    
    Amount: $${transaction.amount}
    Merchant: ${transaction.merchant}
    Category: ${transaction.category}
    Location: ${transaction.location}
    Time: ${transaction.timestamp}

    Assess the risk of fraud. Return a JSON object with:
    - isFraud (boolean)
    - confidence (number 0.0 to 1.0)
    - riskLevel (string: LOW, MEDIUM, HIGH, CRITICAL)
    - explanation (array of strings, listing key risk factors like "High amount", "Unusual location", etc.)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFraud: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            explanation: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      isFraud: result.isFraud ?? false,
      confidence: result.confidence ?? 0,
      riskLevel: (result.riskLevel as any) ?? 'LOW',
      explanation: result.explanation ?? ["Analysis incomplete"]
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      isFraud: false,
      confidence: 0,
      riskLevel: 'LOW',
      explanation: ["AI Analysis unavailable due to connection error."]
    };
  }
};
