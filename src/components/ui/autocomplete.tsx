import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

export type Option = {
  value: string;
  label: string;
};

export interface AutocompleteMultiSelectProps {
  options: Option[];
  selectedValues: string | string[];
  onSelectionChange: (values: string | string[]) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: number;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
}

export const Autocomplete = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options...",
  className,
  maxHeight = 250,
  disabled = false,
  multiple = false,
  loading,
}: AutocompleteMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected options for display
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  // Handle Popper open
  const handlePopperOpen = (open: boolean) => {
    if (!disabled && !loading) setIsOpen(open);
  };

  // Handle toggle selection
  const toggleOption = (value: string) => {
    if (multiple) {
      if (selectedValues.includes(value)) {
        onSelectionChange(
          (selectedValues as string[]).filter((val) => val !== value)
        );
      } else {
        onSelectionChange([...selectedValues, value]);
      }
    } else {
      onSelectionChange([value]);
      handlePopperOpen(false); // close dropdown on single select
    }
  };

  // Remove a selected option
  const removeOption = (value: string, e?: React.MouseEvent) => {
    if (!multiple) return; // Skip in single select mode
    e?.stopPropagation();
    onSelectionChange(selectedValues.filter((val) => val !== value));
  };

  // Clear all selected options
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(multiple ? "" : []);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex >= filteredOptions.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex <= 0) {
          return filteredOptions.length - 1;
        }
        return prevIndex - 1;
      });
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) {
        toggleOption(option.value);
      }
    } else if (e.key === "Escape") {
      handlePopperOpen(false);
    }
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search and highlighted index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(null);
    }
  }, [isOpen]);

  return (
    <div className={cn("relative w-full", className)}>
      <PopoverPrimitive.Root open={isOpen} onOpenChange={handlePopperOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <div
            className={cn(
              "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              className
            )}
            onClick={() => !disabled && handlePopperOpen(true)}
          >
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.map((option) => (
                  <Badge key={option.value}>
                    {option.label}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none focus:ring-2"
                      onClick={(e) => removeOption(option.value, e)}
                    >
                      {multiple ? <X className="h-3 w-3" /> : null}
                      <span className="sr-only">Remove {option.label}</span>
                    </button>
                  </Badge>
                ))}
                {selectedOptions.length > 0 && (
                  <button
                    type="button"
                    className="ml-1 text-sm text-muted-foreground hover:text-foreground"
                    onClick={clearAll}
                  >
                    Clear {multiple ? "all" : ""}
                  </button>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {loading && (
              <div className="flex-grow flex justify-end">
                <Spinner className="[font-size:1rem]" />
              </div>
            )}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50 w-[--radix-popover-trigger-width] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in zoom-in-90",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="flex h-8 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div
            className="overflow-y-auto py-1"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length > 0 ? (
              <div className="mt-1">
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      highlightedIndex === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                      selectedValues.includes(option.value) && "font-medium"
                    )}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      {selectedValues.includes(option.value) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm">No results found.</div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  );
};

// Badge component for selected items
const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-6 items-center rounded-full bg-primary px-2.5 text-xs text-primary-foreground">
      {children}
    </div>
  );
};
