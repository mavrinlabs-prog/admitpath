/**
 * Visual separator for auth pages ("OR" between social and email login).
 * Uses DL brand border token for consistent styling.
 */
export function AuthSeparator() {
  return (
    <div className="flex w-full items-center justify-center my-4" role="separator" aria-orientation="horizontal">
      <div className="h-px flex-1" style={{ background: "var(--dl-border, rgba(0,0,0,0.06))" }} />
      <span className="px-3 text-xs font-medium select-none" style={{ color: "var(--dl-text-muted, #5A6275)" }}>OR</span>
      <div className="h-px flex-1" style={{ background: "var(--dl-border, rgba(0,0,0,0.06))" }} />
    </div>
  );
}
