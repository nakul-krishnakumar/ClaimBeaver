"use client";
import React, { useState, useRef, useEffect } from "react";
import GlassBackground from "@/components/background/glass-background";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your AI assistant from Claim Ease. How can I help you with your insurance claims today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showClaims, setShowClaims] = useState(true); // Toggle for claims
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate bot response
  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    setTimeout(async() => {
      const botResponse = await axios.post("/api/chat", { message: userMessage,messageId: messages.length+1 });
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: prev.length + 2, text: botResponse.data ,sender: "bot" }]);
    },100);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newMessage = { id: messages.length + 1, text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    simulateBotResponse(inputValue);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-700 relative overflow-hidden">
      {/* Glass Background */}
      <div className="absolute inset-0 z-0">
        <GlassBackground />
      </div>

      {/* Main Layout (Chat & Claims Side-by-Side) */}
      <div className="relative z-10 flex flex-col lg:flex-row h-full">
        {/* Chat Section */}
        <div className="flex flex-col flex-1 h-full lg:w-2/3">
          {/* Header */}
          <header className="backdrop-blur-md bg-white/70 shadow-sm border-b p-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Claim Ease Assistant</h1>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>

            {/* Toggle Claims Button (Mobile-Friendly) */}
            <button onClick={() => setShowClaims(!showClaims)} className="lg:hidden px-3 py-2 bg-blue-600 text-white rounded-md">
              {showClaims ? "Hide Claims" : "Show Claims"}
            </button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md rounded-lg px-4 py-3 ${
                    message.sender === "user" ? "bg-blue-600 text-white rounded-br-none shadow-lg" : "backdrop-blur-md bg-white/80 shadow-sm border rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="backdrop-blur-sm bg-white/80 shadow-sm border rounded-lg px-4 py-3 flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <footer className=" bg-white/70 border-t p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 backdrop-blur-md bg-white/50 border border-gray-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all focus:outline-none"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                ➤
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
