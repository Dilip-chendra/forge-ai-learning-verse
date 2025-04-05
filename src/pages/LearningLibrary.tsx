import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Image, Mic, Video, Filter } from 'lucide-react';
import { aiMemory } from '@/utils/aiMemory';
import { LearningResource } from '@/types/aiTutor';
import { format } from 'date-fns';

const LearningLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Get resources from memory and convert to LearningResource type
  const uploadedResources = aiMemory.getResources().map(resource => ({
    id: resource.id,
    title: resource.name,
    type: resource.type,
    url: resource.url,
    content: resource.content,
    date: resource.createdAt
  }));

  // Get learning topics and convert to LearningResource type
  const learningTopics = aiMemory.getLearningTopics().map(topic => ({
    id: topic.id,
    title: topic.name,
    type: 'topic' as const,
    date: topic.lastStudied,
    proficiency: topic.proficiency
  }));

  // Combine all resources
  const allResources: LearningResource[] = [
    ...uploadedResources,
    ...learningTopics
  ];

  // Filter resources based on search and active tab
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    return matchesSearch && matchesType;
  });

  // Helper function to get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'topic':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Helper function to format date
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return format(new Date(date), 'PP');
    }
    return format(date, 'PP');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Learning Library</h1>
        <p className="text-muted-foreground">Access all your learning resources in one place.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="topic">Learning Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredResources.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          <span className="capitalize">{resource.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell>{formatDate(resource.date)}</TableCell>
                      <TableCell>
                        {resource.url ? (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost">Review</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No resources found</CardTitle>
                <CardDescription className="text-center max-w-md">
                  {searchQuery 
                    ? `No resources match your search query "${searchQuery}". Try a different search term.` 
                    : 'Start uploading resources or engaging with the AI tutor to build your learning library.'}
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningLibrary;
