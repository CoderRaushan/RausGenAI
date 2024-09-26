import React, { useContext, useState } from 'react';
import "./sidebar.css";
import { assets } from '../../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile menu state
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the mobile menu visibility
  };

  return (
    <>
      {/* Three-bar menu button for mobile screens */}
      <img onClick={handleMobileMenuToggle} className='menu-mobile' src={assets.menu_icon} alt="menu_icon" />

      {/* Sidebar container */}
      <div className={`sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="top">
          <img onClick={() => setExtended(!extended)} className='menu' src={assets.menu_icon} alt="menu_icon" />
          <div onClick={() => newChat()} className="new-chat">
            <img src={assets.plus_icon} alt="plus_icon" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {
            extended ?
              <div className="recent">
                <p className="recent-title">Recent</p>
                {prevPrompts.map((item, index) => (
                  <div onClick={() => loadPrompt(item)} className="recent-entry" key={index}>
                    <img src={assets.message_icon} alt="message_icon" />
                    <p>{item.slice(0, 18)}...</p>
                  </div>
                ))}
              </div>
              : null
          }
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="question_icon" />
            {extended ? <p>Help</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="history_icon" />
            {extended ? <p>Activity</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="setting_icon" />
            {extended ? <p>Settings</p> : null}
          </div>
        </div>
      </div>

      {/* Overlay for mobile screens when the sidebar is open */}
      {isMobileMenuOpen && <div className="overlay" onClick={handleMobileMenuToggle}></div>}
    </>
  );
};

export default Sidebar;
