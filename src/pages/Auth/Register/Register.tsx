import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChromeIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    loginWithGoogle,
    isAuthenticated,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await registerUser(data);

      if (success) {
        navigate("/");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="md:min-w-[500px]">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-2">
            <img
              className="w-8 h-8 rounded"
              src="/echoes-logo.avif"
              loading="lazy"
              alt="logo"
            />
          </div>

          <h2 className="text-center text-xl font-medium mb-4">
            Create an Account
          </h2>
          <p className="text-gray-500 block text-center mb-8">
            Fill in the details to register
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
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="First name" />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="Last name" />
              )}
            />

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
                <Input {...field} placeholder="Email address" />
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
                <Input {...field} placeholder="Password" type="password" />
              )}
            />

            <Controller
              name="age"
              control={control}
              rules={{
                min: { value: 13, message: "You must be at least 13" },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Age (optional)" type="number" />
              )}
            />

            <Button type="submit" size="lg" disabled={isLoading}>
              Sign Up
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
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
              Sign up with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
