import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/** A4 landscape at 300 DPI (print-ready). */
const MM_W = 297;
const MM_H = 210;
const TARGET_LONG_PX = Math.round((MM_W / 25.4) * 300);

/**
 * Rasterizes the certificate DOM node and saves a landscape A4 PDF (~300 DPI along the long edge).
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function exportCertificateToA4Pdf(element, filename) {
  if (!element) throw new Error("Certificate element is missing.");

  const rect = element.getBoundingClientRect();
  const scale = Math.min(6, Math.max(2.5, TARGET_LONG_PX / Math.max(rect.width, 1)));

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 25000,
    removeContainer: true,
  });

  const targetW = Math.round((MM_W / 25.4) * 300);
  const targetH = Math.round((MM_H / 25.4) * 300);
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(canvas, 0, 0, targetW, targetH);

  const imgData = out.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  pdf.addImage(imgData, "PNG", 0, 0, MM_W, MM_H, undefined, "SLOW");
  pdf.save(filename);
}
