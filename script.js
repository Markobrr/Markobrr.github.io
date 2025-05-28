// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 70, // Adjust for header height
                behavior: 'smooth'
            });
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Simple validation
            if (!name || !email || !message) {
                alert('Molimo popunite sva polja.');
                return;
            }

            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            alert('Hvala na poruci! Kontaktirat ćemo vas uskoro.');

            // Reset form
            this.reset();
        });
    }

    // Add active class to nav links on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Project sorting functionality
    const sortButtons = document.querySelectorAll('.sort-btn');
    const projectGrid = document.querySelector('.project-grid');

    // Initialize with "newest" sort on page load (without animation)
    sortProjects('newest', false);

    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const sortType = this.getAttribute('data-sort');
            sortProjects(sortType);
        });
    });

    function sortProjects(sortType, animate = true) {
        const projectCards = Array.from(document.querySelectorAll('.project-card-link'));

        projectCards.sort((a, b) => {
            switch(sortType) {
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                case 'oldest':
                    return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                case 'name-asc':
                    return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                case 'name-desc':
                    return b.getAttribute('data-name').localeCompare(a.getAttribute('data-name'));
                default:
                    return 0;
            }
        });

        if (animate) {
            // Add smooth animation
            projectGrid.style.opacity = '0.7';

            setTimeout(() => {
                // Clear the grid and re-append sorted cards
                projectGrid.innerHTML = '';
                projectCards.forEach(card => {
                    projectGrid.appendChild(card);
                });

                // Restore opacity
                projectGrid.style.opacity = '1';
            }, 200);
        } else {
            // No animation for initial load
            projectGrid.innerHTML = '';
            projectCards.forEach(card => {
                projectGrid.appendChild(card);
            });
        }
    }
});
