import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion as Motion } from 'framer-motion';
import { 
  Menu, X, Camera, MessageCircle,
  ChevronLeft, ChevronRight, Mail, User, MessageSquare,
  Calendar, Heart, Award, Users, Sparkles, Clock
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './components/Icons';
import { images, socialLinks, photographerInfo } from './data/images';
import './App.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % images.hero.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const portfolioItems = [
    { src: images.portfolio.weddings[0], title: 'Eternal Love', category: 'weddings' },
    { src: images.portfolio.portraits[0], title: 'Inner Beauty', category: 'portraits' },
    { src: images.portfolio.fashion[0], title: 'Vogue Dreams', category: 'fashion' },
    { src: images.portfolio.travel[0], title: 'Mountain Serenity', category: 'travel' },
    { src: images.portfolio.weddings[1], title: 'First Dance', category: 'weddings' },
    { src: images.portfolio.portraits[1], title: 'Natural Glow', category: 'portraits' },
    { src: images.portfolio.fashion[1], title: 'Runway Ready', category: 'fashion' },
    { src: images.portfolio.travel[1], title: 'Forest Tales', category: 'travel' },
    { src: images.portfolio.weddings[2], title: 'Sacred Vows', category: 'weddings' },
    { src: images.portfolio.portraits[2], title: 'Soul Eyes', category: 'portraits' },
    { src: images.portfolio.fashion[2], title: 'Urban Chic', category: 'fashion' },
    { src: images.portfolio.travel[2], title: 'Golden Hour', category: 'travel' },
    { src: images.portfolio.weddings[3], title: 'Ring Exchange', category: 'weddings' },
    { src: images.portfolio.portraits[3], title: 'Confident', category: 'portraits' },
    { src: images.portfolio.fashion[3], title: 'Elegance', category: 'fashion' },
    { src: images.portfolio.travel[3], title: 'Adventure', category: 'travel' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const services = [
    { icon: Heart, title: 'Wedding Photography', desc: 'Capturing every precious moment of your special day with artistic vision and emotional storytelling.' },
    { icon: Sparkles, title: 'Pre-Wedding Shoots', desc: 'Romantic and cinematic pre-wedding sessions that tell your unique love story.' },
    { icon: Camera, title: 'Commercial Shoots', desc: 'Professional brand photography that elevates your business identity.' },
    { icon: Users, title: 'Baby Shoots', desc: 'Adorable milestone captures that freeze those fleeting precious moments.' }
  ];

  const testimonials = [
    { name: 'Sarah & Michael', text: 'JJ Photography made our wedding day absolutely magical. Every photo tells a story we\'ll cherish forever.', location: 'New York' },
    { name: 'Emily Chen', text: 'The portrait session was transformative. I\'ve never felt so beautiful in photos. Absolutely recommend!', location: 'Los Angeles' },
    { name: 'David & Lisa', text: 'Our pre-wedding shoot in Paris was like a movie scene. JJ captured our chemistry perfectly.', location: 'Paris' },
    { name: 'Maria Rodriguez', text: 'Commercial shoot exceeded all expectations. The images elevated our entire brand presence.', location: 'Miami' },
    { name: 'James Thompson', text: 'Family photos have never looked this good. Kids were comfortable and we got genuine smiles!', location: 'Chicago' }
  ];

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = `Hello! I'm ${formData.get('name')}. I'm interested in ${formData.get('shootType')} shoot. ${formData.get('message')}`;
    window.open(`${socialLinks.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="app" ref={containerRef}>
      <Motion.div
        className="custom-cursor"
        style={{ x: cursorPos.x - 0, y: cursorPos.y - 0 }}
      />

      <div className="grain-overlay" />

      <header className="header">
        <Motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="logo" onClick={() => scrollToSection('hero')}>
            <Camera className="logo-icon" />
            <span>JJ Photography</span>
          </div>

          <div className="nav-links">
            <button onClick={() => scrollToSection('portfolio')}>Portfolio</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('services')}>Services</button>
            <button onClick={() => scrollToSection('testimonials')}>Reviews</button>
            <button onClick={() => scrollToSection('contact')} className="nav-cta">Book Now</button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </Motion.nav>

        <AnimatePresence>
          {isMenuOpen && (
            <Motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <button onClick={() => scrollToSection('portfolio')}>Portfolio</button>
              <button onClick={() => scrollToSection('about')}>About</button>
              <button onClick={() => scrollToSection('services')}>Services</button>
              <button onClick={() => scrollToSection('testimonials')}>Reviews</button>
              <button onClick={() => scrollToSection('contact')}>Contact</button>
            </Motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="hero" className="hero-section">
        <div className="hero-slider">
          {images.hero.map((img, index) => (
            <Motion.div
              key={img}
              className={`hero-slide ${index === heroIndex ? 'active' : ''}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: index === heroIndex ? 1.1 : 1.2 }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <Motion.div
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Motion.h1 variants={fadeInUp} className="hero-title">
            {photographerInfo.name}
          </Motion.h1>
          <Motion.p variants={fadeInUp} className="hero-tagline">
            {photographerInfo.tagline}
          </Motion.p>
          <Motion.div variants={fadeInUp} className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection('portfolio')}>
              View Work
            </button>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Book a Session
            </a>
          </Motion.div>
        </Motion.div>

        <Motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="scroll-line" />
        </Motion.div>
      </section>

      <section id="portfolio" className="portfolio-section">
        <Motion.div
          className="section-header"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.span variants={fadeInUp} className="section-subtitle">Our Work</Motion.span>
          <Motion.h2 variants={fadeInUp} className="section-title">Portfolio</Motion.h2>
          <Motion.p variants={fadeInUp} className="section-desc">
            A curated collection of our finest moments captured through the lens
          </Motion.p>
        </Motion.div>

        <Motion.div
          className="category-filters"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {['all', 'weddings', 'portraits', 'fashion', 'travel'].map((cat) => (
            <Motion.button
              key={cat}
              variants={fadeInUp}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Motion.button>
          ))}
        </Motion.div>

        <Motion.div
          className="masonry-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <Motion.div
                key={`${item.src}-${index}`}
                className="masonry-item"
                variants={fadeInUp}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxImage(item.src)}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="masonry-overlay">
                  <h3>{item.title}</h3>
                  <span>{item.category}</span>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        </Motion.div>
      </section>

      <section id="about" className="about-section">
        <Motion.div
          className="about-container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.div className="about-image" variants={fadeInUp}>
            <div className="about-image-wrapper">
              <img src={images.about} alt="Photographer" loading="lazy" />
              <div className="about-image-frame" />
            </div>
            <Motion.div
              className="about-stats"
              variants={staggerContainer}
            >
              <div className="stat" variants={fadeInUp}>
                <span className="stat-number">{photographerInfo.yearsExperience}+</span>
                <span className="stat-label">Years</span>
              </div>
              <div className="stat" variants={fadeInUp}>
                <span className="stat-number">{photographerInfo.happyClients}+</span>
                <span className="stat-label">Clients</span>
              </div>
              <div className="stat" variants={fadeInUp}>
                <span className="stat-number">{photographerInfo.awards}</span>
                <span className="stat-label">Awards</span>
              </div>
            </Motion.div>
          </Motion.div>

          <Motion.div className="about-content" variants={fadeInUp}>
            <span className="section-subtitle">The Story</span>
            <h2 className="section-title">About Me</h2>
            <p className="about-text">{photographerInfo.description}</p>
            <p className="about-text">
              Every session is a collaboration—an exploration of light, emotion, and authenticity.
              I believe the best photos happen when you forget the camera is there.
            </p>
            <div className="about-signature">
              <span className="signature">{photographerInfo.signature}</span>
            </div>
          </Motion.div>
        </Motion.div>
      </section>

      <section id="services" className="services-section">
        <Motion.div
          className="section-header"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.span variants={fadeInUp} className="section-subtitle">What I Offer</Motion.span>
          <Motion.h2 variants={fadeInUp} className="section-title">Services</Motion.h2>
          <Motion.p variants={fadeInUp} className="section-desc">
            Premium photography services tailored to capture your most precious moments
          </Motion.p>
        </Motion.div>

        <Motion.div
          className="services-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service) => (
            <Motion.div
              key={service.title}
              className="service-card"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="service-icon">
                <service.icon size={40} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-glow" />
            </Motion.div>
          ))}
        </Motion.div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <Motion.div
          className="section-header"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.span variants={fadeInUp} className="section-subtitle">Client Love</Motion.span>
          <Motion.h2 variants={fadeInUp} className="section-title">Testimonials</Motion.h2>
          <Motion.p variants={fadeInUp} className="section-desc">
            Stories from the amazing people I've had the honor to work with
          </Motion.p>
        </Motion.div>

        <div className="testimonials-carousel">
          <AnimatePresence mode="wait">
            <Motion.div
              key={testimonialIndex}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{testimonials[testimonialIndex].text}</p>
              <div className="testimonial-author">
                <h4>{testimonials[testimonialIndex].name}</h4>
                <span>{testimonials[testimonialIndex].location}</span>
              </div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </Motion.div>
          </AnimatePresence>

          <div className="testimonial-nav">
            <button onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft />
            </button>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === testimonialIndex ? 'active' : ''}`}
                  onClick={() => setTestimonialIndex(index)}
                />
              ))}
            </div>
            <button onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <Motion.div
          className="section-header"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.span variants={fadeInUp} className="section-subtitle">Get In Touch</Motion.span>
          <Motion.h2 variants={fadeInUp} className="section-title">Let's Create Together</Motion.h2>
          <Motion.p variants={fadeInUp} className="section-desc">
            Ready to capture your special moments? Let's start the conversation
          </Motion.p>
        </Motion.div>

        <Motion.div
          className="contact-container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Motion.form
            className="contact-form"
            variants={fadeInUp}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <User className="input-icon" />
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <Mail className="input-icon" />
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <Calendar className="input-icon" />
              <select name="shootType" required>
                <option value="">Select Shoot Type</option>
                <option value="Wedding">Wedding Photography</option>
                <option value="Pre-Wedding">Pre-Wedding Shoot</option>
                <option value="Commercial">Commercial Shoot</option>
                <option value="Baby">Baby Shoot</option>
                <option value="Portrait">Portrait Session</option>
                <option value="Fashion">Fashion Shoot</option>
                <option value="Travel">Travel Photography</option>
              </select>
            </div>
            <div className="form-group">
              <MessageSquare className="input-icon" />
              <textarea name="message" placeholder="Tell me about your vision..." rows="5" required />
            </div>
            <Motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </Motion.button>
          </Motion.form>

          <Motion.div className="contact-info" variants={fadeInUp}>
            <div className="social-links">
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <MessageCircle />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <InstagramIcon />
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <FacebookIcon />
              </a>
            </div>
            <p className="contact-text">Or reach out directly via WhatsApp for quick response</p>
          </Motion.div>
        </Motion.div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Camera className="logo-icon" />
            <span>JJ Photography</span>
          </div>
          <p className="footer-text">Capturing moments, creating memories</p>
          <div className="footer-links">
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle /></a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></a>
          </div>
          <p className="footer-copyright">© 2024 JJ Photography. All rights reserved.</p>
        </div>
      </footer>

      <AnimatePresence>
        {lightboxImage && (
          <Motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <Motion.img
              src={lightboxImage}
              alt="Portfolio"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              <X />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Star() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default App;
