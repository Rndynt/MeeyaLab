import Hero from "../Hero";

export default function HeroExample() {
  return (
    <Hero
      onShopClick={() => console.log("Shop products clicked")}
      onCheckOrderClick={() => console.log("Check order clicked")}
    />
  );
}
