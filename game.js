class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.originalCanvasWidth = 800;
        this.originalCanvasHeight = 400;
        
        this.assets = {};
        this.loadAssets();
    }
    
    loadAssets() {
        this.assetsToLoad = 7;
        this.assetsLoaded = 0;
        
        const tofuSprite = new Image();
        tofuSprite.onload = () => {
            this.assets.tofuSprite = tofuSprite;
            this.checkAssetsLoaded();
        };
        tofuSprite.src = 'main_character_nolegs.png';
        
        const soldier1Sprite = new Image();
        soldier1Sprite.onload = () => {
            this.assets.soldier1Sprite = soldier1Sprite;
            this.checkAssetsLoaded();
        };
        soldier1Sprite.src = 'soldier_1.png';
        
        const soldier2Sprite = new Image();
        soldier2Sprite.onload = () => {
            this.assets.soldier2Sprite = soldier2Sprite;
            this.checkAssetsLoaded();
        };
        soldier2Sprite.src = 'soldier_2.png';
        
        const tankSprite = new Image();
        tankSprite.onload = () => {
            this.assets.tankSprite = tankSprite;
            this.checkAssetsLoaded();
        };
        tankSprite.src = 'tank.png';
        
        // Heart powerup sprite - create programmatically  
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');
        
        // Draw heart shape
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(12, 6);
        ctx.bezierCurveTo(8, 2, 2, 6, 8, 12);
        ctx.lineTo(12, 18);
        ctx.lineTo(16, 12);
        ctx.bezierCurveTo(22, 6, 16, 2, 12, 6);
        ctx.fill();
        
        // Add outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const heartSprite = new Image();
        heartSprite.onload = () => {
            this.assets.heartSprite = heartSprite;
            this.checkAssetsLoaded();
        };
        heartSprite.src = canvas.toDataURL();
        
        // Rapid-fire powerup sprite - create programmatically  
        const rfCanvas = document.createElement('canvas');
        rfCanvas.width = 24;
        rfCanvas.height = 24;
        const rfCtx = rfCanvas.getContext('2d');
        
        // Draw lightning bolt shape
        rfCtx.fillStyle = '#00FFFF';
        rfCtx.strokeStyle = '#000000';
        rfCtx.lineWidth = 1;
        
        rfCtx.beginPath();
        rfCtx.moveTo(12, 2);
        rfCtx.lineTo(16, 8);
        rfCtx.lineTo(14, 10);
        rfCtx.lineTo(18, 16);
        rfCtx.lineTo(12, 22);
        rfCtx.lineTo(8, 16);
        rfCtx.lineTo(10, 14);
        rfCtx.lineTo(6, 8);
        rfCtx.closePath();
        rfCtx.fill();
        rfCtx.stroke();
        
        const rapidFireSprite = new Image();
        rapidFireSprite.onload = () => {
            this.assets.rapidFireSprite = rapidFireSprite;
            this.checkAssetsLoaded();
        };
        rapidFireSprite.src = rfCanvas.toDataURL();
        
        // Mine sprite - create programmatically  
        const mineCanvas = document.createElement('canvas');
        mineCanvas.width = 20;
        mineCanvas.height = 16;
        const mineCtx = mineCanvas.getContext('2d');
        
        // Draw mine - dark circle with spikes
        mineCtx.fillStyle = '#2F2F2F'; // Dark gray
        mineCtx.strokeStyle = '#000000';
        mineCtx.lineWidth = 1;
        
        // Main body
        mineCtx.beginPath();
        mineCtx.arc(10, 12, 6, 0, Math.PI * 2);
        mineCtx.fill();
        mineCtx.stroke();
        
        // Spikes
        mineCtx.strokeStyle = '#2F2F2F';
        mineCtx.lineWidth = 2;
        const spikes = [[10, 6], [16, 12], [10, 18], [4, 12], [13, 8], [13, 16], [7, 16], [7, 8]];
        spikes.forEach(([x, y]) => {
            mineCtx.beginPath();
            mineCtx.moveTo(10, 12);
            mineCtx.lineTo(x, y);
            mineCtx.stroke();
        });
        
        // Red warning light
        mineCtx.fillStyle = '#FF0000';
        mineCtx.beginPath();
        mineCtx.arc(10, 10, 2, 0, Math.PI * 2);
        mineCtx.fill();
        
        const mineSprite = new Image();
        mineSprite.onload = () => {
            this.assets.mineSprite = mineSprite;
            this.checkAssetsLoaded();
        };
        mineSprite.src = mineCanvas.toDataURL();
    }
    
    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === this.assetsToLoad) {
            this.loadAudio();
        }
    }
    
    loadAudio() {
        // Initialize Web Audio Context for sound effects
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio not supported');
        }
        
        // Music disabled for now
        this.init();
    }
    
    init() {
        this.player = new Player(100, 300, this.assets.tofuSprite);
        this.keys = {};
        this.camera = { x: 0, y: 0 };
        this.musicStarted = false;
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.mines = [];
        this.explosions = [];
        this.tankRemnants = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnDelay = 3000;
        this.lastPowerupSpawn = 0;
        this.powerupSpawnDelay = 12000; // Spawn heart powerups every 12 seconds
        this.gameOver = false;
        
        // Game state management
        this.gameState = 'title'; // 'title', 'playing', 'gameOver'
        
        // Title screen music
        this.titleMusic = null;
        this.titleMusicGain = null;
        this.titleMusicPlaying = false;
        this.audioUnlocked = false;
        
        // Gameplay music
        this.gameplayMusic = null;
        this.gameplayMusicGain = null;
        this.gameplayMusicPlaying = false;
        
        // Virtual button controls
        this.virtualButtons = {
            left: { x: 50, y: 320, radius: 40, pressed: false },
            right: { x: 130, y: 320, radius: 40, pressed: false },
            jump: { x: 670, y: 280, radius: 35, pressed: false },
            shoot: { x: 730, y: 340, radius: 35, pressed: false }
        };
        this.activeTouches = new Map();
        
        // Double-tap fullscreen detection
        this.lastTapTime = 0;
        this.tapCount = 0;
        
        // Audio enable button for mobile
        this.showAudioButton = false;
        
        // Score system
        this.score = 0;
        this.highScores = this.loadHighScores();
        
        // Initial entry system
        this.enteringInitials = false;
        this.currentInitials = '';
        this.newHighScoreIndex = -1;
        
        this.setupEventListeners();
        this.setupResponsiveCanvas();
        
        // Initialize audio context early but don't try to unlock without user interaction
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Modern browsers require user interaction - don't auto-unlock
            this.audioUnlocked = false;
        } catch (e) {
            // Audio context creation failed
        }
        
        // Create a simple audio element for mobile unlock test
        this.testAudio = new Audio();
        this.testAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Hyvmb/ACR8y/PTgiMBtnLJ+dum8/8da7n00p3a/wBTqOz4tWb0/yZ+Ovnx1Zn2/yts1u7qp93/ADB7zO7GfttZ/6JIpeHAHt1W/OKgOsn55ZDYB/bTb7Tz+q3+b+T4r0n4j9e3/OHJu/+R2Z7/tOeR5Y7h8fbP/Otp/KLI+OLY/Ly8vL3Vvg=';
        this.testAudio.volume = 0.1;
        
        this.gameLoop();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            // Handle initial entry mode
            if (this.enteringInitials) {
                this.handleInitialEntry(e);
                return;
            }
            
            // Handle different game states
            if (this.gameState === 'title') {
                if (e.key === ' ' || e.key === 'Enter') {
                    this.unlockAudio();
                    this.startGame();
                    e.preventDefault();
                } else if (e.key === 't' || e.key === 'T') {
                    // Test sound (for debugging)
                    this.unlockAudio().then(() => {
                        setTimeout(() => this.playTestSound(), 100);
                    });
                    e.preventDefault();
                }
                return;
            }
            
            if (this.gameState === 'playing') {
                this.keys[e.key] = true;
                
                // Handle shooting
                if (e.key === 'x' || e.key === 'X') {
                    if (this.player.shoot(this.bullets)) {
                        this.playPlayerShoot();
                    }
                    e.preventDefault();
                }
            }
            
            // Handle restart from game over
            if (e.key === 'r' || e.key === 'R') {
                if (this.gameState === 'gameOver') {
                    this.restart();
                }
            }
            
            // Return to title screen
            if (e.key === 'Escape') {
                if (this.gameState === 'gameOver') {
                    this.returnToTitle();
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mobile touch support
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Fullscreen handling
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    }
    
    setupResponsiveCanvas() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 100); // Delay for orientation change
        });
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile && isLandscape) {
            // In landscape, position controls relative to canvas, not screen
            // Canvas gets stretched to fill screen, so use canvas coordinates
            const canvasWidth = this.canvas.width;  // 800
            const canvasHeight = this.canvas.height; // 400
            
            this.virtualButtons = {
                left: { x: 60, y: 360, radius: 35, pressed: false },      // Bottom left corner
                right: { x: 130, y: 360, radius: 35, pressed: false },    // Bottom left area
                jump: { x: 680, y: 280, radius: 30, pressed: false },     // Top right area  
                shoot: { x: 740, y: 360, radius: 30, pressed: false }     // Bottom right corner
            };
        } else {
            // Portrait or desktop - use original layout
            this.virtualButtons = {
                left: { x: 50, y: 320, radius: 40, pressed: false },
                right: { x: 130, y: 320, radius: 40, pressed: false },
                jump: { x: 670, y: 260, radius: 35, pressed: false },    // Higher up
                shoot: { x: 730, y: 350, radius: 35, pressed: false }    // Lower down
            };
        }
    }
    
    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        document.body.classList.toggle('fullscreen', isFullscreen);
        setTimeout(() => this.resizeCanvas(), 100);
    }
    
    requestFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        
        // Immediately try to unlock audio on any touch (required for mobile)
        if (!this.audioUnlocked) {
            this.mobileAudioUnlock();
        }
        
        this.handleTouchAction(e);
    }
    
    mobileAudioUnlock() {
        // Force audio unlock with user interaction
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                this.audioUnlocked = true;
                return;
            }
        }
        
        // Create and play a sound immediately in response to user tap
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        // Resume audio context
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.audioUnlocked = true;
    }
    
    handleTouchAction(e) {
        if (this.gameState === 'title') {
            // Check if tap is on audio button for mobile
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && !this.audioUnlocked) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0] || e.changedTouches[0] || e;
                const touchX = ((touch.clientX - rect.left) / rect.width) * this.canvas.width;
                const touchY = ((touch.clientY - rect.top) / rect.height) * this.canvas.height;
                
                // Check if tap is on audio button (canvas coords: x: 300-500, y: 120-160)
                if (touchX >= 300 && touchX <= 500 && touchY >= 120 && touchY <= 160) {
                    this.mobileAudioUnlock();
                    return; // Don't start game, just enable audio
                }
            }
            
            // Only start game if audio is unlocked or not mobile
            if (!isMobile || this.audioUnlocked) {
                this.startGame();
            }
        } else if (this.gameState === 'gameOver' && !this.enteringInitials) {
            this.returnToTitle();
        } else if (this.gameState === 'playing') {
            this.processTouches(e.touches);
        }
    }
    
    enableAudioExplicitly() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        // Play a test sound with user permission
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Quick beep to confirm audio is working
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);
            
            // Resume if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.audioUnlocked = true;
                });
            } else {
                this.audioUnlocked = true;
            }
        } catch (e) {
            // Audio failed
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.gameState === 'playing') {
            this.processTouches(e.touches);
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        if (this.gameState === 'playing') {
            // Remove ended touches
            const remainingTouchIds = Array.from(e.touches).map(t => t.identifier);
            for (let touchId of this.activeTouches.keys()) {
                if (!remainingTouchIds.includes(touchId)) {
                    this.activeTouches.delete(touchId);
                }
            }
            this.processTouches(e.touches);
        }
    }
    
    processTouches(touches) {
        const rect = this.canvas.getBoundingClientRect();
        
        // Reset all button states
        Object.keys(this.virtualButtons).forEach(key => {
            this.virtualButtons[key].pressed = false;
        });
        
        // Check each active touch
        for (let touch of touches) {
            const touchX = ((touch.clientX - rect.left) / rect.width) * this.canvas.width;
            const touchY = ((touch.clientY - rect.top) / rect.height) * this.canvas.height;
            
            // Check which virtual buttons are being pressed
            for (let [buttonName, button] of Object.entries(this.virtualButtons)) {
                const distance = Math.sqrt(
                    Math.pow(touchX - button.x, 2) + Math.pow(touchY - button.y, 2)
                );
                if (distance <= button.radius) {
                    button.pressed = true;
                    this.activeTouches.set(touch.identifier, buttonName);
                }
            }
        }
        
        // Update game keys based on button states
        this.keys['ArrowLeft'] = this.virtualButtons.left.pressed;
        this.keys['ArrowRight'] = this.virtualButtons.right.pressed;
        this.keys['ArrowUp'] = this.virtualButtons.jump.pressed;  // ArrowUp for jump
        this.keys['x'] = this.virtualButtons.shoot.pressed; // X for shoot
    }
    
    handleClick(e) {
        if (this.gameState === 'title') {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;
            
            // Check if mobile and audio not unlocked, and click is on audio button
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && !this.audioUnlocked) {
                // Audio button bounds: x: 300-500, y: 120-160
                if (canvasX >= 300 && canvasX <= 500 && canvasY >= 120 && canvasY <= 160) {
                    this.mobileAudioUnlock();
                    return; // Don't start game
                }
            }
            
            // Regular click - start game
            this.unlockAudio().then(() => {
                this.startGame();
            }).catch(() => {
                this.startGame(); // Start anyway if audio fails
            });
        } else if (this.gameState === 'gameOver' && !this.enteringInitials) {
            this.returnToTitle();
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.player.update(this.keys);
        
        // Handle mobile shooting (simulate X key press)
        if (this.keys['x']) {
            if (this.player.shoot(this.bullets)) {
                this.playPlayerShoot();
            }
        }
        
        // Check for game over
        if (this.player.health <= 0) {
            if (this.gameState === 'playing') {
                this.stopGameplayMusic();
                this.gameState = 'gameOver';
                this.gameOver = true;
                // Check if this is a high score
                const highScorePosition = this.checkHighScore(this.score);
                if (highScorePosition !== -1) {
                    this.enteringInitials = true;
                    this.newHighScoreIndex = highScorePosition;
                    this.currentInitials = '';
                }
            }
            return;
        }
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            
            // Extended range when player has rapid-fire powerup
            const baseRange = this.canvas.width / 3;
            const maxRange = this.player.hasRapidFire ? baseRange * 2 : baseRange;
            const bulletRange = Math.abs(this.bullets[i].x - this.bullets[i].startX);
            
            // Remove bullets that exceed range or are off screen
            if (bulletRange > maxRange || 
                this.bullets[i].x > this.camera.x + this.canvas.width + 100 || 
                this.bullets[i].x < this.camera.x - 100) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Spawn enemies
        const currentTime = Date.now();
        if (currentTime - this.lastEnemySpawn > this.enemySpawnDelay) {
            const spawnX = this.camera.x + this.canvas.width + 50;
            const enemyType = Math.floor(Math.random() * 3);
            const spawnY = 200;
            this.enemies.push(new Enemy(spawnX, spawnY, enemyType, this.assets));
            this.lastEnemySpawn = currentTime;
        }
        
        // Spawn powerups (only spawn if no powerups currently exist)
        if (currentTime - this.lastPowerupSpawn > this.powerupSpawnDelay && 
            this.powerups.length === 0) {
            const spawnX = this.camera.x + this.canvas.width + 100 + Math.random() * 400;
            const spawnY = 120 + Math.random() * 150;
            
            // 50% chance for heart powerup (if player is damaged), 50% for rapid-fire
            const needsHealth = this.player.health < this.player.maxHealth;
            const powerupType = (needsHealth && Math.random() < 0.5) ? 'heart' : 'rapidfire';
            
            if (powerupType === 'heart' && needsHealth) {
                this.powerups.push(new HeartPowerup(spawnX, spawnY, this.assets));
            } else {
                this.powerups.push(new RapidFirePowerup(spawnX, spawnY, this.assets));
            }
            
            this.lastPowerupSpawn = currentTime;
        }
        
        // Spawn mines occasionally with better spacing
        if (Math.random() < 0.003 && this.mines.length === 0) { // Lower chance and only if no mines exist
            const spawnX = this.camera.x + this.canvas.width + 200 + Math.random() * 400; // Further ahead with more spread
            const spawnY = 220 + 100 - 16; // Player bottom (220+100) minus mine height (16)
            this.mines.push(new Mine(spawnX, spawnY, this.assets));
        }
        
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update();
            if (this.explosions[i].finished) {
                this.explosions.splice(i, 1);
            }
        }
        
        // Update tank remnants
        for (let i = this.tankRemnants.length - 1; i >= 0; i--) {
            this.tankRemnants[i].update();
            if (this.tankRemnants[i].finished) {
                this.tankRemnants.splice(i, 1);
            }
        }
        
        // Update mines
        for (let i = this.mines.length - 1; i >= 0; i--) {
            this.mines[i].update();
            
            // Remove mines that are too far behind
            if (this.mines[i].x < this.camera.x - 200) {
                this.mines.splice(i, 1);
                continue;
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(this.player, this.enemyBullets, this);
            // Enemies never disappear - they persist until killed
        }
        
        // Update powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            this.powerups[i].update();
            
            // Remove powerups that are too far behind
            if (this.powerups[i].x < this.camera.x - 200) {
                this.powerups.splice(i, 1);
                continue;
            }
        }
        
        // Update enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].update();
            
            // Remove enemy bullets that are off screen or exceeded range
            const bulletRange = Math.abs(this.enemyBullets[i].x - this.enemyBullets[i].startX);
            const maxRange = this.canvas.width * 0.6; // Shorter range than player bullets
            
            if (this.enemyBullets[i].x < this.camera.x - 100 || 
                this.enemyBullets[i].x > this.camera.x + this.canvas.width + 100 ||
                bulletRange > maxRange) {
                this.enemyBullets.splice(i, 1);
            }
        }
        
        // Check bullet-enemy collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.checkCollision(this.bullets[i], this.enemies[j])) {
                    this.bullets.splice(i, 1);
                    
                    // Damage the enemy
                    const enemy = this.enemies[j];
                    const enemyDestroyed = enemy.takeDamage(1);
                    if (enemyDestroyed) {
                        // Award points for destroying enemy
                        this.score += enemy.pointValue;
                        
                        // Big explosion for tanks
                        if (enemy.type === 2) {
                            this.playTankExplosion();
                            // Create large tank explosion
                            this.explosions.push(new TankExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2));
                            // Create tank remnants that persist
                            this.tankRemnants.push(new TankRemnant(enemy.x, enemy.y, enemy.width, enemy.height));
                        }
                        this.enemies.splice(j, 1);
                    }
                    break;
                }
            }
        }
        
        // Check enemy bullet-player collisions
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.enemyBullets[i], this.player)) {
                // Tank bullets do 1.5 hearts (3 damage), soldier bullets do 0.5 hearts (1 damage)
                const damage = this.enemyBullets[i].isTank ? 3 : 1;
                this.enemyBullets.splice(i, 1);
                this.player.takeDamage(damage);
            }
        }
        
        // Check mine-player collisions (only player can trigger mines)
        for (let i = this.mines.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.mines[i], this.player)) {
                // Mine explodes - damage player and create explosion
                this.player.takeDamage(3); // Mines do significant damage (1.5 hearts)
                this.playMineExplosion();
                
                // Create visual explosion
                this.explosions.push(new Explosion(this.mines[i].x, this.mines[i].y - 10));
                
                this.mines.splice(i, 1);
            }
        }
        
        // Check powerup-player collisions
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.powerups[i], this.player)) {
                // Player collected powerup
                this.powerups[i].collect(this.player);
                this.powerups.splice(i, 1);
            }
        }
        
        // Check enemy-player collisions (only damage when both are on ground level)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.enemies[i], this.player)) {
                // Only damage if both player and enemy are on the ground (not jumping over)
                const playerGroundLevel = this.player.y + this.player.height;
                const enemyGroundLevel = this.enemies[i].y + this.enemies[i].height;
                const groundLevelDiff = Math.abs(playerGroundLevel - enemyGroundLevel);
                
                // Only damage if they're at similar ground levels (within 20 pixels)
                if (this.player.onGround && this.enemies[i].onGround && groundLevelDiff < 20) {
                    const currentTime = Date.now();
                    if (!this.player.lastDamageTime || currentTime - this.player.lastDamageTime > 1000) {
                        this.player.takeDamage(2); // Touching enemy = 2 damage (1 full heart)
                        this.player.lastDamageTime = currentTime;
                        // Push player away to prevent rapid damage
                        if (this.player.x < this.enemies[i].x) {
                            this.player.x -= 30;
                        } else {
                            this.player.x += 30;
                        }
                    }
                }
            }
        }
        
        // Start music on first movement
        if (!this.musicStarted && this.player.isMoving) {
            this.startMusic();
        }
        
        // Standard side-scroller camera - player has freedom zone before camera moves
        const cameraFollowX = this.canvas.width * 0.35; // Camera follows when player is 35% across screen
        const targetCameraX = this.player.x - cameraFollowX;
        
        // Only move camera forward (right), never backward unless player goes way back
        if (targetCameraX > this.camera.x) {
            this.camera.x = targetCameraX;
        } else if (this.player.x < this.camera.x + this.canvas.width * 0.2) {
            // Allow camera to move back only if player goes to far left edge
            this.camera.x = this.player.x - this.canvas.width * 0.2;
        }
        
        // Ensure camera never goes negative
        if (this.camera.x < 0) {
            this.camera.x = 0;
        }
        
        this.camera.y = 0;
    }
    
    // High Score System
    loadHighScores() {
        try {
            const stored = localStorage.getItem('sidescroller_highscores');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.log('Could not load high scores');
        }
        
        // Default high scores
        return [
            { initials: 'AAA', score: 1000 },
            { initials: 'BBB', score: 800 },
            { initials: 'CCC', score: 600 },
            { initials: 'DDD', score: 400 },
            { initials: 'EEE', score: 200 }
        ];
    }
    
    saveHighScores() {
        try {
            localStorage.setItem('sidescroller_highscores', JSON.stringify(this.highScores));
        } catch (e) {
            console.log('Could not save high scores');
        }
    }
    
    checkHighScore(score) {
        for (let i = 0; i < this.highScores.length; i++) {
            if (score > this.highScores[i].score) {
                return i; // Return the position where this score should be inserted
            }
        }
        return -1; // Not a high score
    }
    
    insertHighScore(initials, score, position) {
        this.highScores.splice(position, 0, { initials, score });
        this.highScores = this.highScores.slice(0, 5); // Keep only top 5
        this.saveHighScores();
    }
    
    handleInitialEntry(e) {
        if (e.key === 'Enter') {
            // Finish entering initials
            if (this.currentInitials.length >= 1) {
                // Pad with spaces if less than 3 characters
                const initials = this.currentInitials.padEnd(3, ' ').substring(0, 3);
                this.insertHighScore(initials, this.score, this.newHighScoreIndex);
                this.enteringInitials = false;
                this.currentInitials = '';
                this.newHighScoreIndex = -1;
            }
        } else if (e.key === 'Backspace') {
            // Remove last character
            this.currentInitials = this.currentInitials.slice(0, -1);
        } else if (e.key.length === 1 && this.currentInitials.length < 3) {
            // Add character if it's a single character and we have room
            const char = e.key.toUpperCase();
            if (char.match(/[A-Z0-9]/)) {
                this.currentInitials += char;
            }
        }
        e.preventDefault();
    }
    
    startGame() {
        this.stopTitleMusic();
        this.startGameplayMusic();
        this.gameState = 'playing';
        this.gameOver = false;
        this.score = 0;
        this.enteringInitials = false;
        this.currentInitials = '';
        this.newHighScoreIndex = -1;
        
        // Reset player
        this.player.health = 10;
        this.player.x = 100;
        this.player.y = 300;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.lastDamageTime = 0;
        this.player.hasRapidFire = false;
        this.player.rapidFireEndTime = 0;
        this.player.shootCooldown = this.player.normalShootCooldown;
        
        // Clear all game objects
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.mines = [];
        this.explosions = [];
        this.tankRemnants = [];
        this.lastEnemySpawn = 0;
        this.lastPowerupSpawn = 0;
        this.camera = { x: 0, y: 0 };
    }
    
    returnToTitle() {
        this.stopTitleMusic();
        this.stopGameplayMusic();
        this.gameState = 'title';
        this.gameOver = false;
        this.enteringInitials = false;
        this.currentInitials = '';
        this.newHighScoreIndex = -1;
    }
    
    // Sound effect methods
    playTestSound() {
        if (!this.audioContext) {
            console.log('No audio context for test sound');
            return;
        }
        if (!this.audioUnlocked) {
            console.log('Audio not unlocked for test sound');
            return;
        }
        
        console.log('Playing test sound, audio context state:', this.audioContext.state);
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
            console.log('Test sound should be playing');
        } catch (e) {
            console.log('Test sound failed:', e);
        }
    }
    
    playPlayerShoot() {
        if (!this.audioContext || !this.audioUnlocked) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playEnemyShoot() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
    
    playTankShoot() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playTankEngine(enemy) {
        if (!this.audioContext || !enemy.engineSound) return;
        
        // Create continuous engine sound for tanks
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(80 + Math.random() * 20, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
        
        enemy.lastEngineSound = Date.now();
    }
    
    playTankExplosion() {
        if (!this.audioContext) return;
        
        // MASSIVE tank explosion - much bigger and longer than before
        
        // Deep, powerful rumble
        const rumble = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        rumble.connect(rumbleGain);
        rumbleGain.connect(this.audioContext.destination);
        rumble.frequency.setValueAtTime(40, this.audioContext.currentTime);
        rumble.frequency.exponentialRampToValueAtTime(15, this.audioContext.currentTime + 1.2);
        rumbleGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
        
        // Massive explosion crack
        const crack = this.audioContext.createOscillator();
        const crackGain = this.audioContext.createGain();
        crack.connect(crackGain);
        crackGain.connect(this.audioContext.destination);
        crack.frequency.setValueAtTime(600, this.audioContext.currentTime);
        crack.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.5);
        crackGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);
        crackGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        // High metallic debris
        const debris = this.audioContext.createOscillator();
        const debrisGain = this.audioContext.createGain();
        debris.connect(debrisGain);
        debrisGain.connect(this.audioContext.destination);
        debris.frequency.setValueAtTime(3000, this.audioContext.currentTime);
        debris.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.4);
        debrisGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        debrisGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        // Secondary explosion echo
        const echo = this.audioContext.createOscillator();
        const echoGain = this.audioContext.createGain();
        echo.connect(echoGain);
        echoGain.connect(this.audioContext.destination);
        echo.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.2);
        echo.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.8);
        echoGain.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.2);
        echoGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        rumble.start(this.audioContext.currentTime);
        rumble.stop(this.audioContext.currentTime + 1.2);
        crack.start(this.audioContext.currentTime);
        crack.stop(this.audioContext.currentTime + 0.5);
        debris.start(this.audioContext.currentTime);
        debris.stop(this.audioContext.currentTime + 0.4);
        echo.start(this.audioContext.currentTime + 0.2);
        echo.stop(this.audioContext.currentTime + 0.8);
    }
    
    unlockAudio() {
        if (this.audioUnlocked) return Promise.resolve();
        
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('AudioContext creation failed:', e);
                return Promise.reject(e);
            }
        }
        
        // Quietly unlock audio without spamming console
        
        return new Promise((resolve, reject) => {
            const unlockAudioContext = () => {
                // Create multiple silent sounds to ensure unlock
                try {
                    for (let i = 0; i < 3; i++) {
                        const oscillator = this.audioContext.createOscillator();
                        const gainNode = this.audioContext.createGain();
                        oscillator.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);
                        gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
                        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                        oscillator.start(this.audioContext.currentTime);
                        oscillator.stop(this.audioContext.currentTime + 0.01);
                    }
                } catch (e) {
                    // Silently handle audio creation failures
                }
                
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        this.audioUnlocked = true;
                        // Audio successfully unlocked
                        resolve();
                    }).catch(err => {
                        console.log('Audio resume failed:', err);
                        reject(err);
                    });
                } else {
                    this.audioUnlocked = true;
                    console.log('Audio context unlocked immediately, state:', this.audioContext.state);
                    resolve();
                }
            };
            
            // Try immediate unlock
            unlockAudioContext();
            
            // Also try after a short delay (sometimes needed on iOS)
            setTimeout(() => {
                if (!this.audioUnlocked) {
                    console.log('Retrying audio unlock after delay');
                    unlockAudioContext();
                }
            }, 100);
        });
    }
    
    startTitleMusic() {
        if (!this.audioContext || this.titleMusicPlaying || !this.audioUnlocked) {
            // Silently fail if audio not unlocked yet - user doesn't need to know
            return;
        }
        
        this.titleMusicPlaying = true;
        this.playTitleMelody();
    }
    
    stopTitleMusic() {
        if (this.titleMusic) {
            this.titleMusic.stop();
            this.titleMusic = null;
        }
        if (this.titleMusicGain) {
            this.titleMusicGain = null;
        }
        this.titleMusicPlaying = false;
    }
    
    playTitleMelody() {
        if (!this.audioContext || !this.titleMusicPlaying) return;
        
        // Simple, clean melody
        const melody = [
            {note: 523, duration: 0.4}, // C5
            {note: 587, duration: 0.4}, // D5
            {note: 659, duration: 0.4}, // E5
            {note: 784, duration: 0.8}, // G5
            {note: 659, duration: 0.4}, // E5
            {note: 523, duration: 0.8}, // C5
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        // Play melody
        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(note.note, currentTime);
            osc.type = 'square';
            
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.02);
            gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Schedule next loop - simple 4 second repeat
        setTimeout(() => {
            if (this.gameState === 'title' && this.titleMusicPlaying) {
                this.playTitleMelody();
            }
        }, 4000);
    }
    
    startGameplayMusic() {
        if (!this.audioContext || this.gameplayMusicPlaying || !this.audioUnlocked) return;
        
        this.gameplayMusicPlaying = true;
        this.playGameplayTrack();
    }
    
    stopGameplayMusic() {
        if (this.gameplayMusic) {
            this.gameplayMusic.stop();
            this.gameplayMusic = null;
        }
        if (this.gameplayMusicGain) {
            this.gameplayMusicGain = null;
        }
        this.gameplayMusicPlaying = false;
    }
    
    playGameplayTrack() {
        if (!this.audioContext || !this.gameplayMusicPlaying) return;
        
        // Epic battle melody in A minor (natural minor scale)
        const melody = [
            // Phrase 1 - driving and heroic
            {note: 440, duration: 0.25}, // A4
            {note: 523, duration: 0.25}, // C5
            {note: 587, duration: 0.25}, // D5
            {note: 659, duration: 0.5},  // E5
            {note: 587, duration: 0.25}, // D5
            {note: 523, duration: 0.25}, // C5
            {note: 440, duration: 0.5},  // A4
            {note: 392, duration: 0.5},  // G4
            
            // Phrase 2 - building tension
            {note: 440, duration: 0.25}, // A4
            {note: 523, duration: 0.25}, // C5
            {note: 587, duration: 0.25}, // D5
            {note:698, duration: 0.5},  // F5
            {note: 659, duration: 0.25}, // E5
            {note: 587, duration: 0.25}, // D5
            {note: 523, duration: 1.0},  // C5
        ];
        
        // Powerful bass line in A minor
        const bassLine = [
            {note: 110, duration: 1.0}, // A2
            {note: 131, duration: 1.0}, // C3
            {note: 147, duration: 1.0}, // D3
            {note: 196, duration: 1.0}, // G3
        ];
        
        // Epic battle drum pattern - 16th note subdivisions
        const drumPattern = [
            // Beat 1
            {type: 'kick', time: 0},
            {type: 'hihat', time: 0.125},
            {type: 'hihat', time: 0.25},
            {type: 'hihat', time: 0.375},
            
            // Beat 2
            {type: 'snare', time: 0.5},
            {type: 'hihat', time: 0.625},
            {type: 'hihat', time: 0.75},
            {type: 'hihat', time: 0.875},
            
            // Beat 3
            {type: 'kick', time: 1.0},
            {type: 'hihat', time: 1.125},
            {type: 'kick', time: 1.25}, // Double kick
            {type: 'hihat', time: 1.375},
            
            // Beat 4
            {type: 'snare', time: 1.5},
            {type: 'hihat', time: 1.625},
            {type: 'snare', time: 1.75}, // Snare fill
            {type: 'snare', time: 1.875},
            
            // Beat 5
            {type: 'kick', time: 2.0},
            {type: 'hihat', time: 2.125},
            {type: 'hihat', time: 2.25},
            {type: 'hihat', time: 2.375},
            
            // Beat 6
            {type: 'snare', time: 2.5},
            {type: 'hihat', time: 2.625},
            {type: 'hihat', time: 2.75},
            {type: 'hihat', time: 2.875},
            
            // Beat 7
            {type: 'kick', time: 3.0},
            {type: 'hihat', time: 3.125},
            {type: 'kick', time: 3.25}, // Double kick
            {type: 'hihat', time: 3.375},
            
            // Beat 8
            {type: 'snare', time: 3.5},
            {type: 'crash', time: 3.75}, // Crash for emphasis
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        // Play melody with square wave
        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(note.note, currentTime);
            osc.type = 'square';
            
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(0.08, currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.02, currentTime + note.duration * 0.7);
            gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Play bass line with sawtooth wave
        let bassTime = this.audioContext.currentTime;
        bassLine.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(note.note, bassTime);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0, bassTime);
            gain.gain.linearRampToValueAtTime(0.06, bassTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.02, bassTime + note.duration * 0.8);
            gain.gain.linearRampToValueAtTime(0, bassTime + note.duration);
            
            osc.start(bassTime);
            osc.stop(bassTime + note.duration);
            
            bassTime += note.duration;
        });
        
        // Add epic drum sounds using filtered noise
        drumPattern.forEach(drum => {
            const noise = this.audioContext.createBufferSource();
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate white noise
            for (let i = 0; i < buffer.length; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            const gain = this.audioContext.createGain();
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + drum.time;
            
            switch(drum.type) {
                case 'kick':
                    filter.frequency.setValueAtTime(80, startTime);
                    filter.Q.setValueAtTime(1, startTime);
                    gain.gain.setValueAtTime(0.2, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
                    break;
                case 'snare':
                    filter.frequency.setValueAtTime(1800, startTime);
                    filter.Q.setValueAtTime(0.5, startTime);
                    gain.gain.setValueAtTime(0.12, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
                    break;
                case 'hihat':
                    filter.frequency.setValueAtTime(8000, startTime);
                    filter.Q.setValueAtTime(2, startTime);
                    gain.gain.setValueAtTime(0.05, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
                    break;
                case 'crash':
                    filter.frequency.setValueAtTime(6000, startTime);
                    filter.Q.setValueAtTime(0.3, startTime);
                    gain.gain.setValueAtTime(0.15, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
                    break;
            }
            
            noise.start(startTime);
            noise.stop(startTime + 0.1);
        });
        
        // Loop the track - 4 second cycle
        setTimeout(() => {
            if (this.gameState === 'playing' && this.gameplayMusicPlaying) {
                this.playGameplayTrack();
            }
        }, 4000);
    }
    
    playMineExplosion() {
        if (!this.audioContext) return;
        
        // Sharp, intense mine explosion - higher pitched than tank
        const boom = this.audioContext.createOscillator();
        const boomGain = this.audioContext.createGain();
        boom.connect(boomGain);
        boomGain.connect(this.audioContext.destination);
        boom.frequency.setValueAtTime(500, this.audioContext.currentTime);
        boom.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.4);
        boomGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);
        boomGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        // High-pitched crack
        const crack = this.audioContext.createOscillator();
        const crackGain = this.audioContext.createGain();
        crack.connect(crackGain);
        crackGain.connect(this.audioContext.destination);
        crack.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        crack.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
        crackGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        crackGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        boom.start(this.audioContext.currentTime);
        boom.stop(this.audioContext.currentTime + 0.4);
        crack.start(this.audioContext.currentTime);
        crack.stop(this.audioContext.currentTime + 0.15);
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    startMusic() {
        if (this.assets.bgMusic) {
            this.assets.bgMusic.play().catch(err => {
                console.log('Could not play music:', err);
            });
            this.musicStarted = true;
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'title') {
            if (!this.titleMusicPlaying && this.audioUnlocked) {
                this.startTitleMusic();
            }
            this.renderTitleScreen();
            return;
        }
        
        // Draw grassy plain background
        this.renderBackground();
        
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw ground grass texture
        this.renderGround();
        
        this.player.render(this.ctx);
        
        // Render bullets
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        
        // Render enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Render powerups
        this.powerups.forEach(powerup => powerup.render(this.ctx));
        
        // Render mines
        this.mines.forEach(mine => mine.render(this.ctx));
        
        // Render explosions
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        
        // Render tank remnants
        this.tankRemnants.forEach(remnant => remnant.render(this.ctx));
        
        // Render enemy bullets
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        
        this.ctx.restore();
        
        // Render UI (hearts and score) - not affected by camera
        this.renderUI();
        this.renderScore();
        this.renderTouchControls();
        
        // Render game over screen if needed
        if (this.gameState === 'gameOver') {
            this.renderGameOver();
        }
    }
    
    renderUI() {
        const heartSize = 30;
        const heartSpacing = 35;
        const startX = 20;
        const startY = 20;
        
        for (let i = 0; i < 5; i++) {
            const x = startX + (i * heartSpacing);
            const y = startY;
            
            // Calculate heart state based on health
            const heartValue = (i * 2) + 2; // Heart 1 = 2HP, Heart 2 = 4HP, etc.
            
            if (this.player.health >= heartValue) {
                // Full heart
                this.drawHeart(x, y, heartSize, 'full');
            } else if (this.player.health >= heartValue - 1) {
                // Half heart
                this.drawHeart(x, y, heartSize, 'half');
            } else {
                // Empty heart
                this.drawHeart(x, y, heartSize, 'empty');
            }
        }
    }
    
    drawHeart(x, y, size, state) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x + size/2, y + size/2);
        ctx.scale(size/20, size/20);
        
        // Heart outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(-8, -10, -20, -3, -10, 5);
        ctx.lineTo(0, 15);
        ctx.lineTo(10, 5);
        ctx.bezierCurveTo(20, -3, 8, -10, 0, -3);
        ctx.stroke();
        
        // Heart fill
        if (state === 'full') {
            ctx.fillStyle = '#FF0000';
        } else if (state === 'half') {
            ctx.fillStyle = '#FF0000';
        } else {
            ctx.fillStyle = '#444';
        }
        
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(-8, -10, -20, -3, -10, 5);
        ctx.lineTo(0, 15);
        ctx.lineTo(10, 5);
        ctx.bezierCurveTo(20, -3, 8, -10, 0, -3);
        ctx.fill();
        
        // Half heart overlay
        if (state === 'half') {
            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.moveTo(0, -3);
            ctx.bezierCurveTo(8, -10, 20, -3, 10, 5);
            ctx.lineTo(0, 15);
            ctx.lineTo(0, -3);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    renderScore() {
        const ctx = this.ctx;
        
        // Score display in top left corner
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        
        const scoreText = `Score: ${this.score}`;
        const x = 20;
        const y = 80; // Below the hearts
        
        // Draw outline for visibility
        ctx.strokeText(scoreText, x, y);
        ctx.fillText(scoreText, x, y);
        
        ctx.restore();
    }
    
    renderGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.enteringInitials) {
            // Show initial entry screen
            this.renderInitialEntry();
        } else {
            // Show game over screen with high scores
            this.renderHighScores();
        }
    }
    
    renderInitialEntry() {
        this.ctx.textAlign = 'center';
        
        // New High Score text
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 150);
        
        // Score display
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 190);
        
        // Instructions
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Enter your initials (up to 3 characters):', this.canvas.width / 2, 240);
        
        // Current initials with cursor
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 32px Arial';
        const displayInitials = this.currentInitials + '_';
        this.ctx.fillText(displayInitials, this.canvas.width / 2, 280);
        
        // Instructions
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press ENTER when done, BACKSPACE to delete', this.canvas.width / 2, 320);
        
        this.ctx.textAlign = 'left';
    }
    
    renderHighScores() {
        this.ctx.textAlign = 'center';
        
        // Game Over text
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, 100);
        
        // Final Score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 140);
        
        // High Scores header
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 180);
        
        // High scores list
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        for (let i = 0; i < this.highScores.length; i++) {
            const rank = i + 1;
            const entry = this.highScores[i];
            const text = `${rank}. ${entry.initials} - ${entry.score}`;
            this.ctx.fillText(text, this.canvas.width / 2, 210 + (i * 25));
        }
        
        // Instructions
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Press R to Restart  -  Press ESC for Title Screen', this.canvas.width / 2, 340);
        this.ctx.textAlign = 'left';
    }
    
    renderTitleScreen() {
        // Draw the actual game background - grassy plains and sky
        this.renderBackground();
        this.renderGround();
        
        // Add some atmospheric elements for the title screen
        this.renderTitleScreenElements();
        
        // Semi-transparent overlay to make text readable
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.textAlign = 'center';
        
        // Game title with retro arcade styling
        this.ctx.save();
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 6;
        this.ctx.font = 'bold 72px Arial';
        const titleText = 'TOFU ALLIANCE';
        this.ctx.strokeText(titleText, this.canvas.width / 2, 100);
        this.ctx.fillText(titleText, this.canvas.width / 2, 100);
        this.ctx.restore();
        
        // Subtitle with glow effect
        this.ctx.save();
        this.ctx.shadowColor = '#32CD32';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Defend the Grassy Plains!', this.canvas.width / 2, 140);
        this.ctx.restore();
        
        // Animated "Press Start" text
        const time = Date.now() * 0.005;
        const alpha = (Math.sin(time) + 1) / 2 * 0.8 + 0.2;
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#00FF00';
        this.ctx.strokeStyle = '#004400';
        this.ctx.lineWidth = 2;
        this.ctx.font = 'bold 32px Arial';
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const startText = isMobile ? 'TAP TO START' : 'PRESS SPACE TO START';
        this.ctx.strokeText(startText, this.canvas.width / 2, 200);
        this.ctx.fillText(startText, this.canvas.width / 2, 200);
        
        if (isMobile) {
            if (!this.audioUnlocked) {
                // Show audio enable button below TAP TO START
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
                this.ctx.fillRect(this.canvas.width / 2 - 100, 220, 200, 40);
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.canvas.width / 2 - 100, 220, 200, 40);
                
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillText('TAP HERE TO ENABLE AUDIO', this.canvas.width / 2, 245);
                this.ctx.restore();
            } else {
                // Mobile tips below TAP TO START
                this.ctx.font = 'bold 12px Arial';
                this.ctx.fillStyle = '#FFFF00';
                this.ctx.fillText('Best in landscape | Hide Safari address bar', this.canvas.width / 2, 220);
            }
        } else {
            // Desktop controls below TAP TO START
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText('Arrow keys to move | X to shoot | Space to jump', this.canvas.width / 2, 220);
        }
        this.ctx.restore();
        
        // High scores box with retro styling
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 100, 0.8)';
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        const boxX = this.canvas.width / 2 - 150;
        const boxY = 240;
        const boxWidth = 300;
        const boxHeight = 140;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // High scores header
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, boxY + 30);
        
        // High scores list
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '18px Arial';
        for (let i = 0; i < Math.min(5, this.highScores.length); i++) {
            const entry = this.highScores[i];
            const rank = i + 1;
            const text = `${rank}. ${entry.initials} ............ ${entry.score}`;
            this.ctx.fillText(text, this.canvas.width / 2, boxY + 55 + (i * 20));
        }
        this.ctx.restore();
        
        this.ctx.textAlign = 'left';
    }
    
    renderTitleScreenElements() {
        // Add some static enemies in the background for atmosphere
        const time = Date.now() * 0.001;
        
        // Static tank in background
        if (this.assets.tankSprite) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.6;
            this.ctx.drawImage(this.assets.tankSprite, 600, 200, 120, 90);
            this.ctx.restore();
        }
        
        // Static soldiers
        if (this.assets.soldier1Sprite) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(this.assets.soldier1Sprite, 150, 180, 100, 120);
            this.ctx.restore();
        }
        
        if (this.assets.soldier2Sprite) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(this.assets.soldier2Sprite, 500, 190, 90, 105);
            this.ctx.restore();
        }
        
        // Floating title screen tofu character
        if (this.assets.tofuSprite) {
            const bobOffset = Math.sin(time * 2) * 10;
            this.ctx.save();
            this.ctx.globalAlpha = 0.9;
            
            // Draw tofu body
            this.ctx.drawImage(this.assets.tofuSprite, 50, 150 + bobOffset, 60, 75);
            
            // Draw animated legs for title screen tofu
            const tofuX = 50;
            const tofuY = 150 + bobOffset;
            const tofuWidth = 60;
            const tofuHeight = 75;
            
            const leftLegX = tofuX + tofuWidth * 0.35;
            const rightLegX = tofuX + tofuWidth * 0.55;
            const legStartY = tofuY + tofuHeight * 0.82;
            const legLength = tofuHeight * 0.18;
            
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            
            // Static legs for floating tofu
            this.ctx.beginPath();
            this.ctx.moveTo(leftLegX, legStartY);
            this.ctx.lineTo(leftLegX, legStartY + legLength);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(rightLegX, legStartY);
            this.ctx.lineTo(rightLegX, legStartY + legLength);
            this.ctx.stroke();
            
            // Draw feet
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(leftLegX - 1, legStartY + legLength, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(leftLegX + 1, legStartY + legLength, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(rightLegX - 1, legStartY + legLength, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(rightLegX + 1, legStartY + legLength, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    renderBackground() {
        // Sky gradient - light blue to horizon
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.7);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.6, '#B0E0E6'); // Powder blue
        gradient.addColorStop(1, '#98FB98'); // Pale green (horizon)
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.7);
        
        // Distant hills
        this.ctx.fillStyle = '#90EE90'; // Light green
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.6);
        for (let x = 0; x <= this.canvas.width; x += 50) {
            const hillHeight = Math.sin((x + this.camera.x * 0.1) * 0.01) * 20 + this.canvas.height * 0.65;
            this.ctx.lineTo(x, hillHeight);
        }
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.fill();
        
        // Clouds
        this.renderClouds();
    }
    
    renderClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Moving clouds based on camera position
        const cloudOffset = this.camera.x * 0.3;
        
        // Cloud 1
        const cloud1X = 100 - cloudOffset % (this.canvas.width + 200);
        this.drawCloud(cloud1X, 60, 0.8);
        
        // Cloud 2
        const cloud2X = 400 - cloudOffset % (this.canvas.width + 200);
        this.drawCloud(cloud2X, 100, 1.0);
        
        // Cloud 3
        const cloud3X = 700 - cloudOffset % (this.canvas.width + 200);
        this.drawCloud(cloud3X, 40, 0.6);
    }
    
    drawCloud(x, y, size) {
        this.ctx.save();
        this.ctx.scale(size, size);
        const scaledX = x / size;
        const scaledY = y / size;
        
        // Draw cloud as multiple overlapping circles
        this.ctx.beginPath();
        this.ctx.arc(scaledX, scaledY, 25, 0, Math.PI * 2);
        this.ctx.arc(scaledX + 25, scaledY, 35, 0, Math.PI * 2);
        this.ctx.arc(scaledX + 50, scaledY, 25, 0, Math.PI * 2);
        this.ctx.arc(scaledX + 10, scaledY - 20, 20, 0, Math.PI * 2);
        this.ctx.arc(scaledX + 40, scaledY - 20, 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    renderTouchControls() {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile || this.gameState !== 'playing') return;
        
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Render each virtual button
        for (let [buttonName, button] of Object.entries(this.virtualButtons)) {
            // Button background - brighter when pressed
            this.ctx.globalAlpha = button.pressed ? 0.6 : 0.3;
            this.ctx.fillStyle = button.pressed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            this.ctx.beginPath();
            this.ctx.arc(button.x, button.y, button.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Button border
            this.ctx.globalAlpha = 0.8;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(button.x, button.y, button.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Button icon/text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 20px Arial';
            
            switch(buttonName) {
                case 'left':
                    this.ctx.fillText('◀', button.x, button.y);
                    break;
                case 'right':
                    this.ctx.fillText('▶', button.x, button.y);
                    break;
                case 'jump':
                    this.ctx.fillText('↑', button.x, button.y);
                    break;
                case 'shoot':
                    this.ctx.fillText('●', button.x, button.y);
                    break;
            }
        }
        
        this.ctx.restore();
    }
    
    renderGround() {
        const groundY = 320; // Ground level
        
        // Grass texture
        this.ctx.fillStyle = '#228B22'; // Forest green
        this.ctx.fillRect(this.camera.x - 100, groundY, this.canvas.width + 200, this.canvas.height - groundY);
        
        // Grass blades
        this.ctx.strokeStyle = '#32CD32'; // Lime green
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Draw grass blades across the visible area
        for (let x = this.camera.x - 50; x < this.camera.x + this.canvas.width + 50; x += 8) {
            const grassHeight = Math.sin(x * 0.1) * 3 + 15;
            const grassX = x + Math.sin(x * 0.05) * 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(grassX, groundY);
            this.ctx.lineTo(grassX + Math.sin(x * 0.2) * 3, groundY - grassHeight);
            this.ctx.stroke();
        }
        
        // Dirt patches - fixed positioning
        this.ctx.fillStyle = '#8B4513'; // Saddle brown
        const startX = Math.floor((this.camera.x - 100) / 150) * 150;
        for (let x = startX; x < this.camera.x + this.canvas.width + 100; x += 150) {
            const patchX = x + Math.sin(x * 0.01) * 20;
            const patchY = groundY + 5;
            this.ctx.fillRect(patchX, patchY, 30 + Math.sin(x * 0.02) * 10, 8);
        }
    }
    
    restart() {
        this.startGame(); // Use the startGame method for consistency
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 80;
        this.height = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = -12;
        this.gravity = 0.5;
        this.onGround = false;
        this.groundY = 220;
        
        this.facingRight = true;
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.15;
        
        this.leftLegOffset = 0;
        this.rightLegOffset = 0;
        this.leftArmOffset = 0;
        this.rightArmOffset = 0;
        
        this.lastShotTime = 0;
        this.shootCooldown = 200;
        
        this.health = 10;
        this.maxHealth = 10;
        this.lastDamageTime = 0;
        
        // Rapid-fire powerup properties
        this.hasRapidFire = false;
        this.rapidFireEndTime = 0;
        this.normalShootCooldown = 200;
        this.rapidFireCooldown = 80; // Much faster shooting
        
    }
    
    update(keys) {
        this.velocityX = 0;
        this.isMoving = false;
        
        // Check if rapid-fire has expired
        if (this.hasRapidFire && Date.now() > this.rapidFireEndTime) {
            this.hasRapidFire = false;
            this.shootCooldown = this.normalShootCooldown;
        }
        
        if (keys['ArrowLeft'] || keys['a']) {
            this.velocityX = -this.speed;
            this.facingRight = false;
            this.isMoving = true;
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.velocityX = this.speed;
            this.facingRight = true;
            this.isMoving = true;
        }
        if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && this.onGround) {
            this.velocityY = this.jumpPower;
            this.onGround = false;
        }
        
        if (this.isMoving && this.onGround) {
            this.animationFrame += this.animationSpeed;
            
            this.leftLegOffset = Math.sin(this.animationFrame) * 6;
            this.rightLegOffset = Math.sin(this.animationFrame + Math.PI) * 6;
            
            this.leftArmOffset = Math.sin(this.animationFrame + Math.PI) * 4;
            this.rightArmOffset = Math.sin(this.animationFrame) * 4;
        } else {
            this.leftLegOffset = 0;
            this.rightLegOffset = 0;
            this.leftArmOffset = 0;
            this.rightArmOffset = 0;
        }
        
        this.velocityY += this.gravity;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.onGround = true;
        }
    }
    
    render(ctx) {
        if (!this.sprite) return;
        
        ctx.save();
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        if (!this.facingRight) {
            ctx.translate(centerX, centerY);
            ctx.scale(-1, 1);
            ctx.translate(-centerX, -centerY);
        }
        
        this.renderBodyParts(ctx);
        
        ctx.restore();
    }
    
    renderBodyParts(ctx) {
        const bodyX = this.x;
        const bodyY = this.y;
        
        ctx.save();
        
        if (this.sprite) {
            ctx.drawImage(this.sprite, bodyX, bodyY, this.width, this.height);
            this.drawAnimatedLegs(ctx, bodyX, bodyY);
        }
        
        ctx.restore();
    }
    
    drawAnimatedLegs(ctx, bodyX, bodyY) {
        const leftLegX = bodyX + this.width * 0.35;
        const rightLegX = bodyX + this.width * 0.55;
        const legStartY = bodyY + this.height * 0.82;
        const legLength = this.height * 0.18;
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        if (this.isMoving && this.onGround) {
            // Animated walking legs
            const leftAngle = Math.sin(this.animationFrame) * 0.5;
            const rightAngle = Math.sin(this.animationFrame + Math.PI) * 0.5;
            
            const leftEndX = leftLegX + Math.sin(leftAngle) * 12;
            const leftEndY = legStartY + Math.cos(leftAngle) * legLength;
            
            const rightEndX = rightLegX + Math.sin(rightAngle) * 12;
            const rightEndY = legStartY + Math.cos(rightAngle) * legLength;
            
            // Draw animated legs
            ctx.beginPath();
            ctx.moveTo(leftLegX, legStartY);
            ctx.lineTo(leftEndX, leftEndY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(rightLegX, legStartY);
            ctx.lineTo(rightEndX, rightEndY);
            ctx.stroke();
            
            // Draw feet
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(leftEndX - 2, leftEndY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(leftEndX + 2, leftEndY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(rightEndX - 2, rightEndY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rightEndX + 2, rightEndY, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Static legs when not moving
            ctx.beginPath();
            ctx.moveTo(leftLegX, legStartY);
            ctx.lineTo(leftLegX, legStartY + legLength);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(rightLegX, legStartY);
            ctx.lineTo(rightLegX, legStartY + legLength);
            ctx.stroke();
            
            // Draw feet
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(leftLegX - 2, legStartY + legLength, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(leftLegX + 2, legStartY + legLength, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(rightLegX - 2, legStartY + legLength, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rightLegX + 2, legStartY + legLength, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    shoot(bulletsArray) {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime > this.shootCooldown) {
            // Position bullet at the rifle barrel tip
            const bulletX = this.facingRight ? this.x + this.width * 0.85 : this.x + this.width * 0.15;
            const bulletY = this.y + this.height * 0.65;
            bulletsArray.push(new Bullet(bulletX, bulletY, this.facingRight));
            this.lastShotTime = currentTime;
            return true; // Shot was fired
        }
        return false; // Shot was not fired (cooldown)
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
    
    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }
    
    activateRapidFire() {
        this.hasRapidFire = true;
        this.rapidFireEndTime = Date.now() + 10000; // 10 seconds of rapid fire
        this.shootCooldown = this.rapidFireCooldown;
    }
}

class Bullet {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.startX = x; // Remember starting position for range calculation
        this.width = 8;
        this.height = 3;
        this.speed = 10;
        this.direction = facingRight ? 1 : -1;
    }
    
    update() {
        this.x += this.speed * this.direction;
    }
    
    render(ctx) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.x + 2, this.y, this.width - 4, this.height);
    }
}

class Enemy {
    constructor(x, y, type, assets) {
        this.x = x;
        this.y = y;
        this.type = type; // 0 = soldier1, 1 = soldier2, 2 = tank
        this.assets = assets;
        
        if (type === 2) { // tank
            this.width = 160;
            this.height = 120;
            this.speed = 0.5;
            this.sprite = assets.tankSprite;
        } else if (type === 0) { // soldier 1 - make bigger
            this.width = 140;
            this.height = 150;
            this.speed = 1.5;
            this.sprite = assets.soldier1Sprite;
        } else { // soldier 2
            this.width = 120;
            this.height = 140;
            this.speed = 1.5;
            this.sprite = assets.soldier2Sprite;
        }
        
        // Different ground levels for different enemy types
        if (type === 0) { // soldier 1 - keep at 200
            this.groundY = 200;
        } else if (type === 1) { // soldier 2 - lower
            this.groundY = 207;
        } else { // tank - lower
            this.groundY = 208;
        }
        this.velocityY = 0;
        this.gravity = 0.5;
        this.onGround = false;
        this.animationFrame = Math.random() * Math.PI * 2;
        this.animationSpeed = 0.1;
        
        // Sound properties
        this.lastEngineSound = 0;
        this.engineSound = (type === 2); // Only tanks make engine sounds
        
        // Health system
        if (type === 2) { // tank
            this.health = 3;
            this.maxHealth = 3;
        } else { // soldiers
            this.health = 1;
            this.maxHealth = 1;
        }
        
        // Direction tracking
        this.facingLeft = true; // Start facing left (toward player spawn)
        
        // Point values based on enemy type
        if (type === 0) { // soldier 1 (tall)
            this.pointValue = 5;
        } else if (type === 1) { // soldier 2 (small)
            this.pointValue = 10;  
        } else { // tank
            this.pointValue = 100;
        }
    }
    
    update(player, enemyBullets, game) {
        // Smart AI - move towards player
        if (player.x < this.x) {
            this.x -= this.speed; // Move left toward player
            this.facingLeft = true;
        } else {
            this.x += this.speed; // Move right to chase player
            this.facingLeft = false;
        }
        
        // Enemy shooting - much slower fire rate
        const shootChance = this.type === 2 ? 0.002 : 0.004; // Much slower firing
        if (Math.random() < shootChance) {
            this.shoot(player, enemyBullets, game);
        }
        
        // Tank engine sounds
        if (this.engineSound && game) {
            const currentTime = Date.now();
            if (currentTime - this.lastEngineSound > 1000) { // Every second
                game.playTankEngine(this);
            }
        }
        
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        // Update animation
        this.animationFrame += this.animationSpeed;
    }
    
    shoot(player, enemyBullets, game) {
        const bulletX = this.x;
        const bulletY = this.y + this.height * 0.5;
        const isTank = this.type === 2;
        enemyBullets.push(new EnemyBullet(bulletX, bulletY, false, isTank)); // false = shoot left
        
        // Play appropriate sound effect
        if (game) {
            if (isTank) {
                game.playTankShoot();
            } else {
                game.playEnemyShoot();
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            return true; // Enemy is destroyed
        }
        return false; // Enemy still alive
    }
    
    render(ctx) {
        if (this.sprite) {
            ctx.save();
            
            // Flip sprite based on facing direction
            if (this.facingLeft) {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(this.x, this.y);
            }
            
            // Flash red when damaged (if not at max health)
            if (this.health < this.maxHealth) {
                const flashIntensity = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
                ctx.globalAlpha = flashIntensity;
                ctx.filter = 'hue-rotate(0deg) saturate(200%) brightness(1.2)';
            }
            
            if (this.facingLeft) {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
            }
            
            ctx.restore();
            
            // Draw health indicator for tanks
            if (this.type === 2 && this.health < this.maxHealth) {
                this.renderHealthBar(ctx);
            }
        }
    }
    
    renderHealthBar(ctx) {
        const barWidth = this.width * 0.8;
        const barHeight = 4;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 10;
        
        // Background
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health portion
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

class EnemyBullet {
    constructor(x, y, facingRight, isTank = false) {
        this.x = x;
        this.y = y;
        this.startX = x; // Remember starting position for range calculation
        this.width = isTank ? 16 : 6; // Made tank bullets bigger
        this.height = isTank ? 12 : 6; // Made tank bullets bigger
        this.speed = 4;
        this.direction = facingRight ? 1 : -1;
        this.isTank = isTank;
    }
    
    update() {
        this.x += this.speed * this.direction;
    }
    
    render(ctx) {
        if (this.isTank) {
            // Tank bullets - larger and darker
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x + 2, this.y + 1, this.width - 4, this.height - 2);
        } else {
            // Regular enemy bullets
            ctx.fillStyle = '#FF4444';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
        }
    }
}

class HeartPowerup {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.sprite = assets.heartSprite;
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.floatOffset = 0;
    }
    
    update() {
        // Floating animation
        this.animationFrame += this.animationSpeed;
        this.floatOffset = Math.sin(this.animationFrame) * 5;
    }
    
    render(ctx) {
        const renderY = this.y + this.floatOffset;
        
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);
            
            // Add a subtle glow effect
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 10;
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback rendering if sprite isn't loaded
            ctx.save();
            ctx.fillStyle = '#FF0000';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            
            // Draw simple heart shape
            ctx.beginPath();
            ctx.moveTo(this.x + 12, this.y + 6 + this.floatOffset);
            ctx.bezierCurveTo(this.x + 8, this.y + 2 + this.floatOffset, this.x + 2, this.y + 6 + this.floatOffset, this.x + 8, this.y + 12 + this.floatOffset);
            ctx.lineTo(this.x + 12, this.y + 18 + this.floatOffset);
            ctx.lineTo(this.x + 16, this.y + 12 + this.floatOffset);
            ctx.bezierCurveTo(this.x + 22, this.y + 6 + this.floatOffset, this.x + 16, this.y + 2 + this.floatOffset, this.x + 12, this.y + 6 + this.floatOffset);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
    
    collect(player) {
        // Restore 2 health points (1 full heart)
        player.heal(2);
    }
}

class RapidFirePowerup {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.sprite = assets.rapidFireSprite;
        this.animationFrame = 0;
        this.animationSpeed = 0.15;
        this.floatOffset = 0;
    }
    
    update() {
        // Faster floating animation with electric effect
        this.animationFrame += this.animationSpeed;
        this.floatOffset = Math.sin(this.animationFrame) * 7;
    }
    
    render(ctx) {
        const renderY = this.y + this.floatOffset;
        
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);
            
            // Add electric glow effect
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.shadowColor = '#00FFFF';
            ctx.shadowBlur = 15;
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback rendering - lightning bolt
            ctx.save();
            ctx.fillStyle = '#00FFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            
            const offsetY = this.floatOffset;
            ctx.beginPath();
            ctx.moveTo(this.x + 12, this.y + 2 + offsetY);
            ctx.lineTo(this.x + 16, this.y + 8 + offsetY);
            ctx.lineTo(this.x + 14, this.y + 10 + offsetY);
            ctx.lineTo(this.x + 18, this.y + 16 + offsetY);
            ctx.lineTo(this.x + 12, this.y + 22 + offsetY);
            ctx.lineTo(this.x + 8, this.y + 16 + offsetY);
            ctx.lineTo(this.x + 10, this.y + 14 + offsetY);
            ctx.lineTo(this.x + 6, this.y + 8 + offsetY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
    
    collect(player) {
        // Activate rapid-fire mode
        player.activateRapidFire();
    }
}

class Mine {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 16;
        this.sprite = assets.mineSprite;
        this.animationFrame = 0;
        this.animationSpeed = 0.05;
        this.blinkTimer = 0;
    }
    
    update() {
        // Slow blinking red light
        this.animationFrame += this.animationSpeed;
        this.blinkTimer += 0.02;
    }
    
    render(ctx) {
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            
            // Blinking red warning light
            if (Math.sin(this.blinkTimer) > 0) {
                ctx.save();
                ctx.fillStyle = '#FF0000';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(this.x + 10, this.y + 6, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } else {
            // Fallback rendering
            ctx.save();
            ctx.fillStyle = '#2F2F2F';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 8, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Blinking light
            if (Math.sin(this.blinkTimer) > 0) {
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(this.x + 10, this.y + 6, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.maxTime = 30; // frames
        this.finished = false;
        this.particles = [];
        
        // Create explosion particles
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                size: Math.random() * 6 + 2,
                color: Math.random() > 0.5 ? '#FF4500' : '#FFD700'
            });
        }
    }
    
    update() {
        this.timer++;
        if (this.timer >= this.maxTime) {
            this.finished = true;
            return;
        }
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // gravity
            particle.size *= 0.95; // shrink
        });
    }
    
    render(ctx) {
        const alpha = 1 - (this.timer / this.maxTime);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw explosion flash
        if (this.timer < 5) {
            const flashRadius = (5 - this.timer) * 15;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, flashRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, flashRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            if (particle.size > 0.5) {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        ctx.restore();
    }
}

class TankExplosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.maxTime = 60; // Much longer than regular explosions (60 frames vs 30)
        this.finished = false;
        this.particles = [];
        
        // Create MANY more explosion particles for big tank explosion
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 16, // Faster/wider spread
                vy: (Math.random() - 0.5) * 16 - 4,
                size: Math.random() * 12 + 4, // Bigger particles
                color: this.getParticleColor(),
                life: Math.random() * 0.5 + 0.5 // Variable particle lifetime
            });
        }
        
        // Add smoke particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8 - 2, // Upward smoke
                size: Math.random() * 15 + 8,
                color: '#666666', // Gray smoke
                life: 1.0,
                isSmoke: true
            });
        }
    }
    
    getParticleColor() {
        const colors = ['#FF4500', '#FFD700', '#FF6600', '#FFA500', '#FF0000', '#FFFF00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.timer++;
        if (this.timer >= this.maxTime) {
            this.finished = true;
            return;
        }
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.isSmoke ? 0.05 : 0.3; // Less gravity for smoke
            particle.size *= particle.isSmoke ? 0.99 : 0.96; // Smoke fades slower
            particle.vx *= 0.98; // Air resistance
            particle.life -= particle.isSmoke ? 0.01 : 0.02;
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0 && p.size > 0.5);
    }
    
    render(ctx) {
        const alpha = 1 - (this.timer / this.maxTime);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw massive explosion flash (bigger and longer than regular)
        if (this.timer < 10) {
            const flashRadius = (10 - this.timer) * 25; // Much bigger flash
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, flashRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.8)');
            gradient.addColorStop(0.7, 'rgba(255, 50, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, flashRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw all particles
        this.particles.forEach(particle => {
            if (particle.size > 0.5 && particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life * alpha;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        
        ctx.restore();
    }
}

class TankRemnant {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.timer = 0;
        this.maxTime = 600; // 10 seconds at 60fps
        this.finished = false;
        
        // Create debris pieces at random positions within tank bounds
        this.debris = [];
        const numPieces = 8;
        
        for (let i = 0; i < numPieces; i++) {
            this.debris.push({
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                width: 10 + Math.random() * 15,
                height: 8 + Math.random() * 12,
                rotation: Math.random() * Math.PI * 2,
                color: this.getDebrisColor(),
                velocityY: 0,
                onGround: false,
                groundY: 220 + 100 // Same as player ground level + player height
            });
        }
    }
    
    getDebrisColor() {
        const colors = ['#2F2F2F', '#404040', '#1A1A1A', '#4A4A4A', '#333333'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.timer++;
        if (this.timer >= this.maxTime) {
            this.finished = true;
        }
        
        // Apply gravity to debris pieces
        this.debris.forEach(piece => {
            if (!piece.onGround) {
                piece.velocityY += 0.5; // gravity
                piece.y += piece.velocityY;
                
                // Check ground collision
                if (piece.y + piece.height >= piece.groundY) {
                    piece.y = piece.groundY - piece.height;
                    piece.velocityY = 0;
                    piece.onGround = true;
                }
            }
        });
    }
    
    render(ctx) {
        if (this.finished) return;
        
        // Fade out in the last 2 seconds
        const fadeStart = this.maxTime - 120; // Last 2 seconds
        let alpha = 1;
        if (this.timer > fadeStart) {
            alpha = 1 - ((this.timer - fadeStart) / 120);
        }
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw debris pieces
        this.debris.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x + piece.width/2, piece.y + piece.height/2);
            ctx.rotate(piece.rotation);
            
            // Draw as dark metallic chunks
            ctx.fillStyle = piece.color;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            
            ctx.fillRect(-piece.width/2, -piece.height/2, piece.width, piece.height);
            ctx.strokeRect(-piece.width/2, -piece.height/2, piece.width, piece.height);
            
            // Add some detail lines to make it look like metal
            ctx.strokeStyle = '#666666';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-piece.width/2 + 2, -piece.height/2 + 2);
            ctx.lineTo(piece.width/2 - 2, piece.height/2 - 2);
            ctx.stroke();
            
            ctx.restore();
        });
        
        ctx.restore();
    }
}

const game = new Game();