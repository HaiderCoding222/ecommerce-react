import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import '../styles.css';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Thank you for your message! Our team will respond soon.', sender: 'bot' }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300"
        >
          <FiMessageCircle className="text-xl sm:text-2xl" />
        </button>
      )}
      {isOpen && (
        <div className="w-72 sm:w-80 h-96 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl flex flex-col animate-slide-up">
          <div className="flex justify-between items-center p-3 sm:p-4 bg-indigo-500 text-white rounded-t-xl">
            <h3 className="text-sm sm:text-base font-semibold">Live Chat</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <FiX className="text-lg sm:text-xl" />
            </button>
          </div>
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 sm:mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                    msg.sender === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t dark:border-gray-600">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 sm:p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white p-2 sm:p-3 rounded-full hover:bg-indigo-600 transition-all duration-300"
              >
                <FiSend className="text-sm sm:text-base" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;