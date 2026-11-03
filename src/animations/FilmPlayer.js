// Scroll owns currentTime; this decorative video never auto-plays or loops.
export function createFilmPlayer(video, source, ready, fallback) {
  const events = new AbortController();
  let disposed = false, position = 0, seekFrame;
  const seek = () => {
    seekFrame = undefined;
    if (disposed || !Number.isFinite(video.duration) || video.seeking) return;
    const time = position * Math.max(0, video.duration - .08);
    if (Math.abs(video.currentTime - time) > .025) video.currentTime = time;
  };
  const requestSeek = () => { if (!seekFrame) seekFrame = requestAnimationFrame(seek); };
  video.addEventListener('loadeddata', () => { ready(); requestSeek(); }, { signal: events.signal });
  video.addEventListener('seeked', requestSeek, { signal: events.signal });
  video.addEventListener('error', fallback, { signal: events.signal });
  video.muted = true; video.src = source; video.load();
  return {
    render(progress) { position = Math.min(1, Math.max(0, progress)); requestSeek(); },
    dispose() {
      disposed = true; events.abort(); cancelAnimationFrame(seekFrame);
      video.pause(); video.removeAttribute('src'); video.load();
    },
  };
}
