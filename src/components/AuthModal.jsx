import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, ShieldCheck, Bookmark, Flame, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_GOOGLE_CLIENT_ID = '677829998148-vs9o639vfiqat8urfuparumath82roj1.apps.googleusercontent.com';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogleCredential, loginWithDemoGoogle } = useAuth();
  const googleBtnRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

  // Initialize official Google Identity Services button
  useEffect(() => {
    if (!isAuthModalOpen) return;
    setAuthError(null);

    const initGsi = () => {
      if (googleClientId && window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
              if (response.credential) {
                loginWithGoogleCredential(response.credential);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            width: 320,
            text: 'continue_with',
            logo_alignment: 'left',
          });
          setGoogleReady(true);
        } catch (err) {
          console.error('Error rendering Google button', err);
          setAuthError('Google Sign-In initialization failed. Please check origin permissions.');
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGsi();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isAuthModalOpen, googleClientId]);

  if (!isAuthModalOpen) return null;

  const handleManualGoogleClick = () => {
    if (window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            setAuthError('Google popup was prevented. Please make sure this Vercel domain is added to "Authorized JavaScript origins" in Google Cloud Console.');
          }
        });
      } catch (err) {
        console.error('Google Prompt error', err);
        setAuthError('Google sign in error. Make sure your domain is authorized in Google Cloud Console.');
      }
    } else {
      setAuthError('Google services still loading, please wait 2 seconds...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0B2A1E] via-[#071F15] to-[#04140E] border-2 border-[#C5A059]/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-left overflow-hidden animate-scale-up"
      >
        {/* Glow corner effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#061610]/70 border border-[#C5A059]/25 text-[#F5F1E6]/70 hover:text-white hover:border-[#C5A059] transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pb-5 border-b border-[#C5A059]/20">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#082218] border border-[#C5A059]/50 flex items-center justify-center text-2xl">
              📖
            </div>
          </div>

          <h2 className="text-2xl font-bold font-outfit text-white tracking-tight">
            Welcome to Quran AI
          </h2>
          <p className="text-xs text-[#F5F1E6]/75 max-w-xs mx-auto">
            Sign in with your Google account to sync your learning journey across all devices.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="my-5 space-y-2.5">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#061610]/50 border border-[#C5A059]/15 text-xs text-[#F5F1E6]/90">
            <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] shrink-0">
              <Bookmark size={15} />
            </div>
            <span><strong>Cloud Bookmarks:</strong> Save your favorite Surahs & Ayahs forever.</span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#061610]/50 border border-[#C5A059]/15 text-xs text-[#F5F1E6]/90">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
              <Flame size={15} />
            </div>
            <span><strong>Streak Sync:</strong> Track your recitation consistency daily.</span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#061610]/50 border border-[#C5A059]/15 text-xs text-[#F5F1E6]/90">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles size={15} />
            </div>
            <span><strong>Personalized Experience:</strong> Customized learning insights & goals.</span>
          </div>
        </div>

        {/* Action Button: Sign In with Google */}
        <div className="space-y-3 pt-2">
          {/* Target container for official Google Identity Services button */}
          <div ref={googleBtnRef} className="flex justify-center w-full min-h-[44px]" />

          {/* Fallback button if official Google button is still rendering */}
          {!googleReady && (
            <button
              onClick={handleManualGoogleClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-[#1F1F1F] font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
              {/* Google SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          {/* Helpful Auth Warning / Guidance if Google blocks origin */}
          {authError && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs space-y-1 animate-fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">{authError}</p>
              </div>
            </div>
          )}

          {/* One-click Demo Access Link for testing */}
          <div className="text-center pt-1">
            <button
              onClick={loginWithDemoGoogle}
              className="text-[11px] text-[#C5A059]/70 hover:text-[#C5A059] underline decoration-[#C5A059]/40 hover:decoration-[#C5A059] transition-colors cursor-pointer"
            >
              Test with Demo Account
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-5 pt-3 border-t border-[#C5A059]/15 flex items-center justify-center gap-1.5 text-[11px] text-[#F5F1E6]/50">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>No Supabase needed • Secure direct Google OAuth 2.0</span>
        </div>

      </div>

    </div>
  );
}
