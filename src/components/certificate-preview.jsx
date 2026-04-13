import React, { forwardRef, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { logoImg, sealImg } from "../components/images";

const formatCertificateDate = (input) => {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })}`;
};

const Seal = ({ sealUrl }) => {
  const src = sealUrl || sealImg;
  return (
    <div className="absolute right-[3%] bottom-[7%] z-[3] pointer-events-none">
      <div className="relative rounded-full bg-white p-2 shadow-[0_12px_28px_rgba(0,0,0,0.35)] w-[clamp(4.5rem,11vw,8.75rem)] h-[clamp(4.5rem,11vw,8.75rem)] flex items-center justify-center rotate-[-8deg]">
        <img
          src={src}
          alt=""
          className="w-full h-full object-contain opacity-[0.97]"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

const CertificatePreview = forwardRef(function CertificatePreview(
  {
    recipientName = "Precious Abdul",
    courseName = "Graphic Design",
    date = "",
    certificateCode = "8726315",
    signatureLabel = "Authorized Signatory",
    bodyMessage = "This professional has demonstrated initiative and a commitment to deepening their skills and advancing their career.",
    logoUrl = "",
    sealUrl = "",
    signatureImageUrl = "",
    verifyUrl = "",
  },
  ref
) {
  const displayDate = formatCertificateDate(date);
  const logoSrc = logoUrl || logoImg;

  const resolvedVerifyUrl = useMemo(() => {
    if (verifyUrl) return verifyUrl;
    if (typeof window !== "undefined" && certificateCode) {
      return `${window.location.origin}/verify-certificate?code=${encodeURIComponent(certificateCode)}`;
    }
    return "";
  }, [verifyUrl, certificateCode]);

  return (
    <div
      ref={ref}
      data-certificate-preview="true"
      className="w-full overflow-hidden rounded-sm certificate-print-root bg-gradient-to-b from-[#120b1f] to-[#1d2348]"
      style={{ aspectRatio: "1.414 / 1" }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-[8.5%] w-[16%] border-l-[16px] border-t-[16px] border-[#f27b02]" />
          <div className="absolute right-0 top-0 h-[8.5%] w-[16%] border-r-[16px] border-t-[16px] border-[#f27b02]" />
          <div className="absolute bottom-0 left-0 h-[8.5%] w-[16%] border-b-[16px] border-l-[16px] border-[#f27b02]" />
          <div className="absolute bottom-0 right-0 h-[8.5%] w-[16%] border-b-[16px] border-r-[16px] border-[#f27b02]" />
        </div>

        <div className="absolute inset-[4.2%] rounded-2xl border border-[#e8894a] bg-[#f8f6f2] shadow-[inset_0_0_12px_rgba(0,0,0,0.06),0_20px_64px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-[2px] rounded-[14px] border border-[#cfd4df] pointer-events-none z-[1]" />

          <div className="absolute right-0 top-0 h-full w-[15.5%] bg-gradient-to-b from-[#120b1f] to-[#1d2348] border-l-[6px] border-[#f27b02] z-0" />

          <div className="relative z-[2] flex h-full flex-col pt-[5.2%] pb-[6%] pl-[5%] pr-[17%]">
            <div className="mb-[4%] flex flex-wrap items-center gap-3">
              <img
                src={logoSrc}
                alt="Lasglowtech"
                className="h-11 w-auto max-w-[200px] object-contain md:h-[52px] md:max-w-[220px]"
                crossOrigin="anonymous"
              />
              <div>
                <h1
                  className="text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold leading-tight text-[#13224a]"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  LASGLOWTECH
                </h1>
                <p
                  className="text-[clamp(0.65rem,1.1vw,0.875rem)] text-[#5c5f72] -mt-0.5"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  DIGITAL SERVICES
                </p>
              </div>
            </div>

            <div className="mb-[3.2%] space-y-1">
              <p
                className="text-[clamp(0.65rem,1.15vw,0.9rem)] uppercase tracking-[0.38em] text-[#555555]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Certificate of
              </p>
              <p
                className="text-[clamp(2rem,6.5vw,4.5rem)] font-extrabold uppercase leading-[1] text-[#13224a]"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                Completion
              </p>
            </div>

            <div className="mb-[3%] max-w-[min(100%,76%)]">
              <p
                className="text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.05] text-[#10214b] pb-3"
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                }}
              >
                {recipientName}
              </p>
              <div className="mt-1 h-0 max-w-[min(100%,78%)] border-b-2 border-[#132d4c]" />
            </div>

            <div className="max-w-[min(100%,76%)] space-y-2">
              <p
                className="text-[clamp(0.7rem,1.25vw,1.05rem)] leading-relaxed text-[#1b1f2f]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                has successfully completed the online course
              </p>
              <p
                className="text-[clamp(1rem,2.4vw,1.65rem)] font-semibold leading-snug text-[#13224a]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {courseName}
              </p>
            </div>

            <div className="mt-5 max-w-[min(100%,72%)] text-[clamp(0.65rem,1.15vw,0.95rem)] leading-[1.68] text-[#263252]">
              {bodyMessage}
            </div>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-x-5 gap-y-4 border-t border-[#13224a]/10 pt-5 pb-1">
              {resolvedVerifyUrl && (
                <div className="flex shrink-0 flex-col items-start gap-1.5 pl-0.5">
                  <div className="rounded-md bg-white p-1.5 shadow-md shadow-black/10 ring-1 ring-[#13224a]/10">
                    <QRCodeSVG value={resolvedVerifyUrl} size={64} level="M" fgColor="#13224a" bgColor="#ffffff" />
                  </div>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#596073]">
                    Scan to verify
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1 self-end pb-0.5 pl-1">
                <p
                  className="text-[clamp(0.8rem,1.4vw,1.05rem)] font-semibold leading-tight text-[#13224a]"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {displayDate}
                </p>
                <p className="mt-1.5 text-[clamp(0.55rem,0.85vw,0.72rem)] leading-snug text-[#6c7285] break-words">
                  Certificate code: {certificateCode}
                </p>
              </div>

              <div className="shrink-0 self-end pb-1 pr-1 text-right min-w-[6.5rem] max-w-[34%]">
                {signatureImageUrl ? (
                  <img
                    src={signatureImageUrl}
                    alt=""
                    className="ml-auto block max-h-[56px] max-w-[180px] object-contain object-bottom mb-2"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="mb-2 ml-auto w-20 border-b border-[#1a244f] md:w-32" />
                )}
                <p className="text-[clamp(0.5rem,0.8vw,0.68rem)] leading-tight text-[#596073]">{signatureLabel}</p>
              </div>
            </div>
          </div>

          <Seal sealUrl={sealUrl} />
        </div>
      </div>
    </div>
  );
});

export default CertificatePreview;
