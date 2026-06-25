import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import instance from "../config/axios.config";
import { isAuthenticated } from "../utils/auth";
import CircularBackButton from "../components/CircularBackButton";

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount || 0);

const PaymentSuccess = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState("");

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const txRef = query.get("tx_ref");
  const transactionId = query.get("transaction_id");
  const isSuccessful = verification?.status === "successful";
  const authed = isAuthenticated();

  useEffect(() => {
    const verify = async () => {
      if (!txRef) {
        setError("No transaction reference found.");
        setLoading(false);
        return;
      }

      try {
        const verifyUrl = transactionId
          ? `/payments/verify/${encodeURIComponent(txRef)}?transaction_id=${encodeURIComponent(transactionId)}`
          : `/payments/verify/${encodeURIComponent(txRef)}`;
        const res = await instance.get(verifyUrl);
        setVerification(res.data?.data || null);
        setDelivery(res.data?.delivery || null);
        if (!res.data?.data) {
          setError(
            res.data?.message ||
              "Payment verification is pending. Check your email or contact support if you completed payment."
          );
        }
      } catch {
        setError("Could not verify this payment right now.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [txRef, transactionId]);

  useEffect(() => {
    if (!isSuccessful || !delivery?.externalUrl || delivery.deliveryType !== "digital_link") return;
    const timer = window.setTimeout(() => {
      window.location.href = delivery.externalUrl;
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [isSuccessful, delivery]);

  const handleDownload = () => {
    if (delivery?.downloadUrl) {
      window.location.href = delivery.downloadUrl;
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-bgcolor text-textcolor2">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <CircularBackButton fallback="/catalogues" />
        </div>
        <div className="brand-card rounded-[28px] p-6 md:p-8">
        {loading && <p className="text-gray-400">Confirming your payment…</p>}

        {!loading && error && (
          <div>
            <h1 className="text-2xl font-semibold mb-3">Payment status</h1>
            <p className="text-red-400 mb-4">{error}</p>
            <Link to="/catalogues" className="text-Secondarycolor hover:underline">
              Browse catalogues
            </Link>
          </div>
        )}

        {!loading && !error && verification && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              {isSuccessful ? (
                <FaCheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <span className="w-8 h-8 rounded-full border-2 border-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Payment</p>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {isSuccessful ? "Payment successful" : "Payment not confirmed"}
                </h1>
                <p className="text-gray-400 mt-2">
                  {verification.meta?.serviceName || verification.meta?.serviceSlug || "Your order"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-bgcolor2/40 p-4 text-sm space-y-2">
              <p>
                Amount: <span className="font-semibold text-Secondarycolor">{formatNaira(verification.amount)}</span>
              </p>
              <p className="text-gray-400 break-all">Reference: {verification.tx_ref}</p>
            </div>

            {isSuccessful && delivery?.isDigitalProduct && (
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300 mb-2">Your product is ready</p>

                {delivery.deliveryType === "digital_file" && delivery.downloadUrl && (
                  <>
                    <p className="text-sm text-gray-300 mb-4">
                      {authed
                        ? "Download your file now. You can also access it anytime from My Orders."
                        : "Download your file now. We also emailed your download link — save it for later access."}
                    </p>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download {delivery.deliverableFileName || "now"}
                    </button>
                    {!authed && delivery.accessUrl && (
                      <p className="mt-3 text-xs text-gray-500 break-all">
                        Save this link:{" "}
                        <a href={delivery.accessUrl} className="text-Secondarycolor hover:underline">
                          {delivery.accessUrl}
                        </a>
                      </p>
                    )}
                  </>
                )}

                {delivery.deliveryType === "digital_link" && delivery.externalUrl && (
                  <>
                    <p className="text-sm text-gray-300 mb-4">
                      Redirecting you to your access link… We also emailed the link to you.
                    </p>
                    <a
                      href={delivery.externalUrl}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Open product now
                    </a>
                  </>
                )}
              </div>
            )}

            {isSuccessful && !delivery?.isDigitalProduct && (
              <p className="text-sm text-gray-400">
                Thank you. Our team will follow up on your service order. Your receipt has been emailed to you.
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              {authed && (
                <Link to="/my/orders" className="text-Secondarycolor hover:underline text-sm font-medium">
                  My orders
                </Link>
              )}
              {!authed && (
                <Link to="/auth/login" className="text-Secondarycolor hover:underline text-sm font-medium">
                  Create account / Sign in
                </Link>
              )}
              <Link to="/catalogues" className="text-gray-400 hover:text-Secondarycolor text-sm">
                Browse more products
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
