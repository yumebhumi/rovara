"use client";

import Image from "next/image";
import { Clock3, Lightbulb, MapPinned } from "lucide-react";
import { motion } from "framer-motion";
import type { Recommendation } from "@/types";
import { pageTransition } from "@/styles/animations";
import { formatActivityCategory } from "./render-utils";

export function RecommendationCard({
  recommendation
}: {
  recommendation: Recommendation;
}) {
  return (
    <motion.article
      className="min-w-0 overflow-hidden rounded-[1.45rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_18px_52px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-[#8FE3CF]/18"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={pageTransition}
    >
      {recommendation.image?.url ? (
        <div className="relative h-40">
          <Image
            src={recommendation.image.url}
            alt={recommendation.image.alt ?? recommendation.title}
            fill
            sizes="(min-width: 1024px) 360px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,21,0.02),rgba(11,18,21,0.58))]" />
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FE3CF]">
          {formatActivityCategory(recommendation.category)}
        </p>
        <h3 className="mt-3 break-words text-xl font-semibold tracking-[-0.03em] text-[#F8FAF8]">
          {recommendation.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#94A3B8]">
          {recommendation.description}
        </p>

        <div className="mt-5 space-y-3 text-sm leading-7 text-[#94A3B8]">
          {recommendation.localTip ? (
            <p className="flex items-start gap-3">
              <Lightbulb size={16} className="mt-1 shrink-0 text-[#8FE3CF]" aria-hidden="true" />
              <span>
                <span className="text-[#F8FAF8]">Local tip:</span>{" "}
                {recommendation.localTip}
              </span>
            </p>
          ) : null}
          {recommendation.recommendedTime ? (
            <p className="flex items-start gap-3">
              <Clock3 size={16} className="mt-1 shrink-0 text-[#8FE3CF]" aria-hidden="true" />
              <span>
                <span className="text-[#F8FAF8]">Best timing:</span>{" "}
                {recommendation.recommendedTime}
              </span>
            </p>
          ) : null}
          <p className="flex items-start gap-3">
            <MapPinned size={16} className="mt-1 shrink-0 text-[#8FE3CF]" aria-hidden="true" />
            <span>
              <span className="text-[#F8FAF8]">Relevance:</span>{" "}
              {Math.round(recommendation.relevanceScore * 100)}%
            </span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}
