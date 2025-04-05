
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, Search, BrainCircuit, BarChart3, CheckCircle2 } from 'lucide-react';
import ProfileSetup from '@/components/career/ProfileSetup';
import JobPreferences from '@/components/career/JobPreferences';
import JobDashboard from '@/components/career/JobDashboard';
import { UserProfile, JobPreferences as JobPreferencesType } from '@/types/career';

const defaultProfile: UserProfile = {
  skills: [],
  experience: [],
  education: []
};

const defaultPreferences: JobPreferencesType = {
  roles: [],
  locations: [],
  locationType: [],
  companyTypes: [],
  experienceLevel: [],
  remote: false
};

const CareerAgentX = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [preferences, setPreferences] = useState<JobPreferencesType>(defaultPreferences);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isActivated, setIsActivated] = useState(false);

  const handleActivate = () => {
    setIsActivated(true);
    setActiveTab('dashboard');
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (updatedProfile.resumeUrl) {
      setResumeUploaded(true);
    }
  };

  const handlePreferencesUpdate = (updatedPreferences: JobPreferencesType) => {
    setPreferences(updatedPreferences);
  };

  const nextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      handleActivate();
    }
  };

  const prevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">CareerAgentX</h1>
        <p className="text-muted-foreground">Let AI find and apply for your dream jobs — 24/7</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="onboarding" disabled={isActivated}>Initial Setup</TabsTrigger>
          <TabsTrigger value="dashboard" disabled={!isActivated}>Job Dashboard</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isActivated}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Let's set up your Career Agent</CardTitle>
              <CardDescription>
                Follow these steps to help our AI find and apply to the perfect jobs for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-8">
                <div className={`flex flex-col items-center ${onboardingStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${onboardingStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs">Resume</span>
                </div>
                <div className="flex-1 h-[2px] bg-muted mx-2">
                  <div className={`h-full bg-primary transition-all ${onboardingStep >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${onboardingStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${onboardingStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Search className="h-5 w-5" />
                  </div>
                  <span className="text-xs">Preferences</span>
                </div>
                <div className="flex-1 h-[2px] bg-muted mx-2">
                  <div className={`h-full bg-primary transition-all ${isActivated ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${isActivated ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActivated ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <span className="text-xs">Activate</span>
                </div>
              </div>

              {onboardingStep === 1 && (
                <ProfileSetup profile={profile} onUpdate={handleProfileUpdate} />
              )}

              {onboardingStep === 2 && (
                <JobPreferences preferences={preferences} onUpdate={handlePreferencesUpdate} />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={onboardingStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={onboardingStep === 1 && !resumeUploaded}
              >
                {onboardingStep < 2 ? 'Next' : 'Activate Career Agent'}
              </Button>
            </CardFooter>
          </Card>

          {!isActivated && (
            <Card>
              <CardHeader>
                <CardTitle>How CareerAgentX Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 space-y-2">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Upload Once</h3>
                    <p className="text-sm text-muted-foreground">Upload your resume or import from LinkedIn</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 space-y-2">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">AI Job Matching</h3>
                    <p className="text-sm text-muted-foreground">Our AI scans 1000s of job listings to find matches</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 space-y-2">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Apply Automatically</h3>
                    <p className="text-sm text-muted-foreground">AI tailors resume & cover letter for each application</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <JobDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Application Analytics</CardTitle>
              <CardDescription>Insights into your job applications and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Analytics will appear once you have applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerAgentX;
