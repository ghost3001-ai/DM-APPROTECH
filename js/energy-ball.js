class EnergyBall {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.particles = [];
    this.time = 0;
    this.rotation = 0;
    
    this.initParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.handleResize());
  }
  
  initParticles() {
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 20;
      
      this.particles.push({
        x: Math.cos(theta) * Math.sin(phi) * radius,
        y: Math.sin(theta) * Math.sin(phi) * radius,
        z: Math.cos(phi) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        color: this.getRandomColor(),
        originalOpacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  getRandomColor() {
    const colors = [
      '#00d4ff',  // Cyan
      '#00ff88',  // Green
      '#ff0080',  // Pink
      '#ffff00',  // Yellow
      '#0080ff',  // Blue
      '#ff8000',  // Orange
      '#ff00ff'   // Magenta
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  rotateX(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const y = point.y * cos - point.z * sin;
    const z = point.y * sin + point.z * cos;
    return { x: point.x, y, z };
  }
  
  rotateY(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = point.x * cos + point.z * sin;
    const z = -point.x * sin + point.z * cos;
    return { x, y: point.y, z };
  }
  
  rotateZ(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = point.x * cos - point.y * sin;
    const y = point.x * sin + point.y * cos;
    return { x, y, z: point.z };
  }
  
  project(point) {
    const scale = 300 / (300 + point.z);
    return {
      x: (point.x * scale) + this.width / 2,
      y: (point.y * scale) + this.height / 2,
      z: point.z,
      scale
    };
  }
  
  update() {
    this.time += 0.005;
    this.rotation += 0.005;
    
    this.particles.forEach(particle => {
      // Appliquer les rotations
      let p = { x: particle.x, y: particle.y, z: particle.z };
      p = this.rotateX(p, this.rotation * 0.3);
      p = this.rotateY(p, this.rotation * 0.5);
      p = this.rotateZ(p, this.rotation * 0.2);
      
      // Ajouter une ondulation d'énergie
      const waveInfluence = Math.sin(this.time + particle.z * 0.01) * 10;
      const distance = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
      
      if (distance > 0) {
        p.x += (p.x / distance) * waveInfluence;
        p.y += (p.y / distance) * waveInfluence;
        p.z += (p.z / distance) * waveInfluence;
      }
      
      particle.x = p.x;
      particle.y = p.y;
      particle.z = p.z;
      
      // Animation de l'opacité
      particle.opacity = particle.originalOpacity + Math.sin(this.time * 2 + particle.size) * 0.3;
    });
  }
  
  draw() {
    // Fond avec dégradé
    const grad = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, Math.max(this.width, this.height));
    grad.addColorStop(0, 'rgba(20, 100, 111, 0.3)');
    grad.addColorStop(0.5, 'rgba(13, 59, 80, 0.5)');
    grad.addColorStop(1, 'rgba(5, 30, 40, 0.8)');
    
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Trier les particules par profondeur (z)
    this.particles.sort((a, b) => a.z - b.z);
    
    // Dessiner les particules
    this.particles.forEach(particle => {
      const projected = this.project(particle);
      
      // Glow effect
      const glowSize = particle.size * 3;
      const glowGrad = this.ctx.createRadialGradient(projected.x, projected.y, 0, projected.x, projected.y, glowSize);
      glowGrad.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.6})`);
      glowGrad.addColorStop(0.5, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      glowGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      
      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(projected.x, projected.y, glowSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Particule centrale
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.beginPath();
      this.ctx.arc(projected.x, projected.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
    
    // Cœur de la boule
    const coreGrad = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, 40);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    coreGrad.addColorStop(0.3, '#00d4ff');
    coreGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    
    this.ctx.fillStyle = coreGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 40, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Halo extérieur
    const haloGrad = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 100, this.width / 2, this.height / 2, 150);
    haloGrad.addColorStop(0, `rgba(0, 212, 255, ${0.3 + Math.sin(this.time * 2) * 0.2})`);
    haloGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    
    this.ctx.fillStyle = haloGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 150, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
  
  handleResize() {
    // Redimensionner le canvas si nécessaire
    const rect = this.canvas.getBoundingClientRect();
    if (this.width !== rect.width || this.height !== rect.height) {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    }
  }
}

// Initialiser la boule d'énergie au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('energyBallCanvas');
  if (canvas) {
    new EnergyBall('energyBallCanvas');
  }
});
