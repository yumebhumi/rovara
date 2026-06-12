import type { Variants } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const microTransition = {
  duration: 0.18,
  ease: motionEase
} as const;

export const panelTransition = {
  duration: 0.38,
  ease: motionEase
} as const;

export const pageTransition = {
  duration: 0.58,
  ease: motionEase
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: panelTransition }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: panelTransition }
};

export const subtleSlideUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: pageTransition }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } }
};

export const cardHover = {
  rest: { scale: 1 },
  hover: { y: -1.5, transition: microTransition }
};

export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -1.5, transition: microTransition },
  tap: { y: 0, transition: { duration: 0.12 } }
};

export const floatingCard = {
  animate: { y: [0, -2, 0] },
  transition: { repeat: Infinity, duration: 12, ease: "easeInOut" as const }
};

export const taglineVariants: Variants = {
  enter: { opacity: 0, y: 6 },
  center: { opacity: 1, y: 0, transition: panelTransition },
  exit: { opacity: 0, y: -4, transition: microTransition }
};
