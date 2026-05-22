"use client";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, MapPin, Loader2, Upload, Clock, ShieldCheck, QrCode, RefreshCw, Download, Link, Calendar } from "lucide-react";
import { uploadMultipleImages, validateImageFile } from "@/lib/imageUpload";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

const GOOGLE_API_KEY = "AIzaSyCElkUva1jaYxMwnBLXjqukwUksFm5H4L8";

interface Amenity { label: string; icon: string; }

interface Slot { startTime: string; endTime: string; isBooked: boolean; }

interface StationDetail {
  _id: string; name: string; address: string; status: string;
  pricePerHour: string; pricePerHourValue: number;
  taxPercent: number; latitude: number; longitude: number;
  images: string[]; about: string; availableIn: string;
  slots: Slot[];
  availableDates: string[];
  selectedDate: string;
  bookingCountsByDate: Record<string, number>;
  startHour?: number; endHour?: number; intervalMin?: number;
  amenities?: Amenity[];
  qrCode?: string;
  qrToken?: string;
}

interface Station {
  _id: string; name: string; address: string; status: string;
  pricePerHour: string; pricePerHourValue: number;
  taxPercent: number; latitude: number; longitude: number;
  images: string[]; about: string; availableIn: string;
  slots?: Slot[];
  startHour?: number; endHour?: number; intervalMin?: number;
  amenities?: Amenity[];
  qrCode?:  string;
  qrToken?: string;
}

const AMENITY_OPTIONS: Amenity[] = [
  { label: "Restaurant", icon: "restaurant" },
  { label: "Wi-Fi", icon: "wifi" },
  { label: "Parking", icon: "local_parking" },
  { label: "Restroom", icon: "wc" },
  { label: "Coffee", icon: "local_cafe" },
  { label: "Shopping", icon: "shopping_cart" },
  { label: "ATM", icon: "atm" },
  { label: "Lounge", icon: "weekend" },
  { label: "EV Parts", icon: "build" },
  { label: "Security", icon: "security" },
  { label: "Lighting", icon: "light" },
  { label: "Wheelchair", icon: "accessible" },
];

const empty = {
  name: "", address: "", status: "Available",
  pricePerHour: "", pricePerHourValue: 0, taxPercent: 0,
  latitude: 0, longitude: 0, images: [] as string[], about: "", availableIn: "",
  startHour: 8, endHour: 18, intervalMin: 30,
  amenities: [] as Amenity[],
};

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [modal, setModal]       = useState<{ open: boolean; item?: Station }>({ open: false });
  const [qrModal, setQrModal]   = useState<{ open: boolean; station?: Station }>({ open: false });
  const [regenLoading, setRegenLoading] = useState<string | null>(null);
  const [form, setForm]         = useState({ ...empty });
  const [saving, setSaving]   = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slot detail modal
  const [slotModal, setSlotModal] = useState<{ open: boolean; detail?: StationDetail; loadingDate?: string }>({ open: false });
  const { theme } = useTheme();
  const dark = theme === "dark";

  const fetchStationDetail = async (stationId: string, date?: string) => {
    const params = date ? `?date=${encodeURIComponent(date)}` : "";
    const r = await api.get(`/admin/stations/${stationId}${params}`);
    return r.data.data as StationDetail;
  };

  const openSlotModal = async (s: Station) => {
    setSlotModal({ open: true });
    try {
      const detail = await fetchStationDetail(s._id);
      setSlotModal({ open: true, detail });
    } catch {
      toast.error("Failed to load station details.");
      setSlotModal({ open: false });
    }
  };

  const selectDate = async (date: string) => {
    if (!slotModal.detail) return;
    setSlotModal(p => ({ ...p, loadingDate: date }));
    try {
      const detail = await fetchStationDetail(slotModal.detail._id, date);
      setSlotModal({ open: true, detail });
    } catch {
      toast.error("Failed to load slots for this date.");
      setSlotModal(p => ({ ...p, loadingDate: undefined }));
    }
  };

  const geocodeAddress = useCallback(async (address: string) => {
    if (!address || address.trim().length < 3) return;
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setForm(p => ({ ...p, latitude: lat, longitude: lng }));
        toast.success("Location found!");
      } else {
        toast.error("Could not find location for this address.");
      }
    } catch {
      toast.error("Geocoding failed. Check your connection.");
    } finally {
      setGeocoding(false);
    }
  }, []);

  const fetchStations = useCallback(async () => {
    setTableLoading(true);
    try {
      const r = await api.get("/admin/stations");
      setStations(r.data.data);
    } catch {
      toast.error("Failed to load stations.");
    } finally {
      setTableLoading(false);
      setBootstrapped(true);
    }
  }, []);

  useEffect(() => { fetchStations(); }, [fetchStations]);

  const openAdd  = () => { setForm({ ...empty }); setModal({ open: true }); };
  const openEdit = (s: Station) => {
    setForm({
    name: s.name, address: s.address, status: s.status,
      pricePerHour: s.pricePerHour, pricePerHourValue: s.pricePerHourValue,
      taxPercent: s.taxPercent, latitude: s.latitude, longitude: s.longitude,
      images: s.images || [], about: s.about || "", availableIn: s.availableIn || "",
      startHour: s.startHour ?? 8, endHour: s.endHour ?? 18, intervalMin: s.intervalMin ?? 30,
      amenities: s.amenities || [],
    });
    setModal({ open: true, item: s });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Station name is required."); return; }
    if (!form.address.trim()) { toast.error("Address is required."); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        status: form.status,
        availableIn: form.availableIn,
        pricePerHour: form.pricePerHour,
        pricePerHourValue: parseFloat(String(form.pricePerHourValue)) || 0,
        taxPercent: parseFloat(String(form.taxPercent)) || 0,
        latitude: parseFloat(String(form.latitude)) || 0,
        longitude: parseFloat(String(form.longitude)) || 0,
        images: form.images,
        about: form.about,
        startHour: parseInt(String(form.startHour)) || 8,
        endHour: parseInt(String(form.endHour)) || 18,
        intervalMin: parseInt(String(form.intervalMin)) || 30,
        amenities: form.amenities,
      };
  if (modal.item) { await api.put(`/admin/stations/${modal.item._id}`, payload); toast.success("Station updated."); }
  else             { await api.post("/admin/stations", payload);                  toast.success("Station created."); }
  setModal({ open: false }); fetchStations();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message || "Something went wrong.";
      toast.error(msg);
      console.error("Save station error:", axiosErr?.response?.data || err);
    }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this station?")) return;
    await api.delete(`/admin/stations/${id}`);
    toast.success("Deleted.");
    fetchStations();
  };

  const regenerateQR = async (station: Station) => {
    setRegenLoading(station._id);
    try {
      const r = await api.post(`/admin/stations/${station._id}/qr`);
      const { qrCode, qrToken } = r.data.data;
      toast.success(station.qrCode ? "QR code regenerated!" : "QR code generated!");
      setStations(prev => prev.map(s =>
        s._id === station._id ? { ...s, qrCode, qrToken } : s
      ));
      setQrModal(prev =>
        prev.open && prev.station?._id === station._id
          ? { open: true, station: { ...prev.station, qrCode, qrToken } }
          : prev
      );
    } catch {
      toast.error("Failed to generate QR.");
    } finally {
      setRegenLoading(null);
    }
  };

  const downloadQR = (station: Station) => {
    if (!station.qrCode) return;
    const a = document.createElement("a");
    a.href = station.qrCode;
    a.download = `qr-${station.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  const handleFieldChange = (k: string, value: string) => {
    setForm(p => ({ ...p, [k]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate all files
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid file");
        return;
      }
    }

    setUploading(true);
    try {
      const urls = await uploadMultipleImages(fileArray);
      setForm(p => ({ ...p, images: [...p.images, ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded!`);
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenity: Amenity) => {
    setForm(p => {
      const exists = p.amenities.some(a => a.icon === amenity.icon);
      return {
        ...p,
        amenities: exists
          ? p.amenities.filter(a => a.icon !== amenity.icon)
          : [...p.amenities, amenity],
      };
    });
  };

  if (!bootstrapped) {
    return <PageLoader label="Loading charging stations" />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Charging Stations</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00C950] hover:bg-[#00b347] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Station
        </button>
      </div>

      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className={`border-b ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-200"}`}>
            <tr>
              {["Name","Address","Status","Price/hr","Slots","QR Code","Actions"].map((h, i) => (
                <th key={h} className={`${i === 6 ? "text-right" : "text-left"} px-4 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLoading && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Refreshing…</td></tr>
            )}
            {!tableLoading && stations.map(s => (
              <tr key={s._id} className={`border-b last:border-0 transition-colors ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className={`px-4 py-3 max-w-[180px] truncate ${dark ? "text-gray-400" : "text-gray-500"}`}>{s.address}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">{s.pricePerHour || `$${s.pricePerHourValue}`}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {s.slots?.length || 0} slots
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.qrCode ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={s.qrCode}
                        alt="QR"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-200 hover:border-green-400 transition-colors"
                        onClick={() => setQrModal({ open: true, station: s })}
                        title="Click to view full QR"
                        unoptimized
                      />
                      <button
                        onClick={() => setQrModal({ open: true, station: s })}
                        className="text-xs text-green-600 hover:text-green-800 font-medium"
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => regenerateQR(s)}
                      disabled={regenLoading === s._id}
                      className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg px-2 py-1 font-medium transition-colors disabled:opacity-50"
                    >
                      {regenLoading === s._id
                        ? <Loader2 size={11} className="animate-spin" />
                        : <QrCode size={11} />
                      }
                      {regenLoading === s._id ? "Generating…" : "Generate QR"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => openSlotModal(s)}
                    className="text-purple-400 hover:text-purple-600 p-1"
                    title="View slots by date"
                  >
                    <Calendar size={15} />
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/station-qr/${s._id}`;
                      navigator.clipboard.writeText(url);
                      toast.success("QR page URL copied!");
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Copy public QR URL"
                  >
                    <Link size={15} />
                  </button>
                  <button onClick={() => setQrModal({ open: true, station: s })} className="text-green-500 hover:text-green-700 p-1" title="View QR"><QrCode size={15} /></button>
                  <button onClick={() => openEdit(s)} className="text-blue-500 hover:text-blue-700 p-1"><Pencil size={15} /></button>
                  <button onClick={() => del(s._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!tableLoading && stations.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No stations yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-4 sm:py-8 px-2 sm:px-4">
          <div className={`rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[95vh] sm:max-h-[90vh] transition-colors ${dark ? "bg-[#1E2A3A] text-white" : "bg-white"}`}>
            <div className={`flex items-center justify-between p-6 pb-4 border-b shrink-0 ${dark ? "border-[#2d3a4a]" : ""}`}>
              <h2 className="text-lg font-bold">{modal.item ? "Edit Station" : "Add Station"}</h2>
              <button onClick={() => setModal({ open: false })}><X size={20} /></button>
            </div>
            <form onSubmit={save} className="flex flex-col overflow-hidden">
              <div className="overflow-y-auto p-4 sm:p-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Station Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} placeholder="Power Station" required
                    onChange={e => handleFieldChange("name", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Address <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.address}
                      placeholder="e.g. Mirpur 12, Dhaka"
                      required
                      onChange={e => handleFieldChange("address", e.target.value)}
                      className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => geocodeAddress(form.address)}
                      disabled={geocoding || !form.address}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {geocoding ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                      {geocoding ? "Finding…" : "Get Location"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Status</label>
                  <select value={form.status} onChange={e => handleFieldChange("status", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}>
                    <option>Available</option>
                    <option>Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Available In (e.g. 10 Min)</label>
                  <input type="text" value={form.availableIn} placeholder="10 Min"
                    onChange={e => handleFieldChange("availableIn", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Price Per Hour (display)</label>
                  <input type="text" value={form.pricePerHour} placeholder="$10/hr"
                    onChange={e => handleFieldChange("pricePerHour", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Price Per Hour Value ($)</label>
                  <input type="number" value={form.pricePerHourValue} placeholder="10"
                    onChange={e => handleFieldChange("pricePerHourValue", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Tax (%)</label>
                  <input type="number" value={form.taxPercent} placeholder="5"
                    onChange={e => handleFieldChange("taxPercent", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Latitude</label>
                  <input
                    type="text"
                    value={form.latitude}
                    readOnly
                    className={`w-full border rounded-lg px-3 py-2 text-sm cursor-not-allowed ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-gray-400" : "bg-gray-50 text-gray-500"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Longitude</label>
                  <input
                    type="text"
                    value={form.longitude}
                    readOnly
                    className={`w-full border rounded-lg px-3 py-2 text-sm cursor-not-allowed ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-gray-400" : "bg-gray-50 text-gray-500"}`}
                  />
                </div>

                {/* Slot Configuration */}
                <div className={`col-span-2 border-t pt-4 mt-1 ${dark ? "border-[#2d3a4a]" : ""}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-[#00C950]" />
                    <h3 className={`text-sm font-semibold ${dark ? "text-gray-200" : "text-gray-700"}`}>Slot Configuration</h3>
                    <span className="text-xs text-gray-400">(auto-generates time slots)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Start Hour (0-23)</label>
                      <input type="number" min={0} max={23} value={form.startHour} placeholder="8"
                        onChange={e => handleFieldChange("startHour", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                      <p className="text-xs text-gray-400 mt-0.5">{form.startHour <= 12 ? `${form.startHour || 12}:00 ${Number(form.startHour) < 12 ? "AM" : "PM"}` : `${Number(form.startHour) - 12}:00 PM`}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>End Hour (0-23)</label>
                      <input type="number" min={0} max={23} value={form.endHour} placeholder="18"
                        onChange={e => handleFieldChange("endHour", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                      <p className="text-xs text-gray-400 mt-0.5">{form.endHour <= 12 ? `${form.endHour || 12}:00 ${Number(form.endHour) < 12 ? "AM" : "PM"}` : `${Number(form.endHour) - 12}:00 PM`}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Interval (mins)</label>
                      <input type="number" min={5} max={120} value={form.intervalMin} placeholder="30"
                        onChange={e => handleFieldChange("intervalMin", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                      <p className="text-xs text-gray-400 mt-0.5">{Math.floor((Number(form.endHour) - Number(form.startHour)) * 60 / (Number(form.intervalMin) || 1))} slots</p>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>Images</label>
                  {/* Image previews */}
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.images.map((url, idx) => (
                        <div key={idx} className={`relative group w-20 h-20 rounded-lg overflow-hidden border ${dark ? "border-[#2d3a4a]" : "border-gray-200"}`}>
                          <Image src={url} alt={`Station ${idx + 1}`} fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 text-sm transition-colors w-full justify-center disabled:opacity-50 ${dark ? "border-[#2d3a4a] text-gray-400 hover:border-[#00C950] hover:text-[#00C950]" : "border-gray-300 text-gray-500 hover:border-[#00C950] hover:text-green-600"}`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {form.images.length > 0 ? "Add More Images" : "Upload Images"}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB per image. JPEG, PNG, GIF, WebP supported.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>About</label>
                  <textarea value={form.about} onChange={e => handleFieldChange("about", e.target.value)}
                    rows={3} placeholder="Description of the station..."
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] resize-none ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`} />
                </div>

                {/* Amenities */}
                <div className={`col-span-2 border-t pt-4 mt-1 ${dark ? "border-[#2d3a4a]" : ""}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-[#00C950]" />
                    <h3 className={`text-sm font-semibold ${dark ? "text-gray-200" : "text-gray-700"}`}>Amenities</h3>
                    {form.amenities.length > 0 && (
                      <span className="text-xs text-gray-400">({form.amenities.length} selected)</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {AMENITY_OPTIONS.map(a => {
                      const selected = form.amenities.some(s => s.icon === a.icon);
                      return (
                        <button
                          key={a.icon}
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            selected
                              ? "bg-green-50 border-[#00C950] text-green-700"
                              : dark
                                ? "bg-[#1A2332] border-[#2d3a4a] text-gray-400 hover:border-gray-500"
                                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          <span className="material-icons text-sm" style={{ fontFamily: "inherit", fontSize: "14px" }}>
                            {selected ? "✓" : "○"}
                          </span>
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              </div>
              <div className={`flex gap-3 p-6 pt-4 border-t shrink-0 ${dark ? "border-[#2d3a4a]" : ""}`}>
                <button type="button" onClick={() => setModal({ open: false })} className={`flex-1 border rounded-lg py-2 text-sm ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 bg-[#00C950] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#00b347] disabled:opacity-60">
                  {saving ? "Saving…" : modal.item ? "Update Station" : "Save Station"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QR Code View Modal ── */}
      {qrModal.open && qrModal.station && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={() => setQrModal({ open: false })}
        >
          <div
            className={`relative rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Close button ── */}
            <button
              onClick={() => setQrModal({ open: false })}
              className={`absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors ${dark ? "bg-[#253347] hover:bg-[#2d3a4a] text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700"}`}
            >
              <X size={16} />
            </button>

            {/* ── Station info header ── */}
            <div className={`px-6 pt-6 pb-4 border-b ${dark ? "border-[#2d3a4a]" : "border-gray-100"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00C950] animate-pulse" />
                <span className="text-xs font-semibold text-[#00C950] uppercase tracking-widest">Charging Station</span>
              </div>
              <h2 className={`text-lg font-bold leading-tight ${dark ? "text-white" : "text-gray-900"}`}>{qrModal.station.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{qrModal.station.address}</p>
            </div>

            {/* ── QR Code ── */}
            <div className="flex flex-col items-center px-8 py-6">
              {/* Scan corner frame */}
              <div className={`relative p-4 ${dark ? "bg-white" : "bg-white"}`}>
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-900 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-900 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-900 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-900 rounded-br-lg" />

                {qrModal.station.qrCode ? (
                  <Image
                    src={qrModal.station.qrCode}
                    alt="Station QR Code"
                    width={224}
                    height={224}
                    className="w-56 h-56 object-contain block"
                    style={{ imageRendering: "pixelated" }}
                    unoptimized
                  />
                ) : (
                  <div className="w-56 h-56 flex flex-col items-center justify-center gap-4">
                    <QrCode size={52} strokeWidth={1} className="text-gray-200" />
                    <p className="text-xs text-gray-400 text-center">No QR code yet</p>
                    <button
                      onClick={() => regenerateQR(qrModal.station!)}
                      disabled={regenLoading === qrModal.station._id}
                      className="flex items-center gap-2 bg-[#00C950] hover:bg-[#00b347] text-white rounded-xl px-4 py-2 text-xs font-semibold disabled:opacity-60"
                    >
                      {regenLoading === qrModal.station._id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <QrCode size={13} />
                      }
                      {regenLoading === qrModal.station._id ? "Generating…" : "Generate QR"}
                    </button>
                  </div>
                )}
              </div>

              {/* Scan label */}
              <div className="flex items-center gap-2 mt-3 mb-1">
                <div className={`h-px flex-1 ${dark ? "bg-[#2d3a4a]" : "bg-gray-200"}`} />
                <span className="text-xs font-medium text-gray-400 px-2">Scan to start charging</span>
                <div className={`h-px flex-1 ${dark ? "bg-[#2d3a4a]" : "bg-gray-200"}`} />
              </div>

              {/* Token pill */}
              <div className={`mt-3 w-full rounded-xl px-3 py-2.5 border ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-100"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Token ID</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">● Active</span>
                </div>
                <p className="text-[11px] font-mono text-gray-500 break-all leading-relaxed">
                  {qrModal.station.qrToken || "—"}
                </p>
              </div>
            </div>

            {/* ── Bottom action bar ── */}
            <div className="px-6 pb-4 flex gap-3">
              <button
                onClick={() => downloadQR(qrModal.station!)}
                disabled={!qrModal.station.qrCode}
                className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-2xl py-3 text-sm font-semibold transition-all disabled:opacity-40 ${dark ? "border-[#2d3a4a] text-gray-300 hover:border-gray-500 hover:bg-[#253347]" : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"}`}
              >
                <Download size={15} />
                Download
              </button>
              {qrModal.station.qrCode && (
                <button
                  onClick={() => regenerateQR(qrModal.station!)}
                  disabled={regenLoading === qrModal.station._id}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-black text-white rounded-2xl py-3 text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {regenLoading === qrModal.station._id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <RefreshCw size={15} />
                  }
                  {regenLoading === qrModal.station._id ? "Wait…" : "Regenerate"}
                </button>
              )}
            </div>

            {/* ── Open public page ── */}
            <div className="px-6 pb-5">
              <a
                href={`/station-qr/${qrModal.station._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-[#00C950]/30 text-[#00C950] hover:bg-[#00C950]/10 hover:border-[#00C950] rounded-2xl py-2.5 text-sm font-semibold transition-all"
              >
                <Link size={14} />
                Open Public QR Page
              </a>
            </div>

            {/* ── Warning ── */}
            <p className="text-center text-[10px] text-gray-300 pb-4">
              ⚠ Regenerating permanently invalidates the current QR
            </p>
          </div>
        </div>
      )}

      {/* ── Slot Detail Modal ── */}
      {slotModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSlotModal({ open: false })}
        >
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-[#2d3a4a]" : ""}`}>
              <div>
                <h2 className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                  {slotModal.detail?.name ?? "Loading…"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{slotModal.detail?.address}</p>
              </div>
              <button onClick={() => setSlotModal({ open: false })} className={`p-1 ${dark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
                <X size={18} />
              </button>
            </div>

            {!slotModal.detail ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-green-500" />
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[70vh]">
                {/* Stats bar */}
                <div className={`flex items-center gap-4 px-6 py-3 border-b text-xs ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50"}`}>
                  <span className={`font-semibold ${dark ? "text-gray-200" : "text-gray-700"}`}>₹{slotModal.detail.pricePerHourValue}/hr</span>
                  <span className="text-gray-400">|</span>
                  <span className={dark ? "text-gray-400" : "text-gray-500"}>Tax: {slotModal.detail.taxPercent}%</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-medium text-green-600">{slotModal.detail.slots.filter(sl => !sl.isBooked).length} free</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-red-500">{slotModal.detail.slots.filter(sl => sl.isBooked).length} booked</span>
                </div>

                {/* Date Selector */}
                <div className="px-6 pt-4 pb-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>Select Date</p>
                  <div className="flex flex-wrap gap-2">
                    {slotModal.detail.availableDates.map(date => {
                      const isSelected = date === slotModal.detail!.selectedDate;
                      const count = slotModal.detail!.bookingCountsByDate[date] ?? 0;
                      const isLoading = slotModal.loadingDate === date;
                      return (
                        <button
                          key={date}
                          onClick={() => selectDate(date)}
                          disabled={!!slotModal.loadingDate}
                          className={`relative flex flex-col items-center px-3 py-2 rounded-xl border text-xs font-medium transition-all disabled:opacity-60 ${
                            isSelected
                              ? "bg-[#00C950] border-[#00C950] text-white shadow-md"
                              : dark
                                ? "bg-[#1A2332] border-[#2d3a4a] text-gray-400 hover:border-[#00C950]"
                                : "bg-white border-gray-200 text-gray-600 hover:border-green-400"
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              <span>{date}</span>
                              {count > 0 && (
                                <span className={`mt-0.5 text-[10px] font-bold ${isSelected ? "text-green-100" : "text-red-500"}`}>
                                  {count} booked
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="px-6 py-4">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Slots — {slotModal.detail.selectedDate}
                  </p>
                  {slotModal.detail.slots.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No slots configured for this station.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {slotModal.detail.slots.map((slot, i) => (
                        <div
                          key={i}
                          className={`flex flex-col items-center justify-center rounded-xl px-2 py-2.5 border text-xs font-medium transition-all ${
                            slot.isBooked
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "bg-green-50 border-green-200 text-green-700"
                          }`}
                        >
                          <span className="font-semibold">{slot.startTime}</span>
                          <span className="text-[10px] opacity-70 mt-0.5">→ {slot.endTime}</span>
                          <span className={`mt-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                            slot.isBooked ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"
                          }`}>
                            {slot.isBooked ? "Booked" : "Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
