import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    constnewMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      console.log('Gemini API response:', data); // Log the API response
      if (response.ok) {
        setMessages([...newMessages, { sender: 'ai', text: data.text }]);
      } else {
        console.error('Error from Gemini API:', response.status, response.statusText, data.error); // Log API error with status and statusText
        setMessages([...newMessages, { sender: 'ai', text: `Error: ${data.error || response.statusText}` }]);
      }
    } catch (error) {
      console.error('Error sending message to Gemini API:', error);
      setMessages([...newMessages, { sender: 'ai', text: 'Sorry, I could not get a response.' }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleAssistant}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        🤖
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <button onClick={toggleAssistant} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.sender === 'ai' ? (
                    <div>
                      {console.log('AI message text:', msg.text)}
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 flex">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;