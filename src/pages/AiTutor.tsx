
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Mic, 
  Image as ImageIcon, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Sparkles, 
  BookOpen,
  Upload,
  Loader2,
  CheckCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
};

const botResponses = [
  "The concept you're asking about involves several key principles. First, consider the fundamental idea that all elements in the system interact with each other. This interaction creates a dynamic equilibrium that can be observed through various measurements and analyses.",
  
  "That's a great question! In learning theory, we distinguish between three main approaches: behaviorism, cognitivism, and constructivism. Each has strengths and limitations depending on the learning context. Behaviorism focuses on observable behavior changes, cognitivism looks at mental processes, and constructivism emphasizes how learners build knowledge through experiences.",
  
  "Let me explain this step by step:\n\n1. Start by identifying the core variables\n2. Analyze their relationships\n3. Apply the relevant formula\n4. Interpret the results in context\n\nWould you like me to elaborate on any of these steps?",
  
  "This topic connects to several other concepts we've covered. Remember our discussion about system dynamics? The principles there apply directly to what you're asking now. You might want to review the material from Chapter 4, which explains the theoretical foundations in more detail.",
  
  "I'd recommend approaching this problem by breaking it down into smaller components. This method, called decomposition, helps manage complexity. Let's identify the key elements first, then work through each one systematically.",
];

const AiTutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Tutor. I'm here to help you learn and understand any topic. What would you like to explore today?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'sending',
      attachments: uploadedFiles.length > 0 ? uploadedFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name
      })) : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsTyping(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update status of sent message
    setMessages(prev => prev.map(msg => 
      msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
    ));
    
    // Select a random response from the predefined list
    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
    
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      
      // Reset the input to allow uploading the same file again
      e.target.value = '';
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">AI Tutor</h1>
        <p className="text-muted-foreground">
          Your personal learning assistant for any subject or question.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">EduForge AI Tutor</CardTitle>
                  <CardDescription className="text-xs">Ask anything, upload resources, learn effectively</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20">Online</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 shrink-0">
                        {message.role === 'assistant' ? (
                          <>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-muted">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === 'assistant'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mb-2 space-y-2">
                              {message.attachments.map((attachment, attachIndex) => (
                                attachment.type === 'image' ? (
                                  <div key={attachIndex} className="rounded-md overflow-hidden">
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name} 
                                      className="max-w-full h-auto max-h-40 object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div key={attachIndex} className="flex items-center gap-2 bg-background/20 rounded p-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="text-sm truncate">{attachment.name}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                          
                          {/* Message content */}
                          <div className="whitespace-pre-line">{message.content}</div>
                          
                          {/* Status indicator for user messages */}
                          {message.role === 'user' && message.status && (
                            <div className="flex justify-end mt-1">
                              {message.status === 'sending' ? (
                                <Loader2 className="h-3 w-3 animate-spin opacity-70" />
                              ) : message.status === 'sent' ? (
                                <CheckCircle className="h-3 w-3 opacity-70" />
                              ) : (
                                <div className="text-xs text-destructive">Failed to send</div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className={`mt-1 flex items-center text-xs text-muted-foreground gap-2 ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          
                          {message.role === 'assistant' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copy</span>
                              </Button>
                              
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="sr-only">Helpful</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                  <span className="sr-only">Not helpful</span>
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={endOfMessagesRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 border-t">
              {uploadedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="flex items-center gap-1 pl-2 bg-accent/50"
                    >
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-3 w-3" />
                      ) : (
                        <BookOpen className="h-3 w-3" />
                      )}
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 text-muted-foreground hover:text-destructive"
                        onClick={() => removeUploadedFile(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" x2="6" y1="6" y2="18" />
                          <line x1="6" x2="18" y1="6" y2="18" />
                        </svg>
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-end gap-2 w-full">
                <Textarea
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="resize-none min-h-[80px]"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full h-9 w-9"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload file</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full h-9 w-9"
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full h-9 w-9"
                    onClick={handleSendMessage}
                    disabled={(!input.trim() && uploadedFiles.length === 0) || isTyping}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="px-4 py-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                      Suggested Topics
                    </Label>
                    <div className="space-y-2">
                      {[
                        "How does photosynthesis work?",
                        "Explain Newton's laws of motion",
                        "What are the key principles of machine learning?",
                        "How to solve quadratic equations?",
                        "Explain the water cycle"
                      ].map((topic, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-left font-normal h-auto py-2"
                          onClick={() => setInput(topic)}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                      Your Uploads
                    </Label>
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload study materials to enhance your learning experience
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                      Learning History
                    </Label>
                    <div className="space-y-3">
                      {[
                        { title: "Calculus: Derivatives", date: "2 hours ago" },
                        { title: "World History: Renaissance", date: "Yesterday" },
                        { title: "Biology: Cell Structure", date: "3 days ago" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-accent/50">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 border-t">
              <div className="w-full">
                <Input
                  placeholder="Search your learning history..."
                  className="w-full"
                  prefix={<MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />}
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
