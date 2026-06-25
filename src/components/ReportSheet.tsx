import type { FormEvent } from 'react';
import {
  MapPin,
  CaretRight as ChevronRight,
  WarningOctagon as AlertOctagon,
  Users,
  ShieldCheck,
  Funnel as Filter,
  Clock,
  Camera,
  X,
} from '@phosphor-icons/react';
import { BottomSheetHandle, useBottomSheetDrag } from './ui/BottomSheet';
import { IncidentCategory } from '../types';

const CATEGORIES = [
  {
    id: 'retraso' as const,
    title: 'Retraso',
    desc: 'Demoras en la línea o estación.',
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    id: 'congestion' as const,
    title: 'Congestión',
    desc: 'Demasiada gente, flujo de tránsito lento.',
    icon: Users,
    color: 'bg-neutral-200/60 text-black',
  },
  {
    id: 'seguridad' as const,
    title: 'Seguridad',
    desc: 'Asaltos, altercados o riesgos directos.',
    icon: ShieldCheck,
    color: 'bg-rose-500/10 text-rose-500',
  },
  {
    id: 'accidente' as const,
    title: 'Accidente',
    desc: 'Colisiones, fallas de tren o percances médicos.',
    icon: AlertOctagon,
    color: 'bg-rose-500/10 text-rose-500',
  },
];

const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  retraso: 'Retrasos / demoras habituales',
  congestion: 'Flujo de congestión alta',
  seguridad: 'Problemas de seguridad ciudadana',
  accidente: 'Accidentes / retención en vía',
  obras: 'Obras técnicas de mantenimiento',
};

export type ReportStep = 'category' | 'form';

interface ReportSheetProps {
  step: ReportStep;
  selectedCategory: IncidentCategory | null;
  reportLine: string;
  reportStation: string;
  reportComment: string;
  photoPreview: string | null;
  onSelectCategory: (category: IncidentCategory) => void;
  onReportLineChange: (value: string) => void;
  onReportStationChange: (value: string) => void;
  onReportCommentChange: (value: string) => void;
  onPhotoPreviewClear: () => void;
  onSimulatePhoto: () => void;
  onCancel: () => void;
  onProceedToForm: () => void;
  onBackToCategory: () => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

function SheetHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  const startDrag = useBottomSheetDrag();

  return (
    <div
      className="shrink-0 border-b border-slate-100 touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={startDrag}
    >
      <BottomSheetHandle />
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="font-semibold text-sm text-primary uppercase tracking-wide">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-800 cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/** Multi-step report flow content for the bottom sheet. */
export default function ReportSheet({
  step,
  selectedCategory,
  reportLine,
  reportStation,
  reportComment,
  photoPreview,
  onSelectCategory,
  onReportLineChange,
  onReportStationChange,
  onReportCommentChange,
  onPhotoPreviewClear,
  onSimulatePhoto,
  onCancel,
  onProceedToForm,
  onBackToCategory,
  onSubmit,
  onClose,
}: ReportSheetProps) {
  const title = step === 'category' ? 'Reportar incidente' : 'Detalles de alerta';

  return (
    <>
      <SheetHeader title={title} onClose={onClose} />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
        {step === 'category' ? (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-slate-900 leading-snug mb-1">
                ¿Qué está pasando?
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona la categoría que mejor describa el incidente para alertar y guiar a otros
                viajeros en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex flex-col items-start p-4 bg-slate-50/80 rounded-xl border text-left transition-all group cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onSelectCategory('obras')}
                className={`col-span-2 flex items-center p-4 bg-slate-50/80 rounded-xl border text-left transition-all gap-4 group cursor-pointer ${
                  selectedCategory === 'obras'
                    ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-500/10 text-slate-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Filter className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                    Obras y mantenimiento
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium leading-relaxed">
                    Cierres de estaciones de transbordo o reparaciones anuales programadas.
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl overflow-hidden relative h-36 border border-slate-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf05t9lvmz-6upbcGItMLIUr20rwA5M-pdLN54_BPfF7uvWCNnFa2e6hOgo8s7XY7zKP2Mr0JMKalodt2vRQtEgLzWNpnEd8anod32VHdlxRqZ7J6Fu_Ldf65e70n8Zyg7SPyRVBUQwBbqOQ9GT-Mg_RJ3yzjWMSeOEXCHapHZmH7IZp1bNk7YKWHOqpkHYtVlRgqcl6V1l9fZEcbfR7-D8yXvHSFhbPZz_6BkuP26cWF8mGiC-xjor6Psd8GbaSHldDzER5X-Hj4"
                alt="Context transit map shadow"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-3.5">
                <span className="text-white text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" /> Ubicación actual detectada (Puerta del
                  Sol)
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-3.5 rounded-xl bg-primary-container/10 border border-primary-container/20 flex gap-3.5 items-center mb-5">
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center flex-shrink-0">
                {selectedCategory === 'accidente' && <AlertOctagon className="w-5 h-5" />}
                {selectedCategory === 'seguridad' && <ShieldCheck className="w-5 h-5" />}
                {selectedCategory === 'congestion' && <Users className="w-5 h-5" />}
                {selectedCategory === 'retraso' && <Clock className="w-5 h-5" />}
                {selectedCategory === 'obras' && <Filter className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                  Categoría de reporte
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedCategory ? CATEGORY_LABELS[selectedCategory] : ''}
                </span>
              </div>
            </div>

            <form id="report-sheet-form" onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Línea o transporte afectado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Línea 2, Autobús 150, Cercanías C3"
                  value={reportLine}
                  onChange={(e) => onReportLineChange(e.target.value)}
                  className="w-full text-xs bg-slate-50 h-11 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Estación / parada o tramo
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                  <input
                    type="text"
                    placeholder="Estación Puerta del Sol"
                    value={reportStation}
                    onChange={(e) => onReportStationChange(e.target.value)}
                    className="w-full text-xs bg-slate-50 h-11 pl-10 pr-3.5 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-700"
                  />
                </div>
                <span className="text-[9px] text-emerald-500 font-semibold block mt-1">
                  ✓ Confirmado mediante GPS del dispositivo
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Comentario o reporte breve *(mínimo 10 car.)
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportComment}
                  onChange={(e) => onReportCommentChange(e.target.value)}
                  placeholder="Explica qué ocurre para ayudar a Elena u otros conmutadores con su ruta (ej: Trenes parados en túnel)..."
                  className="w-full text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Evidencia visual (comunidad)
                </label>

                {photoPreview ? (
                  <div className="relative h-40 rounded-lg overflow-hidden border border-slate-200 group">
                    <img
                      src={photoPreview}
                      alt="Upload Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={onPhotoPreviewClear}
                      className="absolute top-2 right-2 p-1 bg-slate-950/80 backdrop-blur-sm rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2 px-3">
                      <span className="text-[9px] text-white/90 font-bold block">
                        ✓ Evidencia cargada exitosamente
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onSimulatePhoto}
                    className="w-full py-5 border-2 border-dashed border-slate-200 hover:border-primary rounded-lg flex flex-col items-center justify-center bg-slate-50/50 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <Camera className="w-5.5 h-5.5 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700 block">
                      Fotografiar / adjuntar evidencia
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      Captura real para validación instantánea
                    </span>
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      <div className="shrink-0 p-4 border-t border-slate-100 bg-white flex gap-3">
        {step === 'category' ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onProceedToForm}
              disabled={!selectedCategory}
              className={`flex-grow h-11 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                selectedCategory
                  ? 'bg-primary hover:bg-primary-container shadow-md cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onBackToCategory}
              className="flex-1 h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95"
            >
              Atrás
            </button>
            <button
              type="submit"
              form="report-sheet-form"
              disabled={reportLine.trim().length === 0 || reportComment.trim().length === 0}
              className={`flex-grow h-11 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                reportLine.trim() && reportComment.trim()
                  ? 'bg-primary hover:bg-primary-container shadow-md cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              Enviar reporte ciudadano
            </button>
          </>
        )}
      </div>
    </>
  );
}
