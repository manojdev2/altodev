"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface StationQR {
  _id: string;
  name: string;
  address: string;
  status: string;
  qrCode: string;
  qrToken: string;
  pricePerHour: string;
  pricePerHourValue: number;
}

export default function StationQRPage() {
  const params   = useParams();
  const id       = params?.id as string;

  const [station, setStation] = useState<StationQR | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://uv-charging-backend-1.onrender.com/api/v1/public/stations/${id}/qr`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "Success") setStation(d.data);
        else setError(d.message || "Station not found.");
      })
      .catch(() => setError("Could not load station data."))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading QR…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !station) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-xl font-bold mb-2">Station Not Found</h1>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xs">

        {/* ── Logo / Brand ── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#00C950] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">EV Charging</span>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

          {/* Station info */}
          <div className="bg-gray-900 px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${station.status === "Available" ? "bg-green-400" : "bg-red-400"}`} />
              <span className={`text-xs font-semibold uppercase tracking-widest ${station.status === "Available" ? "text-green-400" : "text-red-400"}`}>
                {station.status}
              </span>
            </div>
            <h1 className="text-white text-xl font-bold leading-tight">{station.name}</h1>
            <p className="text-gray-400 text-xs mt-1">{station.address}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <span className="text-green-400 text-xs font-bold">
                {station.pricePerHour || `$${station.pricePerHourValue}/hr`}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center bg-white px-8 py-7">
            {/* Scanner frame */}
            <div className="relative p-5">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-9 h-9 border-t-[5px] border-l-[5px] border-gray-900 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-9 h-9 border-t-[5px] border-r-[5px] border-gray-900 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-9 h-9 border-b-[5px] border-l-[5px] border-gray-900 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-9 h-9 border-b-[5px] border-r-[5px] border-gray-900 rounded-br-xl" />

              {station.qrCode ? (
                <Image
                  src={station.qrCode}
                  alt={`QR Code — ${station.name}`}
                  width={224}
                  height={224}
                  className="w-56 h-56 object-contain block"
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center">
                  <p className="text-gray-400 text-sm text-center">QR not available.<br/>Contact admin.</p>
                </div>
              )}
            </div>

            {/* Divider label */}
            <div className="flex items-center gap-2 w-full mt-4 mb-1">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium px-2">Scan with EV Charging App</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">How to use</p>
            <div className="space-y-3">
              {[
                { n: "1", label: "Book & pay in the app" },
                { n: "2", label: "Arrive at the station" },
                { n: "3", label: "Open EV Charging app" },
                { n: "4", label: "Scan this QR → charging starts ⚡" },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {n}
                  </span>
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-[11px] mt-6">
          evcharging.com · {station.name}
        </p>
      </div>
    </div>
  );
}
