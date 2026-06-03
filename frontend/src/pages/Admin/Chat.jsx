import { useMemo, useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Users as UsersIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { useActiveChats, useChatHistory, useMarkChatAsRead } from "@/hooks/api/useChat";
import { io } from "socket.io-client";
import env from "@/config/env";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export default function AdminChatPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { activeChats, refetch: refetchActive } = useActiveChats();
  const { messages } = useChatHistory(selectedUserId);
  const markAsRead = useMarkChatAsRead();

  useEffect(() => {
    const newSocket = io(env.apiUrl.replace('/api', ''), {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("join", "admin"); // Admin joins the "admin" room
    });

    newSocket.on("newMessage", (msg) => {
      // If we are currently chatting with the sender, update cache
      if (msg.sender === selectedUserId || msg.receiver === selectedUserId) {
        queryClient.setQueryData(queryKeys.chat.history(selectedUserId), (oldData) => {
          if (!oldData) return { data: [msg] };
          return {
            ...oldData,
            data: [...oldData.data, msg],
          };
        });
        
        if (msg.sender === selectedUserId) {
           markAsRead.mutate(selectedUserId);
        }
      }
      // Always refresh the active chats list to show new unread markers / latest messages
      refetchActive();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedUserId, queryClient, markAsRead, refetchActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    markAsRead.mutate(userId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !selectedUserId) return;

    socket.emit("sendMessage", {
      sender: "admin",
      receiver: selectedUserId,
      message: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="space-y-8 page-enter h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader
        eyebrow="Admin Customer Support"
        title="Live Chat"
        description="Respond to customer inquiries in real-time."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 flex-1 min-h-0">
        {/* Users List */}
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <UsersIcon className="h-5 w-5" /> Active Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1 bg-muted/20">
            {activeChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No active conversations
              </div>
            ) : (
              <div className="flex flex-col">
                {activeChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => handleSelectUser(chat._id)}
                    className={`text-left p-4 border-b transition-colors hover:bg-muted ${
                      selectedUserId === chat._id ? "bg-muted/80 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold truncate pr-2 flex-1">User: {chat._id.substring(0, 8)}...</span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate w-full">
                      {chat.lastMessage}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(chat.lastMessageTime).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col h-full overflow-hidden">
          {selectedUserId ? (
            <>
              <CardHeader className="py-4 border-b bg-muted/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> 
                  Chatting with User: {selectedUserId}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-y-auto flex-1 flex flex-col space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div key={msg._id || idx} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            isAdmin 
                              ? "bg-primary text-primary-foreground rounded-tr-none" 
                              : "bg-muted text-foreground border rounded-tl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="p-4 border-t bg-muted/10">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-background"
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full p-8">
              <MessageCircle className="h-16 w-16 opacity-20 mb-4" />
              <p>Select a user from the list to start chatting.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
