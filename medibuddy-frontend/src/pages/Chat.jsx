import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5050/get",
        `msg=${encodeURIComponent(query)}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: response.data.answer || "I don't have information about that.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content: "Sorry, network error. Please check your connection!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleIntroSubmit = () => {
    if (!input.trim()) return;
    setShowIntro(false);
    sendMessage();
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <header className="chat-header">
          <h1>MEDIBUDDY – AI Medifist</h1>
        </header>

        {showIntro ? (
          <div className="chat-intro">
            <div className="bot-icon">💬</div>
            <h2 className="intro-title">AI Medifist</h2>
            <p className="intro-subtitle">
              Hello! I'm your smart doctor. How Can I help you today?
            </p>
            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleIntroSubmit()}
                placeholder="Message Chatbot..."
              />
              <button
                onClick={handleIntroSubmit}
                disabled={!input.trim()}
                className="send-btn"
              >
                ➤
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="bubble">{msg.content}</div>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              ))}
              {loading && (
                <div className="message bot">
                  <div className="bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Message Chatbot..."
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="send-btn"
              >
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;