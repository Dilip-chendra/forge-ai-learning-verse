
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  FileText,
  Brain,
  CheckSquare,
  Lightbulb,
  Sparkles,
  Loader2,
  Book,
  GraduationCap,
  BrainCircuit,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Learning material types
const materialTypes = [
  { value: 'explanation', label: 'Detailed Explanation', icon: BookOpen },
  { value: 'flashcards', label: 'Flashcards', icon: FileText },
  { value: 'quiz', label: 'Quiz Questions', icon: CheckSquare },
  { value: 'summary', label: 'Concise Summary', icon: Brain },
  { value: 'examples', label: 'Practical Examples', icon: Lightbulb },
];

// Education levels
const educationLevels = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
  { value: 'college', label: 'College / University' },
  { value: 'professional', label: 'Professional / Advanced' },
];

const StudyGenerator = () => {
  const [topic, setTopic] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [depth, setDepth] = useState([50]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['explanation']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<null | {
    explanation?: string;
    flashcards?: Array<{ question: string; answer: string }>;
    quiz?: Array<{ question: string; options: string[]; answer: string }>;
    summary?: string;
    examples?: string[];
  }>(null);
  const { toast } = useToast();

  const handleMaterialToggle = (value: string) => {
    setSelectedMaterials(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleGenerate = async () => {
    if (!topic || !educationLevel || selectedMaterials.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before generating content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock generated content based on selected materials
      const mockContent: any = {};
      
      if (selectedMaterials.includes('explanation')) {
        mockContent.explanation = `# Understanding ${topic}\n\nThis is a detailed explanation of ${topic} at the ${educationLevel} level. The content is designed to help you achieve your learning goal of "${learningGoal}".\n\n## Key Concepts\n\n1. First key concept of ${topic}\n2. Second key concept\n3. Third key concept\n\n## How It Works\n\nThe fundamental principle behind ${topic} involves several interconnected processes. First, you need to understand that...`;
      }
      
      if (selectedMaterials.includes('flashcards')) {
        mockContent.flashcards = [
          { question: `What is the main purpose of ${topic}?`, answer: `The main purpose is to...` },
          { question: `Define the key components of ${topic}`, answer: `The key components include...` },
          { question: `How does ${topic} relate to other concepts?`, answer: `${topic} relates to other concepts by...` },
          { question: `What are the limitations of ${topic}?`, answer: `The limitations include...` },
        ];
      }
      
      if (selectedMaterials.includes('quiz')) {
        mockContent.quiz = [
          { 
            question: `Which of the following best describes ${topic}?`, 
            options: ['Option A', 'Option B', 'Option C', 'Option D'], 
            answer: 'Option B' 
          },
          { 
            question: `What is a key characteristic of ${topic}?`, 
            options: ['Characteristic A', 'Characteristic B', 'Characteristic C', 'Characteristic D'], 
            answer: 'Characteristic C' 
          },
          { 
            question: `How is ${topic} typically applied?`, 
            options: ['Application A', 'Application B', 'Application C', 'Application D'], 
            answer: 'Application A' 
          },
        ];
      }
      
      if (selectedMaterials.includes('summary')) {
        mockContent.summary = `${topic} is a concept that focuses on... The main principles include... It is commonly used for... Understanding ${topic} is important because...`;
      }
      
      if (selectedMaterials.includes('examples')) {
        mockContent.examples = [
          `Example 1: In this scenario, ${topic} is applied by...`,
          `Example 2: A real-world application of ${topic} can be seen in...`,
          `Example 3: To demonstrate ${topic} in practice, consider...`,
        ];
      }
      
      setGeneratedContent(mockContent);
      
      toast({
        title: "Content generated successfully!",
        description: `Your personalized ${topic} learning materials are ready.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (!generatedContent) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Content Generated Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Fill out the form to generate AI-powered learning materials tailored to your needs.
            </p>
          </div>
        </div>
      );
    }

    return (
      <Tabs defaultValue={selectedMaterials[0]} className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          {selectedMaterials.map(material => {
            const materialInfo = materialTypes.find(m => m.value === material);
            return (
              <TabsTrigger key={material} value={material} className="flex items-center gap-2">
                {materialInfo?.icon && <materialInfo.icon className="h-4 w-4" />}
                {materialInfo?.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Explanation Content */}
        {generatedContent.explanation && (
          <TabsContent value="explanation" className="min-h-[400px]">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold mb-4">{topic}</h2>
              <div className="whitespace-pre-line">
                {generatedContent.explanation}
              </div>
            </div>
          </TabsContent>
        )}
        
        {/* Flashcards Content */}
        {generatedContent.flashcards && (
          <TabsContent value="flashcards" className="min-h-[400px]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">{topic} Flashcards</h2>
              {generatedContent.flashcards.map((flashcard, index) => (
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
        
        {/* Quiz Content */}
        {generatedContent.quiz && (
          <TabsContent value="quiz" className="min-h-[400px]">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">{topic} Quiz</h2>
              {generatedContent.quiz.map((quizItem, qIndex) => (
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
        
        {/* Summary Content */}
        {generatedContent.summary && (
          <TabsContent value="summary" className="min-h-[400px]">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold mb-4">{topic} Summary</h2>
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="whitespace-pre-line">{generatedContent.summary}</p>
              </div>
            </div>
          </TabsContent>
        )}
        
        {/* Examples Content */}
        {generatedContent.examples && (
          <TabsContent value="examples" className="min-h-[400px]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">{topic} Examples</h2>
              {generatedContent.examples.map((example, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-eduforge-amber" />
                      Example {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Smart Study Generator</h1>
        <p className="text-muted-foreground">
          Create custom AI-generated learning materials for any topic or concept.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Define Your Learning
            </CardTitle>
            <CardDescription>
              Provide details about what you want to learn, and we'll generate personalized materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Concept <span className="text-destructive">*</span></Label>
              <Input 
                id="topic" 
                placeholder="e.g., Photosynthesis, Linear Algebra, Machine Learning..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="learning-goal">Learning Goal</Label>
              <Textarea 
                id="learning-goal" 
                placeholder="What do you want to achieve by learning this topic?" 
                className="resize-none"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education-level">Education Level <span className="text-destructive">*</span></Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger id="education-level">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Depth of Content</Label>
              <div className="px-1 py-4">
                <Slider 
                  value={depth} 
                  onValueChange={setDepth} 
                  max={100} 
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Introductory</span>
                  <span>Balanced</span>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Learning Materials <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materialTypes.map((material) => (
                  <div
                    key={material.value}
                    className={`
                      flex items-center gap-2 border rounded-md p-3 cursor-pointer transition-colors
                      ${selectedMaterials.includes(material.value) 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'hover:bg-accent'}
                    `}
                    onClick={() => handleMaterialToggle(material.value)}
                  >
                    <Checkbox 
                      id={`material-${material.value}`}
                      checked={selectedMaterials.includes(material.value)}
                      onCheckedChange={() => handleMaterialToggle(material.value)}
                    />
                    <div className="flex items-center gap-2">
                      <material.icon className="h-4 w-4" />
                      <Label htmlFor={`material-${material.value}`} className="cursor-pointer">
                        {material.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic || !educationLevel || selectedMaterials.length === 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Learning Materials
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Generated Content Section */}
        <Card className="lg:min-h-[700px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Your Learning Materials
            </CardTitle>
            <CardDescription>
              {generatedContent 
                ? `AI-generated content for "${topic}"`
                : "Your custom learning content will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Generating Content</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Our AI is creating personalized learning materials for you...
                  </p>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </CardContent>
          {generatedContent && (
            <CardFooter className="border-t flex justify-between">
              <Button variant="outline" size="sm">
                Save to Library
              </Button>
              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudyGenerator;
