document.addEventListener('DOMContentLoaded', () => {
  // --- HEADER SCROLL CHANGE ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE HAMBURGER MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- ACADEMICS CURRICULUM TABS ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.curriculum-tab-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active state from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active state to clicked button
        button.classList.add('active');

        // Show/hide relevant panels
        tabPanels.forEach(panel => {
          if (panel.id === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // --- STATS COUNTER ANIMATION ---
  const stats = document.querySelectorAll('.stat-number');
  const animationDuration = 2000; // ms

  const animateCounters = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let start = 0;
      const increment = target / (animationDuration / 16); // ~60fps
      
      const updateCount = () => {
        start += increment;
        if (start < target) {
          stat.innerHTML = Math.floor(start) + `<span>${suffix}</span>`;
          requestAnimationFrame(updateCount);
        } else {
          stat.innerHTML = target + `<span>${suffix}</span>`;
        }
      };
      
      updateCount();
    });
  };

  // Intersection Observer to trigger counter when visible
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection && stats.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  // --- FORM SUBMISSIONS & MODALS ---
  const admissionForm = document.getElementById('admissionForm');
  const contactForm = document.getElementById('contactForm');
  
  // Create Modal element dynamically if not present
  const createModal = (title, message) => {
    let modal = document.querySelector('.modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-card">
          <div class="modal-icon">✓</div>
          <h3 class="modal-title">Success</h3>
          <p class="modal-desc">Your submission was successful.</p>
          <button class="btn btn-primary btn-close-modal">Close Window</button>
        </div>
      `;
      document.body.appendChild(modal);
      
      modal.querySelector('.btn-close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
    
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-desc').textContent = message;
    modal.classList.add('active');
  };

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple visual check for validations
      const inputs = admissionForm.querySelectorAll('.form-control');
      let isValid = true;
      inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });

      if (isValid) {
        const studentName = document.getElementById('studentName')?.value || 'the student';
        createModal(
          'Application Submitted!',
          `Thank you for applying. We have received the registration details for ${studentName}. An admissions counselor will email you within 2-3 business days.`
        );
        admissionForm.reset();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = contactForm.querySelectorAll('.form-control');
      let isValid = true;
      inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });

      if (isValid) {
        const senderName = document.getElementById('senderName')?.value || 'there';
        createModal(
          'Message Received!',
          `Hi ${senderName}, your message has been sent to our administrative team. We appreciate you reaching out to Apex Academy!`
        );
        contactForm.reset();
      }
    });
  }
});
