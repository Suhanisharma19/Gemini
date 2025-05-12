import { GoogleGenAI } from '@google/genai';

async function runChat(prompt) {
  let result = ""; // Initialize result to store chunks

  try {
    console.log("Starting API request..."); // Log before the API request

    const ai = new GoogleGenAI({
      apiKey: 'AIzaSyB5V1qHSHTylij_PaP5MAxMuvLL-TMk7-k', // Replace with your actual API key
    });

    const config = {
      responseMimeType: 'text/plain',
    };

    const model = 'gemini-2.5-flash-preview-04-17'; // Adjust the model name if needed
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    console.log("Response received..."); // Log after the API request

    // Accumulate chunks into result
    for await (const chunk of response) {
      result += chunk.text; // Append each chunk to result
      console.log("Received chunk: ", chunk.text); // Log each chunk
    }

    // Log the final result
    console.log("Final result: ", result);
    return result;
  } catch (error) {
    console.error('Error in runChat: ', error);
    return "An error occurred. Please try again.";
  }
}

export default runChat;
