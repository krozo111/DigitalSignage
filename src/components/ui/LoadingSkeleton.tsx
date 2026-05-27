interface LoadingSkeletonProps {
  variant?: "card" | "row" | "text" | "circle" | "grid";
  count?: number;
  className?: string;
}

function SkeletonShape({
  variant,
  className = "",
}: {
  variant: LoadingSkeletonProps["variant"];
  className?: string;
}) {
  const base = "animate-pulse bg-white/10 rounded-lg";

  if (variant === "circle") {
    return (
      <div className={`${base} rounded-full ${className || "h-10 w-10"}`} />
    );
  }

  if (variant === "row") {
    return <div className={`${base} h-12 w-full ${className}`} />;
  }

  if (variant === "text") {
    return (
      <div className={`${base} h-4 w-full ${className || "max-w-xs"}`} />
    );
  }

  return <div className={`${base} h-32 w-full ${className}`} />;
}

export function LoadingSkeleton({
  variant = "grid",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  if (variant === "grid") {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-1 border border-border rounded-xl p-4 space-y-3"
          >
            <SkeletonShape variant="card" />
            <SkeletonShape variant="text" />
            <SkeletonShape variant="text" className="max-w-[60%]" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonShape key={i} variant="row" />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-1 border border-border rounded-xl p-4 space-y-3"
          >
            <SkeletonShape variant="card" />
            <SkeletonShape variant="text" />
            <SkeletonShape variant="text" className="max-w-[60%]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonShape key={i} variant="text" />
      ))}
    </div>
  );
}
