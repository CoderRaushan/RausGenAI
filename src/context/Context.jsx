import { createContext, useState, useEffect } from "react";
import run from "../config/RausGenAI";
export const Context = createContext();

const ContextProvider = (probs) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [visiblePrompts, setVisiblePrompts] = useState(5); // To manage "More" functionality

  // Function to store result in local storage
  const storeInLocalStorage = (prompt, result) => {
    let storedData = JSON.parse(localStorage.getItem("searchHistory")) || {};
    storedData[prompt] = result;
    localStorage.setItem("searchHistory", JSON.stringify(storedData));
  };

  // Function to get result from local storage
  const getFromLocalStorage = (prompt) => {
    let storedData = JSON.parse(localStorage.getItem("searchHistory")) || {};
    return storedData[prompt];
  };

  // Store recent searches in local storage
  const storePrevPromptsInLocalStorage = (prompts) => {
    localStorage.setItem("prevPrompts", JSON.stringify(prompts));
  };

  // Retrieve recent searches from local storage
  const loadPrevPromptsFromLocalStorage = () => {
    const savedPrompts = JSON.parse(localStorage.getItem("prevPrompts"));
    if (savedPrompts) {
      setPrevPrompts(savedPrompts);
    }
  };

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const finalPrompt = prompt || input; // Use provided prompt or input field value
    const storedResult = getFromLocalStorage(finalPrompt);

    if (storedResult) {
      // If result exists in local storage, display it without regenerating
      displayResult(storedResult);
    } else {
      // If not found in local storage, generate a new result
      let response = await run(finalPrompt);
      setRecentPrompt(finalPrompt);

      // Process the response
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let finalResponse = newResponse.split("*").join("</br>");
      displayResult(finalResponse);

      // Store result in local storage for future use
      storeInLocalStorage(finalPrompt, finalResponse);

      // Add prompt to the list of recent searches
      const updatedPrompts = [finalPrompt, ...prevPrompts];
      setPrevPrompts(updatedPrompts);
      storePrevPromptsInLocalStorage(updatedPrompts); // Store the updated prevPrompts in localStorage
    }

    setLoading(false);
    setInput("");
  };

  const displayResult = (result) => {
    setResultData("");
    const resultArray = result.split(" ");
    for (let i = 0; i < resultArray.length; i++) {
      const nextWord = resultArray[i];
      delayPara(i, nextWord + " ");
    }
  };

  // Function to handle pagination of recent searches (Show More)
  const loadMorePrompts = () => {
    setVisiblePrompts((prevVisible) => prevVisible + 5); // Load 5 more prompts
  };

  // Load recent searches from local storage on page load
  useEffect(() => {
    loadPrevPromptsFromLocalStorage();
  }, []); // This will load the saved prompts when the component is mounted

  const contextValue = {
    prevPrompts: prevPrompts.slice(0, visiblePrompts), // Show limited prompts
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    loadMorePrompts, // Expose load more function to the component
    visiblePrompts,
  };

  return (
    <Context.Provider value={contextValue}>
      {probs.children}
    </Context.Provider>
  );
};

export default ContextProvider;
