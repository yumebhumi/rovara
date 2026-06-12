"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { panelTransition } from "@/styles/animations";
import { cn } from "@/utils/cn";
import { ValidationMessage } from "./validation-message";

type AnimatedFormFieldProps = {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  messageId?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
};

export function AnimatedFormField({
  id,
  label,
  hint,
  error,
  messageId,
  children,
  className,
  required = false
}: AnimatedFormFieldProps) {
  return (
    <motion.div
      layout
      className={cn("space-y-3.5", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={panelTransition}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Label
          htmlFor={id}
          className="text-[0.95rem] font-medium tracking-[-0.01em] text-[#E2E8F0] light:text-[#475569]"
        >
          {label}
          {required ? <span className="ml-1 text-[#8FE3CF]">*</span> : null}
        </Label>
        {hint ? (
          <span className="text-[0.82rem] leading-6 text-[#64748B] light:text-[#64748B]">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      <ValidationMessage id={messageId} message={error} />
    </motion.div>
  );
}
