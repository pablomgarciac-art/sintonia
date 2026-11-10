// Servicio gratuito de títulos para Sintonía (Cloudflare Worker).
// Lee los metadatos ICY de un stream y devuelve {"title": "Artista - Canción"}.
// Solo acepta emisoras de la lista ALLOW para que nadie más lo use.
const ALLOW = [
  'kissfm.kissfmradio.cires21.com', 's3.we4stream.com', 'stream.flaixfm.cat',
  'radio-atres-live.ondacero.es', 'playerservices.streamtheworld.com',
  'flucast09-h-cloud.flumotion.com', 'flucast31-h-cloud.flumotion.com',
];
const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' };

export default {
  async fetch(req) {
    const target = new URL(req.url).searchParams.get('url');
    const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
    if (!target) return json({ error: 'falta url' }, 400);
    let u; try { u = new URL(target); } catch { return json({ error: 'url no válida' }, 400); }
    if (!ALLOW.some(h => u.hostname === h || u.hostname.endsWith('.' + h))) return json({ error: 'host no permitido' }, 403);
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 9000);
    try {
      const r = await fetch(u, { headers: { 'Icy-MetaData': '1', 'User-Agent': 'Mozilla/5.0' }, signal: ctl.signal, redirect: 'follow' });
      const mi = parseInt(r.headers.get('icy-metaint') || '0', 10);
      if (!mi || !r.body) { ctl.abort(); return json({ title: null }); }
      const rd = r.body.getReader();
      let buf = new Uint8Array(0);
      for (;;) {
        if (buf.length > mi && buf.length >= mi + 1 + buf[mi] * 16) break;
        const { value, done } = await rd.read();
        if (done) break;
        const nb = new Uint8Array(buf.length + value.length); nb.set(buf); nb.set(value, buf.length); buf = nb;
      }
      ctl.abort();
      const L = buf[mi] * 16;
      const txt = new TextDecoder('utf-8').decode(buf.slice(mi + 1, mi + 1 + L));
      const m = /StreamTitle='(.*?)';/.exec(txt);
      return json({ title: m ? m[1].trim() || null : null });
    } catch (e) {
      return json({ title: null, error: 'sin respuesta' });
    } finally { clearTimeout(t); }
  },
};
