
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Link2, 
  Loader2, 
  Sparkles, 
  FilePlus2, 
  ArrowRight, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Brain
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const fileTypes = [
  { type: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-500' },
  { type: 'image', label: 'Image/Diagram', icon: Image, color: 'text-blue-500' },
  { type: 'text', label: 'Text Document', icon: File, color: 'text-orange-500' },
  { type: 'url', label: 'Web URL', icon: Link2, color: 'text-green-500' },
];

const outputTypes = [
  { id: 'summary', label: 'Summary' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz Questions' },
  { id: 'notes', label: 'Structured Notes' },
];

const UploadToLearn = () => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['summary', 'flashcards']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedContent, setProcessedContent] = useState<null | {
    title: string;
    summary?: string;
    flashcards?: Array<{ question: string; answer: string }>;
    quiz?: Array<{ question: string; options: string[]; answer: string }>;
    notes?: string;
  }>(null);
  
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Filter files based on activeTab
    const filteredFiles = droppedFiles.filter(file => {
      if (activeTab === 'pdf') return file.type === 'application/pdf';
      if (activeTab === 'image') return file.type.startsWith('image/');
      if (activeTab === 'text') return file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');
      return true;
    });
    
    if (filteredFiles.length === 0) {
      toast({
        title: "Invalid file format",
        description: `Please upload ${activeTab === 'pdf' ? 'PDF documents' : activeTab === 'image' ? 'image files' : 'text files'}.`,
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => [...prev, ...filteredFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleOutputToggle = (outputId: string) => {
    setSelectedOutputs(prev => 
      prev.includes(outputId)
        ? prev.filter(id => id !== outputId)
        : [...prev, outputId]
    );
  };

  const handleProcess = async () => {
    if ((activeTab !== 'url' && files.length === 0) || (activeTab === 'url' && !url)) {
      toast({
        title: "No content to process",
        description: activeTab === 'url' ? "Please enter a valid URL" : "Please upload at least one file",
        variant: "destructive"
      });
      return;
    }

    if (selectedOutputs.length === 0) {
      toast({
        title: "No outputs selected",
        description: "Please select at least one output type",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedContent(null);

    try {
      // Simulate file processing with progress updates
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Generate mock processed content
      const mockContent: any = {
        title: activeTab === 'url' 
          ? 'Web Content Analysis' 
          : files[0]?.name || 'Uploaded Document',
      };
      
      if (selectedOutputs.includes('summary')) {
        mockContent.summary = "This document provides a comprehensive overview of the subject matter. The main topics covered include key principles, methodologies, and practical applications. The author presents a well-structured argument that builds upon established research while introducing novel perspectives. Several case studies are utilized to illustrate theoretical concepts in real-world scenarios.";
      }
      
      if (selectedOutputs.includes('flashcards')) {
        mockContent.flashcards = [
          { question: "What are the key principles discussed in the document?", answer: "The document discusses three key principles: principle A related to foundation concepts, principle B addressing methodological approaches, and principle C concerning practical implementations." },
          { question: "How does the author support the main argument?", answer: "The author supports the main argument through a combination of theoretical frameworks, empirical evidence from prior studies, and illustrative case studies from diverse contexts." },
          { question: "What novel perspective does the author introduce?", answer: "The author introduces a novel integrated framework that combines elements from multiple disciplines to address the limitations of traditional approaches in this field." },
        ];
      }
      
      if (selectedOutputs.includes('quiz')) {
        mockContent.quiz = [
          { 
            question: "Which of the following best represents the author's main thesis?", 
            options: [
              "Traditional approaches are fundamentally flawed", 
              "A multidisciplinary perspective yields better results", 
              "Practical applications should be prioritized over theory", 
              "Historical context is essential for understanding current developments"
            ], 
            answer: "A multidisciplinary perspective yields better results" 
          },
          { 
            question: "What evidence type is LEAST utilized in the document?", 
            options: [
              "Case studies", 
              "Statistical analysis", 
              "Expert opinions", 
              "Historical precedents"
            ], 
            answer: "Statistical analysis" 
          },
          { 
            question: "Which conclusion can be drawn from the document?", 
            options: [
              "The field is still in its early developmental stages", 
              "Current methodologies are sufficient for future challenges", 
              "Integration of diverse perspectives enhances understanding", 
              "Traditional frameworks should be abandoned entirely"
            ], 
            answer: "Integration of diverse perspectives enhances understanding" 
          },
        ];
      }
      
      if (selectedOutputs.includes('notes')) {
        mockContent.notes = "# Document Structure\n\n## Introduction\n- Presents the problem context\n- Establishes importance of the topic\n- Outlines the document structure\n\n## Literature Review\n- Reviews previous research and approaches\n- Identifies gaps in existing literature\n- Positions current work within the field\n\n## Methodology\n- Explains approach taken\n- Justifies selection of methods\n- Addresses limitations\n\n## Key Findings\n- Finding 1: Relationship between variables X and Y\n- Finding 2: Impact of context on outcomes\n- Finding 3: Effectiveness of proposed solutions\n\n## Conclusion\n- Summarizes main points\n- Discusses implications\n- Suggests areas for future research";
      }
      
      setProcessedContent(mockContent);
      
      toast({
        title: "Processing complete",
        description: "Your content has been successfully analyzed and converted.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUploadInterface = () => {
    return (
      <div>
        {activeTab !== 'url' ? (
          <div 
            className={`
              border-2 border-dashed rounded-lg p-8 
              ${files.length > 0 ? 'border-primary/70 bg-primary/5' : 'border-border'} 
              transition-colors hover:border-primary/50 hover:bg-primary/5
            `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {files.length > 0 ? 'Files Added' : 'Drop your files here'}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {activeTab === 'pdf' && 'Upload PDF documents to extract learning content'}
                {activeTab === 'image' && 'Upload images, diagrams, or screenshots'}
                {activeTab === 'text' && 'Upload text files (.txt, .md)'}
              </p>
              
              <div className="relative mb-4">
                <Button
                  variant="outline"
                  className="relative z-10"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept={
                    activeTab === 'pdf' ? '.pdf' : 
                    activeTab === 'image' ? 'image/*' : 
                    '.txt,.md,.text'
                  }
                  onChange={handleFileInputChange}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                {activeTab === 'pdf' && 'Supports PDF documents up to 50MB'}
                {activeTab === 'image' && 'Supports PNG, JPG, JPEG, WebP, etc.'}
                {activeTab === 'text' && 'Supports TXT, MD files'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Enter Website URL</h3>
            <div className="flex gap-3">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (url) {
                    toast({
                      title: "URL added",
                      description: `Added ${url} for processing`,
                    });
                  }
                }}
                disabled={!url}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter the URL of an article, research paper, or educational content.
            </p>
          </div>
        )}

        {/* File List */}
        {activeTab !== 'url' && files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Files to Process ({files.length})</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-primary/10 ${
                      file.type === 'application/pdf' ? 'text-red-500' :
                      file.type.startsWith('image/') ? 'text-blue-500' :
                      'text-orange-500'
                    }`}>
                      {file.type === 'application/pdf' ? (
                        <FileText className="h-4 w-4" />
                      ) : file.type.startsWith('image/') ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[280px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(files.length > 0 || (activeTab === 'url' && url)) && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Select Output Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {outputTypes.map((output) => (
                  <div
                    key={output.id}
                    className={`
                      flex items-center gap-2 border rounded-md p-3 cursor-pointer transition-colors
                      ${selectedOutputs.includes(output.id) 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'hover:bg-accent'}
                    `}
                    onClick={() => handleOutputToggle(output.id)}
                  >
                    <Checkbox 
                      id={`output-${output.id}`}
                      checked={selectedOutputs.includes(output.id)}
                      onCheckedChange={() => handleOutputToggle(output.id)}
                    />
                    <Label htmlFor={`output-${output.id}`} className="cursor-pointer">
                      {output.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Process Content
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderProcessingState = () => {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-6"></div>
        <h3 className="text-xl font-semibold mb-2">Processing Your Content</h3>
        <p className="text-muted-foreground text-center mb-6">
          Our AI is analyzing your content and generating learning materials.
        </p>
        <div className="w-full max-w-md mb-2">
          <Progress value={processingProgress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground">
          {processingProgress}% complete
        </p>
      </div>
    );
  };

  const renderProcessedContent = () => {
    if (!processedContent) return null;

    return (
      <div className="space-y-6">
        <div className="bg-accent/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-1">{processedContent.title}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(processedContent).filter(key => key !== 'title').map((type) => (
              <div key={type} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue={Object.keys(processedContent).filter(key => key !== 'title')[0]} className="w-full">
          <TabsList className="mb-4">
            {processedContent.summary && <TabsTrigger value="summary">Summary</TabsTrigger>}
            {processedContent.flashcards && <TabsTrigger value="flashcards">Flashcards</TabsTrigger>}
            {processedContent.quiz && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
            {processedContent.notes && <TabsTrigger value="notes">Notes</TabsTrigger>}
          </TabsList>
          
          {processedContent.summary && (
            <TabsContent value="summary" className="min-h-[300px]">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Document Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{processedContent.summary}</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {processedContent.flashcards && (
            <TabsContent value="flashcards" className="min-h-[300px]">
              <div className="space-y-4">
                {processedContent.flashcards.map((flashcard, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-2">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="font-medium">{flashcard.question}</p>
                    </CardContent>
                    <Separator />
                    <CardHeader className="bg-accent/10 pb-2">
                      <CardTitle className="text-base">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p>{flashcard.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
          
          {processedContent.quiz && (
            <TabsContent value="quiz" className="min-h-[300px]">
              <div className="space-y-6">
                {processedContent.quiz.map((quizItem, qIndex) => (
                  <Card key={qIndex}>
                    <CardHeader>
                      <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                      <CardDescription>{quizItem.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {quizItem.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <Checkbox id={`q${qIndex}-o${oIndex}`} />
                            <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 flex justify-between">
                      <span className="text-xs text-muted-foreground">Click to select your answer</span>
                      <Button variant="ghost" size="sm">Check Answer</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
          
          {processedContent.notes && (
            <TabsContent value="notes" className="min-h-[300px]">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Structured Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto">
                      {processedContent.notes}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Save to Library
          </Button>
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
          <Button 
            onClick={() => {
              setFiles([]);
              setUrl('');
              setProcessedContent(null);
            }}
            variant="ghost" 
            size="sm" 
            className="ml-auto"
          >
            Process New Content
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Upload-to-Learn Engine</h1>
        <p className="text-muted-foreground">
          Convert documents, images, text, or web content into learning materials.
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Brain className="h-4 w-4 text-primary" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription className="mt-2 text-sm">
          <ol className="space-y-1 list-decimal list-inside">
            <li>Upload or link to your content (PDF, images, text files, or URLs)</li>
            <li>Our AI analyzes the content and extracts the key information</li>
            <li>Choose what type of learning materials you want to generate</li>
            <li>Review and save your personalized study materials</li>
          </ol>
        </AlertDescription>
      </Alert>

      <Card className="min-h-[600px]">
        {!isProcessing && !processedContent && (
          <CardHeader>
            <CardTitle>
              Select Content Type
            </CardTitle>
            <CardDescription>
              Choose the type of content you want to process
            </CardDescription>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid grid-cols-4 w-full">
                {fileTypes.map((type) => (
                  <TabsTrigger key={type.type} value={type.type} className="flex items-center gap-2">
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
        )}

        <CardContent>
          {isProcessing ? (
            renderProcessingState()
          ) : processedContent ? (
            renderProcessedContent()
          ) : (
            renderUploadInterface()
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadToLearn;
