import { motion } from "framer-motion";
import IconWave from "./IconWave";

const IconMarque = () => {
  return (
    <section className=" pt-10 flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <IconWave />
      </motion.div>
    </section>
  );
};

export default IconMarque;
