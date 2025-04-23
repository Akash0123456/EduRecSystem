import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader2Icon } from "lucide-react";

export const ForgotPassword = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1f293780] rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-100">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-400 mb-4">
              Password reset email sent! Please check your inbox.
            </p>
            <Button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => navigate("/")}
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                required
                className="bg-transparent border-gray-700 text-gray-100"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-400 hover:text-gray-100"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 