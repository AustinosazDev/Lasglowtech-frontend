import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import instance from "../config/axios.config";

export default function VerifyCertificatePage() {
  const [params] = useSearchParams();
  const code = (params.get("code") || "").trim();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!code) {
        setStatus("idle");
        setError("Add a certificate code to the URL, for example: /verify-certificate?code=LGT-CERT-1-2");
        return;
      }
      setStatus("loading");
      setError("");
      try {
        const res = await instance.get("/lms/certificates/verify", { params: { code } });
        if (cancelled) return;
        if (res.data?.valid) {
          setData(res.data);
          setStatus("ok");
        } else {
          setError(res.data?.error || "Verification failed.");
          setStatus("fail");
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err.response?.data?.error || err.message || "Could not verify.";
        setError(msg);
        setStatus("fail");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#120b1f] to-[#1d2348] text-slate-100 px-4 py-16">
      <Helmet>
        <title>Verify certificate | Lasglowtech</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Certificate verification</h1>
        <p className="text-sm text-slate-400 mb-8">
          Enter the code printed on your certificate or scan the QR code we placed on your document.
        </p>

        {status === "loading" && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-slate-300 text-sm">Checking…</div>
        )}

        {status === "idle" && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-amber-100 text-sm">{error}</div>
        )}

        {status === "fail" && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-100 text-sm">{error}</div>
        )}

        {status === "ok" && data && (
          <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-6 py-6 shadow-lg shadow-emerald-900/20">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300/90 mb-2">Verified</p>
            <p className="text-lg font-medium text-white mb-1">{data.recipientName}</p>
            <p className="text-slate-300 text-sm mb-4">{data.courseTitle}</p>
            <dl className="text-sm space-y-2 text-slate-400 border-t border-white/10 pt-4">
              <div className="flex justify-between gap-4">
                <dt>Certificate code</dt>
                <dd className="text-slate-200 font-mono text-xs">{data.certificateCode}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Issued</dt>
                <dd className="text-slate-200">
                  {data.issuedAt
                    ? new Date(data.issuedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link to="/careers" className="text-[#f27b02] hover:underline">
            Back to Lasglowtech Careers
          </Link>
        </p>
      </div>
    </div>
  );
}
