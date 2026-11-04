const endpoint = 'https://api.github.com/orgs/snclabs/repos?type=public&sort=updated&per_page=12';
export function initGithubProjects() {
  const content = document.querySelector('#repo-content');
  const status = document.querySelector('#github-status');
  const retry = document.querySelector('#github-retry');
  let request; let disposed = false; let generation = 0; let loading = false;
  function state(heading, description) {
    const box = document.createElement('div'); box.className = 'repo-state';
    const title = document.createElement('h3'); title.textContent = heading;
    const paragraph = document.createElement('p'); paragraph.textContent = description;
    const link = document.createElement('a'); link.className = 'inline-link';
    link.href = 'https://github.com/snclabs'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = 'GitHub에서 소식 보기 ↗'; box.append(title, paragraph, link); content.replaceChildren(box);
  }
  async function load() {
    if (loading) return;
    loading = true;
    request?.abort(); request = new AbortController(); const current = ++generation;
    const timeout = setTimeout(() => request?.abort(), 7000);
    let canRetry = false;
    const isRetryFocused = document.activeElement === retry;
    retry.textContent = isRetryFocused ? '불러오는 중…' : '다시 불러오기 ↻';
    content.setAttribute('aria-busy', 'true'); retry.hidden = !isRetryFocused; retry.setAttribute('aria-disabled', 'true');
    status.textContent = '공개 프로젝트를 확인하고 있습니다.';
    state('Connecting to GitHub.', 'SNC Labs의 공개 프로젝트를 불러오고 있습니다.');
    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' }, signal: request.signal });
      if (!response.ok) throw new Error('github-response');
      const data = await response.json(); if (!Array.isArray(data)) throw new Error('github-data');
      if (disposed || current !== generation) return;
      const projects = data.filter((repo) => repo && repo.private === false && !repo.fork && !repo.archived && typeof repo.name === 'string' && repo.name.length > 0 && repo.name !== '.github' && repo.name !== 'snclabs.github.io').slice(0, 3);
      if (!projects.length) {
        state('Every connection starts somewhere.', '새로운 기술과 공개 프로젝트를 준비하고 있습니다. SNC Labs의 다음 커밋을 기대해주세요.');
        status.textContent = '공개 프로젝트가 등록되면 이곳에서 소개합니다.';
        return;
      }
      const list = document.createElement('div'); list.className = 'repo-list';
      projects.forEach((repo) => {
        const link = document.createElement('a'); link.className = 'repo-item';
        link.href = `https://github.com/snclabs/${encodeURIComponent(repo.name)}`;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        const title = document.createElement('h3'); title.textContent = repo.name;
        const description = document.createElement('p'); description.textContent = repo.description || 'SNC Labs의 공개 프로젝트를 만나보세요.';
        const meta = document.createElement('span'); meta.className = 'repo-meta';
        meta.textContent = `${repo.language || 'Project'} · ☆ ${Number(repo.stargazers_count) || 0} ↗`;
        link.append(title, description, meta); list.append(link);
      });
      content.replaceChildren(list); status.textContent = 'From SNC Labs, out in the open.';
    } catch {
      if (disposed || current !== generation) return;
      state('GitHub에서 이어지는 이야기.', '지금은 프로젝트를 불러오지 못했습니다. GitHub에서 공개 프로젝트를 직접 확인하거나 다시 불러와주세요.');
      status.textContent = 'GitHub 연결을 확인해주세요.'; canRetry = true;
    } finally {
      clearTimeout(timeout);
      if (current === generation && !disposed) {
        loading = false;
        content.setAttribute('aria-busy', 'false'); retry.removeAttribute('aria-disabled');
        retry.textContent = '다시 불러오기 ↻';
        if (!canRetry && document.activeElement === retry) content.querySelector('a')?.focus({ preventScroll: true });
        retry.hidden = !canRetry;
      }
    }
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); load(); }
  }, { rootMargin: '600px 0px' });
  observer.observe(content.closest('section'));
  retry.addEventListener('click', load);
  return () => { disposed = true; generation++; observer.disconnect(); request?.abort(); retry.removeEventListener('click', load); };
}
