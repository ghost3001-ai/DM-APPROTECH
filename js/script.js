document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navMenu && !navMenu.querySelector('a[href="energie-solaire.html"]')) {
    const aboutItem = navMenu.querySelector('a[href="a-propos.html"]')?.parentElement;
    const solarItem = document.createElement('li');
    solarItem.innerHTML = '<a href="energie-solaire.html">Énergie solaire</a>';
    navMenu.insertBefore(solarItem, aboutItem || navMenu.lastElementChild);
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

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

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

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
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        submitBtn.textContent = '✓ Message envoyé avec succès!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
      submitBtn.textContent = '❌ Erreur - réessayez';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 4000);
    });
  });
});
