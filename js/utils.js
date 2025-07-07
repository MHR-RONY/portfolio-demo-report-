class Utilities {
	constructor() {
		this.backToTop = document.getElementById('backToTop');
		this.init();
	}
	init() {
		this.initBackToTop();
		this.addSmoothScrolling();
		this.initLazyLoading();
	}
	initBackToTop() {
		if (!this.backToTop) {
			this.createBackToTopButton();
		}
		const progressRing = this.backToTop.querySelector('.progress-ring-circle');
		const radius = progressRing ? parseFloat(progressRing.getAttribute('r')) : 30;
		const circumference = 2 * Math.PI * radius;
		if (progressRing) {
			progressRing.style.strokeDasharray = circumference;
			progressRing.style.strokeDashoffset = circumference;
		}
		const scrollHandler = this.throttle(() => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const scrollPercent = Math.min(scrollTop / docHeight, 1);
			if (scrollTop > 300) {
				this.backToTop.classList.add('show');
				if (progressRing) {
					const offset = circumference - (scrollPercent * circumference);
					progressRing.style.strokeDashoffset = offset;
				}
			} else {
				this.backToTop.classList.remove('show');
			}
		}, 16);
		window.addEventListener('scroll', scrollHandler);
		this.backToTop.addEventListener('click', () => {
			this.backToTop.style.transform = 'scale(0.9)';
			setTimeout(() => {
				this.backToTop.style.transform = '';
			}, 150);
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
			setTimeout(() => {
				this.backToTop.style.animation = 'pulse 0.6s ease-out';
				setTimeout(() => {
					this.backToTop.style.animation = '';
				}, 600);
			}, 300);
		});
		let tooltipTimer;
		this.backToTop.addEventListener('mouseenter', () => {
			clearTimeout(tooltipTimer);
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const scrollPercent = Math.round((scrollTop / docHeight) * 100);
			if (scrollPercent > 0) {
				this.showScrollTooltip(this.backToTop, `${scrollPercent}% scrolled`, 3000);
			}
		});
		this.backToTop.addEventListener('mouseleave', () => {
			tooltipTimer = setTimeout(() => {
				const tooltip = document.querySelector('.custom-tooltip');
				if (tooltip) {
					tooltip.style.opacity = '0';
					setTimeout(() => tooltip.remove(), 300);
				}
			}, 100);
		});
	}
	createBackToTopButton() {
		this.backToTop = document.createElement('button');
		this.backToTop.id = 'backToTop';
		this.backToTop.className = 'back-to-top';
		this.backToTop.innerHTML = `
            <svg class="progress-ring" width="64" height="64">
                <circle
                    class="progress-ring-circle"
                    stroke="currentColor"
                    stroke-width="3"
                    fill="transparent"
                    r="30"
                    cx="32"
                    cy="32"
                />
            </svg>
            <i class="fas fa-arrow-up"></i>
        `;
		this.backToTop.setAttribute('aria-label', 'Back to top');
		this.backToTop.setAttribute('title', 'Back to top');
		document.body.appendChild(this.backToTop);
	}
	addSmoothScrolling() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener('click', function (e) {
				const href = this.getAttribute('href');
				if (href === '#') return;
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					const offsetTop = target.offsetTop - 70;
					window.scrollTo({
						top: offsetTop,
						behavior: 'smooth'
					});
				}
			});
		});
	}
	initLazyLoading() {
		const images = document.querySelectorAll('img[data-src]');
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});
		images.forEach(img => {
			imageObserver.observe(img);
		});
	}
	debounce(func, wait, immediate) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				timeout = null;
				if (!immediate) func(...args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func(...args);
		};
	}
	throttle(func, limit) {
		let inThrottle;
		return function (...args) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => inThrottle = false, limit);
			}
		};
	}
	copyToClipboard(text) {
		if (navigator.clipboard) {
			return navigator.clipboard.writeText(text);
		} else {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand('copy');
				document.body.removeChild(textArea);
				return Promise.resolve();
			} catch (err) {
				document.body.removeChild(textArea);
				return Promise.reject(err);
			}
		}
	}
	showTooltip(element, message, duration = 2000) {
		const tooltip = document.createElement('div');
		tooltip.className = 'custom-tooltip';
		tooltip.textContent = message;
		tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
		document.body.appendChild(tooltip);
		const rect = element.getBoundingClientRect();
		tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
		tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
		setTimeout(() => tooltip.style.opacity = '1', 10);
		setTimeout(() => {
			tooltip.style.opacity = '0';
			setTimeout(() => tooltip.remove(), 300);
		}, duration);
	}
	showScrollTooltip(element, message, duration = 3000) {
		const existingTooltip = document.querySelector('.custom-tooltip');
		if (existingTooltip) {
			existingTooltip.remove();
		}
		const tooltip = document.createElement('div');
		tooltip.className = 'custom-tooltip';
		tooltip.innerHTML = `
            <i class="fas fa-chart-line" style="margin-right: 5px; color: var(--secondary-color);"></i>
            ${message}
        `;
		document.body.appendChild(tooltip);
		const rect = element.getBoundingClientRect();
		tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
		tooltip.style.top = (rect.top - tooltip.offsetHeight - 15) + 'px';
		setTimeout(() => {
			tooltip.style.opacity = '1';
			tooltip.style.transform = 'translateY(-5px)';
		}, 10);
		setTimeout(() => {
			if (tooltip.parentNode) {
				tooltip.style.opacity = '0';
				tooltip.style.transform = 'translateY(0)';
				setTimeout(() => {
					if (tooltip.parentNode) {
						tooltip.remove();
					}
				}, 300);
			}
		}, duration);
	}
	formatDate(date, options = {}) {
		const defaultOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
	}
	animateNumber(element, target, duration = 2000) {
		const start = parseInt(element.textContent) || 0;
		const range = target - start;
		const increment = range / (duration / 16);
		let current = start;
		const timer = setInterval(() => {
			current += increment;
			if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
				current = target;
				clearInterval(timer);
			}
			element.textContent = Math.floor(current);
		}, 16);
	}
	isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
	getDeviceType() {
		const width = window.innerWidth;
		if (width <= 480) return 'mobile';
		if (width <= 768) return 'tablet';
		return 'desktop';
	}
	preloadImages(imageUrls) {
		const promises = imageUrls.map(url => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = resolve;
				img.onerror = reject;
				img.src = url;
			});
		});
		return Promise.all(promises);
	}
}
document.addEventListener('DOMContentLoaded', () => {
	window.utils = new Utilities();
});
window.Utilities = Utilities;
