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
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));

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

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erreur lors de l\'envoi');

          contactForm.reset();
          submitBtn.textContent = 'Message envoyé avec succès';
        })
        .catch((error) => {
          console.error('Erreur:', error);
          submitBtn.textContent = 'Erreur - réessayez';
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 4000);
        });
    });
  }

  const brevoAuditForm = document.getElementById('brevoAuditForm');
  if (brevoAuditForm) {
    const status = brevoAuditForm.querySelector('.form-status');

    brevoAuditForm.addEventListener('submit', (event) => {
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
