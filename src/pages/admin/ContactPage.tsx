import { useContactInfo, type Social } from "@/hooks/useContactInfo";
import { useContactMessages, type ContactMessage } from "@/hooks/useContactMessages";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { ChevronDown, ChevronUp, Mail, MailOpen, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { data } = useContactInfo();
  const [form, setForm] = useState({ location: "", email: "", availability: "" });
  const [socials, setSocials] = useState<Social[]>([]);
  const [saving, setSaving] = useState(false);
  const [dbId, setDbId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    supabase.from("contact_info").select("id").single().then(({ data: row }) => setDbId(row?.id ?? null));
    setForm({ location: data.location, email: data.email, availability: data.availability });
    setSocials(data.socials);
  }, [data]);

  const save = async () => {
    if (!dbId) return;
    setSaving(true);
    await supabase.from("contact_info").update({ ...form, socials }).eq("id", dbId);
    await queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
    setSaving(false);
  };

  const addSocial = () => {
    setSocials([...socials, { icon: "Github", label: "", href: "", handle: "" }]);
  };

  const updateSocial = (i: number, key: keyof Social, value: string) => {
    const updated = [...socials];
    updated[i] = { ...updated[i], [key]: value };
    setSocials(updated);
  };

  const removeSocial = (i: number) => {
    setSocials(socials.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Contact</h1>

      {/* Messages */}
      <MessagesSection />

      {/* Contact Info */}
      <div>
        <h2 className="text-lg font-semibold">Contact Info</h2>
        <div className="mt-4 max-w-2xl space-y-4">
          <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="e.g. Islamabad, Pakistan" />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="e.g. dev@example.com" />
          <Field label="Availability Status" value={form.availability} onChange={v => setForm({ ...form, availability: v })} placeholder="e.g. Available for freelance projects" />
        </div>
      </div>

      {/* Socials */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Socials</h2>
          <button onClick={addSocial} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            <Plus size={16} /> Add Social
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {socials.map((s, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Social #{i + 1}</span>
                <button onClick={() => removeSocial(i)} className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Icon</label>
                  <select value={s.icon} onChange={e => updateSocial(i, "icon", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="Github">GitHub</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Mail">Email</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Globe">Website</option>
                  </select>
                </div>
                <Field label="Label" value={s.label} onChange={v => updateSocial(i, "label", v)} placeholder="e.g. GitHub" />
                <Field label="URL" value={s.href} onChange={v => updateSocial(i, "href", v)} placeholder="e.g. https://github.com/..." />
                <Field label="Handle" value={s.handle} onChange={v => updateSocial(i, "handle", v)} placeholder="e.g. @username" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Contact Info"}
      </button>
    </div>
  );
}

// --- Messages Section ---
function MessagesSection() {
  const { data: messages = [] } = useContactMessages();
  const [expanded, setExpanded] = useState<string | null>(null);
  const unreadCount = messages.filter(m => !m.read).length;

  const toggleRead = async (msg: ContactMessage) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    await queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Messages</h2>
        {unreadCount > 0 && (
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
            {unreadCount} new
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No messages yet.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white transition-colors ${
                msg.read ? "border-gray-200" : "border-purple-200 bg-purple-50/30"
              }`}
            >
              <div
                className="flex cursor-pointer items-center gap-3 p-4"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className={`shrink-0 ${msg.read ? "text-gray-400" : "text-purple-500"}`}>
                  {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${msg.read ? "text-gray-700" : "font-medium text-gray-900"}`}>
                      {msg.subject}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {msg.name} &lt;{msg.email}&gt; · {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {expanded === msg.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {expanded === msg.id && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{msg.message}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleRead(msg)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Mark as {msg.read ? "unread" : "read"}
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => remove(msg.id)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
    </div>
  );
}
