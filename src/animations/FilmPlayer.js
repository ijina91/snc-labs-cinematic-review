// One owner: a brief muted entrance, then native-scroll seeking. Never loops.
export function createFilmPlayer(video, source, ready, fallback, { intro = false, segments = 7 } = {}) {
  const events = new AbortController();
  let disposed = false, position = 0, seekFrame, introFrame, hasData = false, announced = false;
  let phase = 'loading', offset = 0, interacted = false;
  const setPhase = value => { phase = value; video.dataset.playback = value; };
  const notify = () => { if (!announced) { announced = true; ready(); } };
  const finishIntro = () => {
    if (phase !== 'intro') return;
    cancelAnimationFrame(introFrame); introFrame = undefined;
    video.pause(); offset = Math.min(1.2, video.currentTime);
    setPhase('scroll'); requestSeek();
  };
  const monitorIntro = () => {
    if (disposed || phase !== 'intro') return;
    if (video.currentTime >= 1.05 || document.hidden) { finishIntro(); return; }
    introFrame = requestAnimationFrame(monitorIntro);
  };
  const seek = () => {
    seekFrame = undefined;
    if (disposed || phase === 'intro' || !Number.isFinite(video.duration) || video.seeking) return;
    const duration = Math.max(0, video.duration - .08), firstEnd = duration / segments;
    // Preserve the exact frame reached by the entrance when scrolling begins.
    const time = position < 1 / segments ? offset + position * segments * (firstEnd - offset) : position * duration;
    if (Math.abs(video.currentTime - time) > .025) video.currentTime = time;
    else if (hasData) notify();
  };
  const requestSeek = () => { if (!seekFrame) seekFrame = requestAnimationFrame(seek); };
  // Reveal only after the requested frame is decoded, including late loads
  // halfway through the story. A frame-zero flash would break continuity.
  video.addEventListener('loadeddata', () => {
    hasData = true;
    if (intro && phase === 'loading' && !interacted && position === 0 && !document.hidden) {
      setPhase('intro'); notify();
      video.play().then(() => { if (phase === 'intro' && !disposed) monitorIntro(); })
        .catch(() => { if (!disposed) finishIntro(); });
    } else { setPhase('scroll'); requestSeek(); }
  }, { signal: events.signal });
  video.addEventListener('seeked', requestSeek, { signal: events.signal });
  video.addEventListener('error', () => { finishIntro(); fallback(); }, { signal: events.signal });
  video.muted = true; video.src = source; video.load();
  return {
    render(progress, { interacting = false } = {}) {
      position = Math.min(1, Math.max(0, progress)); interacted ||= interacting;
      if (phase === 'intro') { if (interacted) finishIntro(); else return; }
      requestSeek();
    },
    suspend() { interacted = true; finishIntro(); },
    dispose() {
      disposed = true; events.abort(); cancelAnimationFrame(seekFrame); cancelAnimationFrame(introFrame);
      video.pause(); video.removeAttribute('src'); video.load();
      delete video.dataset.playback;
    },
  };
}
