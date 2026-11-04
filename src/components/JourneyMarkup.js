import { film } from '../data/film.js';
import { journey } from '../data/journey.js';

function renderChapter(chapter, index) {
  const frame = String(index + 1).padStart(2, '0');
  const hero = index === 0;
  const heading = hero
    ? `<p class="hero-display" aria-hidden="true"><span>Engineering</span><span>possibility.</span></p><h1 id="hero-title">${chapter.title.map(line => `<span class="hero-line">${line}</span>`).join(' ')}</h1>`
    : `<h2>${chapter.title.map(line => `<span>${line}</span>`).join(' ')}</h2>`;
  return `<article class="journey-panel${hero ? ' hero hero--film' : ''}" id="story-${chapter.id}" data-word="${chapter.word}" data-index="${index}" data-frame="${frame}">
    <img class="chapter-still" src="/assets/frames/v2/${frame}.webp" srcset="/assets/frames/v2/${frame}-mobile.webp 800w, /assets/frames/v2/${frame}.webp 1280w" sizes="100vw" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} width="1280" height="704" alt="" decoding="async">
    <p class="journey-label"><span aria-hidden="true"></span>${chapter.label}</p>
    ${heading}<p class="journey-description">${chapter.description}</p>
    ${hero ? '<div class="hero-actions"><a class="button button-blue" href="#expertise">SNC의 기술 알아보기 <span aria-hidden="true">↗</span></a><a class="quiet-link" href="#about">회사 소개 <span aria-hidden="true">↗</span></a></div>' : ''}
  </article>`;
}

export function renderJourney() {
  return `<section class="journey" id="journey" aria-label="SNC 01부터 07까지 이어지는 브랜드 소개">
    <div class="journey-stage" data-chapter="0">
      <div class="journey-grid" aria-hidden="true"></div>
      <div class="journey-visual" aria-hidden="true">
        <img class="journey-poster" src="${film.poster}" srcset="${film.posterMobile} 800w, ${film.poster} 1280w" sizes="100vw" width="1280" height="704" alt="" decoding="async" fetchpriority="high">
        <video class="journey-film" muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      </div>
      <div class="journey-word" aria-hidden="true">SNC</div>
      <div class="journey-top"><span>SNC / A connected perspective.</span><a href="#about">회사 소개 바로 읽기 <span aria-hidden="true">↗</span></a></div>
      <div class="journey-panels">${journey.map(renderChapter).join('')}</div>
      <div class="journey-bottom"><span class="journey-scroll-hint">스크롤하며 SNC를 만나보세요 <span aria-hidden="true">↓</span></span><a href="#contact">프로젝트 문의 <span aria-hidden="true">↗</span></a></div>
      <p class="visually-hidden journey-status" aria-live="polite"></p>
    </div>
  </section>`;
}
