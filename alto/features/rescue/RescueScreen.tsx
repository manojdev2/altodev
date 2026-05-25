'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@11labs/react';
import {
  Mic, MicOff, Phone, PhoneOff, Shield, Zap, Truck, Wrench,
  AlertTriangle, CheckCircle, Clock, MapPin, Star, ChevronDown, X,
} from 'lucide-react';
import { LiveRouteMap } from '@/components/maps/LiveRouteMap';
import { useRescueStore } from '@/store/rescueSlice';
import { createRescueRequest, getRescueStatus, cancelRescue } from '@/services/rescueService';
import type { IssueType, Severity } from '@/types/rescue';
import {
  ISSUE_LABELS, ISSUE_ICONS, SEVERITY_COLORS,
  TECHNICIAN_TYPE_LABELS,
} from '@/types/rescue';

/* ── Issue picker options ────────────────────────────────────────────── */
const ISSUE_OPTIONS: { type: IssueType; emoji: string; label: string; color: string }[] = [
  { type: 'battery_dead',    emoji: '🔋', label: 'Battery Dead',     color: '#EF4444' },
  { type: 'charging_failed', emoji: '⚡', label: 'Charging Failed',  color: '#F59E0B' },
  { type: 'motor_issue',     emoji: '⚙️', label: 'Motor Issue',      color: '#8B5CF6' },
  { type: 'overheating',     emoji: '🌡️', label: 'Overheating',      color: '#F97316' },
  { type: 'flat_tyre',       emoji: '🛞', label: 'Flat Tyre',        color: '#6B7280' },
  { type: 'accident',        emoji: '🚨', label: 'Accident',         color: '#DC2626' },
  { type: 'other',           emoji: '🔧', label: 'Other',            color: '#14B8A6' },
];

const SEVERITY_OPTIONS: { value: Severity; label: string; color: string }[] = [
  { value: 'low',      label: 'Minor',    color: '#22C55E' },
  { value: 'medium',   label: 'Moderate', color: '#F59E0B' },
  { value: 'high',     label: 'Serious',  color: '#EF4444' },
  { value: 'critical', label: 'Critical', color: '#7C3AED' },
];

/* ── Waveform animation bars ─────────────────────────────────────────── */
function VoiceWaveform({ active, speaking }: { active: boolean; speaking: boolean }) {
  const bars = [0.4, 0.7, 1, 0.85, 0.6, 0.9, 0.5, 0.75, 0.95, 0.55, 0.8, 0.45];
  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: speaking ? '#16A34A' : active ? '#6C5CE7' : '#D1D5DB' }}
          animate={active ? {
            scaleY: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.3, h],
            transition: { duration: 0.6 + i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 },
          } : { scaleY: 0.15 }}
          initial={{ height: 32, scaleY: 0.15 }}
        />
      ))}
    </div>
  );
}

/* ── Pulsing SOS ring ────────────────────────────────────────────────── */
function SOSPulse() {
  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      {[1, 0.7, 0.45].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ width: 144 * scale, height: 144 * scale, borderColor: `rgba(239,68,68,${0.15 - i * 0.04})` }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-2xl z-10"
        style={{ background: 'linear-gradient(135deg, #0f0b0b, #100d0d)', boxShadow: '0 8px 32px rgba(239,68,68,0.5)' }}
        whileTap={{ scale: 0.93 }}
        animate={{ boxShadow: ['0 8px 32px rgba(233, 218, 218, 0.5)', '0 8px 48px rgba(239,68,68,0.8)', '0 8px 32px rgba(239,68,68,0.5)'] }}
        transition={{ duration: 2, repeat: Infinity }}>
        SOS
      </motion.div>
    </div>
  );
}

/* ── Technician type icon ────────────────────────────────────────────── */
function TechIcon({ type }: { type: string }) {
  if (type === 'towing') return <Truck size={18} className="text-white" />;
  if (type === 'charging_agent') return <Zap size={18} className="text-white" />;
  return <Wrench size={18} className="text-white" />;
}

/* ── ETA ring progress ───────────────────────────────────────────────── */
function ETARing({ progress, etaMins }: { progress: number; etaMins: number }) {
  const r = 44, circ = 2 * Math.PI * r;
  const dash = circ * (1 - Math.min(progress, 1));
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width={112} height={112}>
        <circle cx={56} cy={56} r={r} strokeWidth={6} fill="none" stroke="#F3F4F6" />
        <motion.circle
          cx={56} cy={56} r={r} strokeWidth={6} fill="none"
          stroke="#16A34A" strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-black" style={{ color: '#0F0F1A' }}>{etaMins}</div>
        <div className="text-[10px] text-gray-400 font-medium">min away</div>
      </div>
    </div>
  );
}

/* ── Main screen ─────────────────────────────────────────────────────── */
export function RescueScreen() {
  const {
    phase, rescueData, voiceTranscript,
    selectedIssue, selectedSeverity, userLocation,
    setPhase, setRescueData, updateRescueData,
    setVoiceTranscript, setSelectedIssue, setSelectedSeverity,
    setUserLocation, reset,
  } = useRescueStore();

  const [showIssueSheet, setShowIssueSheet] = useState(false);
  const [dispatchError, setDispatchError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef('');

  /* ── Geolocation ──────────────────────────────────────────────────── */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setUserLocation({ latitude: 12.9716, longitude: 77.5946 }) // Bangalore fallback
    );
  }, [setUserLocation]);

  /* ── ElevenLabs conversational AI ───────────────────────────────── */
  const conversation = useConversation({
    onConnect: () => setPhase('listening'),
    onDisconnect: () => {
      if (phase === 'listening') setShowIssueSheet(true);
    },
    onMessage: ({ message }: { message: string }) => {
      transcriptRef.current = transcriptRef.current ? `${transcriptRef.current}\n${message}` : message;
      setVoiceTranscript(transcriptRef.current);
    },
    onError: () => setPhase('idle'),
  });

  const startVoice = useCallback(async () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId) {
      // No agent configured — skip to issue picker directly
      setPhase('listening');
      setShowIssueSheet(true);
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPhase('listening');
      await conversation.startSession({ agentId });
    } catch {
      setPhase('listening');
      setShowIssueSheet(true);
    }
  }, [conversation, setPhase]);

  const endVoice = useCallback(async () => {
    await conversation.endSession();
    setShowIssueSheet(true);
  }, [conversation]);

  /* ── Dispatch rescue ──────────────────────────────────────────────── */
  const dispatch = useCallback(async () => {
    if (!userLocation) return;
    setShowIssueSheet(false);
    setPhase('submitting');
    setDispatchError('');
    try {
      const data = await createRescueRequest({
        issueType: selectedIssue,
        severity: selectedSeverity,
        voiceTranscript,
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      });
      setRescueData(data);
      startPolling(data.rescueId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not reach rescue service.';
      setDispatchError(msg);
      setPhase('idle');
    }
  }, [userLocation, selectedIssue, selectedSeverity, voiceTranscript, setPhase, setRescueData]);

  /* ── Polling ─────────────────────────────────────────────────────── */
  function startPolling(rescueId: string) {
    pollRef.current = setInterval(async () => {
      try {
        const data = await getRescueStatus(rescueId);
        updateRescueData(data);
        if (data.status === 'arrived' || data.status === 'resolved') {
          clearInterval(pollRef.current!);
        }
      } catch { /* silent — network blip */ }
    }, 5000);
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* ── Cancel ──────────────────────────────────────────────────────── */
  const handleCancel = useCallback(async () => {
    if (!rescueData) { reset(); return; }
    try { await cancelRescue(rescueData.rescueId); } catch { /* ignore */ }
    if (pollRef.current) clearInterval(pollRef.current);
    reset();
  }, [rescueData, reset]);

  /* ── Rescue route waypoints (straight line for now) ─────────────── */
  const rescueRoute = rescueData
    ? {
        waypoints: [
          { lat: rescueData.techLocation.latitude, lng: rescueData.techLocation.longitude },
          { lat: rescueData.userLocation.latitude, lng: rescueData.userLocation.longitude },
        ],
      }
    : null;

  const techLatLng = rescueData
    ? { lat: rescueData.techLocation.latitude, lng: rescueData.techLocation.longitude }
    : null;

  const userLatLng = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : null;

  /* ── Phase: IDLE ─────────────────────────────────────────────────── */
  if (phase === 'idle') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-32"
        style={{ background: 'linear-gradient(160deg, #FFF5F5 0%, #FFFFFF 60%)' }}>

        <motion.div className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <Shield size={14} /> Alto Rescue — 24/7
          </div>

          <h1 className="text-3xl font-black leading-tight" style={{ color: '#0F0F1A' }}>
            Stranded?<br />We've got you.
          </h1>

          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Speak naturally — our AI understands your issue, diagnoses severity, and dispatches
            the nearest EV-certified technician instantly.
          </p>

          {dispatchError && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-100 max-w-xs">
              {dispatchError}
            </div>
          )}

          {/* SOS Button */}
          <motion.button onClick={startVoice} whileTap={{ scale: 0.95 }} className="focus:outline-none">
            <SOSPulse />
          </motion.button>

          <p className="text-xs text-gray-400 mt-2">
            Tap and speak — or tap and select your issue manually
          </p>

          {/* Quick stats */}
          <div className="flex gap-4 mt-4">
            {[
              { icon: Clock, label: '&lt;8 min', sub: 'Avg response' },
              { icon: Shield, label: '24/7', sub: 'Coverage' },
              { icon: Star, label: '4.8★', sub: 'Technicians' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={sub} className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.06)' }}>
                <Icon size={16} style={{ color: '#16A34A' }} />
                <span className="text-sm font-bold" style={{ color: '#0F0F1A' }}
                  dangerouslySetInnerHTML={{ __html: label }} />
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Phase: LISTENING ────────────────────────────────────────────── */
  if (phase === 'listening') {
    const isAgentSpeaking = conversation.isSpeaking;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-32"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FFFFFF 60%)' }}>

        <AnimatePresence>
          {!showIssueSheet && (
            <motion.div className="flex flex-col items-center gap-8 text-center w-full max-w-sm"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>

              {/* Status pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: isAgentSpeaking ? '#F0FDF4' : '#EEF2FF', color: isAgentSpeaking ? '#16A34A' : '#6C5CE7' }}>
                <motion.div className="w-2 h-2 rounded-full"
                  style={{ background: isAgentSpeaking ? '#16A34A' : '#6C5CE7' }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                {isAgentSpeaking ? 'Alto is speaking…' : 'Listening to you…'}
              </div>

              <VoiceWaveform active speaking={isAgentSpeaking} />

              <div>
                <p className="font-bold text-lg" style={{ color: '#0F0F1A' }}>
                  Tell me what happened
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  "My scooter stopped" · "Battery overheating" · "Won't charge"
                </p>
              </div>

              {/* End call button */}
              <motion.button
                onClick={endVoice}
                whileTap={{ scale: 0.93 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#EF4444', boxShadow: '0 6px 24px rgba(239,68,68,0.4)' }}>
                <PhoneOff size={22} className="text-white" />
              </motion.button>

              <p className="text-xs text-gray-400">Tap to end conversation and confirm issue</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Issue picker bottom sheet */}
        <AnimatePresence>
          {showIssueSheet && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col justify-end"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => { setShowIssueSheet(false); setPhase('idle'); }} />
              <motion.div
                className="relative z-10 rounded-t-3xl px-6 pt-5 pb-10"
                style={{ background: '#FFFFFF', boxShadow: '0 -8px 40px rgba(15,15,26,0.12)' }}
                initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}>

                <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
                <h2 className="font-bold text-lg mb-1" style={{ color: '#0F0F1A' }}>Confirm your issue</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Select what's happening so we can dispatch the right help
                </p>

                {/* Issue grid */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {ISSUE_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setSelectedIssue(opt.type)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all border-2"
                      style={{
                        borderColor: selectedIssue === opt.type ? opt.color : 'transparent',
                        background: selectedIssue === opt.type ? `${opt.color}12` : '#F9FAFB',
                      }}>
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-[10px] font-semibold leading-tight text-center"
                        style={{ color: selectedIssue === opt.type ? opt.color : '#6B7280' }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Severity row */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Severity</p>
                <div className="flex gap-2 mb-6">
                  {SEVERITY_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSeverity(s.value)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2"
                      style={{
                        borderColor: selectedSeverity === s.value ? s.color : 'transparent',
                        background: selectedSeverity === s.value ? `${s.color}15` : '#F3F4F6',
                        color: selectedSeverity === s.value ? s.color : '#9CA3AF',
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <motion.button
                  onClick={dispatch}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 20px rgba(239,68,68,0.4)' }}>
                  Dispatch Rescue Now
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ── Phase: SUBMITTING ───────────────────────────────────────────── */
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: '#FFFFFF' }}>
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-t-red-500 border-gray-100"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
        <div className="text-center">
          <p className="font-bold text-lg" style={{ color: '#0F0F1A' }}>Finding nearest technician…</p>
          <p className="text-sm text-gray-400 mt-1">Analyzing {ISSUE_LABELS[selectedIssue].toLowerCase()} severity</p>
        </div>
      </div>
    );
  }

  /* ── Phase: DISPATCHED / EN_ROUTE / ARRIVED ──────────────────────── */
  if (!rescueData) return null;

  const severityColor = SEVERITY_COLORS[rescueData.severity] ?? '#F59E0B';
  const isArrived = phase === 'arrived';
  const mapCenter = userLatLng ?? undefined;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F6FA' }}>

      {/* Map (top 45%) */}
      <div className="relative" style={{ height: '45vh', minHeight: 280 }}>
        <LiveRouteMap
          route={rescueRoute as never}
          mapStyle="silver"
          mapCenter={mapCenter}
          mapZoom={13}
          rescueMode
          technicianLocation={techLatLng ?? undefined}
          userRescueLocation={userLatLng ?? undefined}
        />

        {/* Status badge overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', color: '#0F0F1A', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
            animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <motion.div className="w-2 h-2 rounded-full" style={{ background: isArrived ? '#16A34A' : '#EF4444' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            {isArrived ? 'Technician Arrived!' : phase === 'en_route' ? 'En Route to You' : 'Technician Dispatched'}
          </motion.div>

          <button onClick={handleCancel}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <X size={16} style={{ color: '#6B7280' }} />
          </button>
        </div>
      </div>

      {/* Scrollable detail panel */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 space-y-4">

        {/* Arrived banner */}
        {isArrived && (
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <CheckCircle size={20} style={{ color: '#16A34A' }} />
            <div>
              <p className="font-bold text-sm" style={{ color: '#15803D' }}>Help has arrived!</p>
              <p className="text-xs text-green-600 mt-0.5">{rescueData.technicianName} is at your location</p>
            </div>
          </motion.div>
        )}

        {/* ETA + Technician card */}
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(15,15,26,0.06)' }}>

          <ETARing progress={rescueData.progress ?? 0} etaMins={rescueData.etaMinutes} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                <TechIcon type={rescueData.technicianType} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#0F0F1A' }}>
                  {rescueData.technicianName}
                </p>
                <p className="text-xs text-gray-400">
                  {TECHNICIAN_TYPE_LABELS[rescueData.technicianType]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star size={11} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                <span className="text-xs font-semibold" style={{ color: '#0F0F1A' }}>
                  {rescueData.technicianRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={11} style={{ color: '#9CA3AF' }} />
                <span className="text-xs text-gray-400">{rescueData.distanceKm} km away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issue + Severity card */}
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(15,15,26,0.06)' }}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{ISSUE_ICONS[rescueData.issueType]}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: '#0F0F1A' }}>
                  {ISSUE_LABELS[rescueData.issueType]}
                </p>
                <p className="text-xs text-gray-400">Detected issue</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: `${severityColor}18`, color: severityColor }}>
              {rescueData.severityLabel}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-start gap-2">
            <AlertTriangle size={14} style={{ color: severityColor, flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm text-gray-600 leading-relaxed">{rescueData.guidanceText}</p>
          </div>
        </div>

        {/* Cancel button */}
        {!isArrived && (
          <button onClick={handleCancel}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white">
            Cancel Rescue
          </button>
        )}

        {isArrived && (
          <motion.button
            onClick={reset}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #15803D, #16A34A)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Done
          </motion.button>
        )}
      </div>
    </div>
  );
}
