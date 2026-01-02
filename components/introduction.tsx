import { InteractiveHoverButton } from "./ui/interactive-hover-button";

const Introduction = () => {
  return (
    <div className="container mx-auto my-10 relative z-0">
      <h1 className=" font-neue md:text-[3.6vw] md:leading-[4.4vw] tracking-normal">
        Welcome to my digital portfolio! I&apos;m Sahid, a passionate MERN stack
        developer dedicated to crafting beautiful and functional websites. Dive
        in to explore my work and journey{" "}
        <InteractiveHoverButton className=" text-2xl bg-zinc-600 text-[#bc7dff] align-bottom">
          Latest Projects
        </InteractiveHoverButton>
      </h1>
    </div>
  );
};

export default Introduction;
