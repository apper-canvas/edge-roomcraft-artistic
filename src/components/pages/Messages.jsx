import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { messageService } from "@/services/api/messageService";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const messageData = await messageService.getAll();
      setMessages(messageData);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    try {
      const message = {
        content: newMessage,
        attachments: selectedFiles.map(file => ({
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        })),
        senderId: "client",
        senderName: "You",
        timestamp: new Date().toISOString()
      };

      await messageService.create(message);
      setNewMessage("");
      setSelectedFiles([]);
      toast.success("Message sent successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <Empty
          title="No Messages Yet"
          description="Start a conversation with your designer to discuss your project"
          icon="MessageSquare"
        />
        
        {/* Message Input */}
        <Card className="p-4 mt-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ApperIcon name="Paperclip" className="h-4 w-4" />
            </Button>
            
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            
            <Button onClick={handleSendMessage}>
              <ApperIcon name="Send" className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-sky-100 to-sky-200 rounded-full">
              <ApperIcon name="MessageSquare" className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-midnight">
                Messages
              </h1>
              <p className="text-gray-600">Chat with Sarah Chen - Interior Designer</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Badge variant="success">Online</Badge>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                  {formatDate(dateMessages[0].timestamp)}
                </div>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <div
                    key={message.Id}
                    className={`flex ${
                      message.senderId === "client" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.senderId === "client" ? "order-2" : "order-1"
                    }`}>
                      <div className={`rounded-lg p-4 ${
                        message.senderId === "client"
                          ? "bg-gradient-to-r from-terracotta to-orange-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        {message.content && (
                          <p className="text-sm">{message.content}</p>
                        )}
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  message.senderId === "client"
                                    ? "bg-black bg-opacity-20"
                                    : "bg-white"
                                }`}
                              >
                                {attachment.type?.startsWith("image/") ? (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="w-32 h-24 object-cover rounded"
                                  />
                                ) : (
                                  <>
                                    <ApperIcon name="FileText" className="h-4 w-4" />
                                    <span className="text-xs truncate">
                                      {attachment.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-2 ${
                          message.senderId === "client"
                            ? "text-orange-100"
                            : "text-gray-500"
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.senderId === "client" ? "text-right" : "text-left"
                      }`}>
                        {message.senderName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          {/* File Previews */}
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2"
                  >
                    <ApperIcon name="File" className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-700 truncate max-w-32">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ApperIcon name="Paperclip" className="h-4 w-4" />
            </Button>
            
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && selectedFiles.length === 0}
            >
              <ApperIcon name="Send" className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card>
    </div>
  );
};

export default Messages;