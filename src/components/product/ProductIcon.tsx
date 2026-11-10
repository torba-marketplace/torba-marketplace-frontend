type ProductIconProps = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

export function ProductIcon({ src, width, height, alt = '' }: ProductIconProps) {
  return (
    // Figma SVGs keep their exported width and height; next/image would rescale them.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  );
}
