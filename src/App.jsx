import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // Custom cursor interactivo
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const moveCursor = (e) => { 
      mx = e.clientX; 
      my = e.clientY; 
      if(cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', moveCursor);

    let animationFrame;
    const animRing = () => {
      rx += (mx - rx) * 0.12; 
      ry += (my - ry) * 0.12;
      if(ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      animationFrame = requestAnimationFrame(animRing);
    };
    animRing();

    // Efecto hover en elementos clickeables
    const elements = document.querySelectorAll('a, button, .gal, .feature-item');
    const handleMouseEnter = () => { if(ring) { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.borderColor = 'rgba(160,120,64,0.8)'; }};
    const handleMouseLeave = () => { if(ring) { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(160,120,64,0.5)'; }};

    elements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Menú oscuro al hacer scroll
    const nav = document.getElementById('nav');
    const handleScroll = () => { 
      if(nav) nav.classList.toggle('scrolled', window.scrollY > 60); 
    };
    window.addEventListener('scroll', handleScroll);

    // Animación de aparición (Reveal)
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { 
        if(e.isIntersecting) { 
          e.target.classList.add('visible'); 
          obs.unobserve(e.target); 
        } 
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));

    // Limpieza de eventos
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* ══ NAV ══ */}
      <nav id="nav">
        <a href="#" className="logo">ESTET</a>
        <ul className="nav-links">
          <li><a href="#" className="active">Главная</a></li>
          <li><a href="#about">О компании</a></li>
          <li><a href="#gallery">Каталог</a></li>
          <li><a href="#projects">Проекты</a></li>
          <li><a href="#contact">Контакты</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Оставить заявку</a>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&auto=format&fit=crop" alt="Премиальная лестница" loading="eager" />
        </div>
        <div className="hero-overlay"></div>

        <div className="hero-body">
          <div className="hero-tag">Premium Service · Proven Trust</div>
          <h1 className="hero-title">Exceptional<br /><em> Properties</em> for<br />Discerning<br />Clients</h1>
          <p className="hero-desc">A curated selection of residential and investment properties for those who value exclusivity, privacy, and unparalleled personal attention.</p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Explore our portfolio → </a>
            <a href="#gallery" className="btn-ghost">Смотреть проекты &#8594;</a>
          </div>
        </div>
        <div className="hero-counter">
          <div className="hc-item"><span className="hc-num">12</span><span className="hc-label">Лет опыта</span></div>
          <div className="hc-item"><span className="hc-num">150+</span><span className="hc-label">Проектов</span></div>
          <div className="hc-item"><span className="hc-num">5</span><span className="hc-label">Лет гарантии</span></div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          <span className="ticker-item">Индивидуальный проект</span>
          <span className="ticker-item">Собственное производство</span>
          <span className="ticker-item">Монтаж под ключ</span>
          <span className="ticker-item">Премиальные материалы</span>
          <span className="ticker-item">Гарантия 5 лет</span>
          <span className="ticker-item">150+ реализованных проектов</span>
          <span className="ticker-item">Индивидуальный проект</span>
          <span className="ticker-item">Собственное производство</span>
          <span className="ticker-item">Монтаж под ключ</span>
          <span className="ticker-item">Премиальные материалы</span>
          <span className="ticker-item">Гарантия 5 лет</span>
          <span className="ticker-item">150+ реализованных проектов</span>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-item reveal">
            <span className="feature-num">01</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <path d="M3 21h4v-4H3v4zm0-6h4v-4H3v4zm6 6h4v-6H9v6zm0-10h4V7H9v4zm6 10h4V11h-4v10zm0-12h4V3h-4v6z" />
              </svg>
            </div>
            <h3 className="feature-title">Индивидуальный<br />проект</h3>
            <p className="feature-text">Разрабатываем уникальные решения с учётом ваших пожеланий и особенностей интерьера.</p>
          </div>
          <div className="feature-item reveal reveal-delay-1">
            <span className="feature-num">02</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <rect x="2" y="6" width="20" height="14" rx="1" />
                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="11" x2="12" y2="16" />
                <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
              </svg>
            </div>
            <h3 className="feature-title">Собственное<br />производство</h3>
            <p className="feature-text">Контролируем качество на каждом этапе — от выбора материалов до финальной отделки.</p>
          </div>
          <div className="feature-item reveal reveal-delay-2">
            <span className="feature-num">03</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h3 className="feature-title">Монтаж<br />под ключ</h3>
            <p className="feature-text">Профессиональная установка опытными мастерами с гарантией сроков и качества.</p>
          </div>
          <div className="feature-item reveal reveal-delay-3">
            <span className="feature-num">04</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Премиальные<br />материалы</h3>
            <p className="feature-text">Используем только отборные материалы: дерево, металл, стекло, камень и композиты.</p>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="gallery" id="gallery">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Наши проекты</div>
            <h2 className="section-title">Лестницы, которые<br />становятся центром<br />пространства</h2>
          </div>
          <a href="#" className="view-all">Смотреть все проекты &#8594;</a>
        </div>
        <div className="gallery-grid">
          <div className="gal reveal"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop" alt="Лестница 1" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Парящая</span></div>
          <div className="gal reveal reveal-delay-1"><img src="https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&q=80&auto=format&fit=crop" alt="Лестница 2" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Спиральная</span></div>
          <div className="gal reveal reveal-delay-2"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&auto=format&fit=crop" alt="Лестница 3" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Классика</span></div>
          <div className="gal reveal reveal-delay-3"><img src="https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=600&q=80&auto=format&fit=crop" alt="Лестница 4" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Модерн</span></div>
          <div className="gal reveal"><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80&auto=format&fit=crop" alt="Лестница 5" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Прямая</span></div>
          <div className="gal reveal reveal-delay-1"><img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80&auto=format&fit=crop" alt="Лестница 6" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Г-образная</span></div>
          <div className="gal reveal reveal-delay-2"><img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80&auto=format&fit=crop" alt="Лестница 7" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Консольная</span></div>
          <div className="gal reveal reveal-delay-3"><img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop" alt="Лестница 8" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">Панорамная</span></div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="about" id="about">
        <div className="about-inner">
          <div>
            <div className="about-label reveal">О компании</div>
            <h2 className="about-title reveal">ESTET — это<br />инженерное<br />мастерство</h2>
            <p className="about-text reveal">ESTET — это сочетание инженерного мастерства, современного дизайна и безупречного качества. Мы создаём лестницы, которые делают пространство выразительным и подчёркивают ваш стиль.<br /><br />Каждый проект — это индивидуальное решение, созданное с учётом архитектуры дома, личных пожеланий и особенностей интерьера.</p>
            <a href="#" className="btn-outline-light reveal">Подробнее о компании &#8594;</a>
          </div>
          <div className="about-stats reveal">
            <div className="stat-box">
              <span className="stat-num">12<span className="stat-unit">лет</span></span>
              <span className="stat-label">Опыта в проектировании и изготовлении лестниц премиум-класса</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">150<span className="stat-unit">+</span></span>
              <span className="stat-label">Реализованных проектов по всей России и за рубежом</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">5<span className="stat-unit">лет</span></span>
              <span className="stat-label">Гарантии на конструкцию и монтаж всех видов лестниц</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ══ */}
      <section className="products" id="projects">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Коллекции</div>
            <h2 className="section-title">Наши решения</h2>
          </div>
        </div>
        <div className="products-grid">
          <div className="product-card reveal">
            <div className="product-body">
              <div>
                <span className="product-tag">Минимализм · Прочность</span>
                <h3 className="product-title">Лестницы на<br />монокосоуре</h3>
                <p className="product-desc">Минималистичная конструкция с максимальной прочностью и воздушным окружением. Идеальное решение для современных интерьеров.</p>
              </div>
              <a href="#" className="btn-sm">Консультация &#8594;</a>
            </div>
            <div className="product-img-wrap">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80&auto=format&fit=crop&crop=right" alt="Лестница на монокосоуре" loading="lazy" />
            </div>
          </div>
          <div className="product-card reveal reveal-delay-2">
            <div className="product-body">
              <div>
                <span className="product-tag">Невесомость · Дизайн</span>
                <h3 className="product-title">Парящие<br />лестницы</h3>
                <p className="product-desc">Эффект невесомости благодаря скрытому креплению ступеней и чистым линиям. Создаёт ощущение воздуха и простора.</p>
              </div>
              <a href="#" className="btn-sm">Консультация &#8594;</a>
            </div>
            <div className="product-img-wrap">
              <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80&auto=format&fit=crop&crop=right" alt="Парящая лестница" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="process">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Как мы работаем</div>
            <h2 className="section-title">Процесс создания</h2>
          </div>
        </div>
        <div className="process-steps">
          <div className="step reveal">
            <div className="step-num-wrap"><span className="step-num">01</span></div>
            <h4 className="step-title">Консультация</h4>
            <p className="step-text">Обсуждаем задачу, замеряем пространство и изучаем ваши пожелания</p>
          </div>
          <div className="step reveal reveal-delay-1">
            <div className="step-num-wrap"><span className="step-num">02</span></div>
            <h4 className="step-title">Проектирование</h4>
            <p className="step-text">Создаём 3D-модель и согласовываем все детали конструкции</p>
          </div>
          <div className="step reveal reveal-delay-2">
            <div className="step-num-wrap"><span className="step-num">03</span></div>
            <h4 className="step-title">Производство</h4>
            <p className="step-text">Изготавливаем на собственном производстве с контролем качества</p>
          </div>
          <div className="step reveal reveal-delay-3">
            <div className="step-num-wrap"><span className="step-num">04</span></div>
            <h4 className="step-title">Монтаж</h4>
            <p className="step-text">Профессиональная установка опытной командой мастеров</p>
          </div>
          <div className="step reveal reveal-delay-4">
            <div className="step-num-wrap"><span className="step-num">05</span></div>
            <h4 className="step-title">Гарантия</h4>
            <p className="step-text">5 лет гарантии на всю конструкцию и работу по монтажу</p>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="testimonials">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Отзывы клиентов</div>
            <h2 className="section-title">Нам доверяют</h2>
          </div>
        </div>
        <div className="testi-grid">
          <div className="testi-card reveal">
            <span className="testi-quote">"</span>
            <p className="testi-text">Заказывали лестницу на монокосоуре для нашего загородного дома. Результат превзошёл все ожидания — это настоящее произведение искусства.</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">Александр Морозов</div><div className="testi-role">Частный клиент, Москва</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
          <div className="testi-card reveal reveal-delay-1">
            <span className="testi-quote">"</span>
            <p className="testi-text">Команда ESTET профессионально подошла к каждому этапу — от проекта до монтажа. Сроки соблюдены, качество на высшем уровне.</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">Екатерина Волкова</div><div className="testi-role">Дизайнер интерьера</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
          <div className="testi-card reveal reveal-delay-2">
            <span className="testi-quote">"</span>
            <p className="testi-text">Парящая лестница стала настоящим центром нашего пентхауса. Гости не могут оторвать взгляд. Спасибо за безупречную работу!</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">Дмитрий Козлов</div><div className="testi-role">Частный клиент, Санкт-Петербург</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <div className="cta-banner" id="contact">
        <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80&auto=format&fit=crop" alt="" loading="lazy" />
        <div className="cta-overlay">
          <p className="cta-label">Начните свой проект</p>
          <h2 className="cta-title">Создадим лестницу<br /><em>вашей мечты</em></h2>
          <a href="tel:+78000000000" className="btn-primary" style={{ fontSize: '13px', padding: '18px 44px' }}>Оставить заявку &#8594;</a>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">ESTET</a>
            <p className="footer-tagline">Премиальные лестницы для современных интерьеров. Производство и монтаж по всей России и за рубежом.</p>
            <div className="footer-social">
              <a href="#" className="social-btn">in</a>
              <a href="#" className="social-btn">vk</a>
              <a href="#" className="social-btn">ig</a>
              <a href="#" className="social-btn">yt</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Компания</h4>
            <ul>
              <li><a href="#">О нас</a></li>
              <li><a href="#">Проекты</a></li>
              <li><a href="#">Производство</a></li>
              <li><a href="#">Команда</a></li>
              <li><a href="#">Вакансии</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Каталог</h4>
            <ul>
              <li><a href="#">Монокосоур</a></li>
              <li><a href="#">Парящие</a></li>
              <li><a href="#">Спиральные</a></li>
              <li><a href="#">Прямые</a></li>
              <li><a href="#">Г-образные</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <ul>
              <li><a href="tel:+78000000000">+7 (800) 000-00-00</a></li>
              <li><a href="mailto:info@estet.ru">info@estet.ru</a></li>
              <li><a href="#">Москва, ул. Примерная, 1</a></li>
              <li><a href="#">Пн–Пт: 9:00–19:00</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 ESTET. Все права защищены.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;