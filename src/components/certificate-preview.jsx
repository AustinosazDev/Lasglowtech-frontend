import React, { forwardRef } from "react";

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

const CertificatePreview = forwardRef(function CertificatePreview(
  {
    recipientName = "Precious Abdul",
    courseName = "Graphic Design",
    date = "",
    certificateCode = "8726315",
    signatureLabel = "Director's Sign",
    bodyMessage = "This professional has demonstrated initiative and a commitment to deepening their skills and advancing their career.",
  },
  ref
) {
  const displayDate = formatCertificateDate(date);

  return (
    <div ref={ref} className="w-full bg-white overflow-hidden" style={{ aspectRatio: "1.414 / 1" }}>
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)" }}
      >
        <div className="absolute top-0 left-0 w-[12%] h-[17%] border-l-[22px] md:border-l-[32px] border-t-[22px] md:border-t-[32px] border-l-[#FF6B35] border-t-[#FF6B35]" />
        <div className="absolute top-0 right-0 w-[12%] h-[17%] border-r-[22px] md:border-r-[32px] border-t-[22px] md:border-t-[32px] border-r-[#FF6B35] border-t-[#FF6B35]" />
        <div className="absolute bottom-0 left-0 w-[12%] h-[17%] border-l-[22px] md:border-l-[32px] border-b-[22px] md:border-b-[32px] border-l-[#FF6B35] border-b-[#FF6B35]" />
        <div className="absolute bottom-0 right-0 w-[12%] h-[17%] border-r-[22px] md:border-r-[32px] border-b-[22px] md:border-b-[32px] border-r-[#FF6B35] border-b-[#FF6B35]" />

        <div className="absolute top-[6%] left-0 right-0 h-[6%] bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent opacity-80" />

        <div className="absolute inset-[5%] bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-2xl border-[3px] md:border-4 border-[#1a1f3a] overflow-hidden">
          <div className="absolute inset-2 border-2 border-[#FF6B35] rounded-lg opacity-30" />

          <div className="relative h-full flex flex-col p-5 md:p-10">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#FF6B35] flex items-center justify-center border-4 border-[#1a1f3a]">
                <span className="text-white font-bold text-xl md:text-2xl">L</span>
              </div>
              <div>
                <div className="text-lg md:text-2xl font-bold tracking-wide text-[#1a1f3a]">LASGLOWTECH</div>
                <div className="text-[10px] md:text-sm tracking-[0.3em] text-gray-600">DIGITAL SERVICES</div>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <div className="text-xs md:text-lg tracking-[0.35em] text-gray-600 mb-2">CERTIFICATE OF</div>
              <div className="text-3xl md:text-6xl font-bold tracking-tight text-[#1a1f3a]">COMPLETION</div>
            </div>

            <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b-2 border-gray-300">
              <div
                className="text-3xl md:text-6xl leading-none text-[#1a1f3a]"
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontWeight: 400 }}
              >
                {recipientName}
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <p className="text-sm md:text-lg text-gray-700 mb-3">has successfully completed the online course</p>
              <div className="text-xl md:text-4xl font-bold text-[#1a1f3a]">{courseName}</div>
            </div>

            <div className="mb-4 md:mb-6 text-gray-600">
              <p className="text-xs md:text-base leading-relaxed max-w-[70%]">
                {bodyMessage}
              </p>
            </div>

            <div className="mt-auto flex justify-between items-end gap-4">
              <div>
                <div className="text-sm md:text-lg font-semibold text-gray-800">{displayDate}</div>
                <div className="text-[10px] md:text-sm text-gray-600">Certificate code: {certificateCode}</div>
              </div>

              <div className="text-right">
                <div className="w-24 md:w-40 border-b-2 border-gray-800 mb-2" />
                <div className="text-[10px] md:text-sm text-gray-600">{signatureLabel}</div>
              </div>
            </div>
          </div>

          <div className="absolute right-[3%] bottom-[5%]">
            <div className="relative w-20 h-20 md:w-32 md:h-32">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#1a1f3a" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  const innerRadius = 35;
                  const outerRadius = 48;
                  const x1 = 50 + innerRadius * Math.cos(angle);
                  const y1 = 50 + innerRadius * Math.sin(angle);
                  const x2 = 50 + outerRadius * Math.cos(angle);
                  const y2 = 50 + outerRadius * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" />;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-[#1a1f3a] flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-[#1a1f3a]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-[12%] md:w-40 bg-gradient-to-b from-[#1a1f3a] to-[#2d3561] border-l-4 border-[#FF6B35]">
          <div className="absolute inset-2 border-2 border-yellow-400 opacity-50" />
        </div>
      </div>
    </div>
  );
});

export default CertificatePreview;
