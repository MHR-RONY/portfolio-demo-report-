class Navigation {
	constructor() {
		this.navbar = document.getElementById('navbar');
		this.navToggle = document.getElementById('mobile-menu');
		this.navMenu = document.getElementById('nav-menu');
		this.navLinks = document.querySelectorAll('.nav-link');
		this.init();
	}
	init() {
		this.bindEvents();
		this.createScrollProgress();
		this.updateActiveLink();
	}
	bindEvents() {
		if (this.navToggle) {
			this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
		}
		this.navLinks.forEach(link => {
			link.addEventListener('click', () => this.closeMobileMenu());
		});
		window.addEventListener('scroll', () => {
			this.handleScroll();
			this.updateActiveLink();
		});
	}
	toggleMobileMenu() {
		this.navMenu.classList.toggle('active');
		this.navToggle.classList.toggle('active');
	}
	closeMobileMenu() {
		this.navMenu.classList.remove('active');
		this.navToggle.classList.remove('active');
	}
	handleScroll() {
		if (window.scrollY > 100) {
			this.navbar.classList.add('scrolled');
		} else {
			this.navbar.classList.remove('scrolled');
		}
	}
	updateActiveLink() {
		const sections = document.querySelectorAll('section');
		const scrollPos = window.scrollY + 100;
		sections.forEach(section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute('id');
			if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
				this.navLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});
			}
		});
	}
	createScrollProgress() {
		const progressBar = document.createElement('div');
		progressBar.className = 'scroll-progress';
		document.body.appendChild(progressBar);
		window.addEventListener('scroll', () => {
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const scrolled = (winScroll / height) * 100;
			progressBar.style.width = scrolled + '%';
		});
	}
}
document.addEventListener('DOMContentLoaded', () => {
	new Navigation();
});
