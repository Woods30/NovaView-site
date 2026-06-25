import { cn } from '~/lib/cn';

const SIZES = { sm: 32, md: 60, lg: 180 } as const;
type LogoSize = keyof typeof SIZES;

interface LogoProps {
  size?: LogoSize;
  alt: string;
  className?: string;
}

export function Logo({ size = 'sm', alt, className }: LogoProps) {
  const px = SIZES[size];
  return (
    <picture>
      <source
        srcSet={px === 32 ? '/brand/logo-32.png' : '/brand/logo-180.png'}
        media="(max-width: 768px)"
      />
      <img
        src={
          size === 'sm'
            ? '/brand/logo-32.png'
            : size === 'md'
              ? '/brand/logo-60.png'
              : '/brand/logo-180.png'
        }
        alt={alt}
        width={px}
        height={px}
        className={cn('block flex-shrink-0', className)}
        decoding="async"
      />
    </picture>
  );
}
