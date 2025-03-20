class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#$____'
    this.update = this.update.bind(this)
    // Store original container width for consistent sizing
    this.originalText = el.innerText;
    this.originalWidth = el.offsetWidth;
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40) // Reduced animation time
      const end = start + Math.floor(Math.random() * 30) // Reduced animation time
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// Initialize text scramble effect if enabled
document.addEventListener('DOMContentLoaded', function() {
  // Check if animations are enabled in site config
  const animationsEnabled = document.body.getAttribute('data-animations-enabled') === 'true';
  const textScrambleEnabled = document.body.getAttribute('data-text-scramble-enabled') === 'true';
  
  if (animationsEnabled && textScrambleEnabled) {
    const el = document.querySelector('.company-name.diff');
    if (el) {
      // Get phrases from data attribute or use defaults
      let phrases;
      try {
        phrases = JSON.parse(document.body.getAttribute('data-scramble-phrases') || '[]');
      } catch (e) {
        phrases = [];
      }
      
      // Fallback to defaults if no phrases found
      if (!phrases.length) {
        phrases = [
          'IT Consultant',
          'Cloud Consultant',
          'DevOps Engineer',
          'Platform Engineer',
          'Automation Alchemist'
        ];
      }
      
      const delay = parseInt(document.body.getAttribute('data-scramble-delay') || '2000', 10);
      
      const fx = new TextScramble(el);
      
      let counter = 0;
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, delay);
        });
        counter = (counter + 1) % phrases.length;
      };
      
      next();
    }
  }
}); 