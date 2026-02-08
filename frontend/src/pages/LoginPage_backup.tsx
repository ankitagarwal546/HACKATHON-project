import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Radio, Loader2 } from 'lucide-react';
import { loginUser, registerUser } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { user } = await loginUser(loginData.email, loginData.password);
      localStorage.setItem('isAuthenticated', 'true');
      if (user.email) localStorage.setItem('userEmail', user.email);
      if (user.name) localStorage.setItem('userName', user.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const { user } = await registerUser(signupData.email, signupData.password, signupData.name || undefined);
      localStorage.setItem('isAuthenticated', 'true');
      if (user.email) localStorage.setItem('userEmail', user.email);
      if (user.name) localStorage.setItem('userName', user.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-black text-white">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
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

      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="panel-glass rounded-xl overflow-hidden">
          <div className="bg-black/40 border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                SECURE CHANNEL
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex items-center justify-center relative"
                style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
              >
                <Shield className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <h1 className="text-xl font-orbitron font-bold text-white tracking-widest">
                COSMIC WATCH
              </h1>
              <p className="text-cyan-400 text-sm mt-1 font-mono uppercase tracking-wider">
                MONITORING CONSOLE
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-sm bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/40 border border-white/10">
                <TabsTrigger
                  value="login"
                  className="font-mono text-xs uppercase data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=inactive]:text-gray-400"
                >
                  SIGN IN
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="font-mono text-xs uppercase data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=inactive]:text-gray-400"
                >
                  REGISTER
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-mono text-xs uppercase tracking-wider bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ENTERING…
                      </>
                    ) : (
                      'ENTER MONITORING CONSOLE'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      NAME
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      EMAIL
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      PASSWORD
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                      CONFIRM PASSWORD
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="bg-black/60 border-white/10 text-white placeholder:text-gray-500 font-sans focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-mono text-xs uppercase tracking-wider bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        CREATING…
                      </>
                    ) : (
                      'CREATE ACCOUNT'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
              >
                ← Return to Home
              </button>
            </div>
          </div>

          <div className="bg-black/40 border-t border-white/10 px-6 py-3">
            <p className="text-[10px] text-gray-500 text-center font-mono uppercase">
              COSMIC WATCH
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
