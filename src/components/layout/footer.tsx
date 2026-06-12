"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { motionEase, pageTransition } from "@/styles/animations";
import { FooterLink } from "./footer-link";
import { SocialIcon } from "./social-icon";

const navLinks = [
  { label: "Generate", href: ROUTES.GENERATE },
  { label: "Trips", href: ROUTES.TRIPS },
  { label: "Profile", href: ROUTES.PROFILE },
];

const legalLinks = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms of service", href: "#" },
  { label: "Contact", href: "#" },
];

const socials = [
  { label: "GitHub", href: siteConfig.links.github, icon: Github },
  { label: "Twitter / X", href: siteConfig.links.twitter, icon: Twitter },
  { label: "Instagram", href: "#", icon: Instagram },
] as const;

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: pageTransition },
};

export function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-white/[0.08]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_100%,rgba(20,184,166,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6">
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 md:pr-6">
            <Link
              href={ROUTES.HOME}
              className="text-sm font-semibold tracking-[0.28em] text-[#F8FAF8] transition-opacity hover:opacity-80"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[#94A3B8]">
              Calm travel planning for people who want clearer itineraries, stronger recommendations, and less noise.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((social) => (
                <SocialIcon key={social.label} href={social.href} label={social.label} icon={social.icon} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Product
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Company
            </p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} />
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Stay updated
            </p>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              AI-driven travel insights, new features, and destination guides.
            </p>
            <div className="mt-4 flex overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-[#F8FAF8] placeholder:text-[#94A3B8] outline-none"
                aria-label="Subscribe with your email"
              />
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-[#14B8A6] transition hover:text-[#F8FAF8]"
              >
                Join
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: motionEase }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={pageTransition}
          className="flex flex-col items-center justify-between gap-3 text-[11px] text-[#94A3B8] sm:flex-row"
        >
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Built for modern travelers with a clearer AI planning workflow.</p>
        </motion.div>
      </div>
    </footer>
  );
}
