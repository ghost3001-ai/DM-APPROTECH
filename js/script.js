document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

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

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const nom = data.get('nom') || '';
    const societe = data.get('societe') || '';
    const subject = `Demande de devis DM APPROTECH - ${societe || nom}`;
    const body = [
      `Nom : ${nom}`,
      `Email : ${data.get('email') || ''}`,
      `Téléphone : ${data.get('telephone') || ''}`,
      `Société : ${societe}`,
      `Besoin : ${data.get('besoin') || ''}`,
      `Puissance estimée : ${data.get('puissance') || ''}`,
      `Localisation : ${data.get('localisation') || ''}`,
      '',
      'Message :',
      data.get('message') || ''
    ].join('\n');

    window.location.href = `mailto:rescom_dmapprotechsarl@yahoo.fr,dg_dmapprotechsarl@yahoo.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
