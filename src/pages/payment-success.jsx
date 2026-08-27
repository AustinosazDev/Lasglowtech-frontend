import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import instance from "../config/axios.config";
import { isAuthenticated } from "../utils/auth";
import CircularBackButton from "../components/CircularBackButton";
import AgencyCallout from "../components/sections/AgencyCallout";

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
  const urlStatus = query.get("status");
  const isSuccessful = verification?.status === "successful" || urlStatus === "completed";
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
      } catch (err) {
        if (err.response?.status === 403) {
          setError(err.response?.data?.error || "You do not have permission to view this transaction. Please sign in with the email address used for this purchase.");
        } else if (err.response?.status === 404) {
          setError(err.response?.data?.error || "Transaction not found.");
        } else {
          setError("Could not verify this payment right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [txRef, transactionId]);

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
        {loading && urlStatus !== "completed" && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-Secondarycolor mb-4"></div>
            <p className="text-gray-400">Confirming your payment…</p>
          </div>
        )}

        {loading && urlStatus === "completed" && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mb-4"></div>
            <p className="text-emerald-400">Payment completed! Finalizing details…</p>
          </div>
        )}

        {!loading && error && (
          <div>
            <h1 className="text-2xl font-semibold mb-3">Payment status</h1>
            <p className="text-red-400 mb-4">{error}</p>
            {error.includes("permission") || error.includes("sign in") ? (
              <div className="space-y-3">
                <Link to="/auth/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity">
                  Sign in with your purchase email
                </Link>
                <p className="text-gray-400 text-sm">
                  You must sign in with the same email address you used during purchase to view this transaction.
                </p>
              </div>
            ) : (
              <Link to="/catalogues" className="text-Secondarycolor hover:underline">
                Browse catalogues
              </Link>
            )}
          </div>
        )}

        {(!loading || urlStatus === "completed") && !error && (verification || urlStatus === "completed") && (
          <div className="space-y-5">
            {/* Security warning for non-authenticated users */}
            {!authed && (
              <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4">
                <p className="text-amber-300 text-sm font-medium mb-2">⚠️ Security Notice</p>
                <p className="text-gray-300 text-sm">
                  For your security, please sign in with the email address you used during purchase to view your complete order details and access downloads.
                  <Link to="/auth/login" className="text-Secondarycolor hover:underline ml-2">Sign in now</Link>
                </p>
              </div>
            )}

            <div className="flex items-start gap-3">
              {isSuccessful ? (
                <FaCheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <span className="w-8 h-8 rounded-full border-2 border-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Payment</p>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {isSuccessful ? "Payment successful" : "Payment not confirmed"}
                </h1>
                <p className="text-gray-400 mt-2">
                  {verification?.meta?.serviceName || verification?.meta?.serviceSlug || "Your order"}
                </p>
                {urlStatus === "completed" && loading && (
                  <p className="text-emerald-400 text-sm mt-1">Payment completed! Verifying details…</p>
                )}
              </div>
            </div>

            {verification && authed && (
              <div className="rounded-2xl border border-white/10 bg-bgcolor2/40 p-4 text-sm space-y-2">
                <p>
                  Amount: <span className="font-semibold text-Secondarycolor">{formatNaira(verification.amount)}</span>
                </p>
                <p className="text-gray-400 break-all">Reference: {verification.tx_ref}</p>
                {transactionId && (
                  <p className="text-gray-400 break-all">Transaction ID: {transactionId}</p>
                )}
                {verification.flw_ref && (
                  <p className="text-gray-400 break-all">Flutterwave Reference: {verification.flw_ref}</p>
                )}
              </div>
            )}

            {!verification && urlStatus === "completed" && authed && (
              <div className="rounded-2xl border border-white/10 bg-bgcolor2/40 p-4 text-sm space-y-2">
                <p className="text-gray-400 break-all">Reference: {txRef}</p>
                {transactionId && (
                  <p className="text-gray-400 break-all">Transaction ID: {transactionId}</p>
                )}
                <p className="text-gray-500 text-xs">Loading payment details…</p>
              </div>
            )}

            {!authed && (
              <div className="rounded-2xl border border-white/10 bg-bgcolor2/40 p-4 text-sm space-y-2">
                <p className="text-gray-400">Reference: {txRef || "Unknown"}</p>
                <p className="text-gray-500 text-xs">
                  Sign in to view complete transaction details and access your downloads.
                </p>
              </div>
            )}

            {isSuccessful && verification && authed && delivery?.isDigitalProduct && (
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300 mb-2">Your product is ready</p>

                {delivery.deliveryType === "digital_file" && delivery.downloadUrl && (
                  <>
                    <p className="text-sm text-gray-300 mb-4">
                      Download your file now. You can also access it anytime from My Orders.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download {delivery.deliverableFileName || "now"}
                    </button>
                  </>
                )}

                {delivery.deliveryType === "digital_link" && delivery.externalUrl && (
                  <>
                    <p className="text-sm text-gray-300 mb-4">
                      Your files are ready. We've also emailed the link to you.
                    </p>
                    <a
                      href={delivery.externalUrl}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      {delivery.assetFormat ? "Open your files" : "Open product now"}
                    </a>
                  </>
                )}
              </div>
            )}

            {!authed && isSuccessful && (
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300 mb-2">Your product is ready</p>
                <p className="text-sm text-gray-300 mb-4">
                  Your payment was successful! Sign in to access your downloads and view your complete order details.
                </p>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                >
                  Sign in to access downloads
                </Link>
              </div>
            )}

            {isSuccessful && verification && authed && delivery?.isDigitalProduct && (
              <div className="mt-6">
                <AgencyCallout />
              </div>
            )}

            {isSuccessful && verification && authed && !delivery?.isDigitalProduct && (
              <p className="text-sm text-gray-400">
                Thank you. Our team will follow up on your service order. Your receipt has been emailed to you.
              </p>
            )}

            {!authed && isSuccessful && (
              <p className="text-sm text-gray-400">
                Thank you for your payment! Sign in to manage your order and access your purchases.
              </p>
            )}

            {urlStatus === "completed" && loading && authed && (
              <p className="text-sm text-gray-400">
                Processing your order. You'll receive a confirmation email shortly.
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
