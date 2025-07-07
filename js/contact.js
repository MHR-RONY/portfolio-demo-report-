class ContactForm {
	constructor() {
		this.contactForm = document.getElementById('contactForm');
		this.submitBtn = document.querySelector('.submit-btn');
		this.init();
	}
	init() {
		if (this.contactForm) {
			this.bindEvents();
			this.initFormValidation();
		}
	}
	bindEvents() {
		this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
		const inputs = this.contactForm.querySelectorAll('input, textarea');
		inputs.forEach(input => {
			input.addEventListener('blur', () => this.validateField(input));
			input.addEventListener('input', () => this.clearErrors(input));
		});
	}
	initFormValidation() {
		const formGroups = this.contactForm.querySelectorAll('.form-group');
		formGroups.forEach(group => {
			const input = group.querySelector('input, textarea');
			if (input && !input.placeholder) {
				const fieldName = input.name;
				input.placeholder = ' ';
				if (!group.querySelector('label')) {
					const label = document.createElement('label');
					label.textContent = this.getFieldLabel(fieldName);
					label.setAttribute('for', input.id || input.name);
					group.appendChild(label);
				}
			}
		});
	}
	getFieldLabel(fieldName) {
		const labels = {
			'name': 'Full Name',
			'email': 'Email Address',
			'subject': 'Subject',
			'message': 'Your Message'
		};
		return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
	}
	validateField(field) {
		const value = field.value.trim();
		const fieldName = field.name;
		const formGroup = field.closest('.form-group');
		this.clearErrors(field);
		let isValid = true;
		let errorMessage = '';
		if (!value) {
			isValid = false;
			errorMessage = `${this.getFieldLabel(fieldName)} is required`;
		} else if (fieldName === 'email' && !this.isValidEmail(value)) {
			isValid = false;
			errorMessage = 'Please enter a valid email address';
		} else if (fieldName === 'name' && value.length < 2) {
			isValid = false;
			errorMessage = 'Name must be at least 2 characters long';
		} else if (fieldName === 'message' && value.length < 10) {
			isValid = false;
			errorMessage = 'Message must be at least 10 characters long';
		}
		if (isValid) {
			formGroup.classList.add('success');
			formGroup.classList.remove('error');
		} else {
			formGroup.classList.add('error');
			formGroup.classList.remove('success');
			this.showFieldError(formGroup, errorMessage);
		}
		return isValid;
	}
	clearErrors(field) {
		const formGroup = field.closest('.form-group');
		formGroup.classList.remove('error', 'success');
		const errorElement = formGroup.querySelector('.error-message');
		if (errorElement) {
			errorElement.remove();
		}
	}
	showFieldError(formGroup, message) {
		let errorElement = formGroup.querySelector('.error-message');
		if (!errorElement) {
			errorElement = document.createElement('div');
			errorElement.className = 'error-message';
			formGroup.appendChild(errorElement);
		}
		errorElement.textContent = message;
	}
	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	validateForm() {
		const inputs = this.contactForm.querySelectorAll('input[required], textarea[required]');
		let isFormValid = true;
		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isFormValid = false;
			}
		});
		return isFormValid;
	}
	async handleSubmit(e) {
		e.preventDefault();
		if (!this.validateForm()) {
			this.showNotification('Please fix the errors above', 'error');
			return;
		}
		this.setSubmitButtonLoading(true);
		try {
			const formData = new FormData(this.contactForm);
			const data = {
				name: formData.get('name'),
				email: formData.get('email'),
				subject: formData.get('subject') || 'Contact Form Submission',
				message: formData.get('message')
			};
			await this.submitForm(data);
			this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
			this.contactForm.reset();
			this.clearAllErrors();
		} catch (error) {
			console.error('Form submission error:', error);
			this.showNotification('Failed to send message. Please try again later.', 'error');
		} finally {
			this.setSubmitButtonLoading(false);
		}
	}
	async submitForm(data) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.1) {
					resolve(data);
				} else {
					reject(new Error('Network error'));
				}
			}, 1500);
		});
	}
	setSubmitButtonLoading(loading) {
		if (loading) {
			this.submitBtn.classList.add('loading');
			this.submitBtn.disabled = true;
			this.submitBtn.textContent = 'Sending...';
		} else {
			this.submitBtn.classList.remove('loading');
			this.submitBtn.disabled = false;
			this.submitBtn.textContent = 'Send Message';
		}
	}
	clearAllErrors() {
		const formGroups = this.contactForm.querySelectorAll('.form-group');
		formGroups.forEach(group => {
			group.classList.remove('error', 'success');
			const errorElement = group.querySelector('.error-message');
			if (errorElement) {
				errorElement.remove();
			}
		});
	}
	showNotification(message, type) {
		const existingNotification = document.querySelector('.notification');
		if (existingNotification) {
			existingNotification.remove();
		}
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : '⚠'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            min-width: 300px;
        `;
		document.body.appendChild(notification);
		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
		}, 100);
		const closeBtn = notification.querySelector('.notification-close');
		closeBtn.addEventListener('click', () => {
			notification.style.transform = 'translateX(400px)';
			setTimeout(() => notification.remove(), 300);
		});
		setTimeout(() => {
			if (notification.parentNode) {
				notification.style.transform = 'translateX(400px)';
				setTimeout(() => notification.remove(), 300);
			}
		}, 5000);
	}
}
document.addEventListener('DOMContentLoaded', () => {
	new ContactForm();
});
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .notification-icon {
        font-weight: bold;
        font-size: 1.2em;
        flex-shrink: 0;
    }
    .notification-message {
        flex: 1;
        line-height: 1.4;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5em;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
    .notification {
        border-left: 4px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
    }
    @media (max-width: 480px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            transform: translateY(-100px) !important;
            max-width: none;
            min-width: auto;
        }
        .notification.show {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(notificationStyles);
