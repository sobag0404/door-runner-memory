'use client';

import dynamic from 'next/dynamic';

// All screens use client-only state (localStorage, Three.js) — no SSR
const AppContent = dynamic(
  () => import('@/components/AppContent'),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-orange-800/60 text-sm font-medium">Загрузка...</span>
      </div>
    </div>
  );
}

export default function Page() {
  return <AppContent />;
}
