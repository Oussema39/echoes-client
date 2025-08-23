import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChromeIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IUser } from "@/interface/IUser";

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginPageProps {
  isModal?: boolean;
  onSuccess?: (user: IUser) => void;
}

const LoginPage = ({ isModal = false, onSuccess }: LoginPageProps) => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: import.meta.env.VITE_TMP_EMAIL,
      password: import.meta.env.VITE_TMP_PASSWORD,
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await login(data.email, data.password);
      onSuccess?.(user);

      if (user) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={`${
        isModal ? "" : "min-h-screen"
      } flex items-center justify-center`}
    >
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-2">
            <img
              className="w-8 h-8 rounded"
              src="/echoes-logo.avif"
              loading="lazy"
              alt="logo"
            />
          </div>

          <h2 className="text-center text-xl font-medium mb-4">Welcome Back</h2>
          <p className="text-gray-500 block text-center mb-8">
            Enter your credentials to access your dashboard
          </p>

          {error && (
            <Alert
              variant="destructive"
              className="mb-4"
              onClick={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="your.email@example.com" />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Your password" type="password" />
              )}
            />

            <Button type="submit" size="lg" disabled={isLoading}>
              Sign In
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
          <Separator className="mx-2 my-4 w-auto bg-sidebar-border" />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={loginWithGoogle}
              size="lg"
              variant="outline"
              className="rounded-full w-full"
            >
              <ChromeIcon size={24} />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
