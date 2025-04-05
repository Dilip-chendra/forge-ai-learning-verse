
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  Sparkles, 
  Calendar, 
  Loader2, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  BookOpen,
  Clock,
  FileText,
  Video,
  Code,
  ChevronRight,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const timeframes = [
  { id: '30', label: '30 days', description: 'Fundamentals & quick introduction' },
  { id: '60', label: '60 days', description: 'Solid foundation with practice' },
  { id: '90', label: '90 days', description: 'Comprehensive skill development' },
];

const SkillForge = () => {
  const [skillInput, setSkillInput] = useState('');
  const [timeframe, setTimeframe] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<null | {
    title: string;
    description: string;
    milestones: Array<{
      title: string;
      description: string;
      completed: boolean;
      resources: Array<{
        type: 'article' | 'video' | 'exercise' | 'project';
        title: string;
        url?: string;
        duration?: string;
      }>;
      tasks: Array<{
        title: string;
        completed: boolean;
      }>;
    }>;
  }>(null);
  
  const { toast } = useToast();

  const handleGenerateRoadmap = async () => {
    if (!skillInput) {
      toast({
        title: "Skill input required",
        description: "Please enter a skill you want to learn",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedRoadmap(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock roadmap data
      const mockRoadmap = {
        title: `Become a ${skillInput} Professional`,
        description: `This custom learning roadmap will guide you through the journey of becoming proficient in ${skillInput} within a ${timeframe}-day timeframe. Follow the milestones, complete the tasks, and utilize the recommended resources to build your skills.`,
        milestones: [
          {
            title: `${skillInput} Fundamentals`,
            description: `Learn the basic concepts and principles of ${skillInput}. This milestone will establish the foundation for your learning journey.`,
            completed: false,
            resources: [
              {
                type: 'article',
                title: `Introduction to ${skillInput}`,
                url: '#',
                duration: '20 min read'
              },
              {
                type: 'video',
                title: `${skillInput} for Beginners`,
                url: '#',
                duration: '45 min'
              },
              {
                type: 'exercise',
                title: 'Fundamentals Practice Quiz',
                url: '#',
              }
            ],
            tasks: [
              {
                title: `Complete the Introduction to ${skillInput} article`,
                completed: false
              },
              {
                title: `Watch the ${skillInput} for Beginners video course`,
                completed: false
              },
              {
                title: 'Take the fundamentals quiz and achieve at least 70%',
                completed: false
              }
            ]
          },
          {
            title: `Intermediate ${skillInput} Concepts`,
            description: 'Build upon your foundational knowledge by learning more advanced concepts and techniques.',
            completed: false,
            resources: [
              {
                type: 'article',
                title: `Advanced ${skillInput} Techniques`,
                url: '#',
                duration: '30 min read'
              },
              {
                type: 'video',
                title: `${skillInput} Deep Dive`,
                url: '#',
                duration: '1.5 hours'
              },
              {
                type: 'project',
                title: 'Mini-Project: Apply Your Knowledge',
                url: '#',
              }
            ],
            tasks: [
              {
                title: 'Study and take notes on advanced techniques',
                completed: false
              },
              {
                title: 'Complete at least one hands-on exercise',
                completed: false
              },
              {
                title: 'Build and submit your mini-project',
                completed: false
              }
            ]
          },
          {
            title: `${skillInput} in Practice`,
            description: 'Apply your knowledge to real-world scenarios and build a portfolio piece to showcase your skills.',
            completed: false,
            resources: [
              {
                type: 'project',
                title: `${skillInput} Capstone Project`,
                url: '#',
              },
              {
                type: 'article',
                title: 'Industry Best Practices',
                url: '#',
                duration: '25 min read'
              },
              {
                type: 'video',
                title: 'Expert Tips and Tricks',
                url: '#',
                duration: '1 hour'
              }
            ],
            tasks: [
              {
                title: 'Plan your capstone project',
                completed: false
              },
              {
                title: 'Implement the project following best practices',
                completed: false
              },
              {
                title: 'Document your process and results',
                completed: false
              },
              {
                title: 'Present your project and receive feedback',
                completed: false
              }
            ]
          }
        ]
      };

      setGeneratedRoadmap(mockRoadmap);
      
      toast({
        title: "Roadmap generated successfully!",
        description: `Your ${timeframe}-day plan to ${skillInput} mastery is ready.`
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateProgress = () => {
    if (!generatedRoadmap) return 0;
    
    const totalTasks = generatedRoadmap.milestones.reduce(
      (total, milestone) => total + milestone.tasks.length, 0
    );
    
    const completedTasks = generatedRoadmap.milestones.reduce(
      (total, milestone) => total + milestone.tasks.filter(task => task.completed).length, 0
    );
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const toggleTaskStatus = (milestoneIndex: number, taskIndex: number) => {
    if (!generatedRoadmap) return;
    
    setGeneratedRoadmap(prevRoadmap => {
      if (!prevRoadmap) return null;
      
      const updatedMilestones = [...prevRoadmap.milestones];
      const milestone = { ...updatedMilestones[milestoneIndex] };
      const tasks = [...milestone.tasks];
      
      tasks[taskIndex] = { 
        ...tasks[taskIndex], 
        completed: !tasks[taskIndex].completed 
      };
      
      milestone.tasks = tasks;
      
      // Check if all tasks in this milestone are completed
      milestone.completed = tasks.every(task => task.completed);
      
      updatedMilestones[milestoneIndex] = milestone;
      
      return {
        ...prevRoadmap,
        milestones: updatedMilestones
      };
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'exercise':
        return <BookOpen className="h-4 w-4" />;
      case 'project':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">AI SkillForge</h1>
        <p className="text-muted-foreground">
          Create personalized learning roadmaps for any skill you want to master.
        </p>
      </div>

      {!generatedRoadmap ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Create Your Learning Path
            </CardTitle>
            <CardDescription>
              Enter the skill you want to learn, and we'll generate a personalized roadmap to guide your journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skill-input">What would you like to learn? <span className="text-destructive">*</span></Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <Input 
                  id="skill-input"
                  className="pl-10"
                  placeholder="e.g., Web Development, Machine Learning, Data Science..." 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Be specific about what you want to learn for more targeted recommendations.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Choose your learning timeframe <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={timeframe}
                onValueChange={setTimeframe}
                className="grid gap-4 md:grid-cols-3"
              >
                {timeframes.map((option) => (
                  <div key={option.id}>
                    <RadioGroupItem
                      value={option.id}
                      id={`timeframe-${option.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`timeframe-${option.id}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 mb-2">
                        {option.id === "30" ? (
                          <Clock className="h-4 w-4" />
                        ) : option.id === "60" ? (
                          <Calendar className="h-4 w-4" />
                        ) : (
                          <Briefcase className="h-4 w-4" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setSkillInput('');
                setTimeframe('30');
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating || !skillInput}
              className="min-w-[150px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {generatedRoadmap.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {generatedRoadmap.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {timeframe}-Day Plan
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Overall Progress</div>
                  <div className="text-sm font-medium">{calculateProgress()}%</div>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Tabs defaultValue="roadmap" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="roadmap" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Roadmap
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="roadmap" className="space-y-6">
                  {generatedRoadmap.milestones.map((milestone, milestoneIndex) => (
                    <Card key={milestoneIndex} className={milestone.completed ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/10" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {milestone.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-xs">
                                {milestoneIndex + 1}
                              </div>
                            )}
                            {milestone.title}
                          </CardTitle>
                          <Badge variant={milestone.completed ? "outline" : "secondary"} className={milestone.completed ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""}>
                            {milestone.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <CardDescription>{milestone.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <h4 className="text-sm font-medium mb-2">Tasks:</h4>
                        <div className="space-y-2">
                          {milestone.tasks.map((task, taskIndex) => (
                            <div 
                              key={taskIndex} 
                              className={`flex items-start gap-2 p-2 rounded-md ${task.completed ? "bg-green-50/70 dark:bg-green-950/10" : "hover:bg-accent"}`}
                              onClick={() => toggleTaskStatus(milestoneIndex, taskIndex)}
                            >
                              <div className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-sm border ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-primary/40"}`}>
                                {task.completed && <Check className="h-3.5 w-3.5" />}
                              </div>
                              <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/5">
                          View Resources
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="resources" className="space-y-6">
                  {generatedRoadmap.milestones.map((milestone, milestoneIndex) => (
                    <div key={milestoneIndex} className="space-y-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          {milestoneIndex + 1}
                        </div>
                        {milestone.title}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {milestone.resources.map((resource, resourceIndex) => (
                          <Card key={resourceIndex} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2 flex flex-row items-start gap-2">
                              <div className={`p-2 rounded-md ${
                                resource.type === 'article' ? 'bg-blue-500/10 text-blue-500' : 
                                resource.type === 'video' ? 'bg-red-500/10 text-red-500' :
                                resource.type === 'exercise' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-green-500/10 text-green-500'
                              }`}>
                                {getResourceIcon(resource.type)}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{resource.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-[10px] font-normal">
                                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                  </Badge>
                                  {resource.duration && (
                                    <span className="text-xs flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {resource.duration}
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardFooter className="p-2 pt-0 flex justify-end">
                              <Button variant="ghost" size="sm" className="gap-1">
                                Open Resource
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="calendar" className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      We're working on a calendar view to help you schedule your learning activities.
                      Check back soon for this feature!
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedRoadmap(null);
                  setSkillInput('');
                  setTimeframe('30');
                }}
              >
                Create New Roadmap
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to My Learning
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillForge;
