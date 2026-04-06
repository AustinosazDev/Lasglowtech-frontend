// import { motion } from "framer-motion";
// import { Osaz, Chimex, James, Precious, Izu } from "./images";

// const team = [
//   { name:"Omozemoje A. Oisasoje", role:"Full Stack Developer / Founder", image:Osaz, url:"https://lasglowtech.com.ng/bio" },
//   { name:"Onuoha Chimezie",       role:"Full-Stack Developer",           image:Chimex, url:"/" },
//   { name:"Precious Emmanuel",     role:"Web UI/UX Designer",             image:Precious, url:"/" },
//   { name:"Solomon James",         role:"Video Editor / Photographer",    image:James, url:"/" },
//   { name:"Isaiah Izuchukwu",      role:"Product Designer",               image:Izu, url:"/" },
// ];

// export default function MeetTheTeam() {
//   return (
//     <section className="py-20 md:py-28 px-6 md:px-12 bg-[#1a1030]">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-14">
//           <span className="section-tag justify-center"><span className="dot-live" />Our Team</span>
//           <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight">Meet the team</h2>
//           <p className="mt-3 text-[#9b8cb5] max-w-2xl mx-auto leading-relaxed">
//             Meet the creative minds behind Lasglowtech. Dedicated, talented, and laser-focused on delivering exceptional results.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {team.map((m, i) => (
//             <motion.a key={i} href={m.url}
//               initial={{ opacity:0, y:30 }}
//               whileInView={{ opacity:1, y:0 }}
//               viewport={{ once:true, amount:0.2 }}
//               transition={{ delay:i*0.1, duration:0.5, ease:"easeOut" }}
//               className="brand-card group overflow-hidden block">
//               <div className="relative h-60 overflow-hidden">
//                 <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#120b1f] via-[#120b1f]/30 to-transparent" />
//               </div>
//               <div className="p-5">
//                 <h3 className="font-extrabold text-base text-white group-hover:text-orange-500 transition-colors mb-1">{m.name}</h3>
//                 <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#8700ff]/15 border border-[#8700ff]/30 text-[#8700ff]">
//                   {m.role}
//                 </span>
//               </div>
//             </motion.a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import { Osaz,Chimex, James, Precious, Izu } from "./images";
import { Link } from "react-router-dom";
const teamMembers = [
    {
        name: "Omozemoje A. Oisasoje",
        role: "Full Stack Developer/Founder",
        image: Osaz, // Replace with actual image path
        url:'https://lasglowtech.com.ng/bio'
    },
    {
        name: "Onuoha Chimezie",
        role: "Full-stack  Developer",
        image: Chimex,
         url:''
    },
    {
        name: "Precious Emmanuel",
        role: "Web UI/UX Designer",
        image: Precious,
         url:''
    },
    {
        name: "Solomon  James",
        role: "Video Editor/Photographer",
        image: James,
         url:''
    },
    {
        name: "Isaiah Izuchukwu ",
        role: "Product Designer",
        image: Izu,
         url:''
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

const MeetTheTeam = () => {
    return (
        <section className="bg-gradient-to-r from-bgcolor2 to-bgcolor2 text-textcolor2 py-16 px-6 md:px-12">

            <div className="max-w-6xl mx-auto">
            <div className="pb-12 md:pb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-textcolor2">
                    Meet the Team
                </h2>
                <p className="py-4 text-muted mx-auto max-w-2xl leading-relaxed text-base">
                    Meet the creative and innovative minds. Our team is dedicated to delivering exceptional results and pushing the boundaries of what's possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {teamMembers.map((member, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariants}
                        className="flex items-center md:flex-row flex-col justify-between gap-6  mt-3 relative"
                    >
                        {/* Profile Image */}
                        <div className="w-[300px] bg-[#d9d9d9] rounded-2xl overflow-hidden">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale"
                            />
                        </div>

                        {/* Text Card */}
                        <div className="w-[300px] bg-bgcolor flex flex-col items-center justify-center border border-Primarycolor/40 md:mt-6 mt-[-50px] rounded-2xl p-6 relative">
                            <h3 className="text-xl font-semibold leading-tight">
                                {member.name}
                            </h3>

                            {/* Line connecting to the image */}
                            <div className="absolute top-1/2 md:left-[-30px] w-[30px] h-[1px]  hidden md:block" />

                            <div className="h-[1px] w-full bg-Primarycolor my-4" />

                          <a href={member.url} ><button className="bg-Primarycolor text-sm px-4 py-2 rounded-full font-medium hover:bg-Secondarycolor transition-all">
                                {member.role.toUpperCase()}
                            </button>
                            </a> 
                        </div>
                    </motion.div>
                ))}
            </div>
            </div>
        </section>
    );
};

export default MeetTheTeam;
