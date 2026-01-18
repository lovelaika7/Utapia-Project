import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to check for API key selection
export const checkApiKey = async (): Promise<boolean> => {
  const aiStudio = (window as any).aistudio;
  if (aiStudio && aiStudio.hasSelectedApiKey) {
    return await aiStudio.hasSelectedApiKey();
  }
  return false;
};

// Helper to open key selection dialog
export const openKeySelection = async (): Promise<void> => {
  const aiStudio = (window as any).aistudio;
  if (aiStudio && aiStudio.openSelectKey) {
    await aiStudio.openSelectKey();
  } else {
    console.warn("AI Studio client library not loaded or unsupported environment.");
    alert("AI Studio environment required for this feature.");
  }
};

export const generateAlbumArt = async (
  prompt: string,
  size: ImageSize
): Promise<string> => {
  
  // Safely access API Key to prevent crash if process is undefined in browser environment
  let apiKey = undefined;
  try {
     // Checking for process global first to avoid ReferenceError
     // @ts-ignore
     if (typeof process !== 'undefined' && process.env) {
         apiKey = process.env.API_KEY;
     }
  } catch (e) {
      // ignore reference errors
  }

  // Create instance just before call to ensure key is fresh
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1",
        },
      },
    });

    // Parse response for image
    // Note: The response structure for generateContent with image model
    if (response.candidates && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
         }
       }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};