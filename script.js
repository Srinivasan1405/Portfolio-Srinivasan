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
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active-section'));

            // Show target section
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }

            // Close mobile menu if open
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

    // Initialize - Ensure Hero is active (fallback if HTML doesn't have it)
    if (!document.querySelector('.active-section')) {
        document.getElementById('hero').classList.add('active-section');
        document.querySelector('[data-target="hero"]').classList.add('active');
    }
});

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
