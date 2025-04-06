import { SelectProps } from "@radix-ui/react-select";
import { Option } from "../ui/autocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface SelectInputProps extends Partial<SelectProps> {
  onChange: (value: string) => void;
  value: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const SelectInput = ({
  onChange,
  value,
  options,
  placeholder,
  className,
  ...props
}: SelectInputProps) => {
  return (
    <Select onValueChange={onChange} value={value} {...props}>
      <SelectTrigger className="!ring-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className={cn("", className)}>
        <SelectScrollUpButton />
        {options.map((level) => (
          <SelectItem key={level.value} value={level.value}>
            {level.label}
          </SelectItem>
        ))}

        <SelectScrollDownButton />
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
