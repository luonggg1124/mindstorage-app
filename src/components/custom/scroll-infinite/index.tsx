import * as React from "react";

type ScrollInfiniteProps = {
  enabled?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  children?: React.ReactNode;
  endMessage?: React.ReactNode;
};

export default function ScrollInfinite({
  enabled = true,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  className,
  threshold = 0.1,
  rootMargin,
  children,
  endMessage,
}: ScrollInfiniteProps) {
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = Boolean(entries[0]?.isIntersecting);
        if (!inView) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;
        onLoadMore();
      },
      {
        root: null,
        threshold,
        ...(rootMargin ? { rootMargin } : null),
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, hasNextPage, isFetchingNextPage, onLoadMore, rootMargin, threshold]);

  return (
    <div className={className}>
      {children}
      <div ref={targetRef} />
      {enabled && !hasNextPage && !isFetchingNextPage ? endMessage : null}
    </div>
  );
}

