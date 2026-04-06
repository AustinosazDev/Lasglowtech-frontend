import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return visible ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#8700ff] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:bg-orange-500 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1"
      aria-label="Scroll to top">
      <FaArrowUp className="w-4 h-4" />
    </button>
  ) : null;
}


