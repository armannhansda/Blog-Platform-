export interface FilterTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: FilterTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className="px-3 py-1.5 rounded-full font-medium text-sm hover:opacity-90 transition whitespace-nowrap"
          style={
            activeCategory === category
              ? {
                  backgroundColor: "#D9EAFD",
                  color: "#1F3A51",
                }
              : {
                  backgroundColor: "#F8FAFC",
                  color: "#1F3A51",
                  border: "1px solid #BCCCDC",
                }
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}
