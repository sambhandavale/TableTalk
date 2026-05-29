import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Smartphone, BarChart2 } from "lucide-react";

interface QRDisplayProps {
  url: string;
  restaurantName: string;
  qrStats?: {
    total_scans: number;
    feedback_submitted: number;
    redirected: number;
    confirmed_google: number;
    redemption_rate: number;
  };
}

export default function QRDisplay({ url, restaurantName, qrStats }: QRDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic values calculated from backend DB with seeding fallbacks if empty
  const stats = qrStats || {
    total_scans: 0,
    feedback_submitted: 0,
    redirected: 0,
    confirmed_google: 0,
    redemption_rate: 0
  };

  const feedbackConv = stats.total_scans > 0 
    ? Math.round((stats.feedback_submitted / stats.total_scans) * 100) 
    : 0;

  const googleConv = stats.redirected > 0 
    ? Math.round((stats.confirmed_google / stats.redirected) * 100) 
    : 0;

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000ff',
          light: '#ffffffff'
        }
      }, (err, url) => {
        if (!err) setQrDataUrl(url);
      });
      
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 800,
          margin: 4,
          color: {
            dark: '#000000ff',
            light: '#ffffffff'
          }
        });
      }
    }
  }, [url]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `tabletalk_qr_${restaurantName.replace(/\s+/g, '_').toLowerCase()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="bg-[#0c0516] border border-[#1e293b] p-5 rounded-none flex flex-col justify-between h-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#a855f7]" />
            <h3 className="text-xs font-semibold text-[var(--foreground)]">
              Private QR Intercept Standee
            </h3>
          </div>
          <button 
            onClick={handleDownload}
            className="px-2 py-1 border border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7] hover:bg-[#a855f7] hover:text-black text-[9px] font-bold uppercase tracking-widest rounded-none transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3 h-3" />
            Print Kit
          </button>
        </div>
      </div>

      <div className="my-6 flex justify-center">
        {qrDataUrl ? (
          <div className="p-2 bg-white rounded-none border border-white">
            <img src={qrDataUrl} alt="TableTalk Review QR" className="w-24 h-24 rounded-none" />
          </div>
        ) : (
          <div className="w-24 h-24 bg-[#1e293b]/20 border border-[#1e293b] flex items-center justify-center rounded-none">
            <QrCode className="w-6 h-6 text-[#64748b] animate-pulse" />
          </div>
        )}
      </div>

      {/* Funnel Stats */}
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart2 className="w-3.5 h-3.5 text-[#a855f7]" />
          <span className="text-[10px] uppercase tracking-widest text-white font-bold">QR Funnel Stats (Live)</span>
        </div>

        <div className="space-y-2 border-l border-[#1e293b] pl-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#94a3b8]">Total Scans (Menu / Standee)</span>
            <span className="font-semibold text-white">{stats.total_scans}</span>
          </div>
          
          <div className="w-full bg-[#1e293b] h-0.5" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#94a3b8] flex items-center gap-1"><div className="w-1 h-1 bg-[#a855f7]" /> Feedback Submitted</span>
            <div className="text-right">
              <span className="font-semibold text-white">{stats.feedback_submitted}</span>
              <span className="text-[8px] text-[#a855f7] ml-2">({feedbackConv}% Conv.)</span>
            </div>
          </div>
          
          <div className="w-full bg-[#1e293b] h-0.5" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#94a3b8] flex items-center gap-1"><div className="w-1 h-1 bg-[#10b981]" /> 4-5★ Redirected to Google</span>
            <span className="font-semibold text-white">{stats.redirected}</span>
          </div>
 
          <div className="w-full bg-[#1e293b] h-0.5" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#94a3b8] flex items-center gap-1"><div className="w-1 h-1 bg-[#f59e0b]" /> Confirmed Google Review</span>
            <div className="text-right">
              <span className="font-semibold text-white">{stats.confirmed_google}</span>
              <span className="text-[8px] text-[#f59e0b] ml-2">({googleConv}% Conv.)</span>
            </div>
          </div>
 
          <div className="w-full bg-[#1e293b] h-0.5" />
          <div className="flex justify-between items-center text-[10px] pt-1">
            <span className="text-[#94a3b8]">Coupon Redemption Rate</span>
            <span className="font-semibold text-[#10b981]">{stats.redemption_rate}%</span>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
