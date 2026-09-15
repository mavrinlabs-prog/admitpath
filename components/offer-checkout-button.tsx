"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

export function OfferCheckoutButton({ offerSlug, label = "Buy once" }: { offerSlug: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/one-time-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerSlug }),
      });
      if (response.status === 401) {
        window.location.assign(`/sign-in?redirect_url=${encodeURIComponent("/offers")}`);
        return;
      }
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout could not start.");
      analytics.oneTimeOfferCheckoutClicked(offerSlug, "offers_catalog");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not start.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={checkout}
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2E4A6E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1E3352] disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? "Opening secure checkout" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
    </div>
  );
}
