
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  JobPreferences as JobPreferencesType, 
  JobRole, 
  CompanyType, 
  JobLocationType,
  ExperienceLevel 
} from '@/types/career';
import { Plus, X } from 'lucide-react';

interface JobPreferencesProps {
  preferences: JobPreferencesType;
  onUpdate: (preferences: JobPreferencesType) => void;
}

const JobPreferences: React.FC<JobPreferencesProps> = ({ preferences, onUpdate }) => {
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Predefined options
  const jobLocations: JobLocationType[] = ['Remote', 'On-site', 'Hybrid'];
  const companyTypes: CompanyType[] = ['Startup', 'MNC', 'NGO', 'Government', 'Enterprise'];
  const experienceLevels: ExperienceLevel[] = ['Intern', 'Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager'];

  const addRole = () => {
    if (roleInput.trim() && !preferences.roles.includes(roleInput.trim() as JobRole)) {
      onUpdate({
        ...preferences,
        roles: [...preferences.roles, roleInput.trim() as JobRole],
      });
      setRoleInput('');
    }
  };

  const removeRole = (role: JobRole) => {
    onUpdate({
      ...preferences,
      roles: preferences.roles.filter(r => r !== role),
    });
  };

  const addLocation = () => {
    if (locationInput.trim() && !preferences.locations.includes(locationInput.trim())) {
      onUpdate({
        ...preferences,
        locations: [...preferences.locations, locationInput.trim()],
      });
      setLocationInput('');
    }
  };

  const removeLocation = (location: string) => {
    onUpdate({
      ...preferences,
      locations: preferences.locations.filter(l => l !== location),
    });
  };

  const toggleLocationType = (type: JobLocationType) => {
    if (preferences.locationType.includes(type)) {
      onUpdate({
        ...preferences,
        locationType: preferences.locationType.filter(t => t !== type),
      });
    } else {
      onUpdate({
        ...preferences,
        locationType: [...preferences.locationType, type],
      });
    }
  };

  const toggleCompanyType = (type: CompanyType) => {
    if (preferences.companyTypes.includes(type)) {
      onUpdate({
        ...preferences,
        companyTypes: preferences.companyTypes.filter(t => t !== type),
      });
    } else {
      onUpdate({
        ...preferences,
        companyTypes: [...preferences.companyTypes, type],
      });
    }
  };

  const toggleExperienceLevel = (level: ExperienceLevel) => {
    if (preferences.experienceLevel.includes(level)) {
      onUpdate({
        ...preferences,
        experienceLevel: preferences.experienceLevel.filter(l => l !== level),
      });
    } else {
      onUpdate({
        ...preferences,
        experienceLevel: [...preferences.experienceLevel, level],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Job Roles</h3>
        <p className="text-sm text-muted-foreground">
          What kind of roles are you looking for?
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Add a job role (e.g., Frontend Developer)"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRole();
              }
            }}
          />
          <Button onClick={addRole}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferences.roles.map((role, index) => (
            <div 
              key={index}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {role}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => removeRole(role)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {preferences.roles.length === 0 && (
            <p className="text-sm text-muted-foreground">No roles added yet</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Locations</h3>
        <p className="text-sm text-muted-foreground">
          Where would you like to work?
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Add a location (e.g., New York, London)"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLocation();
              }
            }}
          />
          <Button onClick={addLocation}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferences.locations.map((location, index) => (
            <div 
              key={index}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {location}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => removeLocation(location)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {preferences.locations.length === 0 && (
            <p className="text-sm text-muted-foreground">No locations added yet</p>
          )}
        </div>

        <div className="mt-4">
          <Label className="text-base">Location Type</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {jobLocations.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`location-type-${type}`} 
                  checked={preferences.locationType.includes(type)}
                  onCheckedChange={() => toggleLocationType(type)}
                />
                <Label 
                  htmlFor={`location-type-${type}`}
                  className="text-sm font-normal"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {companyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`company-type-${type}`} 
                checked={preferences.companyTypes.includes(type)}
                onCheckedChange={() => toggleCompanyType(type)}
              />
              <Label 
                htmlFor={`company-type-${type}`}
                className="text-sm font-normal"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Experience Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox 
                id={`exp-level-${level}`} 
                checked={preferences.experienceLevel.includes(level)}
                onCheckedChange={() => toggleExperienceLevel(level)}
              />
              <Label 
                htmlFor={`exp-level-${level}`}
                className="text-sm font-normal"
              >
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="minSalary">Minimum Salary Expectation</Label>
        <Input
          id="minSalary"
          type="number"
          placeholder="Enter amount"
          value={preferences.minSalary || ''}
          onChange={(e) => onUpdate({
            ...preferences,
            minSalary: e.target.value ? parseInt(e.target.value) : undefined
          })}
        />
      </div>
    </div>
  );
};

export default JobPreferences;
