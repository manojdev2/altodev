"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Save, Loader2, Eye, EyeOff, RotateCcw, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface Settings {
  stripeEnabled: boolean;
  sslcommerzEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  sslStoreId: string;
  sslStorePassword: string;
  sslIsLive: boolean;
  currencyCode: string;
  currencySymbol: string;
  currencyIcon: string;
  sslMinAmount: number;
  stripeMinAmount: number;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  icon: string;
  name: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: "BDT", symbol: "৳", icon: "currency_taka", name: "Bangladeshi Taka" },
  { code: "INR", symbol: "₹", icon: "currency_rupee", name: "Indian Rupee" },
  { code: "USD", symbol: "$", icon: "attach_money", name: "US Dollar" },
  { code: "EUR", symbol: "€", icon: "euro", name: "Euro" },
  { code: "GBP", symbol: "£", icon: "currency_pound", name: "British Pound" },
  { code: "JPY", symbol: "¥", icon: "currency_yen", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", icon: "currency_yuan", name: "Chinese Yuan" },
  { code: "AED", symbol: "د.إ", icon: "payments", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", icon: "payments", name: "Saudi Riyal" },
  { code: "MYR", symbol: "RM", icon: "payments", name: "Malaysian Ringgit" },
  { code: "SGD", symbol: "S$", icon: "attach_money", name: "Singapore Dollar" },
  { code: "AUD", symbol: "A$", icon: "attach_money", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", icon: "attach_money", name: "Canadian Dollar" },
  { code: "PKR", symbol: "₨", icon: "currency_rupee", name: "Pakistani Rupee" },
  { code: "LKR", symbol: "₨", icon: "currency_rupee", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "₨", icon: "currency_rupee", name: "Nepalese Rupee" },
  { code: "THB", symbol: "฿", icon: "payments", name: "Thai Baht" },
  { code: "KRW", symbol: "₩", icon: "payments", name: "South Korean Won" },
  { code: "TRY", symbol: "₺", icon: "payments", name: "Turkish Lira" },
  { code: "ZAR", symbol: "R", icon: "payments", name: "South African Rand" },
];

const defaults: Settings = {
  stripeEnabled: false,
  sslcommerzEnabled: false,
  stripePublishableKey: "",
  stripeSecretKey: "",
  sslStoreId: "",
  sslStorePassword: "",
  sslIsLive: false,
  currencyCode: "BDT",
  currencySymbol: "৳",
  currencyIcon: "currency_taka",
  sslMinAmount: 10,
  stripeMinAmount: 1,
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    api
      .get("/admin/settings")
      .then((r) => {
        const d = r.data.data;
        setForm({
          stripeEnabled: d.stripeEnabled ?? false,
          sslcommerzEnabled: d.sslcommerzEnabled ?? false,
          stripePublishableKey: d.stripePublishableKey ?? "",
          stripeSecretKey: d.stripeSecretKey ?? "",
          sslStoreId: d.sslStoreId ?? "",
          sslStorePassword: d.sslStorePassword ?? "",
          sslIsLive: d.sslIsLive ?? false,
          currencyCode: d.currencyCode ?? "BDT",
          currencySymbol: d.currencySymbol ?? "৳",
          currencyIcon: d.currencyIcon ?? "currency_taka",
          sslMinAmount: d.sslMinAmount ?? 10,
          stripeMinAmount: d.stripeMinAmount ?? 1,
        });
      })
      .catch(() => toast.error("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      await api.put("/admin/settings", payload);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCurrencySelect = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) {
      setForm((p) => ({
        ...p,
        currencyCode: found.code,
        currencySymbol: found.symbol,
        currencyIcon: found.icon,
      }));
    }
  };

  const toggleSecret = (key: string) =>
    setShowSecrets((p) => ({ ...p, [key]: !p[key] }));

  const set = (key: keyof Settings, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleGatewayToggle = (key: "stripeEnabled" | "sslcommerzEnabled", val: boolean) => {
    const other = key === "stripeEnabled" ? "sslcommerzEnabled" : "stripeEnabled";
    if (!val && !form[other]) {
      toast.error("At least one payment gateway must be enabled.");
      return;
    }
    set(key, val);
  };

  if (loading) {
    return <PageLoader label="Loading settings" />;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">App Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ── Gateway Toggles ── */}
        <Section title="Payment Gateways" dark={dark}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Toggle
              label="Stripe"
              checked={form.stripeEnabled}
              onChange={(v) => handleGatewayToggle("stripeEnabled", v)}
              dark={dark}
            />
            <Toggle
              label="SSLCommerz"
              checked={form.sslcommerzEnabled}
              onChange={(v) => handleGatewayToggle("sslcommerzEnabled", v)}
              dark={dark}
            />
          </div>
        </Section>

        {/* ── Stripe Credentials ── */}
        <Section title="Stripe Credentials" dark={dark}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecretField
              label="Publishable Key"
              value={form.stripePublishableKey}
              show={showSecrets["spk"]}
              onToggle={() => toggleSecret("spk")}
              onChange={(v) => set("stripePublishableKey", v)}
              placeholder="pk_live_..."
              dark={dark}
            />
            <SecretField
              label="Secret Key"
              value={form.stripeSecretKey}
              show={showSecrets["ssk"]}
              onToggle={() => toggleSecret("ssk")}
              onChange={(v) => set("stripeSecretKey", v)}
              placeholder="sk_live_..."
              dark={dark}
            />
            <NumberField
              label="Min Amount"
              value={form.stripeMinAmount}
              onChange={(v) => set("stripeMinAmount", v)}
              dark={dark}
            />
          </div>
        </Section>

        {/* ── SSLCommerz Credentials ── */}
        <Section title="SSLCommerz Credentials" dark={dark}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecretField
              label="Store ID"
              value={form.sslStoreId}
              show={showSecrets["sid"]}
              onToggle={() => toggleSecret("sid")}
              onChange={(v) => set("sslStoreId", v)}
              placeholder="your_store_id"
              dark={dark}
            />
            <SecretField
              label="Store Password"
              value={form.sslStorePassword}
              show={showSecrets["spw"]}
              onToggle={() => toggleSecret("spw")}
              onChange={(v) => set("sslStorePassword", v)}
              placeholder="your_store_password"
              dark={dark}
            />
            <NumberField
              label="Min Amount"
              value={form.sslMinAmount}
              onChange={(v) => set("sslMinAmount", v)}
              dark={dark}
            />
            <div className="flex items-center gap-3 pt-6">
              <Toggle
                label="Live Mode"
                checked={form.sslIsLive}
                onChange={(v) => set("sslIsLive", v)}
                dark={dark}
              />
            </div>
          </div>
        </Section>

        {/* ── Currency ── */}
        <Section title="Currency Settings" dark={dark}>
          <div className="space-y-4">
            {/* Currency Dropdown */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                Select Currency
              </label>
              <div className="relative">
                <select
                  value={form.currencyCode}
                  onChange={(e) => handleCurrencySelect(e.target.value)}
                  className={`w-full appearance-none border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] pr-10 cursor-pointer ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "bg-white border-gray-200"}`}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code} &mdash; {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Auto-filled fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Currency Code"
                value={form.currencyCode}
                onChange={(v) => set("currencyCode", v)}
                placeholder="BDT"
                dark={dark}
              />
              <Field
                label="Currency Symbol"
                value={form.currencySymbol}
                onChange={(v) => set("currencySymbol", v)}
                placeholder="৳"
                dark={dark}
              />
              <Field
                label="Currency Icon"
                value={form.currencyIcon}
                onChange={(v) => set("currencyIcon", v)}
                placeholder="currency_taka"
                dark={dark}
              />
            </div>
            <p className="text-xs text-gray-400">
              Fields are auto-filled when you select a currency from the
              dropdown. You can also edit them manually if needed.
            </p>
          </div>
        </Section>

        {/* ── Save ── */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#00C950] hover:bg-[#00b347] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving…" : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`flex items-center gap-2 border px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${dark ? "border-[#2d3a4a] text-gray-300 hover:bg-[#253347]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Sub-components ── */

function Section({
  title,
  children,
  dark,
}: {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`rounded-xl shadow-sm p-6 transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
      <h2 className={`text-base font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>{title}</h2>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  dark,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dark?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative" onClick={() => onChange(!checked)}>
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? "bg-[#00C950]" : dark ? "bg-gray-600" : "bg-gray-300"
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </div>
      <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
    </label>
  );
}

function SecretField({
  label,
  value,
  show,
  onToggle,
  onChange,
  placeholder,
  dark,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  placeholder?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  dark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  dark,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <input
        type="number"
        min={0}
        step="any"
        value={value ?? 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
      />
    </div>
  );
}
