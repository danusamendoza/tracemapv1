import { User } from '@phosphor-icons/react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarVariant = 'default' | 'onDark';

interface AvatarPlaceholderProps {
  name?: string;
  className?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const textSize: Record<AvatarSize, string> = {
  sm: 'text-[9px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-lg',
};

const iconSize: Record<AvatarSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-7 h-7',
};

const shellVariant: Record<AvatarVariant, string> = {
  default: 'bg-neutral-100 border border-neutral-200 text-neutral-700',
  onDark: 'bg-white/15 border border-white/25 text-white',
};

/** Circular avatar placeholder with initials (or User icon if no name). */
export default function AvatarPlaceholder({
  name = '',
  className = 'w-12 h-12',
  size = 'lg',
  variant = 'default',
}: AvatarPlaceholderProps) {
  const initials = name ? getInitials(name) : '';

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden font-extrabold ${shellVariant[variant]} ${className}`}
      aria-label={name || 'Avatar'}
    >
      {initials ? (
        <span className={textSize[size]}>{initials}</span>
      ) : (
        <User className={iconSize[size]} weight="regular" />
      )}
    </div>
  );
}
