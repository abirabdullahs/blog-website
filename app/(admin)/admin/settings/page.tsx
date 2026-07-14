'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Check } from 'lucide-react';
import { getSiteSettings, updateSiteSettings, DEFAULT_SETTINGS } from '@/lib/db/settings-service';
import { SiteSettings } from '@/types';

const FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; type?: string }[] = [
  { key: 'siteName', label: 'Site Name', placeholder: 'The Chronicle' },
  { key: 'siteDescription', label: 'Site Description', placeholder: 'A short tagline for search engines & social previews' },
  { key: 'siteUrl', label: 'Site URL', placeholder: 'https://yourdomain.com' },
  { key: 'ogImage', label: 'Default OG Image Path', placeholder: '/og-image.png' },
  { key: 'authorName', label: 'Author Name', placeholder: 'Your Name' },
  { key: 'authorUrl', label: 'Author URL', placeholder: 'https://yourportfolio.com' },
  { key: 'twitterHandle', label: 'Twitter / X Handle', placeholder: '@yourhandle' },
  { key: 'contactEmail', label: 'Contact Email', placeholder: 'hello@yourdomain.com', type: 'email' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Could not load settings. Check your Firebase configuration.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(key: keyof SiteSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="border-b-2 border-black pb-8">
        <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Configuration</span>
        <h1 className="text-5xl font-bold tracking-tighter italic font-serif">Settings</h1>
      </header>

      {error && (
        <div className="border-2 border-red-600 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest px-6 py-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin opacity-20" size={40} />
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">Loading Settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-10 max-w-2xl">
          <section className="space-y-6">
            <h2 className="text-[0.7rem] uppercase font-black tracking-[0.3em] border-b border-black pb-2">Branding & SEO</h2>
            {FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={settings[field.key] as string}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="px-4 py-3 bg-white border border-black/10 text-sm font-serif outline-none focus:border-black transition-colors"
                />
              </div>
            ))}
          </section>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Settings
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-[0.65rem] uppercase font-bold tracking-widest text-green-700">
                <Check size={14} /> Saved
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
