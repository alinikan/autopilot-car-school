import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function PageTransition({ children, view }: { children: ReactNode; view: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.main
      key={view}
      id="main-content"
      initial={{ opacity: 0, y: reduce ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  );
}
