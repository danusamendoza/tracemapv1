import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MagnifyingGlass as Search,
  MapPin,
  Warning as AlertTriangle,
  WarningOctagon as AlertOctagon,
  User,
  Users,
  CaretRight as ChevronRight,
  CheckCircle,
  CaretLeft as ChevronLeft,
  ArrowLeft,
  Plus,
  ChatCircle as MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ShareNetwork as Share2,
  Bell,
  BellSlash as BellOff,
  X,
  Camera,
  ArrowClockwise as RefreshCw,
  Trophy,
  ShieldCheck,
  CreditCard,
  Funnel as Filter,
  Compass,
  Train,
  Warning as TriangleAlert,
  PaperPlaneTilt as Send,
  Coffee,
  Ticket,
  TrendUp as TrendingUp,
  MapTrifold as Map,
  WarningCircle as BadgeAlert,
  Clock,
  Sparkle as Sparkles,
  Gear as Settings,
  List,
  SquaresFour as LayoutGrid,
  House
} from '@phosphor-icons/react';
import { Incident, IncidentCategory, Comment, PermissionsConfig } from './types';
import { INITIAL_INCIDENTS } from './data';
import IncidentHeatMap from './components/IncidentHeatMap';
import StackedIncidentCards from './components/StackedIncidentCards';
import ZoneMonitoringCard from './components/ZoneMonitoringCard';
import GlassPillBar from './components/ui/GlassPillBar';
import FloatingNavBar from './components/ui/FloatingNavBar';
import AvatarPlaceholder from './components/ui/AvatarPlaceholder';
import UndrawIllustration from './components/ui/UndrawIllustration';
import PermissionsScreen from './components/PermissionsScreen';
import PermissionSettingsFields from './components/PermissionSettingsFields';
import { randomSolCoordinates } from './utils/heatmap';

const CURRENT_USER_NAME = 'Elena García';

const DEFAULT_PERMISSIONS: PermissionsConfig = {
  geolocation: false,
  liveNotifications: true,
  criticalNotifications: true,
};

// Map legend definition — uses only design-system tokens
const MAP_LEGEND: Array<{ label: string; dotClass: string }> = [
  { label: 'Crítico', dotClass: 'bg-critical' },
  { label: 'Retraso / aviso', dotClass: 'bg-warning' },
  { label: 'Obras / programado', dotClass: 'bg-primary' },
  { label: 'Resuelto', dotClass: 'bg-success' },
];

// Incident category filters for the pills (label + value)
const CATEGORY_FILTERS: Array<{ label: string; value: 'todos' | IncidentCategory }> = [
  { label: 'Todos', value: 'todos' },
  { label: 'Retraso', value: 'retraso' },
  { label: 'Seguridad', value: 'seguridad' },
  { label: 'Accidente', value: 'accidente' },
  { label: 'Congestión', value: 'congestion' },
  { label: 'Obras', value: 'obras' },
];

export default function App() {
  // Screen States: 'home' | 'heatmap' | 'select-category' | 'report-form' | 'success' | 'detail'
  const [screen, setScreen] = useState<'home' | 'heatmap' | 'select-category' | 'report-form' | 'success' | 'detail'>('home');
  // Nav Tab States: 'home' | 'rutas' | 'comunidad' | 'perfil'
  const [activeTab, setActiveTab] = useState<'home' | 'rutas' | 'comunidad' | 'perfil'>('home');

  // Incidents Database State
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Loading & State Feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | IncidentCategory>('todos');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);

  // Home incidents view: vertical list vs inline map
  const [homeIncidentView, setHomeIncidentView] = useState<'lista' | 'mapa'>('lista');

  // Fullscreen map view: map (with carousel) vs vertical list
  const [mapViewMode, setMapViewMode] = useState<'mapa' | 'lista'>('mapa');
  const [activeCarouselId, setActiveCarouselId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // New Report Draft
  const [reportLine, setReportLine] = useState<string>('');
  const [reportStation, setReportStation] = useState<string>('Estación Puerta del Sol'); // default detected station
  const [reportComment, setReportComment] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  // Detail Screen Interactive State
  const [commentInput, setCommentInput] = useState<string>('');
  
  // Gamification & Ads State
  const [userPoints, setUserPoints] = useState<number>(120);
  const [isCouponRedeemed, setIsCouponRedeemed] = useState<boolean>(false);
  const [subscribedAlerts, setSubscribedAlerts] = useState<string[]>([]);

  // Permissions gate (mock toggles — no browser APIs)
  const [permissions, setPermissions] = useState<PermissionsConfig>(DEFAULT_PERMISSIONS);
  const [permissionsAcknowledged, setPermissionsAcknowledged] = useState<boolean>(false);

  // Simulation controls
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Floating Particles for Success view
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; top: number; size: number; color: string; delay: number }>>([]);

  // Auto trigger confetti values once on success screen
  useEffect(() => {
    if (screen === 'success') {
      const arr = [];
      const colors = ['#000000', '#171717', '#404040', '#22C55E', '#F59E0B', '#EF4444'];
      for (let i = 0; i < 40; i++) {
        arr.push({
          id: i,
          left: Math.random() * 95,
          top: Math.random() * -30 - 10,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        });
      }
      setConfetti(arr);
    }
  }, [screen]);

  // Show a message toast
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Simulates refreshing data (and sometimes triggers mock error or skeleton state for PRD requirement testing!)
  const handleRefresh = () => {
    setIsLoading(true);
    // 15% chance of connection error as specified in PRD states
    if (Math.random() < 0.15) {
      setTimeout(() => {
        setIsLoading(false);
        showToast("No pudimos actualizar los reportes. Revisa tu conexión.");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        showToast("Estaciones y alertas comunitarias actualizadas.");
      }, 800);
    }
  };

  // Handle reporting flow transitions
  const startReporting = () => {
    setSelectedCategory(null);
    setReportLine('');
    setReportComment('');
    setPhotoPreview(null);
    setScreen('select-category');
  };

  const handleSelectCategory = (category: IncidentCategory) => {
    setSelectedCategory(category);
  };

  const proceedToForm = () => {
    if (!selectedCategory) return;
    setScreen('report-form');
  };

  const handleSimulatePhoto = () => {
    // Inject a lovely mock base64 transit image for visual completeness
    setPhotoPreview('https://lh3.googleusercontent.com/aida-public/AB6AXuCf05t9lvmz-6upbcGItMLIUr20rwA5M-pdLN54_BPfF7uvWCNnFa2e6hOgo8s7XY7zKP2Mr0JMKalodt2vRQtEgLzWNpnEd8anod32VHdlxRqZ7J6Fu_Ldf65e70n8Zyg7SPyRVBUQwBbqOQ9GT-Mg_RJ3yzjWMSeOEXCHapHZmH7IZp1bNk7YKWHOqpkHYtVlRgqcl6V1l9fZEcbfR7-D8yXvHSFhbPZz_6BkuP26cWF8mGiC-xjor6Psd8GbaSHldDzER5X-Hj4');
    showToast("Imagen de reporte adjuntada exitosamente.");
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setIsLoading(true);

    const titleCategory = {
      retraso: 'Retraso técnico',
      congestion: 'Alta congestión',
      seguridad: 'Alerta de seguridad',
      accidente: 'Accidente en vía',
      obras: 'Demoras por obras'
    }[selectedCategory];

    const finalLine = reportLine.trim() || 'Línea de conexión';
    const finalLocation = `${reportStation} (${reportLine ? 'Línea ' + reportLine : 'Zona central'})`;

    const coords = randomSolCoordinates();

    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      category: selectedCategory,
      title: `${finalLine} - ${titleCategory}`,
      line: finalLine,
      location: `${finalLocation} (Reportado por ti)`,
      timeAgo: 'Hace 1 min',
      timestamp: new Date(),
      status: selectedCategory === 'accidente' || selectedCategory === 'seguridad' ? 'critical' : 'warning',
      verified: false,
      votes: 1,
      voted: 'up',
      description: reportComment.trim() || `Se ha reportado una situación de ${titleCategory} en la estación ${reportStation}. Tránsito afectado de manera temporal.`,
      lat: coords.lat,
      lng: coords.lng,
      imageUrl: photoPreview || undefined,
      comments: [
        {
          id: 'sys-1',
          user: 'Elena (Tú)',
          timeAgo: 'Hace 1 min',
          text: reportComment.trim() || `Reportando ${titleCategory} desde mi dispositivo. ¡Tomen precauciones!`,
          verified: true,
          level: 'Nivel 1'
        }
      ]
    };

    setTimeout(() => {
      setIncidents([newIncident, ...incidents]);
      setNewlyCreatedId(newIncident.id);
      setUserPoints(userPoints + 15); // +15 community points reward!
      setIsLoading(false);
      setScreen('success');
    }, 1200);
  };

  // Upvote/Downvote logic in details screen
  const handleVote = (incidentId: string, direction: 'up' | 'down') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        let voteDiff = 0;
        let nextVoted: 'up' | 'down' | null = direction;
        
        if (inc.voted === direction) {
          voteDiff = direction === 'up' ? -1 : 1;
          nextVoted = null;
        } else if (inc.voted === null) {
          voteDiff = direction === 'up' ? 1 : -1;
        } else {
          voteDiff = direction === 'up' ? 2 : -2;
        }

        const nextVotes = inc.votes + voteDiff;
        const updated = { ...inc, votes: nextVotes, voted: nextVoted };
        
        // Update selected view instantly if active
        if (selectedIncident && selectedIncident.id === incidentId) {
          setSelectedIncident(updated);
        }
        
        return updated;
      }
      return inc;
    }));

    showToast(direction === 'up' ? "¡Gracias por validar la información!" : "Reportado como inoperante u obsoleto.");
  };

  // Add real comments inside details screen
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedIncident) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      user: 'Elena (Tú)',
      timeAgo: 'Hace 1 s',
      text: commentInput.trim(),
      verified: true,
      level: 'Miembro activo'
    };

    const updatedIncidents = incidents.map(inc => {
      if (inc.id === selectedIncident.id) {
        const next = { ...inc, comments: [newComment, ...inc.comments] };
        setSelectedIncident(next);
        return next;
      }
      return inc;
    });

    setIncidents(updatedIncidents);
    setCommentInput('');
    showToast("Tu comentario ha sido publicado.");
  };

  // Toggle notification alert following
  const handleToggleSubscribe = (id: string) => {
    if (subscribedAlerts.includes(id)) {
      setSubscribedAlerts(subscribedAlerts.filter(x => x !== id));
      showToast("Ya no sigues esta alerta.");
    } else {
      setSubscribedAlerts([...subscribedAlerts, id]);
      showToast("Recibirás notificaciones push sobre actualizaciones en tiempo real.");
    }
  };

  // Filter & Search computation
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === 'todos') return matchesSearch;
    return matchesSearch && inc.category === categoryFilter;
  });

  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
    setScreen('detail');
  };

  // Glass Lista / Mapa toggle, reused in list header and over the map
  const renderHomeViewToggle = () => (
    <div className="flex glass-card rounded-full p-0.5 shrink-0">
      <button
        onClick={() => setHomeIncidentView('lista')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
          homeIncidentView === 'lista' ? 'bg-black text-white shadow-sm' : 'text-neutral-600'
        }`}
      >
        <List className="w-3.5 h-3.5" /> Lista
      </button>
      <button
        onClick={() => setHomeIncidentView('mapa')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
          homeIncidentView === 'mapa' ? 'bg-black text-white shadow-sm' : 'text-neutral-600'
        }`}
      >
        <Map className="w-3.5 h-3.5" /> Mapa
      </button>
    </div>
  );

  // Home top bar: greeting, user, avatar and notifications
  const renderHomeTopBar = () => {
    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 12 ? 'Buenos días' : hour >= 12 && hour < 20 ? 'Buenas tardes' : 'Buenas noches';
    return (
      <header className="px-4 pt-5 pb-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3 min-w-0">
          <AvatarPlaceholder name={CURRENT_USER_NAME} className="w-12 h-12" size="lg" />
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 font-medium leading-tight">{greeting},</p>
            <h1 className="text-xl font-extrabold text-black leading-tight truncate">Elena García</h1>
          </div>
        </div>
        <button 
          onClick={() => showToast("No tienes notificaciones nuevas.")}
          title="Notificaciones"
          className="relative w-11 h-11 flex items-center justify-center rounded-full glass-card text-black hover:bg-white/80 transition-colors cursor-pointer active:scale-95 shrink-0"
        >
          <Bell className="w-5 h-5" weight="regular" />
          <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-critical border border-white" />
        </button>
      </header>
    );
  };

  const renderIncidentFilters = () => (
    <>
      <div className="px-4 py-3 bg-background sticky top-0 z-20 flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="¿A dónde vas hoy?" 
            value={searchQuery}
            onFocus={() => { if(searchQuery) showToast("Buscando estaciones y reportes cercanos...") }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs glass-card h-11 pl-10 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black placeholder-neutral-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button 
          onClick={handleRefresh}
          title="Recargar reportes"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-black hover:bg-neutral-800 text-white transition-colors cursor-pointer active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="px-4 py-2 bg-background flex gap-1.5 overflow-x-auto no-scrollbar">
        {CATEGORY_FILTERS.map((cat) => (
          <button 
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold font-sans tracking-wide transition-all duration-200 shrink-0 ${
              categoryFilter === cat.value 
                ? 'bg-black text-white shadow-sm' 
                : 'glass-card text-neutral-700 hover:bg-white/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </>
  );

  // Reusable vertical alert card (home list + fullscreen list view)
  const renderAlertCard = (inc: Incident, options?: { hideImage?: boolean }) => (
    <div 
      key={inc.id}
      onClick={() => handleSelectIncident(inc)}
      className={`bg-white rounded-3xl border hover:border-neutral-300 shadow-[0_6px_24px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col transition-all active:scale-[0.99] cursor-pointer group ${
        newlyCreatedId === inc.id ? 'ring-2 ring-emerald-500 ring-offset-1' : 'border-neutral-100'
      }`}
    >
      {!options?.hideImage && inc.imageUrl && (
        <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
          <img 
            src={inc.imageUrl} 
            alt="Scene report banner" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
            <Camera className="w-2.5 h-2.5 text-amber-400" /> Adjunta
          </div>
        </div>
      )}

      <div className="p-3.5 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 items-center">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white ${
              inc.status === 'critical' ? 'bg-critical/90' : 'bg-warning/90'
            }`}>
              {inc.status === 'critical' ? 'CRÍTICO' : 'RETRASO'}
            </span>
            
            {inc.verified && (
              <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5 text-black" /> Oficial
              </span>
            )}
            {!inc.verified && (
              <span className="bg-neutral-100 text-black border border-neutral-200 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                Comunidad
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" /> {inc.timeAgo}
          </span>
        </div>

        <h4 className="font-extrabold text-black text-sm leading-tight">
          {inc.title}
        </h4>

        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
          {inc.description}
        </p>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-black" />
            {inc.location}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1 focus:outline-none">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-300" /> 
              {inc.comments.length}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200/60">
              <ThumbsUp className={`w-3 h-3 ${inc.voted === 'up' ? 'text-black fill-black/10' : 'text-neutral-300'}`} />
              <span className="text-[10px] font-extrabold text-neutral-600">{inc.votes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sync the focused map incident when the carousel is scrolled
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || filteredIncidents.length === 0) return;
    // card width (256px) + gap (12px)
    const index = Math.round(el.scrollLeft / 268);
    const clamped = Math.max(0, Math.min(index, filteredIncidents.length - 1));
    const inc = filteredIncidents[clamped];
    if (inc && inc.id !== activeCarouselId) {
      setActiveCarouselId(inc.id);
    }
  };

  // Compact horizontal carousel card (overlays the map)
  const renderCarouselCard = (inc: Incident) => {
    const CategoryIcon =
      inc.category === 'accidente' ? AlertOctagon :
      inc.category === 'seguridad' ? ShieldCheck :
      inc.category === 'congestion' ? Users :
      inc.category === 'retraso' ? Clock : Filter;

    return (
      <button
        key={inc.id}
        onClick={() => handleSelectIncident(inc)}
        className={`snap-center shrink-0 w-64 glass-card bento-card overflow-hidden text-left flex flex-col transition-all active:scale-[0.98] cursor-pointer ${
          activeCarouselId === inc.id ? 'ring-2 ring-black/15 border border-white/80' : 'border border-white/50'
        }`}
      >
        <div className="p-3 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex gap-1.5 items-center">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest text-white ${
                inc.status === 'critical' ? 'bg-critical' : 'bg-warning'
              }`}>
                {inc.status === 'critical' ? 'CRÍTICO' : 'RETRASO'}
              </span>
              <span className="bg-neutral-100 text-black border border-neutral-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {inc.verified ? 'Oficial' : 'Comunidad'}
              </span>
            </div>
            <span className="text-[9px] text-neutral-400 font-bold flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" /> {inc.timeAgo}
            </span>
          </div>
          <h4 className="font-extrabold text-black text-xs leading-tight line-clamp-1">{inc.title}</h4>
          <p className="text-[10px] text-neutral-400 font-bold flex items-center gap-1 mt-0.5 line-clamp-1">
            <MapPin className="w-3 h-3 text-black shrink-0" /> {inc.location}
          </p>
        </div>

        <div className="mx-3 h-24 rounded-2xl overflow-hidden relative bg-white/40">
          {inc.imageUrl ? (
            <img 
              src={inc.imageUrl} 
              alt="Incident preview" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              inc.status === 'critical' ? 'bg-critical/10 text-critical' : 'bg-white/50 text-black'
            }`}>
              <CategoryIcon className="w-9 h-9" />
            </div>
          )}
        </div>

        <div className="px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-500 font-bold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-400" /> {inc.comments.length}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/60 border border-white/70">
              <ThumbsUp className={`w-3 h-3 ${inc.voted === 'up' ? 'text-black' : 'text-neutral-400'}`} />
              <span className="text-[10px] font-extrabold text-neutral-700">{inc.votes}</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-black uppercase tracking-wide flex items-center gap-0.5">
            Detalle <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen text-slate-800 bg-background flex flex-col max-w-md mx-auto relative border-x border-slate-200/50 shadow-2xl overflow-hidden font-sans">
      
      {/* Toast Notification Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 12, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm glass-surface-dark text-white text-xs px-4 py-3 rounded-2xl flex items-center gap-3"
          >
            <div className="p-1 rounded-full bg-amber-500/10 text-amber-500">
              <TriangleAlert className="w-4 h-4" />
            </div>
            <p className="flex-1 text-slate-100 font-medium">{toast}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global simulated loading indicator */}
      {isLoading && permissionsAcknowledged && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-success animate-pulse z-50" />
      )}

      {!permissionsAcknowledged ? (
        <PermissionsScreen
          value={permissions}
          onChange={setPermissions}
          onContinue={() => setPermissionsAcknowledged(true)}
        />
      ) : (
        <>
      {/* RENDER SCREENS */}

      {/* SCREEN 1: Home View — immersive map */}
      {screen === 'home' && activeTab === 'home' && homeIncidentView === 'mapa' && (
        <div className="relative flex-1 min-h-0 flex flex-col">
          <IncidentHeatMap
            incidents={filteredIncidents}
            isLoading={isLoading}
            newlyCreatedId={newlyCreatedId}
            onSelectIncident={handleSelectIncident}
            activeIncidentId={activeCarouselId}
            showCompass={false}
            fullscreen
            className="flex-1 min-h-0 border-b-0"
          />

          {/* Floating top: avatar + category pills + view toggle */}
          <div className="absolute top-0 inset-x-0 z-[1000] px-3 pt-4 pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-2">
              <GlassPillBar
                categories={CATEGORY_FILTERS.map((c) => ({ label: c.label, value: c.value }))}
                activeValue={categoryFilter}
                onSelect={(v) => setCategoryFilter(v as 'todos' | IncidentCategory)}
                leading={
                  <AvatarPlaceholder name={CURRENT_USER_NAME} className="w-11 h-11 border-2 border-white/80 shadow-md" size="md" />
                }
              />
              <div className="flex justify-end">{renderHomeViewToggle()}</div>
            </div>
          </div>

          {/* GPS Active badge */}
          <div className="absolute top-[7.5rem] right-3 z-[1000] glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wide">GPS activo</span>
          </div>

          {/* Floating bottom stack: FAB above the incident cards, cards above the nav */}
          <div className="absolute bottom-0 inset-x-0 z-[1000] pb-24 pointer-events-none">
            {/* FAB — sits above the cards, aligned to the app's right edge */}
            <div className="px-4 flex justify-end mb-3">
              <button
                onClick={startReporting}
                className="pointer-events-auto bg-black hover:bg-neutral-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_12px_34px_rgba(0,0,0,0.32)] active:scale-95 hover:scale-105 transition-all cursor-pointer"
                title="Reportar incidencia"
              >
                <Plus className="w-6 h-6" weight="bold" />
              </button>
            </div>

            {/* Incident cards carousel */}
            {filteredIncidents.length === 0 ? (
              <div className="px-3 pointer-events-auto">
                <div className="glass-card bento-card px-4 py-3 text-center">
                  <p className="text-xs font-extrabold text-neutral-700">Camino despejado</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">No hay incidencias con los filtros actuales.</p>
                </div>
              </div>
            ) : (
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-3 pointer-events-auto"
              >
                {filteredIncidents.map((inc) => renderCarouselCard(inc))}
                <div className="shrink-0 w-1" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 1: Home View — list (stacked deck) */}
      {screen === 'home' && activeTab === 'home' && homeIncidentView === 'lista' && (
        <div className="flex flex-col flex-1 min-h-0">
          {renderHomeTopBar()}
          {renderIncidentFilters()}

          {/* Incidents section header with Lista / Mapa toggle */}
          <div className="px-4 py-3 flex justify-between items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BadgeAlert className="w-4.5 h-4.5 text-black shrink-0" />
              <h3 className="font-bold text-black text-xs uppercase tracking-wide truncate">Incidencias ({filteredIncidents.length})</h3>
            </div>
            {renderHomeViewToggle()}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ZoneMonitoringCard incidents={incidents} />

            {filteredIncidents.length === 0 ? (
              /* EMPTY STATE */
              <div className="py-12 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 bg-neutral-100 text-black rounded-full flex items-center justify-center mb-3 border border-neutral-200/60">
                  <Train className="w-8 h-8 animate-pulse text-black" />
                </div>
                <h4 className="font-bold text-black text-sm mb-1">Camino despejado</h4>
                <p className="text-xs text-neutral-400 max-w-[240px]">
                  No hay incidentes reportados en tu zona ahora mismo. ¡Excelente viaje, Elena!
                </p>
              </div>
            ) : (
              <StackedIncidentCards
                incidents={filteredIncidents}
                onSelect={handleSelectIncident}
                newlyCreatedId={newlyCreatedId}
              />
            )}

            {/* Safe space padding for floating nav + FAB */}
            <div className="h-28" />
          </div>

          {/* FAB above the floating nav — constrained to the app's centered width */}
          <div className="fixed inset-x-0 bottom-24 z-[1100] max-w-md mx-auto px-4 flex justify-end pointer-events-none">
            <button
              onClick={startReporting}
              className="pointer-events-auto bg-black hover:bg-neutral-800 text-white px-5 py-3.5 rounded-full flex items-center gap-2 shadow-[0_12px_34px_rgba(0,0,0,0.28)] active:scale-95 hover:scale-105 transition-all cursor-pointer font-extrabold"
            >
              <Plus className="w-5 h-5" weight="bold" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Reportar incidencia</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN: Fullscreen Heatmap View */}
      {screen === 'heatmap' && (
        <div className="flex flex-col flex-1 min-h-0 bg-background">
          {/* Top bar: user profile + settings */}
          <header className="h-16 border-b border-slate-100 flex items-center px-3 justify-between bg-white z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <button 
                onClick={() => setScreen('home')}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-800 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <AvatarPlaceholder name={CURRENT_USER_NAME} className="w-10 h-10" size="md" />
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-800 leading-tight truncate">Elena García</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Mapa social en vivo</p>
              </div>
            </div>
            <button 
              onClick={() => showToast("Los ajustes estarán disponibles próximamente.")}
              title="Ajustes"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95 shrink-0"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </header>

          {/* Search bar + view toggle */}
          <div className="px-3 py-3 bg-white border-b border-slate-100 flex flex-col gap-2.5 z-20">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar línea, estación o incidencia..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-100 h-10 pl-9 pr-8 rounded-full border border-slate-200 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-all font-medium text-slate-800 placeholder-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button 
                onClick={handleRefresh}
                title="Recargar reportes"
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {CATEGORY_FILTERS.map((cat) => (
                  <button 
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                      categoryFilter === cat.value 
                        ? 'bg-primary text-white shadow-sm ring-2 ring-primary/10' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200 shrink-0">
                <button 
                  onClick={() => setMapViewMode('mapa')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    mapViewMode === 'mapa' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" /> Mapa
                </button>
                <button 
                  onClick={() => setMapViewMode('lista')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    mapViewMode === 'lista' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Lista
                </button>
              </div>
            </div>
          </div>

          {/* Body: map (with carousel) or vertical list */}
          {mapViewMode === 'mapa' ? (
            <div className="relative flex-1 min-h-0 flex flex-col">
              <IncidentHeatMap
                incidents={filteredIncidents}
                isLoading={isLoading}
                newlyCreatedId={newlyCreatedId}
                onSelectIncident={handleSelectIncident}
                activeIncidentId={activeCarouselId}
                showCompass={false}
                fullscreen
                className="border-b-0 flex-1 min-h-0"
              />

              {/* GPS Active badge (top-right) */}
              <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wide">GPS activo</span>
              </div>

              {/* Bottom overlay: legend + horizontal carousel */}
              <div className="absolute bottom-0 inset-x-0 z-[1000] pointer-events-none">
                <div className="px-3 flex justify-center">
                  <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full border border-slate-200 shadow-sm px-3 py-1.5 flex gap-3 overflow-x-auto no-scrollbar max-w-full mb-2.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Leyenda:</span>
                    {MAP_LEGEND.map((item) => (
                      <span key={item.label} className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                        <span className="text-[9px] font-bold text-slate-600 whitespace-nowrap">{item.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {filteredIncidents.length === 0 ? (
                  <div className="px-3 pb-3 pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl px-4 py-3 text-center">
                      <p className="text-xs font-extrabold text-slate-700">Camino despejado</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">No hay incidencias con los filtros actuales.</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={carouselRef}
                    onScroll={handleCarouselScroll}
                    className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-3 pb-3 pointer-events-auto"
                  >
                    {filteredIncidents.map((inc) => renderCarouselCard(inc))}
                    <div className="shrink-0 w-1" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 bg-slate-50">
              <div className="flex justify-between items-center pb-1">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Incidencias activas</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{filteredIncidents.length} resultados</span>
              </div>
              {filteredIncidents.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center px-6">
                  <div className="w-16 h-16 bg-neutral-100 text-black rounded-full flex items-center justify-center mb-3 border border-neutral-200/60">
                    <Train className="w-8 h-8 animate-pulse text-black" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Camino despejado</h4>
                  <p className="text-xs text-slate-400 max-w-[240px]">
                    No hay incidentes con los filtros actuales. ¡Buen viaje, Elena!
                  </p>
                </div>
              ) : (
                filteredIncidents.map((inc) => renderAlertCard(inc))
              )}
              <div className="h-4" />
            </div>
          )}
        </div>
      )}

      {/* SCREEN 2: Category Selector */}
      {screen === 'select-category' && (
        <div className="flex flex-col flex-1 bg-white animate-in slide-in-from-right duration-250">
          {/* Header */}
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setScreen('home')}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Reportar incidente</h2>
            </div>
            <div className="w-9" />
          </header>

          <main className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <h3 className="font-extrabold text-lg text-slate-900 leading-snug mb-1">¿Qué está pasando?</h3>
              <p className="text-xs text-slate-400">
                Selecciona la categoría que mejor describa el incidente para alertar y guiar a otros viajeros en tiempo real.
              </p>
            </div>

            {/* Bento Categories Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: 'retraso',
                  title: 'Retraso',
                  desc: 'Demoras en la línea o estación.',
                  icon: Clock,
                  color: 'bg-amber-500/10 text-amber-500'
                },
                {
                  id: 'congestion',
                  title: 'Congestión',
                  desc: 'Demasiada gente, flujo de tránsito lento.',
                  icon: Users,
                  color: 'bg-neutral-200/60 text-black'
                },
                {
                  id: 'seguridad',
                  title: 'Seguridad',
                  desc: 'Asaltos, altercados o riesgos directos.',
                  icon: ShieldCheck,
                  color: 'bg-rose-500/10 text-rose-500'
                },
                {
                  id: 'accidente',
                  title: 'Accidente',
                  desc: 'Colisiones, fallas de tren o percances médicos.',
                  icon: AlertOctagon,
                  color: 'bg-rose-500/10 text-rose-500'
                }
              ].map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id as IncidentCategory)}
                    className={`flex flex-col items-start p-4 bg-slate-50/80 rounded-xl border text-left transition-all group cursor-pointer ${
                      isSelected 
                        ? 'border-primary ring-2 ring-primary/10 bg-primary/5' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">{cat.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">{cat.desc}</span>
                  </button>
                );
              })}

              {/* Obras Full Width Option */}
              <button
                onClick={() => handleSelectCategory('obras')}
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
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Obras y mantenimiento</span>
                  <span className="text-[10px] text-slate-400 block font-medium leading-relaxed">Cierres de estaciones de transbordo o reparaciones anuales programadas.</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Context location block indicator */}
            <div className="mt-6 rounded-xl overflow-hidden relative h-36 border border-slate-200">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf05t9lvmz-6upbcGItMLIUr20rwA5M-pdLN54_BPfF7uvWCNnFa2e6hOgo8s7XY7zKP2Mr0JMKalodt2vRQtEgLzWNpnEd8anod32VHdlxRqZ7J6Fu_Ldf65e70n8Zyg7SPyRVBUQwBbqOQ9GT-Mg_RJ3yzjWMSeOEXCHapHZmH7IZp1bNk7YKWHOqpkHYtVlRgqcl6V1l9fZEcbfR7-D8yXvHSFhbPZz_6BkuP26cWF8mGiC-xjor6Psd8GbaSHldDzER5X-Hj4" 
                alt="Context transit map shadow" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-3.5">
                <span className="text-white text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" /> Ubicación actual detectada (Puerta del Sol)
                </span>
              </div>
            </div>
          </main>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-100 bg-white flex gap-3 sticky bottom-0">
            <button 
              onClick={() => { setScreen('home'); setSelectedCategory(null); }}
              className="flex-1 h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95"
            >
              Cancelar
            </button>
            <button 
              onClick={proceedToForm}
              disabled={!selectedCategory}
              className={`flex-grow h-11 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                selectedCategory 
                  ? 'bg-primary hover:bg-primary-container shadow-md cursor-pointer' 
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: Quick Report Form */}
      {screen === 'report-form' && (
        <div className="flex flex-col flex-1 bg-white animate-in slide-in-from-right duration-250">
          {/* Header */}
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setScreen('select-category')}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Detalles de alerta</h2>
            </div>
            <div className="w-9" />
          </header>

          <main className="flex-1 px-4 py-5 overflow-y-auto space-y-5">
            <div className="p-3.5 rounded-xl bg-primary-container/10 border border-primary-container/20 flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center flex-shrink-0">
                {selectedCategory === 'accidente' && <AlertOctagon className="w-5 h-5" />}
                {selectedCategory === 'seguridad' && <ShieldCheck className="w-5 h-5" />}
                {selectedCategory === 'congestion' && <Users className="w-5 h-5" />}
                {selectedCategory === 'retraso' && <Clock className="w-5 h-5" />}
                {selectedCategory === 'obras' && <Filter className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Categoría de reporte</span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedCategory === 'retraso' ? 'Retrasos / demoras habituales' : 
                   selectedCategory === 'congestion' ? 'Flujo de congestión alta' :
                   selectedCategory === 'seguridad' ? 'Problemas de seguridad ciudadana' :
                   selectedCategory === 'accidente' ? 'Accidentes / retención en vía' : 'Obras técnicas de mantenimiento'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              {/* Line Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Línea o transporte afectado *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Línea 2, Autobús 150, Cercanías C3"
                  value={reportLine}
                  onChange={(e) => setReportLine(e.target.value)}
                  className="w-full text-xs bg-slate-50 h-11 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 font-medium"
                />
              </div>

              {/* Station Detection Indicator */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Estación / parada o tramo</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                  <input 
                    type="text" 
                    placeholder="Estación Puerta del Sol"
                    value={reportStation}
                    onChange={(e) => setReportStation(e.target.value)}
                    className="w-full text-xs bg-slate-50 h-11 pl-10 pr-3.5 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-700"
                  />
                </div>
                <span className="text-[9px] text-emerald-500 font-semibold block mt-1">✓ Confirmado mediante GPS del dispositivo</span>
              </div>

              {/* Comment text box */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Comentario o reporte breve *(mínimo 10 car.)</label>
                <textarea 
                  rows={3}
                  required
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Explica qué ocurre para ayudar a Elena u otros conmutadores con su ruta (ej: Trenes parados en túnel)..."
                  className="w-full text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 font-medium"
                ></textarea>
              </div>

              {/* Visual simulated photo uploader */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Evidencia visual (comunidad)</label>
                
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
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-slate-950/80 backdrop-blur-sm rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2 px-3">
                      <span className="text-[9px] text-white/90 font-bold block">✓ Evidencia cargada exitosamente</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="w-full py-5 border-2 border-dashed border-slate-200 hover:border-primary rounded-lg flex flex-col items-center justify-center bg-slate-50/50 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <Camera className="w-5.5 h-5.5 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700 block">Fotografiar / adjuntar evidencia</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Captura real para validación instantánea</span>
                  </button>
                )}
              </div>
            </form>
          </main>

          {/* Form Action Footer */}
          <div className="p-4 border-t border-slate-100 bg-white flex gap-3 sticky bottom-0">
            <button 
              onClick={() => setScreen('select-category')}
              className="flex-1 h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95"
            >
              Atrás
            </button>
            <button 
              onClick={handleSubmitReport}
              disabled={reportLine.trim().length === 0 || reportComment.trim().length === 0}
              className={`flex-grow h-11 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                reportLine.trim() && reportComment.trim()
                  ? 'bg-primary hover:bg-primary-container shadow-md cursor-pointer' 
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              Enviar reporte ciudadano
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: Confirmation, Rewards & Ad Unit */}
      {screen === 'success' && (
        <div className="flex flex-col flex-1 bg-white animate-in zoom-in-95 duration-350 relative overflow-hidden">
          {/* Confetti canvas items simulation */}
          {confetti.map((c) => (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                borderRadius: c.id % 3 === 0 ? '50%' : '2px',
                transform: `rotate(${c.id * 15}deg)`,
                opacity: 0.8,
                animation: `fall 3.2s linear infinite`,
                animationDelay: `${c.delay}s`
              }}
              className="pointer-events-none"
            />
          ))}

          {/* Inline unique animation inject for floating confetti */}
          <style>{`
            @keyframes fall {
              0% { top: -5%; transform: translateY(0) rotate(0deg); }
              100% { top: 105%; transform: translateY(100vh) rotate(360deg); }
            }
          `}</style>
          
          <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative overflow-y-auto">
            <UndrawIllustration name="winners" className="max-w-[16rem] mb-4" style={{ maxHeight: '10rem' }} />

            <h1 className="font-extrabold text-xl text-primary text-center mb-1 leading-snug">¡Gracias por ayudar!</h1>
            <p className="text-xs text-slate-400 text-center max-w-[280px] mb-6">
              Tu reporte ya está alertando y orientando a otros conmutadores de la zona en tiempo real.
            </p>

            {/* Gamification Widget: Community impact card */}
            <div className="w-full border border-slate-200/80 rounded-xl p-4 shadow-sm mb-6 flex gap-3.5 items-center bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-white flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5.5 h-5.5 text-amber-300" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Indicador de impacto</p>
                <div className="flex items-baseline gap-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs text-on-surface">Ganaste</h4>
                  <span className="text-primary font-bold text-xs">+15 puntos</span>
                </div>
                <span className="text-[9px] text-slate-400 block font-medium">Nivel 1: Observador urbano ({userPoints} pts)</span>
              </div>
              <div className="flex -space-x-2">
                <AvatarPlaceholder name={CURRENT_USER_NAME} className="w-7 h-7 border-2 border-white" size="sm" />
                <div className="w-7 h-7 rounded-full border-2 border-white bg-primary-container/20 text-primary-container flex items-center justify-center text-[8px] font-bold">
                  +4
                </div>
              </div>
            </div>

            {/* Contextual Ad Unit - Eco Coffee Shop */}
            <div className="w-full border border-slate-200/80 rounded-xl overflow-hidden shadow-sm relative group bg-white">
              <div className="h-32 w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAay0jyYiIdPm93c3IL5ZELc5lf_xfMPLic2Oqs1zqfpUaun07K48HKI4MWDKnZSHNNvdWnUn3jQP02xKDOWdr3jMLY9STdoiNgyF_rH2gvKfTz7okeM0i8frE-YuMBZCQW7S2k_j2yXgmIL8OUqB-vUpQs4UJfasJQjL5CallSDIiSN-f7klntIXsrJUYiESa2AklCy35lXOShruqqJdNJ1xscwDmTqQy5QZq0FRQh26MKGVufX-wKb2c0vLP7FvCKizVBZyKHvc" 
                  alt="Organic Coffee Cup on counter" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Patrocinado</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-2xs">
                    <Sparkles className="w-3 h-3 text-amber-500" /> 4.8 estaciones
                  </div>
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 leading-tight">La espera es mejor con un café</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reclama un cupón de café <strong className="text-primary font-bold">2x1</strong> en la cafetería ecológica ubicada en esta misma estación.
                </p>
                
                <button 
                  onClick={() => {
                    setIsCouponRedeemed(!isCouponRedeemed);
                    showToast(isCouponRedeemed ? "Cupón reintegrado." : "¡Código QR generado! Preséntalo al cajero.");
                  }}
                  className={`w-full h-10 mt-3.5 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                    isCouponRedeemed 
                      ? 'bg-slate-100 border border-slate-300 text-slate-500' 
                      : 'bg-primary text-white shadow-md'
                  }`}
                >
                  <Coffee className="w-4.5 h-4.5" />
                  {isCouponRedeemed ? 'Código QR canjeado' : 'Obtener cupón de café'}
                </button>

                {isCouponRedeemed && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-center">
                    <p className="text-[10px] text-slate-400 font-mono mb-1">CÓDIGO DE COPÓN: TRACEMAP-COFFEE-SOL</p>
                    <div className="h-6 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_6px)] w-2/3 mx-auto opacity-70" />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Navigation Action Area */}
          <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 text-center">
            <button 
              onClick={() => {
                setScreen('home');
                setNewlyCreatedId(null);
                setSelectedCategory(null);
              }}
              className="w-full h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
            >
              <Map className="w-4 h-4 text-primary" /> Volver al mapa social
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: Incident Detail Community Discussion View */}
      {screen === 'detail' && selectedIncident && (
        <div className="flex flex-col flex-1 bg-white animate-in slide-in-from-right duration-250">
          {/* Header */}
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setScreen('home')}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Detalle del incidente</h2>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard?.writeText?.(`${selectedIncident.title} en ${selectedIncident.location}`);
                showToast("¡Link del incidente copiado al portapapeles!");
              }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto">
            {/* Minimap Position Marker banner */}
            <section className="relative h-44 bg-slate-100 border-b border-slate-200">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWdYUgAjQBF4zHqudKowXm2iymN3BPrybHylaoV-H44yPRfRA-xnRv0hu1f7vTRnOk6HvRaJh2OeAnh3LBrhkSF84G047tMhsJNyoDiVb5Ctpk2PruwWtyl_dtxpMzs3XctWzZcNyWNuS570_MipxDgZVS2OhdAiWV79UvqZiyjFvfNqRq8i7enzaXgkmCtwZX7B0ED2T7pCNdguz-Osd_htzHxAThGJ4d7MsOGedjbyUXRxV2TfJUq5m979ePBpo-u-K5f-RC0Ew"
                alt="Mini location map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-95"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500/30 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-rose-500/20 border border-rose-500 flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white shadow-md"></span>
                  </span>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-slate-200/50">
                <p className="text-[10px] text-slate-700 font-bold flex items-center gap-1 inline-block">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 inline" />
                  {selectedIncident.location.split('(')[0].trim()}
                </p>
              </div>
            </section>

            {/* Incident Title Card */}
            <section className="p-4 border-b border-slate-100 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide text-white ${
                      selectedIncident.status === 'critical' ? 'bg-critical' : 'bg-warning'
                    }`}>
                      {selectedIncident.status === 'critical' ? 'CRÍTICO' : 'RETRASO'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{selectedIncident.timeAgo}</span>
                  </div>
                  <h2 className="font-extrabold text-slate-900 text-lg leading-tight">{selectedIncident.title}</h2>
                </div>
                
                <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 text-primary">
                  {selectedIncident.category === 'accidente' ? <AlertOctagon className="w-6 h-6 text-critical" /> :
                   selectedIncident.category === 'seguridad' ? <ShieldCheck className="w-6 h-6 text-critical" /> :
                   selectedIncident.category === 'congestion' ? <Users className="w-6 h-6 text-black" /> :
                   selectedIncident.category === 'retraso' ? <Clock className="w-6 h-6 text-amber-500" /> : <Filter className="w-6 h-6 text-black" />}
                </div>
              </div>

              {/* Verified Badge and stats */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden text-slate-600 flex items-center justify-center font-bold">
                  {selectedIncident.verified ? <ShieldCheck className="w-5 h-5 text-black" /> : <User className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-extrabold text-[11px] text-slate-800">
                      {selectedIncident.verified ? 'Servicio de tránsito oficial' : 'Informante verificado'}
                    </p>
                    <span className="text-black"><CheckCircle className="w-3.5 h-3.5 fill-black text-white" /></span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">Nivel 4 · Experto en rutas metropolitanas</p>
                </div>
              </div>

              {/* Description comment */}
              <div className="space-y-1">
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/40">
                  {selectedIncident.description}
                </p>
              </div>
            </section>

            {/* Validation feedback block: ¿Sigue ocurriendo? */}
            <section className="p-4 bg-slate-50/50 border-b border-slate-100 space-y-3.5">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider text-center">¿Sigue transcurriendo?</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleVote(selectedIncident.id, 'up')}
                  className={`flex-1 p-3.5 rounded-xl border-2 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    selectedIncident.voted === 'up' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <ThumbsUp className={`w-5.5 h-5.5 ${selectedIncident.voted === 'up' ? 'fill-primary/15' : ''}`} />
                  <span className="text-2xs font-extrabold uppercase tracking-wider">Sí, sigue igual</span>
                </button>

                <button 
                  onClick={() => handleVote(selectedIncident.id, 'down')}
                  className={`flex-1 p-3.5 rounded-xl border-2 hover:bg-rose-50/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    selectedIncident.voted === 'down' 
                      ? 'border-rose-500 bg-rose-50 text-rose-600' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-5.5 h-5.5" />
                  <span className="text-2xs font-extrabold uppercase tracking-wider text-secondary">No, ya se despejó</span>
                </button>
              </div>

              {/* Impact score footer details */}
              <div className="flex items-center justify-center gap-2 bg-slate-200/50 py-2 rounded-full">
                <div className="flex -space-x-1.5">
                  <div className="w-5.5 h-5.5 rounded-full border border-white bg-neutral-200 flex items-center justify-center text-[8px] font-bold">JD</div>
                  <div className="w-5.5 h-5.5 rounded-full border border-white bg-green-100 flex items-center justify-center text-[8px] font-bold">AL</div>
                  <div className="w-5.5 h-5.5 rounded-full border border-white bg-purple-100 flex items-center justify-center text-[8px] font-bold">MS</div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  <strong className="text-slate-800">{selectedIncident.votes} personas</strong> validaron este reporte en tránsito
                </p>
              </div>
            </section>

            {/* Live Comments Feed Section */}
            <section className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Comentarios recientes ({selectedIncident.comments.length})</h3>
                <span className="text-[10px] text-primary font-bold">Comunidad activa</span>
              </div>

              <div className="space-y-3.5">
                {selectedIncident.comments.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-4">No hay comentarios en este reporte todavía. Sé el primero en opinar.</p>
                ) : (
                  selectedIncident.comments.map((comm) => (
                    <div key={comm.id} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {comm.user.charAt(0)}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-200/60 flex-1">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-2xs font-extrabold text-slate-700">
                            {comm.user} <span className="text-slate-400 font-normal"> · {comm.level || 'Viajero'}</span>
                          </p>
                          <span className="text-[9px] text-slate-400">{comm.timeAgo}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{comm.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Input comment */}
              <form onSubmit={handleAddComment} className="mt-4 flex items-center gap-2 bg-slate-100 rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/10">
                <input 
                  type="text" 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
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

            {/* Detail Sheet primary operations */}
            <div className="p-4 space-y-3.5">
              <button 
                onClick={() => handleToggleSubscribe(selectedIncident.id)}
                className={`w-full h-11 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                  subscribedAlerts.includes(selectedIncident.id)
                    ? 'bg-slate-100 border border-slate-300 text-slate-500'
                    : 'bg-primary text-white hover:bg-primary-container'
                }`}
              >
                {subscribedAlerts.includes(selectedIncident.id) ? (
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
                onClick={() => setScreen('home')}
                className="w-full h-11 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors active:scale-95 shadow-2xs"
              >
                Volver al inicio
              </button>
            </div>
            
            <div className="h-8" />
          </main>
        </div>
      )}


      {/* OTHER TABS RENDER */}

      {/* TAB 2: Mis Rutas view */}
      {activeTab === 'rutas' && screen === 'home' && (
        <div className="flex flex-col flex-grow bg-background animate-in fade-in duration-200">
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Mis trayectos</h2>
            <button 
              onClick={() => showToast("Trayecto rápido configurado. Recibirás alertas antes de iniciar.")}
              className="p-1.5 px-3 bg-primary/5 text-primary hover:bg-primary/10 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              + Nueva ruta
            </button>
          </header>

          <main className="p-4 pb-28 flex-1 overflow-y-auto space-y-5">
            {/* Elena Route Intro */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-950">Trayectos diarios de Elena</h3>
              <p className="text-xs text-slate-400">Administra tus recorridos regulares para recibir avisos automáticos y optimizar tu tiempo de traslado.</p>
            </div>

            {/* List of custom routes with statuses */}
            <div className="space-y-3.5">
              {[
                {
                  id: 'r1',
                  name: 'Trabajo (mañana)',
                  origin: 'Estación Sol',
                  dest: 'Nuevos Ministerios',
                  lines: 'Línea 1, Línea 10',
                  delay: true,
                  delayTitle: 'Retraso de 10 min en transbordo',
                  time: '08:30'
                },
                {
                  id: 'r2',
                  name: 'Universidad (tarde)',
                  origin: 'Estación Sol',
                  dest: 'Ciudad Universitaria',
                  lines: 'Línea 2, Línea 6',
                  delay: false,
                  delayTitle: 'Todo despejado en tu ruta actual',
                  time: '15:15'
                },
                {
                  id: 'r3',
                  name: 'Gimnasio (finde)',
                  origin: 'Atocha',
                  dest: 'Plaza de Castilla',
                  lines: 'Autobús 150',
                  delay: false,
                  delayTitle: 'Todo despejado en tu ruta actual',
                  time: '11:00'
                }
              ].map((route) => (
                <div 
                  key={route.id}
                  className={`p-4 bento-card glass-card flex gap-3 transition-all ${
                    route.delay ? 'ring-1 ring-amber-300/60' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    route.delay ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Train className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">{route.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{route.time}</span>
                    </div>
                    <p className="text-2xs text-slate-400 font-bold block">
                      {route.origin} → {route.dest}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Líneas habituales: {route.lines}</p>

                    <div className={`mt-2 flex items-center gap-1.5 text-2xs font-extrabold ${
                      route.delay ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${route.delay ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                      {route.delayTitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Commute Alert Configuration Banner */}
            <div className="p-4 rounded-xl bg-primary-container/10 border border-primary-container/20 space-y-2">
              <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /> Torre de control inteligente
              </h4>
              <p className="text-2xs text-slate-500 leading-relaxed font-semibold">
                TraceMap analiza los reportes oficiales y de la comunidad de tus trayectos antes de que salgas de casa, enviando notificaciones para cambiar de ruta antes de quedar atrapada.
              </p>
            </div>
          </main>
        </div>
      )}

      {/* TAB 3: Comunidad feed */}
      {activeTab === 'comunidad' && screen === 'home' && (
        <div className="flex flex-col flex-grow bg-background animate-in fade-in duration-200">
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Comunidad social</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase">TraceMap activo</span>
          </header>

          <main className="p-4 pb-28 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-950">Movilidad social colaborativa</h3>
              <p className="text-xs text-slate-400 font-semibold text-slate-500">Democratizando las vías de transporte público con información de primera mano.</p>
            </div>

            {/* Leaderboard list of citizens with levels */}
            <section className="space-y-3.5">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest block">Líderes de impacto de la semana</h4>
              
              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Juan Carlos (verificado)', pts: 1250, badge: 'Experto maestro', level: 'Nivel 5' },
                  { rank: 2, name: 'Carlos Ruiz', pts: 890, badge: 'Veterano urbano', level: 'Nivel 4' },
                  { rank: 'Tú', name: 'Elena García (Tú)', pts: userPoints, badge: 'Observador frecuente', level: 'Nivel 1' },
                  { rank: 3, name: 'Marta Gómez', pts: 420, badge: 'Colaborador Sol', level: 'Nivel 1' }
                ].map((user) => (
                  <div 
                    key={user.name}
                    className={`p-3 bento-card glass-card flex justify-between items-center ${
                      user.rank === 'Tú' ? 'ring-2 ring-black/15' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-xs font-bold text-slate-400">{typeof user.rank === 'number' ? `#${user.rank}` : user.rank}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800 leading-tight">{user.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold block">{user.badge} · {user.level}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary">{user.pts} pts</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Global discussion feed */}
            <section className="space-y-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest block">Discusión comunitaria de Madrid</h4>
              
              <div className="space-y-3">
                {[
                  {
                    author: 'Javi Delgado',
                    time: 'Hace 30 min',
                    msg: '¿Cómo va la línea 1 de Metro en Sol? ¿Están funcionando las escaleras mecánicas del vestíbulo?',
                    replies: 4
                  },
                  {
                    author: 'Sonia Ruiz',
                    time: 'Hace 2 horas',
                    msg: 'Aviso: Los autobuses de la línea 150 están tardando el doble hoy por cortes en Castellana. Busquen alternativas.',
                    replies: 8
                  }
                ].map((disc, idx) => (
                  <div key={idx} className="p-4 bento-card glass-card space-y-2">
                    <div className="flex justify-between items-center text-2xs">
                      <span className="font-extrabold text-slate-600">{disc.author}</span>
                      <span className="text-slate-400">{disc.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{disc.msg}</p>
                    <div className="flex items-center gap-1.5 text-2xs text-primary font-bold pt-1 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> Ver {disc.replies} respuestas comunitarias
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* TAB 4: Perfil account statistics */}
      {activeTab === 'perfil' && screen === 'home' && (
        <div className="flex flex-col flex-grow bg-background animate-in fade-in duration-200">
          <header className="h-14 flex items-center px-4 justify-between sticky top-0 glass-surface border-b border-white/40 z-10">
            <h2 className="font-extrabold text-sm text-primary uppercase tracking-wide">Mi perfil</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Elena G.</span>
          </header>

          <main className="p-4 pb-28 flex-1 overflow-y-auto space-y-5">
            {/* Elena Core profile avatar card */}
            <section className="p-5 bento-card-lg bg-gradient-to-br from-primary to-primary-container text-white text-center flex flex-col items-center shadow-[0_12px_34px_rgba(0,0,0,0.18)]">
              <AvatarPlaceholder
                name={CURRENT_USER_NAME}
                className="w-16 h-16 border-4 border-white/20 mb-3"
                size="xl"
                variant="onDark"
              />
              <div className="flex items-center gap-1">
                <h3 className="font-extrabold text-base">Elena García</h3>
                <span className="text-white"><ShieldCheck className="w-4.5 h-4.5 text-amber-300 fill-amber-300/20" /></span>
              </div>
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-wide">Nivel 1: Observador urbano activo</p>
              
              {/* Point progress */}
              <div className="w-full mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-300 h-full rounded-full" style={{ width: `${(userPoints / 250) * 100}%` }} />
              </div>
              <div className="w-full mt-1.5 flex justify-between text-[9px] text-neutral-300 font-bold">
                <span>{userPoints} puntos</span>
                <span>250 puntos (siguiente nivel)</span>
              </div>
            </section>

            {/* Contribution Stats summary metrics */}
            <section className="grid grid-cols-3 gap-3">
              {[
                { label: 'Reportes enviados', val: '4', color: 'text-primary' },
                { label: 'Alertas validadas', val: '32', color: 'text-emerald-500' },
                { label: 'Impacto social', val: '+450 personas', color: 'text-rose-500' }
              ].map((m, idx) => (
                <div key={idx} className="p-3 bento-card glass-card text-center">
                  <span className={`text-base font-extrabold block ${m.color}`}>{m.val}</span>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase mt-1 block leading-tight">{m.label}</span>
                </div>
              ))}
            </section>

            {/* Permissions & notifications — editable mock toggles */}
            <section className="space-y-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest block">
                Permisos y notificaciones
              </h4>
              <div className="p-4 bento-card glass-card">
                <PermissionSettingsFields
                  value={permissions}
                  onChange={(next) => {
                    setPermissions(next);
                    showToast('Preferencias de permisos actualizadas.');
                  }}
                />
              </div>
            </section>

            {/* Achievement badges */}
            <section className="space-y-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest block">Insignias obtenidas</h4>
              
              <div className="space-y-2">
                {[
                  { id: 'b1', title: 'Centinela de Sol', desc: 'Reportaste retrasos recurrentes en Puerta del Sol', earned: true },
                  { id: 'b2', title: 'Ciudadano de acero', desc: 'Validaste más de 20 alertas comunitarias', earned: true },
                  { id: 'b3', title: 'Héroe de la hora punta', desc: 'Reportaste una contingencia crítica en tiempo real', earned: false }
                ].map((bg) => (
                  <div key={bg.id} className={`p-3 bento-card glass-card flex gap-3.5 items-center ${
                    bg.earned ? '' : 'opacity-60'
                  }`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      bg.earned ? 'bg-amber-100 text-amber-500' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Trophy className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">{bg.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-tight font-medium">{bg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      )}


      {/* Floating glass navigation bar (hovers over content / map) */}
      {screen === 'home' && (
        <FloatingNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setScreen('home');
          }}
        />
      )}

        </>
      )}

    </div>
  );
}
