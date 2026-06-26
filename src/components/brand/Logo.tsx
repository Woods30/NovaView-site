import { cn } from '~/lib/cn';

interface LogoProps {
  /** Pixel size (width = height). Defaults to 60. */
  size?: number;
  alt: string;
  className?: string;
}

/**
 * Single-source LOGO. Always renders `/brand/logo.png` and lets the browser
 * scale via width/height attributes. No pre-rendered 32/60/180 variants —
 * one transparent PNG powers every display size.
 */
export function Logo({ size = 60, alt, className }: LogoProps) {
  return (
    <img
      src="/brand/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={cn('block flex-shrink-0', className)}
      decoding="async"
    />
  );
}
