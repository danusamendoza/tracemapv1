import { MapPin, Bell, WarningOctagon } from '@phosphor-icons/react';
import { PermissionsConfig } from '../types';
import Toggle from './ui/Toggle';

interface PermissionSettingsFieldsProps {
  value: PermissionsConfig;
  onChange: (next: PermissionsConfig) => void;
}

const FIELDS: Array<{
  key: keyof PermissionsConfig;
  icon: typeof MapPin;
  label: string;
  helper: string;
}> = [
  {
    key: 'geolocation',
    icon: MapPin,
    label: 'Geolocalización',
    helper: 'Ubicación en tiempo real',
  },
  {
    key: 'liveNotifications',
    icon: Bell,
    label: 'Alertas en vivo',
    helper: 'Avisos mientras te mueves',
  },
  {
    key: 'criticalNotifications',
    icon: WarningOctagon,
    label: 'Alertas críticas',
    helper: 'Suspensiones y cierres en tu ruta',
  },
];

/** Three permission toggles shared by the startup gate and profile settings. */
export default function PermissionSettingsFields({ value, onChange }: PermissionSettingsFieldsProps) {
  return (
    <div className="space-y-3">
      {FIELDS.map((field) => {
        const Icon = field.icon;
        return (
          <div
            key={field.key}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 border border-white/70"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
              <Icon className="w-5 h-5" weight="regular" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-black leading-tight">{field.label}</p>
              <p className="text-[10px] text-neutral-500 font-medium mt-0.5 leading-snug">
                {field.helper}
              </p>
            </div>
            <Toggle
              id={`perm-${field.key}`}
              label={field.label}
              checked={value[field.key]}
              onChange={(checked) => onChange({ ...value, [field.key]: checked })}
            />
          </div>
        );
      })}
    </div>
  );
}
