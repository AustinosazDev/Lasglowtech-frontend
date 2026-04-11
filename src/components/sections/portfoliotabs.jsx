import React, { useState } from 'react';
import PortfolioCard from '../portfoliocards';
import {pelifts,heroimage,fiftyreign,Fhemfelhomes, Fhemfelhomes2, BriteB, BriteA,
Phoenixcover,ur9group,Smiggle2,Smiggle3,Smiggle4,RWA,DECOT,ur9graph,Austinport,Panth, Portweb,Osaz,
Fhemfeltravels1,
GreatN,
Lasglow1,
SureSwitch,
Graphic2,
Web1,
 } from "../images";
const tabs = ['All', 'Branding', 'Websites', 'Graphics', 'Web/UI'];

const portfolioData = {




  
  Websites : [
    {
      image: ur9graph,
      description: 'UR9 Group',
      link: 'https://ur9group.com',
    },

     {
      image: Portweb,
      description: 'Brand Website',
      link: 'https://lasglowtech.com.ng',
    },

    
     {
      image: GreatN,
      description: 'Company website Wordpress',
      link: 'https://greatnationluxuryhomes.com/',
    },
     {
      image: Panth,
      description: 'Restaurant Website, Next JS ',
      link: 'https://pantherarestlounge.com',
    },
    {
      image: Phoenixcover,
      description: 'Phoenixs Tech, Poland- React/Vite',
      link: 'https://phoenixstech.com',
    },
    {
      image: Graphic2,
      description: 'Personal Portfolio, Next js',
      link: 'https://austinosaz.vercel.app',
    },
{
      image: Austinport,
      description: 'Jobs pro clone, Vite-react',
      link: 'https://jobspro-clone-zeta.vercel.app/',
    },

    {
      image: RWA,
      description: 'Renaissance Web3 African (ongoing)',
      link: 'https://renaissanceweb3afrik.com/',
    },

    {
      image: DECOT,
      description: 'Decot Tech',
      link: 'https://decot-technology.com/',
    },
  ],
  Branding: [
    {
      image: Smiggle3,
      description: 'Car Branding.',
      link: 'https://dribbble.com/Austinosaz',
    },
    {
      image: BriteB,
      description: 'Packaging Design for BriteBerry Brand',
      link: 'https://dribbble.com/shots/27016784-Brite-Berry-Branding',
    },

    {
      image: BriteA,
      description: 'Packaging Design for BriteBerry Brand',
      link: 'https://dribbble.com/shots/27016784-Brite-Berry-Branding',
    },
  ],
  Graphics: [
    {
      image: ur9group,
      description: 'Social media flyer for campaign.',
      link: 'https://www.pinterest.com/lasglowtech/austine-osaz/ur9group-designs/',
    },

    {
      image: Fhemfelhomes2,
      description: 'Fhemfel homes.',
      link: 'https://dribbble.com/Austinosaz',
    },


    {
      image: Fhemfeltravels1,
      description: 'Social Media Designs for Fhemfel Travels.',
      link: 'https://dribbble.com/shots/25305695-Travel-flyer-design',
    },

   
     {
      image: SureSwitch,
      description: 'Social media design for SureSitch.',
      link: 'https://www.pinterest.com/lasglowtech/austine-osaz/sure-switch/',
    },

    {
      image: GreatN,
      description: 'Social media design for Great Nation Homes.',
      link: 'https://www.pinterest.com/lasglowtech/austine-osaz/great-nation-homes/',
    },

    {
      image: Smiggle4,
      description: 'Social media post for Smiggle.',
      link: 'https://www.pinterest.com/lasglowtech/pins/',
    },

    {
      image: Lasglow1,
      description: 'Personal branding design for Lasglowtech.',
      link: 'https://www.pinterest.com/lasglowtech/austine-osaz/lasglowtech/',
    },
    {
      image: pelifts,
      description: 'Social media design for Pe Lifts.',
      link: 'https://www.pinterest.com/lasglowtech/austine-osaz/pe-lifts-designs/',
    }
  ],
  'Web/UI': [
    {
      image: Web1,
      description: 'Dashboard UI for analytics platform.',
      link: 'https://www.pinterest.com/lasglowtech/pins/',
    },
    {
      image: RWA ,
      description: 'Portfolio site for designer.',
      link: 'https://www.pinterest.com/lasglowtech/pins/',
    },


    
  ],
};

const PortfolioTabs = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Combine all projects if 'All' is selected
  const projects =
    activeTab === 'All'
      ? Object.values(portfolioData).flat()
      : portfolioData[activeTab] || [];

  return (
    <div className="text-[#e8ddf8] w-full max-w-7xl mx-auto mt-2 py-8 md:py-16">
      {/* Category filters — rounded rectangles, not full pills */}
      <div
        className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-6 md:mb-10 px-1"
        role="tablist"
        aria-label="Portfolio categories"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={[
                "relative min-h-[44px] rounded-xl font-semibold tracking-wide transition-all duration-300",
                "text-xs sm:text-sm md:text-base px-4 py-2.5 sm:px-6 sm:py-3",
                "border active:scale-[0.97]",
                isActive
                  ? "border-transparent bg-gradient-to-r from-[#8700ff] via-[#7c3aed] to-[#c026d3] text-white shadow-[0_0_28px_rgba(135,0,255,0.42),0_4px_20px_rgba(249,115,22,0.15)] ring-2 ring-white/25 ring-offset-2 ring-offset-[#120b1f] sm:scale-[1.02]"
                  : "border-white/20 bg-white/[0.07] text-[#e8ddf8] backdrop-blur-md hover:border-[#8700ff]/55 hover:bg-[#8700ff]/20 hover:text-white hover:shadow-[0_8px_24px_rgba(135,0,255,0.2)]",
              ].join(" ")}
            >
              {isActive && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/10"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          );
        })}
      </div>

      {/* Grid layout */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 pt-2 pb-4 md:pt-4 md:pb-8 items-stretch">
        {projects.length > 0 ? (
          projects.map((item, index) => (
            <PortfolioCard
              key={`${item.link}-${index}`}
              image={item.image}
              alt={`${activeTab} ${index + 1}`}
              description={item.description}
              link={item.link}
              delay={index * 0.1}
              featured={index === 0}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-muted text-lg">
            No projects in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default PortfolioTabs;

