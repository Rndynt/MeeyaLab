import { useState } from "react";
import CategoryPills from "../CategoryPills";

export default function CategoryPillsExample() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <CategoryPills
      categories={["All", "Cleansers", "Serums", "Moisturizers", "Sunscreen", "Treatments"]}
      activeCategory={activeCategory}
      onCategoryClick={(category) => {
        console.log(`Category clicked: ${category}`);
        setActiveCategory(category);
      }}
    />
  );
}
