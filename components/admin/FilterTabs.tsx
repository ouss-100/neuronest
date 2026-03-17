interface FilterTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

const FilterTabs = ({ tabs, active, onChange }: FilterTabsProps) => (
  <div className="flex gap-2 flex-wrap">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all duration-200 ${
          active === tab
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default FilterTabs;
