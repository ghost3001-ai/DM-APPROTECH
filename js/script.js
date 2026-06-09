document.addEventListener('DOMContentLoaded', () => {
  const menuToggles = Array.from(document.querySelectorAll('.menu-toggle'));
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggles.length && navMenu) {
    const setMenuExpanded = (isOpen) => {
      menuToggles.forEach((button) => {
        button.setAttribute('aria-expanded', String(isOpen));
      });
    };

    menuToggles.forEach((button) => button.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      setMenuExpanded(isOpen);
    }));

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        setMenuExpanded(false);
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'))
    .filter((link) => link.hash && link.hash !== '#audit-form-modal');

  if (currentPage === 'index.html' && navLinks.some((link) => link.hash)) {
    const sections = navLinks
      .map((link) => document.querySelector(link.hash))
      .filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === `#${id}`);
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.18, 0.35, 0.6] });

      sections.forEach((section) => observer.observe(section));
    }

    setActive(window.location.hash.replace('#', '') || 'accueil');
  } else {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
  }

  if (!document.querySelector('.whatsapp-btn')) {
    const whatsapp = document.createElement('a');
    whatsapp.className = 'whatsapp-btn';
    whatsapp.href = 'https://wa.me/237676291773?text=Bonjour%20DM%20APPROTECH%2C%20je%20souhaite%20un%20devis%20pour%20mon%20projet%20%C3%A9nerg%C3%A9tique.';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.ariaLabel = 'Contacter DM APPROTECH via WhatsApp';
    whatsapp.title = 'Contactez-nous sur WhatsApp';
    whatsapp.innerHTML = '<span class="whatsapp-initials">WA</span>';
    document.body.appendChild(whatsapp);
  }

  const auditModal = document.getElementById('audit-form-modal');
  const auditOpeners = document.querySelectorAll('.js-audit-open');
  const auditClosers = document.querySelectorAll('[data-audit-close]');
  let lastFocusedElement = null;

  const openAuditModal = () => {
    if (!auditModal) return;

    lastFocusedElement = document.activeElement;
    auditModal.hidden = false;
    document.body.classList.add('modal-open');

    const firstField = auditModal.querySelector('input:not([type="hidden"]):not(.honeypot), select, textarea, button');
    if (firstField) firstField.focus();
  };

  const closeAuditModal = () => {
    if (!auditModal) return;

    auditModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  auditOpeners.forEach((opener) => {
    opener.addEventListener('click', (event) => {
      event.preventDefault();
      openAuditModal();
    });
  });

  auditClosers.forEach((closer) => {
    closer.addEventListener('click', closeAuditModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && auditModal && !auditModal.hidden) {
      closeAuditModal();
    }
  });

  if (window.location.hash === '#audit-form-modal') {
    openAuditModal();
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const counter = carousel.querySelector('[data-carousel-counter]');
    const progress = carousel.querySelector('[data-carousel-progress]');
    const rotationDelay = 4400;
    let current = 0;
    let timerId = null;

    if (slides.length === 0) return;

    const render = () => {
      carousel.classList.remove('is-spinning');
      window.requestAnimationFrame(() => carousel.classList.add('is-spinning'));

      slides.forEach((slide, index) => {
        const distance = (index - current + slides.length) % slides.length;
        const isActive = distance === 0;

        slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');

        if (isActive) slide.classList.add('is-active');
        if (distance === 1) slide.classList.add('is-next');
        if (distance === 2) slide.classList.add('is-far-next');
        if (distance === slides.length - 1) slide.classList.add('is-prev');
        if (distance === slides.length - 2) slide.classList.add('is-far-prev');

        slide.setAttribute('aria-hidden', String(!isActive));
      });

      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
      if (progress) progress.style.setProperty('--progress', `${((current + 1) / slides.length) * 100}%`);
    };

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      render();
    };

    const queueNextRotation = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        goTo(current + 1);
        queueNextRotation();
      }, rotationDelay);
    };

    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        if (index === current) return;
        goTo(index);
        queueNextRotation();
      });
    });

    carousel.addEventListener('dblclick', () => {
      goTo(current + 1);
      queueNextRotation();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.clearTimeout(timerId);
      } else {
        queueNextRotation();
      }
    });

    render();
    queueNextRotation();
  });

  const brevoAuditForm = document.getElementById('brevoAuditForm');
  if (brevoAuditForm) {
    const status = brevoAuditForm.querySelector('.form-status');
    const urlParams = new URLSearchParams(window.location.search);

    const setHiddenValue = (name, value) => {
      const field = brevoAuditForm.querySelector(`input[name="${name}"]`);
      if (field) field.value = value || '';
    };

    const syncBrevoTrackingFields = () => {
      setHiddenValue('SOURCE_URL', window.location.href);
      setHiddenValue('SUBMITTED_AT', new Date().toISOString());
      setHiddenValue('UTM_SOURCE', urlParams.get('utm_source'));
      setHiddenValue('UTM_MEDIUM', urlParams.get('utm_medium'));
      setHiddenValue('UTM_CAMPAIGN', urlParams.get('utm_campaign'));
      setHiddenValue('UTM_CONTENT', urlParams.get('utm_content'));
    };

    syncBrevoTrackingFields();

    brevoAuditForm.addEventListener('submit', (event) => {
      syncBrevoTrackingFields();

      const trap = brevoAuditForm.querySelector('input[name="email_address_check"]');
      if (trap && trap.value.trim()) {
        event.preventDefault();
        return;
      }

      const configuredEndpoint = brevoAuditForm.dataset.brevoEndpoint.trim() || brevoAuditForm.action;
      const isConfigured = configuredEndpoint && !configuredEndpoint.includes('YOUR_BREVO_FORM_ID');

      if (!isConfigured) {
        event.preventDefault();
        if (status) {
          status.textContent = 'Formulaire prêt: ajoutez l’URL publique Brevo dans action ou data-brevo-endpoint pour activer l’envoi CRM.';
        }
        return;
      }

      brevoAuditForm.action = configuredEndpoint;
      if (status) status.textContent = 'Envoi vers le CRM Brevo...';
    });
  }
});
