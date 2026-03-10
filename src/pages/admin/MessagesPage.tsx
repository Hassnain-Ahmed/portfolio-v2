import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useContactMessages, type ContactMessage } from "@/hooks/useContactMessages";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { ChevronDown, ChevronUp, Mail, MailOpen } from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
  const { data: messages = [] } = useContactMessages();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; subject: string } | null>(null);
  const unreadCount = messages.filter(m => !m.read).length;

  const toggleRead = async (msg: ContactMessage) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    await queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("contact_messages").delete().eq("id", deleteTarget.id);
    await queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-white">Messages</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-medium text-purple-400">
            {unreadCount} new
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">Contact form submissions from your portfolio</p>

      {messages.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`rounded-xl border transition-colors ${
                msg.read ? "border-gray-800 bg-gray-900" : "border-purple-500/30 bg-purple-500/5"
              }`}
            >
              <div
                className="flex cursor-pointer items-center gap-3 p-4"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className={`shrink-0 ${msg.read ? "text-gray-500" : "text-purple-400"}`}>
                  {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${msg.read ? "text-gray-300" : "font-medium text-white"}`}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {msg.name} &lt;{msg.email}&gt; · {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="shrink-0">
                  {expanded === msg.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </div>
              </div>

              {expanded === msg.id && (
                <div className="border-t border-gray-800 px-4 pb-4 pt-3">
                  <p className="whitespace-pre-wrap text-sm text-gray-300">{msg.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleRead(msg)}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-800"
                    >
                      Mark as {msg.read ? "unread" : "read"}
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-800"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => setDeleteTarget({ id: msg.id, subject: msg.subject })}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15"
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Message"
        message={`Are you sure you want to delete "${deleteTarget?.subject}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
