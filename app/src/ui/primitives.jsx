import React, { useEffect } from 'react';
import { IconClose } from './Icons';

export function Card({ className = '', children, style, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={'card ' + className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, right, className = '' }) {
  return (
    <div className={'flex items-end justify-between gap-3 mt-7 mb-3 ' + className}>
      <h2 className="text-[17px] font-bold text-ink m-0">{children}</h2>
      {right}
    </div>
  );
}

export function StatTile({ value, label, colour, icon }) {
  return (
    <div className="card p-3 text-center">
      {icon && <div className="flex justify-center mb-1" style={{ color: colour || 'var(--color-brand-500)' }}>{icon}</div>}
      <div className="text-[22px] font-extrabold tnum leading-tight" style={{ color: colour || 'var(--color-ink)' }}>{value}</div>
      <div className="label mt-1">{label}</div>
    </div>
  );
}

export function Empty({ children }) {
  return <div className="muted text-[14px] py-2">{children}</div>;
}

/** Full-screen modal with backdrop. */
export function Modal({ onClose, children, maxWidth = 420, dark = false, zIndex = 1000 }) {
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', f);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', f);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div onClick={onClose} className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex, background: 'rgba(15,30,61,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 14px', overflowY: 'auto' }}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={'anim-pop ' + (dark ? '' : 'card')}
        style={{ width: '100%', maxWidth, maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: 'var(--shadow-pop)', background: dark ? 'linear-gradient(180deg,#1B2F5E,#11213F)' : undefined, color: dark ? '#fff' : undefined, borderRadius: 18 }}
      >
        {onClose && (
          <button onClick={onClose} aria-label="Close" className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8, color: dark ? '#fff' : undefined }}>
            <IconClose size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

/** Full-screen page sheet (used by the Game Zone). */
export function Sheet({ children, zIndex = 900 }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex, background: 'var(--color-page)', overflowY: 'auto' }}>
      {children}
    </div>
  );
}

export function Toast({ children, action, onAction }) {
  return (
    <div role="status" className="anim-fade-up" style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 'calc(84px + env(safe-area-inset-bottom,0px))', zIndex: 950, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px 10px 16px', borderRadius: 14, background: 'var(--color-navy-800)', color: '#fff', boxShadow: 'var(--shadow-pop)', fontSize: 14, maxWidth: 'calc(100vw - 32px)' }}>
      <span>{children}</span>
      {action && (
        <button onClick={onAction} className="btn btn-sm" style={{ background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 }}>
          {action}
        </button>
      )}
    </div>
  );
}

export function ProgressBar({ frac, colour = 'var(--color-brand-500)', height = 8, track = 'var(--color-line)' }) {
  return (
    <div style={{ height, borderRadius: height, background: track, overflow: 'hidden' }}>
      <div style={{ width: Math.max(2, Math.min(100, frac * 100)) + '%', height: '100%', borderRadius: height, background: colour, transition: 'width .4s' }} />
    </div>
  );
}
