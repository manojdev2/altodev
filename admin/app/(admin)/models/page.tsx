"use client";
import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface Brand { _id: string; name: string; }
interface Model { _id: string; name: string; image: string; brandId: Brand | string; }

export default function ModelsPage() {
  const [models, setModels]   = useState<Model[]>([]);
  const [brands, setBrands]   = useState<Brand[]>([]);
  const [filter, setFilter]   = useState("");
  const [modal, setModal]     = useState<{ open: boolean; item?: Model }>({ open: false });
  const [form, setForm]       = useState({ brandId: "", name: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const fetchModels = useCallback(async (brandId?: string) => {
    setTableLoading(true);
    try {
      const r = await api.get("/admin/models", { params: brandId ? { brandId } : {} });
      setModels(r.data.data);
    } catch {
      toast.error("Failed to load models.");
    } finally {
      setTableLoading(false);
      setBootstrapped(true);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const r = await api.get("/admin/brands");
      setBrands(r.data.data);
    } catch {
      toast.error("Failed to load brands.");
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchModels();
  }, [fetchBrands, fetchModels]);

  const openAdd = () => { setForm({ brandId: "", name: "", image: "" }); setModal({ open: true }); };
  const openEdit = (m: Model) => {
    const bid = typeof m.brandId === "object" ? m.brandId._id : m.brandId;
    setForm({ brandId: bid, name: m.name, image: m.image });
    setModal({ open: true, item: m });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.item) { await api.put(`/admin/models/${modal.item._id}`, form); toast.success("Model updated."); }
      else             { await api.post("/admin/models", form);                  toast.success("Model created."); }
      setModal({ open: false }); fetchModels(filter || undefined);
    } catch { toast.error("Something went wrong."); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    await api.delete(`/admin/models/${id}`); toast.success("Deleted."); fetchModels(filter || undefined);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateImageFile(file);
    if (!v.isValid) { toast.error(v.error || "Invalid file"); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(p => ({ ...p, image: url }));
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed."); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onFilter = (bid: string) => { setFilter(bid); fetchModels(bid || undefined); };

  if (!bootstrapped) {
    return <PageLoader label="Loading vehicle models" />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Vehicle Models</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00C950] hover:bg-[#00b347] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Model
        </button>
      </div>

      {/* Brand filter */}
      <div className="mb-4">
        <select value={filter} onChange={e => onFilter(e.target.value)}
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className={`border-b ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-200"}`}>
            <tr>
              <th className={`text-left px-5 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Image</th>
              <th className={`text-left px-5 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Model Name</th>
              <th className={`text-left px-5 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Brand</th>
              <th className={`text-right px-5 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-gray-400">Refreshing…</td></tr>
            )}
            {!tableLoading && models.map(m => (
              <tr key={m._id} className={`border-b last:border-0 transition-colors ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>
                <td className="px-5 py-3">
                  {m.image
                    ? <Image
                        src={m.image}
                        alt={m.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                        unoptimized
                      />
                    : <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400"}`}>No img</div>}
                </td>
                <td className="px-5 py-3 font-medium">{m.name}</td>
                <td className={`px-5 py-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>{typeof m.brandId === "object" ? m.brandId.name : "—"}</td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(m)} className="text-blue-500 hover:text-blue-700 p-1"><Pencil size={15} /></button>
                  <button onClick={() => del(m._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!tableLoading && models.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No models yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-xl transition-colors ${dark ? "bg-[#1E2A3A] text-white" : "bg-white text-gray-900"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{modal.item ? "Edit Model" : "Add Model"}</h2>
              <button onClick={() => setModal({ open: false })}><X size={20} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : ""}`}>Brand *</label>
                <select required value={form.brandId} onChange={e => setForm(p => ({ ...p, brandId: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}>
                  <option value="">Select brand</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : ""}`}>Model Name *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
                  placeholder="e.g. Model 3" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : ""}`}>Model Image</label>
                {form.image ? (
                  <div className={`relative w-full h-32 rounded-lg overflow-hidden border mb-2 ${dark ? "border-[#2d3a4a]" : "border-gray-200"}`}>
                    <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
                    <button type="button" onClick={() => setForm(p => ({ ...p, image: "" }))}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                ) : null}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg px-4 py-3 text-sm transition-colors disabled:opacity-50 ${dark ? "border-[#2d3a4a] text-gray-400 hover:border-[#00C950] hover:text-[#00C950]" : "border-gray-300 text-gray-500 hover:border-[#00C950] hover:text-[#00C950]"}`}>
                  {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : <><Upload size={16} /> {form.image ? "Change Image" : "Upload Image"}</>}
                </button>
                <p className="text-xs text-gray-400 mt-1">Max 5MB. JPEG, PNG, GIF, WebP.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className={`flex-1 border rounded-lg py-2 text-sm ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 bg-[#00C950] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#00b347] disabled:opacity-60">
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
