import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface SuccessAnimationProps {
  onComplete: () => void;
}

export function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    // Trigger onComplete after all animations finish (2.2 seconds total)
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="flex flex-col items-center justify-center text-foreground"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <CheckCircle className="h-24 w-24 text-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut"
              }}
              className="mt-6 text-3xl font-bold"
            >
              Visit Request Submitted!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.6,
                ease: "easeOut"
              }}
              className="mt-2 text-lg text-muted-foreground"
            >
              You will receive a confirmation shortly
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 