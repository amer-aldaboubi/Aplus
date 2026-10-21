/*
  Question image loader. Images are WebP slices inside packs/*.bin, addressed by
  byte offsets from pack-index.js, and fetched with HTTP Range requests
  (whole-blob fallback when the server ignores Range). Unchanged protocol.
*/
import { useEffect, useState } from 'react';
import { PACK_BLOBS } from './subjects';

const wholeBlobs = {};   // blobIndex -> Uint8Array (only when Range is unsupported)
const objectUrls = {};   // key+kind -> object URL
const pending = {};      // key+kind -> Promise

async function readSlice(blobIndex, offset, length) {
  if (wholeBlobs[blobIndex]) return wholeBlobs[blobIndex].slice(offset, offset + length);
  const url = 'packs/' + PACK_BLOBS[blobIndex];
  const res = await fetch(url, { headers: { Range: 'bytes=' + offset + '-' + (offset + length - 1) } });
  if (res.status === 206) return new Uint8Array(await res.arrayBuffer());
  if (!res.ok) throw new Error('fetch ' + res.status);
  const all = new Uint8Array(await res.arrayBuffer());
  wholeBlobs[blobIndex] = all;
  return all.slice(offset, offset + length);
}

/** kind: "q" (question) or "ms" (mark scheme). Resolves to an object URL. */
export function loadImage(q, kind) {
  const id = q.k + kind;
  if (objectUrls[id]) return Promise.resolve(objectUrls[id]);
  if (pending[id]) return pending[id];
  const offset = kind === 'q' ? q.o : q.o + q.lq;
  const length = kind === 'q' ? q.lq : q.lm;
  pending[id] = readSlice(q.b, offset, length)
    .then((bytes) => (objectUrls[id] = URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }))))
    .finally(() => delete pending[id]);
  return pending[id];
}

export function cachedImage(q, kind) {
  return objectUrls[q.k + kind] || null;
}

/** React hook: returns { url, err, loading } and only fetches while `active` is true (lazy loading). */
export function useQuestionImage(q, kind, active) {
  const id = q ? q.k + kind : 'none';
  const [st, setSt] = useState({ id, url: q ? objectUrls[id] || null : null, err: false });
  useEffect(() => {
    if (!q || !active) return;
    let gone = false;
    if (objectUrls[id]) {
      setSt({ id, url: objectUrls[id], err: false });
      return;
    }
    setSt({ id, url: null, err: false });
    loadImage(q, kind)
      .then((u) => !gone && setSt({ id, url: u, err: false }))
      .catch(() => !gone && setSt({ id, url: null, err: true }));
    return () => {
      gone = true;
    };
  }, [id, active]);
  const cur = st.id === id ? st : { id, url: (q && objectUrls[id]) || null, err: false };
  return { url: cur.url, err: cur.err, loading: active && !cur.url && !cur.err };
}
