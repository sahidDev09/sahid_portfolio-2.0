import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  // Framer Motion specific props
  useFramerMotion?: boolean;
  animationVariant?: 'fade' | 'slideUp' | 'slideDown' | 'scale' | 'combined';
  staggerDelay?: number;
  animationDuration?: number;
}

// Framer Motion animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    }
  }
};

const wordVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  },
  combined: {
    hidden: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  }
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  as: Component = 'div',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  useFramerMotion = false,
  animationVariant = 'combined',
  staggerDelay = 0.03,
  animationDuration = 0.7
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    if (!text) return children;

    if (useFramerMotion) {
      // Split text into words for Framer Motion animation
      return text.split(/(\s+)/).map((word, wordIndex) => {
        if (word.match(/^\s+$/)) return word;
        
        // Split each word into characters for character-level animation
        const chars = word.split('').map((char, charIndex) => (
          <motion.span
            key={`${wordIndex}-${charIndex}`}
            className="char"
            variants={wordVariants[animationVariant]}
            style={{ display: 'inline-block' }}
          >
            {char}
          </motion.span>
        ));

        return (
          <motion.span 
            className="word" 
            key={wordIndex}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {chars}
          </motion.span>
        );
      });
    } else {
      // Original GSAP implementation
      return text.split(/(\s+)/).map((word, index) => {
        if (word.match(/^\s+$/)) return word;
        return (
          <span className="word" key={index}>
            {word}
          </span>
        );
      });
    }
  }, [children, useFramerMotion, animationVariant]);

  useEffect(() => {
    if (useFramerMotion) return; // Skip GSAP if using Framer Motion
    
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');
    if (wordElements.length === 0) return;

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === el) trigger.kill();
      });
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, useFramerMotion]);

  if (useFramerMotion) {
    const MotionComponent = motion[Component as keyof typeof motion] || motion.div;
    
    return (
      <MotionComponent
        ref={containerRef as any}
        className={`scroll-reveal ${containerClassName}`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {splitText}
      </MotionComponent>
    );
  }

  return (
    <Component ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      {splitText}
    </Component>
  );
};

export default ScrollReveal;
