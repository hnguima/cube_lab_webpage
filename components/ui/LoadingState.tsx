interface LoadingStateProps {
  message?: string;
  variant?: "fullscreen" | "inline";
}

export default function LoadingState({
  message = "Loading...",
  variant = "fullscreen",
}: LoadingStateProps) {
  const containerClass =
    variant === "fullscreen" ? "fullscreen-loader" : "inline-loader";

  return (
    <div className={containerClass}>
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}
