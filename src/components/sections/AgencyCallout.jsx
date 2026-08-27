import { CONTACT } from "../../utils/siteConfig";

const buildWhatsAppUrl = () => {
  const phone = CONTACT.phone.replace(/\D/g, "");
  const message = encodeURIComponent("Hi Lasglowtech, I'd like to book a free discovery call to discuss custom development work.");
  return `https://wa.me/${phone}?text=${message}`;
};

const AgencyCallout = () => {
  return (
    <div className="brand-card rounded-3xl p-6 md:p-8 bg-Primarycolor">
      <h3 className="text-lg md:text-xl font-bold text-textcolor2 mb-3">
        Need more than templates?
      </h3>
      <p className="text-sm text-Secondarycolor mb-5 leading-relaxed">
        We build custom websites, web apps, mobile apps, and full brand identities tailored to your business needs.
      </p>
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-Primarycolor font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        Book a Free Discovery Call
      </a>
    </div>
  );
};

export default AgencyCallout;