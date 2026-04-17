import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { isPlaygroundDirectImageUrl } from "../../models/playgroundImage";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80";

export function PlaygroundDetailPage() {
  const { id } = useParams();
  const [playgroundItems, setPlaygroundItems] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_BASE || '/api'}/portfolio/playground`)
      .then(res => res.json())
      .then(data => setPlaygroundItems(data));
  }, [id]);

  const item = playgroundItems.find((p) => String(p._id) === id);

  if (playgroundItems.length === 0) return <div>Loading...</div>;

  if (!item) {
    return (
      <div className="portfolio-wrapper">
        <div className="work-detail-error">
          <h1>Project Not Found</h1>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const heroSrc = isPlaygroundDirectImageUrl(item.image) ? item.image.trim() : FALLBACK_IMG;

  return (
    <div className="portfolio-wrapper">
      {/* Navigation */}
      <nav>
        <Link to="/" className="nav-logo">
          AMBADI TRRIKAALA
        </Link>
        <div className="nav-links">
          <Link to="/#work">WORK</Link>
          <Link to="/#playground">PLAYGROUND</Link>
          <Link to="/#about">ABOUT</Link>
        </div>
      </nav>

      {/* Back Button */}
      <div className="work-detail-back">
        <Link to="/#playground" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Playground</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="playground-detail-hero">
        <div className="playground-detail-hero-content">
          <div className="playground-detail-meta">
            <span className="playground-detail-year">{item.year}</span>
            <span className="playground-detail-tag">{item.type}</span>
          </div>
          <h1 className="playground-detail-title">{item.title}</h1>
        </div>
      </section>

      {/* Featured Image */}
      <section className="playground-detail-featured">
        <ImageWithFallback
          src={heroSrc}
          alt={item.title}
          className="playground-detail-featured-img"
        />
      </section>

      {/* Project Info */}
      <section className="playground-detail-info">
        <div className="playground-detail-info-grid">
          <div className="playground-detail-info-left">
            <h2 className="playground-detail-info-title">About This Project</h2>
            <p className="playground-detail-description">{item.description}</p>
          </div>
          <div className="playground-detail-info-right">
            <div className="playground-detail-info-block">
              <h3 className="playground-detail-info-label">Type</h3>
              <p className="playground-detail-info-value">{item.type}</p>
            </div>
            <div className="playground-detail-info-block">
              <h3 className="playground-detail-info-label">Year</h3>
              <p className="playground-detail-info-value">{item.year}</p>
            </div>
            <div className="playground-detail-info-block">
              <h3 className="playground-detail-info-label">Tools Used</h3>
              <div className="playground-detail-tools">
                {item.tools.map((tool, i) => (
                  <span key={i} className="tool-tag">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Images */}
      <section className="playground-detail-showcase">
        <div className="playground-detail-showcase-grid">
          <div className="playground-detail-showcase-item playground-detail-showcase-large">
            <ImageWithFallback
              src={heroSrc}
              alt={`${item.title} - Detail 1`}
              className="playground-detail-showcase-img"
            />
          </div>
          <div className="playground-detail-showcase-item">
            <ImageWithFallback
              src={heroSrc}
              alt={`${item.title} - Detail 2`}
              className="playground-detail-showcase-img"
            />
          </div>
          <div className="playground-detail-showcase-item">
            <ImageWithFallback
              src={heroSrc}
              alt={`${item.title} - Detail 3`}
              className="playground-detail-showcase-img"
            />
          </div>
          <div className="playground-detail-showcase-item playground-detail-showcase-wide">
            <ImageWithFallback
              src={heroSrc}
              alt={`${item.title} - Detail 4`}
              className="playground-detail-showcase-img"
            />
          </div>
        </div>
      </section>

      {/* More Projects */}
      <section className="playground-detail-more">
        <h2 className="playground-detail-more-title">More from Playground</h2>
        <div className="playground-detail-more-grid">
          {playgroundItems
            .filter((p) => String(p._id) !== id)
            .slice(0, 3)
            .map((project) => (
              <Link
                key={project._id}
                to={`/playground/${project._id}`}
                className="playground-detail-more-card"
              >
                <ImageWithFallback
                  src={isPlaygroundDirectImageUrl(project.image) ? project.image.trim() : FALLBACK_IMG}
                  alt={project.title}
                  className="playground-detail-more-img"
                />
                <div className="playground-detail-more-info">
                  <h3 className="playground-detail-more-card-title">
                    {project.title}
                  </h3>
                  <p className="playground-detail-more-card-type">
                    {project.type}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p className="footer-tagline">Let's create something amazing together</p>
          <h2 className="footer-thank">GET IN TOUCH</h2>
          <div className="footer-links">
            <a href="mailto:hello@ambadi.com" className="footer-link">
              EMAIL
            </a>
            <a href="https://linkedin.com" className="footer-link">
              LINKEDIN
            </a>
            <a href="https://instagram.com" className="footer-link">
              INSTAGRAM
            </a>
            <a href="https://behance.com" className="footer-link">
              BEHANCE
            </a>
          </div>
        </div>
        <p className="footer-copy">© 2026 AMBADI TRRIKAALA. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
