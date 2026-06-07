/**
 * Reusable Canvas Confetti Milestone Celebration System
 * Fires customized confetti and particle effects when student targets are hit.
 */
(function() {
    const Celebrations = {
        canvas: null,
        ctx: null,
        particles: [],
        animationId: null,

        init: function() {
            if (this.canvas) return;
            this.canvas = document.createElement("canvas");
            this.canvas.id = "global-celebrations-canvas";
            this.canvas.style.position = "fixed";
            this.canvas.style.top = "0";
            this.canvas.style.left = "0";
            this.canvas.style.width = "100vw";
            this.canvas.style.height = "100vh";
            this.canvas.style.pointerEvents = "none";
            this.canvas.style.zIndex = "15000";
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext("2d");
            this.resize();
            window.addEventListener("resize", () => this.resize());
        },

        resize: function() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createParticle: function() {
            const colors = ["#2563eb", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * this.canvas.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            };
        },

        fire: function(duration = 3000) {
            this.init();
            this.particles = [];
            for (let i = 0; i < 150; i++) {
                this.particles.push(this.createParticle());
            }
            
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            
            const startTime = Date.now();
            const draw = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                let active = false;

                this.particles.forEach(p => {
                    p.tiltAngle += p.tiltAngleIncremental;
                    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                    p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;

                    if (p.y < this.canvas.height) {
                        active = true;
                    }

                    this.ctx.beginPath();
                    this.ctx.lineWidth = p.r;
                    this.ctx.strokeStyle = p.color;
                    this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                    this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                    this.ctx.stroke();
                });

                if (active && Date.now() - startTime < duration) {
                    this.animationId = requestAnimationFrame(draw);
                } else {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            };

            draw();
        }
    };

    window.Celebrations = Celebrations;
})();
