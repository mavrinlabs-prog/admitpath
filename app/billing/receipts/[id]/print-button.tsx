"use client";

/**
 * Tiny client-side print trigger for the receipt page. Split into its own
 * file because the receipt page itself is a server component (talks to
 * Stripe with secret keys) and `onClick` requires a client boundary.
 */
export function ReceiptPrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="inline-flex items-center justify-center min-h-[44px] rounded-md px-5 text-sm font-medium text-white transition-[filter] hover:brightness-95 active:brightness-90 focus-ring"
      style={{ background: "#4A6FA5" }}
    >
      Print
    </button>
  );
}
