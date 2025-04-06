import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-transform transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100 focus-visible:ring-blue-400",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100 focus-visible:ring-red-400",
        outline:
          "border border-gray-300 bg-white text-gray-800 shadow-sm hover:shadow-md hover:bg-gray-100 focus-visible:ring-gray-400",
        secondary:
          "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100 focus-visible:ring-gray-400",
        ghost:
          "bg-transparent text-gray-800 hover:bg-gray-100 hover:shadow focus-visible:ring-gray-400",
        link: "text-blue-500 underline-offset-4 hover:underline focus-visible:ring-blue-400",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
