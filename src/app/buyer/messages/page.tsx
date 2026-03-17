"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context";
import { MessageSquare, Send, Search } from "lucide-react";

export default function MessagesPage() {
  const { currentUser, getConversations, getConversationMessages, sendMessage, markMessageRead } = useApp();
  const searchParams = useSearchParams();
  const [activeChat, setActiveChat] = useState<{ userId: string; userName: string } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchConv, setSearchConv] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sellerId = searchParams.get("seller");
  const sellerName = searchParams.get("sellerName");

  useEffect(() => {
    if (sellerId && sellerName) {
      setActiveChat({ userId: sellerId, userName: sellerName });
    }
  }, [sellerId, sellerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  if (!currentUser) return null;

  const conversations = getConversations(currentUser.id).filter(c =>
    c.userName.toLowerCase().includes(searchConv.toLowerCase())
  );

  const chatMessages = activeChat ? getConversationMessages(currentUser.id, activeChat.userId) : [];

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    sendMessage(activeChat.userId, activeChat.userName, newMessage.trim());
    setNewMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        {/* Sidebar */}
        <div className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-gray-100`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchConv} onChange={e => setSearchConv(e.target.value)} placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Visit a product to message a seller</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button key={conv.userId} onClick={() => setActiveChat({ userId: conv.userId, userName: conv.userName })}
                  className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChat?.userId === conv.userId ? "bg-indigo-50" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 font-semibold text-indigo-600">
                    {conv.userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-900 truncate">{conv.userName}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">{conv.unreadCount}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-400 hover:text-gray-600 mr-1">←</button>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600 flex-shrink-0">
                {activeChat.userName[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{activeChat.userName}</h3>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMe = msg.fromId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
                <button onClick={handleSend} disabled={!newMessage.trim()}
                  className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-center">
            <div>
              <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select a conversation</h3>
              <p className="text-gray-500 text-sm mt-1">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
