import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Loader2, Activity } from 'lucide-react';
import { loginUser, registerUser } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginSpaceScene } from '@/components/3d/LoginSpaceScene';

const LoginPage = () => {
  // Force re-render verification
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden text-white bg-black">
      {/* Dynamic 3D space background with shooting comets and falling stars */}
      <LoginSpaceScene />

      {/* Enhanced overlay gradient for better readability (Steel/Dark) */}
      <div
        className="absolute inset-0 z-0 bg-radial-gradient pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div 
          className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8) 0%, rgba(5, 5, 10, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 60px rgba(255, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div 
            className="border-b border-red-500/20 px-6 py-4"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0%, rgba(200, 0, 0, 0.05) 100%)',
            }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              </motion.div>
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider">
                SECURE CHANNEL - COSMIC WATCH SYSTEM
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 100 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full border-2 flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(200, 200, 220, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 0 50px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <Shield 
                  className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                  strokeWidth={2.5} 
                />
              </motion.div>
              <div className="flex items-center justify-center gap-3">
                <Activity className="w-6 h-6 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <h1 className="text-2xl font-mono font-bold tracking-widest uppercase">
                  <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">Cosmic</span>
                  <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">Watch</span>
                </h1>
              </div>
              <motion.p 
                className="text-slate-400 text-sm mt-1 font-mono uppercase tracking-wider"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SATELLITE MONITORING SYSTEM
              </motion.p>
            </div>

            {error && (
              <motion.div 
                className="mb-4 p-3 rounded-sm border text-sm font-mono"
                style={{
                  background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)',
                  borderColor: 'rgba(220, 38, 38, 0.6)',
                  color: '#fca5a5',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 mb-6 border"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <TabsTrigger
                  value="login"
                  className="font-mono text-xs uppercase transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-slate-500"
                  style={{
                    color: 'inherit',
                  }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    SIGN IN
                  </motion.div>
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="font-mono text-xs uppercase transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-slate-500"
                  style={{
                    color: 'inherit',
                  }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    REGISTER
                  </motion.div>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          EMAIL
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          PASSWORD
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                          required
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(80, 80, 80, 0.4) 0%, rgba(40, 40, 40, 0.4) 100%)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#e2e8f0',
                            boxShadow: isLoading ? 'inset 0 0 20px rgba(255, 255, 255, 0.05)' : '0 0 20px rgba(255, 255, 255, 0.05)',
                          }}
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
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Name input added back */}
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          NAME
                        </Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your Name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          EMAIL
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          PASSWORD
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          CONFIRM PASSWORD
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="bg-black/60 text-white placeholder:text-gray-500 font-sans focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.6)',
                          }}
                          required
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(80, 80, 80, 0.4) 0%, rgba(40, 40, 40, 0.4) 100%)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#e2e8f0',
                            boxShadow: isLoading ? 'inset 0 0 20px rgba(255, 255, 255, 0.05)' : '0 0 20px rgba(255, 255, 255, 0.05)',
                          }}
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
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>

            <div className="mt-8 text-center">
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-slate-400 hover:text-white transition-colors font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Return to Home
              </motion.button>
            </div>
          </div>

          <div 
            className="border-t px-6 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(200, 200, 200, 0.05) 0%, rgba(200, 200, 200, 0.02) 100%)',
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
              COSMIC WATCH - SATELLITE MONITORING SYSTEM v2.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
