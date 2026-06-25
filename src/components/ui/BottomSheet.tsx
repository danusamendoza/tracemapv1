import {
  createContext,
  useContext,
  type ReactNode,
  type PointerEvent,
  useRef,
} from 'react';
import {
  motion,
  AnimatePresence,
  useDragControls,
  type PanInfo,
} from 'motion/react';

const DISMISS_OFFSET = 120;
const DISMISS_VELOCITY = 800;

type StartDrag = (event: PointerEvent) => void;

const BottomSheetDragContext = createContext<StartDrag>(() => {});

export function useBottomSheetDrag(): StartDrag {
  return useContext(BottomSheetDragContext);
}

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  heightClass?: string;
}

/** Bottom sheet overlay — backdrop + draggable panel from bottom. */
export default function BottomSheet({
  open,
  onClose,
  children,
  heightClass = 'max-h-[90%]',
}: BottomSheetProps) {
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  const startDrag: StartDrag = (event) => {
    dragControls.start(event);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <BottomSheetDragContext.Provider value={startDrag}>
          <div className="absolute inset-0 z-[1200] flex flex-col justify-end pointer-events-auto">
            <motion.button
              type="button"
              aria-label="Cerrar"
              className="absolute inset-0 bg-black/40 cursor-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.35 }}
              onDragEnd={handleDragEnd}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`relative w-full ${heightClass} flex flex-col bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(15,23,42,0.18)] overflow-hidden`}
            >
              {children}
            </motion.div>
          </div>
        </BottomSheetDragContext.Provider>
      )}
    </AnimatePresence>
  );
}

/** Grab handle — attach drag via useBottomSheetDrag(). */
export function BottomSheetHandle() {
  const startDrag = useBottomSheetDrag();

  return (
    <div
      className="shrink-0 touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={startDrag}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-slate-300" aria-hidden />
      </div>
    </div>
  );
}
