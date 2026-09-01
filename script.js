/* JavaScript Application Logic for Nirmalya Swain's Portfolio */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dynamic Canvas Background
    initHUDCanvas();

    // 2. Initialize Navigation & Mobile Menu
    initNavigation();

    // 3. Initialize Project Filtering & Modal System
    initProjectsModal();

    // 4. Initialize Project Video Hover Preview Playback
    initProjectVideoHover();

    // 5. Initialize Interactive Arcade Game
    initArcadeGame();

    // 6. Initialize Contact Form Validation
    initContactForm();

    // 7. Initialize Stat Counter Animation
    initStatCounters();
});

/* ==========================================================================
   1. Dynamic VR HUD Background Canvas
   ========================================================================== */
function initHUDCanvas() {
    const canvas = document.getElementById('hudCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: width / 2, y: height / 2 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Particle nodes
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#00f3ff' : '#b026ff'
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Draw grid overlay
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw HUD Target Reticle around mouse cursor
        ctx.save();
        ctx.translate(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(176, 38, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(-32, 0); ctx.lineTo(-12, 0);
        ctx.moveTo(12, 0); ctx.lineTo(32, 0);
        ctx.moveTo(0, -32); ctx.lineTo(0, -12);
        ctx.moveTo(0, 12); ctx.lineTo(0, 32);
        ctx.stroke();
        ctx.restore();

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'rgba(0, 243, 255, 0.06)';
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   2. Navigation & Mobile Menu Logic
   ========================================================================== */
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }
}

/* ==========================================================================
   3. Projects Showcase Modal & Filtering Data (Nirmalya Swain VR & Game Projects)
   ========================================================================== */
const projectData = [
    {
        title: "VR Real Estate Sim (Android & Database Sync)",
        category: "VR / Android / Database",
        image: "assets/vr_real_estate.jpg",
        video: "video/realstate simulation.mp4",
        tags: ["Unity 3D", "Meta Quest SDK", "Android Native Plugin", "Firebase DB", "C# Scripting", "REST API"],
        description: "High-end 3D Virtual Reality real estate walkthrough connected to a companion Android app and cloud database. Built in Unity during my 2-year VR internship at Gauravgo Games. Potential homebuyers tour luxury properties in VR, customize wall colors, flooring, and furniture in real time, and sync saved preferences directly to their Android phone app and sales database.",
        features: [
            "Bi-directional real-time data sync between Meta Quest VR headset and companion Android app.",
            "Dynamic material swapper allowing clients to customize property finishes inside VR.",
            "Cloud database backend (Firebase / MySQL) for saving user property bookmarks and price quotes.",
            "Interactive 3D holographic mini-map floorplan navigation."
        ]
    },
    {
        title: "VR Home Tour Simulation",
        category: "VR / Home Tour",
        image: "assets/vr_home_tour.jpg",
        video: "video/room tour.mp4",
        tags: ["Unity 3D", "Meta Quest", "Spatial UI Navigation", "PBR Interiors", "C#"],
        description: "Immersive 3D Virtual Reality residential home tour walkthrough built in Unity for Meta Quest headsets. Allows homebuyers to inspect luxury property interiors, test lighting scenarios, and preview customizable furniture configurations in VR.",
        features: [
            "High-definition PBR interior lighting and dynamic shadow rendering.",
            "Interactive room teleportation and smooth thumbstick VR locomotion.",
            "Spatial audio acoustics with environmental room reverb.",
            "Customizable furniture layout and wall finish options."
        ]
    },
    {
        title: "VR Medical MRI Scanner Simulation",
        category: "Medical VR / Healthcare",
        image: "assets/vr_mri.jpg",
        video: "video/mri.mp4",
        tags: ["Unity 3D", "Meta Quest SDK", "Hand Tracking", "Medical Simulation", "Spatial Audio", "Haptics"],
        description: "Realistic VR medical training simulation built for healthcare technicians and radiology students to practice operating magnetic resonance imaging (MRI) machinery safely. Incorporates full hand tracking for patient setup, coil positioning, emergency shutoff drills, and live 3D brain scan visualization layers.",
        features: [
            "Meta Quest hand-tracking interaction for precise medical equipment control without physical buttons.",
            "Interactive MRI control panel with real-time acoustic gradient sound feedback.",
            "Safety protocol compliance scoring system and magnetic hazard alert drills.",
            "Volumetric 3D brain/body scan slice inspection layer inside VR."
        ]
    },
    {
        title: "VR Stadium & Arena Simulation",
        category: "VR / Unity",
        image: "assets/vr_stadium.jpg",
        video: "assets/videos/vr_demo.mp4",
        tags: ["Unity 3D", "Meta Quest", "Occlusion Culling", "GPU Instancing", "Spatial Audio", "URP"],
        description: "Massive-scale VR sports stadium simulation capable of rendering 50,000+ animated audience crowd models while maintaining a locked 90 FPS performance on Meta Quest standalone VR headsets.",
        features: [
            "GPU instanced crowd rendering with randomized fan animations and clothing colors.",
            "Spatial 3D crowd acoustics with dynamic Doppler audio effects during stadium events.",
            "Multiple camera vantage points (VIP Suites, Player Tunnel, Pitch Level, Commentary Box).",
            "Custom occlusion culling and LOD (Level of Detail) optimization pipeline."
        ]
    },
    {
        title: "VR Temple Architectural Simulation",
        category: "VR Heritage / Architecture",
        image: "assets/vr_temple.jpg",
        video: "video/vr temple simulation.mp4",
        tags: ["Unity 3D", "Meta Quest", "Volumetric Lighting", "URP Shader Graph", "Spatial Audio"],
        description: "Atmospheric, highly detailed 3D cultural heritage VR simulation of ancient Indian temple architecture. Features photorealistic stone carving textures, volumetric sunbeam lighting, and spatial audio chanting guides.",
        features: [
            "High-definition PBR stone textures optimized for standalone mobile VR.",
            "Volumetric god-ray light shafts created with custom Unity URP shaders.",
            "Interactive spatial audio narration explaining architectural and historical significance.",
            "Smooth locomotion and teleportation modes for maximum player VR comfort."
        ]
    },
    {
        title: "Sky Runner: Roblox Parkour & Speed Obby",
        category: "Roblox (Luau)",
        image: "assets/roblox_sky_runner.jpg",
        video: null,
        playLink: "https://www.roblox.com/share?code=018147b334442049810bec881c379dc3&type=ExperienceDetails&stamp=1787989362367",
        tags: ["Roblox Studio", "Luau OOP", "DataStore2", "ReplicatedStorage", "Leaderboards"],
        description: "High-speed Roblox sky parkour and obstacle runner created independently by Nirmalya Swain in Roblox Studio using object-oriented Luau scripts, client-server position replication, persistent stage data saving with DataStore2, and monetization gamepasses.",
        features: [
            "Modular Object-Oriented Luau scripting setup for smooth movement mechanics.",
            "DataStore2 implementation preventing data loss during server switches.",
            "Global server leaderboards and reward streak mechanics.",
            "Custom character trail particles and dynamic speed boost portals."
        ]
    },
    {
        title: "Zombie Shootout: Roblox Wave FPS",
        category: "Roblox (Luau)",
        image: "assets/roblox_zombie_shootout.jpg",
        video: null,
        playLink: "https://www.roblox.com/share?code=1ece9466655fd24c82eb50dbb5638adf&type=ExperienceDetails&stamp=1788251285860",
        tags: ["Roblox Team Lead", "Gauravgo Games", "Luau Gun Engine", "Raycast Hitboxes", "Zombie AI", "Weapon Shop"],
        description: "Action-packed Roblox wave-based zombie survival FPS shooter developed by Nirmalya Swain as Lead Developer and Team Lead of the Roblox Domain at Gauravgo Games. Features custom client-side gun raycasting with server-side validation to prevent exploits, weapon skin shop system, dynamic zombie horde AI, and custom HUD interface.",
        features: [
            "Led Roblox domain engineering team at Gauravgo Games for game release.",
            "Server-authoritative raycast gun framework ensuring secure hit registration.",
            "Zombie horde AI pathfinding with wave scaling difficulty.",
            "Modular weapon skin and upgrade shop system using DataStores."
        ]
    }
];

function initProjectsModal() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    // Filter Functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forward';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal Opening
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectIdx = parseInt(btn.getAttribute('data-project'));
            const p = projectData[projectIdx];
            if (!p) return;

            const mediaHeaderHtml = p.video ? `
                <div style="position: relative; width: 100%; height: 280px; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(0,243,255,0.4);">
                    <video autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover;">
                        <source src="${p.video}" type="video/mp4">
                    </video>
                </div>
            ` : `
                <div style="position: relative; width: 100%; height: 280px; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(0,243,255,0.4);">
                    <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;">
                </div>
            `;

            const playBtnHtml = p.playLink ? `<a href="${p.playLink}" target="_blank" class="btn btn-primary"><i class="fa-solid fa-gamepad"></i> Play ${p.title.split(':')[0]} on Roblox</a>` : `<a href="#contact" class="btn btn-primary" onclick="closeProjectModal()"><i class="fa-solid fa-paper-plane"></i> Inquire About This Tech</a>`;

            modalBody.innerHTML = `
                ${mediaHeaderHtml}
                <span class="badge-vr" style="display:inline-block; margin-bottom: 0.8rem;">${p.category}</span>
                <h2 style="font-size: 1.8rem; margin-bottom: 0.8rem; color: #fff;">${p.title}</h2>
                <p style="color: #a2aabf; line-height: 1.7; margin-bottom: 1.2rem;">${p.description}</p>
                
                <h3 style="font-size: 1.1rem; color: #00f3ff; margin-bottom: 0.6rem;">Key Technical Achievements:</h3>
                <ul style="color: #a2aabf; margin-left: 1.2rem; margin-bottom: 1.5rem;">
                    ${p.features.map(f => `<li style="margin-bottom: 0.4rem;">${f}</li>`).join('')}
                </ul>

                <h3 style="font-size: 1.1rem; color: #00f3ff; margin-bottom: 0.6rem;">Tech Stack & Tools:</h3>
                <div class="modal-tech-list">
                    ${p.tags.map(t => `<span>${t}</span>`).join('')}
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${playBtnHtml}
                    <button class="btn btn-outline" onclick="closeProjectModal()"><i class="fa-solid fa-xmark"></i> Close</button>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Modal Close
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/* ==========================================================================
   4. Project Video Hover Preview Playback Logic
   ========================================================================== */
function initProjectVideoHover() {
    const cards = document.querySelectorAll('.project-card, .internship-media');

    cards.forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log('Video autoplay prevented by browser:', err);
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

/* ==========================================================================
   5. Interactive HTML5 Canvas Mini-Game (Cyber Target Blaster)
   ========================================================================== */
function initArcadeGame() {
    const canvas = document.getElementById('gameCanvas');
    const overlay = document.getElementById('gameOverlay');
    const startBtn = document.getElementById('startGameBtn');
    const resetBtn = document.getElementById('resetGameBtn');
    const scoreEl = document.getElementById('arcadeScore');
    const highScoreEl = document.getElementById('arcadeHighScore');
    const livesEl = document.getElementById('arcadeLives');

    if (!canvas || !startBtn) return;

    const ctx = canvas.getContext('2d');

    let gameRunning = false;
    let score = 0;
    let lives = 3;
    let highScore = parseInt(localStorage.getItem('nirmalya_arcade_highscore') || '0');
    if (highScoreEl) highScoreEl.textContent = highScore;

    let player = {
        x: canvas.width / 2,
        y: canvas.height - 40,
        width: 40,
        height: 20,
        color: '#00f3ff'
    };

    let bullets = [];
    let targets = [];
    let particles = [];
    let lastTargetSpawn = 0;

    // Controls
    let keys = { ArrowLeft: false, ArrowRight: false, Space: false };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = true;
        if (e.code === 'Space' && gameRunning) {
            keys.Space = true;
            shootBullet();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = false;
        if (e.code === 'Space') keys.Space = false;
    });

    // Mouse Aim / Shoot
    canvas.addEventListener('mousemove', (e) => {
        if (!gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        player.x = (e.clientX - rect.left) * scaleX;
    });

    canvas.addEventListener('click', () => {
        if (gameRunning) shootBullet();
    });

    function shootBullet() {
        bullets.push({
            x: player.x,
            y: player.y - 10,
            radius: 4,
            speed: 9,
            color: '#ff007f'
        });
    }

    function spawnTarget() {
        targets.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: -20,
            radius: Math.random() * 12 + 14,
            speed: Math.random() * 1.5 + 1.2,
            color: Math.random() > 0.5 ? '#00f3ff' : '#b026ff',
            type: Math.random() > 0.7 ? 'hazard' : 'target'
        });
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 16; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                radius: Math.random() * 3 + 1,
                alpha: 1.0,
                color: color
            });
        }
    }

    function startGame() {
        score = 0;
        lives = 3;
        bullets = [];
        targets = [];
        particles = [];
        gameRunning = true;

        if (scoreEl) scoreEl.textContent = score;
        if (livesEl) livesEl.textContent = lives;
        if (overlay) overlay.style.display = 'none';

        gameLoop();
    }

    function gameOver() {
        gameRunning = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('nirmalya_arcade_highscore', highScore.toString());
            if (highScoreEl) highScoreEl.textContent = highScore;
        }

        if (overlay) {
            overlay.style.display = 'flex';
            overlay.querySelector('.overlay-card').innerHTML = `
                <h2 style="color: #ff0055;"><i class="fa-solid fa-skull"></i> GAME OVER</h2>
                <p>FINAL SCORE: <strong>${score}</strong> | HIGH SCORE: <strong>${highScore}</strong></p>
                <button class="btn btn-primary btn-large" id="restartGameBtn"><i class="fa-solid fa-rotate-right"></i> Play Again</button>
            `;
            document.getElementById('restartGameBtn')?.addEventListener('click', startGame);
        }
    }

    function gameLoop(timestamp = 0) {
        if (!gameRunning) return;

        ctx.fillStyle = '#04050a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move Player with Keys
        if (keys.ArrowLeft) player.x -= 7;
        if (keys.ArrowRight) player.x += 7;
        player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));

        // Draw Player Spaceship / VR Reticle Node
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(-20, 15);
        ctx.lineTo(20, 15);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, 0, 8, 12);
        ctx.restore();

        // Spawn targets
        if (timestamp - lastTargetSpawn > 900) {
            spawnTarget();
            lastTargetSpawn = timestamp;
        }

        // Update & Draw Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y -= b.speed;

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.fill();

            if (b.y < -10) bullets.splice(i, 1);
        }

        // Update & Draw Targets
        for (let i = targets.length - 1; i >= 0; i--) {
            const t = targets[i];
            t.y += t.speed;

            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fillStyle = t.type === 'hazard' ? '#ff0055' : t.color;
            ctx.shadowColor = t.color;
            ctx.shadowBlur = 12;
            ctx.fill();

            // Check collision with bullets
            for (let j = bullets.length - 1; j >= 0; j--) {
                const b = bullets[j];
                const dx = t.x - b.x;
                const dy = t.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < t.radius + b.radius) {
                    createExplosion(t.x, t.y, t.color);

                    if (t.type === 'hazard') {
                        score = Math.max(0, score - 50);
                    } else {
                        score += 100;
                    }

                    if (scoreEl) scoreEl.textContent = score;

                    targets.splice(i, 1);
                    bullets.splice(j, 1);
                    break;
                }
            }

            // Target reached bottom
            if (t && t.y > canvas.height + 20) {
                if (t.type !== 'hazard') {
                    lives--;
                    if (livesEl) livesEl.textContent = lives;
                    if (lives <= 0) {
                        gameOver();
                        return;
                    }
                }
                targets.splice(i, 1);
            }
        }

        // Update & Draw Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.025;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fill();

            if (p.alpha <= 0) particles.splice(i, 1);
        }
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(gameLoop);
    }

    startBtn.addEventListener('click', startGame);
    if (resetBtn) resetBtn.addEventListener('click', startGame);
}

/* ==========================================================================
   6. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const category = document.getElementById('category').value;

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your inquiry regarding [${category.toUpperCase()}] has been received. Nirmalya will reach out to you shortly!`;

        form.reset();

        setTimeout(() => {
            feedback.innerHTML = '';
        }, 8000);
    });
}

/* ==========================================================================
   7. Stat Counters Animation
   ========================================================================== */
function initStatCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    let animated = false;

    window.addEventListener('scroll', () => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !animated) {
            animated = true;
            statNums.forEach(stat => {
                const targetText = stat.innerText;
                const match = targetText.match(/\d+/);
                if (match) {
                    const targetVal = parseInt(match[0]);
                    let current = 0;
                    const step = Math.max(1, Math.floor(targetVal / 30));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= targetVal) {
                            stat.innerText = targetText;
                            clearInterval(timer);
                        } else {
                            stat.innerText = current + (targetText.replace(/\d+/g, ''));
                        }
                    }, 40);
                }
            });
        }
    });
}
