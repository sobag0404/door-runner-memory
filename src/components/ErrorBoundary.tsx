// ─── Error Boundary ────────────────────────────────────
// Catches rendering errors and shows a friendly fallback UI
import { Component, type ReactNode } from 'react';
import { t } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

interface Props {
  children: ReactNode;
  lang?: Lang;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang ?? 'en';

      return (
        <div
          className="flex min-h-dvh flex-col items-center justify-center px-6 py-8 text-center"
          style={{ background: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)' }}
          role="alert"
        >
          {/* Sad door */}
          <div className="text-6xl mb-4 font-black text-[#EF476F]" aria-hidden="true">X(</div>

          <h1 className="text-2xl font-black text-white mb-2">
            {t('error.title', lang)}
          </h1>
          <p className="text-white/60 text-sm mb-6 max-w-xs leading-relaxed">
            {t('error.message', lang)}
          </p>

          {/* Error details (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-6 w-full max-w-sm text-left">
              <summary className="text-white/40 text-xs cursor-pointer mb-2">
                {t('error.details', lang)}
              </summary>
              <pre className="bg-black/30 rounded-xl p-3 text-[10px] text-red-300/80 overflow-auto max-h-32 custom-scrollbar">
                {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="h-11 px-6 rounded-2xl bg-white/15 text-white/70 font-bold text-sm hover:bg-white/25 active:scale-95 transition-all"
            >
              {t('error.retry', lang)}
            </button>
            <button
              onClick={this.handleReload}
              className="h-11 px-6 rounded-2xl bg-[#FF6B35] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/30 active:scale-95 transition-all"
            >
              {t('error.reload', lang)}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
