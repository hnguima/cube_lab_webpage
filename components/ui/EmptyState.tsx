import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "fullscreen" | "inline";
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  variant = "fullscreen",
}: EmptyStateProps) {
  const containerClass =
    variant === "fullscreen" ? "fullscreen-empty" : "inline-empty";

  return (
    <div className={containerClass}>
      <div className="empty-content">
        <h1>{title}</h1>
        <p>{message}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="btn-home">
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
