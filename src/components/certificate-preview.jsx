import React, { forwardRef, useEffect, useState } from "react";

const formatCertificateDate = (input) => {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;

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

const Seal = () => (
  <div className="absolute right-[6.5%] bottom-[8.8%] z-[3] flex items-end gap-2">
    <div className="w-14 md:w-24 border-b border-[#1a244f]" />
    <div className="relative w-16 h-16 md:w-24 md:h-24">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="31" fill="#1f2752" />
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = (i * 12.857 * Math.PI) / 180;
          const innerRadius = 32;
          const outerRadius = 46;
          const x1 = 50 + innerRadius * Math.cos(angle);
          const y1 = 50 + innerRadius * Math.sin(angle);
          const x2 = 50 + outerRadius * Math.cos(angle);
          const y2 = 50 + outerRadius * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f8fafc" strokeWidth="3" />;
        })}
        <circle cx="50" cy="50" r="20" fill="#ff6b35" />
        <circle cx="50" cy="50" r="11" fill="#1f2752" />
      </svg>
    </div>
  </div>
);

const CertificatePreview = forwardRef(function CertificatePreview(
  {
    recipientName = "Precious Abdul",
    courseName = "Graphic Design",
    date = "",
    certificateCode = "8726315",
    signatureLabel = "Authorized Signatory",
    bodyMessage = "This professional has demonstrated initiative and a commitment to deepening their skills and advancing their career.",
    logoUrl = "",
  },
  ref
) {
  const displayDate = formatCertificateDate(date);
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logoUrl) && !logoFailed;

  useEffect(() => {
    setLogoFailed(false);
  }, [logoUrl]);

  return (
    <div ref={ref} className="w-full overflow-hidden bg-[#1d2348]" style={{ aspectRatio: "1.414 / 1" }}>
      <div className="relative h-full w-full overflow-hidden bg-[#1d2348]">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[8.5%] w-[16%] border-l-[18px] border-t-[18px] border-[#ff6b35]" />
          <div className="absolute right-0 top-0 h-[8.5%] w-[16%] border-r-[18px] border-t-[18px] border-[#ff6b35]" />
          <div className="absolute bottom-0 left-0 h-[8.5%] w-[16%] border-b-[18px] border-l-[18px] border-[#ff6b35]" />
          <div className="absolute bottom-0 right-0 h-[8.5%] w-[16%] border-b-[18px] border-r-[18px] border-[#ff6b35]" />
        </div>

        <div className="absolute inset-[4.2%] rounded-[18px] border border-[#f27b48] bg-[#f8f6f2] shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-[2px] rounded-[16px] border border-[#cfd4df]" />
          <div className="absolute right-0 top-0 h-full w-[15.5%] border-l-2 border-[#ff7a3d] bg-[#1d2348]" />

          <div className="relative z-[2] flex h-full flex-col px-[4.8%] pb-[5.3%] pt-[5.2%]">
            <div className="mb-[4.6%] flex items-start justify-between gap-4">
              <div className="min-w-0">
                {showLogo ? (
                  <img
                    src={logoUrl}
                    alt="Lasglowtech"
                    className="h-10 w-auto object-contain md:h-14"
                    crossOrigin="anonymous"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1d2348] bg-[#ff6b35] text-sm font-bold text-white md:h-12 md:w-12 md:text-lg">
                      L
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold uppercase tracking-[0.08em] text-[#13224a] md:text-xl"
                        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                      >
                        LASGLOWTECH
                      </div>
                      <div className="text-[8px] uppercase tracking-[0.38em] text-[#a06b53] md:text-[10px]">
                        DIGITAL SERVICES
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-[3.4%]">
              <div
                className="mb-1 text-[9px] uppercase tracking-[0.42em] text-[#8f7966] md:text-sm"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                CERTIFICATE OF
              </div>
              <div
                className="text-[2.25rem] font-bold uppercase leading-[0.95] text-[#13224a] md:text-[4.4rem]"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                COMPLETION
              </div>
            </div>

            <div className="mb-[4.2%] border-b border-[#b8bfcb] pb-[2%] pr-[16%]">
              <div
                className="text-[2.1rem] leading-none text-[#10214b] md:text-[3.9rem]"
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontWeight: 400 }}
              >
                {recipientName}
              </div>
            </div>

            <div className="pr-[18%]">
              <p className="mb-[1.8%] text-[0.72rem] text-[#1b1f2f] md:text-[1.25rem]">
                has successfully completed the online course
              </p>
              <div
                className="text-[1.25rem] font-semibold uppercase leading-tight text-[#13224a] md:text-[2.05rem]"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                {courseName}
              </div>
            </div>

            <div className="mt-[3%] max-w-[66%] text-[0.62rem] leading-relaxed text-[#263252] md:text-[0.98rem]">
              {bodyMessage}
            </div>

            <div className="mt-auto flex items-end justify-between gap-6 pr-[18%]">
              <div>
                <div
                  className="text-[0.8rem] font-semibold text-[#13224a] md:text-[1.5rem]"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {displayDate}
                </div>
                <div className="text-[0.45rem] text-[#6c7285] md:text-[0.72rem]">Certificate code: {certificateCode}</div>
              </div>

              <div className="pb-1 text-right">
                <div className="mb-1 w-20 border-b border-[#1a244f] md:w-32" />
                <div className="text-[0.42rem] text-[#596073] md:text-[0.65rem]">{signatureLabel}</div>
              </div>
            </div>
          </div>

          <Seal />
        </div>
      </div>
    </div>
  );
});

export default CertificatePreview;
