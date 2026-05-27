document.addEventListener('DOMContentLoaded', () => {

    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarNav = document.querySelector('.sidebar-nav');

    // Typing Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = [
            'Web Developer',
            'Frontend Developer',
            'Learning Backend',
            'Portfolio'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }
        type();
    }

    // Tab Switching Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(section => section.classList.remove('active-section'));

            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }

            if (window.innerWidth <= 768) {
                sidebarNav.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('active');
        });
    }

    // Initialize - Ensure Hero is active
    if (!document.querySelector('.active-section')) {
        document.getElementById('hero').classList.add('active-section');
        document.querySelector('[data-target="hero"]').classList.add('active');
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach(el => observer.observe(el));
    } else {
        animateElements.forEach(el => el.classList.add('visible'));
    }

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Project Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const tech = card.getAttribute('data-tech') || '';
                    if (tech.split(' ').includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // Contact Form Handler
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                feedback.textContent = 'Please fill in all fields.';
                feedback.style.color = '#e74c3c';
                feedback.style.display = 'block';
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            feedback.style.display = 'none';

            try {
                const res = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await res.json();

                if (res.ok) {
                    feedback.textContent = 'Message sent successfully!';
                    feedback.style.color = '#2ecc71';
                    feedback.style.display = 'block';
                    form.reset();
                } else {
                    feedback.textContent = data.error || 'Something went wrong.';
                    feedback.style.color = '#e74c3c';
                    feedback.style.display = 'block';
                }
            } catch (err) {
                feedback.textContent = 'Network error. Make sure the server is running.';
                feedback.style.color = '#e74c3c';
                feedback.style.display = 'block';
            } finally {
                submitBtn.textContent = 'Send';
                submitBtn.disabled = false;
            }
        });
    }
});

// Resume download
async function openResume() {
  try {
    const res = await fetch('/resume.docx', { method: 'HEAD' });
    if (res.ok) {
      window.open('/resume.docx', '_blank');
    } else {
      alert('Resume not found. Please add resume.docx to the project folder.');
    }
  } catch {
    alert('Resume not found. Please add resume.docx to the project folder.');
  }
}

// Profile Lightbox Functions
function viewProfilePic() {
    const lightbox = document.getElementById('profile-lightbox');
    if (lightbox) {
        lightbox.style.display = 'block';
    }
}

function closeProfilePic() {
    const lightbox = document.getElementById('profile-lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}
