import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Radio } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in production this would connect to your backend
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Access Granted',
        description: 'Initializing monitoring console...',
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Verification Failed',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate signup - in production this would connect to your backend
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Account Created',
        description: 'Welcome to Cosmic Watch monitoring system.',
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google login - in production this would use OAuth
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Google Sign-In Successful',
        description: 'Initializing monitoring console...',
      });
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid overlay effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-xl overflow-hidden">
          {/* Security Header */}
          <div className="bg-secondary/80 border-b border-primary/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Radio className="w-4 h-4 text-primary animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-safe rounded-full" />
                </div>
                <span className="text-xs font-orbitron text-primary">SECURE CHANNEL</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-safe" />
                <span className="text-[10px] text-safe font-rajdhani">ENCRYPTED</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center relative"
                style={{
                  boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
                }}
              >
                <Shield className="w-10 h-10 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <h1 className="text-xl font-orbitron font-bold text-foreground tracking-wider">
                COSMIC WATCH
              </h1>
              <p className="text-primary text-sm mt-1 font-orbitron">
                MONITORING CONSOLE
              </p>
            </div>

            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full mb-6 font-rajdhani tracking-wider bg-card border border-border text-foreground hover:bg-secondary hover:border-primary transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground font-rajdhani">OR</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/80 border border-border">
                <TabsTrigger 
                  value="login" 
                  className="font-orbitron text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  SIGN IN
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="font-orbitron text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  REGISTER
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary font-rajdhani"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary font-rajdhani"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-orbitron tracking-wider bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    style={{
                      boxShadow: isLoading ? 'none' : '0 0 20px hsl(var(--primary) / 0.3)',
                    }}
                  >
                    {isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      EMAIL
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary font-rajdhani"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      PASSWORD
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary font-rajdhani"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      CONFIRM PASSWORD
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary font-rajdhani"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-orbitron tracking-wider bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    style={{
                      boxShadow: isLoading ? 'none' : '0 0 20px hsl(var(--primary) / 0.3)',
                    }}
                  >
                    {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Back to home link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-rajdhani"
              >
                ← Return to Home
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-secondary/50 border-t border-border px-6 py-3">
            <p className="text-[10px] text-muted-foreground text-center font-rajdhani">
              COSMIC WATCH v2.1.0 • PLANETARY DEFENSE MONITORING SYSTEM
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
