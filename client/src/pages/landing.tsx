import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  MessageCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Loader2,
  Loader
} from "lucide-react";

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-30"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">PingMe</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4" />
          <span>Connect • Chat • Collaborate</span>
          <Sparkles className="h-4 w-4" />
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 cursor-pointer hover:bg-gray-800 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300"
        >
          Let's Ping ?
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-center px-6 md:px-12 py-8 lg:py-12 min-h-[calc(100vh-100px)]">
        {/* Left Side - Animation */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0 lg:pr-8">
          <div className="relative w-full max-w-lg h-96">
            {/* Central Globe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Main sphere */}
                <div className="w-80 h-80 rounded-full border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl relative overflow-hidden">
                  {/* Rotating rings */}
                  <div
                    className="absolute inset-6 border border-gray-300 rounded-full animate-spin"
                    style={{ animationDuration: "25s" }}
                  >
                    <div
                      className="absolute inset-6 border border-gray-400 rounded-full animate-spin"
                      style={{
                        animationDuration: "18s",
                        animationDirection: "reverse",
                      }}
                    >
                      <div
                        className="absolute inset-6 border border-gray-500 rounded-full animate-spin"
                        style={{ animationDuration: "12s" }}
                      >
                        <div
                          className="absolute inset-6 border border-gray-600 rounded-full animate-spin"
                          style={{
                            animationDuration: "8s",
                            animationDirection: "reverse",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing inner glow */}
                  <div className="absolute inset-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse opacity-60"></div>

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                      <MessageCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Orbiting dots - outer ring */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-gray-700 rounded-full animate-pulse shadow-lg"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${
                        i * 30
                      }deg) translateY(-180px)`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "3s",
                    }}
                  />
                ))}

                {/* Orbiting dots - inner ring */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`inner-${i}`}
                    className="absolute w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${
                        i * 45
                      }deg) translateY(-120px)`,
                      animationDelay: `${i * 0.25}s`,
                      animationDuration: "2.5s",
                    }}
                  />
                ))}

                {/* Connection lines */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-px bg-gradient-to-t from-transparent via-gray-400 to-transparent opacity-40"
                      style={{
                        height: "280px",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) rotate(${
                          i * 22.5
                        }deg)`,
                        transformOrigin: "center bottom",
                      }}
                    />
                  ))}
                </div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-gray-400 rounded-full animate-ping opacity-75"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-12 right-12">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shadow-lg animate-bounce flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
                <Zap className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="absolute bottom-16 left-12">
              <div className="w-14 h-14 bg-gray-900 rounded-xl shadow-lg animate-pulse flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute top-24 left-16">
              <div className="w-8 h-8 bg-gray-300 rounded-full shadow-lg animate-ping"></div>
            </div>
            <div className="absolute bottom-24 right-16">
              <div className="w-10 h-10 bg-gray-800 rounded-xl shadow-lg animate-bounce delay-300 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Additional floating elements for richness */}
            <div className="absolute top-1/3 right-4">
              <div className="w-6 h-6 bg-gray-400 rounded-lg shadow-md animate-pulse delay-500 opacity-80"></div>
            </div>
            <div className="absolute bottom-1/3 left-4">
              <div className="w-5 h-5 bg-gray-600 rounded-full shadow-md animate-bounce delay-700 opacity-70"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Connect
                <span className="block text-gray-600">Instantly</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Experience lightning-fast messaging with end-to-end encryption.
                Connect with friends, family, and colleagues in a secure
                environment.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Lightning Fast
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Secure & Private
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Group Chats</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Rich Messaging
                </span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-base md:text-lg text-gray-500 border-l-4 border-gray-300 pl-6 italic">
              "The future of communication is here. Simple, secure, and
              lightning fast."
            </blockquote>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base md:text-lg"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Sign-in Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              Welcome to PingMe
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-6">
            <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <p className="text-center text-gray-600">
              Sign in to start connecting with your friends and colleagues
            </p>
            <a
              onClick={() => setLoading(true)}
              href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:5000/oauth/callback&response_type=code&client_id=${
                import.meta.env.VITE_GOOGLE_CLIENT_ID
              }&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline`}
            >
              <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
                {loading && <Loader className="animate-spin ml-3" />}
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
