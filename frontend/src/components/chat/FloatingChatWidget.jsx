import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatHistory, useMarkChatAsRead } from "@/hooks/api/useChat";
import { io } from "socket.io-client";
import env from "@/config/env";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export function FloatingChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  
  const userId = user?._id || user?.id;
  const { messages } = useChatHistory(isOpen ? userId : null);
  const markAsRead = useMarkChatAsRead();
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      const newSocket = io(env.apiUrl.replace('/api', ''), {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        newSocket.emit("join", userId);
      });

      newSocket.on("newMessage", (msg) => {
        // Optimistically update query cache
        queryClient.setQueryData(queryKeys.chat.history(userId), (oldData) => {
          if (!oldData) return { data: [msg] };
          return {
            ...oldData,
            data: [...oldData.data, msg],
          };
        });
        
        if (isOpen && msg.sender === "admin") {
           markAsRead.mutate(userId);
        }
      });

      setSocket(newSocket);
      
      // Mark as read when opened
      markAsRead.mutate(userId);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, isAuthenticated, userId, queryClient, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit("sendMessage", {
      sender: userId,
      receiver: "admin",
      message: message.trim(),
    });

    setMessage("");
  };

  if (!isAuthenticated || user?.isAdmin || user?.role === "Admin" || user?.role === "Customer Support") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-background border rounded-lg shadow-xl w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Customer Support</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:text-primary hover:bg-white" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                <MessageCircle className="h-10 w-10 opacity-20" />
                <p className="text-sm">Send us a message to start chatting</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} className={`flex flex-col ${msg.sender === userId ? "items-end" : "items-start"}`}>
                  <div 
                    className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                      msg.sender === userId 
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t bg-background flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
