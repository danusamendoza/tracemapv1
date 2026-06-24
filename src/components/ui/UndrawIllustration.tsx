import { lazy, Suspense, type CSSProperties, type ComponentType } from 'react';
import type { UndrawSvgProps } from '../../illustrations/types';

/** Brand primary — matches design system #000000 */
const UNDRAW_COLOR = '#000000';

const ILLUSTRATION_LOADERS = {
  locationTracking: () => import('../../illustrations/LocationTracking'),
  winners: () => import('../../illustrations/Winners'),
} as const;

type IllustrationName = keyof typeof ILLUSTRATION_LOADERS;

interface UndrawIllustrationProps {
  name: IllustrationName;
  className?: string;
  style?: CSSProperties;
}

const lazyIllustrations: Record<IllustrationName, ComponentType<UndrawSvgProps>> = {
  locationTracking: lazy(ILLUSTRATION_LOADERS.locationTracking),
  winners: lazy(ILLUSTRATION_LOADERS.winners),
};

function IllustrationPlaceholder() {
  return (
    <div
      className="w-full aspect-[4/3] max-h-44 animate-pulse rounded-2xl bg-slate-100/80"
      aria-hidden
    />
  );
}

/** unDraw-style illustration wrapper — local SVGs, code-split on demand. */
export default function UndrawIllustration({ name, className = '', style }: UndrawIllustrationProps) {
  const Illustration = lazyIllustrations[name];

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <Suspense fallback={<IllustrationPlaceholder />}>
        <Illustration
          color={UNDRAW_COLOR}
          size="100%"
          style={{ maxHeight: '11rem', width: '100%', ...style }}
        />
      </Suspense>
    </div>
  );
}
