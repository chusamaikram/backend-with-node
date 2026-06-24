import { cn } from "@/utils/cn";

const TABS = ["Videos", "Playlists", "Tweets"];

function ChannelTabs({ active, onChange }) {
  return (
    <nav aria-label="Channel sections" className="flex border-b border-bg-border">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          aria-selected={active === tab}
          role="tab"
          className={cn(
            "px-5 py-3 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px",
            active === tab
              ? "border-accent text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary"
          )}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default ChannelTabs;
