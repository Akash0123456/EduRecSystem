import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export const Box = (): JSX.Element => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/dashboard");
  };
  // Platform features data
  const features = [
    {
      icon: "🎓",
      title: "Educational Focus",
      description: "Strictly designed for academic and learning purposes",
    },
    {
      icon: "📚",
      title: "Learning Tools",
      description: "Enhanced study materials and academic resources",
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left side - Platform information */}
      <div className="w-1/2 p-8 flex flex-col">
        <div className="mb-12">
          <h1 className="text-2xl font-bold">
            EduRec<span className="text-cyan-500">.</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Your AI-Powered Educational Assistant
          </p>
        </div>

        <div className="my-8">
          <h2 className="text-2xl font-bold mb-6">
            Educational AI For Enhanced Learning
          </h2>
          <p className="text-sm text-muted-foreground mb-12">
            Discover a new way of learning with EduRec, your dedicated
            educational AI assistant. Designed exclusively for academic
            purposes, we help students and educators achieve better learning
            outcomes while maintaining the highest standards of educational
            integrity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-1/2 bg-secondary p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-transparent">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:text-cyan-500 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:text-cyan-500 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-muted-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-card border-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-cyan-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                onClick={handleSignIn}
              >
                Sign In
              </Button>

              <div className="relative my-6">
                <Separator className="bg-border" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary px-2 text-xs text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-card border-border hover:bg-secondary/80"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.082z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-card border-border hover:bg-secondary/80"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      fill="currentColor"
                    />
                  </svg>
                  GitHub
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6">
                By signing in, you agree to our{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </TabsContent>

            <TabsContent value="signup">
              {/* Sign up form would go here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
