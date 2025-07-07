class HeroSection {
	constructor() {
		this.heroTitle = document.querySelector('.hero-title');
		this.learnMoreBtn = document.getElementById('learnMoreBtn');
		this.contactBtn = document.getElementById('contactBtn');
		this.heroSection = document.querySelector('.hero');
		this.init();
	}
	init() {
		this.createAnimatedElements();
		this.bindEvents();
		this.startTypewriterEffect();
		this.initParallaxEffect();
	}
	bindEvents() {
		if (this.learnMoreBtn) {
			this.learnMoreBtn.addEventListener('click', () => {
				document.getElementById('portfolio').scrollIntoView({
					behavior: 'smooth'
				});
			});
		}
		if (this.contactBtn) {
			this.contactBtn.addEventListener('click', () => {
				document.getElementById('contact').scrollIntoView({
					behavior: 'smooth'
				});
			});
		}
		const scrollIndicator = document.querySelector('.scroll-indicator');
		if (scrollIndicator) {
			scrollIndicator.addEventListener('click', () => {
				document.getElementById('about').scrollIntoView({
					behavior: 'smooth'
				});
			});
		}
	}
	createAnimatedElements() {
		if (!this.heroSection) return;
		const heroBackground = document.createElement('div');
		heroBackground.className = 'hero-background';
		this.heroSection.appendChild(heroBackground);
		this.createFloatingShapes(heroBackground);
		this.createParticles(heroBackground);
		this.createAnimatedLines(heroBackground);
		this.createGlowingOrbs(heroBackground);
		this.createScrollIndicator();
	}
	createFloatingShapes(container) {
		for (let i = 1; i <= 5; i++) {
			const shape = document.createElement('div');
			shape.className = `floating-shape shape-${i}`;
			container.appendChild(shape);
		}
	}
	createParticles(container) {
		const particlesContainer = document.createElement('div');
		particlesContainer.className = 'particles';
		for (let i = 1; i <= 9; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particlesContainer.appendChild(particle);
		}
		container.appendChild(particlesContainer);
	}
	createAnimatedLines(container) {
		const linesContainer = document.createElement('div');
		linesContainer.className = 'animated-lines';
		for (let i = 1; i <= 3; i++) {
			const line = document.createElement('div');
			line.className = `line line-${i}`;
			linesContainer.appendChild(line);
		}
		container.appendChild(linesContainer);
	}
	createGlowingOrbs(container) {
		for (let i = 1; i <= 3; i++) {
			const orb = document.createElement('div');
			orb.className = `glowing-orb orb-${i}`;
			container.appendChild(orb);
		}
	}
	createScrollIndicator() {
		const indicator = document.createElement('div');
		indicator.className = 'scroll-indicator';
		indicator.innerHTML = `
            <div class="scroll-mouse">
                <div class="scroll-wheel"></div>
            </div>
        `;
		this.heroSection.appendChild(indicator);
		indicator.addEventListener('click', () => {
			document.getElementById('about').scrollIntoView({
				behavior: 'smooth'
			});
		});
	}
	startTypewriterEffect() {
		if (!this.heroTitle) return;
		const text = this.heroTitle.textContent;
		this.heroTitle.textContent = '';
		const cursor = document.createElement('span');
		cursor.className = 'typewriter-cursor';
		cursor.textContent = '|';
		this.heroTitle.appendChild(cursor);
		let i = 0;
		const typeWriter = () => {
			if (i < text.length) {
				this.heroTitle.insertBefore(
					document.createTextNode(text.charAt(i)),
					cursor
				);
				i++;
				setTimeout(typeWriter, 100);
			} else {
				setTimeout(() => {
					if (cursor.parentNode) {
						cursor.remove();
					}
				}, 2000);
			}
		};
		setTimeout(typeWriter, 1000);
	}
	initParallaxEffect() {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			const rate = scrolled * -0.5;
			if (this.heroSection) {
				this.heroSection.style.transform = `translateY(${rate}px)`;
			}
			const shapes = document.querySelectorAll('.floating-shape');
			shapes.forEach((shape, index) => {
				const speed = 0.2 + (index * 0.1);
				const yPos = -(scrolled * speed);
				shape.style.transform = `translateY(${yPos}px)`;
			});
			const orbs = document.querySelectorAll('.glowing-orb');
			orbs.forEach((orb, index) => {
				const speed = 0.3 + (index * 0.15);
				const yPos = -(scrolled * speed);
				orb.style.transform = `translateY(${yPos}px)`;
			});
		});
	}
	addRippleEffect(button) {
		button.addEventListener('click', function (e) {
			const ripple = document.createElement('span');
			const rect = this.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height);
			const x = e.clientX - rect.left - size / 2;
			const y = e.clientY - rect.top - size / 2;
			ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
			this.style.position = 'relative';
			this.style.overflow = 'hidden';
			this.appendChild(ripple);
			setTimeout(() => {
				ripple.remove();
			}, 600);
		});
	}
}
document.addEventListener('DOMContentLoaded', () => {
	const heroSection = new HeroSection();
	const heroButtons = document.querySelectorAll('.hero-btn, .hero-btn-secondary');
	heroButtons.forEach(button => {
		heroSection.addRippleEffect(button);
	});
});
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
