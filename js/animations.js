class AnimationController {
	constructor() {
		this.observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};
		this.init();
	}
	init() {
		this.createIntersectionObserver();
		this.initScrollAnimations();
		this.initCounterAnimations();
		this.initSkillBars();
		this.addPageLoadAnimation();
	}
	createIntersectionObserver() {
		this.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'translateY(0)';
					if (entry.target.classList.contains('stat-number')) {
						this.animateCounter(entry.target);
					}
					if (entry.target.classList.contains('skill-item')) {
						this.animateSkillBar(entry.target);
					}
					if (entry.target.classList.contains('feature-item')) {
						this.addStaggerAnimation(entry.target);
					}
					this.observer.unobserve(entry.target);
				}
			});
		}, this.observerOptions);
	}
	initScrollAnimations() {
		const elementsToObserve = document.querySelectorAll(`
            .portfolio-item,
            .testimonial-item,
            .feature-item,
            .stat-number,
            .skill-item,
            .contact-item
        `);
		elementsToObserve.forEach(element => {
			element.style.opacity = '0';
			element.style.transform = 'translateY(30px)';
			element.style.transition = 'all 0.6s ease-out';
			this.observer.observe(element);
		});
	}
	animateCounter(element) {
		const target = parseInt(element.getAttribute('data-target')) ||
			parseInt(element.textContent.replace(/\D/g, ''));
		if (!target) return;
		const increment = target / 100;
		let current = 0;
		const duration = 2000;
		const stepTime = duration / 100;
		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				current = target;
				clearInterval(timer);
			}
			element.textContent = Math.floor(current);
			if (element.textContent.includes('+') || element.dataset.suffix === '+') {
				element.textContent = Math.floor(current) + '+';
			}
		}, stepTime);
	}
	initCounterAnimations() {
		const statNumbers = document.querySelectorAll('.stat-number');
		statNumbers.forEach(stat => {
			const currentValue = parseInt(stat.textContent.replace(/\D/g, ''));
			if (currentValue) {
				stat.setAttribute('data-target', currentValue);
				stat.textContent = '0';
				if (stat.textContent.includes('+')) {
					stat.dataset.suffix = '+';
				}
			}
		});
	}
	initSkillBars() {
		const skillBars = document.querySelectorAll('.skill-progress');
		skillBars.forEach(bar => {
			const percentage = bar.parentElement.previousElementSibling.querySelector('.skill-percentage');
			if (percentage) {
				const value = parseInt(percentage.textContent);
				bar.style.width = '0%';
				bar.dataset.width = value + '%';
			}
		});
	}
	animateSkillBar(skillItem) {
		const progressBar = skillItem.querySelector('.skill-progress');
		if (progressBar && progressBar.dataset.width) {
			setTimeout(() => {
				progressBar.style.width = progressBar.dataset.width;
			}, 300);
		}
	}
	addStaggerAnimation(element) {
		const siblings = Array.from(element.parentElement.children);
		const index = siblings.indexOf(element);
		element.style.transitionDelay = `${index * 0.1}s`;
	}
	addPageLoadAnimation() {
		document.body.style.opacity = '0';
		document.body.style.transition = 'opacity 0.5s ease';
		window.addEventListener('load', () => {
			setTimeout(() => {
				document.body.style.opacity = '1';
			}, 100);
		});
	}
	revealElements() {
		const elements = document.querySelectorAll('.portfolio-item, .testimonial-item, .feature-item');
		elements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top;
			const elementVisible = 150;
			if (elementTop < window.innerHeight - elementVisible) {
				element.style.opacity = '1';
				element.style.transform = 'translateY(0)';
			}
		});
	}
	initPortfolioAnimations() {
		const portfolioItems = document.querySelectorAll('.portfolio-item-link');
		portfolioItems.forEach(item => {
			const portfolioItem = item.querySelector('.portfolio-item');
			item.addEventListener('mouseenter', () => {
				portfolioItem.style.transform = 'translateY(-10px) scale(1.02)';
			});
			item.addEventListener('mouseleave', () => {
				portfolioItem.style.transform = 'translateY(0) scale(1)';
			});
		});
		const portfolioImages = document.querySelectorAll('.portfolio-image img');
		portfolioImages.forEach((img, index) => {
			img.style.animation = `float 4s ease-in-out infinite ${index * 0.5}s`;
		});
	}
	initTextAnimations() {
		const sectionTitles = document.querySelectorAll('.section-title');
		const titleObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
					const underline = entry.target.nextElementSibling;
					if (underline && underline.classList.contains('title-underline')) {
						setTimeout(() => {
							underline.style.animation = 'expandWidth 0.8s ease-out forwards';
						}, 400);
					}
				}
			});
		}, { threshold: 0.5 });
		sectionTitles.forEach(title => {
			titleObserver.observe(title);
		});
	}
	createParticleSystem(container, count = 20) {
		for (let i = 0; i < count; i++) {
			const particle = document.createElement('div');
			particle.className = 'floating-particle';
			particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--secondary-color);
                border-radius: 50%;
                opacity: 0.6;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${6 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
			container.appendChild(particle);
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	const animationController = new AnimationController();
	setTimeout(() => {
		animationController.initPortfolioAnimations();
		animationController.initTextAnimations();
	}, 500);
});
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes expandWidth {
        from {
            width: 0;
        }
        to {
            width: 80px;
        }
    }
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    .floating-particle {
        pointer-events: none;
        z-index: 1;
    }
`;
document.head.appendChild(additionalStyles);
