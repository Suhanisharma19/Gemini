import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";

const Main = () => {
  const {
    onSent,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    prevPrompt,
  } = useContext(Context);

  return (
    <div className="main">
      {/* Top Navigation */}
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      {/* Main Content */}
      <div className="main-container">
        {showResult ? (
          // Result Section
          <div className="result-section">
            {prevPrompt.length > 0 && (
              <div className="result-title user-prompt">
                <img
                  src={assets.user_icon}
                  alt="User Icon"
                  className="user-image"
                />
                <p>{prevPrompt[prevPrompt.length - 1]}</p>
              </div>
            )}

            <div className="result-data">
              <div className="ai-response">
                <img
                  src={assets.gemini_icon}
                  alt="Gemini Icon"
                  className="ai-image"
                />

                {loading ? (
                  <div className="loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <div className="ai-response-content" dangerouslySetInnerHTML={{ __html: resultData }}></div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Welcome Section
          <div className="welcome-section">
            <div className="greet">
              <p><span>Hello, User</span></p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card">
                <p>Explore New Ideas</p>
                <img src={assets.compass_icon} alt="Explore Icon" />
              </div>
              <div className="card">
                <p>Get Solutions</p>
                <img src={assets.bulb_icon} alt="Solutions Icon" />
              </div>
              <div className="card">
                <p>Chat with AI</p>
                <img src={assets.message_icon} alt="Chat Icon" />
              </div>
              <div className="card">
                <p>Learn New Skills</p>
                <img src={assets.code_icon} alt="Skills Icon" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Input Section */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              onKeyDown={(e) => e.key === "Enter" && onSent()}
            />
            <div className="search-icons">
              <img src={assets.gallery_icon} alt="Gallery" />
              <img src={assets.mic_icon} alt="Mic" />
              {input?<img
                onClick={() => onSent()}
                src={assets.send_icon}
                alt="Send"
                className="send-icon"
              /> : null}
            </div>
          </div>
          <p className="bottom-info">Ask me anything. I am here to help you.</p>
        </div>
      </div>
    </div>
  );
};

export default Main;