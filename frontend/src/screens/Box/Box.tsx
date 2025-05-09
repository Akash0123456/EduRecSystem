import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Loader2Icon } from "lucide-react";

export const Box = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  
  const [signInErrors, setSignInErrors] = useState({
    email: "",
    password: "",
    general: ""
  });

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignInInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("signin-", "");
    setSignInData({ ...signInData, [fieldName]: value });
    // Clear error when user starts typing
    setSignInErrors({ ...signInErrors, [fieldName]: "", general: "" });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [id]: "" });
  };

  const handleSignIn = async () => {  
    setSignInErrors({
      email: "",
      password: "",
      general: ""
    });

    const newErrors = {};

    if (!signInData.email.trim()) {
      newErrors.email = "Email is required";
    }
  
    if (!signInData.password) {
      newErrors.password = "Password is required";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setSignInErrors({ ...signInErrors, ...newErrors });
      return;
    }
  
  setIsSigningIn(true);
  
  try {
    // Sign in with Firebase Authentication
    await signInWithEmailAndPassword(auth, signInData.email, signInData.password);
    // If successful, navigate to dashboard
    navigate("/dashboard");
  } catch (error: any) {
    console.error("Firebase Sign-In Error: ", error.message);
    // Handle different error codes with user-friendly messages
    if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      setSignInErrors((prev) => ({ ...prev, general: "Invalid email or password" }));
    } else if (error.code === "auth/too-many-requests") {
      setSignInErrors((prev) => ({ ...prev, general: "Too many failed login attempts, try again later" }));
    } else if (error.code === "auth/invalid-email") {
      setSignInErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setSignInErrors((prev) => ({ ...prev, general: "Failed to sign in. Please try again." }));
    }
  } finally {
    setIsSigningIn(false);
  }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }
    
    setIsSigningUp(true);
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/frame");
    } catch (error: any) {
      console.error("Firebase Email and Password Sign-Up Error: ", error.message);
      if (error.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "Email already in use" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "Failed to sign up" }));
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignUp = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        navigate('/dashboard')
      } catch (error: any) {
        console.error("Google Sign In Error: ", error.message);
      }
  }

  const handleGithubSignUp = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard')
    } catch (error: any) {
      console.error("Google Sign In Error: ", error.message);
    }
  }

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
    <div className="flex h-screen bg-[#111827] text-white">
      {/* Left side - Platform information */}
      <div className="w-1/2 p-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            EduRec<span className="text-cyan-500">.</span>
          </h1>
          <p className="text-sm text-gray-400">
            Your AI-Powered Educational Assistant
          </p>
        </div>

        <div className="my-4">
          <h2 className="text-2xl font-bold mb-4">
            Educational AI For Enhanced Learning
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Discover a new way of learning with EduRec, your dedicated
            educational AI assistant. Designed exclusively for academic
            purposes, we help students and educators achieve better learning
            outcomes while maintaining the highest standards of educational
            integrity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#1a2235] border-0">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-sm font-semibold mb-1 text-white">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-1/2 bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Add a fixed height container to prevent layout shift */}
          <div className="flex flex-col" style={{ minHeight: "550px" }}>
            <Tabs defaultValue="signin" className="w-full">
              {/* Position the tabs list with absolute positioning */}
              <div className="sticky top-0 bg-[#0f172a] z-10 pb-4">
                <TabsList className="grid grid-cols-2 mb-6 bg-transparent">
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
              </div>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-1">
                  <label htmlFor="signin-email" className="text-sm text-gray-400">
                    Email
                  </label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={handleSignInInputChange}
                    placeholder="Enter your email"
                    className="bg-[#1a2235] border-0"
                  />
                  {signInErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{signInErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="signin-password" className="text-sm text-gray-400">
                    Password
                  </label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={handleSignInInputChange}
                    placeholder="Enter your password"
                    className="bg-[#1a2235] border-0"
                  />
                  {signInErrors.password && (
                    <p className="text-xs text-red-500 mt-1">{signInErrors.password}</p>
                  )}
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-cyan-500 hover:text-cyan-400"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                {signInErrors.general && (
                  <p className="text-xs text-red-500 text-center mt-2">
                    {signInErrors.general}
                  </p>
                )}

                <div className="relative my-4">
                  <Separator className="bg-gray-700" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-gray-400">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="bg-[#1a2235] border-0 hover:bg-[#232b3d]"
                    onClick={handleGoogleSignUp}
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
                    className="bg-[#1a2235] border-0 hover:bg-[#232b3d]"
                    onClick={handleGithubSignUp}
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
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 mt-6">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label htmlFor="fullName" className="text-sm text-gray-400">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="bg-[#1a2235] border-0 mt-1"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm text-gray-400">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-[#1a2235] border-0 mt-1"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="text-sm text-gray-400">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        className="bg-[#1a2235] border-0 mt-1"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="text-sm text-gray-400">
                        Confirm Password
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="bg-[#1a2235] border-0 mt-1"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="relative my-3">
                  <Separator className="bg-gray-700" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-gray-400">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="bg-[#1a2235] border-0 hover:bg-[#232b3d]"
                    onClick={handleGoogleSignUp}
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
                    className="bg-[#1a2235] border-0 hover:bg-[#232b3d]"
                    onClick={handleGithubSignUp}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};