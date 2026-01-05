"use client";


import Introduction from './introduction'
import BentoGrid from './about/BentoGrid'
import { Highlighter } from './ui/highlighter'
import { motion } from 'framer-motion'

const AboutMe = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  } as const;

  return (
    <div className="overflow-hidden">
      <motion.div {...fadeInUp}>
        <Introduction />
      </motion.div>

      <motion.div 
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        className='w-full mx-auto justify-center flex flex-col items-center gap-4 my-10'
      >
           <div className='font-heading tracking-wide  text-4xl md:text-5xl lg:text-6xl text-[#f1f5f9] '>
            <Highlighter action='underline'>
            About Me
            
          </Highlighter>
           </div>
          <p className="text-[#94a3b8] text-lg">
            Passionate developer crafting digital experiences with modern technologies
          </p>
      </motion.div>

      <motion.div 
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.3 }}
      >
        <BentoGrid />
      </motion.div>
    </div>
  )
}

export default AboutMe