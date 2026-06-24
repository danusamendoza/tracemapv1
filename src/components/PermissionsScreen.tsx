import UndrawIllustration from './ui/UndrawIllustration';
import PermissionSettingsFields from './PermissionSettingsFields';
import { PermissionsConfig } from '../types';

interface PermissionsScreenProps {
  value: PermissionsConfig;
  onChange: (next: PermissionsConfig) => void;
  onContinue: () => void;
}

/** Startup gate — mock permission toggles before entering the app. */
export default function PermissionsScreen({ value, onChange, onContinue }: PermissionsScreenProps) {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background px-4 pt-6 pb-8">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">
        <UndrawIllustration name="locationTracking" className="mb-2" />

        <div className="text-center mb-6">
          <h1 className="text-lg font-extrabold text-black leading-tight">
            Activa tu copiloto urbano
          </h1>
          <p className="text-[11px] text-neutral-500 font-medium mt-2 leading-relaxed max-w-[16rem] mx-auto">
            Configura ubicación y alertas para recibir avisos a tiempo y decidir tu ruta sin sorpresas.
          </p>
        </div>

        <PermissionSettingsFields value={value} onChange={onChange} />

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onContinue}
            className="w-full flex items-center justify-center bg-black hover:bg-neutral-800 text-white h-12 rounded-full text-xs font-extrabold uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-[0_12px_34px_rgba(0,0,0,0.28)]"
          >
            Empezar a moverme
          </button>
        </div>
      </div>
    </div>
  );
}
