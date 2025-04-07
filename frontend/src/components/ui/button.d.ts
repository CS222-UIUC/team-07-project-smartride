import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants.ts";
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Button };
