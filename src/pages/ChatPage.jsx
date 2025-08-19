import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const ChatPage = () => {
  const location = useLocation();
  const { sender, receiver } = location.state || {}; // fallback

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  // 1️⃣ Fetch conversation and old messages
  useEffect(() => {
    const fetchConversation = async () => {
      if (!sender || !receiver) return;

      try {
        const res = await axios.post(
          "https://blog-chat-service.onrender.com/blogChat/convo",
          { userId: sender, receiverId: receiver },
          { headers: { "Content-Type": "application/json" } }
        );

        const convId = res.data._id;
        setConversationId(convId);

        // Fetch old messages
        const msgsRes = await axios.get(
          `https://blog-chat-service.onrender.com/blogChat/chats/${convId}`
        );
        setMessages(msgsRes.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };

    fetchConversation();
  }, [sender, receiver]);

  // 2️⃣ Setup Socket.IO
  useEffect(() => {
    if (!conversationId) return;

    const newSocket = io("https://blog-chat-service.onrender.com"); // backend server
    setSocket(newSocket);

    newSocket.emit("joinConversation", conversationId);

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [conversationId]);

  // 3️⃣ Send message
  const handleSend = () => {
    if (!text || !socket) return;

    const newMsg = {
      conversationId,
      sender,
      text
    };

    socket.emit("sendMessage", newMsg);
    setText("");
  };

  // Helper for formatting time
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white font-semibold shadow-md">
        Chat with {receiver}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isSender = String(msg.sender) === String(sender);
          return (
            <div
              key={msg._id || Math.random()}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg shadow 
                ${isSender ? "bg-green-200 text-left text-black w-75 " : "bg-green-400 text-left text-black w-75"}`}
              >
                <p>{msg.text}</p>
                <p className="text-xs text-black mt-1">
                  {formatTime(msg.timestamp || Date.now())}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered w-full rounded-full"
        />
        <button
          onClick={handleSend}
          className="btn bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
