/* Printable A4 landscape certificate for a level or Star of the Week. */
import React, { useEffect } from 'react';
import { Medal } from './Medal';

export function Certificate({ name, cls, title, line, medal, onClose }) {
  const gold = '#B8932B';
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = '@media print{@page{size:A4 landscape;margin:0}body *{visibility:hidden!important}#ap-cert,#ap-cert *{visibility:visible!important}#ap-cert{position:fixed!important;inset:0!important;margin:0!important;width:100%!important;height:100%!important;box-shadow:none!important;border-radius:0!important}}';
    document.head.appendChild(s);
    return () => s.remove();
  }, []);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(8,14,30,0.86)', overflowY: 'auto', padding: '24px 14px' }}>
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <div id="ap-cert" style={{ background: '#FFFDF7', color: '#1B2A4A', borderRadius: 14, padding: 10, boxShadow: '0 20px 60px rgba(0,0,0,.5)', fontFamily: 'Georgia, serif' }}>
          <div style={{ border: '3px solid ' + gold, borderRadius: 8, padding: 6, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ border: '1px solid ' + gold, borderRadius: 5, padding: '30px 22px', textAlign: 'center', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%,rgba(212,175,55,.10),transparent 60%)' }}>
              <div style={{ letterSpacing: '.3em', fontSize: 12, color: gold, fontWeight: 700 }}>A+ MATHS HUB</div>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 10 }}>Certificate of Achievement</div>
              <div style={{ width: 70, height: 2, background: gold, margin: '14px auto' }} />
              <div style={{ fontSize: 13, opacity: 0.65 }}>This certificate is proudly presented to</div>
              <div style={{ fontStyle: 'italic', fontSize: 34, margin: '10px 0 2px', color: '#0E1830' }}>{name}</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>{cls}</div>
              <div style={{ fontSize: 15, marginTop: 16, lineHeight: 1.5 }}>{line}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: gold, marginTop: 6 }}>{title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30, fontSize: 12, gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, marginBottom: 4, whiteSpace: 'nowrap' }}>{today}</div>
                  <div style={{ borderTop: '1px solid #1B2A4A', paddingTop: 6 }}>Date</div>
                  <div style={{ opacity: 0 }}>.</div>
                </div>
                <Medal b={medal.b} size={64} shape={medal.hex ? 'hex' : undefined} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontStyle: 'italic', fontSize: 16, marginBottom: 4, whiteSpace: 'nowrap' }}>Dr. Amer Al-Daboubi</div>
                  <div style={{ borderTop: '1px solid #1B2A4A', paddingTop: 6 }}>Mathematics Teacher</div>
                  <div style={{ opacity: 0.6 }}>ICS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 mt-3.5 no-print">
          <button onClick={() => window.print()} className="btn btn-lg flex-1" style={{ background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 }}>Print / Save as PDF</button>
          <button onClick={onClose} className="btn btn-lg flex-1" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
