import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { LOGO } from "../components/images";
import CircularBackButton from "../components/CircularBackButton";

const DownloadPage = () => {
  const { token } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get(`/payments/delivery/${encodeURIComponent(token)}`);
        setDelivery(res.data);
      } catch {
        setError("This download link is invalid or payment has not been confirmed yet.");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  const handleFileDownload = () => {
    if (!delivery?.downloadUrl) return;
    window.location.href = delivery.downloadUrl;
  };

  return (
    <div className="min-h-screen bg-bgcolor text-textcolor2">
      <SEO title="Download your purchase | Lasglowtech" description="Access your digital product download." />

      <header className="border-b border-Primarycolor/20 bg-bgcolor2/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-3">
          <CircularBackButton fallback="/catalogues" />
          <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded shrink-0" />
          <span className="font-semibold text-sm truncate">Lasglowtech Downloads</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="brand-card rounded-[28px] p-6 md:p-8">
          {loading && <p className="text-gray-400">Loading your download…</p>}

          {!loading && error && (
            <>
              <h1 className="text-2xl font-semibold mb-3">Download unavailable</h1>
              <p className="text-gray-400 mb-6">{error}</p>
              <Link to="/my/orders" className="text-Secondarycolor hover:underline">
                View my orders
              </Link>
            </>
          )}

          {!loading && !error && delivery && (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-Secondarycolor mb-2">Payment confirmed</p>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{delivery.serviceName}</h1>
              <p className="text-gray-400 mb-8">
                {delivery.deliveryType === "digital_file"
                  ? "Your file is ready. Click below to download."
                  : "Your access link is ready."}
              </p>

              {delivery.deliveryType === "digital_file" && delivery.downloadUrl && (
                <button
                  type="button"
                  onClick={handleFileDownload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                >
                  <FaDownload className="w-4 h-4" />
                  Download {delivery.deliverableFileName || "your file"}
                </button>
              )}

              {delivery.deliveryType === "digital_link" && delivery.externalUrl && (
                <a
                  href={delivery.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  Open your product
                </a>
              )}

              {delivery.pendingSetup && (
                <p className="text-amber-300">
                  Your payment is confirmed. The seller is still preparing this digital product — check your email shortly.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;
