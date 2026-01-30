"use client";

import { useEffect, useState } from 'react'
import Introduction from './introduction'
import BentoGrid from './about/BentoGrid'
import { Highlighter } from './ui/highlighter'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

const AboutMe = () => {
  const [bio, setBio] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBio = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from("about_profile")
          .select("bio")
          .single()

        if (error) throw error
        if (data?.bio) setBio(data.bio)
      } catch (error) {
        console.error("Error fetching bio:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBio()
  }, [])

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
        className='w-full mx-auto justify-center flex flex-col items-center gap-4 my-10 px-6 md:px-0'
      >
           <div className='font-heading tracking-wide text-3xl md:text-4xl lg:text-5xl text-[#f1f5f9] '>
            <Highlighter action='underline'>
            About Me
            
          </Highlighter>
           </div>
          {loading ? (
            <div className="h-6 w-64 bg-white/5 animate-pulse rounded" />
          ) : (
            <p className="text-[#94a3b8] md:text-lg text-base text-center max-w-2xl px-4">
              {bio || "Passionate developer crafting digital experiences with modern technologies"}
            </p>
          )}
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