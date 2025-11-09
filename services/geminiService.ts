import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiSubTask, PlannableValidationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const breakdownSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            task: {
                type: Type.STRING,
                description: "תת-משימה בודדת וניתנת לביצוע.",
            },
        },
        required: ["task"],
    },
};

const validationSchema = {
    type: Type.OBJECT,
    properties: {
        isPlannable: {
            type: Type.BOOLEAN,
            description: "האם הטקסט הוא משימה שניתן לתכנן ולפרק לשלבים?",
        },
        reason: {
            type: Type.STRING,
            description: "סיבה קצרה מדוע הטקסט אינו משימה ניתנת לתכנון (אם רלוונטי).",
        },
    },
    required: ["isPlannable", "reason"],
};


export const isTaskPlannable = async (taskText: string): Promise<PlannableValidationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `בדוק את הטקסט הבא וקבע אם הוא מייצג משימה שניתן לתכנן ולפרק לתתי-שלבים. אל תפרק את המשימה, רק תנתח אותה.
      - משימה טובה: "לנקות את המוסך", "לתכנן טיול", "ללמוד React".
      - קלט לא טוב: "מהי בירת צרפת?", "אני אוהב פיצה", "כמה זה 2+2?".
      
      הטקסט לבדיקה: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
        temperature: 0.1,
      },
    });

    const jsonString = response.text.trim();
     if (!jsonString) {
        throw new Error("Validation model returned empty response.");
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error calling Gemini API for validation:", error);
    throw new Error("Could not validate the task with the AI model.");
  }
};


export const breakDownTask = async (mainTask: string): Promise<GeminiSubTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `פרק את המשימה הראשית הבאה לתתי-משימות קטנות. כל תת-משימה צריכה להיות פעולה ספציפית שניתן להשלים תוך כ-2 דקות. המשימות צריכות להיות בסדר הגיוני שמוביל להשלמת המשימה הגדולה.

המשימה הראשית היא: "${mainTask}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: breakdownSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
        console.error("Gemini API returned an empty response for breakdown.");
        return [];
    }

    const parsedResponse: GeminiSubTask[] = JSON.parse(jsonString);
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API for breakdown:", error);
    throw new Error("Could not get a valid response from the AI model for breakdown.");
  }
};