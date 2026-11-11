type ProductHeartProps = {
  saved: boolean;
  size?: number;
  color: string;
};

export function ProductHeart({ saved, size = 20, color }: ProductHeartProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.5 7.91656C2.5 2.91653 8.33333 2.49987 10 6.4119C11.6667 2.49987 17.5 2.91653 17.5 7.91656C17.5 12.9166 10 17.0834 10 17.0834C10 17.0834 2.5 12.9166 2.5 7.91656Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={saved ? color : 'none'}
      />
    </svg>
  );
}
