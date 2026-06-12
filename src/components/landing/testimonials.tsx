"use client";

import { motion } from "framer-motion";
import { AnimatedBadge } from "./animated-badge";
import { TestimonialCard, type Testimonial } from "./testimonial-card";

const testimonials: Testimonial[] = [
  {
    name: "Aira K.",
    role: "Solo traveler",
    destination: "Tokyo · 10 days",
    quote: "Rovara completely changed how I plan trips. The AI itinerary felt surprisingly personalized.",
    rating: 5
  },
  {
    name: "Marco T.",
    role: "Content creator",
    destination: "Kyoto · 6 days",
    quote: "The weather-aware planning saved our entire Kyoto trip during heavy rain.",
    rating: 5
  },
  {
    name: "Priya M.",
    role: "Digital nomad",
    destination: "Bali · 14 days",
    quote: "I reduced my travel costs by almost 25% using Rovara’s smart recommendations.",
    rating: 5
  },
  {
    name: "Noah S.",
    role: "Luxury traveler",
    destination: "Paris · 5 days",
    quote: "The UI alone feels like a premium Apple-level travel product. Everything is elegant and fast.",
    rating: 5
  },
  {
    name: "Lina V.",
    role: "Backpacker",
    destination: "Vietnam · 12 days",
    quote: "Rovara’s budget optimization is unreal. I got a better plan with fewer transfers and less spend.",
    rating: 5
  },
  {
    name: "Evan & Mira",
    role: "Couple travelers",
    destination: "Santorini · 4 days",
    quote: "We shared the plan with friends and adjusted it together. It felt like a real trip co-pilot.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-20 h-56 w-56 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <div className="relative mb-18 flex flex-col items-center gap-4 text-center sm:mb-18">
        <AnimatedBadge label="Testimonials" tone="beige" />
        <h2 className="rovara-section-title text-balance">
          Trusted by modern travelers.
        </h2>
        <p className="rovara-body mx-auto max-w-3xl text-pretty">
          Travelers are planning smarter journeys with Rovara’s AI-powered travel intelligence.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="relative grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <TestimonialCard testimonial={testimonial} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
