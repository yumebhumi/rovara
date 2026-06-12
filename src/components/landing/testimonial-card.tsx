"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
import { Rating } from "./rating";
import { Avatar } from "./avatar";

export type Testimonial = {
  name: string;
  role: string;
  destination?: string;
  rating: number;
  quote: string;
  avatarSrc?: string;
};

export function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <motion.article
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_22px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl",
        "transform-gpu will-change-transform transition-[border-color,background-color,transform] duration-500",
        "hover:border-[#14B8A6]/18 hover:bg-white/[0.04]",
        className
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={testimonial.name} src={testimonial.avatarSrc} />
            <div>
              <p className="text-sm font-semibold tracking-[0.01em] text-[#F8FAF8]">{testimonial.name}</p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">{testimonial.role}</p>
            </div>
          </div>
          <Rating value={testimonial.rating} />
        </div>

        <p className="rovara-body-sm text-[#CBD5E1]">&ldquo;{testimonial.quote}&rdquo;</p>

        {testimonial.destination ? (
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-[#CBD5E1]">
              <MapPin size={12} className="text-[#14B8A6]" />
              {testimonial.destination}
            </span>
            <span className="text-[11px] font-medium text-[#94A3B8]">Verified trip</span>
          </div>
        ) : (
          <div className="pt-1 text-[11px] font-medium text-[#94A3B8]">Verified traveler</div>
        )}
      </div>
    </motion.article>
  );
}
