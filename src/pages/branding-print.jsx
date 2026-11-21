import { Link } from "react-router-dom";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";
import Subscription from "../components/sections/subscription";
import BrandedWorkBanner from "../components/sections/BrandedWorkBanner";

const serviceCategories = [
  {
    title: "Brand Identity",
    items: ["Logo", "Brand guidelines", "Stationery"]
  },
  {
    title: "Apparel",
    items: ["T-shirts", "Polos", "Hoodies", "Caps", "Uniforms"]
  },
  {
    title: "Print",
    items: ["Business cards", "Flyers", "Brochures", "Posters", "Booklets"]
  },
  {
    title: "Large Format",
    items: ["Banners", "Billboards", "Roll-ups", "Backdrops", "Signage"]
  },
  {
    title: "Product Packaging",
    items: ["Labels", "Boxes", "Paper bags", "Stickers", "Product packaging"]
  },
  {
    title: "Vehicle Branding",
    items: ["Cars", "Vans", "Buses", "Fleet branding"]
  },
  {
    title: "Corporate Branding",
    items: ["Pens", "Notebooks", "ID cards", "Mugs", "Corporate gifts"]
  }
];

export default function BrandingPrint() {
  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Branding & Print Services | Lasglowtech"
        description="From the screen to the street, we design and produce the physical materials that make your brand recognizable. Apparel, packaging, vehicle branding, and more."
        url="/branding-print"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Branding & Print", url: "/branding-print" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />
        
        <nav className="flex items-center justify-center gap-2 pb-6 text-sm text-[#9b8cb5]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-orange-500">Branding & Print</span>
        </nav>
       
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Branding & Print</span>
          <h1 className="text-white pt-8 pb-3 mx-auto md:max-w-2xl mb-5 text-4xl md:text-5xl lg:text-6xl font-bold">
            Your Brand Should Look Good Everywhere.
          </h1>
          <p className="type-muted text-lg max-w-2xl mx-auto mb-8">
            From the screen to the street, we design and produce the physical materials that make your brand recognizable.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Get Started</Link>
            <Link to="/catalogues" className="btn-outline">View Catalogue</Link>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="section-tag justify-center"><span className="dot-live"/>Our Services</span>
          <h2 className="text-white mb-4">Complete Branding & Print Solutions</h2>
          <p className="type-muted max-w-2xl mx-auto">
            We offer end-to-end branding and print services to ensure your brand looks professional across every touchpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, index) => (
            <div key={index} className="brand-card p-6">
              <h3 className="text-white font-semibold text-lg mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="type-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Branded Work Banner */}
      <BrandedWorkBanner />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="brand-card p-8 md:p-12 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Ready to elevate your brand?</h2>
          <p className="type-muted max-w-2xl mx-auto mb-8">
            Let's discuss how we can help you create stunning branding and print materials that make your business stand out.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <Link to="/catalogues" className="btn-outline">Browse Catalogue</Link>
          </div>
        </div>
      </section>

      <Subscription />
    </div>
  );
}