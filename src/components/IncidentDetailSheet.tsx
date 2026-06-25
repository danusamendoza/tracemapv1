import type { FormEvent } from 'react';
import {
  MapPin,
  WarningOctagon as AlertOctagon,
  Users,
  ShieldCheck,
  Funnel as Filter,
  Clock,
  User,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Bell,
  BellSlash as BellOff,
  ShareNetwork as Share2,
  PaperPlaneTilt as Send,
  X,
} from '@phosphor-icons/react';
import { BottomSheetHandle, useBottomSheetDrag } from './ui/BottomSheet';
import { Incident } from '../types';

interface IncidentDetailSheetProps {
  incident: Incident;
  commentInput: string;
  subscribedAlerts: string[];
  onCommentInputChange: (value: string) => void;
  onAddComment: (e: FormEvent) => void;
  onVote: (incidentId: string, direction: 'up' | 'down') => void;
  onToggleSubscribe: (id: string) => void;
  onShare: () => void;
  onClose: () => void;
}

function DetailHeader({ onShare, onClose }: { onShare: () => void; onClose: () => void }) {
  const startDrag = useBottomSheetDrag();

  return (
    <div
      className="shrink-0 border-b border-slate-100 touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={startDrag}
    >
      <BottomSheetHandle />
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="font-semibold text-sm text-primary uppercase tracking-wide">
          Detalle del incidente
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onShare}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer active:scale-95 transition-transform"
            aria-label="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
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
    </div>
  );
}

/** Incident detail content for the bottom sheet. */
export default function IncidentDetailSheet({
  incident,
  commentInput,
  subscribedAlerts,
  onCommentInputChange,
  onAddComment,
  onVote,
  onToggleSubscribe,
  onShare,
  onClose,
}: IncidentDetailSheetProps) {
  return (
    <>
      <DetailHeader onShare={onShare} onClose={onClose} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <section className="relative h-36 bg-slate-100 border-b border-slate-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWdYUgAjQBF4zHqudKowXm2iymN3BPrybHylaoV-H44yPRfRA-xnRv0hu1f7vTRnOk6HvRaJh2OeAnh3LBrhkSF84G047tMhsJNyoDiVb5Ctpk2PruwWtyl_dtxpMzs3XctWzZcNyWNuS570_MipxDgZVS2OhdAiWV79UvqZiyjFvfNqRq8i7enzaXgkmCtwZX7B0ED2T7pCNdguz-Osd_htzHxAThGJ4d7MsOGedjbyUXRxV2TfJUq5m979ePBpo-u-K5f-RC0Ew"
            alt="Mini location map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-95"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500/30 opacity-75" />
              <span className="relative inline-flex rounded-full h-8 w-8 bg-rose-500/20 border border-rose-500 flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white shadow-md" />
              </span>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-slate-200/50">
            <p className="text-[10px] text-slate-700 font-bold flex items-center gap-1 inline-block">
              <MapPin className="w-3.5 h-3.5 text-rose-500 inline" />
              {incident.location.split('(')[0].trim()}
            </p>
          </div>
        </section>

        <section className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide text-white ${
                    incident.status === 'critical' ? 'bg-critical' : 'bg-warning'
                  }`}
                >
                  {incident.status === 'critical' ? 'CRÍTICO' : 'RETRASO'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{incident.timeAgo}</span>
              </div>
              <h2 className="font-semibold text-slate-900 text-lg leading-tight">{incident.title}</h2>
            </div>

            <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 text-primary">
              {incident.category === 'accidente' ? (
                <AlertOctagon className="w-6 h-6 text-critical" />
              ) : incident.category === 'seguridad' ? (
                <ShieldCheck className="w-6 h-6 text-critical" />
              ) : incident.category === 'congestion' ? (
                <Users className="w-6 h-6 text-black" />
              ) : incident.category === 'retraso' ? (
                <Clock className="w-6 h-6 text-amber-500" />
              ) : (
                <Filter className="w-6 h-6 text-black" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden text-slate-600 flex items-center justify-center font-bold">
              {incident.verified ? (
                <ShieldCheck className="w-5 h-5 text-black" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-extrabold text-[11px] text-slate-800">
                  {incident.verified ? 'Servicio de tránsito oficial' : 'Informante verificado'}
                </p>
                <span className="text-black">
                  <CheckCircle className="w-3.5 h-3.5 fill-black text-white" />
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium">
                Nivel 4 · Experto en rutas metropolitanas
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/40">
            {incident.description}
          </p>
        </section>

        <section className="p-4 bg-slate-50/50 border-b border-slate-100 space-y-3.5">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider text-center">
            ¿Sigue transcurriendo?
          </h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onVote(incident.id, 'up')}
              className={`flex-1 p-3.5 rounded-xl border-2 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                incident.voted === 'up'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <ThumbsUp className={`w-5.5 h-5.5 ${incident.voted === 'up' ? 'fill-primary/15' : ''}`} />
              <span className="text-2xs font-extrabold uppercase tracking-wider">Sí, sigue igual</span>
            </button>

            <button
              type="button"
              onClick={() => onVote(incident.id, 'down')}
              className={`flex-1 p-3.5 rounded-xl border-2 hover:bg-rose-50/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                incident.voted === 'down'
                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <ThumbsDown className="w-5.5 h-5.5" />
              <span className="text-2xs font-extrabold uppercase tracking-wider text-secondary">
                No, ya se despejó
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 bg-slate-200/50 py-2 rounded-full">
            <div className="flex -space-x-1.5">
              <div className="w-5.5 h-5.5 rounded-full border border-white bg-neutral-200 flex items-center justify-center text-[8px] font-bold">
                JD
              </div>
              <div className="w-5.5 h-5.5 rounded-full border border-white bg-green-100 flex items-center justify-center text-[8px] font-bold">
                AL
              </div>
              <div className="w-5.5 h-5.5 rounded-full border border-white bg-purple-100 flex items-center justify-center text-[8px] font-bold">
                MS
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold">
              <strong className="text-slate-800">{incident.votes} personas</strong> validaron este
              reporte en tránsito
            </p>
          </div>
        </section>

        <section className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-950 text-xs uppercase tracking-wider">
              Comentarios recientes ({incident.comments.length})
            </h3>
            <span className="text-[10px] text-primary font-bold">Comunidad activa</span>
          </div>

          <div className="space-y-3.5">
            {incident.comments.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center py-4">
                No hay comentarios en este reporte todavía. Sé el primero en opinar.
              </p>
            ) : (
              incident.comments.map((comm) => (
                <div key={comm.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {comm.user.charAt(0)}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-200/60 flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="text-2xs font-extrabold text-slate-700">
                        {comm.user}{' '}
                        <span className="text-slate-400 font-normal">
                          · {comm.level || 'Viajero'}
                        </span>
                      </p>
                      <span className="text-[9px] text-slate-400">{comm.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{comm.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={onAddComment}
            className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/10"
          >
            <input
              type="text"
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              placeholder="Añadir actualización o comentar..."
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs flex-1 text-slate-800 placeholder-slate-400 py-1 font-medium"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className={`p-1.5 rounded-full ${
                commentInput.trim() ? 'bg-primary text-white cursor-pointer' : 'text-slate-300'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        <div className="p-4 space-y-3.5 pb-6">
          <button
            type="button"
            onClick={() => onToggleSubscribe(incident.id)}
            className={`w-full h-11 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
              subscribedAlerts.includes(incident.id)
                ? 'bg-slate-100 border border-slate-300 text-slate-500'
                : 'bg-primary text-white hover:bg-primary-container'
            }`}
          >
            {subscribedAlerts.includes(incident.id) ? (
              <>
                <BellOff className="w-4 h-4 text-slate-400" /> Dejar de seguir alerta
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-white" /> Seguir esta alerta en tiempo real
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95 shadow-2xs"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </>
  );
}
