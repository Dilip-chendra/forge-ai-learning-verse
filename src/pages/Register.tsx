
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isTermsAccepted) {
      setError('You must accept the terms and conditions to create an account.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      toast({
        title: "Registration successful",
        description: "Welcome to EduForge AI!",
        action: <CheckCircle className="text-green-500" />
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again with different credentials.",
        action: <AlertCircle className="text-destructive" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-muted-foreground">Start your learning journey with EduForge AI</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox 
            id="terms" 
            checked={isTermsAccepted}
            onCheckedChange={(checked) => setIsTermsAccepted(checked as boolean)}
          />
          <div>
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-none cursor-pointer"
            >
              I accept the 
            </Label>
            <span className="text-sm text-muted-foreground">
              {' '}
              <Link to="/terms" className="text-primary hover:underline">
                terms and conditions
              </Link>
            </span>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !isTermsAccepted}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isSubmitting}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
