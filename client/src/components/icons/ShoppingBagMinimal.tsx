interface ShoppingBagMinimalProps {
  className?: string;
  size?: number;
}

export default function ShoppingBagMinimal({ className = "", size = 20 }: ShoppingBagMinimalProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="7" width="16" height="14" rx="2" ry="2" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
  );
}
