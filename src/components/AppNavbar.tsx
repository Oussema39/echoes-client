import React from "react";
import { Button } from "@/components/ui/button";

interface AppNavbarProps {
  onToggleSidebar: () => void;
  onToggleSuggestions: () => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({
  onToggleSidebar,
  onToggleSuggestions,
}) => {
  return (
    <header className="h-14 border-b bg-white flex items-center px-4 justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={onToggleSidebar}
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

      {/* <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex">
          Upgrade
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical size={18} />
        </Button>
        <Avatar
          className="h-8 w-8 cursor-pointer"
          onClick={onToggleSuggestions}
        >
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div> */}
    </header>
  );
};

export default AppNavbar;
