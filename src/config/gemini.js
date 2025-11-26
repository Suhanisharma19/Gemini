import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
console.log('Using API key:', apiKey !== "YOUR_API_KEY_HERE" ? 'From environment' : 'Default placeholder');
const genAI = new GoogleGenerativeAI(apiKey);

// No model pre-initialization - we'll find one dynamically

async function runChat(prompt) {
  try {
    // Check if API key is valid
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      return "Please add your Gemini API key to the .env.local file.";
    }
    
    console.log('API Key during model init:', apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    // Validate API key format
    if (!apiKey || apiKey.length < 20) {
      console.error('API key appears to be invalid');
      return "Invalid API key format. Please check your Gemini API key in .env.local file.";
    }
    
    // Follow the error suggestion - list available models first
    let workingModel = null;
    try {
      console.log('Listing available models as suggested by the error...');
      const modelsResponse = await genAI.listModels();
      console.log('Models response:', JSON.stringify(modelsResponse, null, 2));
      
      if (modelsResponse && modelsResponse.models && modelsResponse.models.length > 0) {
        console.log('Available models:');
        modelsResponse.models.forEach((model, index) => {
          console.log(`${index + 1}. ${model.name} - ${model.displayName || 'No display name'} (${model.version || 'No version'})`);
        });
        
        // Try to use the first few models that look like they might work
        const candidateModels = modelsResponse.models
          .map(m => m.name)
          .filter(name => name.includes('gemini'))
          .slice(0, 5); // Try first 5 Gemini models
          
        console.log('Trying candidate models:', candidateModels);
        
        for (const modelName of candidateModels) {
          try {
            console.log(`Attempting to initialize model: ${modelName}`);
            workingModel = genAI.getGenerativeModel({ model: modelName });
            console.log(`Successfully initialized model: ${modelName}`);
            break;
          } catch (initError) {
            console.error(`Failed to initialize ${modelName}:`, initError.message);
            continue;
          }
        }
        
        // If no candidate models worked, try the very first model
        if (!workingModel && modelsResponse.models.length > 0) {
          const firstModelName = modelsResponse.models[0].name;
          console.log(`Trying first model in list: ${firstModelName}`);
          try {
            workingModel = genAI.getGenerativeModel({ model: firstModelName });
            console.log(`Successfully initialized first model: ${firstModelName}`);
          } catch (firstModelError) {
            console.error(`Failed to initialize first model ${firstModelName}:`, firstModelError.message);
          }
        }
      } else {
        console.log('No models returned from listModels API');
        console.log('Models response structure:', Object.keys(modelsResponse || {}));
      }
    } catch (listError) {
      console.error('Failed to list models:', listError);
      console.error('Full list error details:', JSON.stringify(listError, Object.getOwnPropertyNames(listError)));
      
      // Fallback to direct model names if listing fails
      const fallbackModels = ["models/gemini-pro-latest", "models/gemini-pro", "models/gemini-1.5-flash-latest", "models/gemini-1.5-flash", "gemini-pro"];
      for (const modelName of fallbackModels) {
        try {
          console.log(`Attempting fallback model: ${modelName}`);
          workingModel = genAI.getGenerativeModel({ model: modelName });
          console.log(`Successfully initialized fallback model: ${modelName}`);
          break;
        } catch (fallbackError) {
          console.error(`Failed to initialize fallback model ${modelName}:`, fallbackError.message);
          continue;
        }
      }
    }
    
    // If all else fails, try without the models/ prefix
    if (!workingModel) {
      console.log('Trying models without models/ prefix...');
      const simpleModels = ["gemini-pro", "gemini-1.5-flash"];
      for (const modelName of simpleModels) {
        try {
          console.log(`Attempting simple model: ${modelName}`);
          workingModel = genAI.getGenerativeModel(modelName);
          console.log(`Successfully initialized simple model: ${modelName}`);
          break;
        } catch (simpleError) {
          console.error(`Failed to initialize simple model ${modelName}:`, simpleError.message);
          continue;
        }
      }
    }
    
    // Final check - if we still don't have a working model, return an error
    if (!workingModel) {
      console.error('Failed to initialize any model after all attempts');
      return "Failed to initialize AI model. Please verify your API key is valid and has access to Gemini models.";
    }
    
    console.log('Using model:', workingModel.model);
    
    // Generate content
    console.log('Attempting to generate content with prompt:', prompt);
    const result = await workingModel.generateContent(prompt);
    console.log('Content generation successful');
    return result.response.text();
  } catch (error) {
    console.error('Error in runChat: ', error);
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      return "Invalid API key. Please check your Gemini API key in .env.local file.";
    }
    return `An error occurred: ${error.message || 'Unknown error'}. Please try again.`;
  }
}

export default runChat;
