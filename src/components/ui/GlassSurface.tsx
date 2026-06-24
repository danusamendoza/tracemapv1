type GlassVariant = 'surface' | 'card' | 'dark';

interface GlassSurfaceProps {
  variant?: GlassVariant;
  as?: 'div' | 'header' | 'section' | 'nav' | 'aside';
  className?: string;
  children?: any;
  [key: string]: any;
}

const variantClass: Record<GlassVariant, string> = {
  surface: 'glass-surface',
  card: 'glass-card',
  dark: 'glass-surface-dark',
};

/**
 * Frosted-glass container used across the app (top bars, cards, overlays).
 * Keeps the glassmorphism tokens (defined in index.css) in one place.
 */
export default function GlassSurface({
  variant = 'surface',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}: GlassSurfaceProps) {
  return (
    <Tag className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
