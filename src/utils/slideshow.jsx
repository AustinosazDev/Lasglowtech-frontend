import Marquee from "react-fast-marquee";
import { Ur9, Phoenixs, Qlogo, Fgroup, Dtech, Pelifts, Smiggle, NMI } from "../components/images";

const companies = [
  { name:"UR9 Group", logo:Ur9 },
  { name:"PE Lifts Ghana", logo:Pelifts },
  { name:"Smiggle IASOL", logo:Smiggle },
  { name:"NMI", logo:NMI },
  { name:"Fhemfel Group", logo:Fgroup },
  { name:"Quisitive Lounge", logo:Qlogo },
  { name:"Phoenixs Tech", logo:Phoenixs },
  { name:"Decot Tech", logo:Dtech },
];

export default function CompanySlider() {
  return (
    <div className="py-8 bg-[#120b1f] border-y border-[#8700ff]/15">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-[#9b8cb5] mb-6">Trusted by brands across Nigeria</p>
      <Marquee speed={38} gradient={false} pauseOnHover>
        {companies.map((c, i) => (
          <div key={i} className="mx-6 flex items-center justify-center min-w-[120px]">
            <img src={c.logo} alt={c.name} className="h-12 w-auto object-contain opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        ))}
      </Marquee>
    </div>
  );
}

