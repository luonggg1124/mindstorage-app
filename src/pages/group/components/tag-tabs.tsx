import type { ITagByGroupDto } from "@/data/api/tag";

type TagTabsProps = {
  loading: boolean;
  errorMessage?: string;
  tags: ITagByGroupDto[];
  activeTagId: number | null;
  onSelectTag: (id: number) => void;
};

export function TagTabs({ loading, errorMessage, tags, activeTagId, onSelectTag }: TagTabsProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-24 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className=" sm:p-5">
      {tags.length > 0 ? (
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {tags.map((tag) => {
              const isActive = tag.id === activeTagId;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onSelectTag(tag.id)}
                  className={[
                    "cursor-pointer whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
                    "border-b-2",
                    isActive
                      ? "border-indigo-400 text-indigo-200"
                      : "border-transparent text-slate-300/80 hover:text-slate-100",
                  ].join(" ")}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/80">
          Chưa có thẻ nào.
        </div>
      )}
    </div>
  );
}

