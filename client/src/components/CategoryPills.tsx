import { Badge } from "@/components/ui/badge";

interface CategoryPillsProps {
  categories: string[];
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
}

export default function CategoryPills({
  categories,
  activeCategory,
  onCategoryClick,
}: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide" data-testid="container-categories">
      <div className="flex gap-2 min-w-max px-4 md:px-6 py-4 md:max-w-7xl md:mx-auto md:justify-center">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <Badge
              key={category}
              variant={isActive ? "secondary" : "outline"}
              className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-100 border-transparent text-slate-900 hover:bg-cyan-200"
                  : "border-slate-900 text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => onCategoryClick?.(category)}
              data-testid={`badge-category-${category.toLowerCase()}`}
            >
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
