// Supabase Edge Function: trigger-deploy
//
// Called by the admin "Publish" button. Verifies the caller is an authenticated
// (non-anonymous) user, then POSTs to the Vercel Deploy Hook to kick off a fresh
// build (which re-runs the data prefetch). The hook URL is kept server-side as a
// secret so it is never exposed in the client bundle.
//
// Deploy:  supabase functions deploy trigger-deploy
// Secret:  supabase secrets set VERCEL_DEPLOY_HOOK="https://api.vercel.com/v1/integrations/deploy/..."
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Require a real authenticated user (the anon key alone is rejected).
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const hook = Deno.env.get("VERCEL_DEPLOY_HOOK");
  if (!hook) {
    return json({ error: "VERCEL_DEPLOY_HOOK secret is not set" }, 500);
  }

  try {
    const res = await fetch(hook, { method: "POST" });
    const body = await res.text();
    return json({ triggered: res.ok, status: res.status, body }, res.ok ? 200 : 502);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
