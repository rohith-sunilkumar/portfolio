import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

export function WorkDetailPage() {
  const { id } = useParams();
  const [workProjects, setWorkProjects] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_BASE || '/api'}/portfolio/work`)
      .then(res => res.json())
      .then(data => setWorkProjects(data));
  }, [id]);

  const project = workProjects.find((p) => p.id === id);

  if (workProjects.length === 0) return <div>Loading...</div>;

  if (!project) {
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

  return (
    <div className="portfolio-wrapper">
      {/* Navigation */}
      <nav>
        <Link to="/" className="nav-logo">
          AMBADI TRRIKAALA
        </Link>
        <div className="nav-links">
          <Link to="/#playground">PLAYGROUND</Link>
          <Link to="/#about">ABOUT</Link>
        </div>
      </nav>

      {/* Back Button */}
      <div className="work-detail-back">
        <Link to="/#work" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Work</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="work-detail-hero">
        <div className="work-detail-hero-content">
          <div className="work-detail-meta">
            <span className="work-detail-year">{project.year}</span>
            <span className="work-detail-tag">{project.tag}</span>
          </div>
          <h1 className="work-detail-title">{project.title}</h1>
          <p className="work-detail-subtitle">{project.subtitle}</p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="work-detail-featured">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80"
          alt={project.title}
          query={project.image}
          className="work-detail-featured-img"
        />
      </section>

      {/* Project Info */}
      <section className="work-detail-info">
        <div className="work-detail-info-grid">
          <div className="work-detail-info-left">
            <h2 className="work-detail-info-title">Project Overview</h2>
            <p className="work-detail-description">{project.description}</p>
          </div>
          <div className="work-detail-info-right">
            <div className="work-detail-info-block">
              <h3 className="work-detail-info-label">Role</h3>
              <p className="work-detail-info-value">{project.role}</p>
            </div>
            <div className="work-detail-info-block">
              <h3 className="work-detail-info-label">Client</h3>
              <p className="work-detail-info-value">{project.client}</p>
            </div>
            <div className="work-detail-info-block">
              <h3 className="work-detail-info-label">Services</h3>
              <div className="work-detail-services">
                {project.services.map((service, i) => (
                  <span key={i} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="work-detail-gallery">
        <h2 className="work-detail-gallery-title">Project Gallery</h2>
        <div className="work-detail-gallery-grid">
          {project.gallery.map((imgQuery, i) => (
            <div key={i} className="work-detail-gallery-item">
              <ImageWithFallback
                src={`https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80`}
                alt={`${project.title} - Image ${i + 1}`}
                query={imgQuery}
                className="work-detail-gallery-img"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Next Project */}
      <section className="work-detail-next">
        <div className="work-detail-next-content">
          <span className="work-detail-next-label">Next Project</span>
          <Link
            to={`/work/${
              workProjects[
                (workProjects.findIndex((p) => p.id === id) + 1) %
                  workProjects.length
              ].id
            }`}
            className="work-detail-next-link"
          >
            <span className="work-detail-next-title">
              {
                workProjects[
                  (workProjects.findIndex((p) => p.id === id) + 1) %
                    workProjects.length
                ].title
              }
            </span>
            <ExternalLink size={24} />
          </Link>
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
