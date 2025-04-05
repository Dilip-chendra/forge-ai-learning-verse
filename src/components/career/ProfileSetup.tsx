
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/types/career';
import { FileText, Upload, Trash, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSetupProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ profile, onUpdate }) => {
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is PDF or DOCX
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'pdf' && fileExt !== 'docx') {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
      
      // In a real application, this would upload to a server
      // For now, we'll just set a placeholder URL
      const updatedProfile = {
        ...profile,
        resumeUrl: URL.createObjectURL(file),
      };
      onUpdate(updatedProfile);
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded",
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      const updatedProfile = {
        ...profile,
        skills: [...profile.skills, skillInput.trim()]
      };
      onUpdate(updatedProfile);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedProfile = {
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    };
    onUpdate(updatedProfile);
  };

  const handleLinkedInImport = () => {
    toast({
      title: "LinkedIn Import",
      description: "This feature will be available soon",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Upload your Resume</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your resume or import from LinkedIn to get started
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleResumeUpload}
              />
              <Label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="font-medium">Upload Resume</span>
                <span className="text-xs text-muted-foreground mt-1">PDF or DOCX (Max 5MB)</span>
              </Label>
            </div>

            {resumeFile && (
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium truncate max-w-[200px]">{resumeFile.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setResumeFile(null);
                    onUpdate({
                      ...profile,
                      resumeUrl: undefined
                    });
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
              <div className="flex space-x-2">
                <Input 
                  id="linkedin" 
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={profile.linkedin || ''}
                  onChange={(e) => onUpdate({...profile, linkedin: e.target.value})}
                />
                <Button onClick={handleLinkedInImport}>Import</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile (Optional)</Label>
              <Input 
                id="github" 
                placeholder="https://github.com/yourusername"
                value={profile.github || ''}
                onChange={(e) => onUpdate({...profile, github: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Website (Optional)</Label>
              <Input 
                id="portfolio" 
                placeholder="https://yourportfolio.com"
                value={profile.portfolio || ''}
                onChange={(e) => onUpdate({...profile, portfolio: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Key Skills</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Add a skill (e.g., JavaScript, React, Data Analysis)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <div 
                key={index}
                className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
              >
                {skill}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1"
                  onClick={() => removeSkill(skill)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
