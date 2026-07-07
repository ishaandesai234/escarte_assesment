import { GoogleGenAI } from "@google/genai";
import { db } from "./firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askTeachFlowAI(userPrompt: string) {
  try {
    // Fetch a snapshot of critical data for context
    // In a real high-scale app, we'd use function calling to fetch specific data.
    // For this operational tool, we'll provide a summarized context of today's operational state.
    
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    const enquiriesSnapshot = await getDocs(collection(db, "enquiries"));
    const studentsSnapshot = await getDocs(collection(db, "students"));
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    const batchesSnapshot = await getDocs(collection(db, "batches"));

    const context = {
      tasks: tasksSnapshot.docs.map(d => ({ ...d.data(), id: d.id })),
      enquiries: enquiriesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })),
      students: studentsSnapshot.docs.map(d => ({ ...d.data(), id: d.id })),
      attendance: attendanceSnapshot.docs.map(d => ({ ...d.data(), id: d.id })),
      batches: batchesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })),
      today: new Date().toISOString().split('T')[0]
    };

    const systemInstruction = `
      You are the TeachFlow AI Assistant for a Music School.
      Your job is to answer operational questions based on the provided live data.
      Data Context: ${JSON.stringify(context)}
      
      Guidelines:
      - ONLY answer based on the provided data.
      - If data is missing or doesn't exist, say "I don't have that information in the system yet."
      - Do NOT make things up or generate creative content.
      - Be professional, concise, and helpful.
      - Refer to students, batches, and teachers by their names as found in the data.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
