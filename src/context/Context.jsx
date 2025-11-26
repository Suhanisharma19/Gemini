import { createContext, useState, useRef } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const resultRef = useRef("");

  // Function to send a prompt to the AI and update response
  const onSent = async () => {
    if (input.trim() === "") {
      setResultData("Please enter a prompt.");
      setShowResult(true);
      return;
    }

    setLoading(true);
    setShowResult(true);
    setResultData("");
    resultRef.current = "";

    // Add the input prompt to previous prompts
    setPrevPrompt((prev) => [...prev, input]);
    setRecentPrompt(input);

    try {
      const response = await runChat(input);
      
      // Check if the response is an error message
      if (response.startsWith("API key is missing") || 
          response.startsWith("Invalid API key") || 
          response.startsWith("Network error") || 
          response.startsWith("An error occurred")) {
        setResultData(response);
        setLoading(false);
        return;
      }
      
      const responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        newResponse += i % 2 === 0 ? responseArray[i] : `<b>${responseArray[i]}</b>`;
      }

      let formattedResponse = newResponse.split("*").join("<br/>");
      let responseWords = formattedResponse.split(" ");

      responseWords.forEach((word, i) => {
        setTimeout(() => {
          resultRef.current += word + " ";
          setResultData(resultRef.current);
          if (i === responseWords.length - 1) {
            setLoading(false);
          }
        }, 30 * i);
      });
    } catch (error) {
      console.error("Error in onSent:", error);
      setResultData("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setInput("");
    }
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
    setRecentPrompt("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
