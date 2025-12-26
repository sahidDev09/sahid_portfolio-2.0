import React from "react";
import { Button } from "./ui/button";

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
      <div className="relative z-10 flex items-center flex-col gap-3">
        <h1 className="text-4xl font-bold">hello hero section</h1>
        <p className="text-lg">This is a hero component</p>
        <Button>Click me</Button>
      </div>
    </div>
  );
};

export default Hero;
