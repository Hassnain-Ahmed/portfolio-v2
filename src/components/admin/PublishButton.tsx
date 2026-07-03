import { supabase } from "@/lib/supabase";
import { AlertCircle, Check, Loader2, Rocket } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "publishing" | "success" | "error";

/**
 * Triggers a fresh Vercel build+deploy via the `trigger-deploy` Supabase Edge
 * Function (which holds the deploy-hook URL as a secret). The build re-runs the
 * data prefetch, so admin edits become live on the static public site.
 */
export default function PublishButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const publish = async () => {
    setStatus("publishing");
    setMessage("");
    try {
      const { error } = await supabase.functions.invoke("trigger-deploy");
      if (error) throw error;
      setStatus("success");
      setMessage("Rebuilding — your changes go live in ~1-2 min.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Failed to trigger a deploy.");
    }
  };

  const Icon =
    status === "publishing"
      ? Loader2
      : status === "success"
        ? Check
        : status === "error"
          ? AlertCircle
          : Rocket;

  return (
    <div className="mb-2 space-y-1.5">
      <button
        onClick={publish}
        disabled={status === "publishing"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon size={16} className={status === "publishing" ? "animate-spin" : ""} />
        {status === "publishing"
          ? "Publishing…"
          : status === "success"
            ? "Published"
            : "Publish changes"}
      </button>
      {message && (
        <p
          className={`px-1 text-xs leading-snug ${
            status === "error" ? "text-red-400" : "text-gray-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
