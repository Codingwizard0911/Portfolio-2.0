// ========== Dynamic Typing Text ==========
const words = ["Data Scientist", "Data Analyst", "QA Engineer", "SQL Developer"];
let wordIndex = 0;
let charIndex = 0;
const typingText = document.getElementById("typingText");
const typingSpeed = 150;
const erasingSpeed = 100;
const delayBetweenWords = 1000;

function type() {
    if (charIndex < words[wordIndex].length) {
        typingText.textContent += words[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, delayBetweenWords);
    }
}

function erase() {
    if (charIndex > 0) {
        typingText.textContent = words[wordIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, delayBetweenWords);
});

// ========== Progress Bar ==========
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
});

// ========== Mobile Nav Toggle ==========
document.getElementById('navToggle').addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('active');
    this.classList.toggle('active');
});

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('navToggle').classList.remove('active');

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ========== Project Modal ==========
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalTech = document.getElementById('modalTech');
const modalGithub = document.getElementById('modalGithub');

projectCards.forEach(card => {
    card.addEventListener('click', function () {
        modalTitle.textContent = this.querySelector('h3').textContent;
        modalImage.src = this.querySelector('img').src;
        modalDescription.textContent = this.querySelector('p').textContent;
        modalTech.innerHTML = this.querySelector('.project-tech').innerHTML;
        modalGithub.href = this.querySelector('.project-link').href;

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', e => {
    if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ========== Form Submission (Flask endpoint) ==========
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalBtnText = submitBtn.innerHTML;

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    fetch('/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(jsonResponse => {
        if (jsonResponse.success) {
            formStatus.innerHTML = `
                <div class="status-message success">
                    <div class="status-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="status-text">${jsonResponse.message}</div>
                </div>`;
            contactForm.reset();
        } else {
            formStatus.innerHTML = `
                <div class="status-message error">
                    <div class="status-icon"><i class="fas fa-exclamation-circle"></i></div>
                    <div class="status-text">${jsonResponse.message}</div>
                </div>`;
        }

        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        setTimeout(() => formStatus.innerHTML = '', 10000);
    })
    .catch(error => {
        formStatus.innerHTML = `
            <div class="status-message error">
                <div class="status-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="status-text">Network error: ${error.message}</div>
            </div>`;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
});
