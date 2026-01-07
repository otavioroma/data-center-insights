import { useEffect, useRef, useState } from 'react';

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / docHeight) * 100;
      setScrollProgress(progress);

      if (scrollY > lastScrollY.current && scrollY > 100) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = scrollY;

      setBackToTopVisible(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const slides = document.querySelectorAll('.slide');
      let currentSlideIndex = -1;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentSlideIndex = index;
        }
      });

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSlideIndex < slides.length - 1) {
        e.preventDefault();
        slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }

      if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSlideIndex > 0) {
        e.preventDefault();
        slides[currentSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }

      if (e.key === 'Home') {
        e.preventDefault();
        slides[0].scrollIntoView({ behavior: 'smooth' });
      }

      if (e.key === 'End') {
        e.preventDefault();
        slides[slides.length - 1].scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 60;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        :root {
          --color-primary: #1e3a5f;
          --color-primary-light: #2d5a8a;
          --color-primary-dark: #152a45;
          --color-accent-green: #059669;
          --color-accent-green-light: #10b981;
          --color-accent-green-dark: #047857;
          --color-accent-blue: #0ea5e9;
          --color-accent-blue-light: #38bdf8;
          --color-gray-50: #f8fafc;
          --color-gray-100: #f1f5f9;
          --color-gray-200: #e2e8f0;
          --color-gray-300: #cbd5e1;
          --color-gray-400: #94a3b8;
          --color-gray-500: #64748b;
          --color-gray-600: #475569;
          --color-gray-700: #334155;
          --color-gray-800: #1e293b;
          --color-gray-900: #0f172a;
          --color-energy: #f59e0b;
          --color-water: #06b6d4;
          --color-carbon: #10b981;
          --font-display: 'Space Grotesk', system-ui, sans-serif;
          --font-body: 'Inter', system-ui, -apple-system, sans-serif;
          --spacing-xs: 0.25rem;
          --spacing-sm: 0.5rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;
          --spacing-2xl: 3rem;
          --spacing-3xl: 4rem;
          --radius-sm: 0.375rem;
          --radius-md: 0.5rem;
          --radius-lg: 0.75rem;
          --radius-xl: 1rem;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          --transition-fast: 150ms ease;
          --transition-base: 250ms ease;
          --container-max: 1200px;
          --container-padding: 1.5rem;
        }
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body { font-family: var(--font-body); line-height: 1.6; color: var(--color-gray-800); background-color: var(--color-gray-50); }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); line-height: 1.2; font-weight: 600; color: var(--color-gray-900); }
        p { margin-bottom: var(--spacing-md); }
        strong { font-weight: 600; color: var(--color-gray-900); }
        a { color: var(--color-primary); text-decoration: none; transition: color var(--transition-fast); }
        a:hover { color: var(--color-primary-light); }
        
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--color-gray-200); transition: transform var(--transition-base); }
        .nav.hidden { transform: translateY(-100%); }
        .nav-content { max-width: var(--container-max); margin: 0 auto; padding: var(--spacing-md) var(--container-padding); display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: var(--spacing-sm); font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--color-primary); }
        .nav-icon { width: 24px; height: 24px; color: var(--color-accent-green); }
        .nav-links { display: flex; gap: var(--spacing-xl); }
        .nav-links a { font-size: 0.875rem; font-weight: 500; color: var(--color-gray-600); transition: color var(--transition-fast); cursor: pointer; }
        .nav-links a:hover { color: var(--color-primary); }
        .nav-menu-btn { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: var(--spacing-sm); }
        .nav-menu-btn span { width: 24px; height: 2px; background: var(--color-gray-700); transition: all var(--transition-base); }
        .mobile-menu { display: none; position: fixed; top: 60px; left: 0; right: 0; background: white; padding: var(--spacing-lg); flex-direction: column; gap: var(--spacing-md); box-shadow: var(--shadow-lg); z-index: 999; }
        .mobile-menu.active { display: flex; }
        .mobile-menu a { font-size: 1rem; padding: var(--spacing-sm) 0; color: var(--color-gray-700); border-bottom: 1px solid var(--color-gray-100); cursor: pointer; }
        
        .progress-container { position: fixed; top: 60px; left: 0; right: 0; height: 3px; background: var(--color-gray-200); z-index: 999; }
        .progress-bar { height: 100%; background: linear-gradient(90deg, var(--color-accent-green), var(--color-accent-blue)); transition: width 100ms ease-out; }
        
        .slide { min-height: 100vh; padding: calc(80px + var(--spacing-3xl)) var(--container-padding) var(--spacing-3xl); display: flex; align-items: center; position: relative; }
        .slide-content { max-width: var(--container-max); margin: 0 auto; width: 100%; }
        .slide-alt { background: var(--color-gray-100); }
        
        .slide-hero { min-height: 100vh; background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%); color: white; overflow: hidden; padding-top: 80px; }
        .hero-bg { position: absolute; inset: 0; overflow: hidden; }
        .hero-gradient { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(5, 150, 105, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 40%); }
        .hero-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
        .hero-content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100vh - 160px); }
        .hero-badge { display: inline-flex; align-items: center; gap: var(--spacing-sm); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: var(--spacing-sm) var(--spacing-lg); border-radius: 50px; font-size: 0.875rem; font-weight: 500; margin-bottom: var(--spacing-xl); backdrop-filter: blur(10px); }
        .hero-badge svg { width: 16px; height: 16px; color: var(--color-accent-green-light); }
        .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.1; margin-bottom: var(--spacing-xl); color: white; }
        .hero-highlight { background: linear-gradient(90deg, var(--color-accent-green-light), var(--color-accent-blue-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.8); margin-bottom: var(--spacing-2xl); max-width: 600px; }
        .hero-source { display: flex; align-items: center; gap: var(--spacing-sm); font-size: 0.875rem; color: rgba(255, 255, 255, 0.6); margin-bottom: var(--spacing-3xl); }
        .source-label { color: rgba(255, 255, 255, 0.4); }
        .hero-scroll { display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm); color: rgba(255, 255, 255, 0.7); font-size: 0.875rem; cursor: pointer; transition: color var(--transition-fast); }
        .hero-scroll:hover { color: white; }
        .hero-scroll svg { width: 24px; height: 24px; animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(8px); } 60% { transform: translateY(4px); } }
        
        .section-header { margin-bottom: var(--spacing-2xl); }
        .section-header.light { color: white; }
        .section-header.light .section-title, .section-header.light .section-number { color: white; }
        .section-number { display: inline-block; font-family: var(--font-display); font-size: 0.875rem; font-weight: 600; color: var(--color-accent-green); margin-bottom: var(--spacing-sm); }
        .section-title { font-size: clamp(1.5rem, 4vw, 2.25rem); margin-bottom: var(--spacing-sm); }
        .section-badge { display: inline-block; font-size: 0.875rem; font-weight: 500; color: var(--color-gray-500); }
        .section-intro { font-size: 1.125rem; color: var(--color-gray-600); max-width: 900px; margin-bottom: var(--spacing-2xl); }
        .section-intro.light { color: rgba(255, 255, 255, 0.8); }
        
        .cards-grid { display: grid; gap: var(--spacing-xl); }
        .cards-grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        
        .impact-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); transition: transform var(--transition-base), box-shadow var(--transition-base); border: 1px solid var(--color-gray-100); }
        .impact-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .impact-icon { width: 56px; height: 56px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-lg); }
        .impact-icon svg { width: 28px; height: 28px; }
        .impact-icon.energy { background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2)); color: var(--color-energy); }
        .impact-icon.water { background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.2)); color: var(--color-water); }
        .impact-icon.carbon { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); color: var(--color-carbon); }
        .impact-card h3 { font-size: 1.125rem; margin-bottom: var(--spacing-sm); }
        .impact-card p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        
        .metrics-showcase { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl); }
        .metric-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); position: relative; overflow: hidden; transition: transform var(--transition-base), box-shadow var(--transition-base); border-left: 4px solid; }
        .metric-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .metric-card.pue { border-left-color: var(--color-energy); }
        .metric-card.wue { border-left-color: var(--color-water); }
        .metric-card.cue { border-left-color: var(--color-carbon); }
        .metric-header { margin-bottom: var(--spacing-md); }
        .metric-label { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; display: block; margin-bottom: var(--spacing-xs); }
        .metric-card.pue .metric-label { color: var(--color-energy); }
        .metric-card.wue .metric-label { color: var(--color-water); }
        .metric-card.cue .metric-label { color: var(--color-carbon); }
        .metric-full { font-size: 0.875rem; color: var(--color-gray-500); }
        .metric-card p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        .metric-indicator { position: absolute; bottom: var(--spacing-lg); right: var(--spacing-lg); width: 40px; height: 40px; opacity: 0.1; }
        .metric-card.pue .metric-indicator { color: var(--color-energy); }
        .metric-card.wue .metric-indicator { color: var(--color-water); }
        .metric-card.cue .metric-indicator { color: var(--color-carbon); }
        .metric-indicator svg { width: 100%; height: 100%; }
        
        .formula-box { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); margin-bottom: var(--spacing-2xl); box-shadow: var(--shadow-md); border: 1px solid var(--color-gray-200); }
        .formula-box.water { border-left: 4px solid var(--color-water); }
        .formula-box.carbon { border-left: 4px solid var(--color-carbon); }
        .formula-box.small { padding: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
        .formula { display: flex; align-items: center; justify-content: center; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl); flex-wrap: wrap; }
        .formula-label { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--color-primary); }
        .formula-equals { font-size: 1.5rem; color: var(--color-gray-400); }
        .formula-fraction { display: flex; flex-direction: column; align-items: center; border: 2px solid var(--color-gray-200); border-radius: var(--radius-lg); overflow: hidden; }
        .formula-numerator, .formula-denominator { padding: var(--spacing-sm) var(--spacing-lg); font-weight: 500; text-align: center; }
        .formula-numerator { background: var(--color-gray-100); border-bottom: 2px solid var(--color-gray-200); }
        .formula-target { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: linear-gradient(135deg, rgba(5, 150, 105, 0.05), rgba(5, 150, 105, 0.1)); border-radius: var(--radius-lg); }
        .formula-target svg { width: 24px; height: 24px; color: var(--color-accent-green); flex-shrink: 0; }
        .formula-target span { font-size: 0.9375rem; color: var(--color-gray-700); }
        
        .pue-breakdown { margin-bottom: var(--spacing-2xl); }
        .energy-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-xl); }
        .energy-type { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .energy-type.productive { border-top: 4px solid var(--color-accent-green); }
        .energy-type.overhead { border-top: 4px solid var(--color-gray-400); }
        .energy-type h4 { font-size: 1rem; margin-bottom: var(--spacing-xs); }
        .energy-label { display: inline-block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm); margin-bottom: var(--spacing-lg); }
        .energy-type.productive .energy-label { background: rgba(5, 150, 105, 0.1); color: var(--color-accent-green); }
        .energy-type.overhead .energy-label { background: var(--color-gray-100); color: var(--color-gray-600); }
        .energy-type ul { list-style: none; }
        .energy-type li { display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm) 0; font-size: 0.9375rem; color: var(--color-gray-700); border-bottom: 1px solid var(--color-gray-100); }
        .energy-type li:last-child { border-bottom: none; }
        .energy-type li svg { width: 18px; height: 18px; color: var(--color-gray-400); }
        
        .measurement-levels { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .measurement-levels h4 { font-size: 1rem; margin-bottom: var(--spacing-lg); color: var(--color-gray-700); }
        .levels-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-md); }
        .level { display: flex; align-items: flex-start; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-gray-50); border-radius: var(--radius-lg); }
        .level-number { width: 32px; height: 32px; background: var(--color-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; flex-shrink: 0; }
        .level-content strong { display: block; font-size: 0.9375rem; margin-bottom: var(--spacing-xs); }
        .level-content span { font-size: 0.875rem; color: var(--color-gray-600); }
        
        .wue-explanation { display: grid; grid-template-columns: 1fr auto; gap: var(--spacing-2xl); align-items: center; }
        .wue-importance { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .wue-importance h4 { font-size: 1.125rem; margin-bottom: var(--spacing-md); color: var(--color-water); }
        .wue-importance p { color: var(--color-gray-600); margin-bottom: 0; }
        .wue-benchmark { background: linear-gradient(135deg, var(--color-water), var(--color-accent-blue-light)); border-radius: var(--radius-xl); padding: var(--spacing-xl) var(--spacing-2xl); text-align: center; color: white; box-shadow: var(--shadow-lg); }
        .benchmark-value { display: flex; align-items: baseline; justify-content: center; gap: var(--spacing-xs); }
        .benchmark-value .value { font-family: var(--font-display); font-size: 3rem; font-weight: 700; }
        .benchmark-value .unit { font-size: 1.25rem; opacity: 0.8; }
        .benchmark-label { display: block; margin-top: var(--spacing-sm); font-size: 0.875rem; opacity: 0.9; }
        
        .split-content { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-2xl); }
        .cue-focus { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .cue-focus h3 { font-size: 1.25rem; margin-bottom: var(--spacing-md); color: var(--color-primary); }
        .cue-focus h3 span { font-weight: 400; font-size: 0.875rem; color: var(--color-gray-500); }
        .cue-focus > p { color: var(--color-gray-600); margin-bottom: var(--spacing-lg); }
        .cue-note { padding: var(--spacing-md); background: var(--color-gray-50); border-radius: var(--radius-lg); font-size: 0.9375rem; color: var(--color-gray-600); margin-bottom: 0 !important; }
        .certifications h3 { font-size: 1.125rem; margin-bottom: var(--spacing-lg); color: var(--color-gray-700); }
        .cert-cards { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .cert-card { background: white; border-radius: var(--radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); transition: box-shadow var(--transition-base); }
        .cert-card:hover { box-shadow: var(--shadow-md); }
        .cert-icon { width: 36px; height: 36px; color: var(--color-accent-green); margin-bottom: var(--spacing-sm); }
        .cert-icon svg { width: 100%; height: 100%; }
        .cert-card h4 { font-size: 1rem; margin-bottom: var(--spacing-xs); }
        .cert-card > span { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-gray-500); margin-bottom: var(--spacing-sm); }
        .cert-card p { font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 0; }
        
        .slide-dark { background: linear-gradient(135deg, var(--color-gray-900), var(--color-gray-800)); color: white; }
        .pue-ranking { background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-xl); padding: var(--spacing-2xl); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: var(--spacing-xl); }
        .pue-ranking h3 { color: white; font-size: 1.25rem; margin-bottom: var(--spacing-xl); text-align: center; }
        .ranking-bars { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .ranking-item { display: grid; grid-template-columns: 180px 1fr 60px; align-items: center; gap: var(--spacing-lg); }
        .rank-info { display: flex; align-items: center; gap: var(--spacing-md); }
        .rank-position { font-family: var(--font-display); font-weight: 700; font-size: 1rem; color: var(--color-gray-400); width: 30px; }
        .ranking-item.leader .rank-position { color: var(--color-accent-green-light); }
        .rank-company { font-weight: 500; color: white; }
        .ranking-item.average .rank-company { color: var(--color-gray-400); }
        .rank-bar-container { height: 12px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; overflow: hidden; }
        .rank-bar { height: 100%; background: linear-gradient(90deg, var(--color-accent-green), var(--color-accent-blue-light)); border-radius: 6px; transition: width 1s ease-out; }
        .ranking-item.average .rank-bar { background: var(--color-gray-500); }
        .rank-value { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: white; text-align: right; }
        .ranking-item.leader .rank-value { color: var(--color-accent-green-light); }
        .ranking-item.average .rank-value { color: var(--color-gray-400); }
        .ranking-source { text-align: center; font-size: 0.875rem; color: var(--color-gray-500); margin-top: var(--spacing-lg); }
        .efficiency-factors { text-align: center; }
        .efficiency-factors p { color: rgba(255, 255, 255, 0.8); font-size: 1.125rem; margin-bottom: 0; }
        
        .wue-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-2xl); }
        .wue-chart { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .wue-chart h4 { font-size: 1.125rem; margin-bottom: var(--spacing-xl); color: var(--color-gray-700); }
        .wue-bars { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .wue-bar-item { display: grid; grid-template-columns: 120px 1fr 100px; align-items: center; gap: var(--spacing-md); }
        .wue-company { font-size: 0.9375rem; font-weight: 500; color: var(--color-gray-700); }
        .wue-bar-item.best .wue-company { color: var(--color-water); }
        .wue-bar-item.average .wue-company { color: var(--color-gray-500); }
        .wue-bar-track { height: 10px; background: var(--color-gray-100); border-radius: 5px; overflow: hidden; }
        .wue-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-water), var(--color-accent-blue-light)); border-radius: 5px; }
        .wue-bar-item.average .wue-bar-fill { background: var(--color-gray-400); }
        .wue-value { font-family: var(--font-display); font-weight: 600; font-size: 0.9375rem; color: var(--color-gray-700); text-align: right; }
        .water-positive { background: linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(6, 182, 212, 0.1)); border-radius: var(--radius-xl); padding: var(--spacing-xl); border: 1px solid rgba(6, 182, 212, 0.2); }
        .wp-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
        .wp-header svg { width: 28px; height: 28px; color: var(--color-water); }
        .wp-header h4 { font-size: 1.125rem; color: var(--color-primary); margin: 0; }
        .water-positive > p { color: var(--color-gray-700); margin-bottom: var(--spacing-lg); }
        .wp-meaning { background: white; border-radius: var(--radius-lg); padding: var(--spacing-lg); }
        .wp-meaning strong { display: block; margin-bottom: var(--spacing-sm); color: var(--color-water); }
        .wp-meaning p { color: var(--color-gray-600); margin-bottom: 0; font-size: 0.9375rem; }
        
        .terminology-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl); margin-bottom: var(--spacing-2xl); }
        .term-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .term-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-md); }
        .term-label { font-family: var(--font-display); font-size: 1.125rem; font-weight: 600; }
        .term-card.neutral .term-label { color: var(--color-gray-600); }
        .term-card.renewable .term-label { color: var(--color-accent-green); }
        .term-card.netzero .term-label { color: var(--color-primary); }
        .term-header svg { width: 20px; height: 20px; color: var(--color-energy); }
        .term-card p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        
        .key-question { display: flex; align-items: center; gap: var(--spacing-xl); background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); border-radius: var(--radius-xl); padding: var(--spacing-xl); color: white; }
        .question-icon { width: 56px; height: 56px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .question-icon svg { width: 28px; height: 28px; }
        .question-content h4 { font-size: 1rem; color: rgba(255, 255, 255, 0.8); margin-bottom: var(--spacing-sm); }
        .question-content p { font-size: 1.125rem; margin-bottom: 0; color: white; }
        
        .slide-brazil { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); }
        .brazil-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-2xl); margin-bottom: var(--spacing-2xl); }
        .brazil-column { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); }
        .column-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-lg); border-bottom: 2px solid var(--color-gray-100); }
        .column-header svg { width: 28px; height: 28px; }
        .brazil-column.advantages .column-header svg { color: var(--color-accent-green); }
        .brazil-column.challenges .column-header svg { color: var(--color-energy); }
        .column-header h3 { font-size: 1.125rem; margin: 0; }
        .advantage-item { display: flex; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl); }
        .advantage-item:last-child { margin-bottom: 0; }
        .adv-icon { width: 40px; height: 40px; background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(5, 150, 105, 0.2)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .adv-icon svg { width: 20px; height: 20px; color: var(--color-accent-green); }
        .adv-content h4 { font-size: 1rem; margin-bottom: var(--spacing-xs); }
        .adv-content p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        .challenge-item { padding: var(--spacing-md); background: var(--color-gray-50); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border-left: 3px solid var(--color-energy); }
        .challenge-item:last-child { margin-bottom: 0; }
        .challenge-item h4 { font-size: 0.9375rem; margin-bottom: var(--spacing-xs); }
        .challenge-item p { color: var(--color-gray-600); font-size: 0.875rem; margin-bottom: 0; }
        .brazil-highlight { display: flex; align-items: center; gap: var(--spacing-lg); background: linear-gradient(135deg, var(--color-accent-green), var(--color-accent-green-dark)); border-radius: var(--radius-xl); padding: var(--spacing-xl); color: white; }
        .brazil-highlight svg { width: 32px; height: 32px; flex-shrink: 0; }
        .brazil-highlight p { font-size: 1.125rem; margin-bottom: 0; }
        
        .classification-table { background: white; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); overflow: hidden; margin-bottom: var(--spacing-2xl); }
        .classification-table table { width: 100%; border-collapse: collapse; }
        .classification-table th, .classification-table td { padding: var(--spacing-lg); text-align: left; }
        .classification-table th { background: var(--color-primary); color: white; font-weight: 600; font-size: 0.9375rem; }
        .classification-table td { border-bottom: 1px solid var(--color-gray-100); font-size: 0.9375rem; }
        .classification-table tr:last-child td { border-bottom: none; }
        .classification-table tr:hover td { background: var(--color-gray-50); }
        .size-badge { display: inline-block; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-sm); font-weight: 600; font-size: 0.875rem; }
        .size-badge.micro { background: #fef3c7; color: #d97706; }
        .size-badge.edge { background: #dbeafe; color: #2563eb; }
        .size-badge.regional { background: #d1fae5; color: #059669; }
        .size-badge.medium { background: #ede9fe; color: #7c3aed; }
        .size-badge.large { background: #fce7f3; color: #db2777; }
        
        .tech-notes { background: var(--color-gray-100); border-radius: var(--radius-xl); padding: var(--spacing-xl); }
        .tech-notes h4 { font-size: 1rem; margin-bottom: var(--spacing-lg); color: var(--color-gray-700); }
        .tech-notes ul { list-style: none; display: flex; flex-direction: column; gap: var(--spacing-md); }
        .tech-notes li { display: flex; align-items: flex-start; gap: var(--spacing-md); font-size: 0.9375rem; color: var(--color-gray-700); }
        .tech-notes li svg { width: 20px; height: 20px; color: var(--color-accent-green); flex-shrink: 0; margin-top: 2px; }
        
        .innovation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--spacing-xl); }
        .innovation-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); transition: transform var(--transition-base), box-shadow var(--transition-base); }
        .innovation-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .innovation-icon { width: 48px; height: 48px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.2)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-lg); }
        .innovation-icon svg { width: 24px; height: 24px; color: var(--color-accent-blue); }
        .innovation-card h4 { font-size: 1rem; margin-bottom: var(--spacing-sm); }
        .innovation-card p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        
        .checklist-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-lg); }
        .checklist-item { display: flex; gap: var(--spacing-lg); background: white; border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-md); transition: transform var(--transition-base); }
        .checklist-item:hover { transform: translateX(4px); }
        .checklist-number { width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-accent-green), var(--color-accent-green-light)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 1.125rem; flex-shrink: 0; }
        .checklist-content h4 { font-size: 1rem; margin-bottom: var(--spacing-sm); }
        .checklist-content p { color: var(--color-gray-600); font-size: 0.9375rem; margin-bottom: 0; }
        
        .slide-synthesis { background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%); }
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-xl); }
        .insight-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-xl); padding: var(--spacing-xl); transition: transform var(--transition-base), background var(--transition-base); }
        .insight-card:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.15); }
        .insight-number { display: inline-flex; width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-accent-green), var(--color-accent-green-light)); color: white; border-radius: 50%; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; margin-bottom: var(--spacing-lg); }
        .insight-card h4 { color: white; font-size: 1.125rem; margin-bottom: var(--spacing-md); }
        .insight-card p { color: rgba(255, 255, 255, 0.8); font-size: 0.9375rem; margin-bottom: 0; }
        
        .slide-closing { background: linear-gradient(135deg, var(--color-gray-900), var(--color-gray-800)); color: white; }
        .closing-content { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: calc(100vh - 160px); }
        .closing-main { margin-bottom: var(--spacing-3xl); }
        .closing-main h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); color: white; margin-bottom: var(--spacing-md); }
        .closing-highlight { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; background: linear-gradient(90deg, var(--color-accent-green-light), var(--color-accent-blue-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .closing-contact { margin-bottom: var(--spacing-3xl); }
        .contact-items { display: flex; flex-wrap: wrap; gap: var(--spacing-xl); justify-content: center; }
        .contact-item { display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-md) var(--spacing-lg); background: rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg); color: rgba(255, 255, 255, 0.8); font-size: 0.9375rem; }
        .contact-item svg { width: 20px; height: 20px; color: var(--color-accent-green-light); }
        .closing-source { font-size: 0.875rem; color: var(--color-gray-500); }
        
        .back-to-top { position: fixed; bottom: var(--spacing-xl); right: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-primary); color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); opacity: 0; visibility: hidden; transition: all var(--transition-base); z-index: 100; }
        .back-to-top.visible { opacity: 1; visibility: visible; }
        .back-to-top:hover { background: var(--color-primary-light); transform: translateY(-4px); }
        .back-to-top svg { width: 24px; height: 24px; }
        
        .animate-fade-up { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s ease forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        
        @media (max-width: 1024px) {
          .split-content { grid-template-columns: 1fr; }
          .wue-explanation { grid-template-columns: 1fr; }
          .wue-benchmark { justify-self: start; }
          .wue-comparison { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 768px) {
          :root { --container-padding: 1rem; }
          .nav-links { display: none; }
          .nav-menu-btn { display: flex; }
          .slide { padding: calc(70px + var(--spacing-xl)) var(--container-padding) var(--spacing-xl); }
          .ranking-item { grid-template-columns: 100px 1fr 50px; gap: var(--spacing-sm); }
          .rank-info { flex-direction: column; align-items: flex-start; gap: 0; }
          .rank-position { font-size: 0.75rem; }
          .rank-company { font-size: 0.875rem; }
          .rank-value { font-size: 1rem; }
          .wue-bar-item { grid-template-columns: 90px 1fr 80px; gap: var(--spacing-sm); }
          .key-question { flex-direction: column; text-align: center; }
          .brazil-highlight { flex-direction: column; text-align: center; }
          .contact-items { flex-direction: column; align-items: center; }
          .classification-table { overflow-x: auto; }
          .classification-table table { min-width: 500px; }
        }
        
        @media (max-width: 480px) {
          .hero-title { font-size: 1.75rem; }
          .formula { flex-direction: column; gap: var(--spacing-md); }
          .formula-label { font-size: 1.5rem; }
          .benchmark-value .value { font-size: 2.5rem; }
          .checklist-grid { grid-template-columns: 1fr; }
          .back-to-top { width: 40px; height: 40px; bottom: var(--spacing-md); right: var(--spacing-md); }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`nav ${navHidden ? 'hidden' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
              <polyline points="7.5 19.79 7.5 14.6 3 12"/>
              <polyline points="21 12 16.5 14.6 16.5 19.79"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span>Data Center Sustainability</span>
          </div>
          <div className="nav-links">
            <a onClick={() => scrollToSection('slide-1')}>Início</a>
            <a onClick={() => scrollToSection('slide-3')}>Métricas</a>
            <a onClick={() => scrollToSection('slide-7')}>Benchmarks</a>
            <a onClick={() => scrollToSection('slide-10')}>Brasil</a>
            <a onClick={() => scrollToSection('slide-14')}>Síntese</a>
          </div>
          <button className="nav-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <a onClick={() => scrollToSection('slide-1')}>Início</a>
        <a onClick={() => scrollToSection('slide-3')}>Métricas</a>
        <a onClick={() => scrollToSection('slide-7')}>Benchmarks</a>
        <a onClick={() => scrollToSection('slide-10')}>Brasil</a>
        <a onClick={() => scrollToSection('slide-14')}>Síntese</a>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <main>
        {/* Slide 1: Title */}
        <section className="slide slide-hero" id="slide-1">
          <div className="hero-bg">
            <div className="hero-gradient"></div>
            <div className="hero-pattern"></div>
          </div>
          <div className="slide-content hero-content">
            <div className="hero-badge animate-fade-up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Análise Técnica 2024
            </div>
            <h1 className="hero-title animate-fade-up delay-1">
              Além do PUE:<br/>
              <span className="hero-highlight">A Nova Fronteira da Sustentabilidade</span><br/>
              em Data Centers
            </h1>
            <p className="hero-subtitle animate-fade-up delay-2">
              Uma Análise do Cenário Global e Brasileiro
            </p>
            <div className="hero-source animate-fade-up delay-3">
              <span className="source-label">Fonte:</span> Notebook LM
            </div>
            <a className="hero-scroll animate-fade-up delay-4" onClick={() => scrollToSection('slide-2')}>
              <span>Explorar</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </a>
          </div>
        </section>

        {/* Slide 2: A Pegada Física do Mundo Digital */}
        <section className="slide" id="slide-2">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">A Pegada Física do Mundo Digital</h2>
            </div>
            <p className="section-intro">
              A "nuvem" não é etérea. Ela é sustentada por uma infraestrutura global massiva que consome uma quantidade crescente de recursos vitais do planeta. Entender essa escala é o primeiro passo para uma gestão eficiente.
            </p>
            <div className="cards-grid cols-3">
              <div className="impact-card animate-on-scroll">
                <div className="impact-icon energy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3>Consumo de Energia</h3>
                <p>Data centers já respondem por uma parcela significativa do consumo global de eletricidade, e a demanda continua a crescer exponencialmente.</p>
              </div>
              <div className="impact-card animate-on-scroll delay-1">
                <div className="impact-icon water">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
                <h3>Consumo de Água</h3>
                <p>Um único data center hyperscale pode consumir em média <strong>2,1 milhões de litros de água por dia</strong> — o equivalente a <strong>760 milhões de litros por ano</strong>.</p>
              </div>
              <div className="impact-card animate-on-scroll delay-2">
                <div className="impact-icon carbon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3>Emissões de Carbono</h3>
                <p>O impacto ambiental vai além do consumo direto, abrangendo a pegada de carbono da energia utilizada e da cadeia de suprimentos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: A Trindade da Eficiência */}
        <section className="slide slide-alt" id="slide-3">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">A Trindade da Eficiência: As Métricas que Definem a Sustentabilidade</h2>
            </div>
            <p className="section-intro">
              Para gerenciar um impacto tão grande, a indústria desenvolveu um conjunto de métricas-chave. Cada uma oferece uma perspectiva única sobre a eficiência operacional. Juntas, elas formam o pilar da estratégia de sustentabilidade.
            </p>
            <div className="metrics-showcase">
              <div className="metric-card pue animate-on-scroll">
                <div className="metric-header">
                  <span className="metric-label">PUE</span>
                  <span className="metric-full">Power Usage Effectiveness</span>
                </div>
                <p>Mede a eficiência no uso de energia. É o pilar fundamental e a métrica mais conhecida.</p>
                <div className="metric-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
              </div>
              <div className="metric-card wue animate-on-scroll delay-1">
                <div className="metric-header">
                  <span className="metric-label">WUE</span>
                  <span className="metric-full">Water Usage Effectiveness</span>
                </div>
                <p>Mede a eficiência no uso de água, um recurso cada vez mais crítico e um fator de risco operacional.</p>
                <div className="metric-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
              </div>
              <div className="metric-card cue animate-on-scroll delay-2">
                <div className="metric-header">
                  <span className="metric-label">CUE</span>
                  <span className="metric-full">Carbon Usage Effectiveness</span>
                </div>
                <p>Mede a intensidade de carbono da energia consumida, conectando a eficiência operacional à fonte da energia.</p>
                <div className="metric-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12h8M12 8v8"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Decodificando o PUE */}
        <section className="slide" id="slide-4">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">O Pilar Fundamental: Decodificando o PUE</h2>
              <span className="section-badge">(Power Usage Effectiveness)</span>
            </div>
            <p className="section-intro">
              O PUE é a relação entre a energia total consumida pelo data center e a energia efetivamente entregue aos equipamentos de TI.
            </p>
            <div className="formula-box animate-on-scroll">
              <div className="formula">
                <span className="formula-label">PUE</span>
                <span className="formula-equals">=</span>
                <div className="formula-fraction">
                  <span className="formula-numerator">Energia Total da Instalação</span>
                  <span className="formula-denominator">Energia dos Equipamentos de TI</span>
                </div>
              </div>
              <div className="formula-target">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                <span><strong>Meta:</strong> O valor ideal é 1.0. Quanto mais próximo de 1.0, mais eficiente é a instalação.</span>
              </div>
            </div>
            <div className="pue-breakdown">
              <div className="energy-types animate-on-scroll delay-1">
                <div className="energy-type productive">
                  <h4>Energia de TI</h4>
                  <span className="energy-label">(Produtiva)</span>
                  <ul>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      Servidores
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <ellipse cx="12" cy="5" rx="9" ry="3"/>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                      </svg>
                      Armazenamento
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                        <rect x="9" y="9" width="6" height="6"/>
                        <line x1="9" y1="1" x2="9" y2="4"/>
                        <line x1="15" y1="1" x2="15" y2="4"/>
                        <line x1="9" y1="20" x2="9" y2="23"/>
                        <line x1="15" y1="20" x2="15" y2="23"/>
                        <line x1="20" y1="9" x2="23" y2="9"/>
                        <line x1="20" y1="14" x2="23" y2="14"/>
                        <line x1="1" y1="9" x2="4" y2="9"/>
                        <line x1="1" y1="14" x2="4" y2="14"/>
                      </svg>
                      Equipamentos de Rede
                    </li>
                  </ul>
                </div>
                <div className="energy-type overhead">
                  <h4>Energia de Infraestrutura</h4>
                  <span className="energy-label">(Overhead)</span>
                  <ul>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                      </svg>
                      Sistemas de Refrigeração
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                      Iluminação
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                        <line x1="12" y1="2" x2="12" y2="12"/>
                      </svg>
                      Perdas em No-breaks (UPS)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="measurement-levels animate-on-scroll delay-2">
              <h4>A precisão do PUE depende de onde se mede:</h4>
              <div className="levels-grid">
                <div className="level">
                  <span className="level-number">1</span>
                  <div className="level-content">
                    <strong>Nível 1 (Básico)</strong>
                    <span>Medição na saída do UPS.</span>
                  </div>
                </div>
                <div className="level">
                  <span className="level-number">2</span>
                  <div className="level-content">
                    <strong>Nível 2 (Intermediário)</strong>
                    <span>Medição na saída dos PDUs.</span>
                  </div>
                </div>
                <div className="level">
                  <span className="level-number">3</span>
                  <div className="level-content">
                    <strong>Nível 3 (Avançado)</strong>
                    <span>Medição na entrada do próprio equipamento de TI (a mais precisa).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: WUE */}
        <section className="slide slide-alt" id="slide-5">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">O Recurso Crítico: A Ascensão do WUE</h2>
              <span className="section-badge">(Water Usage Effectiveness)</span>
            </div>
            <p className="section-intro">
              O WUE mede a eficiência do uso da água, principalmente para refrigeração, em relação à energia consumida pelos equipamentos de TI.
            </p>
            <div className="formula-box water animate-on-scroll">
              <div className="formula">
                <span className="formula-label">WUE</span>
                <span className="formula-equals">=</span>
                <div className="formula-fraction">
                  <span className="formula-numerator">Uso Anual de Água (Litros)</span>
                  <span className="formula-denominator">Energia dos Equipamentos de TI (kWh)</span>
                </div>
              </div>
              <div className="formula-target">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span><strong>Meta:</strong> Quanto menor o valor, mais eficiente é o uso da água.</span>
              </div>
            </div>
            <div className="wue-explanation animate-on-scroll delay-1">
              <div className="wue-importance">
                <h4>Por que a água é crucial?</h4>
                <p>Sistemas de refrigeração evaporativa, essenciais para grandes instalações, consomem enormes volumes de água. A crescente escassez hídrica em diversas regiões torna a gestão da água um fator de <strong>resiliência</strong> e <strong>licença social para operar</strong>.</p>
              </div>
              <div className="wue-benchmark">
                <div className="benchmark-value">
                  <span className="value">1.80</span>
                  <span className="unit">L/kWh</span>
                </div>
                <span className="benchmark-label">Média da indústria</span>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 6: CUE e Certificações */}
        <section className="slide" id="slide-6">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title">A Perspectiva do Carbono: CUE e o Ecossistema de Certificações</h2>
            </div>
            <div className="split-content">
              <div className="cue-focus animate-on-scroll">
                <h3>Foco no CUE <span>(Carbon Usage Effectiveness)</span></h3>
                <p>Mede a quantidade de emissões de dióxido de carbono (em kg de CO₂ equivalente) por kWh consumido pelos equipamentos de TI.</p>
                <div className="formula-box carbon small">
                  <div className="formula">
                    <span className="formula-label">CUE</span>
                    <span className="formula-equals">=</span>
                    <div className="formula-fraction">
                      <span className="formula-numerator">Emissões de CO₂eq</span>
                      <span className="formula-denominator">Energia dos Equipamentos de TI (kWh)</span>
                    </div>
                  </div>
                </div>
                <p className="cue-note">Embora menos comum, o CUE é a métrica que conecta diretamente a operação do data center ao seu impacto climático, dependendo fundamentalmente da <strong>matriz energética da sua localização</strong>.</p>
              </div>
              <div className="certifications animate-on-scroll delay-1">
                <h3>A sustentabilidade é um ecossistema.</h3>
                <div className="cert-cards">
                  <div className="cert-card">
                    <div className="cert-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h4>I-REC</h4>
                    <span>Certificação de Energia Renovável</span>
                    <p>Mecanismos que certificam a compra de energia de fontes limpas, embora não garantam o consumo 24/7 de energia renovável.</p>
                  </div>
                  <div className="cert-card">
                    <div className="cert-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <h4>Uptime Institute TIER</h4>
                    <span>Resiliência e Design</span>
                    <p>Padrões que garantem resiliência e boas práticas de design, que indiretamente impactam a eficiência.</p>
                  </div>
                  <div className="cert-card">
                    <div className="cert-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <h4>ANSI/TIA-942</h4>
                    <span>Design Abrangente</span>
                    <p>Padrão abrangente para o design de data centers, cobrindo infraestrutura e resiliência.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 7: PUE dos Hyperscalers */}
        <section className="slide slide-dark" id="slide-7">
          <div className="slide-content">
            <div className="section-header light">
              <span className="section-number">06</span>
              <h2 className="section-title">O Pódio da Eficiência: O PUE dos Hyperscalers Globais</h2>
            </div>
            <p className="section-intro light">
              Os gigantes da tecnologia operam com níveis de eficiência energética muito superiores à média da indústria, estabelecendo o padrão ouro para o setor.
            </p>
            <div className="pue-ranking animate-on-scroll">
              <h3>PUE Médio Anual</h3>
              <div className="ranking-bars">
                <div className="ranking-item leader">
                  <div className="rank-info">
                    <span className="rank-position">1º</span>
                    <span className="rank-company">Meta Platforms</span>
                  </div>
                  <div className="rank-bar-container">
                    <div className="rank-bar" style={{ width: '92%' }}></div>
                  </div>
                  <span className="rank-value">1.08</span>
                </div>
                <div className="ranking-item">
                  <div className="rank-info">
                    <span className="rank-position">2º</span>
                    <span className="rank-company">Google</span>
                  </div>
                  <div className="rank-bar-container">
                    <div className="rank-bar" style={{ width: '90%' }}></div>
                  </div>
                  <span className="rank-value">1.10</span>
                </div>
                <div className="ranking-item">
                  <div className="rank-info">
                    <span className="rank-position">3º</span>
                    <span className="rank-company">Microsoft</span>
                  </div>
                  <div className="rank-bar-container">
                    <div className="rank-bar" style={{ width: '82%' }}></div>
                  </div>
                  <span className="rank-value">1.18</span>
                </div>
                <div className="ranking-item">
                  <div className="rank-info">
                    <span className="rank-position">4º</span>
                    <span className="rank-company">Alibaba</span>
                  </div>
                  <div className="rank-bar-container">
                    <div className="rank-bar" style={{ width: '78%' }}></div>
                  </div>
                  <span className="rank-value">1.22</span>
                </div>
                <div className="ranking-item average">
                  <div className="rank-info">
                    <span className="rank-position">—</span>
                    <span className="rank-company">Média da Indústria</span>
                  </div>
                  <div className="rank-bar-container">
                    <div className="rank-bar" style={{ width: '42%' }}></div>
                  </div>
                  <span className="rank-value">1.58</span>
                </div>
              </div>
              <p className="ranking-source">(Uptime Institute)</p>
            </div>
            <div className="efficiency-factors animate-on-scroll delay-1">
              <p>Essa eficiência é resultado de <strong>design otimizado em escala massiva</strong>, <strong>P&D em refrigeração</strong>, <strong>uso de IA para gestão de cargas</strong> e <strong>localização estratégica em climas mais frios</strong>.</p>
            </div>
          </div>
        </section>

        {/* Slide 8: WUE e Water Positive */}
        <section className="slide" id="slide-8">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">07</span>
              <h2 className="section-title">A Batalha pela Água: WUE e os Compromissos 'Water Positive'</h2>
            </div>
            <p className="section-intro">
              A gestão da água tornou-se uma prioridade estratégica, com os líderes competindo em eficiência e prometendo devolver ao meio ambiente mais água do que consomem.
            </p>
            <div className="wue-comparison animate-on-scroll">
              <div className="wue-chart">
                <h4>WUE (L/kWh)</h4>
                <div className="wue-bars">
                  <div className="wue-bar-item best">
                    <span className="wue-company">Scaleway</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '5%' }}></div>
                    </div>
                    <span className="wue-value">0.00 - 0.20</span>
                  </div>
                  <div className="wue-bar-item">
                    <span className="wue-company">AWS</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '10%' }}></div>
                    </div>
                    <span className="wue-value">0.19</span>
                  </div>
                  <div className="wue-bar-item">
                    <span className="wue-company">Meta</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '11%' }}></div>
                    </div>
                    <span className="wue-value">0.20</span>
                  </div>
                  <div className="wue-bar-item">
                    <span className="wue-company">OVH</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '14%' }}></div>
                    </div>
                    <span className="wue-value">0.26</span>
                  </div>
                  <div className="wue-bar-item">
                    <span className="wue-company">Microsoft</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '27%' }}></div>
                    </div>
                    <span className="wue-value">0.49</span>
                  </div>
                  <div className="wue-bar-item average">
                    <span className="wue-company">Média EUA (DoE)</span>
                    <div className="wue-bar-track">
                      <div className="wue-bar-fill" style={{ width: '100%' }}></div>
                    </div>
                    <span className="wue-value">1.80</span>
                  </div>
                </div>
              </div>
              <div className="water-positive animate-on-scroll delay-1">
                <div className="wp-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                  <h4>O Compromisso 'Water Positive by 2030'</h4>
                </div>
                <p><strong>AWS, Google, Microsoft e Meta</strong> se comprometeram a serem "water positive" até 2030.</p>
                <div className="wp-meaning">
                  <strong>O que significa?</strong>
                  <p>A meta é retornar mais água para as comunidades e o meio ambiente (através de projetos de reabastecimento) do que a consumida em suas operações diretas.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 9: Analisando o Discurso */}
        <section className="slide slide-alt" id="slide-9">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">08</span>
              <h2 className="section-title">Entre a Realidade e Retórica: Analisando o Discurso de Sustentabilidade</h2>
            </div>
            <p className="section-intro">
              Os números de eficiência são impressionantes, mas os compromissos de sustentabilidade exigem um olhar crítico. A terminologia pode ser vaga e as metodologias de contabilidade variam.
            </p>
            <div className="terminology-grid animate-on-scroll">
              <div className="term-card neutral">
                <div className="term-header">
                  <span className="term-label">Carbon Neutral</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p>Geralmente significa compensar emissões com a compra de créditos de carbono, cuja eficácia é frequentemente debatida.</p>
              </div>
              <div className="term-card renewable">
                <div className="term-header">
                  <span className="term-label">100% Renewable</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p>Muitas vezes se refere a uma contabilidade baseada no mercado (market-based), onde a empresa compra uma quantidade de energia renovável equivalente ao seu consumo anual, mas não necessariamente consome energia limpa 24/7 em suas instalações (location-based).</p>
              </div>
              <div className="term-card netzero">
                <div className="term-header">
                  <span className="term-label">Net-Zero Carbon</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p>Um compromisso mais rigoroso de reduzir as emissões ao mínimo e neutralizar o restante, mas a definição e o escopo podem variar.</p>
              </div>
            </div>
            <div className="key-question animate-on-scroll delay-1">
              <div className="question-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="question-content">
                <h4>A Questão Chave</h4>
                <p>O impacto real depende da <strong>descarbonização da rede elétrica local</strong> onde o data center opera.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 10: Brasil */}
        <section className="slide slide-brazil" id="slide-10">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">09</span>
              <h2 className="section-title">Aterrissando no Brasil: Vantagens Competitivas e Desafios Estruturais</h2>
            </div>
            <div className="brazil-grid">
              <div className="brazil-column advantages animate-on-scroll">
                <div className="column-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  <h3>Vantagens Estratégicas</h3>
                </div>
                <div className="advantage-item">
                  <div className="adv-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <div className="adv-content">
                    <h4>Matriz Energética Limpa</h4>
                    <p>Com mais de <strong>80% de fontes renováveis</strong>, o Brasil tem uma vantagem inerente para alcançar um CUE baixo. A sustentabilidade energética é um trunfo natural.</p>
                  </div>
                </div>
                <div className="advantage-item">
                  <div className="adv-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div className="adv-content">
                    <h4>Polo de Inovação</h4>
                    <p>O país não é apenas consumidor; existem focos de inovação em hardware e soluções de eficiência, como veremos a seguir.</p>
                  </div>
                </div>
              </div>
              <div className="brazil-column challenges animate-on-scroll delay-1">
                <div className="column-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <h3>Desafios Locais</h3>
                </div>
                <div className="challenge-item">
                  <h4>Falta de Padronização</h4>
                  <p>Não há uma classificação de porte de data center universalmente aceita no mercado local, dificultando benchmarks e regulamentação.</p>
                </div>
                <div className="challenge-item">
                  <h4>Carência de Fabricantes</h4>
                  <p>Há uma escassez de fabricantes nacionais especializados em sistemas de refrigeração de alta eficiência para data centers.</p>
                </div>
                <div className="challenge-item">
                  <h4>Maturidade das Métricas</h4>
                  <p>A medição de WUE ainda é incipiente, especialmente em data centers de pequeno e médio porte.</p>
                </div>
              </div>
            </div>
            <div className="brazil-highlight animate-on-scroll delay-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <p>No Brasil, o <strong>CUE deveria ser prioridade</strong>, dado que nossa matriz elétrica é majoritariamente limpa.</p>
            </div>
          </div>
        </section>

        {/* Slide 11: Classificação por Porte */}
        <section className="slide" id="slide-11">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">10</span>
              <h2 className="section-title">Decifrando o Porte: Uma Classificação Prática para o Mercado Brasileiro</h2>
            </div>
            <p className="section-intro">
              Diante da falta de um padrão universal, a potência elétrica (MW) surge como o critério mais relevante para classificação, pois é o principal fator de custo. Apresentamos um modelo de referência prático adotado no setor.
            </p>
            <div className="classification-table animate-on-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Porte do Data Center</th>
                    <th>Parâmetros Indicativos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="size-badge micro">Micro Edge</span></td>
                    <td>Até 100 kW</td>
                  </tr>
                  <tr>
                    <td><span className="size-badge edge">Edge</span></td>
                    <td>50 kVA a 500 kVA (até ~30 racks)</td>
                  </tr>
                  <tr>
                    <td><span className="size-badge regional">Regional</span></td>
                    <td>20 a 80 racks (até 2 MW)</td>
                  </tr>
                  <tr>
                    <td><span className="size-badge medium">Médio Porte</span></td>
                    <td>~400 racks (≈ 10 MW)</td>
                  </tr>
                  <tr>
                    <td><span className="size-badge large">Grande Porte</span></td>
                    <td>Acima desses valores</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tech-notes animate-on-scroll delay-1">
              <h4>Observações Técnicas</h4>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  A densidade típica em hyperscale é de <strong>4-5 kVA por rack</strong>.
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Potências acima de <strong>20 kVA por rack</strong> são consideradas de alta densidade.
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Em data centers de pequeno porte, a medição formal de WUE ainda não é uma prática comum.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Slide 12: Inovação no Brasil */}
        <section className="slide slide-alt" id="slide-12">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">11</span>
              <h2 className="section-title">Epicentros de Inovação: Soluções e Oportunidades no Brasil</h2>
            </div>
            <p className="section-intro">
              O cenário brasileiro, com seus desafios e vantagens, fomenta soluções únicas e abre caminho para novas tecnologias de eficiência.
            </p>
            <div className="innovation-grid animate-on-scroll">
              <div className="innovation-card">
                <div className="innovation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                  </svg>
                </div>
                <h4>Hardware e Refrigeração</h4>
                <p>Desenvolvimento de patentes locais para liquid cooling, como o radiador da <strong>CloudVBOX em São Paulo</strong>.</p>
              </div>
              <div className="innovation-card">
                <div className="innovation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
                <h4>Novas Fontes de Energia</h4>
                <p>Discussões ativas sobre o uso de <strong>geradores a hidrogênio</strong> como alternativa para energia de backup.</p>
              </div>
              <div className="innovation-card">
                <div className="innovation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h4>Gestão Inteligente de Energia</h4>
                <p>Estratégias como captar energia em horários de menor custo para resfriar água e utilizá-la nos horários de pico.</p>
              </div>
              <div className="innovation-card">
                <div className="innovation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h4>Data Centers como Laboratórios</h4>
                <p>Utilização de infraestruturas como campo de prova para <strong>experimentação de novas tecnologias</strong> energéticas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 13: Checklist Estratégico */}
        <section className="slide" id="slide-13">
          <div className="slide-content">
            <div className="section-header">
              <span className="section-number">12</span>
              <h2 className="section-title">Checklist Estratégico: Ações para Otimizar a Eficiência Agora</h2>
            </div>
            <p className="section-intro">
              Melhorar o PUE e a sustentabilidade geral é um processo contínuo que combina design inteligente, tecnologia e boas práticas operacionais.
            </p>
            <div className="checklist-grid animate-on-scroll">
              <div className="checklist-item">
                <div className="checklist-number">1</div>
                <div className="checklist-content">
                  <h4>Otimizar o Fluxo de Ar</h4>
                  <p>Implementar contenção de corredores quentes/frios e usar painéis de vedação (blanking panels) em racks vazios.</p>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-number">2</div>
                <div className="checklist-content">
                  <h4>Otimizar a Refrigeração</h4>
                  <p>Usar drives de velocidade variável (VSDs) em ventiladores e bombas; e explorar free cooling onde o clima permite.</p>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-number">3</div>
                <div className="checklist-content">
                  <h4>Modernizar o Hardware</h4>
                  <p>Substituir equipamentos de TI antigos por modelos mais eficientes (maior performance por watt).</p>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-number">4</div>
                <div className="checklist-content">
                  <h4>Ajustar a Temperatura</h4>
                  <p>Operar o data center em temperaturas ligeiramente mais altas, dentro das diretrizes seguras da ASHRAE, para reduzir drasticamente o consumo de refrigeração.</p>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-number">5</div>
                <div className="checklist-content">
                  <h4>Virtualizar e Consolidar</h4>
                  <p>Reduzir o número de servidores físicos consolidando cargas de trabalho em máquinas virtuais.</p>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-number">6</div>
                <div className="checklist-content">
                  <h4>Medir para Gerenciar</h4>
                  <p>Implementar um sistema de medição robusto (DCIM) para calcular PUE, WUE e outros indicadores de forma contínua.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 14: Síntese Estratégica */}
        <section className="slide slide-synthesis" id="slide-14">
          <div className="slide-content">
            <div className="section-header light">
              <span className="section-number">13</span>
              <h2 className="section-title">Síntese Estratégica: Quatro Insights para o Futuro dos Data Centers</h2>
            </div>
            <div className="insights-grid animate-on-scroll">
              <div className="insight-card">
                <div className="insight-number">1</div>
                <h4>Métricas Essenciais, mas Imperfeitas</h4>
                <p>PUE, WUE e CUE são ferramentas indispensáveis, mas é crucial entender suas nuances, metodologias de cálculo e limitações para uma análise precisa.</p>
              </div>
              <div className="insight-card">
                <div className="insight-number">2</div>
                <h4>Líderes Globais Ditadores de Ritmo</h4>
                <p>Os hyperscalers definem o benchmark de eficiência, mas seu discurso de marketing sobre sustentabilidade deve ser analisado criticamente, separando o progresso real da retórica.</p>
              </div>
              <div className="insight-card">
                <div className="insight-number">3</div>
                <h4>O Cenário Único do Brasil</h4>
                <p>A matriz energética limpa é um trunfo estratégico que coloca o CUE em destaque. No entanto, desafios como a padronização e o desenvolvimento da cadeia de suprimentos local precisam ser superados.</p>
              </div>
              <div className="insight-card">
                <div className="insight-number">4</div>
                <h4>Eficiência é Estratégia, Não Apenas Custo</h4>
                <p>Em um mundo de recursos limitados e crescente escrutínio, a sustentabilidade não é mais apenas sobre reduzir a conta de energia. É sobre resiliência operacional, vantagem competitiva e licença para crescer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 15: Closing */}
        <section className="slide slide-closing" id="slide-15">
          <div className="slide-content closing-content">
            <div className="closing-main">
              <h2>A eficiência de hoje define a</h2>
              <p className="closing-highlight">competitividade de amanhã.</p>
            </div>
            <div className="closing-contact">
              <div className="contact-items">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Obrigado!
                </div>
              </div>
            </div>
            <p className="closing-source">Fonte: Notebook LM</p>
          </div>
        </section>
      </main>

      {/* Back to Top */}
      <button 
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </>
  );
};

export default Index;
