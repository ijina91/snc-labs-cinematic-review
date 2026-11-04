export function initServiceInteractions() {
  const events = new AbortController();
  document.querySelectorAll('.service-detail').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      detail.querySelector('summary').firstChild.textContent = detail.open ? '간단히 보기' : '자세히 알아보기';
      document.dispatchEvent(new Event('snc:layout'));
    }, { signal: events.signal });
  });
  return () => events.abort();
}
