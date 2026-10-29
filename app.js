/* CVZ Portfolio — static projects. Add new projects here as outputs are supplied. */
const PROPERTIES = [
  { title: 'Private Resort Poster — Template 01', type: 'LUXURY NIGHT THEME', description: 'A premium resort listing poster with a bold headline, rich dark palette, and strong visual emphasis on the hero image.', image: './media/posters/poster-template-1.png', alt: 'Private resort for sale poster, dark luxury layout' },
  { title: 'Private Resort Poster — Template 02', type: 'EDITORIAL SPLIT LAYOUT', description: 'A cleaner editorial-style layout that balances white space, property details, and large-format photography.', image: './media/posters/poster-template-2.png', alt: 'Private resort for sale poster, cream split-layout design' },
  { title: 'Private Resort Poster — Template 03', type: 'GRID-BASED PREMIUM LAYOUT', description: 'A high-impact poster concept that combines a large hero image, supporting interior thumbnails, and a structured information band.', image: './media/posters/poster-template-3.png', alt: 'Private resort for sale poster, premium grid layout' },
  { title: 'Private Resort Poster — Template 04', type: 'EMERALD FRAMED CONCEPT', description: 'A polished green-and-gold layout designed to feel elegant, branded, and visually distinct while keeping the details easy to scan.', image: './media/posters/poster-template-4.png', alt: 'Private resort for sale poster, emerald framed design' },
];

/* Add exact URLs once they are provided. Do not substitute an unrelated repository. */
const PESOBASE = { github: '', demo: '' };

const q = (selector) => document.querySelector(selector);
const viewer = q('#viewer');
let currentIndex = 0;

function paintProject() {
  const item = PROPERTIES[currentIndex];
  const image = q('#propertyImage');
  if (!image) return;
  image.src = item.image;
  image.alt = item.alt;
  image.classList.remove('poster-transition');
  void image.offsetWidth;
  image.classList.add('poster-transition');
  q('#propertyTitle').textContent = item.title;
  q('#propertyType').textContent = item.type;
  q('#propertyDesc').textContent = item.description;
  q('#projectNumber').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(PROPERTIES.length).padStart(2, '0')}`;
  const original = q('#downloadPoster');
  if (original) { original.href = item.image; original.download = `CVZ-private-resort-poster-${currentIndex+1}.png`; }
  document.querySelectorAll('.poster-thumb').forEach((thumb, i) => {
    const selected = i === currentIndex;
    thumb.classList.toggle('is-current', selected);
    thumb.setAttribute('aria-pressed', String(selected));
  });
  q('#slideDots').innerHTML = PROPERTIES.map((p,i) => `<button class="slide-dot ${i === currentIndex ? 'active' : ''}" type="button" data-index="${i}" aria-label="Show project ${i + 1}: ${p.title}" aria-current="${i===currentIndex}"></button>`).join('');
  q('#slideDots').querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { currentIndex = Number(btn.dataset.index); paintProject(); }));
}
function moveProject(step) { currentIndex = (currentIndex + step + PROPERTIES.length) % PROPERTIES.length; paintProject(); }
q('#propertyPrev')?.addEventListener('click', () => moveProject(-1));
q('#propertyNext')?.addEventListener('click', () => moveProject(1));
document.querySelectorAll('.poster-thumb').forEach(btn => btn.addEventListener('click', () => {
  currentIndex = Number(btn.dataset.index); paintProject();
}));
document.addEventListener('keydown', event => {
  const work = q('#work');
  if (!work || !work.contains(document.activeElement) || viewer?.open) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveProject(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); moveProject(1); }
});

let touchStartX = 0;
const showcase = q('.showcase');
showcase?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
showcase?.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 65) moveProject(delta < 0 ? 1 : -1);
}, {passive:true});

function openViewer(title, contentNode) {
  q('#viewerTitle').textContent = title;
  const body = q('#viewerBody');
  body.replaceChildren(contentNode);
  viewer.showModal();
}
q('#enlargePoster')?.addEventListener('click', () => {
  const item = PROPERTIES[currentIndex];
  const img = new Image(); img.src = item.image; img.alt = item.alt;
  openViewer(item.title, img);
});
function closeViewer() {
  viewer.close();
  q('#viewerBody').replaceChildren();
}
q('#closeViewer')?.addEventListener('click', closeViewer);
viewer?.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
viewer?.addEventListener('close', () => { q('#viewerBody').replaceChildren(); });

const links = q('#pesoLinks');
if (links) {
  const valid = url => { try { const parsed = new URL(url); return ['http:','https:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; } };
  const repo = valid(PESOBASE.github), demo = valid(PESOBASE.demo);
  if (repo || demo) {
    links.replaceChildren();
    for (const [label,url] of [['View source code',repo],['Live project',demo]]) {
      if (!url) continue;
      const a = document.createElement('a'); a.className='peso-link'; a.textContent = label + ' ↗'; a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; links.append(a);
    }
  }
}

const mobileToggle = q('#mobileToggle');
mobileToggle?.addEventListener('click', () => {
  const nav = q('#navigation');
  const open = nav.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', () => {
  q('#navigation').classList.remove('open');
  mobileToggle?.setAttribute('aria-expanded', 'false');
}));
q('#year').textContent = new Date().getFullYear();
paintProject();


/* Low-cost polish: scroll indicator, reveal transitions, active-section nav. */
(() => {
  const progress = document.querySelector('#readingProgress');
  const header = document.querySelector('.topbar');
  let scheduled = false;
  const updateScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1,Math.max(0,window.scrollY/maxScroll))})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled=true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  window.addEventListener('resize', updateScroll, {passive:true});
  updateScroll();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const animated = document.querySelectorAll('.section-heading, .showcase, .social-card, .license-card, .cert-card, .tool-group, .tech-card, .experience-row, .contact-panel, .project-strip');
  animated.forEach((el,i)=>{el.classList.add('reveal'); if (i%3===1) el.classList.add('delay-1');});
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}});
  },{rootMargin:'0px 0px -40px 0px',threshold:.08});
  animated.forEach(el => obs.observe(el));
  document.body.classList.add('motion-ready');
  // Safety: don't leave offscreen areas blank if the browser delays observers.
  setTimeout(()=>animated.forEach(el=>el.classList.add('is-visible')),3000);
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  const navObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('is-current',a.getAttribute('href')==='#'+entry.target.id));}})
  },{rootMargin:'-20% 0px -60% 0px',threshold:0});
  sections.forEach(s=>navObs.observe(s));
})();


/* Credential lightbox: full-resolution files are served from local website assets. */
const CERTIFICATES = [
  {title:'AIGPE — AI-Powered Prompting Specialist',src:'./media/certifications/aigpe-ai-prompting.png'},
  {title:'SoloLearn — Python Core',src:'./media/certifications/sololearn-python-core.png'},
  {title:'freeCodeCamp — JavaScript Algorithms & Data Structures',src:'./media/certifications/freecodecamp-javascript.png'},
  {title:'freeCodeCamp — Responsive Web Design',src:'./media/certifications/freecodecamp-responsive-web-design.png'}
];
let activeCertificate = -1;
function openCertificate(index){
  activeCertificate = index;
  const item = CERTIFICATES[index];
  const image = new Image(); image.src=item.src; image.alt=item.title; image.decoding='async';
  if (viewer.open){
    q('#viewerTitle').textContent = item.title;
    q('#viewerBody').replaceChildren(image);
  } else openViewer(item.title, image);
}
document.querySelectorAll('[data-cert]').forEach(button=>button.addEventListener('click',()=>openCertificate(Number(button.dataset.cert))));
viewer?.addEventListener('close',()=>{activeCertificate=-1;});
document.addEventListener('keydown',e=>{
  if(!viewer?.open || activeCertificate<0)return;
  if(e.key==='ArrowRight'){e.preventDefault();openCertificate((activeCertificate+1)%CERTIFICATES.length);}
  if(e.key==='ArrowLeft'){e.preventDefault();openCertificate((activeCertificate+CERTIFICATES.length-1)%CERTIFICATES.length);}
});
/* Small, pointer-driven surface highlights; no layout or content shifts. */
if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches){
  document.querySelectorAll('.license-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const box=card.getBoundingClientRect();
      card.style.setProperty('--spot-x',`${(event.clientX-box.left)/box.width*100}%`);
      card.style.setProperty('--spot-y',`${(event.clientY-box.top)/box.height*100}%`);
    },{passive:true});
  });
}
