import { ArrowRight } from "lucide-react";
import React from "react";

const Introduction = () => {
  return (
    <div className="container mx-auto my-10 relative z-0">
      <h1 className=" font-neue md:text-[3.6vw] md:leading-[4.4vw] tracking-normal ">
        Welcome to my digital portfolio! I’m Sahid, a passionate MERN stack
        developer dedicated to crafting beautiful and functional websites. Dive
        in to explore my work and journey.
        <span className="hidden md:inline-flex ml-4 btn font-light border-none transition-all bg-[#3DB883] hover:bg-zinc-700 rounded-full hover:text-[#3DB883] text-white text-[1.5vw] md:p-3 ">
          <a className=" flex items-center gap-2" href="#projects">
            Latest Projects
            <span className=" -rotate-45 bg-white text-black rounded-full">
              <ArrowRight />
            </span>
          </a>
        </span>
        <button className="md:hidden mt-2 flex items-center gap-1 text-[2vw] bg-[#3DB883] rounded-full p-[4px]">
          Latest Projects
          <span className=" -rotate-45 bg-white text-black rounded-full">
            <ArrowRight />
          </span>
        </button>
      </h1>
    </div>
  );
};

export default Introduction;
