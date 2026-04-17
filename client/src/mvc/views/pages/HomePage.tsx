import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { playgroundCardImageUrl } from '../../models/playgroundImage';
import { DEFAULT_SHOWCASE_SLIDES, type ShowcaseSlide } from '../../models/showcaseDefaults';
const defaultHeroPortrait = '/pTliQDNkL6D6AXQESYbLMpkK8U.jpg';

function Magnetic({ children, className, href, target, rel, onClick, 'aria-label': ariaLabel }: any) {
  const ref = useRef<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style = { transform: `translate(${position.x}px, ${position.y}px)`, transition: position.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out' };

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={className} onMouseMove={handleMouse} onMouseLeave={reset} aria-label={ariaLabel} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={className} onClick={onClick} onMouseMove={handleMouse} onMouseLeave={reset} aria-label={ariaLabel} style={style}>
      {children}
    </button>
  );
}

export function HomePage() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [playgroundItems, setPlaygroundItems] = useState<any[]>([]);
  const [heroPortrait, setHeroPortrait] = useState(defaultHeroPortrait);
  const [adminProfileImage, setAdminProfileImage] = useState('');
  const [showcaseSlidesFromApi, setShowcaseSlidesFromApi] = useState<ShowcaseSlide[] | undefined>(undefined);

  const showcaseImages = useMemo(() => {
    if (showcaseSlidesFromApi?.length) return showcaseSlidesFromApi;
    return DEFAULT_SHOWCASE_SLIDES;
  }, [showcaseSlidesFromApi]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || '/api'}/portfolio/playground`)
      .then(res => res.json())
      .then(data => setPlaygroundItems(data))
      .catch(err => console.error("Error fetching playground data:", err));

    const fetchSettings = () => {
      fetch(`${import.meta.env.VITE_API_BASE || '/api'}/settings`)
        .then(res => res.json())
        .then(data => {
          if (data.heroImage) setHeroPortrait(data.heroImage);
          if (data.adminProfileImage) setAdminProfileImage(data.adminProfileImage);
          if (Array.isArray(data.showcaseSlides) && data.showcaseSlides.length > 0) {
            setShowcaseSlidesFromApi(data.showcaseSlides);
          }
        })
        .catch(() => {});
    };

    fetchSettings();

    // Poll for settings changes every 5 seconds
    const settingsInterval = setInterval(fetchSettings, 5000);

    // Also refetch when page becomes visible (after tab switch)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(settingsInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setCurrentPhotoIndex((i) => {
      const len = showcaseImages.length;
      if (len === 0) return 0;
      return i >= len ? len - 1 : i;
    });
  }, [showcaseImages.length]);

  // Auto-scroll photo carousel
  useEffect(() => {
    if (showcaseImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showcaseImages.length]);

  const [loaderHidden, setLoaderHidden] = useState(false);
  const [hoverImgActive, setHoverImgActive] = useState(false);
  const [hoverImgSrc, setHoverImgSrc] = useState('');
  const [hoverImgPos, setHoverImgPos] = useState({ x: 0, y: 0 });

  // Work card images
  const workImages = [
    'https://images.unsplash.com/photo-1567726843492-df0484bb0b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmYXJtJTIwbmF0dXJlfGVufDF8fHx8MTc3NTc0MjAwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1775687902964-dbe8ecd23485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3NTcyNDIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1758520387659-9956c4516891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBzaG9wcGluZyUyMHJldGFpbHxlbnwxfHx8fDE3NzU3NDIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1567726843492-df0484bb0b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmYXJtJTIwbmF0dXJlfGVufDF8fHx8MTc3NTc0MjAwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1775687902964-dbe8ecd23485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3NTcyNDIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1758520387659-9956c4516891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBzaG9wcGluZyUyMHJldGFpbHxlbnwxfHx8fDE3NzU3NDIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ];

  // Playground images
  const playgroundImages = [
    { url: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NTczOTEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Abstract Flow', type: 'Art Direction' },
    { url: 'https://images.unsplash.com/photo-1528262004378-a108d795029c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzaWduJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTcxODczN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Minimal Essence', type: 'Brand Identity' },
    { url: 'https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwcG9zdGVyJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzc1NzQyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Type Study', type: 'Typography' },
    { url: 'https://images.unsplash.com/photo-1610483296893-03b2c72625f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBjbGVhbnxlbnwxfHx8fDE3NzU3NDIwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Product Focus', type: 'Photography' },
    { url: 'https://images.unsplash.com/photo-1704040686684-be330b48412e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzU3NDIwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Spatial Design', type: 'Architecture' },
    { url: 'https://images.unsplash.com/photo-1635430450255-79da509cb140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMHJlbmRlciUyMGdyYXBoaWN8ZW58MXx8fHwxNzc1NzQyMDA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: '3D Exploration', type: '3D Design' },
    { url: 'https://images.unsplash.com/photo-1732022427254-daf058e80795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGRlc2lnbiUyMHN0dWRpb3xlbnwxfHx8fDE3NzU3NDIwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Brand System', type: 'Branding' },
    { url: 'https://images.unsplash.com/photo-1642015927464-9df06aec531d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwc3R5bGV8ZW58MXx8fHwxNzc1NzE4NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: 'Editorial Style', type: 'Fashion' }
  ];

  const marqueeItemsRef = useRef<string[]>(['AMBADI TRRIKAALA', 'ART DIRECTOR', 'BANGALORE, INDIA', 'SINCE 2014', 'BRAND STRATEGY', 'CREATIVE PROFESSIONAL']);

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderHidden(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll-based hero mask animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById('hero');

      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollProgress = Math.min(scrollY / heroHeight, 1);

        // Apply mask and transform effects
        heroSection.style.setProperty('--scroll-progress', scrollProgress.toString());

        // Parallax effect on hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent instanceof HTMLElement) {
          heroContent.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 - scrollProgress * 0.2})`;
          heroContent.style.opacity = (1 - scrollProgress * 0.8).toString();
        }

        // Mask effect on profile image
        const profileBg = document.querySelector('.hero-profile-bg');
        if (profileBg instanceof HTMLElement) {
          profileBg.style.transform = `scale(${1 + scrollProgress * 0.3})`;
          profileBg.style.opacity = (0.8 - scrollProgress * 0.8).toString();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Work card hover
  const handleWorkCardMouseEnter = (imgSrc: string, e: React.MouseEvent) => {
    setHoverImgSrc(imgSrc);
    setHoverImgActive(true);
  };

  const handleWorkCardMouseMove = (e: React.MouseEvent) => {
    setHoverImgPos({ x: e.clientX, y: e.clientY });
  };

  const handleWorkCardMouseLeave = () => {
    setHoverImgActive(false);
  };

  return (
    <div className="portfolio-wrapper">
      {/* Loader */}
      <div id="loader" className={loaderHidden ? 'hidden' : ''}>
        <div className="loader-text">
          <span>AMBADI</span>
        </div>
        <div className="loader-bar"></div>
      </div>

      {/* Nav */}
      <nav>
        <a href="#hero" className="nav-logo">AMBADI TRRIKAALA</a>
        <div className="nav-links">
          <a href="#work">WORK</a>
          <a href="#playground">PLAYGROUND</a>
          <a href="#about">ABOUT</a>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero">
        <div className="hero-profile-bg">
          <img
            src={heroPortrait}
            alt="Hero Background"
            className="hero-profile-image"
          />
        </div>

        <div className="hero-content">
          <div className="hero-name-tag">AMBADI TRRIKAALA</div>
          <div className="hero-main-text">
            <div className="hero-hi-text">HI THERE</div>
            <div className="hero-iam-container">
              <span className="hero-iam-text">I AM</span>
              <span className="hero-rad-text">AMBADI</span>
              <div className="hero-asterisk">*</div>
            </div>
          </div>
          <div className="hero-role-tag">ART DIRECTOR</div>
        </div>

        <div className="hero-location">
          <div className="hero-location-main">Based in Bangalore, India</div>
        </div>

        <div className="hero-scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

      </section>

      {/* Marquee 1 */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            marqueeItemsRef.current.map((item, j) => (
              <div key={`marquee1-${i}-${j}`} className="marquee-item">
                <span className="dot"></span>
                <span>{item}</span>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Intro */}
      <section id="intro">
        <div className="reveal">
          <p className="intro-big">
            Indian<br />
            Art Director<br />
            <em>Jack of</em><br />
            Creative trades<br />
            and master of<br />
            <strong>some!</strong>
          </p>
        </div>
        <div className="reveal reveal-delay-2">
          <p className="intro-subtitle">About</p>
          <p className="intro-text">
            Started my career as an artist and reaching milestones of a creative professional.
          </p>
          <p className="intro-text" style={{ marginTop: '16px' }}>
            After 10 years of experiencing several mediums and job roles, such as Brand Strategy/Identity, Mainline advertising, Digital mediums and film making as well.
          </p>
        </div>
      </section>

      {/* Logos Strip */}
      <div className="logos-strip">
        <div className="logos-track">
          {[...Array(20)].map((_, i) => (
            <div key={`logo-${i}`} className="logo-placeholder"></div>
          ))}
        </div>
      </div>

      {/* Marquee 2 */}
      <div className="marquee-wrap">
        <div className="marquee-track reverse">
          {[...Array(4)].map((_, i) => (
            marqueeItemsRef.current.map((item, j) => (
              <div key={`marquee2-${i}-${j}`} className="marquee-item">
                <span className="dot"></span>
                <span>{item}</span>
              </div>
            ))
          ))}
        </div>
      </div>


      {/* Playground */}
      <section id="playground">
        <div className="section-num reveal">PLAY — IF YOU JUST LIKE COOL STUFF ✦</div>
        <div className="section-label reveal reveal-delay-1">PLAYGROUND</div>
        <div className="play-grid">
          {playgroundItems.map((item, i) => (
            <Link key={item._id} to={`/playground/${item._id}`} className="play-card">
              <img
                src={playgroundCardImageUrl(item.image, playgroundImages[i % playgroundImages.length]?.url || playgroundImages[0].url)}
                alt={item.title}
              />
              <div className="play-card-info">
                <div className="play-card-title">{item.title}</div>
                <div className="play-card-type">{item.type}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="about-bento">
          {/* Row 1: Bio | Profile Photo | Experience */}
          <div className="bento-bio about-bio-card">
            <h1 className="bio-hero-text">
              Indian<br />
              Art Director<br />
              <span className="bio-italic">Jack of</span><br />
              Creative trades<br />
              and master of<br />
              some!
            </h1>

          </div>

          <div className="bento-profile profile-card">
            <img
              src={adminProfileImage || "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGluZGlhbiUyMG1hbnxlbnwxfHx8fDE3NzU3NDI0NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
              alt="Ambadi Trrikaala"
              className="profile-image"
            />
            <div className="profile-overlay">
              <div className="profile-greeting">Olá! 👋</div>
              <div className="profile-text">
                <p className="profile-intro">My name is Ambadi Trrikaala</p>
                <p className="profile-contact-text">Grab my email, and get in touch 🤙</p>
              </div>
            </div>
          </div>

          <div className="bento-experience experience-timeline-card">
            <h3 className="card-section-title">EXPERIENCE</h3>
            <div className="experience-timeline">
              {[
                { years: '2025 — Now', role: 'Assistant Creative Director', company: 'Stanley Lifestyles', location: 'Bangalore' },
                { years: '2024 — 2025', role: 'Creative Controller', company: 'Sunny Side Up', location: 'Bangalore' },
                { years: '2023 — 2024', role: 'Art Director', company: 'Moshi Moshi', location: 'Bangalore' },
                { years: '2020 — 2023', role: 'Senior Designer', company: 'Creative Agency', location: 'Bangalore' },
                { years: '2018 — 2020', role: 'UI/UX Designer', company: 'Digital Studio', location: 'Bangalore' },
                { years: '2014 — 2018', role: 'Graphic Designer', company: 'Design Firm', location: 'Bangalore' }
              ].map((exp, i) => (
                <div key={i} className="timeline-entry">
                  <div className="timeline-years">{exp.years}</div>
                  <div className="timeline-details">
                    <div className="timeline-role">{exp.role}</div>
                    <div className="timeline-company">{exp.company} · {exp.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Background | Tools | Education */}
          <div className="bento-background background-card">
            <h3 className="card-section-title">MY BACKGROUND</h3>
            <div className="background-content">
              <p>
                Growing up in <span className="text-highlight">Calicut, Kerala</span>, my home was a fusion of
                creativity and analytical thinking, influenced by my father's career as a photographer and my
                mother's profession as a lawyer. This unique blend has deeply shaped my perspective.
              </p>
              <p>
                My <span className="text-highlight">fascination with technology</span> began at age four, sparked by
                curiosity about how computers work. Although I pursued a degree in Computer Science, my true passion
                lies in the <span className="text-highlight">transformative power of great design craft</span>, mainly
                inspired by the design craftsmanship behind Apple products.
              </p>
              <p>
                My curiosity led me to wonder: <em>could I also create something that can evoke this effect on people?</em>
              </p>
              <p>
                Today, I apply my <span className="text-highlight">multidisciplinary design skills</span>, aiming to
                create solutions that make people feel and remember, elevating everyday experiences into inspiring
                solutions.
              </p>
              <p className="signature">Ambadi</p>
            </div>
          </div>

          <div className="bento-tools tools-card">
            <h3 className="card-section-title">TOOL STACK</h3>
            <div className="tools-icons">
              {[
                { name: 'Figma', slug: 'figma', color: '#F24E1E' },
                { name: 'Ps', slug: 'adobephotoshop', color: '#31A8FF' },
                { name: 'Sketch', slug: 'sketch', color: '#F7B500' },
                { name: 'Ai', slug: 'adobeillustrator', color: '#FF9A00' },
                { name: 'Slack', slug: 'slack', color: '#4A154B' },
                { name: 'Linear', slug: 'linear', color: '#5E6AD2' },
                { name: 'Notion', slug: 'notion', color: '#000000' },
                { name: 'Webflow', slug: 'webflow', color: '#4353FF' },
                { name: 'Ae', slug: 'adobeaftereffects', color: '#9999FF' },
                { name: 'Pr', slug: 'adobepremierepro', color: '#9999FF' },
                { name: 'Indd', slug: 'adobeindesign', color: '#FF3366' },
                { name: 'Cd', slug: 'coreldraw', color: '#00DDA1' },
                { name: 'C4D', slug: 'cinema4d', color: '#00B7F0' },
                { name: 'Spotify', slug: 'spotify', color: '#1DB954' }
              ].map((tool, i) => (
                <div key={i} className="tool-icon" style={{ background: tool.color }} title={tool.name}>
                  <img src={`https://api.iconify.design/simple-icons/${tool.slug}.svg?color=white`} alt={tool.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bento-education education-timeline-card">
            <h3 className="card-section-title">EDUCATION</h3>
            <div className="experience-timeline">
              {[
                { years: '2010 — 2014', degree: 'Computer Science', school: 'University of Kerala' },
                { years: '2015', degree: 'Design Certification', school: 'Design Institute' },
                { years: '2018', degree: 'UX Design Course', school: 'Online Academy' }
              ].map((edu, i) => (
                <div key={i} className="timeline-entry">
                  <div className="timeline-years">{edu.years}</div>
                  <div className="timeline-details">
                    <div className="timeline-role">{edu.degree}</div>
                    <div className="timeline-company">{edu.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-photo photo-showcase-card">
            {showcaseImages.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt}
                className={`showcase-image ${idx === currentPhotoIndex ? 'active' : ''}`}
              />
            ))}
            <div className="photo-carousel-dots">
              {showcaseImages.map((_, idx) => (
                <span key={idx} className={`dot ${idx === currentPhotoIndex ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-new">
        <div className="footer-giant-bg">
          THANK <span className="footer-asterisk">✱</span> YOU
        </div>

        <div className="footer-bottom-row">
          <div className="footer-col-left">
            <p>© 2026 · Ambadi Trrikaala</p>
            <p className="footer-subtext">ALL RIGHTS RESERVED</p>
          </div>

          <div className="footer-col-center">
            <Magnetic href="mailto:ammbaditrrikaala@gmail.com" className="footer-icon-btn" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </Magnetic>
            <Magnetic href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-icon-btn" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Magnetic>
            <Magnetic href="https://www.behance.net/sacredtrrikaala" target="_blank" rel="noreferrer" className="footer-icon-btn" aria-label="Behance">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.295-2.008 2.885-4.516 2.885-3.63 0-5.21-2.584-5.21-5.875 0-3.324 1.579-5.885 5.37-5.885 3.324 0 5.105 2.158 5.23 5.432h-8.03c.126 1.948 1.485 3.01 3.232 3.01 1.106 0 1.99-.443 2.506-1.567l1.418.01m-3.41-3.664c-.116-1.285-.806-2.613-2.316-2.613-1.42 0-2.316.98-2.505 2.613h4.82zM4.137 11.272c-.894 0-1.637-.1-2.137-.179v-2.022c.48-.063 1.116-.095 1.768-.095 1.569 0 2.453.642 2.453 1.905 0 1.232-.884 1.832-2.126 1.832h-1.99v4.2c.463-.032 1.053-.064 1.748-.064 1.83 0 2.894.61 2.894 2.148 0 1.347-1.127 2.115-2.674 2.115-.65 0-1.45-.04-1.968-.135zm.388 6.556v-4.084c.82 0 1.4.24 1.4 1.02 0 .915-.66 1.252-1.4 1.252zm0-6.198v-3.715c.674 0 1.17.21 1.17.842 0 .768-.57 1.052-1.18 1.052z" />
              </svg>
            </Magnetic>
          </div>
        </div>
      </footer>
    </div>
  );
}