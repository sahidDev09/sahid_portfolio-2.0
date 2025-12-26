import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-screen relative flex items-center flex-col gap-3 justify-center text-white overflow-hidden">
      {/* Spline Background */}
      <iframe
        src="https://my.spline.design/orb-hxyvwWjdVKI7t0zgYYXGwTFs/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: "none", transform: "scale(1.2)" }}
      />

      {/* Content Overlay */}
      <div className="z-10 w-full h-full flex items-center flex-col gap-3 relative">
        {/* greetings - behind image */}
        <div className=" mt-36">
          <h1 className="absolute left-65 text-[8rem] italic flex z-0 text-white/70 font-thin">
            Hey,
          </h1>
          <h1 className="absolute right-55 text-[8rem] italic flex  z-0 text-white/70 font-thin">
            There
          </h1>
        </div>

        <Image
          fill
          src="/person_portfolio.png"
          alt="personHero"
          className="object-contain z-10 relative"
        />
        <div className="relative container mx-auto my-10 w-full h-full z-20">
          {/* name */}
          <div className=" absolute left-0 bottom-0">
            <h1 className=" flex flex-col text-9xl font-extrabold">
              I&apos;M{" "}
              <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent stroke-orange-100">
                SAHID
              </span>
            </h1>
          </div>

          {/* designation  */}

          <div className=" absolute right-0 bottom-0">
            <h1 className=" flex flex-col text-5xl font-bold uppercase">
                mern stack <br /> developer.<br /> UI/UX Designer
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
