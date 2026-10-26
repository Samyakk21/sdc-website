"use client";

/**
 * Submit button with a confirmation prompt. Extracted into a Client Component
 * because Server Components cannot pass event handlers to DOM elements —
 * inlining `onClick` in an admin list page crashes the whole route at runtime.
 */
export function ConfirmSubmitButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
