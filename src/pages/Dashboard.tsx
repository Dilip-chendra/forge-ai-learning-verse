
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BrainCircuit, 
  Upload, 
  Target, 
  MessageSquare, 
  BarChart3, 
  BookCopy, 
  Zap, 
  Clock, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';

// Quick insights data
const quickInsights = [
  { label: 'Learning Minutes', value: '45', icon: Clock, change: '+15%', up: true },
  { label: 'Knowledge Score', value: '712', icon: BrainCircuit, change: '+8%', up: true },
  { label: 'Completed Quizzes', value: '12', icon: CheckCircle2, change: '0%', up: null },
  { label: 'Weekly Streak', value: '3', icon: Zap, change: '-1', up: false }
];

// Next steps tiles
const nextStepTiles = [
  {
    title: "Continue Data Structures",
    description: "Pick up where you left off in Arrays & Linked Lists",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-500",
    progress: 65,
    path: "/study-generator"
  },
  {
    title: "React Fundamentals",
    description: "You have a quiz due in 2 days",
    icon: CheckCircle2,
    color: "bg-orange-500/10 text-orange-500",
    progress: 80,
    path: "/ai-tutor"
  },
  {
    title: "SQL Basics",
    description: "New module available in your roadmap",
    icon: Target,
    color: "bg-green-500/10 text-green-500",
    progress: 30,
    path: "/skill-forge"
  }
];

// Featured Learning Paths
const featuredPaths = [
  {
    title: "Web Development",
    description: "From HTML basics to full-stack applications",
    progress: 25,
    path: "/skill-forge"
  },
  {
    title: "Data Science",
    description: "Master data analysis and machine learning",
    progress: 0,
    path: "/skill-forge"
  },
  {
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications",
    progress: 0,
    path: "/skill-forge"
  }
];

// Features
const features = [
  { 
    title: "Smart Study Generator", 
    description: "Create AI-powered study materials",
    icon: BrainCircuit,
    path: "/study-generator",
    color: "bg-eduforge-purple text-white"
  },
  { 
    title: "Upload-to-Learn", 
    description: "Convert files to learning materials",
    icon: Upload,
    path: "/upload-to-learn",
    color: "bg-eduforge-teal text-white"
  },
  { 
    title: "AI SkillForge", 
    description: "Build custom learning paths",
    icon: Target,
    path: "/skill-forge",
    color: "bg-eduforge-amber text-white"
  },
  { 
    title: "AI Tutor", 
    description: "Get help when you need it",
    icon: MessageSquare,
    path: "/ai-tutor",
    color: "bg-blue-500 text-white"
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Good {timeOfDay()}, {user?.name}</h1>
        <p className="text-muted-foreground">Here's your learning overview and recommendations.</p>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickInsights.map((insight, index) => (
          <Card key={index} className="border-border/40">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{insight.label}</p>
                  <p className="text-2xl font-bold">{insight.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  insight.up === true 
                    ? 'bg-green-500/10 text-green-500' 
                    : insight.up === false 
                      ? 'bg-red-500/10 text-red-500' 
                      : 'bg-gray-500/10 text-gray-500'
                }`}>
                  <insight.icon className="w-5 h-5" />
                </div>
              </div>
              {insight.change && (
                <div className={`text-xs mt-2 ${
                  insight.up === true 
                    ? 'text-green-500' 
                    : insight.up === false 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                }`}>
                  {insight.change} {insight.up !== null && (insight.up ? '↑' : '↓')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning & Next Steps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Continue Where You Left Off</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextStepTiles.map((tile, index) => (
            <Card key={index} className="border-border/40 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tile.title}</CardTitle>
                  <div className={`p-2 rounded-full ${tile.color}`}>
                    <tile.icon className="w-4 h-4" />
                  </div>
                </div>
                <CardDescription>{tile.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-2">
                  <Progress value={tile.progress} className="h-2" />
                  <span className="text-xs font-medium">{tile.progress}%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link to={tile.path}>Continue</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Library */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Learning Paths</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/library">View all</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPaths.map((path, index) => (
            <Card key={index} className="border-border/40 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                {path.progress > 0 ? (
                  <div className="flex items-center gap-2">
                    <Progress value={path.progress} className="h-2" />
                    <span className="text-xs font-medium">{path.progress}%</span>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Not started yet</div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant={path.progress > 0 ? "ghost" : "default"} size="sm" asChild className="w-full">
                  <Link to={path.path}>{path.progress > 0 ? "Continue" : "Start Learning"}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">EduForge AI Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/40 hover:shadow-md transition-all">
              <CardContent className="p-0">
                <Link to={feature.path}>
                  <div className="flex flex-col h-full">
                    <div className={`${feature.color} p-4 rounded-t-lg`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
