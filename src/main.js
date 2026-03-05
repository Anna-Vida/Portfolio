
import { setupBreadcrumb } from './breadcrumb.js';

setupBreadcrumb();


const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Toggle menu on click
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  // Change icon from bars to X
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-items a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

// Navbar scroll effect
const navbar = document.querySelector("#navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Dynamic Navigation Active State
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll(".nav-items a");

navLinks.forEach(link => {
  // Remove preexisting active classes
  link.classList.remove("active");
  const linkPath = new URL(link.href).pathname;

  if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
    link.classList.add("active");
  }
});

// Floating Particles Generator
function createParticles() {
  const particleCount = window.innerWidth > 768 ? 15 : 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 60 + 20;
    const duration = Math.random() * 8 + 6;
    const floatDistance = Math.random() * 100 + 50;
    const color = ['var(--primary)', 'var(--secondary)', 'var(--accent)'][Math.floor(Math.random() * 3)];

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.background = color;
    particle.style.setProperty('--duration', duration + 's');
    particle.style.setProperty('--float-distance', floatDistance + 'px');
    particle.style.opacity = '0.1';
    particle.style.position = 'fixed';
    particle.style.zIndex = '0';

    document.body.appendChild(particle);
  }
}

// Cursor Tracer Effect
function initCursorTracer() {
  if (window.innerWidth < 768) return; // Disable on mobile

  const tracer = document.createElement('div');
  tracer.classList.add('cursor-tracer');
  document.body.appendChild(tracer);

  document.addEventListener('mousemove', (e) => {
    tracer.classList.add('active');
    tracer.style.left = e.clientX + 'px';
    tracer.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    tracer.classList.remove('active');
  });
}

// Initialize on load
window.addEventListener('load', () => {
  createParticles();
  initCursorTracer();
});

// Scroll Reveal Animation with Intersection Observer
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  let delay = 0;
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("reveal");
      }, delay);
      delay += 100; // Stagger effect
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class to sections and observe them
document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
  observer.observe(el);
});


// Typing effect for Hero
const title = document.querySelector("#hero-title");
if (title) {
  const fullText = "Anna Patricia Bolor Vida";
  const cursor = title.querySelector(".cursor");
  title.innerHTML = `<span class="text"></span>`;
  title.appendChild(cursor);

  const textContainer = title.querySelector(".text");
  let i = 0;

  function type() {
    if (i < fullText.length) {
      textContainer.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, 80);
    }
  }

  window.addEventListener("load", type);
}



