import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { useGameStore, type LeaderboardEntry } from '../store/gameStore';
import { t, type Lang } from '../lib/i18n';

const MODE_LABELS = { regular: 'Regular', daily: 'Daily' } as const;

export default function LeaderboardScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const leaderboard = useGameStore((s) => s.leaderboard);
  const lang = useGameStore((s) => s.settings.lang);
  const [filter, setFilter] = useState<'all' | 'regular' | 'daily'>('all');

  const filtered = filter === 'all'
    ? leaderboard
    : leaderboard.filter(e => e.mode === filter);

  return (
    <div
      className="relative flex min-h-dvh flex-col px-5 py-8"
      style={{ background: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setScreen('home')}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/15 text-white/90 hover:bg-white/25 active:scale-90 transition-all"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#FFD23F]" />
          {t('lb.title', lang)}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'regular', 'daily'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f
                ? 'bg-[#FF6B35] text-white shadow-lg'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {f === 'all' ? t('lb.all', lang) : MODE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-[70dvh] space-y-2 pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-bold">{t('lb.noScores', lang)}</p>
            <p className="text-sm">{t('lb.playToBoard', lang)}</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((entry, i) => (
              <LeaderboardRow key={`${entry.date}-${i}`} entry={entry} rank={i + 1} lang={lang} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank, lang }: { entry: LeaderboardEntry; rank: number; lang: Lang }) {
  const medalColor = rank === 1 ? '#FFD23F' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '';
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
        isTop3 ? 'bg-white/15 border border-white/10' : 'bg-white/5'
      }`}
    >
      {/* Rank */}
      <div className="w-8 h-8 flex items-center justify-center rounded-xl font-black text-sm shrink-0"
        style={{
          background: isTop3 ? `${medalColor}30` : 'rgba(255,255,255,0.05)',
          color: isTop3 ? medalColor : 'rgba(255,255,255,0.4)',
        }}>
        {isTop3 ? <Medal className="h-5 w-5" style={{ color: medalColor }} /> : rank}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-sm truncate">{entry.name}</div>
        <div className="text-white/40 text-xs">
          {entry.pathCount} {t('lb.lanes', lang)} · {entry.speed} · {MODE_LABELS[entry.mode]}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[#FFD23F] text-xs font-black">$</span>
        <span className="text-white font-black text-lg">{entry.score}</span>
      </div>
    </motion.div>
  );
}
