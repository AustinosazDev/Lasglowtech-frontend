import { motion } from "framer-motion";
import { Osaz, Chimex, James, Precious, Izu, Kachi } from "./images";

const teamMembers = [
  { name: "Omozemoje A. Oisasoje", role: "Full Stack Developer/Founder", image: Osaz, url: "https://lasglowtech.com.ng/bio" },
  { name: "Onuoha Chimezie", role: "Full-stack Developer", image: Chimex, url: "" },
  { name: "Precious Emmanuel", role: "Web UI/UX Designer", image: Precious, url: "" },
  { name: "Solomon James", role: "Video Editor/Photographer", image: James, url: "" },
  { name: "Isaiah Izuchukwu", role: "Product Designer", image: Izu, url: "" },
  { name: "Onyekachi Livinus", role: "Project/Product Manager/Digital Marketer", image: Kachi, url: "" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.5, ease: "easeOut" },
  }),
};

export default function MeetTheTeam() {
  return (
    <section className="py-16 px-6 md:px-12 text-[#e8ddf8]">
      <div className="max-w-6xl mx-auto">
        <div className="pb-12 md:pb-16 text-center">
          <span className="section-tag justify-center"><span className="dot-live" />Our team</span>
          <h2 className="text-white">Meet the Team</h2>
          <p className="py-4 type-muted mx-auto max-w-2xl">
            Meet the creative and innovative minds. Our team is dedicated to delivering exceptional results and pushing the boundaries of what&apos;s possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="flex items-center md:flex-row flex-col justify-between gap-6 mt-3 relative"
            >
              <div className="w-[300px] max-w-full bg-[#d9d9d9] rounded-2xl overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div className="w-[300px] max-w-full brand-card flex flex-col items-center justify-center md:mt-6 mt-[-50px] rounded-2xl p-6 relative text-center">
                <h3 className="text-xl font-semibold leading-tight text-white">
                  {member.name}
                </h3>

                <div className="absolute top-1/2 md:left-[-30px] w-[30px] h-px bg-[#8700ff]/40 hidden md:block" />

                <div className="h-px w-full bg-[#8700ff] my-4" />

                {member.url ? (
                  <a href={member.url}>
                    <span className="inline-block bg-[#8700ff] text-sm px-4 py-2 rounded-full font-medium text-white hover:bg-orange-500 transition-all">
                      {member.role.toUpperCase()}
                    </span>
                  </a>
                ) : (
                  <span className="inline-block bg-[#8700ff] text-sm px-4 py-2 rounded-full font-medium text-white">
                    {member.role.toUpperCase()}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
