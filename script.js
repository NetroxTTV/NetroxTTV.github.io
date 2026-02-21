// Particle system
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.resizeCanvas();
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.5 + 1,
                opacity: Math.random() * 0.6 + 0.3
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    const opacity = 0.15 * (1 - distance / 120);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Image galleries data
const imageGalleries = {
    gptsites: [
        'resources/gpt1.png',
        'resources/gpt2.png',
        'resources/gpt3.png',
        'resources/gpt4.png'
    ],
    paperstrike: [
        'resources/paper1.jpg',
        'resources/paper2.jpg',
        'resources/paper3.jpg'
    ],
    simpson: [
        'resources/simpson1.jpg',
        'resources/simpson2.jpg'
    ],
    beatnhit: [
        'resources/beat1.jpg',
        'resources/beat2.jpg',
        'resources/beat3.jpg'
    ],
    drowned: [
        'resources/logoDrowned.png',
        'resources/drowned1.png',
        'resources/drowned2.png'
    ],
    dust2: [
        'resources/dust2_1.png',
        'resources/dust2_2.png'
    ]
};

// Track current image index for each project
const currentProjectImages = {
    gptsites: 0,
    paperstrike: 0,
    simpson: 0,
    beatnhit: 0,
    drowned: 0,
    dust2: 0
};

let currentGallery = null;
let currentImageIndex = 0;

// Language switching functionality (Default: English)
let currentLanguage = 'en';

function toggleLanguage() {
    // Toggle between English and French
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    
    // Update button text
    const langBtn = document.getElementById('lang-btn');
    const langBtnMobile = document.getElementById('lang-btn-mobile');
    
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'en' ? 'FR' : 'EN';
    }
    if (langBtnMobile) {
        langBtnMobile.textContent = currentLanguage === 'en' ? 'FR' : 'EN';
    }
    
    // Update all elements with data-en and data-fr attributes
    const elements = document.querySelectorAll('[data-en][data-fr]');
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const frText = element.getAttribute('data-fr');
        
        // Check if the content contains HTML tags
        const containsHTML = /<[^>]*>/.test(enText) || /<[^>]*>/.test(frText);
        
        const textToUse = currentLanguage === 'en' ? enText : frText;
        
        if (containsHTML) {
            element.innerHTML = textToUse;
        } else {
            element.textContent = textToUse;
        }
    });
    
    // Store language preference
    localStorage.setItem('preferredLanguage', currentLanguage);
}

// Project image navigation
function changeProjectImage(projectName, direction, event) {
    // Prevent the click from triggering the image modal
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const gallery = imageGalleries[projectName];
    if (!gallery) return;
    
    // Update index
    currentProjectImages[projectName] += direction;
    
    // Wrap around
    if (currentProjectImages[projectName] < 0) {
        currentProjectImages[projectName] = gallery.length - 1;
    } else if (currentProjectImages[projectName] >= gallery.length) {
        currentProjectImages[projectName] = 0;
    }
    
    // Update image
    const imageElement = document.getElementById(`${projectName}-image`);
    const indicatorElement = document.getElementById(`${projectName}-indicator`);
    
    if (imageElement) {
        // Fade effect
        imageElement.style.opacity = '0';
        
        setTimeout(() => {
            imageElement.src = gallery[currentProjectImages[projectName]];
            imageElement.style.opacity = '1';
        }, 150);
    }
    
    if (indicatorElement) {
        indicatorElement.textContent = `${currentProjectImages[projectName] + 1} / ${gallery.length}`;
    }
}

// Image gallery functions for modal
function openImageGallery(galleryName, imageIndex = 0) {
    const gallery = imageGalleries[galleryName];
    if (!gallery || gallery.length === 0) return;

    currentGallery = galleryName;
    currentImageIndex = imageIndex;

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (modal && modalImage) {
        modalImage.src = gallery[currentImageIndex];
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update counter
        if (imageCounter) {
            imageCounter.textContent = `${currentImageIndex + 1} / ${gallery.length}`;
        }

        // Show/hide navigation buttons
        if (prevBtn && nextBtn) {
            prevBtn.style.display = gallery.length > 1 ? 'block' : 'none';
            nextBtn.style.display = gallery.length > 1 ? 'block' : 'none';
            
            prevBtn.disabled = currentImageIndex === 0;
            nextBtn.disabled = currentImageIndex === gallery.length - 1;
        }

        // Smooth animation
        modalImage.style.transform = 'scale(0.8)';
        modalImage.style.opacity = '0';

        setTimeout(() => {
            modalImage.style.transition = 'all 0.3s ease';
            modalImage.style.transform = 'scale(1)';
            modalImage.style.opacity = '1';
        }, 10);
    }
}

function nextImage() {
    if (!currentGallery) return;
    const gallery = imageGalleries[currentGallery];
    if (currentImageIndex < gallery.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
}

function previousImage() {
    if (!currentGallery) return;
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
}

function updateModalImage() {
    const gallery = imageGalleries[currentGallery];
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (modalImage && gallery) {
        // Fade out
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            modalImage.src = gallery[currentImageIndex];
            
            // Update counter
            if (imageCounter) {
                imageCounter.textContent = `${currentImageIndex + 1} / ${gallery.length}`;
            }

            // Update button states
            if (prevBtn && nextBtn) {
                prevBtn.disabled = currentImageIndex === 0;
                nextBtn.disabled = currentImageIndex === gallery.length - 1;
            }

            // Fade in
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        }, 150);
    }
}

// Single image modal (for projects with only one image)
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Hide navigation for single images
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (imageCounter) imageCounter.style.display = 'none';
        
        // Smooth animation
        modalImage.style.transform = 'scale(0.8)';
        modalImage.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.style.transition = 'all 0.3s ease';
            modalImage.style.transform = 'scale(1)';
            modalImage.style.opacity = '1';
        }, 10);
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    if (modal && modalImage) {
        modalImage.style.transform = 'scale(0.8)';
        modalImage.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset gallery state
            currentGallery = null;
            currentImageIndex = 0;
            
            // Show counter again
            if (imageCounter) imageCounter.style.display = 'block';
        }, 300);
    }
}

// Mobile menu functions
let isToggling = false;

function toggleMobileMenu() {
    if (isToggling) {
        return;
    }
    
    isToggling = true;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    
    if (!mobileMenu) {
        isToggling = false;
        return;
    }
    
    mobileMenu.classList.toggle('active');
    menuToggle?.classList.toggle('active');
    
    // Update button text based on menu state
    if (mobileMenuButton) {
        mobileMenuButton.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    }
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    
    setTimeout(() => {
        isToggling = false;
    }, 300);
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    
    mobileMenu.classList.remove('active');
    menuToggle?.classList.remove('active');
    
    // Reset button text
    if (mobileMenuButton) {
        mobileMenuButton.textContent = '☰';
    }
    
    document.body.style.overflow = 'auto';
}

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize particle system
    new ParticleSystem();
    
    // Load saved language preference (default to English)
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    currentLanguage = savedLang;
    
    // Set initial button text
    const langBtn = document.getElementById('lang-btn');
    const langBtnMobile = document.getElementById('lang-btn-mobile');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'en' ? 'FR' : 'EN';
    }
    if (langBtnMobile) {
        langBtnMobile.textContent = currentLanguage === 'en' ? 'FR' : 'EN';
    }
    
    // Apply saved language on load
    if (savedLang !== 'en') {
        // Update all elements with current language without toggling
        const elements = document.querySelectorAll('[data-en][data-fr]');
        elements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const frText = element.getAttribute('data-fr');
            const containsHTML = /<[^>]*>/.test(enText) || /<[^>]*>/.test(frText);
            const textToUse = currentLanguage === 'en' ? enText : frText;
            
            if (containsHTML) {
                element.innerHTML = textToUse;
            } else {
                element.textContent = textToUse;
            }
        });
    }
    
    // Add click event listeners to language buttons
    if (langBtn) {
        langBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleLanguage();
        });
    }
    if (langBtnMobile) {
        langBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleLanguage();
        });
    }
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / scrollHeight) * 100;
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.width = scrollPercent + '%';
        }
        
        // Update navbar
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Show/hide back to top button
        if (backToTopButton) {
            if (scrolled > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    });
    
    // Smooth scroll for navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);

    // Observe project cards and skill items
    document.querySelectorAll('.project-card, .skill-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Mobile menu event listeners
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuButton = document.getElementById('mobileMenuBtn');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    // Toggle menu on hamburger click (navbar)
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Toggle menu on mobile button click
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            setTimeout(() => {
                toggleMobileMenu();
            }, 10);
        });
    }
    
    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    console.log('Portfolio Lucas DUPERRAY loaded successfully!');
});

// Close modal with Escape key and arrow navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    } else if (e.key === 'ArrowLeft') {
        previousImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Mouse movement parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const hero = document.querySelector('.hero');
    if (hero) {
        const offsetX = (mouseX - 0.5) * 10;
        const offsetY = (mouseY - 0.5) * 10;
        hero.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
});

// Toggle show more projects
function toggleProjects() {
    const hiddenProjects = document.querySelectorAll('.project-hidden');
    const btn = document.getElementById('showMoreBtn');
    const btnText = btn.querySelector('span[data-en]');
    
    const isShowing = btn.classList.contains('active');
    
    hiddenProjects.forEach(project => {
        if (isShowing) {
            project.style.display = 'none';
        } else {
            project.style.display = 'flex';
        }
    });
    
    if (isShowing) {
        btn.classList.remove('active');
        btnText.setAttribute('data-en', 'Show More Projects');
        btnText.setAttribute('data-fr', 'Voir Plus de Projets');
        btnText.textContent = currentLanguage === 'fr' ? 'Voir Plus de Projets' : 'Show More Projects';
        
        // Scroll back to projects section
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    } else {
        btn.classList.add('active');
        btnText.setAttribute('data-en', 'Show Less');
        btnText.setAttribute('data-fr', 'Voir Moins');
        btnText.textContent = currentLanguage === 'fr' ? 'Voir Moins' : 'Show Less';
    }
}