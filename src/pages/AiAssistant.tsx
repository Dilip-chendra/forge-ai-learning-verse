
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Bot, 
  Key, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  Settings, 
  Save, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type GeminiModel = 'gemini-pro' | 'gemini-pro-vision';

const AiAssistant = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-pro');
  const [isApiKeyStored, setIsApiKeyStored] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [streamResponse, setStreamResponse] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a stored API key
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeyStored(true);
    }

    // Add a welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant powered by Google\'s Gemini. How can I help you today?',
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('gemini-api-key', apiKey);
    setIsApiKeyStored(true);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved to your browser's local storage",
    });
    setIsSettingsOpen(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setIsApiKeyStored(false);
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed from storage",
    });
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    if (!isApiKeyStored || !apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in settings first",
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Create a placeholder message for streaming
      if (streamResponse) {
        const placeholderId = 'placeholder-' + Date.now().toString();
        setMessages(prev => [...prev, {
          id: placeholderId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        }]);
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: userInput }],
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      
      // Extract the response text
      const assistantResponse = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I couldn\'t generate a response.';

      if (streamResponse) {
        // Update the last message (our placeholder)
        setMessages(prev => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            id: Date.now().toString(),
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date(),
          };
          return updatedMessages;
        });
      } else {
        // Add new message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to Gemini API",
        variant: "destructive",
      });
      
      // Remove placeholder if it exists
      if (streamResponse) {
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('placeholder-')));
      }
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error connecting to the Gemini API. Please check your API key and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            Gemini AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Interact with Google's Gemini AI models
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {isSettingsOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Gemini API Settings
            </CardTitle>
            <CardDescription>
              Configure your connection to Google's Gemini API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button 
                  variant="secondary" 
                  onClick={saveApiKey}
                  className="shrink-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Key
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key will be stored in your browser's local storage. It never leaves your device.
              </p>
              {isApiKeyStored && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    API Key Saved
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 px-2 text-xs text-muted-foreground" 
                    onClick={clearApiKey}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="model-selection">Model</Label>
              <Select
                value={selectedModel}
                onValueChange={(value) => setSelectedModel(value as GeminiModel)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">
                    <div className="flex flex-col">
                      <span>Gemini Pro</span>
                      <span className="text-xs text-muted-foreground">General purpose model for text</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gemini-pro-vision">
                    <div className="flex flex-col">
                      <span>Gemini Pro Vision</span>
                      <span className="text-xs text-muted-foreground">Multimodal model for text and images</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="stream-mode"
                checked={streamResponse}
                onCheckedChange={setStreamResponse}
              />
              <Label htmlFor="stream-mode">Stream Response</Label>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-0">
            <Button 
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
            >
              Close
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto border rounded-md p-4 mb-4 bg-background">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Sparkles className="h-12 w-12 text-primary/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
            <p className="text-muted-foreground max-w-md">
              Send a message to begin chatting with the Gemini AI assistant
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  message.role === "user" 
                    ? "bg-accent" 
                    : "bg-card"
                )}
              >
                {message.role === "assistant" ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-secondary">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {message.role === "assistant" ? "Gemini" : "You"}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {message.id.startsWith('placeholder-') ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating response...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          placeholder="Send a message..."
          className="min-h-[80px] resize-none pr-20"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || (!apiKey && !isApiKeyStored)}
        />
        {(!apiKey && !isApiKeyStored) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm">
            <Button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Add API Key to Start
            </Button>
          </div>
        )}
        <Button
          size="icon"
          className="absolute right-4 bottom-4"
          onClick={sendMessage}
          disabled={isLoading || !userInput.trim() || (!apiKey && !isApiKeyStored)}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* API Key Notice */}
      {!isApiKeyStored && (
        <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            You'll need a Google AI Studio API key to use Gemini. Get one at{" "}
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              ai.google.dev
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
