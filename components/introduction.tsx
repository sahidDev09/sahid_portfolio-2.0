import BlurText from "./BlurText";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

const Introduction = () => {
  const handleAnimationComplete = () => {
    return
  };

  return (
    <div className="container mx-auto my-10 relative z-0">
      <h1 className=" md:text-[3.6vw] md:leading-[4.4vw] tracking-normal">

        <BlurText
          text="Welcome to my digital portfolio! I'm Sahid, a passionate MERN stack developer dedicated to crafting beautiful and functional websites. Dive in to explore my work and journey"
          direction="bottom"
          className=""
          delay={50}
          onAnimationComplete={handleAnimationComplete}
          as="span"
        >
          <InteractiveHoverButton className="text-2xl bg-gray-600/20 backdrop-blur-xl border border-purple-400/20 text-[#bc7dff] ml-2">
            Latest Projects
          </InteractiveHoverButton>
        </BlurText>
      </h1>
    </div>
  );
};

export default Introduction;
