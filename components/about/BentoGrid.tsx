import { motion, type Variants } from "framer-motion";
import ProfileCard from "./ProfileCard";
import SkillsCard from "./SkillsCard";
import EducationCard from "./EducationCard";
import GithubActivity from "./GithubActivity";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const BentoGrid = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full container mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Profile Card - Spans 2 rows on larger screens */}
      <motion.div
        className="md:row-span-2"
        variants={itemVariants}
      >
        <ProfileCard
          name="Your Name"
          title="Full Stack Developer"
          handle="yourhandle"
          location="Sylhet, Bangladesh"
          email="hello@example.com"
        />
      </motion.div>

      {/* Skills Card */}
      <motion.div
        className="lg:col-span-2"
        variants={itemVariants}
      >
        <SkillsCard />
      </motion.div>

      {/* Education Card */}
      <motion.div variants={itemVariants}>
        <EducationCard />
      </motion.div>

      {/* GitHub Activity Card */}
      <motion.div variants={itemVariants}>
        <GithubActivity />
      </motion.div>
    </motion.div>
  );
};

export default BentoGrid;
