import React, { HTMLAttributes } from "react";
import spinnerStyles from "./spinner.module.css";
import { cn } from "@/lib/utils";

type Props = {
  className: string;
} & HTMLAttributes<HTMLDivElement>;

const Spinner: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cn(className, spinnerStyles.spinner)} {...props}></div>
  );
};

export default Spinner;
