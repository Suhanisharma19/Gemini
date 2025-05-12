import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompt, setRecentPrompt, setInput, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    setInput(prompt); // Ensure the input field shows the selected prompt
    await onSent(); // Trigger the onSent function
  };

  return (
    <div className='sidebar'>
      <div className="top">
        <img 
          onClick={() => setExtended((prev) => !prev)} 
          className='menu' 
          src={assets.menu_icon} 
          alt="Menu Icon" 
        />
        <div 
          onClick={() => {
            setRecentPrompt(""); // Clear previous prompt
            setInput(""); // Clear input field
            newChat(); // Invoke the newChat function
          }} 
          className='new-chat'
        >
          <img src={assets.plus_icon} alt="New Chat Icon" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className='recent'>
            <p className='recent-title'>Recent</p>
            {prevPrompt.length > 0 ? (
              prevPrompt.map((item, index) => (
                <div 
                  className="recent-entry" 
                  key={index} 
                  onClick={() => loadPrompt(item)}
                >
                  <img src={assets.message_icon} alt="Message Icon" />
                  <p>{item.length > 30 ? `${item.substring(0, 30)}...` : item}</p>
                </div>
              ))
            ) : (
              <p className='no-recent'>No recent prompts</p>
            )}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Help Icon" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Activity Icon" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Settings Icon" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
