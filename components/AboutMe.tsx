import React from 'react'
import Introduction from './introduction'
import BentoGrid from './about/BentoGrid'
import { Highlighter } from './ui/highlighter'

const AboutMe = () => {
  return (
    <div>
      <Introduction />
      <div className=' w-full mx-auto justify-center flex flex-col items-center gap-4 my-10'>
           <div className='font-heading tracking-wide uppercase text-4xl md:text-5xl lg:text-6xl text-[#f1f5f9] '>
            <Highlighter action='underline'>
            About
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">ME</span>
          </Highlighter>
           </div>
          <p className="text-[#94a3b8] text-lg">
            Passionate developer crafting digital experiences with modern technologies
          </p>
      </div>
      <BentoGrid />
    </div>
  )
}

export default AboutMe