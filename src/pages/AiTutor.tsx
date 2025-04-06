import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ThumbsDown,
  BrainCircuit,
  AlertTriangle,
  Trash,
  FileAudio,
  FileVideo,
  FileText,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { aiMemory } from '@/utils/aiMemory';
import { Message, FileUpload, LearningResource } from '@/types/aiTutor';

const botResponses = [
  "The concept you're asking about involves several key principles. First, consider the fundamental idea that all elements in the system interact with each other. This interaction creates a dynamic equilibrium that can be observed through various measurements and analyses.",
  
  "That's a great question! In learning theory, we distinguish between three main approaches: behaviorism, cognitivism, and constructivism. Each has strengths and limitations depending on the learning context. Behaviorism focuses on observable behavior changes, cognitivism looks at mental processes, and constructivism emphasizes how learners build knowledge through experiences.",
  
  "Let me explain this step by step:\n\n1. Start by identifying the core variables\n2. Analyze their relationships\n3. Apply the relevant formula\n4. Interpret the results in context\n\nWould you like me to elaborate on any of these steps?",
  
  "This topic connects to several other concepts we've covered. Remember our discussion about system dynamics? The principles there apply directly to what you're asking now. You might want to review the material from Chapter 4, which explains the theoretical foundations in more detail.",
  
  "I'd recommend approaching this problem by breaking it down into smaller components. This method, called decomposition, helps manage complexity. Let's identify the key elements first, then work through each one systematically.",
];

const AiTutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [learningTopics, setLearningTopics] = useState<LearningResource[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedMessages = aiMemory.getMessages();
    if (storedMessages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI Tutor with multimodal memory. I can remember our conversations and the resources you share. What would you like to learn today?",
        timestamp: new Date(),
      };
      aiMemory.addMessage(initialMessage);
      setMessages([initialMessage]);
    } else {
      setMessages(storedMessages);
    }

    const topics = aiMemory.getLearningTopics().map(topic => ({
      id: topic.id,
      title: topic.name,
      type: 'topic' as const,
      date: topic.lastStudied,
    }));
    setLearningTopics(topics);

    const uploadedResources = aiMemory.getResources().map(resource => ({
      id: resource.id,
      title: resource.name,
      type: resource.type,
      url: resource.url,
      content: resource.content,
      date: resource.createdAt,
    }));
    setResources(uploadedResources);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'sending',
      attachments: uploadedFiles
        .filter(file => file.status === 'complete')
        .map(file => ({
          type: getFileType(file.file),
          url: file.preview || URL.createObjectURL(file.file),
          name: file.file.name,
          thumbnail: file.preview,
        }))
    };
    
    aiMemory.addMessage(newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    setUploadedFiles([]);
    setIsTyping(true);
    
    const potentialTopic = extractTopic(input);
    if (potentialTopic) {
      aiMemory.updateLearningTopic(potentialTopic);
      const topics = aiMemory.getLearningTopics().map(topic => ({
        id: topic.id,
        title: topic.name,
        type: 'topic' as const,
        date: topic.lastStudied,
      }));
      setLearningTopics(topics);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setMessages(prev => prev.map(msg => 
      msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
    ));
    
    const contextualResponse = getContextualResponse(input, messages);
    
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: contextualResponse,
      timestamp: new Date(),
    };
    
    aiMemory.addMessage(aiResponse);
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const extractTopic = (text: string): string | null => {
    const topicPatterns = [
      /(?:about|learn|explain|understand|study|topic of) ([a-z\s]{3,50}?)(?:\?|\.|\,|$)/i,
      /(?:what is|how does) ([a-z\s]{3,50}?)(?:\?|\.|\,|$)/i,
      /([a-z\s]{3,50}?)(?:\?|\.|\,|$)/i
    ];
    
    for (const pattern of topicPatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length > 3) {
        return match[1].trim();
      }
    }
    
    return null;
  };

  const getContextualResponse = (userMessage: string, messageHistory: Message[]): string => {
    const containsReference = /(?:previous|earlier|last time|you said|as you mentioned|remember when)/i.test(userMessage);
    
    if (containsReference && messageHistory.length > 2) {
      const randomPreviousMessage = messageHistory
        .filter(msg => msg.role === 'assistant')
        .slice(0, -1);
      
      if (randomPreviousMessage.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomPreviousMessage.length);
        const previousContent = randomPreviousMessage[randomIndex].content.split(' ').slice(0, 6).join(' ');
        
        return `As I mentioned earlier about "${previousContent}...", ${botResponses[Math.floor(Math.random() * botResponses.length)]}`;
      }
    }
    
    const isAboutResource = /(?:file|document|upload|picture|image|photo|pdf|video)/i.test(userMessage);
    
    if (isAboutResource && resources.length > 0) {
      const randomResource = resources[Math.floor(Math.random() * resources.length)];
      return `Based on your ${randomResource.type} "${randomResource.title}", ${botResponses[Math.floor(Math.random() * botResponses.length)]}`;
    }
    
    return botResponses[Math.floor(Math.random() * botResponses.length)];
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
      const newUploads: FileUpload[] = files.map(file => ({
        file,
        progress: 0,
        status: 'uploading',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      
      setUploadedFiles(prev => [...prev, ...newUploads]);
      
      simulateFileUploads(newUploads);
      
      e.target.value = '';
    }
  };

  const simulateFileUploads = (uploads: FileUpload[]) => {
    uploads.forEach((upload, index) => {
      const intervalId = setInterval(() => {
        setUploadedFiles(prev => {
          const newUploads = [...prev];
          const uploadIndex = newUploads.findIndex(
            u => u.file.name === upload.file.name && u.file.size === upload.file.size
          );
          
          if (uploadIndex !== -1) {
            newUploads[uploadIndex].progress += 10;
            
            if (newUploads[uploadIndex].progress >= 100) {
              clearInterval(intervalId);
              newUploads[uploadIndex].status = 'complete';
              
              const fileType = getFileType(upload.file);
              aiMemory.addResource({
                id: Date.now().toString() + index,
                type: fileType,
                name: upload.file.name,
                url: upload.preview || URL.createObjectURL(upload.file),
                content: fileType === 'document' ? `Content extracted from ${upload.file.name}` : undefined
              });
              
              const updatedResources = aiMemory.getResources().map(resource => ({
                id: resource.id,
                title: resource.name,
                type: resource.type,
                url: resource.url,
                content: resource.content,
                date: resource.createdAt,
              }));
              setResources(updatedResources);
            }
          }
          
          return newUploads;
        });
      }, 200);
    });
  };

  const getFileType = (file: File): 'document' | 'image' | 'audio' | 'video' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return d.toLocaleDateString();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        description: "Voice recording stopped and processed",
      });
      setInput(prev => prev + " This is a simulated voice transcription.");
    } else {
      setIsRecording(true);
      toast({
        description: "Voice recording started...",
      });
    }
  };

  const clearConversation = () => {
    const initialMessage = messages[0];
    aiMemory.clearMemory();
    if (initialMessage) {
      aiMemory.addMessage(initialMessage);
    }
    setMessages(initialMessage ? [initialMessage] : []);
    
    toast({
      description: "Conversation cleared",
    });
  };

  const FileUploadProgress = ({ upload }: { upload: FileUpload }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {upload.file.type.startsWith('image/') && <ImageIcon className="h-3 w-3" />}
          {upload.file.type.startsWith('audio/') && <FileAudio className="h-3 w-3" />}
          {upload.file.type.startsWith('video/') && <FileVideo className="h-3 w-3" />}
          {(!upload.file.type.startsWith('image/') && 
            !upload.file.type.startsWith('audio/') && 
            !upload.file.type.startsWith('video/')) && <FileText className="h-3 w-3" />}
          <span className="truncate max-w-[150px]">{upload.file.name}</span>
        </div>
        <span>{Math.min(100, upload.progress)}%</span>
      </div>
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${upload.status === 'error' ? 'bg-destructive' : 'bg-primary'}`} 
          style={{ width: `${Math.min(100, upload.progress)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">AI Tutor <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">MMT-GPT</Badge></h1>
        <p className="text-muted-foreground">
          Your personal multimodal memory-enhanced learning assistant.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">EduForge AI Tutor</CardTitle>
                    <CardDescription className="text-xs">With multimodal memory capabilities</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20">Online</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={clearConversation}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Clear conversation</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4" ref={messagesContainerRef}>
                <div className="flex flex-col space-y-4">
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
                              <AvatarImage src={user?.avatar || ""} />
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
                                  ) : attachment.type === 'audio' ? (
                                    <div key={attachIndex} className="rounded-md overflow-hidden bg-background/20 p-2">
                                      <div className="flex items-center gap-2">
                                        <FileAudio className="h-4 w-4" />
                                        <span className="text-sm truncate">{attachment.name}</span>
                                      </div>
                                      <audio 
                                        controls 
                                        className="w-full mt-2 h-8"
                                      >
                                        <source src={attachment.url} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                      </audio>
                                    </div>
                                  ) : attachment.type === 'video' ? (
                                    <div key={attachIndex} className="rounded-md overflow-hidden">
                                      <video 
                                        controls 
                                        className="max-w-full h-auto max-h-40"
                                      >
                                        <source src={attachment.url} type="video/mp4" />
                                        Your browser does not support the video element.
                                      </video>
                                    </div>
                                  ) : (
                                    <div key={attachIndex} className="flex items-center gap-2 bg-background/20 rounded p-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm truncate">{attachment.name}</span>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                            
                            <div className="whitespace-pre-line">{message.content}</div>
                            
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
                  
                  <div ref={endOfMessagesRef} className="h-1" />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 border-t">
              {uploadedFiles.length > 0 && (
                <div className="mb-2 w-full space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <FileUploadProgress upload={file} />
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1 text-muted-foreground hover:text-destructive"
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
                    </div>
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
                    className={`rounded-full h-9 w-9 ${isRecording ? 'bg-red-100 text-red-500 border-red-200' : ''}`}
                    onClick={toggleRecording}
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
                <BrainCircuit className="h-4 w-4 text-primary" />
                Learning Memory
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <Tabs defaultValue="topics" className="h-full flex flex-col">
                <TabsList className="w-full justify-start px-4 pt-2">
                  <TabsTrigger value="topics" className="text-xs">Topics</TabsTrigger>
                  <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
                  <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="topics" className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                        Recently Studied Topics
                      </Label>
                      <div className="space-y-2">
                        {learningTopics.length > 0 ? (
                          learningTopics.map((topic, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-accent/50">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                                <span>{topic.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  <Clock className="h-2.5 w-2.5 mr-1" />
                                  {formatDate(topic.date)}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No learning topics yet</p>
                            <p className="text-xs mt-1">Start a conversation to build your knowledge profile</p>
                          </div>
                        )}
                      </div>
                      
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block mt-6">
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
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="resources" className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                        Your Uploaded Resources
                      </Label>
                      <div className="space-y-2">
                        {resources.length > 0 ? (
                          resources.map((resource, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-accent/50">
                              <div className="flex items-center gap-2">
                                {resource.type === 'document' && <FileText className="h-3.5 w-3.5" />}
                                {resource.type === 'image' && <ImageIcon className="h-3.5 w-3.5" />}
                                {resource.type === 'audio' && <FileAudio className="h-3.5 w-3.5" />}
                                {resource.type === 'video' && <FileVideo className="h-3.5 w-3.5" />}
                                <span className="truncate max-w-[120px]">{resource.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {formatDate(resource.date)}
                              </Badge>
                            </div>
                          ))
                        ) : (
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
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="suggestions" className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                        Personalized Suggestions
                      </Label>
                      <div className="space-y-3">
                        <div className="bg-accent/30 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="font-medium">Activity Suggestion</span>
                          </div>
                          <p className="text-sm">Try uploading your course notes or textbook pages to get personalized explanations.</p>
                        </div>
                        
                        <div className="bg-accent/30 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-primary" />
                            <span className="font-medium">Learning Insight</span>
                          </div>
                          <p className="text-sm">You seem interested in science topics. Would you like to explore physics concepts in more depth?</p>
                          <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => setInput("Tell me more about fundamental physics concepts")}>
                            Explore Physics
                          </Button>
                        </div>
                        
                        <div className="bg-accent/30 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">Scheduled Review</span>
                          </div>
                          <p className="text-sm">It's been 3 days since you studied calculus. Want to refresh your knowledge?</p>
                          <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => setInput("Let's review calculus concepts we covered last time")}>
                            Review Calculus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="p-3 border-t">
              <div className="w-full">
                <Input
                  placeholder="Search your learning history..."
                  className="w-full"
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
