import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

interface AppNavbarProps {
  onToggleSidebar: () => void;
  onToggleSuggestions: () => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({
  onToggleSidebar,
  onToggleSuggestions,
}) => {
  const { isAuthenticated, logout, isLoading, user, loginWithGoogle } =
    useAuth();

  return (
    <header className="h-14 border-b bg-white flex items-center px-4 justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => {
            onToggleSidebar();
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-brand-blue rounded-md">
            <img
              className="w-8 h-8 rounded"
              src="/echoes-logo.avif"
              loading="lazy"
              alt="logo"
            />
          </div>
        </Button>
        <span className="font-bold text-xl">Echoes</span>
      </div>

      <div className="flex items-center gap-2 cursor-pointer">
        <Link to="/login">
          <div className="flex items-center gap-2">
            <Avatar
              className="h-8 w-8 cursor-pointer"
              onClick={() => {
                if (isAuthenticated) {
                  onToggleSuggestions();
                }
              }}
            >
              <AvatarImage
                src={user?.picture ?? "https://avatar.iran.liara.run/public/48"}
                alt="User"
              />
              <AvatarFallback>
                {`${user?.firstName?.at(0)}${user?.lastName?.at(
                  0
                )}`.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium">{user?.firstName || "Guest"}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {
            isAuthenticated ? (
              <Button onClick={logout} disabled={isLoading} variant="ghost">
                <LogOut size={24} />
              </Button>
            ) : null
            // <Button
            //   variant="outline"
            //   className="rounded-full"
            //   onClick={loginWithGoogle}
            // >
            //   <ChromeIcon size={24} />
            //   Sign in with Google
            // </Button>
          }
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
