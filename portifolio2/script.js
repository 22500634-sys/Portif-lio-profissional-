document.addEventListener('DOMContentLoaded', () => {

  // 1. EFEITO TYPING DE TEXTO
  const typingElement = document.getElementById('typing-text');
  const words = [
    "Técnico em Informática (Cotemig)",
    "Redes LAN, Wi-Fi & Switches",
    "Manutenção de PCs e Notebooks",
    "Administração de Sistemas Windows & Linux"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 500;
    }

    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // 2. CANVAS ANIMAÇÃO DE CONEXÕES DE REDE
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = (Math.random() - 0.5) * 1.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - distance / 110})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // 3. FILTRO INTERATIVO DE HABILIDADES
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 4. TERMINAL DE COMANDO INTERATIVO DE T.I
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  const commands = {
    help: "Comandos disponíveis: <span class='highlight'>whoami</span>, <span class='highlight'>skills</span>, <span class='highlight'>contact</span>, <span class='highlight'>ping</span>, <span class='highlight'>clear</span>",
    whoami: "João Paulo Ferreira Lima | Estudante de T.I no Cotemig | 15 anos | Belo Horizonte - MG",
    skills: "Hardware, Sistemas Windows/Linux, Redes LAN/Wi-Fi, Roteadores/Switches, Google Workspace & MS Office",
    contact: "E-mail: joao.p.f.lima@icloud.com | Telefone: (31) 98576-2045",
    ping: "PING cotemig.br (127.0.0.1): 56 data bytes. 64 bytes: icmp_seq=0 ttl=64 time=1.24 ms. Conexão OK!"
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      const line = document.createElement('div');
      line.style.margin = '5px 0';
      line.innerHTML = `<span class="prompt">joaopaulo@sys:~$</span> ${input}`;
      terminalOutput.appendChild(line);

      if (input === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      }

      const response = document.createElement('div');
      response.style.color = '#94a3b8';
      response.style.marginBottom = '10px';

      if (commands[input]) {
        response.innerHTML = commands[input];
      } else if (input !== '') {
        response.innerHTML = `Comando desconhecido: '<span style="color:#ff5f56">${input}</span>'. Digite <span class="highlight">'help'</span>.`;
      }

      terminalOutput.appendChild(response);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  // 5. ANIMAÇÃO AO ROLAR A PÁGINA (SCROLL REVEAL)
  const reveals = document.querySelectorAll('.reveal');
  function checkScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    reveals.forEach(reveal => {
      const revealTop = reveal.getBoundingClientRect().top;
      if (revealTop < triggerBottom) {
        reveal.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // 6. FORMULÁRIO DE CONTATO
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Mensagem enviada com sucesso!');
    e.target.reset();
  });
});

// COPIAR TEXTO COM TOAST NOTIFICATION
function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
