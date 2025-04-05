
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Target, Clock, CheckCircle, X, PlusCircle, Calendar, ArrowRight } from 'lucide-react';

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    matchScore: 95,
    date: '2025-04-04',
    status: 'Applied'
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupHub',
    location: 'New York',
    matchScore: 88,
    date: '2025-04-03',
    status: 'Interview Scheduled'
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'Global Systems',
    location: 'Remote',
    matchScore: 82,
    date: '2025-04-02',
    status: 'Applied'
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'InnovateTech',
    location: 'San Francisco',
    matchScore: 78,
    date: '2025-04-01',
    status: 'Rejected'
  }
];

const JobDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Applied</Badge>;
      case 'Interview Scheduled':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">Interview Scheduled</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Rejected</Badge>;
      case 'Offer Received':
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Offer Received</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Interview Scheduled':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'Rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'Offer Received':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Scan New Jobs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">4</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1</CardTitle>
            <CardDescription>Interviews</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Offers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">25%</CardTitle>
            <CardDescription>Response Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="interviews">Upcoming Interviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>Jobs that match your profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-1 md:gap-2">
                          <span>{job.company}</span>
                          <span className="hidden md:inline">•</span>
                          <span>{job.location}</span>
                          <span className="hidden md:inline">•</span>
                          <span>Posted: {job.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="flex flex-col items-center md:items-end">
                          <span className="text-lg font-bold text-primary">{job.matchScore}%</span>
                          <span className="text-xs text-muted-foreground">Match Score</span>
                        </div>
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          {getStatusBadge(job.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Manage your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredJobs.filter(job => job.status === 'Interview Scheduled').length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs
                    .filter(job => job.status === 'Interview Scheduled')
                    .map((job) => (
                      <div 
                        key={job.id}
                        className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-purple-50 text-purple-600">
                                April 10, 2025 • 10:00 AM
                              </Badge>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button size="sm">Prepare</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No interviews scheduled yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDashboard;
