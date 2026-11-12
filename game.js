// Enemy types that get boss music, the big health bar and a boss death explosion:
// 4 = boss tank, 5 = mech, 7 = artillery truck
function isBossType(type) {
    return type === 4 || type === 5 || type === 7 || type === 9 || type === 12;
}

// True when the game is opened from this computer (index.html as a file, or a local
// server) rather than the live website. Testing shortcuts are only enabled locally.
function isLocalPlay() {
    const host = window.location.hostname;
    return window.location.protocol === 'file:' ||
           host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

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
        this.assetsToLoad = 12;
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
        
        const sniperSprite = new Image();
        sniperSprite.onload = () => {
            this.assets.sniperSprite = sniperSprite;
            this.checkAssetsLoaded();
        };
        sniperSprite.src = 'sniper.png';
        
        const boss1Sprite = new Image();
        boss1Sprite.onload = () => {
            this.assets.boss1Sprite = boss1Sprite;
            this.checkAssetsLoaded();
        };
        boss1Sprite.src = 'boss1.png';
        
        const popcornSprite = new Image();
        popcornSprite.onload = () => {
            this.assets.popcornSprite = popcornSprite;
            this.checkAssetsLoaded();
        };
        popcornSprite.src = 'popcorn.png';

        const shieldSprite = new Image();
        shieldSprite.onload = () => {
            this.assets.shieldSprite = shieldSprite;
            this.checkAssetsLoaded();
        };
        shieldSprite.src = 'shield.png';

        const mechSprite = new Image();
        mechSprite.onload = () => {
            this.assets.mechSprite = mechSprite;
            this.checkAssetsLoaded();
        };
        mechSprite.src = 'mech.png';

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

        // Golden heart powerup sprite — full heal, gold w/ darker outline
        const goldCanvas = document.createElement('canvas');
        goldCanvas.width = 24;
        goldCanvas.height = 24;
        const goldCtx = goldCanvas.getContext('2d');
        const goldGrad = goldCtx.createLinearGradient(0, 0, 0, 24);
        goldGrad.addColorStop(0, '#FFF4A8');
        goldGrad.addColorStop(0.5, '#FFD700');
        goldGrad.addColorStop(1, '#C29200');
        goldCtx.fillStyle = goldGrad;
        goldCtx.beginPath();
        goldCtx.moveTo(12, 6);
        goldCtx.bezierCurveTo(8, 2, 2, 6, 8, 12);
        goldCtx.lineTo(12, 18);
        goldCtx.lineTo(16, 12);
        goldCtx.bezierCurveTo(22, 6, 16, 2, 12, 6);
        goldCtx.fill();
        goldCtx.strokeStyle = '#6B4A00';
        goldCtx.lineWidth = 1.5;
        goldCtx.stroke();
        // Inner highlight
        goldCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        goldCtx.beginPath();
        goldCtx.ellipse(9, 8, 2, 1.4, -0.5, 0, Math.PI * 2);
        goldCtx.fill();

        const goldenHeartSprite = new Image();
        goldenHeartSprite.onload = () => {
            this.assets.goldenHeartSprite = goldenHeartSprite;
            this.checkAssetsLoaded();
        };
        goldenHeartSprite.src = goldCanvas.toDataURL();

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
        this.sandbags = [];
        this.platforms = [];
        this.barbedWire = [];
        this.woodenCrates = [];
        this.warehouseCrates = [];
        this.destructibleCrates = [];
        this.bunkers = [];
        this.artilleryShells = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnDelay = 3000;
        this.gameOver = false;
        
        // Game state management
        this.gameState = 'title'; // 'title', 'story', 'playing', 'gameOver', 'levelBuilder', 'victory', 'levelComplete', 'bossCutscene'
        
        // Story screen data
        this.currentStorySlide = 0;
        this.storyTime = 0;
        
        // Boss cutscene data
        this.bossCutsceneTime = 0;
        this.bossCutsceneActive = false;
        
        this.storySlides = [
            {
                title: "EVIL AWAKENS!",
                text: "\"MWAHAHAHA! I, POPCORN, will crush\nthe peaceful tofu! My human army\nshall conquer all!\"",
                background: "#4B0082",
                backgroundGradient: ["#4B0082", "#000000"],
                showEnemies: false,
                showTofu: false,
                showPopcorn: true,
                dramaticText: true,
                effects: "villain",
                speaker: "popcorn"
            },
            {
                title: "THE HERO APPEARS!",
                text: "\"Not today, Popcorn!\nI won't let you harm the innocent!\"",
                background: "#FFD700",
                backgroundGradient: ["#FFD700", "#FFA500"],
                showEnemies: false,
                showTofu: true,
                showPopcorn: false,
                dramaticText: true,
                effects: "heroic",
                speaker: "tofu"
            },
            {
                title: "CLASH OF DESTINIES!",
                text: "The ultimate confrontation begins!\nGood versus evil in an epic battle\nfor the fate of the world!",
                background: "#DC143C",
                backgroundGradient: ["#DC143C", "#8B0000"],
                showEnemies: true,
                showTofu: true,
                showPopcorn: true,
                dramaticText: true,
                effects: "confrontation",
                speaker: "narrator"
            },
            {
                title: "EPIC BATTLE BEGINS!",
                text: "Armed with determination and courage,\nTofu faces the evil army!\nWill good triumph over evil?!",
                background: "#FF4500",
                backgroundGradient: ["#FF4500", "#8B0000"],
                showEnemies: true,
                showTofu: true,
                dramaticText: true,
                effects: "battle"
            }
        ];
        
        // Title screen music
        this.titleMusic = null;
        this.titleMusicGain = null;
        this.titleMusicPlaying = false;
        
        // Story screen music
        this.storyMusic = null;
        this.storyMusicGain = null;
        this.storyMusicPlaying = false;
        this.currentStoryMusicType = null;
        this.storyMusicTimeout = null;
        this.audioUnlocked = false;
        
        // Gameplay music
        this.gameplayMusic = null;
        this.gameplayMusicGain = null;
        this.gameplayMusicPlaying = false;
        
        // Boss music
        this.bossMusic = null;
        this.bossMusicGain = null;
        this.bossMusicPlaying = false;
        this.bossActive = false;
        
        // Popcorn villain music
        this.popcornMusic = null;
        this.popcornMusicPlaying = false;
        this.popcornMusicTimeout = null;
        
        // Mystery/suspense music
        this.mysteryMusic = null;
        this.mysteryMusicPlaying = false;
        this.mysteryMusicTimeout = null;
        
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
        this.wonGame = false;
        
        // Level system
        this.currentLevel = 1;
        this.currentWorld = 1;
        this.levelData = this.createDefaultLevels();
        this.currentLevelData = null;
        this.levelSpawnIndex = 0;
        this.levelComplete = false;
        this.levelStartTime = 0;
        
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
    
    createDefaultLevels() {
        return {
            1: {
                1: {
                    name: "First Contact",
                    startX: 0,
                    endX: 6000,
                enemies: [
                    // Early encounters
                    { type: 0, x: 800, y: 280 },
                    { type: 1, x: 1000, y: 280 },
                    { type: 0, x: 1200, y: 280 },
                    { type: 0, x: 1400, y: 280 },
                    { type: 1, x: 1600, y: 280 },
                    // First group
                    { type: 0, x: 2000, y: 280 },
                    { type: 1, x: 2200, y: 280 },
                    { type: 0, x: 2400, y: 280 },
                    { type: 1, x: 2600, y: 280 },
                    { type: 0, x: 2800, y: 280 },
                    // Mid-level
                    { type: 1, x: 3200, y: 280 },
                    { type: 0, x: 3400, y: 280 },
                    { type: 0, x: 3600, y: 280 },
                    { type: 1, x: 3800, y: 280 },
                    { type: 0, x: 4000, y: 280 },
                    { type: 1, x: 4200, y: 280 },
                    // Late encounters
                    { type: 0, x: 4600, y: 280 },
                    { type: 1, x: 4800, y: 280 },
                    { type: 0, x: 5000, y: 280 },
                    { type: 1, x: 5200, y: 280 },
                    { type: 0, x: 5400, y: 280 },
                    { type: 6, x: 5500, y: 180 },  // Tower - guards level end
                    { type: 1, x: 5600, y: 280 },
                    { type: 0, x: 5800, y: 280 }
                ],
                sandbags: [
                    { x: 1800, y: 280 },
                    { x: 2900, y: 280 },
                    { x: 4500, y: 280 },
                    { x: 5300, y: 280 }
                ],
                platforms: [
                    { x: 1870, y: 300, width: 80, height: 20 },  // Behind first sandbag, wider platform
                    { x: 2970, y: 300, width: 80, height: 20 },  // Behind second sandbag, wider platform
                    { x: 4570, y: 300, width: 80, height: 20 },  // Behind third sandbag, wider platform
                    { x: 5370, y: 300, width: 80, height: 20 }   // Behind fourth sandbag, wider platform
                ],
                barbedWire: [
                    { x: 1800, y: 260, width: 60 },  // Over left side of first sandbag
                    { x: 2900, y: 260, width: 60 },  // Over left side of second sandbag
                    { x: 4500, y: 260, width: 60 },  // Over left side of third sandbag
                    { x: 5300, y: 260, width: 60 }   // Over left side of fourth sandbag
                ]
                },
                2: {
                    name: "Reinforcements", 
                startX: 0,
                endX: 8000,
                enemies: [
                    // Opening wave
                    { type: 0, x: 600, y: 280 },
                    { type: 1, x: 800, y: 280 },
                    { type: 0, x: 1000, y: 280 },
                    { type: 1, x: 1200, y: 280 },
                    { type: 0, x: 1400, y: 280 },
                    { type: 0, x: 1600, y: 280 },
                    // First tank section
                    { type: 1, x: 2000, y: 300 },  // Elevated behind sandbag
                    { type: 2, x: 2200, y: 280 },  // Tank
                    { type: 0, x: 2400, y: 280 },
                    { type: 1, x: 2600, y: 300 },  // Elevated behind sandbag
                    { type: 0, x: 2800, y: 280 },
                    // Heavy infantry
                    { type: 1, x: 3200, y: 280 },
                    { type: 0, x: 3400, y: 300 },  // Elevated behind sandbag
                    { type: 1, x: 3600, y: 280 },
                    { type: 0, x: 3800, y: 280 },
                    { type: 1, x: 4000, y: 280 },
                    // Mid-level tank assault
                    { type: 0, x: 4400, y: 280 },
                    { type: 2, x: 4600, y: 280 },  // Tank
                    { type: 1, x: 4800, y: 280 },
                    { type: 0, x: 5000, y: 280 },
                    { type: 2, x: 5200, y: 280 },  // Tank
                    { type: 1, x: 5400, y: 280 },
                    { type: 0, x: 5600, y: 280 },
                    // Final push
                    { type: 1, x: 6000, y: 280 },
                    { type: 0, x: 6200, y: 280 },
                    { type: 1, x: 6400, y: 280 },
                    { type: 0, x: 6600, y: 280 },
                    { type: 2, x: 6800, y: 280 },  // Tank
                    { type: 1, x: 7000, y: 280 },
                    { type: 0, x: 7200, y: 280 },
                    { type: 1, x: 7400, y: 280 },
                    { type: 0, x: 7600, y: 280 },
                    { type: 6, x: 7650, y: 180 },  // Tower - guards level end
                    { type: 2, x: 7800, y: 280 }   // Final tank
                ],
                sandbags: [
                    { x: 1900, y: 280 },
                    { x: 2500, y: 280 },
                    { x: 3500, y: 280 },
                    { x: 4300, y: 280 },
                    { x: 5500, y: 280 },
                    { x: 6100, y: 280 },
                    { x: 6900, y: 280 },
                    { x: 7500, y: 280 }
                ],
                platforms: [
                    { x: 1970, y: 300, width: 80, height: 20 },
                    { x: 2570, y: 300, width: 80, height: 20 },
                    { x: 3570, y: 300, width: 80, height: 20 },
                    { x: 4370, y: 300, width: 80, height: 20 },
                    { x: 5570, y: 300, width: 80, height: 20 },
                    { x: 6170, y: 300, width: 80, height: 20 },
                    { x: 6970, y: 300, width: 80, height: 20 },
                    { x: 7570, y: 300, width: 80, height: 20 }
                ],
                barbedWire: [
                    { x: 1900, y: 260, width: 60 },
                    { x: 2500, y: 260, width: 60 },
                    { x: 3500, y: 260, width: 60 },
                    { x: 4300, y: 260, width: 60 },
                    { x: 5500, y: 260, width: 60 },
                    { x: 6100, y: 260, width: 60 },
                    { x: 6900, y: 260, width: 60 },
                    { x: 7500, y: 260, width: 60 }
                ]
                },
                3: {
                    name: "Tank Squadron",
                startX: 0, 
                endX: 10000,
                enemies: [
                    // Opening scout wave
                    { type: 0, x: 500, y: 280 },
                    { type: 1, x: 700, y: 280 },
                    { type: 0, x: 900, y: 280 },
                    { type: 1, x: 1100, y: 280 },
                    { type: 0, x: 1300, y: 280 },
                    // First tank encounter with sniper support
                    { type: 3, x: 1500, y: 280 },  // Sniper
                    { type: 2, x: 1600, y: 280 },  // Tank
                    { type: 1, x: 1800, y: 280 },
                    { type: 0, x: 2000, y: 280 },
                    { type: 1, x: 2200, y: 280 },
                    { type: 0, x: 2400, y: 280 },
                    // Heavy tank section
                    { type: 1, x: 2800, y: 300 },  // Elevated behind sandbag
                    { type: 2, x: 3000, y: 280 },  // Tank
                    { type: 0, x: 3200, y: 280 },
                    { type: 2, x: 3400, y: 280 },  // Tank
                    { type: 1, x: 3600, y: 300 },  // Elevated behind sandbag
                    { type: 0, x: 3800, y: 280 },
                    { type: 1, x: 4000, y: 280 },
                    // Mid-level armored assault with sniper cover
                    { type: 0, x: 4400, y: 280 },
                    { type: 2, x: 4600, y: 280 },  // Tank
                    { type: 3, x: 4700, y: 280 },  // Sniper
                    { type: 1, x: 4800, y: 280 },
                    { type: 2, x: 5000, y: 280 },  // Tank
                    { type: 0, x: 5200, y: 280 },
                    { type: 1, x: 5400, y: 280 },
                    { type: 1, x: 5600, y: 280 },
                    { type: 0, x: 5800, y: 280 },
                    { type: 2, x: 6000, y: 280 },  // Tank
                    // Heavy resistance with elite sniper
                    { type: 1, x: 6400, y: 280 },
                    { type: 0, x: 6600, y: 280 },
                    { type: 2, x: 6800, y: 280 },  // Tank
                    { type: 3, x: 6900, y: 280 },  // Sniper
                    { type: 1, x: 7000, y: 280 },
                    { type: 0, x: 7200, y: 280 },
                    { type: 2, x: 7400, y: 280 },  // Tank
                    { type: 1, x: 7600, y: 280 },
                    { type: 0, x: 7800, y: 280 },
                    // Final desperate defense before the boss
                    { type: 1, x: 8200, y: 280 },
                    { type: 0, x: 8400, y: 280 },
                    { type: 2, x: 8600, y: 280 },  // Tank
                    { type: 1, x: 8800, y: 280 },
                    { type: 2, x: 9000, y: 280 },  // Tank
                    { type: 0, x: 9200, y: 280 },
                    { type: 1, x: 9400, y: 280 },
                    { type: 2, x: 9600, y: 280 },  // Tank
                    // THE BOSS - Final confrontation
                    { type: 4, x: 9800, y: 280 }   // Boss1 - Powerful tank with machine gun
                ],
                sandbags: [
                    { x: 1700, y: 280 },
                    { x: 2700, y: 280 },
                    { x: 3500, y: 280 },
                    { x: 4500, y: 280 },
                    { x: 5900, y: 280 },
                    { x: 6700, y: 280 },
                    { x: 7300, y: 280 },
                    { x: 8100, y: 280 },
                    { x: 8500, y: 280 },
                    { x: 9100, y: 280 },
                    { x: 9500, y: 280 }
                ],
                platforms: [
                    { x: 1770, y: 300, width: 80, height: 20 },
                    { x: 2770, y: 300, width: 80, height: 20 },
                    { x: 3570, y: 300, width: 80, height: 20 },
                    { x: 4570, y: 300, width: 80, height: 20 },
                    { x: 5970, y: 300, width: 80, height: 20 },
                    { x: 6770, y: 300, width: 80, height: 20 },
                    { x: 7370, y: 300, width: 80, height: 20 },
                    { x: 8170, y: 300, width: 80, height: 20 },
                    { x: 8570, y: 300, width: 80, height: 20 },
                    { x: 9170, y: 300, width: 80, height: 20 },
                    { x: 9570, y: 300, width: 80, height: 20 }
                ],
                barbedWire: [
                    { x: 1700, y: 260, width: 60 },
                    { x: 2700, y: 260, width: 60 },
                    { x: 3500, y: 260, width: 60 },
                    { x: 4500, y: 260, width: 60 },
                    { x: 5900, y: 260, width: 60 },
                    { x: 6700, y: 260, width: 60 },
                    { x: 7300, y: 260, width: 60 },
                    { x: 8100, y: 260, width: 60 },
                    { x: 8500, y: 260, width: 60 },
                    { x: 9100, y: 260, width: 60 },
                    { x: 9500, y: 260, width: 60 }
                ],
                bunkers: [
                    { x: 9900, y: 220, width: 220, height: 130 }  // End-of-world gateway
                ]
                }
            },
            2: {
                1: {
                    name: "New Territory",
                    startX: 0,
                    endX: 7000,
                    enemies: [
                        // Desert patrol
                        { type: 0, x: 600, y: 280 },
                        { type: 1, x: 900, y: 280 },
                        { type: 3, x: 1200, y: 280 },  // Sniper
                        { type: 0, x: 1500, y: 280 },
                        { type: 2, x: 1800, y: 280 },  // Tank
                        // Mountain pass assault
                        { type: 1, x: 2400, y: 300 },  // Elevated
                        { type: 0, x: 2600, y: 280 },
                        { type: 1, x: 2800, y: 300 },  // Elevated
                        { type: 3, x: 3000, y: 280 },  // Sniper
                        { type: 2, x: 3200, y: 280 },  // Tank
                        // Heavy resistance
                        { type: 0, x: 3800, y: 280 },
                        { type: 1, x: 4000, y: 280 },
                        { type: 2, x: 4200, y: 280 },  // Tank
                        { type: 3, x: 4300, y: 280 },  // Sniper
                        { type: 0, x: 4500, y: 280 },
                        { type: 1, x: 4700, y: 300 },  // Elevated
                        // Final push
                        { type: 2, x: 5200, y: 280 },  // Tank
                        { type: 0, x: 5400, y: 280 },
                        { type: 1, x: 5600, y: 280 },
                        { type: 3, x: 5700, y: 280 },  // Sniper
                        { type: 2, x: 5900, y: 280 },  // Tank
                        { type: 0, x: 6100, y: 280 },
                        { type: 1, x: 6300, y: 280 },
                        { type: 2, x: 6500, y: 280 },  // Tank
                        { type: 0, x: 6700, y: 280 }
                    ],
                    sandbags: [
                        { x: 1100, y: 280 },
                        { x: 2300, y: 280 },
                        { x: 3700, y: 280 },
                        { x: 4600, y: 280 },
                        { x: 5800, y: 280 }
                    ],
                    platforms: [
                        { x: 1170, y: 300, width: 80, height: 20 },
                        { x: 2370, y: 300, width: 80, height: 20 },
                        { x: 3770, y: 300, width: 80, height: 20 },
                        { x: 4670, y: 300, width: 80, height: 20 },
                        { x: 5870, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1100, y: 260, width: 60 },
                        { x: 2300, y: 260, width: 60 },
                        { x: 3700, y: 260, width: 60 },
                        { x: 4600, y: 260, width: 60 },
                        { x: 5800, y: 260, width: 60 }
                    ],
                    warehouseCrates: [
                        // Organized warehouse clusters like a real storage facility
                        // Cluster 1 - Entry storage
                        { x: 400, y: 280, width: 45 },
                        { x: 450, y: 280, width: 40 },
                        { x: 495, y: 280, width: 45 },
                        // Cluster 2 - Mid-left storage
                        { x: 1300, y: 280, width: 50 },
                        { x: 1355, y: 280, width: 45 },
                        { x: 1405, y: 280, width: 50 },
                        { x: 1460, y: 280, width: 40 },
                        // Cluster 3 - Central storage bay
                        { x: 2500, y: 280, width: 55 },
                        { x: 2560, y: 280, width: 50 },
                        { x: 2615, y: 280, width: 45 },
                        { x: 2665, y: 280, width: 55 },
                        { x: 2725, y: 280, width: 40 },
                        // Cluster 4 - Right storage area
                        { x: 4100, y: 280, width: 50 },
                        { x: 4155, y: 280, width: 45 },
                        { x: 4205, y: 280, width: 50 },
                        // Cluster 5 - Deep storage
                        { x: 5300, y: 280, width: 60 },
                        { x: 5365, y: 280, width: 50 },
                        { x: 5420, y: 280, width: 55 },
                        { x: 5480, y: 280, width: 45 },
                        // Cluster 6 - Final storage bay
                        { x: 6200, y: 280, width: 50 },
                        { x: 6255, y: 280, width: 45 },
                        { x: 6305, y: 280, width: 50 }
                    ],
                    destructibleCrates: [
                        // Crates that can be destroyed for points
                        { x: 800, y: 280, width: 40, points: 50 },
                        { x: 1600, y: 280, width: 40, points: 50 },
                        { x: 2100, y: 280, width: 40, points: 50 },
                        { x: 3500, y: 280, width: 40, points: 50 },
                        { x: 4400, y: 280, width: 40, points: 50 },
                        { x: 5700, y: 280, width: 40, points: 50 },
                        { x: 6200, y: 280, width: 40, points: 50 }
                    ]
                },
                2: {
                    name: "Fortress Assault",
                    startX: 0,
                    endX: 9000,
                    enemies: [
                        // Opening defense line
                        { type: 1, x: 500, y: 300 },   // Elevated
                        { type: 3, x: 700, y: 280 },   // Sniper
                        { type: 0, x: 900, y: 280 },
                        { type: 2, x: 1100, y: 280 },  // Tank
                        { type: 1, x: 1300, y: 300 },  // Elevated
                        // Fortress outer defenses
                        { type: 0, x: 1800, y: 280 },
                        { type: 3, x: 2000, y: 280 },  // Sniper
                        { type: 2, x: 2200, y: 280 },  // Tank
                        { type: 1, x: 2400, y: 300 },  // Elevated
                        { type: 0, x: 2600, y: 280 },
                        { type: 2, x: 2800, y: 280 },  // Tank
                        // Mid-fortress heavy armor
                        { type: 3, x: 3400, y: 280 },  // Sniper
                        { type: 2, x: 3600, y: 280 },  // Tank
                        { type: 1, x: 3800, y: 300 },  // Elevated
                        { type: 2, x: 4000, y: 280 },  // Tank
                        { type: 0, x: 4200, y: 280 },
                        { type: 3, x: 4300, y: 280 },  // Sniper
                        // Inner fortress defenses
                        { type: 2, x: 5000, y: 280 },  // Tank
                        { type: 1, x: 5200, y: 300 },  // Elevated
                        { type: 2, x: 5400, y: 280 },  // Tank
                        { type: 3, x: 5500, y: 280 },  // Sniper
                        { type: 0, x: 5700, y: 280 },
                        { type: 1, x: 5900, y: 280 },
                        // Final fortress push
                        { type: 2, x: 6500, y: 280 },  // Tank
                        { type: 3, x: 6600, y: 280 },  // Sniper
                        { type: 2, x: 6800, y: 280 },  // Tank
                        { type: 1, x: 7000, y: 300 },  // Elevated
                        { type: 0, x: 7200, y: 280 },
                        { type: 2, x: 7400, y: 280 },  // Tank
                        { type: 1, x: 7600, y: 280 },
                        { type: 3, x: 7700, y: 280 },  // Sniper
                        { type: 2, x: 7900, y: 280 },  // Tank
                        { type: 0, x: 8100, y: 280 },
                        { type: 1, x: 8300, y: 280 },
                        { type: 2, x: 8500, y: 280 },  // Tank
                        { type: 0, x: 8700, y: 280 }
                    ],
                    sandbags: [
                        { x: 400, y: 280 },
                        { x: 1200, y: 280 },
                        { x: 1900, y: 280 },
                        { x: 2700, y: 280 },
                        { x: 3700, y: 280 },
                        { x: 4900, y: 280 },
                        { x: 5800, y: 280 },
                        { x: 6900, y: 280 },
                        { x: 8000, y: 280 }
                    ],
                    platforms: [
                        { x: 470, y: 300, width: 80, height: 20 },
                        { x: 1270, y: 300, width: 80, height: 20 },
                        { x: 1970, y: 300, width: 80, height: 20 },
                        { x: 2770, y: 300, width: 80, height: 20 },
                        { x: 3770, y: 300, width: 80, height: 20 },
                        { x: 4970, y: 300, width: 80, height: 20 },
                        { x: 5870, y: 300, width: 80, height: 20 },
                        { x: 6970, y: 300, width: 80, height: 20 },
                        { x: 8070, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 400, y: 260, width: 60 },
                        { x: 1200, y: 260, width: 60 },
                        { x: 1900, y: 260, width: 60 },
                        { x: 2700, y: 260, width: 60 },
                        { x: 3700, y: 260, width: 60 },
                        { x: 4900, y: 260, width: 60 },
                        { x: 5800, y: 260, width: 60 },
                        { x: 6900, y: 260, width: 60 },
                        { x: 8000, y: 260, width: 60 }
                    ],
                    warehouseCrates: [
                        // Heavy fortress warehouse - organized military storage
                        // Fortress Cluster 1 - Entry checkpoint storage
                        { x: 300, y: 280, width: 60 },
                        { x: 365, y: 280, width: 50 },
                        { x: 420, y: 280, width: 55 },
                        // Fortress Cluster 2 - Mid-left armory
                        { x: 1500, y: 280, width: 55 },
                        { x: 1560, y: 280, width: 50 },
                        { x: 1615, y: 280, width: 45 },
                        // Fortress Cluster 3 - Central supply depot
                        { x: 2900, y: 280, width: 45 },
                        { x: 2950, y: 280, width: 50 },
                        { x: 3005, y: 280, width: 55 },
                        { x: 3065, y: 280, width: 45 },
                        // Fortress Cluster 4 - Heavy weapons storage
                        { x: 4600, y: 280, width: 55 },
                        { x: 4660, y: 280, width: 50 },
                        { x: 4715, y: 280, width: 60 },
                        { x: 4780, y: 280, width: 45 },
                        // Fortress Cluster 5 - Communications equipment
                        { x: 6200, y: 280, width: 60 },
                        { x: 6265, y: 280, width: 50 },
                        { x: 6320, y: 280, width: 55 },
                        // Fortress Cluster 6 - Final defense supplies
                        { x: 7800, y: 280, width: 45 },
                        { x: 7850, y: 280, width: 50 },
                        { x: 7905, y: 280, width: 55 },
                        { x: 7965, y: 280, width: 45 }
                    ],
                    destructibleCrates: [
                        // More destructible crates in fortress level
                        { x: 1000, y: 280, width: 40, points: 50 },
                        { x: 1700, y: 280, width: 40, points: 50 },
                        { x: 2500, y: 280, width: 40, points: 50 },
                        { x: 3500, y: 280, width: 40, points: 50 },
                        { x: 4300, y: 280, width: 40, points: 50 },
                        { x: 5100, y: 280, width: 40, points: 50 },
                        { x: 5900, y: 280, width: 40, points: 50 },
                        { x: 6800, y: 280, width: 40, points: 50 },
                        { x: 7500, y: 280, width: 40, points: 50 },
                        { x: 8600, y: 280, width: 40, points: 50 }
                    ]
                },
                3: {
                    name: "The Popcorn Showdown",
                    startX: 0,
                    endX: 11000,
                    enemies: [
                        // Pre-boss gauntlet
                        { type: 2, x: 800, y: 280 },   // Tank
                        { type: 3, x: 900, y: 280 },   // Sniper
                        { type: 1, x: 1100, y: 300 },  // Elevated
                        { type: 2, x: 1300, y: 280 },  // Tank
                        { type: 0, x: 1500, y: 280 },
                        // Elite guard squadron
                        { type: 3, x: 2200, y: 280 },  // Sniper
                        { type: 2, x: 2400, y: 280 },  // Tank
                        { type: 2, x: 2600, y: 280 },  // Tank
                        { type: 1, x: 2800, y: 300 },  // Elevated
                        { type: 3, x: 2900, y: 280 },  // Sniper
                        { type: 0, x: 3100, y: 280 },
                        { type: 1, x: 3300, y: 280 },
                        // Final approach to boss
                        { type: 2, x: 4000, y: 280 },  // Tank
                        { type: 3, x: 4100, y: 280 },  // Sniper
                        { type: 2, x: 4300, y: 280 },  // Tank
                        { type: 1, x: 4500, y: 300 },  // Elevated
                        { type: 0, x: 4700, y: 280 },
                        // Boss encounter area - THE MECH
                        { type: 5, x: 9500, y: 260 }   // Mech Boss - Final underground boss
                    ],
                    sandbags: [
                        { x: 1000, y: 280 },
                        { x: 2100, y: 280 },
                        { x: 2700, y: 280 },
                        { x: 3900, y: 280 },
                        { x: 4400, y: 280 },
                        { x: 8000, y: 280 }
                    ],
                    platforms: [
                        { x: 1070, y: 300, width: 80, height: 20 },
                        { x: 2170, y: 300, width: 80, height: 20 },
                        { x: 2770, y: 300, width: 80, height: 20 },
                        { x: 3970, y: 300, width: 80, height: 20 },
                        { x: 4470, y: 300, width: 80, height: 20 },
                        { x: 8070, y: 300, width: 120, height: 20 }  // Wider platform for boss area
                    ],
                    barbedWire: [
                        { x: 1000, y: 260, width: 60 },
                        { x: 2100, y: 260, width: 60 },
                        { x: 2700, y: 260, width: 60 },
                        { x: 3900, y: 260, width: 60 },
                        { x: 4400, y: 260, width: 60 },
                        { x: 8000, y: 260, width: 100 }  // Longer barbed wire for boss area
                    ],
                    warehouseCrates: [
                        // Boss level warehouse - strategic clusters before boss encounter
                        // Command Cluster 1 - Entry supplies
                        { x: 500, y: 280, width: 50 },
                        { x: 555, y: 280, width: 45 },
                        // Command Cluster 2 - Tactical equipment
                        { x: 1500, y: 280, width: 45 },
                        { x: 1550, y: 280, width: 50 },
                        // Command Cluster 3 - Pre-boss staging area
                        { x: 3200, y: 280, width: 40 },
                        { x: 3245, y: 280, width: 55 },
                        { x: 3305, y: 280, width: 45 },
                        // Command Cluster 4 - Final defensive position (sparse for boss fight)
                        { x: 6000, y: 280, width: 50 },
                        { x: 6055, y: 280, width: 45 }
                    ],
                    destructibleCrates: [
                        // Strategic destructible crates before boss
                        { x: 1200, y: 280, width: 40, points: 75 },  // Higher points for final level
                        { x: 2800, y: 280, width: 40, points: 75 },
                        { x: 4100, y: 280, width: 40, points: 75 },
                        { x: 5200, y: 280, width: 40, points: 75 },
                        { x: 6500, y: 280, width: 40, points: 75 }
                    ]
                }
            },
            3: {
                // World 3 - Construction City. barbedWire entries become concrete barriers,
                // warehouseCrates become cinder block pallets, and platforms are drawn as steel girders.
                // High girders sit at y 195 so the player can walk underneath them.
                1: {
                    name: "Hard Hat Zone",
                    startX: 0,
                    endX: 7500,
                    enemies: [
                        // Site entrance patrol
                        { type: 10, x: 600, y: 280 }, // Construction worker
                        { type: 1, x: 850, y: 280 },
                        { type: 0, x: 1100, y: 280 },
                        { type: 3, x: 1400, y: 280 },  // Sniper
                        { type: 1, x: 1700, y: 300 },  // Elevated behind cover
                        // Foundation pit
                        { type: 10, x: 1950, y: 280 }, // Construction worker
                        { type: 2, x: 2300, y: 280 },  // Tank
                        { type: 0, x: 2600, y: 280 },
                        { type: 1, x: 2850, y: 280 },
                        { type: 3, x: 3150, y: 280 },  // Sniper
                        { type: 6, x: 3500, y: 180 },  // Scaffold tower
                        // Steel yard
                        { type: 10, x: 3950, y: 280 }, // Construction worker
                        { type: 1, x: 4150, y: 280 },
                        { type: 2, x: 4500, y: 280 },  // Tank
                        { type: 0, x: 4800, y: 280 },
                        { type: 3, x: 5100, y: 280 },  // Sniper
                        { type: 1, x: 5300, y: 300 },  // Elevated
                        // Site office
                        { type: 2, x: 5750, y: 280 },  // Tank
                        { type: 10, x: 6000, y: 280 }, // Construction worker
                        { type: 1, x: 6250, y: 280 },
                        { type: 6, x: 6800, y: 180 },  // Scaffold tower - guards level end
                        { type: 0, x: 7150, y: 280 }
                    ],
                    sandbags: [
                        { x: 1600, y: 280 },
                        { x: 3000, y: 280 },
                        { x: 4950, y: 280 },
                        { x: 6100, y: 280 }
                    ],
                    platforms: [
                        { x: 1670, y: 300, width: 80, height: 20 },
                        { x: 3070, y: 300, width: 80, height: 20 },
                        { x: 5020, y: 300, width: 80, height: 20 },
                        { x: 6170, y: 300, width: 80, height: 20 },
                        // Overhead girders
                        { x: 2050, y: 195, width: 150, height: 16 },
                        { x: 4250, y: 195, width: 170, height: 16 },
                        { x: 5450, y: 195, width: 150, height: 16 }
                    ],
                    barbedWire: [
                        { x: 1250, y: 280, width: 70 },
                        { x: 2450, y: 280, width: 70 },
                        { x: 3750, y: 280, width: 70 },
                        { x: 5250, y: 280, width: 70 },
                        { x: 6500, y: 280, width: 70 }
                    ],
                    warehouseCrates: [
                        { x: 400, y: 280, width: 50 },
                        { x: 455, y: 280, width: 45 },
                        { x: 2700, y: 280, width: 50 },
                        { x: 4600, y: 280, width: 55 },
                        { x: 4660, y: 280, width: 45 },
                        { x: 6350, y: 280, width: 50 }
                    ],
                    destructibleCrates: [
                        { x: 900, y: 280, width: 40, points: 75 },
                        { x: 2200, y: 280, width: 40, points: 75 },
                        { x: 3300, y: 280, width: 40, points: 75 },
                        { x: 4400, y: 280, width: 40, points: 75 },
                        { x: 5600, y: 280, width: 40, points: 75 },
                        { x: 6650, y: 280, width: 40, points: 75 }
                    ]
                },
                2: {
                    name: "Skyscraper Skeleton",
                    startX: 0,
                    endX: 9000,
                    enemies: [
                        // Ground floor
                        { type: 1, x: 500, y: 280 },
                        { type: 3, x: 750, y: 280 },   // Sniper
                        { type: 0, x: 1000, y: 280 },
                        { type: 2, x: 1300, y: 280 },  // Tank
                        { type: 1, x: 1550, y: 300 },  // Elevated
                        // Girder maze
                        { type: 10, x: 2000, y: 280 }, // Construction worker
                        { type: 3, x: 2250, y: 280 },  // Sniper
                        { type: 1, x: 2500, y: 280 },
                        { type: 2, x: 2800, y: 280 },  // Tank
                        { type: 6, x: 3300, y: 180 },  // Scaffold tower
                        { type: 0, x: 3700, y: 280 },
                        // Elevator shaft
                        { type: 3, x: 4100, y: 280 },  // Sniper
                        { type: 2, x: 4400, y: 280 },  // Tank
                        { type: 1, x: 4650, y: 300 },  // Elevated
                        { type: 10, x: 4900, y: 280 }, // Construction worker
                        { type: 2, x: 5300, y: 280 },  // Tank
                        // Upper frame
                        { type: 3, x: 5700, y: 280 },  // Sniper
                        { type: 1, x: 5950, y: 280 },
                        { type: 0, x: 6200, y: 280 },
                        { type: 6, x: 6600, y: 180 },  // Scaffold tower
                        { type: 2, x: 7000, y: 280 },  // Tank
                        { type: 3, x: 7300, y: 280 },  // Sniper
                        { type: 1, x: 7600, y: 300 },  // Elevated
                        { type: 10, x: 7900, y: 280 }, // Construction worker
                        { type: 2, x: 8300, y: 280 },  // Tank
                        { type: 0, x: 8650, y: 280 }
                    ],
                    sandbags: [
                        { x: 1450, y: 280 },
                        { x: 3900, y: 280 },
                        { x: 4550, y: 280 },
                        { x: 7500, y: 280 }
                    ],
                    platforms: [
                        { x: 1520, y: 300, width: 80, height: 20 },
                        { x: 3970, y: 300, width: 80, height: 20 },
                        { x: 4620, y: 300, width: 80, height: 20 },
                        { x: 7570, y: 300, width: 80, height: 20 },
                        // Skeleton floors - overhead girders to hop across
                        { x: 1850, y: 195, width: 140, height: 16 },
                        { x: 2100, y: 195, width: 140, height: 16 },
                        { x: 2350, y: 195, width: 140, height: 16 },
                        { x: 5000, y: 195, width: 180, height: 16 },
                        { x: 5800, y: 195, width: 140, height: 16 },
                        { x: 6050, y: 195, width: 140, height: 16 },
                        { x: 8000, y: 195, width: 180, height: 16 }
                    ],
                    barbedWire: [
                        { x: 900, y: 280, width: 70 },
                        { x: 2650, y: 280, width: 70 },
                        { x: 3550, y: 280, width: 70 },
                        { x: 5450, y: 280, width: 70 },
                        { x: 6850, y: 280, width: 70 },
                        { x: 8450, y: 280, width: 70 }
                    ],
                    warehouseCrates: [
                        { x: 300, y: 280, width: 55 },
                        { x: 360, y: 280, width: 50 },
                        { x: 3050, y: 280, width: 50 },
                        { x: 3105, y: 280, width: 45 },
                        { x: 6350, y: 280, width: 55 },
                        { x: 8150, y: 280, width: 50 }
                    ],
                    destructibleCrates: [
                        { x: 1150, y: 280, width: 40, points: 75 },
                        { x: 2900, y: 280, width: 40, points: 75 },
                        { x: 4250, y: 280, width: 40, points: 75 },
                        { x: 5600, y: 280, width: 40, points: 75 },
                        { x: 7150, y: 280, width: 40, points: 75 },
                        { x: 8550, y: 280, width: 40, points: 75 }
                    ]
                },
                3: {
                    name: "Crane Tower Showdown",
                    startX: 0,
                    endX: 11000,
                    enemies: [
                        // Lockdown checkpoint
                        { type: 2, x: 700, y: 280 },   // Tank
                        { type: 3, x: 900, y: 280 },   // Sniper
                        { type: 1, x: 1150, y: 300 },  // Elevated
                        { type: 0, x: 1400, y: 280 },
                        { type: 2, x: 1700, y: 280 },  // Tank
                        // Crane yard
                        { type: 6, x: 2300, y: 180 },  // Scaffold tower
                        { type: 3, x: 2700, y: 280 },  // Sniper
                        { type: 2, x: 2950, y: 280 },  // Tank
                        { type: 1, x: 3200, y: 300 },  // Elevated
                        { type: 10, x: 3450, y: 280 }, // Construction worker
                        { type: 2, x: 3800, y: 280 },  // Tank
                        // Last line before the boss
                        { type: 3, x: 4400, y: 280 },  // Sniper
                        { type: 1, x: 4650, y: 280 },
                        { type: 2, x: 5000, y: 280 },  // Tank
                        { type: 6, x: 5500, y: 180 },  // Scaffold tower
                        { type: 0, x: 6000, y: 280 },
                        { type: 3, x: 6300, y: 280 },  // Sniper
                        { type: 2, x: 6700, y: 280 },  // Tank
                        // Boss encounter at the foot of the great crane
                        { type: 7, x: 9600, y: 170 }   // Artillery truck boss
                    ],
                    sandbags: [
                        { x: 1050, y: 280 },
                        { x: 3100, y: 280 },
                        { x: 6150, y: 280 },
                        { x: 8200, y: 280 }
                    ],
                    platforms: [
                        { x: 1120, y: 300, width: 80, height: 20 },
                        { x: 3170, y: 300, width: 80, height: 20 },
                        { x: 6220, y: 300, width: 80, height: 20 },
                        { x: 8270, y: 300, width: 120, height: 20 },
                        { x: 2000, y: 195, width: 160, height: 16 },
                        { x: 4100, y: 195, width: 160, height: 16 },
                        { x: 7400, y: 195, width: 200, height: 16 },
                        { x: 8700, y: 195, width: 200, height: 16 }
                    ],
                    barbedWire: [
                        { x: 1550, y: 280, width: 70 },
                        { x: 3600, y: 280, width: 70 },
                        { x: 5200, y: 280, width: 70 },
                        { x: 7000, y: 280, width: 100 }
                    ],
                    warehouseCrates: [
                        { x: 450, y: 280, width: 50 },
                        { x: 505, y: 280, width: 45 },
                        { x: 2500, y: 280, width: 55 },
                        { x: 4800, y: 280, width: 50 },
                        { x: 4855, y: 280, width: 45 },
                        { x: 6500, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 1300, y: 280, width: 40, points: 100 },
                        { x: 2850, y: 280, width: 40, points: 100 },
                        { x: 4300, y: 280, width: 40, points: 100 },
                        { x: 5800, y: 280, width: 40, points: 100 },
                        { x: 7800, y: 280, width: 40, points: 100 }
                    ]
                }
            },
            4: {
                // World 4 - The Mountain Range. barbedWire entries become boulders,
                // warehouseCrates become log piles, and platforms are drawn as rocky ledges.
                1: {
                    name: "Foothills",
                    startX: 0,
                    endX: 7500,
                    enemies: [
                        // Trailhead patrol (past the monorail wreck camp)
                        { type: 0, x: 1000, y: 280 },
                        { type: 1, x: 1400, y: 280 },
                        { type: 3, x: 1250, y: 280 },  // Sniper on the ridge
                        { type: 0, x: 1550, y: 280 },
                        { type: 1, x: 1800, y: 300 },  // Elevated
                        { type: 8, x: 2050, y: 280 },  // Shield stickman
                        // Pine forest
                        { type: 2, x: 2300, y: 280 },  // Tank
                        { type: 0, x: 2650, y: 280 },
                        { type: 3, x: 2950, y: 280 },  // Sniper
                        { type: 6, x: 3400, y: 180 },  // Watchtower
                        { type: 1, x: 3850, y: 280 },
                        { type: 8, x: 4050, y: 280 },  // Shield stickman
                        // River crossing
                        { type: 2, x: 4300, y: 280 },  // Tank
                        { type: 0, x: 4650, y: 280 },
                        { type: 1, x: 4900, y: 300 },  // Elevated
                        { type: 3, x: 5250, y: 280 },  // Sniper
                        // Base camp
                        { type: 2, x: 5700, y: 280 },  // Tank
                        { type: 0, x: 6000, y: 280 },
                        { type: 8, x: 6250, y: 280 },  // Shield stickman
                        { type: 6, x: 6600, y: 180 },  // Watchtower - guards level end
                        { type: 1, x: 7100, y: 280 }
                    ],
                    sandbags: [
                        { x: 1700, y: 280 },
                        { x: 3200, y: 280 },
                        { x: 4800, y: 280 },
                        { x: 6100, y: 280 }
                    ],
                    platforms: [
                        { x: 1770, y: 300, width: 80, height: 20 },
                        { x: 3270, y: 300, width: 80, height: 20 },
                        { x: 4870, y: 300, width: 80, height: 20 },
                        { x: 6170, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1100, y: 280, width: 60 },
                        { x: 2500, y: 280, width: 70 },
                        { x: 3700, y: 280, width: 60 },
                        { x: 5450, y: 280, width: 70 },
                        { x: 6400, y: 280, width: 60 }
                    ],
                    warehouseCrates: [
                        { x: 450, y: 280, width: 60 },
                        { x: 2800, y: 280, width: 55 },
                        { x: 4500, y: 280, width: 60 },
                        { x: 6900, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 800, y: 280, width: 40, points: 100 },
                        { x: 2100, y: 280, width: 40, points: 100 },
                        { x: 3550, y: 280, width: 40, points: 100 },
                        { x: 5100, y: 280, width: 40, points: 100 },
                        { x: 6300, y: 280, width: 40, points: 100 }
                    ]
                },
                2: {
                    name: "Snowy Pass",
                    startX: 0,
                    endX: 9000,
                    enemies: [
                        // Avalanche gate
                        { type: 1, x: 550, y: 280 },
                        { type: 3, x: 800, y: 280 },   // Sniper
                        { type: 2, x: 1150, y: 280 },  // Tank
                        { type: 0, x: 1450, y: 280 },
                        { type: 1, x: 1700, y: 300 },  // Elevated
                        { type: 8, x: 1950, y: 280 },  // Shield stickman
                        // Frozen switchbacks
                        { type: 3, x: 2200, y: 280 },  // Sniper
                        { type: 2, x: 2550, y: 280 },  // Tank
                        { type: 0, x: 2850, y: 280 },
                        { type: 6, x: 3300, y: 180 },  // Watchtower
                        { type: 1, x: 3750, y: 280 },
                        { type: 2, x: 4150, y: 280 },  // Tank
                        { type: 8, x: 4400, y: 280 },  // Shield stickman
                        // Ice caves
                        { type: 3, x: 4600, y: 280 },  // Sniper
                        { type: 0, x: 4900, y: 280 },
                        { type: 1, x: 5150, y: 300 },  // Elevated
                        { type: 2, x: 5550, y: 280 },  // Tank
                        { type: 6, x: 6100, y: 180 },  // Watchtower
                        // High pass
                        { type: 3, x: 6700, y: 280 },  // Sniper
                        { type: 2, x: 7100, y: 280 },  // Tank
                        { type: 0, x: 7450, y: 280 },
                        { type: 1, x: 7800, y: 300 },  // Elevated
                        { type: 8, x: 8000, y: 280 },  // Shield stickman
                        { type: 2, x: 8250, y: 280 },  // Tank
                        { type: 0, x: 8650, y: 280 }
                    ],
                    sandbags: [
                        { x: 1600, y: 280 },
                        { x: 3600, y: 280 },
                        { x: 5050, y: 280 },
                        { x: 7700, y: 280 }
                    ],
                    platforms: [
                        { x: 1670, y: 300, width: 80, height: 20 },
                        { x: 3670, y: 300, width: 80, height: 20 },
                        { x: 5120, y: 300, width: 80, height: 20 },
                        { x: 7770, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1000, y: 280, width: 70 },
                        { x: 2400, y: 280, width: 60 },
                        { x: 4000, y: 280, width: 70 },
                        { x: 5800, y: 280, width: 60 },
                        { x: 6950, y: 280, width: 70 },
                        { x: 8450, y: 280, width: 60 }
                    ],
                    warehouseCrates: [
                        { x: 300, y: 280, width: 60 },
                        { x: 3050, y: 280, width: 55 },
                        { x: 6400, y: 280, width: 60 },
                        { x: 8050, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 1300, y: 280, width: 40, points: 100 },
                        { x: 2700, y: 280, width: 40, points: 100 },
                        { x: 4400, y: 280, width: 40, points: 100 },
                        { x: 5950, y: 280, width: 40, points: 100 },
                        { x: 7300, y: 280, width: 40, points: 100 },
                        { x: 8600, y: 280, width: 40, points: 100 }
                    ]
                },
                3: {
                    name: "The Summit",
                    startX: 0,
                    endX: 11000,
                    enemies: [
                        // Climb to the summit
                        { type: 2, x: 700, y: 280 },   // Tank
                        { type: 3, x: 950, y: 280 },   // Sniper
                        { type: 1, x: 1200, y: 300 },  // Elevated
                        { type: 0, x: 1450, y: 280 },
                        { type: 8, x: 1600, y: 280 },  // Shield stickman
                        { type: 2, x: 1800, y: 280 },  // Tank
                        { type: 6, x: 2400, y: 180 },  // Watchtower
                        { type: 3, x: 2850, y: 280 },  // Sniper
                        { type: 2, x: 3150, y: 280 },  // Tank
                        { type: 1, x: 3450, y: 300 },  // Elevated
                        { type: 0, x: 3750, y: 280 },
                        { type: 8, x: 4000, y: 280 },  // Shield stickman
                        // Summit fortress
                        { type: 2, x: 4300, y: 280 },  // Tank
                        { type: 3, x: 4600, y: 280 },  // Sniper
                        { type: 6, x: 5200, y: 180 },  // Watchtower
                        { type: 1, x: 5700, y: 280 },
                        { type: 2, x: 6100, y: 280 },  // Tank
                        { type: 3, x: 6500, y: 280 },  // Sniper
                        { type: 0, x: 6900, y: 280 },
                        { type: 8, x: 7200, y: 280 },  // Shield stickman
                        // Boss on the mountaintop
                        { type: 9, x: 9600, y: 280 }   // Boss: cyborg yeti
                    ],
                    sandbags: [
                        { x: 1100, y: 280 },
                        { x: 3350, y: 280 },
                        { x: 6400, y: 280 },
                        { x: 8200, y: 280 }
                    ],
                    platforms: [
                        { x: 1170, y: 300, width: 80, height: 20 },
                        { x: 3420, y: 300, width: 80, height: 20 },
                        { x: 6470, y: 300, width: 80, height: 20 },
                        { x: 8270, y: 300, width: 120, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1600, y: 280, width: 70 },
                        { x: 3600, y: 280, width: 60 },
                        { x: 5450, y: 280, width: 70 },
                        { x: 7200, y: 280, width: 90 }
                    ],
                    warehouseCrates: [
                        { x: 450, y: 280, width: 60 },
                        { x: 2600, y: 280, width: 55 },
                        { x: 4900, y: 280, width: 60 },
                        { x: 6700, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 1350, y: 280, width: 40, points: 125 },
                        { x: 3000, y: 280, width: 40, points: 125 },
                        { x: 4450, y: 280, width: 40, points: 125 },
                        { x: 5950, y: 280, width: 40, points: 125 },
                        { x: 7600, y: 280, width: 40, points: 125 }
                    ]
                }
            },
            5: {
                // World 5 - The Nuclear Base. Starter level: the fenced perimeter around the reactor.
                1: {
                    name: "Reactor Perimeter",
                    startX: 0,
                    endX: 7500,
                    enemies: [
                        // Main gate
                        { type: 0, x: 700, y: 280 },
                        { type: 1, x: 950, y: 280 },
                        { type: 11, x: 1250, y: 280 },  // Hazmat trooper
                        { type: 11, x: 1400, y: 280 }, // Hazmat trooper
                        { type: 3, x: 1550, y: 280 },  // Sniper
                        { type: 1, x: 1800, y: 300 },  // Elevated
                        // Fuel depot
                        { type: 2, x: 2250, y: 280 },  // Tank
                        { type: 0, x: 2550, y: 280 },
                        { type: 11, x: 2800, y: 280 },  // Hazmat trooper
                        { type: 11, x: 2950, y: 280 }, // Hazmat trooper
                        { type: 6, x: 3300, y: 180 },  // Guard tower
                        { type: 1, x: 3750, y: 280 },
                        // Cooling towers
                        { type: 3, x: 4150, y: 280 },  // Sniper
                        { type: 2, x: 4500, y: 280 },  // Tank
                        { type: 11, x: 4850, y: 280 },  // Hazmat trooper
                        { type: 0, x: 5100, y: 280 },
                        { type: 11, x: 5200, y: 280 }, // Hazmat trooper
                        { type: 1, x: 5300, y: 300 },  // Elevated
                        // Reactor doors
                        { type: 2, x: 5800, y: 280 },  // Tank
                        { type: 11, x: 6150, y: 280 },  // Hazmat trooper
                        { type: 11, x: 6350, y: 280 }, // Hazmat trooper
                        { type: 6, x: 6650, y: 180 },  // Guard tower
                        { type: 0, x: 7100, y: 280 }
                    ],
                    sandbags: [
                        { x: 1700, y: 280 },
                        { x: 3650, y: 280 },
                        { x: 5200, y: 280 },
                        { x: 6400, y: 280 }
                    ],
                    platforms: [
                        { x: 1770, y: 300, width: 80, height: 20 },
                        { x: 5270, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1100, y: 280, width: 70 },
                        { x: 2650, y: 280, width: 60 },
                        { x: 4000, y: 280, width: 70 },
                        { x: 5600, y: 280, width: 60 },
                        { x: 6900, y: 280, width: 70 }
                    ],
                    warehouseCrates: [
                        { x: 2050, y: 280, width: 60 },
                        { x: 4350, y: 280, width: 55 },
                        { x: 6000, y: 280, width: 60 }
                    ],
                    destructibleCrates: [
                        { x: 850, y: 280, width: 40, points: 150 },
                        { x: 2400, y: 280, width: 40, points: 150 },
                        { x: 3550, y: 280, width: 40, points: 150 },
                        { x: 5450, y: 280, width: 40, points: 150 },
                        { x: 7000, y: 280, width: 40, points: 150 }
                    ]
                },
                2: {
                    name: "Cooling Towers",
                    startX: 0,
                    endX: 9000,
                    enemies: [
                        // Tower yard
                        { type: 1, x: 600, y: 280 },
                        { type: 11, x: 850, y: 280 },  // Hazmat trooper
                        { type: 3, x: 1150, y: 280 },  // Sniper
                        { type: 11, x: 1450, y: 280 },  // Hazmat trooper
                        { type: 1, x: 1700, y: 300 },  // Elevated
                        // Steam vents
                        { type: 2, x: 2150, y: 280 },  // Tank
                        { type: 11, x: 2450, y: 280 }, // Hazmat trooper
                        { type: 0, x: 2700, y: 280 },
                        { type: 6, x: 3200, y: 180 },  // Guard tower
                        { type: 11, x: 3650, y: 280 },  // Hazmat trooper
                        { type: 11, x: 3900, y: 280 }, // Hazmat trooper
                        // Pump station
                        { type: 3, x: 4300, y: 280 },  // Sniper
                        { type: 2, x: 4650, y: 280 },  // Tank
                        { type: 1, x: 5000, y: 300 },  // Elevated
                        { type: 11, x: 5300, y: 280 },  // Hazmat trooper
                        { type: 11, x: 5550, y: 280 }, // Hazmat trooper
                        // Cooling tower base
                        { type: 6, x: 6100, y: 180 },  // Guard tower
                        { type: 2, x: 6600, y: 280 },  // Tank
                        { type: 11, x: 6950, y: 280 }, // Hazmat trooper
                        { type: 3, x: 7300, y: 280 },  // Sniper
                        { type: 11, x: 7700, y: 280 },  // Hazmat trooper
                        { type: 0, x: 8100, y: 280 },
                        { type: 11, x: 8500, y: 280 }  // Hazmat trooper
                    ],
                    sandbags: [
                        { x: 1600, y: 280 },
                        { x: 3500, y: 280 },
                        { x: 4900, y: 280 },
                        { x: 7150, y: 280 }
                    ],
                    platforms: [
                        { x: 1670, y: 300, width: 80, height: 20 },
                        { x: 4970, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1000, y: 280, width: 60 },
                        { x: 2300, y: 280, width: 70 },
                        { x: 3400, y: 280, width: 60 },
                        { x: 5800, y: 280, width: 70 },
                        { x: 7500, y: 280, width: 60 },
                        { x: 8300, y: 280, width: 70 }
                    ],
                    warehouseCrates: [
                        { x: 1900, y: 280, width: 60 },
                        { x: 4100, y: 280, width: 55 },
                        { x: 6350, y: 280, width: 60 },
                        { x: 7900, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 700, y: 280, width: 40, points: 150 },
                        { x: 2550, y: 280, width: 40, points: 150 },
                        { x: 4450, y: 280, width: 40, points: 150 },
                        { x: 6000, y: 280, width: 40, points: 150 },
                        { x: 8000, y: 280, width: 40, points: 150 }
                    ]
                },
                3: {
                    name: "Reactor Core",
                    startX: 0,
                    endX: 11500,
                    enemies: [
                        // Blast doors
                        { type: 11, x: 650, y: 280 },   // Hazmat trooper
                        { type: 11, x: 900, y: 280 },  // Hazmat trooper
                        { type: 2, x: 1250, y: 280 },  // Tank
                        { type: 3, x: 1550, y: 280 },  // Sniper
                        { type: 1, x: 1800, y: 300 },  // Elevated
                        // Control room
                        { type: 11, x: 2200, y: 280 }, // Hazmat trooper
                        { type: 11, x: 2450, y: 280 },  // Hazmat trooper
                        { type: 6, x: 2900, y: 180 },  // Guard tower
                        { type: 2, x: 3350, y: 280 },  // Tank
                        { type: 11, x: 3700, y: 280 }, // Hazmat trooper
                        { type: 0, x: 3950, y: 280 },
                        // Coolant pipes
                        { type: 3, x: 4350, y: 280 },  // Sniper
                        { type: 11, x: 4650, y: 280 },  // Hazmat trooper
                        { type: 11, x: 4900, y: 280 }, // Hazmat trooper
                        { type: 1, x: 5200, y: 300 },  // Elevated
                        { type: 2, x: 5600, y: 280 },  // Tank
                        // Reactor hall
                        { type: 6, x: 6200, y: 180 },  // Guard tower
                        { type: 11, x: 6650, y: 280 }, // Hazmat trooper
                        { type: 11, x: 6950, y: 280 },  // Hazmat trooper
                        { type: 2, x: 7350, y: 280 },  // Tank
                        { type: 3, x: 7700, y: 280 },  // Sniper
                        { type: 11, x: 8050, y: 280 }, // Hazmat trooper
                        { type: 11, x: 8400, y: 280 },  // Hazmat trooper
                        { type: 6, x: 8900, y: 180 },  // Guard tower - last stand before the core
                        { type: 11, x: 9400, y: 280 }, // Hazmat trooper
                        { type: 11, x: 9750, y: 280 },  // Hazmat trooper
                        // Boss in the reactor chamber
                        { type: 12, x: 10700, y: 280 } // Boss: Reactor Titan
                    ],
                    sandbags: [
                        { x: 1700, y: 280 },
                        { x: 3800, y: 280 },
                        { x: 5100, y: 280 },
                        { x: 7550, y: 280 },
                        { x: 9200, y: 280 }
                    ],
                    platforms: [
                        { x: 1770, y: 300, width: 80, height: 20 },
                        { x: 5170, y: 300, width: 80, height: 20 }
                    ],
                    barbedWire: [
                        { x: 1100, y: 280, width: 70 },
                        { x: 2650, y: 280, width: 60 },
                        { x: 4150, y: 280, width: 70 },
                        { x: 5900, y: 280, width: 60 },
                        { x: 7150, y: 280, width: 70 },
                        { x: 8650, y: 280, width: 60 },
                        { x: 9950, y: 280, width: 70 }
                    ],
                    warehouseCrates: [
                        { x: 2050, y: 280, width: 60 },
                        { x: 4500, y: 280, width: 55 },
                        { x: 6450, y: 280, width: 60 },
                        { x: 8250, y: 280, width: 55 }
                    ],
                    destructibleCrates: [
                        { x: 800, y: 280, width: 40, points: 175 },
                        { x: 2750, y: 280, width: 40, points: 175 },
                        { x: 4800, y: 280, width: 40, points: 175 },
                        { x: 6800, y: 280, width: 40, points: 175 },
                        { x: 8800, y: 280, width: 40, points: 175 },
                        { x: 9900, y: 280, width: 40, points: 175 }
                    ]
                }
            }
        };
    }
    
    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.monorailCrew = null;
        this.currentLevelData = this.levelData[this.currentWorld][levelNumber];
        this.levelSpawnIndex = 0;
        this.levelComplete = false;
        
        if (!this.currentLevelData) {
            // Check if we should move to next world or victory
            if (this.levelData[this.currentWorld + 1]) {
                // Move to next world
                this.currentWorld++;
                this.currentLevel = 1;
                this.currentLevelData = this.levelData[this.currentWorld][1];
            } else {
                // No more worlds - victory!
                this.stopGameplayMusic();
                this.stopBossMusic();
                this.gameState = 'victory';
                return;
            }
        }
        
        // Make sure enemies array exists and sort by x position for proper spawning order
        if (this.currentLevelData.enemies && this.currentLevelData.enemies.length > 0) {
            this.currentLevelData.enemies.sort((a, b) => a.x - b.x);
        }
        
        // Clear existing enemies, sandbags, platforms, and barbed wire
        this.enemies = [];
        this.sandbags = [];
        this.platforms = [];
        this.barbedWire = [];
        this.woodenCrates = [];
        this.warehouseCrates = [];
        this.destructibleCrates = [];
        this.bunkers = [];
        this.artilleryShells = [];
        
        // Spawn sandbags for this level
        if (this.currentLevelData.sandbags) {
            for (const sandbagData of this.currentLevelData.sandbags) {
                this.sandbags.push(new Sandbag(sandbagData.x, sandbagData.y));
            }
        }
        
        // Spawn platforms for this level
        if (this.currentLevelData.platforms) {
            for (const platformData of this.currentLevelData.platforms) {
                const platform = new Platform(platformData.x, platformData.y, platformData.width, platformData.height);
                if (this.currentWorld === 3) platform.style = 'girder';
                if (this.currentWorld === 4) platform.style = 'rock';
                this.platforms.push(platform);
            }
        }
        
        // Spawn barbed wire for World 1, wooden crates for World 2
        if (this.currentLevelData.barbedWire) {
            for (const wireData of this.currentLevelData.barbedWire) {
                if (this.currentWorld === 2) {
                    // Use wooden crates instead of barbed wire for World 2
                    // Ground level is 320, crate height is 40, so crate Y should be 280
                    this.woodenCrates.push(new WoodenCrate(wireData.x, 280, wireData.width));
                } else if (this.currentWorld === 3) {
                    // Concrete jersey barriers for World 3 (same solid collision as crates)
                    this.woodenCrates.push(new ConcreteBarrier(wireData.x, 280, wireData.width));
                } else if (this.currentWorld === 4) {
                    // Mountain boulders for World 4
                    this.woodenCrates.push(new Boulder(wireData.x, 280, wireData.width));
                } else {
                    // Use barbed wire for World 1
                    this.barbedWire.push(new BarbedWire(wireData.x, wireData.y, wireData.width));
                }
            }
        }

        // Spawn warehouse crates (for atmosphere in World 2)
        if (this.currentLevelData.warehouseCrates) {
            for (const crateData of this.currentLevelData.warehouseCrates) {
                // Ground level is 320, crate height is 40, so crate Y should be 280
                const CrateClass = this.currentWorld === 3 ? CinderBlockPallet : this.currentWorld === 4 ? LogPile : WoodenCrate;
                this.warehouseCrates.push(new CrateClass(crateData.x, 280, crateData.width));
            }
        }

        // Spawn destructible crates (for points in World 2)
        if (this.currentLevelData.destructibleCrates) {
            for (const crateData of this.currentLevelData.destructibleCrates) {
                // Ground level is 320, crate height is 40, so crate Y should be 280
                this.destructibleCrates.push(new DestructibleCrate(crateData.x, 280, crateData.width, crateData.points));
            }
        }

        // Spawn bunkers (end-of-world transition structures)
        if (this.currentLevelData.bunkers) {
            for (const b of this.currentLevelData.bunkers) {
                this.bunkers.push(new Bunker(b.x, b.y, b.width, b.height));
            }
        }

        // Reset camera to level start
        this.camera.x = this.currentLevelData.startX;
        
        // Reset player position to level start
        this.player.x = this.currentLevelData.startX + 100; // Start 100px into the level  
        this.player.y = 220; // Reset to ground level
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        // Debug output for custom levels
        if (levelNumber === 'custom') {
            console.log('Starting custom level with', this.currentLevelData.enemies.length, 'enemies');
            console.log('Level data:', this.currentLevelData);
        }
    }
    
    updateLevelSpawning() {
        if (!this.currentLevelData || this.levelComplete) return;
        
        // Make sure we have enemies to spawn
        if (!this.currentLevelData.enemies || this.currentLevelData.enemies.length === 0) {
            return;
        }
        
        // Spawn enemies that are now in view range, but only ahead of the player
        const spawnRange = this.camera.x + this.canvas.width + 200; // Spawn enemies 200px ahead of screen
        const playerX = this.player.x;
        
        for (let i = this.levelSpawnIndex; i < this.currentLevelData.enemies.length; i++) {
            const enemy = this.currentLevelData.enemies[i];
            
            // Only spawn enemies that are ahead of the player and in view range
            if (enemy.x > playerX && enemy.x <= spawnRange) {
                // Check if this is the boss - trigger cutscene
                if (isBossType(enemy.type) && !this.bossCutsceneActive) {
                    this.triggerBossCutscene(enemy.type);
                    return; // Don't spawn the boss yet, wait for cutscene to finish
                }
                
                // Spawn this enemy
                console.log('Spawning enemy type', enemy.type, 'at', enemy.x, enemy.y);
                const newEnemy = new Enemy(enemy.x, enemy.y, enemy.type, this.assets);
                this.enemies.push(newEnemy);
                // Towers spawn with 2 soldier enemies mounted on top
                if (enemy.type === 6) {
                    const s1 = new Enemy(newEnemy.x, newEnemy.y, 0, this.assets); // soldier_1
                    s1.mountedTower = newEnemy;
                    s1.mountOffsetX = -38;
                    this.enemies.push(s1);
                    const s2 = new Enemy(newEnemy.x, newEnemy.y, 1, this.assets); // soldier_2
                    s2.mountedTower = newEnemy;
                    s2.mountOffsetX = 38;
                    this.enemies.push(s2);
                }
                this.levelSpawnIndex++;
            } else if (enemy.x <= playerX) {
                // Skip enemies behind the player
                this.levelSpawnIndex++;
            } else {
                // Enemies are sorted by x position, so we can break here
                break;
            }
        }
        
        // Check if level is complete
        const playerReachedEnd = this.player.x >= this.currentLevelData.endX;
        const allEnemiesSpawned = this.levelSpawnIndex >= this.currentLevelData.enemies.length;
        const allEnemiesDefeated = this.enemies.length === 0;
        
        if (playerReachedEnd && allEnemiesSpawned && allEnemiesDefeated) {
            this.levelComplete = true;
            this.gameState = 'levelComplete';
            this.levelCompleteTime = Date.now();
            this.nextLevel = this.currentLevel + 1;
        }
    }
    
    // Force field walls at both ends of the level - right wall sits a little past endX
    // so the player can still reach the finish line and trigger level completion.
    // Left wall is inset so it's fully on screen at the level start (camera.x = startX)
    getForceFieldBounds() {
        if (!this.currentLevelData) return null;
        return {
            left: this.currentLevelData.startX + 30,
            right: this.currentLevelData.endX + 250
        };
    }

    applyForceFields() {
        const bounds = this.getForceFieldBounds();
        if (!bounds) return;

        if (this.player.x < bounds.left) {
            this.player.x = bounds.left;
            this.player.velocityX = 0;
            this.forceFieldHit = { side: 'left', time: Date.now() };
        } else if (this.player.x + this.player.width > bounds.right) {
            this.player.x = bounds.right - this.player.width;
            this.player.velocityX = 0;
            this.forceFieldHit = { side: 'right', time: Date.now() };
        }
    }

    renderForceFields() {
        const bounds = this.getForceFieldBounds();
        if (!bounds) return;

        const ctx = this.ctx;
        const t = Date.now();
        const height = this.canvas.height;
        const viewLeft = this.camera.x - 100;
        const viewRight = this.camera.x + this.canvas.width + 100;

        for (const side of ['left', 'right']) {
            const wallX = bounds[side];
            if (wallX < viewLeft || wallX > viewRight) continue;

            // Brighter flash for a moment after the player bumps into it
            const hit = this.forceFieldHit && this.forceFieldHit.side === side ? this.forceFieldHit : null;
            const flash = hit ? Math.max(0, 1 - (t - hit.time) / 400) : 0;
            const pulse = 0.5 + 0.5 * Math.sin(t * 0.005);
            const glowWidth = 60;
            // Glow extends toward the playable side
            const dir = side === 'left' ? 1 : -1;

            ctx.save();

            // Soft glow fading into the playfield
            const grad = ctx.createLinearGradient(wallX, 0, wallX + dir * glowWidth, 0);
            grad.addColorStop(0, `rgba(80, 200, 255, ${0.5 + 0.2 * pulse + 0.3 * flash})`);
            grad.addColorStop(1, 'rgba(80, 200, 255, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(Math.min(wallX, wallX + dir * glowWidth), 0, glowWidth, height);

            // Hex-ish energy grid scrolling upward
            ctx.strokeStyle = `rgba(150, 230, 255, ${0.25 + 0.2 * pulse + 0.5 * flash})`;
            ctx.lineWidth = 1;
            const cell = 24;
            const scroll = (t * 0.03) % cell;
            for (let y = -cell + scroll; y < height + cell; y += cell) {
                ctx.beginPath();
                ctx.moveTo(wallX, y);
                ctx.lineTo(wallX + dir * 12, y + cell / 2);
                ctx.lineTo(wallX, y + cell);
                ctx.stroke();
            }

            // Core beam
            ctx.shadowColor = 'rgba(80, 200, 255, 1)';
            ctx.shadowBlur = 15 + 10 * pulse + 20 * flash;
            ctx.strokeStyle = `rgba(200, 245, 255, ${0.7 + 0.3 * pulse})`;
            ctx.lineWidth = 4 + 3 * flash;
            ctx.beginPath();
            ctx.moveTo(wallX, 0);
            ctx.lineTo(wallX, height);
            ctx.stroke();

            // Emitter posts at the base and top
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#334';
            ctx.fillRect(wallX - 8, 320, 16, 30);
            ctx.fillStyle = `rgba(120, 220, 255, ${0.8 + 0.2 * pulse})`;
            ctx.fillRect(wallX - 4, 316, 8, 6);

            ctx.restore();
        }
    }

    setupEventListeners() {
        // Go quiet when the tab is hidden, so a game left open in another tab never plays over this one.
        // The music watchdogs in update()/render() start the right track again once the tab is visible.
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) return;
            this.stopBossMusic();
            this.stopGameplayMusic();
            this.stopTitleMusic();
        });

        window.addEventListener('keydown', (e) => {
            // Handle initial entry mode
            if (this.enteringInitials) {
                this.handleInitialEntry(e);
                return;
            }
            
            // Handle different game states
            if (this.gameState === 'title') {
                // Browsers keep the page silent until the first key or click, so on desktop the
                // first press just turns the sound on and starts the title tune
                const worldJump = isLocalPlay() && ['1', '2', '3', '4', 't', 'T'].includes(e.key);
                if (!this.audioUnlocked && !worldJump && !this.isMobileDevice()) {
                    this.unlockAudio().then(() => this.startTitleMusic()).catch(() => {});
                    e.preventDefault();
                    return;
                }
                if (e.key === ' ' || e.key === 'Enter') {
                    this.unlockAudio();
                    this.startStory();
                    e.preventDefault();
                } else if (isLocalPlay() && ['1', '2', '3', '4'].includes(e.key) && this.levelData[Number(e.key)]) {
                    // Local testing shortcut: jump straight into a world's first level, skipping the story
                    this.unlockAudio();
                    this.stopTitleMusic();
                    this.currentWorld = Number(e.key);
                    this.startGame();
                    e.preventDefault();
                } else if (isLocalPlay() && (e.key === 't' || e.key === 'T')) {
                    // Local testing shortcut: jump straight to the World 3 -> 4 train escape scene
                    this.unlockAudio();
                    this.stopTitleMusic();
                    this.currentWorld = 4;
                    this.startGame();
                    this.startTrainIntro();
                    e.preventDefault();
                } else if (e.key === 't' || e.key === 'T') {
                    // Test sound (for debugging)
                    this.unlockAudio().then(() => {
                        setTimeout(() => this.playTestSound(), 100);
                    });
                    e.preventDefault();
                }
                return;
            } else if (this.gameState === 'story') {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
                    this.nextStorySlide();
                    e.preventDefault();
                }
            } else if (this.gameState === 'heliIntro') {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    this.endHeliIntro();
                    e.preventDefault();
                }
            } else if (this.gameState === 'bunkerIntro') {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    this.skipBunkerIntro();
                    e.preventDefault();
                }
            } else if (this.gameState === 'trainIntro') {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    this.skipTrainIntro();
                    e.preventDefault();
                }
            } else if (this.gameState === 'campIntro') {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    this.skipCampIntro();
                    e.preventDefault();
                }
            } else if (this.gameState === 'bossCutscene') {
                // Allow skipping cutscene
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    this.endBossCutscene();
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft') {
                    this.previousStorySlide();
                    e.preventDefault();
                } else if (e.key === 'Escape') {
                    this.returnToTitle();
                    e.preventDefault();
                }
                return;
            }
            
            if (this.gameState === 'levelBuilder') {
                // Level builder controls
                if (e.key >= '1' && e.key <= '3') {
                    this.levelBuilder.selectedEnemyType = parseInt(e.key) - 1;
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft') {
                    this.levelBuilder.cameraX = Math.max(0, this.levelBuilder.cameraX - 100);
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    this.levelBuilder.cameraX = Math.min(this.levelBuilder.mapWidth - this.canvas.width, this.levelBuilder.cameraX + 100);
                    e.preventDefault();
                } else if (e.key === 'g' || e.key === 'G') {
                    this.levelBuilder.showGrid = !this.levelBuilder.showGrid;
                    e.preventDefault();
                } else if (e.key === 'Enter') {
                    this.testCustomLevel();
                    e.preventDefault();
                } else if (e.key === 's' || e.key === 'S') {
                    this.saveCustomLevel();
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
            
            // Handle restart from game over or victory
            if (e.key === 'r' || e.key === 'R') {
                if (this.gameState === 'gameOver' || this.gameState === 'victory') {
                    this.restart();
                }
            }
            
            // Handle level complete screen
            if (e.key === ' ' || e.key === 'Enter') {
                if (this.gameState === 'levelComplete') {
                    this.proceedToNextLevel();
                }
            }
            
            // Return to title screen
            if (e.key === 'Escape') {
                if (this.gameState === 'gameOver' || this.gameState === 'victory' || this.gameState === 'levelBuilder' || this.gameState === 'levelComplete') {
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
        // Create AudioContext in direct response to user interaction
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                this.audioUnlocked = true;
                return;
            }
        }
        
        // Resume AudioContext - this is critical for iOS Safari
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.playTestSound();
                this.audioUnlocked = true;
            });
        } else {
            this.playTestSound();
            this.audioUnlocked = true;
        }
    }
    
    playTestSound() {
        if (!this.audioContext || this.audioContext.state !== 'running') return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (e) {
            // Failed to play test sound
        }
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
                
                // Check if tap is on audio button (canvas coords: x: 580-780, y: 180-220)
                if (touchX >= 580 && touchX <= 780 && touchY >= 180 && touchY <= 220) {
                    this.mobileAudioUnlock();
                    return; // Don't start game, just enable audio
                }
            }
            
            // Start story - audio will be unlocked on first interaction anyway  
            this.startStory();
        } else if (this.gameState === 'story') {
            this.nextStorySlide();
        } else if (this.gameState === 'heliIntro') {
            this.endHeliIntro();
        } else if (this.gameState === 'bunkerIntro') {
            this.skipBunkerIntro();
        } else if (this.gameState === 'trainIntro') {
            this.skipTrainIntro();
        } else if (this.gameState === 'campIntro') {
            this.skipCampIntro();
        } else if (this.gameState === 'gameOver' && !this.enteringInitials) {
            this.returnToTitle();
        } else if (this.gameState === 'levelComplete') {
            this.proceedToNextLevel();
        } else if (this.gameState === 'levelBuilder') {
            this.handleLevelBuilderTouch(e);
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
                // Audio button bounds: x: 580-780, y: 180-220
                if (canvasX >= 580 && canvasX <= 780 && canvasY >= 180 && canvasY <= 220) {
                    this.mobileAudioUnlock();
                    return; // Don't start game
                }
            }
            
            // First click on desktop only turns the sound on (the browser blocks it until then)
            if (!isMobile && !this.audioUnlocked) {
                this.unlockAudio().then(() => this.startTitleMusic()).catch(() => {});
                return;
            }
            
            // Regular click - start story
            this.unlockAudio().then(() => {
                this.startStory();
            }).catch(() => {
                this.startStory(); // Start anyway if audio fails
            });
        } else if (this.gameState === 'story') {
            this.nextStorySlide();
        } else if (this.gameState === 'heliIntro') {
            this.endHeliIntro();
        } else if (this.gameState === 'bunkerIntro') {
            this.skipBunkerIntro();
        } else if (this.gameState === 'trainIntro') {
            this.skipTrainIntro();
        } else if (this.gameState === 'campIntro') {
            this.skipCampIntro();
        } else if (this.gameState === 'gameOver' && !this.enteringInitials) {
            this.returnToTitle();
        } else if (this.gameState === 'levelComplete') {
            this.proceedToNextLevel();
        } else if (this.gameState === 'levelBuilder') {
            this.handleLevelBuilderClick(e);
        }
    }
    
    update() {
        // Update story animations
        if (this.gameState === 'story') {
            this.storyTime += 0.016; // ~60fps
            return;
        }
        
        if (this.gameState !== 'playing') return;
        
        this.player.update(this.keys);
        
        // Check player collision with sandbags
        for (let sandbag of this.sandbags) {
            if (this.checkCollision(this.player, sandbag)) {
                // Check if player is landing on top (from above)
                const playerBottom = this.player.y + this.player.height;
                const sandbagTop = sandbag.y;
                const playerWasAbove = playerBottom - this.player.velocityY <= sandbagTop;
                
                if (playerWasAbove && this.player.velocityY > 0) {
                    // Player landing on top of sandbag
                    this.player.y = sandbag.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                } else {
                    // Side collision - push player back
                    if (this.player.x < sandbag.x) {
                        // Player approaching from left, push left
                        this.player.x = sandbag.x - this.player.width;
                    } else {
                        // Player approaching from right, push right  
                        this.player.x = sandbag.x + sandbag.width;
                    }
                }
            }
        }

        // Check player collision with wooden crates (same logic as sandbags)
        for (let crate of this.woodenCrates) {
            if (this.checkCollision(this.player, crate)) {
                // Check if player is landing on top (from above)
                const playerBottom = this.player.y + this.player.height;
                const crateTop = crate.y;
                const playerWasAbove = playerBottom - this.player.velocityY <= crateTop;

                if (playerWasAbove && this.player.velocityY > 0) {
                    // Player landing on top of crate
                    this.player.y = crate.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                } else {
                    // Side collision - push player back
                    if (this.player.x < crate.x) {
                        // Player approaching from left, push left
                        this.player.x = crate.x - this.player.width;
                    } else {
                        // Player approaching from right, push right
                        this.player.x = crate.x + crate.width;
                    }
                }
            }
        }

        // Check player collision with warehouse crates (same logic as sandbags)
        for (let crate of this.warehouseCrates) {
            if (this.checkCollision(this.player, crate)) {
                // Check if player is landing on top (from above)
                const playerBottom = this.player.y + this.player.height;
                const crateTop = crate.y;
                const playerWasAbove = playerBottom - this.player.velocityY <= crateTop;

                if (playerWasAbove && this.player.velocityY > 0) {
                    // Player landing on top of crate
                    this.player.y = crate.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                } else {
                    // Side collision - push player back
                    if (this.player.x < crate.x) {
                        // Player approaching from left, push left
                        this.player.x = crate.x - this.player.width;
                    } else {
                        // Player approaching from right, push right
                        this.player.x = crate.x + crate.width;
                    }
                }
            }
        }

        // Check player collision with platforms (same logic)
        for (let platform of this.platforms) {
            if (this.checkCollision(this.player, platform)) {
                const playerBottom = this.player.y + this.player.height;
                const platformTop = platform.y;
                const playerWasAbove = playerBottom - this.player.velocityY <= platformTop;
                
                if (playerWasAbove && this.player.velocityY > 0) {
                    // Player landing on top of platform
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                } else {
                    // Side collision - push player back
                    if (this.player.x < platform.x) {
                        this.player.x = platform.x - this.player.width;
                    } else {
                        this.player.x = platform.x + platform.width;
                    }
                }
            }
        }
        
        // Keep player inside the level's force field barriers
        this.applyForceFields();

        // Objective: reach the crashed helicopter
        this.checkHeliWreck();

        // Tofu's friends at the World 4 monorail wreck fire on nearby enemies
        this.updateMonorailCrew();

        // Handle mobile shooting (simulate X key press)
        if (this.keys['x']) {
            if (this.player.shoot(this.bullets)) {
                this.playPlayerShoot();
            }
        }
        
        // Check for game over
        if (this.player.health <= 0) {
            if (this.gameState === 'playing') {
                // Switch state first so stopBossMusic does not restart the world music
                this.gameState = 'gameOver';
                this.stopGameplayMusic();
                this.stopBossMusic();
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
                continue;
            }
            
            // Check bullet-sandbag collisions
            let bulletDestroyed = false;
            for (let j = 0; j < this.sandbags.length; j++) {
                if (this.sandbags[j].collidesWith(this.bullets[i])) {
                    this.bullets.splice(i, 1);
                    bulletDestroyed = true;
                    break; // Exit sandbag loop since bullet is destroyed
                }
            }

            // Check bullet-wooden crate collisions (if bullet still exists)
            if (!bulletDestroyed && i < this.bullets.length) {
                for (let j = 0; j < this.woodenCrates.length; j++) {
                    if (this.woodenCrates[j].collidesWith(this.bullets[i])) {
                        this.bullets.splice(i, 1);
                        bulletDestroyed = true;
                        break; // Exit wooden crate loop since bullet is destroyed
                    }
                }
            }

            // Check bullet-warehouse crate collisions (if bullet still exists)
            if (!bulletDestroyed && i < this.bullets.length) {
                for (let j = 0; j < this.warehouseCrates.length; j++) {
                    if (this.warehouseCrates[j].collidesWith(this.bullets[i])) {
                        this.bullets.splice(i, 1);
                        bulletDestroyed = true;
                        break; // Exit warehouse crate loop since bullet is destroyed
                    }
                }
            }

            // Only check destructible crates if bullet wasn't already destroyed
            if (!bulletDestroyed && i < this.bullets.length) {
                // Check bullet-destructible crate collisions
                for (let j = 0; j < this.destructibleCrates.length; j++) {
                    if (this.destructibleCrates[j].checkBulletCollision(this.bullets[i])) {
                        const crate = this.destructibleCrates[j];
                        const points = crate.takeDamage();
                        this.bullets.splice(i, 1);
                        bulletDestroyed = true;
                        if (points > 0) {
                            this.score += points;
                            // Create a small explosion effect
                            this.explosions.push(new Explosion(crate.x + crate.width/2, crate.y + crate.height/2));
                            // Remove destroyed crate
                            this.destructibleCrates.splice(j, 1);
                        }
                        break; // Exit crate loop since bullet is destroyed
                    }
                }
            }

            // Adjust loop index if bullet was destroyed
            if (bulletDestroyed) {
                i--; // Compensate for the removed bullet
            }
        }
        
        // Update level-based spawning instead of random spawning
        this.updateLevelSpawning();

        // Powerups are now driven by enemy drops (see rollEnemyDrop + bullet-enemy collision).
        // No time-based spawner — that incentivized camping.

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
            
            // Check enemy collision with sandbags
            for (let sandbag of this.sandbags) {
                if (this.checkCollision(this.enemies[i], sandbag)) {
                    // Push enemy back depending on direction of movement
                    if (this.enemies[i].x < sandbag.x) {
                        // Enemy approaching from left, push left
                        this.enemies[i].x = sandbag.x - this.enemies[i].width;
                    } else {
                        // Enemy approaching from right, push right
                        this.enemies[i].x = sandbag.x + sandbag.width;
                    }
                }
            }

            // Check enemy collision with wooden crates
            for (let crate of this.woodenCrates) {
                if (this.checkCollision(this.enemies[i], crate)) {
                    // Push enemy back depending on direction of movement
                    if (this.enemies[i].x < crate.x) {
                        // Enemy approaching from left, push left
                        this.enemies[i].x = crate.x - this.enemies[i].width;
                    } else {
                        // Enemy approaching from right, push right
                        this.enemies[i].x = crate.x + crate.width;
                    }
                }
            }

            // Check enemy collision with warehouse crates
            for (let crate of this.warehouseCrates) {
                if (this.checkCollision(this.enemies[i], crate)) {
                    // Push enemy back depending on direction of movement
                    if (this.enemies[i].x < crate.x) {
                        // Enemy approaching from left, push left
                        this.enemies[i].x = crate.x - this.enemies[i].width;
                    } else {
                        // Enemy approaching from right, push right
                        this.enemies[i].x = crate.x + crate.width;
                    }
                }
            }
            
        }
        
        // Boss music management - only during gameplay
        if (this.gameState === 'playing') {
            const bossPresent = this.enemies.some(enemy => isBossType(enemy.type));
            if (bossPresent && !this.bossActive) {
                this.startBossMusic();
            } else if (!bossPresent && this.bossActive) {
                this.stopBossMusic();
            } else if (!bossPresent && !this.gameplayMusicPlaying) {
                // Restart the world music after a cutscene or level transition ended its loop
                this.startGameplayMusic();
            }
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
                bulletRange > maxRange || this.enemyBullets[i].landed) {
                this.enemyBullets.splice(i, 1);
                continue;
            }
            
            // Check enemy bullet-sandbag collisions
            let enemyBulletDestroyed = false;
            for (let j = 0; j < this.sandbags.length; j++) {
                if (this.sandbags[j].collidesWith(this.enemyBullets[i])) {
                    this.enemyBullets.splice(i, 1);
                    enemyBulletDestroyed = true;
                    break; // Exit sandbag loop since bullet is destroyed
                }
            }

            // Check enemy bullet-wooden crate collisions (if bullet still exists)
            if (!enemyBulletDestroyed && i < this.enemyBullets.length) {
                for (let j = 0; j < this.woodenCrates.length; j++) {
                    if (this.woodenCrates[j].collidesWith(this.enemyBullets[i])) {
                        this.enemyBullets.splice(i, 1);
                        enemyBulletDestroyed = true;
                        break; // Exit wooden crate loop since bullet is destroyed
                    }
                }
            }

            // Check enemy bullet-warehouse crate collisions (if bullet still exists)
            if (!enemyBulletDestroyed && i < this.enemyBullets.length) {
                for (let j = 0; j < this.warehouseCrates.length; j++) {
                    if (this.warehouseCrates[j].collidesWith(this.enemyBullets[i])) {
                        this.enemyBullets.splice(i, 1);
                        enemyBulletDestroyed = true;
                        break; // Exit warehouse crate loop since bullet is destroyed
                    }
                }
            }
        }
        
        // Check bullet-enemy collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                // Mounted soldiers are protected by the tower they're on
                if (this.enemies[j].mountedTower) continue;
                if (this.checkCollision(this.bullets[i], this.enemies[j])) {
                    this.bullets.splice(i, 1);
                    
                    // Damage the enemy
                    const enemy = this.enemies[j];
                    const enemyDestroyed = enemy.takeDamage(1);
                    if (enemy.shieldBlocked) {
                        enemy.shieldBlocked = false;
                        if (enemy.shieldJustBroke) {
                            enemy.shieldJustBroke = false;
                            this.playShieldBreak();
                            this.score += 25;
                        } else {
                            this.playShieldClank();
                        }
                    }
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
                        
                        // Dramatic boss explosion and victory music
                        if (isBossType(enemy.type)) {
                            this.playBossExplosion();
                            this.playVictoryMusic();
                            // Create massive boss explosion
                            this.explosions.push(new BossExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2));
                            // Stop boss music
                            this.stopBossMusic();
                            if (enemy.type === 9 || enemy.type === 12) {
                                // Rockets / barrels still in the air fizzle out with the boss
                                this.artilleryShells = [];
                            }
                            if (enemy.type === 7) {
                                // Artillery truck leaves a burnt-out wreck; shells already in the air fizzle
                                this.tankRemnants.push(new TankRemnant(enemy.x + 20, enemy.y + 40, enemy.width - 40, enemy.height - 40));
                                this.artilleryShells = [];
                            }
                        }

                        // Tower collapse — mounted soldiers detach next frame and fall via gravity
                        if (enemy.type === 6) {
                            this.playTankExplosion();
                            this.explosions.push(new TankExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2));
                            this.tankRemnants.push(new TankRemnant(enemy.x + 10, enemy.y + 30, enemy.width - 20, enemy.height - 30));
                        }

                        // Roll enemy drop (powerups now come from kills, not a time spawner)
                        this.dropPowerup(this.rollEnemyDrop(enemy), enemy);

                        this.enemies.splice(j, 1);
                    }
                    break;
                }
            }
        }
        
        // Artillery truck shells: arc through the air and explode on landing
        this.updateArtilleryShells();
        
        // Check enemy bullet-player collisions
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.enemyBullets[i], this.player)) {
                // Tank bullets do 1.5 hearts (3 damage), soldier bullets do 0.5 hearts (1 damage)
                const hitBullet = this.enemyBullets[i];
                const damage = hitBullet.isTank ? 3 : 1;
                this.enemyBullets.splice(i, 1);
                if (hitBullet.bulletType === 'goo') {
                    const now = Date.now();
                    if (this.player.lastGooHit && now - this.player.lastGooHit < 700) continue;
                    this.player.lastGooHit = now;
                }
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

        // The artillery truck boss is huge - nudge the camera ahead so the whole truck
        // stays in view, as long as the player stays on screen too
        const truckBoss = this.enemies.find(enemy => enemy.type === 7);
        if (truckBoss) {
            const fitTruck = truckBoss.x + truckBoss.width + 10 - this.canvas.width;
            if (fitTruck > this.camera.x && this.player.x - fitTruck > 30) {
                this.camera.x = fitTruck;
            }
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
                this.wonGame = false;
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
        this.stopStoryMusic();
        this.stopPopcornMusic();
        this.startGameplayMusic();
        this.gameState = 'playing';
        this.gameOver = false;
        this.score = 0;
        this.enteringInitials = false;
        this.currentInitials = '';
        this.newHighScoreIndex = -1;
        this.wonGame = false;

        // Reset to level 1 (world is set in constructor)
        this.currentLevel = 1;

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
        this.sandbags = [];
        this.platforms = [];
        this.barbedWire = [];
        this.woodenCrates = [];
        this.warehouseCrates = [];
        this.destructibleCrates = [];
        this.bunkers = [];
        this.artilleryShells = [];
        this.lastEnemySpawn = 0;
        this.camera = { x: 0, y: 0 };
        this.heliWreck = null;

        // Start level 1
        this.startLevel(1);
    }
    
    startStory() {
        // Stop title music before starting story
        this.stopTitleMusic();
        this.gameState = 'story';
        this.currentStorySlide = 0;
        this.storyTime = 0;
    }
    
    nextStorySlide() {
        this.currentStorySlide++;
        this.storyTime = 0; // Reset animation time for new slide
        if (this.currentStorySlide >= this.storySlides.length) {
            this.stopStoryMusic();
            this.stopPopcornMusic();
            // A new story run always begins in World 1, even after a world-jump shortcut
            this.currentWorld = 1;
            this.startGame();
            this.startHeliIntro();
        } else {
            // Start music for new slide
            if (this.audioUnlocked) {
                this.startStoryMusic(this.currentStorySlide);
            }
        }
    }
    
    previousStorySlide() {
        if (this.currentStorySlide > 0) {
            this.currentStorySlide--;
            this.storyTime = 0; // Reset animation time for previous slide
            // Start music for previous slide
            if (this.audioUnlocked) {
                this.startStoryMusic(this.currentStorySlide);
            }
        }
    }
    
    returnToTitle() {
        this.stopTitleMusic();
        this.stopGameplayMusic();
        this.stopStoryMusic();
        this.stopBossMusic();
        this.stopPopcornMusic();
        this.gameState = 'title';
        this.gameOver = false;
        this.enteringInitials = false;
        this.currentInitials = '';
        this.newHighScoreIndex = -1;
        this.wonGame = false;
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
    
    // Rising whine as the Reactor Titan charges its core beam
    playBeamCharge() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 1.0);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(t); osc.stop(t + 1.1);
    }

    // Buzzing roar of the core beam firing
    playCoreBeam() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        [[90, 'sawtooth', 0.12], [181, 'square', 0.05]].forEach(([f, type, vol]) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.linearRampToValueAtTime(f * 0.85, t + 0.6);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.setValueAtTime(vol, t + 0.45);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
            osc.connect(gain); gain.connect(ac.destination);
            osc.start(t); osc.stop(t + 0.66);
        });
    }

    // Hissing, bubbling spray from the hazmat trooper's goo hose
    playGooSpray() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const len = Math.floor(ac.sampleRate * 0.8);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (i < len * 0.85 ? 1 : (len - i) / (len * 0.15));
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2200;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        src.connect(filter); filter.connect(gain); gain.connect(ac.destination);
        src.start(t);
        const osc = ac.createOscillator();
        const og = ac.createGain();
        osc.type = 'sine';
        for (let i = 0; i < 10; i++) osc.frequency.setValueAtTime(180 + Math.random() * 220, t + i * 0.07);
        og.gain.setValueAtTime(0.05, t);
        og.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
        osc.connect(og); og.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.76);
    }

    // Quick whirring swish for a thrown wrench
    playWrenchThrow() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        for (let i = 0; i < 6; i++) osc.frequency.setValueAtTime(i % 2 ? 520 : 760, t + i * 0.035);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.23);
    }

    // Whoosh when a yeti rocket leaves the launcher
    playRocketLaunch() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const len = Math.floor(ac.sampleRate * 0.5);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.exponentialRampToValueAtTime(2400, t + 0.45);
        filter.Q.value = 1.2;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        src.connect(filter); filter.connect(gain); gain.connect(ac.destination);
        src.start(t);
    }

    // Robotic roar for the cyborg yeti
    playYetiRoar() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        [[70, 'sawtooth', 0.14], [105, 'square', 0.05]].forEach(([f, type, vol]) => {
            const osc = ac.createOscillator();
            const lfo = ac.createOscillator();
            const lfoGain = ac.createGain();
            const gain = ac.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.linearRampToValueAtTime(f * 1.5, t + 0.25);
            osc.frequency.linearRampToValueAtTime(f * 0.8, t + 0.9);
            lfo.frequency.value = 28;
            lfoGain.gain.value = f * 0.25;
            lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
            osc.connect(gain); gain.connect(ac.destination);
            osc.start(t); lfo.start(t);
            osc.stop(t + 1); lfo.stop(t + 1);
        });
    }

    // Metal ping when a shot bounces off the shield stickman's shield
    playShieldClank() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        [1250, 1870].forEach((f, i) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = i ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f * 0.85, t + 0.18);
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.connect(gain); gain.connect(ac.destination);
            osc.start(t); osc.stop(t + 0.21);
        });
    }

    // Crunch and clatter when the shield finally shatters
    playShieldBreak() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const len = Math.floor(ac.sampleRate * 0.35);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
        const noise = ac.createBufferSource();
        noise.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass'; filter.frequency.value = 2500; filter.Q.value = 0.8;
        const ng = ac.createGain();
        ng.gain.setValueAtTime(0.35, t);
        noise.connect(filter); filter.connect(ng); ng.connect(ac.destination);
        noise.start(t);
        [900, 640, 1400].forEach((f, i) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            const st = t + i * 0.06;
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, st);
            osc.frequency.exponentialRampToValueAtTime(f * 0.5, st + 0.15);
            gain.gain.setValueAtTime(0.07, st);
            gain.gain.exponentialRampToValueAtTime(0.001, st + 0.15);
            osc.connect(gain); gain.connect(ac.destination);
            osc.start(st); osc.stop(st + 0.16);
        });
    }

    // Rising electric hum while the axe charges up
    playAxeCharge() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.45);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.5);
    }

    // Electric crack when the axe comes down
    playAxeZap() {
        const ac = this.audioContext;
        if (!ac) return;
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        for (let i = 0; i < 8; i++) osc.frequency.setValueAtTime(200 + Math.random() * 1400, t + i * 0.025);
        gain.gain.setValueAtTime(0.13, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.23);
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
    
    playBossExplosion() {
        if (!this.audioContext) return;
        
        // EPIC boss explosion - even more dramatic than tank
        
        // Massive deep rumble
        const rumble = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        rumble.connect(rumbleGain);
        rumbleGain.connect(this.audioContext.destination);
        rumble.frequency.setValueAtTime(25, this.audioContext.currentTime);
        rumble.frequency.exponentialRampToValueAtTime(8, this.audioContext.currentTime + 2.0);
        rumbleGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
        
        // Massive explosion crack
        const crack = this.audioContext.createOscillator();
        const crackGain = this.audioContext.createGain();
        crack.connect(crackGain);
        crackGain.connect(this.audioContext.destination);
        crack.frequency.setValueAtTime(800, this.audioContext.currentTime);
        crack.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.8);
        crackGain.gain.setValueAtTime(0.9, this.audioContext.currentTime);
        crackGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        // High metallic debris
        const debris = this.audioContext.createOscillator();
        const debrisGain = this.audioContext.createGain();
        debris.connect(debrisGain);
        debrisGain.connect(this.audioContext.destination);
        debris.frequency.setValueAtTime(4000, this.audioContext.currentTime);
        debris.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 1.0);
        debrisGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        debrisGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
        
        // Multiple explosion echoes for boss
        for (let i = 0; i < 3; i++) {
            const echo = this.audioContext.createOscillator();
            const echoGain = this.audioContext.createGain();
            echo.connect(echoGain);
            echoGain.connect(this.audioContext.destination);
            const delay = 0.3 + (i * 0.2);
            echo.frequency.setValueAtTime(300 - (i * 50), this.audioContext.currentTime + delay);
            echo.frequency.exponentialRampToValueAtTime(40 - (i * 10), this.audioContext.currentTime + delay + 0.6);
            echoGain.gain.setValueAtTime(0.3 - (i * 0.05), this.audioContext.currentTime + delay);
            echoGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.6);
            echo.start(this.audioContext.currentTime + delay);
            echo.stop(this.audioContext.currentTime + delay + 0.6);
        }
        
        rumble.start(this.audioContext.currentTime);
        rumble.stop(this.audioContext.currentTime + 2.0);
        crack.start(this.audioContext.currentTime);
        crack.stop(this.audioContext.currentTime + 0.8);
        debris.start(this.audioContext.currentTime);
        debris.stop(this.audioContext.currentTime + 1.0);
    }
    
    playVictoryMusic() {
        if (!this.audioContext) return;
        
        // Epic victory fanfare
        const notes = [
            { freq: 523.25, time: 0.0, duration: 0.5 }, // C5
            { freq: 659.25, time: 0.5, duration: 0.5 }, // E5
            { freq: 783.99, time: 1.0, duration: 0.5 }, // G5
            { freq: 1046.5, time: 1.5, duration: 1.0 }, // C6 - triumphant high note
            { freq: 783.99, time: 2.5, duration: 0.5 }, // G5
            { freq: 1046.5, time: 3.0, duration: 1.5 }  // C6 - final victory note
        ];
        
        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime + note.time);
            gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + note.time + note.duration);
            
            oscillator.start(this.audioContext.currentTime + note.time);
            oscillator.stop(this.audioContext.currentTime + note.time + note.duration);
        });
        
        // Add triumphant harmony
        const harmonyNotes = [
            { freq: 392.00, time: 1.5, duration: 1.0 }, // G4
            { freq: 523.25, time: 2.5, duration: 0.5 }, // C5
            { freq: 659.25, time: 3.0, duration: 1.5 }  // E5
        ];
        
        harmonyNotes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime + note.time);
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + note.time + note.duration);
            
            oscillator.start(this.audioContext.currentTime + note.time);
            oscillator.stop(this.audioContext.currentTime + note.time + note.duration);
        });
    }
    
    startPopcornMusic() {
        if (!this.audioContext || this.popcornMusicPlaying || !this.audioUnlocked) {
            console.log('POPCORN MUSIC BLOCKED - audioContext:', !!this.audioContext, 'playing:', this.popcornMusicPlaying, 'unlocked:', this.audioUnlocked);
            return;
        }
        
        console.log('STARTING NEW POPCORN VILLAIN MUSIC - CONTEXT:', this.gameState);
        console.log('Audio context state:', this.audioContext.state);
        console.log('Current time:', this.audioContext.currentTime);
        this.popcornMusicPlaying = true;
        this.playPopcornTrack();
    }
    
    startEnhancedPopcornMusic() {
        if (!this.audioContext || this.popcornMusicPlaying || !this.audioUnlocked) return;
        
        console.log('STARTING ENHANCED POPCORN MUSIC WITH STORY EFFECTS');
        this.popcornMusicPlaying = true;
        this.playEnhancedPopcornTrack();
    }
    
    stopPopcornMusic() {
        if (this.popcornMusic) {
            this.popcornMusic.stop();
            this.popcornMusic = null;
        }
        if (this.popcornMusicTimeout) {
            clearTimeout(this.popcornMusicTimeout);
            this.popcornMusicTimeout = null;
        }
        this.fadeOutMusicBus('popcorn');
        this.popcornMusicPlaying = false;
    }
    
    stopAllMusic() {
        // Stop all audio but don't mess with initialization state
        this.stopTitleMusic();
        this.stopGameplayMusic();
        this.stopStoryMusic();
        this.stopBossMusic();
        this.stopPopcornMusic();
        this.stopMysteryMusic();
        
        // Only clear the playing flags, not the core state
        this.currentStoryMusicType = null;
    }
    
    startMysteryMusic() {
        if (!this.audioContext || this.mysteryMusicPlaying || !this.audioUnlocked) return;
        
        console.log('STARTING MYSTERY MUSIC');
        this.mysteryMusicPlaying = true;
        this.playMysteryTrack();
    }
    
    stopMysteryMusic() {
        if (this.mysteryMusic) {
            this.mysteryMusic.stop();
            this.mysteryMusic = null;
        }
        if (this.mysteryMusicTimeout) {
            clearTimeout(this.mysteryMusicTimeout);
            this.mysteryMusicTimeout = null;
        }
        this.mysteryMusicPlaying = false;
    }
    
    playMysteryTrack() {
        if (!this.audioContext || !this.audioUnlocked) return;
        
        console.log('PLAYING MYSTERY TRACK - D3, E3, F3, G3 progression');
        
        // Original popcorn music - mysterious and suspenseful
        const now = this.audioContext.currentTime;
        
        // Deep, ominous bass line (ORIGINAL)
        const bass = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bass.connect(bassGain);
        bassGain.connect(this.audioContext.destination);
        
        // Original bass progression: D minor scale
        const bassNotes = [146.83, 164.81, 174.61, 196.00]; // D3, E3, F3, G3
        
        bassNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.mysteryMusicPlaying) {
                    bass.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 800);
        });
        
        bass.frequency.setValueAtTime(bassNotes[0], now);
        bassGain.gain.setValueAtTime(0.4, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 4);
        
        // Original dark, dissonant harmony
        const harmony = this.audioContext.createOscillator();
        const harmonyGain = this.audioContext.createGain();
        harmony.connect(harmonyGain);
        harmonyGain.connect(this.audioContext.destination);
        
        const harmonyNotes = [220.00, 246.94, 261.63, 293.66]; // A3, B3, C4, D4
        let harmonyTime = now + 0.4;
        
        harmonyNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.mysteryMusicPlaying) {
                    harmony.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 800 + 400);
        });
        
        harmony.frequency.setValueAtTime(harmonyNotes[0], harmonyTime);
        harmonyGain.gain.setValueAtTime(0.2, harmonyTime);
        harmonyGain.gain.exponentialRampToValueAtTime(0.01, harmonyTime + 3.6);
        
        // Original evil tremolo effect
        const tremolo = this.audioContext.createOscillator();
        const tremoloGain = this.audioContext.createGain();
        tremolo.connect(tremoloGain);
        tremoloGain.connect(this.audioContext.destination);
        
        tremolo.frequency.setValueAtTime(8, now); // Original 8 Hz tremolo
        tremoloGain.gain.setValueAtTime(0.1, now);
        tremoloGain.gain.exponentialRampToValueAtTime(0.01, now + 4);
        
        bass.start(now);
        bass.stop(now + 4);
        harmony.start(harmonyTime);
        harmony.stop(harmonyTime + 3.6);
        tremolo.start(now);
        tremolo.stop(now + 4);
        
        this.mysteryMusic = bass; // Store reference for stopping
        
        // Original loop timing
        this.mysteryMusicTimeout = setTimeout(() => {
            if (this.mysteryMusicPlaying) {
                this.playMysteryTrack();
            }
        }, 3200);
    }
    
    playPopcornTrack() {
        if (!this.audioContext || !this.audioUnlocked) return;
        
        console.log('PLAYING NEW POPCORN TRACK - G2, A2, B2, C#3 progression');
        console.log('Game state:', this.gameState);
        console.log('Story music playing:', this.storyMusicPlaying);
        console.log('Popcorn music playing:', this.popcornMusicPlaying);
        console.log('Audio context current time:', this.audioContext.currentTime);
        
        // NEW evil villain music for popcorn - more dramatic and sinister
        const now = this.audioContext.currentTime;
        
        console.log('=== POPCORN TRACK AUDIO NODES ===');
        console.log('Creating bass oscillator...');
        
        // Ultra-deep menacing bass
        const bass = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bass.connect(bassGain);
        bassGain.connect(this.getMusicBus('popcorn'));
        
        // More aggressive villain progression
        const bassNotes = [98.00, 110.00, 123.47, 138.59]; // G2, A2, B2, C#3
        let bassTime = now;
        
        bassNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.popcornMusicPlaying) {
                    bass.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 600); // Faster progression
        });
        
        bass.frequency.setValueAtTime(bassNotes[0], now);
        bassGain.gain.setValueAtTime(0.5, now); // Louder
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        // Sinister high-pitched discord
        const discord = this.audioContext.createOscillator();
        const discordGain = this.audioContext.createGain();
        discord.connect(discordGain);
        discordGain.connect(this.getMusicBus('popcorn'));
        
        // Dissonant high notes for evil effect
        const discordNotes = [466.16, 523.25, 587.33, 659.25]; // A#4, C5, D5, E5
        let discordTime = now + 0.3;
        
        discordNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.popcornMusicPlaying) {
                    discord.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 600 + 300);
        });
        
        discord.frequency.setValueAtTime(discordNotes[0], discordTime);
        discordGain.gain.setValueAtTime(0.15, discordTime);
        discordGain.gain.exponentialRampToValueAtTime(0.01, discordTime + 2.7);
        
        // Evil pulsing effect
        const pulse = this.audioContext.createOscillator();
        const pulseGain = this.audioContext.createGain();
        pulse.connect(pulseGain);
        pulseGain.connect(this.getMusicBus('popcorn'));
        
        pulse.frequency.setValueAtTime(12, now); // 12 Hz evil pulse
        pulseGain.gain.setValueAtTime(0.08, now);
        pulseGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        bass.start(now);
        bass.stop(now + 3);
        discord.start(discordTime);
        discord.stop(discordTime + 2.7);
        pulse.start(now);
        pulse.stop(now + 3);
        
        this.popcornMusic = bass; // Store reference for stopping
        
        // Add echo effects to bass for richness - ALWAYS APPLY
        console.log('Adding echo effects to bass for story-like audio');
        for (let i = 0; i < 2; i++) {
            const echo = this.audioContext.createOscillator();
            const echoGain = this.audioContext.createGain();
            echo.connect(echoGain);
            echoGain.connect(this.getMusicBus('popcorn'));
            
            const delay = 0.15 + (i * 0.1);
            echo.frequency.setValueAtTime(bassNotes[0] * 0.5, now + delay); // Lower octave echo
            echoGain.gain.setValueAtTime(0.15 - (i * 0.05), now + delay);
            echoGain.gain.exponentialRampToValueAtTime(0.01, now + delay + 2.8);
            echo.start(now + delay);
            echo.stop(now + delay + 2.8);
        }
        
        // Add dramatic villain drums using filtered noise
        console.log('Adding villain drum effects to popcorn music');
        const villainDrumPattern = [
            // Heavy menacing beat pattern - kicks and snares but no crash
            {type: 'kick', time: 0},
            {type: 'kick', time: 0.3},
            {type: 'snare', time: 0.6},
            {type: 'kick', time: 0.9},
            {type: 'snare', time: 1.2},
            {type: 'kick', time: 1.8},
            {type: 'snare', time: 2.1},
        ];
        
        villainDrumPattern.forEach((drum, index) => {
            console.log(`Creating drum ${index}: ${drum.type} at time ${drum.time}`);
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
            gain.connect(this.getMusicBus('popcorn'));
            
            const startTime = this.audioContext.currentTime + drum.time;
            
            switch(drum.type) {
                case 'kick':
                    filter.frequency.setValueAtTime(60, startTime); // Even deeper kick for villain
                    filter.Q.setValueAtTime(1.5, startTime);
                    gain.gain.setValueAtTime(0.25, startTime); // Louder for drama
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                    break;
                case 'snare':
                    filter.frequency.setValueAtTime(2000, startTime); // Sharp crack
                    filter.Q.setValueAtTime(0.3, startTime);
                    gain.gain.setValueAtTime(0.15, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                    break;
                case 'crash':
                    filter.frequency.setValueAtTime(5000, startTime); // Evil crash
                    filter.Q.setValueAtTime(0.2, startTime);
                    gain.gain.setValueAtTime(0.2, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
                    break;
            }
            
            console.log(`Starting ${drum.type} drum at ${startTime}`);
            noise.start(startTime);
            noise.stop(startTime + 0.1);
        });
        
        // Loop the evil villain music
        this.popcornMusicTimeout = setTimeout(() => {
            if (this.popcornMusicPlaying) {
                this.playPopcornTrack();
            }
        }, 2400);
    }
    
    playEnhancedPopcornTrack() {
        if (!this.audioContext || !this.audioUnlocked) return;
        
        console.log('PLAYING ENHANCED POPCORN TRACK WITH REVERB AND EFFECTS');
        
        const now = this.audioContext.currentTime;
        
        // Create reverb convolver
        const convolver = this.audioContext.createConvolver();
        const impulseBuffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
        for (let channel = 0; channel < impulseBuffer.numberOfChannels; channel++) {
            const channelData = impulseBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 2);
            }
        }
        convolver.buffer = impulseBuffer;
        
        // Create delay
        const delay = this.audioContext.createDelay(0.3);
        delay.delayTime.setValueAtTime(0.15, now);
        const delayGain = this.audioContext.createGain();
        delayGain.gain.setValueAtTime(0.3, now);
        
        // Master gain for the enhanced track
        const masterGain = this.audioContext.createGain();
        masterGain.gain.setValueAtTime(0.8, now);
        
        // Ultra-deep menacing bass with reverb
        const bass = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bass.connect(bassGain);
        bassGain.connect(convolver);
        bassGain.connect(delay);
        convolver.connect(masterGain);
        delay.connect(delayGain);
        delayGain.connect(masterGain);
        masterGain.connect(this.getMusicBus('popcorn'));
        
        const bassNotes = [98.00, 110.00, 123.47, 138.59]; // G2, A2, B2, C#3
        bassNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.popcornMusicPlaying) {
                    bass.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 600);
        });
        
        bass.frequency.setValueAtTime(bassNotes[0], now);
        bassGain.gain.setValueAtTime(0.6, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        // Enhanced discord with effects
        const discord = this.audioContext.createOscillator();
        const discordGain = this.audioContext.createGain();
        discord.connect(discordGain);
        discordGain.connect(convolver);
        discordGain.connect(delay);
        
        const discordNotes = [466.16, 523.25, 587.33, 659.25];
        let discordTime = now + 0.3;
        
        discordNotes.forEach((freq, i) => {
            setTimeout(() => {
                if (this.popcornMusicPlaying) {
                    discord.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            }, i * 600 + 300);
        });
        
        discord.frequency.setValueAtTime(discordNotes[0], discordTime);
        discordGain.gain.setValueAtTime(0.2, discordTime);
        discordGain.gain.exponentialRampToValueAtTime(0.01, discordTime + 2.7);
        
        // Evil pulsing with reverb
        const pulse = this.audioContext.createOscillator();
        const pulseGain = this.audioContext.createGain();
        pulse.connect(pulseGain);
        pulseGain.connect(convolver);
        
        pulse.frequency.setValueAtTime(12, now);
        pulseGain.gain.setValueAtTime(0.1, now);
        pulseGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        bass.start(now);
        bass.stop(now + 3);
        discord.start(discordTime);
        discord.stop(discordTime + 2.7);
        pulse.start(now);
        pulse.stop(now + 3);
        
        this.popcornMusic = bass;
        
        // Add enhanced drum effects
        const villainDrumPattern = [
            {type: 'kick', time: 0},
            {type: 'kick', time: 0.3},
            {type: 'snare', time: 0.6},
            {type: 'kick', time: 0.9},
            {type: 'snare', time: 1.2},
            {type: 'crash', time: 1.5},
            {type: 'kick', time: 1.8},
            {type: 'snare', time: 2.1},
        ];
        
        villainDrumPattern.forEach((drum, index) => {
            const noise = this.audioContext.createBufferSource();
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < buffer.length; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            const gain = this.audioContext.createGain();
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(convolver); // Add reverb to drums too
            
            const startTime = this.audioContext.currentTime + drum.time;
            
            switch(drum.type) {
                case 'kick':
                    filter.frequency.setValueAtTime(80, startTime);
                    filter.Q.setValueAtTime(2, startTime);
                    gain.gain.setValueAtTime(0.4, startTime);
                    break;
                case 'snare':
                    filter.frequency.setValueAtTime(200, startTime);
                    filter.Q.setValueAtTime(1, startTime);
                    gain.gain.setValueAtTime(0.3, startTime);
                    break;
                case 'crash':
                    filter.frequency.setValueAtTime(8000, startTime);
                    filter.Q.setValueAtTime(0.1, startTime);
                    gain.gain.setValueAtTime(0.2, startTime);
                    break;
            }
            
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            noise.start(startTime);
            noise.stop(startTime + 0.1);
        });
        
        // Loop the enhanced music
        this.popcornMusicTimeout = setTimeout(() => {
            if (this.popcornMusicPlaying) {
                this.playEnhancedPopcornTrack();
            }
        }, 2400);
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
    
    isMobileDevice() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    startTitleMusic() {
        if (!this.audioContext || this.titleMusicPlaying || !this.audioUnlocked) {
            // Silently fail if audio not unlocked yet - user doesn't need to know
            return;
        }
        
        this.titleMusicPlaying = true;
        // New loop id so an old loop still waiting on its timer stops instead of doubling up
        this.titleLoopId = (this.titleLoopId || 0) + 1;
        this.playTitleMelody(this.titleLoopId);
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
    
    playTitleMelody(loopId) {
        if (!this.audioContext || !this.titleMusicPlaying || loopId !== this.titleLoopId) return;
        
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
                this.playTitleMelody(loopId);
            }
        }, 4000);
    }
    
    startGameplayMusic() {
        if (!this.audioContext || this.gameplayMusicPlaying || !this.audioUnlocked) return;
        
        this.gameplayMusicPlaying = true;
        // New loop id so any older loop still waiting on its timer stops instead of doubling up
        this.gameplayLoopId = (this.gameplayLoopId || 0) + 1;
        this.playGameplayTrack();
    }
    
    // Queue the next pass of the gameplay track. Goes through playGameplayTrack so the
    // music follows a world change. If gameplay has paused (cutscene, level complete),
    // the loop ends and update() starts it again once the player is back in control.
    scheduleGameplayLoop(delay) {
        const loopId = this.gameplayLoopId;
        setTimeout(() => {
            if (loopId !== this.gameplayLoopId) return;
            if (this.gameState === 'playing' && this.gameplayMusicPlaying) {
                this.playGameplayTrack();
            } else {
                this.gameplayMusicPlaying = false;
            }
        }, delay);
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
        // Cut off any notes already queued (World 4 schedules a whole loop ahead)
        if (this.audioContext) this.fadeOutMusicBus('gameplay');
    }
    
    startStoryMusic(slideIndex) {
        if (!this.audioContext || !this.audioUnlocked) return;
        
        const slide = this.storySlides[slideIndex];
        const musicType = slide.effects;
        
        console.log(`Starting story music: slide ${slideIndex}, type: ${musicType}, current: ${this.currentStoryMusicType}`);
        console.log(`Music states - story: ${this.storyMusicPlaying}, popcorn: ${this.popcornMusicPlaying}`);
        console.log(`Game state when starting story music: ${this.gameState}`);
        
        // Always stop existing music when changing slides  
        this.stopStoryMusic();
        this.stopPopcornMusic();
        this.stopMysteryMusic();
        
        this.currentStoryMusicType = musicType;
        
        // Handle villain music separately with popcorn music system (INTRO SEQUENCE)
        if (musicType === 'villain') {
            console.log('STORY MODE: Starting popcorn music for villain');
            this.startPopcornMusic();
        } else {
            console.log('STORY MODE: Starting story music track:', musicType);
            this.storyMusicPlaying = true;
            this.playStoryTrack(musicType);
        }
    }
    
    stopStoryMusic() {
        if (this.storyMusic) {
            this.storyMusic.stop();
            this.storyMusic = null;
        }
        if (this.storyMusicGain) {
            this.storyMusicGain = null;
        }
        if (this.storyMusicTimeout) {
            clearTimeout(this.storyMusicTimeout);
            this.storyMusicTimeout = null;
        }
        this.fadeOutMusicBus('story');
        this.storyMusicPlaying = false;
        this.currentStoryMusicType = null;
    }

    // Story and villain tracks schedule several seconds of notes up front. Routing them
    // through a named bus lets a stop fade out every note that is already queued, so
    // they don't keep playing over the next slide, the gameplay music or the boss music.
    getMusicBus(name) {
        this.musicBuses = this.musicBuses || {};
        if (!this.musicBuses[name]) {
            const bus = this.audioContext.createGain();
            bus.connect(this.audioContext.destination);
            this.musicBuses[name] = bus;
        }
        return this.musicBuses[name];
    }
    
    fadeOutMusicBus(name) {
        const bus = this.musicBuses && this.musicBuses[name];
        if (!bus) return;
        const now = this.audioContext.currentTime;
        bus.gain.setValueAtTime(bus.gain.value, now);
        bus.gain.linearRampToValueAtTime(0, now + 0.15);
        setTimeout(() => bus.disconnect(), 250);
        this.musicBuses[name] = null;
    }
    
    playStoryTrack(musicType) {
        if (!this.audioContext || !this.storyMusicPlaying) return;
        
        console.log('PLAYSTORYTRACK CALLED WITH:', musicType, 'storyMusicPlaying:', this.storyMusicPlaying);
        
        let melody = [];
        let bassDrone = [];
        
        switch (musicType) {
            case 'invasion':
                // Dark, ominous melody with low drones
                melody = [
                    {note: 207, duration: 1.0}, // G#3
                    {note: 233, duration: 1.0}, // A#3
                    {note: 207, duration: 0.5}, // G#3
                    {note: 185, duration: 1.5}, // F#3
                    {note: 156, duration: 2.0}, // D#3
                ];
                bassDrone = [
                    {note: 103, duration: 6.0}, // G#2 drone
                ];
                break;
                
            case 'heroic':
                // EPIC heroic entrance - building intensity to match villain drama
                melody = [
                    // Building tension
                    {note: 392, duration: 0.4}, // G4 - start lower
                    {note: 523, duration: 0.4}, // C5 - building up
                    {note: 659, duration: 0.4}, // E5 - more intensity
                    {note: 784, duration: 0.3}, // G5 - faster rhythm
                    {note: 1047, duration: 0.3}, // C6 - peak power
                    {note: 1175, duration: 0.3}, // D6 - even higher
                    {note: 1319, duration: 0.5}, // E6 - triumphant peak
                    {note: 1047, duration: 0.3}, // C6 - power chord
                    {note: 784, duration: 0.3}, // G5 - driving rhythm
                    {note: 880, duration: 0.3}, // A5 - tension
                    {note: 1047, duration: 0.8}, // C6 - final power note
                ];
                bassDrone = [
                    {note: 131, duration: 2.0}, // C3 - deeper, more powerful drone
                    {note: 196, duration: 2.0}, // G3 - harmonic power
                ];
                break;
                
            case 'confrontation':
                // INTENSE building tension - the calm before the storm
                melody = [
                    // Ominous building tension
                    {note: 220, duration: 0.8}, // A3 - dark start
                    {note: 277, duration: 0.6}, // C#4 - tension rising
                    {note: 330, duration: 0.6}, // E4 - building
                    {note: 415, duration: 0.5}, // G#4 - more intensity
                    {note: 554, duration: 0.4}, // C#5 - climbing higher
                    {note: 659, duration: 0.4}, // E5 - escalating
                    {note: 831, duration: 0.3}, // G#5 - peak tension
                    // Explosive climax  
                    {note: 1109, duration: 0.6}, // C#6 - explosive peak
                    {note: 932, duration: 0.3}, // A#5 - dramatic fall
                    {note: 831, duration: 0.3}, // G#5 - power chord
                    {note: 659, duration: 0.4}, // E5 - driving to battle
                    {note: 554, duration: 0.8}, // C#5 - final tension note
                ];
                bassDrone = [
                    {note: 110, duration: 3.0}, // A2 - ominous deep drone
                    {note: 138, duration: 3.0}, // C#3 - harmonic tension
                ];
                break;
                
            case 'battle':
                // Intense, fast-paced battle music
                melody = [
                    {note: 294, duration: 0.3}, // D4
                    {note: 349, duration: 0.3}, // F4
                    {note: 392, duration: 0.3}, // G4
                    {note: 466, duration: 0.3}, // A#4
                    {note: 392, duration: 0.3}, // G4
                    {note: 349, duration: 0.3}, // F4
                    {note: 294, duration: 0.6}, // D4
                ];
                bassDrone = [
                    {note: 147, duration: 2.4}, // D3 drone
                ];
                break;
                
            case 'villain':
                // Evil popcorn villain music - aggressive and menacing
                melody = [
                    {note: 98, duration: 0.6},   // G2
                    {note: 110, duration: 0.6},  // A2
                    {note: 123, duration: 0.6},  // B2
                    {note: 138, duration: 1.2},  // C#3
                    {note: 123, duration: 0.6},  // B2
                    {note: 98, duration: 1.6},   // G2
                ];
                bassDrone = [
                    {note: 73, duration: 6.0}, // D2 deep evil drone
                ];
                break;
        }
        
        // All notes go through one bus so stopStoryMusic can silence ones already scheduled
        const bus = this.getMusicBus('story');
        let currentTime = this.audioContext.currentTime;
        
        console.log('=== STORY TRACK AUDIO NODES ===');
        console.log('Creating story bass drone...');
        
        // Create dramatic low-frequency drone
        bassDrone.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.note, currentTime);
            
            gain.gain.setValueAtTime(0.1, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.15, currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.05, currentTime + note.duration - 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.connect(gain);
            gain.connect(bus);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Reset current time for melody
        currentTime = this.audioContext.currentTime + 0.2; // Slight delay
        
        // Play dramatic melody
        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = musicType === 'heroic' ? 'triangle' : 'square';
            osc.frequency.setValueAtTime(note.note, currentTime);
            
            const volume = musicType === 'invasion' ? 0.08 : 0.12;
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.exponentialRampToValueAtTime(volume, currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.connect(gain);
            gain.connect(bus);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Schedule next loop
        const totalDuration = musicType === 'invasion' ? 6000 : musicType === 'heroic' ? 4000 : 2500;
        this.storyMusicTimeout = setTimeout(() => {
            if (this.gameState === 'story' && this.storyMusicPlaying) {
                this.playStoryTrack(musicType);
            }
        }, totalDuration);
    }
    
    playGameplayTrack() {
        if (!this.audioContext || !this.gameplayMusicPlaying) return;

        // Choose music based on current world
        if (this.currentWorld === 2) {
            this.playUndergroundTrack();
            return;
        }
        if (this.currentWorld === 3) {
            this.playConstructionTrack();
            return;
        }
        if (this.currentWorld === 4) {
            this.playMountainTrack();
            return;
        }

        // Epic battle melody in A minor (natural minor scale) - World 1
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
        this.scheduleGameplayLoop(4000);
    }

    playUndergroundTrack() {
        if (!this.audioContext || !this.gameplayMusicPlaying) return;

        // Extended upbeat EDM underground track in E minor (energetic and driving)
        const edm_melody = [
            // Section 1 - Main synth lead (8 bars)
            {note: 330, duration: 0.25}, // E4
            {note: 392, duration: 0.25}, // G4
            {note: 494, duration: 0.25}, // B4
            {note: 659, duration: 0.25}, // E5
            {note: 494, duration: 0.25}, // B4
            {note: 392, duration: 0.25}, // G4
            {note: 330, duration: 0.25}, // E4
            {note: 294, duration: 0.25}, // D4

            // Build up phrase
            {note: 330, duration: 0.125}, // E4
            {note: 392, duration: 0.125}, // G4
            {note: 494, duration: 0.125}, // B4
            {note: 659, duration: 0.125}, // E5
            {note: 784, duration: 0.25}, // G5
            {note: 659, duration: 0.25}, // E5
            {note: 494, duration: 0.25}, // B4
            {note: 392, duration: 0.25}, // G4

            // Section 2 - Variation with higher octave (8 bars)
            {note: 659, duration: 0.25}, // E5
            {note: 784, duration: 0.25}, // G5
            {note: 988, duration: 0.25}, // B5
            {note: 1319, duration: 0.25}, // E6
            {note: 988, duration: 0.25}, // B5
            {note: 784, duration: 0.25}, // G5
            {note: 659, duration: 0.25}, // E5
            {note: 587, duration: 0.25}, // D5

            // Extended buildup
            {note: 659, duration: 0.125}, // E5
            {note: 784, duration: 0.125}, // G5
            {note: 988, duration: 0.125}, // B5
            {note: 1319, duration: 0.125}, // E6
            {note: 1175, duration: 0.25}, // D6
            {note: 1047, duration: 0.25}, // C6
            {note: 988, duration: 0.25}, // B5
            {note: 880, duration: 0.25}, // A5

            // Section 3 - Breakdown/Bridge (8 bars)
            {note: 165, duration: 0.5}, // E3 - lower octave
            {note: 196, duration: 0.5}, // G3
            {note: 247, duration: 0.5}, // B3
            {note: 294, duration: 0.5}, // D4
            {note: 330, duration: 0.25}, // E4
            {note: 392, duration: 0.25}, // G4
            {note: 494, duration: 0.25}, // B4
            {note: 587, duration: 0.25}, // D5

            // Section 4 - Final climax (8 bars)
            {note: 659, duration: 0.125}, // E5
            {note: 659, duration: 0.125}, // E5
            {note: 784, duration: 0.125}, // G5
            {note: 784, duration: 0.125}, // G5
            {note: 988, duration: 0.125}, // B5
            {note: 988, duration: 0.125}, // B5
            {note: 1319, duration: 0.125}, // E6
            {note: 1319, duration: 0.125}, // E6

            {note: 1175, duration: 0.25}, // D6
            {note: 1047, duration: 0.25}, // C6
            {note: 988, duration: 0.25}, // B5
            {note: 880, duration: 0.25}, // A5
            {note: 784, duration: 0.25}, // G5
            {note: 659, duration: 0.25}, // E5
            {note: 494, duration: 0.25}, // B4
            {note: 330, duration: 0.25}  // E4
        ];

        // Extended bass synth pattern - driving 4/4 beat throughout all sections
        const bass_pattern = [
            // Section 1 & 2 - Standard driving bass
            {note: 82.4, duration: 0.25, delay: 0},    // E2
            {note: 0, duration: 0.25, delay: 0.25},    // Rest
            {note: 98, duration: 0.25, delay: 0.5},    // G2
            {note: 0, duration: 0.25, delay: 0.75},    // Rest
            {note: 123.5, duration: 0.25, delay: 1.0}, // B2
            {note: 0, duration: 0.25, delay: 1.25},    // Rest
            {note: 147, duration: 0.25, delay: 1.5},   // D3
            {note: 82.4, duration: 0.25, delay: 1.75}, // E2

            // Repeat for second phrase
            {note: 82.4, duration: 0.25, delay: 2.0},
            {note: 0, duration: 0.25, delay: 2.25},
            {note: 98, duration: 0.25, delay: 2.5},
            {note: 0, duration: 0.25, delay: 2.75},
            {note: 123.5, duration: 0.25, delay: 3.0},
            {note: 0, duration: 0.25, delay: 3.25},
            {note: 147, duration: 0.25, delay: 3.5},
            {note: 82.4, duration: 0.25, delay: 3.75},

            // Section 2 continues - Higher energy
            {note: 82.4, duration: 0.125, delay: 4.0},
            {note: 82.4, duration: 0.125, delay: 4.125},
            {note: 98, duration: 0.125, delay: 4.25},
            {note: 98, duration: 0.125, delay: 4.375},
            {note: 123.5, duration: 0.125, delay: 4.5},
            {note: 123.5, duration: 0.125, delay: 4.625},
            {note: 147, duration: 0.125, delay: 4.75},
            {note: 147, duration: 0.125, delay: 4.875},

            {note: 82.4, duration: 0.25, delay: 5.0},
            {note: 98, duration: 0.25, delay: 5.25},
            {note: 123.5, duration: 0.25, delay: 5.5},
            {note: 147, duration: 0.25, delay: 5.75},

            // Section 3 - Breakdown (sustained notes)
            {note: 82.4, duration: 0.5, delay: 6.0},   // E2
            {note: 98, duration: 0.5, delay: 6.5},     // G2
            {note: 123.5, duration: 0.5, delay: 7.0},  // B2
            {note: 147, duration: 0.5, delay: 7.5},    // D3

            // Section 4 - Final climax (intense bass)
            {note: 82.4, duration: 0.125, delay: 8.0},
            {note: 0, duration: 0.125, delay: 8.125},
            {note: 82.4, duration: 0.125, delay: 8.25},
            {note: 0, duration: 0.125, delay: 8.375},
            {note: 123.5, duration: 0.125, delay: 8.5},
            {note: 0, duration: 0.125, delay: 8.625},
            {note: 123.5, duration: 0.125, delay: 8.75},
            {note: 0, duration: 0.125, delay: 8.875},

            {note: 147, duration: 0.25, delay: 9.0},
            {note: 130.8, duration: 0.25, delay: 9.25}, // C3
            {note: 123.5, duration: 0.25, delay: 9.5},  // B2
            {note: 110, duration: 0.25, delay: 9.75},   // A2
            {note: 98, duration: 0.25, delay: 10.0},    // G2
            {note: 82.4, duration: 0.25, delay: 10.25}, // E2
            {note: 123.5, duration: 0.25, delay: 10.5}, // B2
            {note: 82.4, duration: 0.25, delay: 10.75}  // E2
        ];

        // Play main EDM melody with bright synth sound
        let currentTime = this.audioContext.currentTime;
        edm_melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);

            // Bright EDM synth sound
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.note, currentTime);

            // High-pass filter for bright EDM sound
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(200, currentTime);
            filter.Q.setValueAtTime(2, currentTime);

            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(0.12, currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.02, currentTime + note.duration * 0.8);
            gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);

            osc.start(currentTime);
            osc.stop(currentTime + note.duration);

            currentTime += note.duration;
        });

        // Play driving bass line
        bass_pattern.forEach(bass => {
            if (bass.note > 0) { // Skip rests
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.type = 'square';
                osc.frequency.setValueAtTime(bass.note, this.audioContext.currentTime + bass.delay);

                // Low-pass filter for punchy bass
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(120, this.audioContext.currentTime + bass.delay);
                filter.Q.setValueAtTime(3, this.audioContext.currentTime + bass.delay);

                gain.gain.setValueAtTime(0, this.audioContext.currentTime + bass.delay);
                gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + bass.delay + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + bass.delay + bass.duration);

                osc.start(this.audioContext.currentTime + bass.delay);
                osc.stop(this.audioContext.currentTime + bass.delay + bass.duration);
            }
        });

        // Extended EDM-style drum pattern for full track
        const drum_pattern = [
            // Section 1 - Standard 4/4 beat (4 bars)
            {type: 'kick', time: 0},
            {type: 'hihat', time: 0.25},
            {type: 'snare', time: 0.5},
            {type: 'hihat', time: 0.75},
            {type: 'kick', time: 1.0},
            {type: 'hihat', time: 1.25},
            {type: 'snare', time: 1.5},
            {type: 'hihat', time: 1.75},

            {type: 'kick', time: 2.0},
            {type: 'hihat', time: 2.25},
            {type: 'snare', time: 2.5},
            {type: 'hihat', time: 2.75},
            {type: 'kick', time: 3.0},
            {type: 'hihat', time: 3.25},
            {type: 'snare', time: 3.5},
            {type: 'hihat', time: 3.75},

            // Section 2 - More intense (4 bars)
            {type: 'kick', time: 4.0},
            {type: 'hihat', time: 4.125},
            {type: 'hihat', time: 4.25},
            {type: 'snare', time: 4.5},
            {type: 'hihat', time: 4.625},
            {type: 'kick', time: 4.75},
            {type: 'hihat', time: 4.875},

            {type: 'kick', time: 5.0},
            {type: 'hihat', time: 5.25},
            {type: 'snare', time: 5.5},
            {type: 'hihat', time: 5.75},

            // Section 3 - Breakdown (minimal drums)
            {type: 'kick', time: 6.0},
            {type: 'kick', time: 7.0},

            // Section 4 - Final climax (intense)
            {type: 'kick', time: 8.0},
            {type: 'hihat', time: 8.125},
            {type: 'kick', time: 8.25},
            {type: 'hihat', time: 8.375},
            {type: 'snare', time: 8.5},
            {type: 'hihat', time: 8.625},
            {type: 'snare', time: 8.75},
            {type: 'hihat', time: 8.875},

            {type: 'kick', time: 9.0},
            {type: 'snare', time: 9.25},
            {type: 'kick', time: 9.5},
            {type: 'snare', time: 9.75},
            {type: 'kick', time: 10.0},
            {type: 'snare', time: 10.25},
            {type: 'kick', time: 10.5},
            {type: 'crash', time: 10.75}
        ];

        drum_pattern.forEach(drum => {
            const noise = this.audioContext.createBufferSource();
            const buffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < 4096; i++) {
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
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(60, startTime);
                    filter.Q.setValueAtTime(2, startTime);
                    gain.gain.setValueAtTime(0.3, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
                    break;
                case 'snare':
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(250, startTime);
                    filter.Q.setValueAtTime(1, startTime);
                    gain.gain.setValueAtTime(0.2, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                    break;
                case 'hihat':
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(8000, startTime);
                    filter.Q.setValueAtTime(0.5, startTime);
                    gain.gain.setValueAtTime(0.08, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
                    break;
            }

            noise.start(startTime);
            noise.stop(startTime + 0.2);
        });

        // Loop the extended EDM track - 11 second cycle with full progression
        this.scheduleGameplayLoop(11000);
    }

    // World 4 - bold, open mountain anthem in G major: triangle lead over a marching bass
    playMountainTrack() {
        if (!this.audioContext || !this.gameplayMusicPlaying) return;
        const ac = this.audioContext;
        const now = ac.currentTime;

        const playTone = (freq, start, duration, type, volume) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(this.getMusicBus('gameplay'));
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(volume, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.start(start);
            osc.stop(start + duration + 0.02);
        };

        // Soaring lead - fits inside the 4 second loop
        const melody = [
            { note: 392, time: 0.0, duration: 0.45 },  // G4
            { note: 494, time: 0.5, duration: 0.45 },  // B4
            { note: 587, time: 1.0, duration: 0.7 },   // D5
            { note: 659, time: 1.75, duration: 0.25 }, // E5
            { note: 587, time: 2.0, duration: 0.45 },  // D5
            { note: 494, time: 2.5, duration: 0.45 },  // B4
            { note: 523, time: 3.0, duration: 0.45 },  // C5
            { note: 440, time: 3.5, duration: 0.45 }   // A4
        ];
        melody.forEach(n => playTone(n.note, now + n.time, n.duration, 'triangle', 0.12));
        // Echo an octave down for a big open sound
        melody.forEach(n => playTone(n.note / 2, now + n.time + 0.02, n.duration, 'square', 0.03));

        // Marching bass, one root per beat pair: G, G, C, D
        const roots = [98, 98, 131, 147];
        for (let i = 0; i < 8; i++) {
            playTone(roots[Math.floor(i / 2)], now + i * 0.5, 0.4, 'sawtooth', 0.05);
        }

        // Tom-style drums from filtered noise: kick on 1 and 3, snare roll at the end
        const drums = [0, 1, 2, 3].map(beat => ({ type: 'kick', time: beat }));
        [0.5, 1.5, 2.5, 3.5, 3.75].forEach(time => drums.push({ type: 'snare', time }));
        drums.forEach(drum => {
            const noise = ac.createBufferSource();
            const buffer = ac.createBuffer(1, ac.sampleRate * 0.1, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            const filter = ac.createBiquadFilter();
            const gain = ac.createGain();
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.getMusicBus('gameplay'));
            const start = now + drum.time;
            if (drum.type === 'kick') {
                filter.frequency.setValueAtTime(100, start);
                gain.gain.setValueAtTime(0.22, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
            } else {
                filter.frequency.setValueAtTime(1500, start);
                gain.gain.setValueAtTime(0.1, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.09);
            }
            noise.start(start);
            noise.stop(start + 0.1);
        });

        this.scheduleGameplayLoop(4000);
    }

    // World 3 - funky construction-site groove in D minor with clanging metal hits
    playConstructionTrack() {
        if (!this.audioContext || !this.gameplayMusicPlaying) return;
        const ac = this.audioContext;
        const now = ac.currentTime;

        const playTone = (freq, start, duration, type, volume) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(volume, start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.start(start);
            osc.stop(start + duration + 0.02);
        };

        // Syncopated lead riff
        const melody = [
            { note: 587, time: 0.0, duration: 0.2 },  // D5
            { note: 698, time: 0.25, duration: 0.2 }, // F5
            { note: 784, time: 0.5, duration: 0.15 }, // G5
            { note: 698, time: 0.75, duration: 0.2 }, // F5
            { note: 587, time: 1.0, duration: 0.4 },  // D5
            { note: 523, time: 1.5, duration: 0.2 },  // C5
            { note: 587, time: 1.75, duration: 0.2 }, // D5
            { note: 880, time: 2.0, duration: 0.2 },  // A5
            { note: 784, time: 2.25, duration: 0.2 }, // G5
            { note: 698, time: 2.5, duration: 0.15 }, // F5
            { note: 659, time: 2.75, duration: 0.2 }, // E5
            { note: 587, time: 3.0, duration: 0.5 },  // D5
            { note: 440, time: 3.5, duration: 0.2 },  // A4
            { note: 523, time: 3.75, duration: 0.2 }  // C5
        ];
        melody.forEach(n => playTone(n.note, now + n.time, n.duration, 'square', 0.06));

        // Bouncing octave bass, like a jackhammer
        const bassRoots = [147, 147, 175, 131]; // D3, D3, F3, C3 - one per beat pair
        for (let i = 0; i < 16; i++) {
            const root = bassRoots[Math.floor(i / 4)];
            const freq = i % 2 === 0 ? root / 2 : root;
            playTone(freq, now + i * 0.25, 0.2, 'sawtooth', 0.05);
        }

        // Metal clang on the off-beats - two detuned high square waves
        [0.5, 1.5, 2.5, 3.5].forEach(time => {
            playTone(1760, now + time, 0.12, 'square', 0.025);
            playTone(2489, now + time, 0.1, 'square', 0.02);
        });

        // Drums from filtered noise
        const drums = [];
        for (let beat = 0; beat < 8; beat++) {
            drums.push({ type: beat % 2 === 0 ? 'kick' : 'snare', time: beat * 0.5 });
            drums.push({ type: 'hihat', time: beat * 0.5 + 0.25 });
        }
        drums.push({ type: 'kick', time: 3.75 });
        drums.forEach(drum => {
            const noise = ac.createBufferSource();
            const buffer = ac.createBuffer(1, ac.sampleRate * 0.1, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            const filter = ac.createBiquadFilter();
            const gain = ac.createGain();
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);
            const start = now + drum.time;
            if (drum.type === 'kick') {
                filter.frequency.setValueAtTime(90, start);
                gain.gain.setValueAtTime(0.22, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
            } else if (drum.type === 'snare') {
                filter.frequency.setValueAtTime(2000, start);
                gain.gain.setValueAtTime(0.12, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.09);
            } else {
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(7000, start);
                gain.gain.setValueAtTime(0.05, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.03);
            }
            noise.start(start);
            noise.stop(start + 0.1);
        });

        // Loop the track - 4 second cycle
        this.scheduleGameplayLoop(4000);
    }

    startBossMusic() {
        if (!this.audioContext || this.bossMusicPlaying || !this.audioUnlocked) return;
        
        // Stop regular gameplay music
        this.stopGameplayMusic();
        
        this.bossMusicPlaying = true;
        this.bossActive = true;
        this.playBossTrack();
    }
    
    stopBossMusic() {
        if (this.bossMusic) {
            this.bossMusic.stop();
            this.bossMusic = null;
        }
        if (this.bossMusicGain) {
            this.bossMusicGain = null;
        }
        this.bossMusicPlaying = false;
        this.bossActive = false;
        
        // Resume normal gameplay music ONLY if we're in playing state and no boss is present
        const bossPresent = this.enemies.some(enemy => isBossType(enemy.type));
        if (this.gameState === 'playing' && !this.gameplayMusicPlaying && !bossPresent) {
            this.startGameplayMusic();
        }
    }
    
    playBossTrack() {
        if (!this.audioContext || !this.bossMusicPlaying) return;
        
        // Epic, intense boss battle music - fast-paced and dramatic
        const melody = [
            {note: 277, duration: 0.2}, // C#4
            {note: 311, duration: 0.2}, // D#4
            {note: 349, duration: 0.2}, // F4
            {note: 415, duration: 0.2}, // G#4
            {note: 466, duration: 0.2}, // A#4
            {note: 554, duration: 0.2}, // C#5
            {note: 622, duration: 0.2}, // D#5
            {note: 698, duration: 0.2}, // F5
            // Descending power chord
            {note: 830, duration: 0.3}, // G#5
            {note: 698, duration: 0.3}, // F5
            {note: 554, duration: 0.3}, // C#5
            {note: 415, duration: 0.4}, // G#4
            // Fast arpeggios
            {note: 277, duration: 0.15}, // C#4
            {note: 349, duration: 0.15}, // F4
            {note: 415, duration: 0.15}, // G#4
            {note: 554, duration: 0.15}, // C#5
            {note: 277, duration: 0.15}, // C#4
            {note: 349, duration: 0.15}, // F4
            {note: 415, duration: 0.15}, // G#4
            {note: 554, duration: 0.15}, // C#5
        ];
        
        // Dramatic bass line
        const bassLine = [
            {note: 138, duration: 0.4}, // C#3
            {note: 174, duration: 0.4}, // F3
            {note: 207, duration: 0.4}, // G#3
            {note: 174, duration: 0.4}, // F3
            {note: 138, duration: 0.4}, // C#3
            {note: 155, duration: 0.4}, // D#3
            {note: 138, duration: 0.8}, // C#3
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        // Play powerful bass line
        bassLine.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.note, currentTime);
            
            gain.gain.setValueAtTime(0.2, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.1, currentTime + note.duration - 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Reset time for melody
        currentTime = this.audioContext.currentTime + 0.1;
        
        // Play intense melody
        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(note.note, currentTime);
            
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.15, currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Schedule next loop - faster for intensity
        setTimeout(() => {
            if (this.bossActive && this.bossMusicPlaying) {
                this.playBossTrack();
            }
        }, 2000);
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

    // Roll a powerup drop for a killed enemy. Returns one of:
    //   'heart' | 'rapidfire' | 'shield' | 'golden' | null
    // World 1 is more generous; world 2+ tightens up.
    // Then post-processes: if the player is at full HP and a heart was rolled,
    // convert it to a useful powerup instead of a wasted pickup.
    rollEnemyDrop(enemy) {
        const r = Math.random();
        const w1 = this.currentWorld === 1;
        let drop = null;

        // Bosses always drop a golden heart.
        if (isBossType(enemy.type)) {
            drop = 'golden';
        }
        // Tower: always drops something in W1; usually in later worlds.
        else if (enemy.type === 6) {
            if (w1) {
                if (r < 0.50) drop = 'heart';
                else if (r < 0.80) drop = 'shield';
                else drop = 'golden';
            } else {
                if (r < 0.35) drop = 'heart';
                else if (r < 0.60) drop = 'shield';
                else if (r < 0.70) drop = 'golden';
            }
        }
        // Tank
        else if (enemy.type === 2) {
            if (w1) {
                if (r < 0.40) drop = 'heart';
                else if (r < 0.55) drop = 'rapidfire';
                else if (r < 0.65) drop = 'shield';
            } else {
                if (r < 0.15) drop = 'heart';
                else if (r < 0.23) drop = 'rapidfire';
                else if (r < 0.28) drop = 'shield';
            }
        }
        // Sniper
        else if (enemy.type === 3) {
            if (w1) {
                if (r < 0.35) drop = 'heart';
                else if (r < 0.55) drop = 'rapidfire';
            } else {
                if (r < 0.15) drop = 'heart';
                else if (r < 0.25) drop = 'rapidfire';
            }
        }
        // Soldiers (type 0, 1) — common, so small per-kill chance.
        // With ~20 soldiers per level, ~16% drop rate yields ~3 powerups/level.
        else if (enemy.type === 0 || enemy.type === 1) {
            if (w1) {
                if (r < 0.12) drop = 'heart';
                else if (r < 0.15) drop = 'rapidfire';
                else if (r < 0.16) drop = 'shield';
            } else {
                if (r < 0.04) drop = 'heart';
                else if (r < 0.05) drop = 'rapidfire';
            }
        }

        // Smart hearts: don't waste a heart on a full-HP player —
        // convert to a useful powerup instead so kills still feel rewarding.
        if (drop === 'heart' && this.player.health >= this.player.maxHealth) {
            drop = Math.random() < 0.5 ? 'rapidfire' : 'shield';
        }
        return drop;
    }

    // Spawn a powerup at the enemy's death position.
    dropPowerup(type, enemy) {
        if (!type) return;
        const cx = enemy.x + enemy.width / 2 - 12;
        // Float drop near the top of the enemy's body, clamped to a sane band
        const cy = Math.max(140, Math.min(260, enemy.y));
        if (type === 'heart')      this.powerups.push(new HeartPowerup(cx, cy, this.assets));
        else if (type === 'rapidfire') this.powerups.push(new RapidFirePowerup(cx, cy, this.assets));
        else if (type === 'shield')    this.powerups.push(new ShieldPowerup(cx, cy, this.assets));
        else if (type === 'golden')    this.powerups.push(new GoldenHeartPowerup(cx - 2, cy, this.assets));
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
            // The home screen only ever plays the title tune
            if (this.gameplayMusicPlaying) this.stopGameplayMusic();
            if (!this.titleMusicPlaying && this.audioUnlocked) {
                this.startTitleMusic();
            }
            this.renderTitleScreen();
            return;
        }
        
        if (this.gameState === 'story') {
            // Popcorn's villain slides play the popcorn track, which doesn't set storyMusicPlaying -
            // check it too, or the music restarts every frame and the game bogs down
            if (!this.storyMusicPlaying && !this.popcornMusicPlaying && this.audioUnlocked) {
                this.startStoryMusic(this.currentStorySlide);
            }
            this.renderStoryScreen();
            return;
        }
        
        if (this.gameState === 'heliIntro') {
            this.renderHeliIntro();
            return;
        }

        if (this.gameState === 'bunkerIntro') {
            this.renderBunkerIntro();
            return;
        }

        if (this.gameState === 'trainIntro') {
            this.renderTrainIntro();
            return;
        }

        if (this.gameState === 'campIntro') {
            this.renderCampIntro();
            return;
        }

        if (this.gameState === 'bossCutscene') {
            // Same music handling as story mode
            if (!this.storyMusicPlaying && !this.popcornMusicPlaying && this.audioUnlocked) {
                this.startStoryMusic(0); // Villain slide
            }
            this.renderBossCutscene();
            return;
        }
        
        if (this.gameState === 'victory') {
            this.renderVictoryScreen();
            return;
        }
        
        if (this.gameState === 'levelComplete') {
            this.renderLevelCompleteScreen();
            return;
        }
        
        if (this.gameState === 'levelBuilder') {
            this.renderLevelBuilder();
            return;
        }
        
        // Draw grassy plain background
        this.renderBackground();
        
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw ground grass texture
        this.renderGround();

        // Render bunkers (background structures, behind characters)
        this.bunkers.forEach(bunker => bunker.render(this.ctx));

        // Render force field barriers at level edges
        this.renderForceFields();

        // Crashed helicopter (World 1 Level 1 objective)
        this.renderHeliWreck();

        // Wrecked monorail and the waiting crew (World 4 Level 1 start)
        this.renderMonorailCamp();

        this.player.render(this.ctx);
        
        // Render bullets
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        
        // Render enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Render powerups
        this.powerups.forEach(powerup => powerup.render(this.ctx));
        
        // Render sandbags
        this.sandbags.forEach(sandbag => sandbag.render(this.ctx));
        
        // Render platforms
        this.platforms.forEach(platform => platform.render(this.ctx));
        
        // Render barbed wire and wooden crates
        this.barbedWire.forEach(wire => wire.render(this.ctx));
        this.woodenCrates.forEach(crate => crate.render(this.ctx));
        this.warehouseCrates.forEach(crate => crate.render(this.ctx));
        this.destructibleCrates.forEach(crate => crate.render(this.ctx));
        
        // Render mines
        this.mines.forEach(mine => mine.render(this.ctx));
        
        // Render explosions
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        
        // Render tank remnants
        this.tankRemnants.forEach(remnant => remnant.render(this.ctx));
        
        // Render enemy bullets
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.artilleryShells.forEach(shell => shell.render(this.ctx));
        
        this.ctx.restore();
        
        // Render UI (hearts and score) - not affected by camera
        this.renderUI();
        this.renderScore();
        this.renderLevelProgress();
        this.renderHeliObjective();
        this.renderBossHealthUI();
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
    
    renderBossHealthUI() {
        const ctx = this.ctx;
        
        // Find active boss enemies
        const bosses = this.enemies.filter(enemy => isBossType(enemy.type) && enemy.health > 0);

        if (bosses.length === 0) return;
        
        const boss = bosses[0]; // Show first boss if multiple exist
        
        // Boss health bar at top center of screen
        ctx.save();
        
        const barWidth = 400;
        const barHeight = 20;
        const barX = (this.canvas.width - barWidth) / 2;
        const barY = 20;
        
        // Boss name/title
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        const bossTitle = boss.type === 12 ? 'REACTOR TITAN' : boss.type === 9 ? 'CYBORG YETI' : boss.type === 7 ? 'ARTILLERY TRUCK' : 'BOSS TANK';
        ctx.strokeText(bossTitle, this.canvas.width / 2, barY - 8);
        ctx.fillText(bossTitle, this.canvas.width / 2, barY - 8);
        
        // Health bar background
        ctx.fillStyle = '#444444';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health bar fill
        const healthPercent = boss.health / boss.maxHealth;
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Health bar border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Health text
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 14px Arial';
        const healthText = `${boss.health} / ${boss.maxHealth}`;
        ctx.strokeText(healthText, this.canvas.width / 2, barY + barHeight + 18);
        ctx.fillText(healthText, this.canvas.width / 2, barY + barHeight + 18);
        
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
        
        // Title text - different for victory vs death
        if (this.wonGame) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.fillText('VICTORY!', this.canvas.width / 2, 120);
            
            this.ctx.fillStyle = '#00FF00';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 150);
        } else {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 150);
        }
        
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
                // Show audio enable button on the right side
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
                this.ctx.fillRect(this.canvas.width - 220, 180, 200, 40);
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.canvas.width - 220, 180, 200, 40);
                
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillText('TAP TO ENABLE AUDIO', this.canvas.width - 120, 205);
                this.ctx.restore();
            } else {
                // Mobile tip on the right side
                this.ctx.font = 'bold 12px Arial';
                this.ctx.fillStyle = '#FFFF00';
                this.ctx.fillText('Best experience in landscape mode', this.canvas.width - 120, 195);
            }
        } else {
            // Desktop controls below TAP TO START
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText('Arrow keys to move | X to shoot | Space to jump', this.canvas.width / 2, 220);
            
            if (!this.audioUnlocked) {
                // Blink a reminder until the first key/click turns the sound on
                if (Math.floor(Date.now() / 600) % 2 === 0) {
                    const hint = '\u266A Press any key or click to turn on the music \u266A';
                    this.ctx.save();
                    this.ctx.globalAlpha = 1;
                    this.ctx.font = 'bold 18px Arial';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeStyle = '#3A2200';
                    this.ctx.strokeText(hint, this.canvas.width / 2, 152);
                    this.ctx.fillStyle = '#FFD24A';
                    this.ctx.fillText(hint, this.canvas.width / 2, 152);
                    this.ctx.restore();
                }
            }
            
            // World-jump shortcut hint (local play only), in the corner clear of the high scores box
            if (isLocalPlay()) {
                this.ctx.fillStyle = '#FFFF00';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('Press 1-4 to jump to a world | T for the train scene', 12, this.canvas.height - 10);
            }
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
    
    renderStoryScreen() {
        const slide = this.storySlides[this.currentStorySlide];
        const t = this.storyTime;
        
        // Dramatic animated gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        const colorShift = Math.sin(t * 0.5) * 0.3;
        gradient.addColorStop(0, slide.backgroundGradient[0]);
        gradient.addColorStop(1, slide.backgroundGradient[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dramatic animated effects based on slide type
        this.renderStoryEffects(slide.effects, t);
        
        // Character sprites with motion
        if (slide.showTofu) {
            this.renderStoryTofu(t, slide);
        }
        
        if (slide.showPopcorn) {
            this.renderStoryPopcorn(t);
        }
        
        if (slide.showEnemies) {
            this.renderStoryEnemies(t);
        }
        
        // Cinematic bars for widescreen effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, 40);
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        
        this.ctx.textAlign = 'center';
        
        // Dramatic title with anime-style effects
        this.ctx.save();
        const titlePulse = 1 + Math.sin(t * 3) * 0.1;
        this.ctx.scale(titlePulse, titlePulse);
        this.ctx.translate(this.canvas.width / (2 * titlePulse), 80 / titlePulse);
        
        // Multiple shadow layers for dramatic effect
        this.ctx.shadowColor = '#FF0000';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(slide.title, 0, 0);
        
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillText(slide.title, 0, 0);
        this.ctx.restore();
        
        // Story text with dramatic anime-style effects based on speaker
        const textRevealSpeed = 40; // characters per second
        const maxChars = Math.floor(t * textRevealSpeed);
        const lines = slide.text.split('\n');
        let charCount = 0;
        
        // Different styles based on who's speaking
        let primaryColor = '#FFFFFF';
        let glowColor = '#00FFFF';
        let shadowIntensity = 3;
        let fontSize = '18px';
        
        if (slide.speaker === 'popcorn') {
            primaryColor = '#FFD700';
            glowColor = '#8B008B';
            shadowIntensity = 15;
            fontSize = '20px';
        } else if (slide.speaker === 'tofu') {
            primaryColor = '#FFFFFF';
            glowColor = '#FFD700';
            shadowIntensity = 10;
            fontSize = '19px';
        } else if (slide.speaker === 'both') {
            // Alternating colors for confrontation
            const colorFlash = Math.sin(t * 8) > 0;
            primaryColor = colorFlash ? '#FFD700' : '#DC143C';
            glowColor = colorFlash ? '#DC143C' : '#FFD700';
            shadowIntensity = 12;
            fontSize = '21px';
        }
        
        this.ctx.font = `bold ${fontSize} Arial`;
        
        lines.forEach((line, lineIndex) => {
            if (charCount < maxChars) {
                const remainingChars = maxChars - charCount;
                const visibleText = line.substring(0, Math.min(line.length, remainingChars));
                
                const textY = 200 + (lineIndex * 30);
                
                // Special flashing effect for villain dialogue
                if (slide.speaker === 'popcorn') {
                    const flashIntensity = Math.sin(t * 6) * 0.5 + 0.5;
                    const scale = 1 + flashIntensity * 0.2;
                    
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, textY);
                    this.ctx.scale(scale, scale);
                    
                    // Multiple shadow layers for evil effect
                    this.ctx.shadowColor = glowColor;
                    this.ctx.shadowBlur = shadowIntensity + flashIntensity * 10;
                    this.ctx.fillStyle = glowColor;
                    this.ctx.fillText(visibleText, 0, 0);
                    
                    this.ctx.shadowBlur = shadowIntensity;
                    this.ctx.fillStyle = primaryColor;
                    this.ctx.fillText(visibleText, 0, 0);
                    
                    this.ctx.restore();
                } else if (slide.speaker === 'both') {
                    // Confrontation text with energy crackling
                    this.ctx.save();
                    const shake = Math.sin(t * 15) * 2;
                    this.ctx.translate(this.canvas.width / 2 + shake, textY + Math.sin(t * 12) * 1);
                    
                    this.ctx.shadowColor = glowColor;
                    this.ctx.shadowBlur = shadowIntensity;
                    this.ctx.fillStyle = glowColor;
                    this.ctx.fillText(visibleText, 0, 0);
                    
                    this.ctx.shadowBlur = 5;
                    this.ctx.fillStyle = primaryColor;
                    this.ctx.fillText(visibleText, 0, 0);
                    
                    this.ctx.restore();
                } else {
                    // Normal heroic text with gentle glow
                    this.ctx.shadowColor = glowColor;
                    this.ctx.shadowBlur = shadowIntensity;
                    this.ctx.fillStyle = glowColor;
                    this.ctx.fillText(visibleText, this.canvas.width / 2, textY);
                    
                    this.ctx.shadowBlur = 3;
                    this.ctx.fillStyle = primaryColor;
                    this.ctx.fillText(visibleText, this.canvas.width / 2, textY);
                }
            }
            charCount += line.length + 1; // +1 for newline
        });
        
        // Action lines and speed lines for motion effect
        if (slide.effects === 'battle' || slide.effects === 'heroic') {
            this.renderActionLines(t);
        }
        
        // Navigation instructions with pulse effect
        const instructionAlpha = 0.7 + Math.sin(t * 4) * 0.3;
        this.ctx.globalAlpha = instructionAlpha;
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#FFFF00';
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            this.ctx.fillText('TAP to continue', this.canvas.width / 2, this.canvas.height - 50);
        } else {
            this.ctx.fillText('SPACE to continue • ← → to navigate • ESC for title', this.canvas.width / 2, this.canvas.height - 50);
        }
        this.ctx.globalAlpha = 1;
        
        // Progress indicator with anime-style design
        this.renderStoryProgress();
        
        // Reset all canvas properties to prevent affecting gameplay
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
        this.ctx.textAlign = 'left';
    }
    
    renderStoryEffects(effectType, t) {
        this.ctx.save();
        
        switch (effectType) {
            case 'invasion':
                // Dark swirling energy
                this.ctx.globalAlpha = 0.3;
                for (let i = 0; i < 8; i++) {
                    const angle = (t + i) * 0.5;
                    const x = this.canvas.width / 2 + Math.cos(angle) * (50 + i * 10);
                    const y = this.canvas.height / 2 + Math.sin(angle) * (30 + i * 5);
                    const size = 20 + Math.sin(t * 2 + i) * 10;
                    
                    this.ctx.fillStyle = '#800080';
                    this.ctx.fillRect(x - size/2, y - size/2, size, size);
                }
                break;
                
            case 'heroic':
                // Golden aura and light rays
                this.ctx.globalAlpha = 0.4;
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                
                // Rotating light rays
                for (let i = 0; i < 12; i++) {
                    const angle = (t * 2 + i * Math.PI / 6);
                    const rayLength = 200 + Math.sin(t * 3) * 50;
                    
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.lineTo(
                        centerX + Math.cos(angle) * rayLength,
                        centerY + Math.sin(angle) * rayLength
                    );
                    this.ctx.stroke();
                }
                break;
                
            case 'battle':
                // Explosive energy and lightning
                this.ctx.globalAlpha = 0.5;
                for (let i = 0; i < 15; i++) {
                    const x = Math.random() * this.canvas.width;
                    const y = Math.random() * this.canvas.height;
                    const intensity = Math.sin(t * 10 + i) * 0.5 + 0.5;
                    
                    if (intensity > 0.7) {
                        this.ctx.strokeStyle = Math.random() > 0.5 ? '#FF0000' : '#FFFFFF';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
                        this.ctx.stroke();
                    }
                }
                break;
                
            case 'villain':
                // Dark evil energy and purple lightning
                this.ctx.globalAlpha = 0.6;
                
                // Swirling dark vortex
                for (let i = 0; i < 12; i++) {
                    const angle = (t * 1.5 + i * Math.PI / 6);
                    const radius = 80 + Math.sin(t * 2 + i) * 30;
                    const x = this.canvas.width / 2 + Math.cos(angle) * radius;
                    const y = this.canvas.height / 2 + Math.sin(angle) * radius;
                    
                    this.ctx.fillStyle = `hsl(${280 + Math.sin(t + i) * 20}, 70%, 30%)`;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 8 + Math.sin(t * 4 + i) * 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Evil lightning strikes
                this.ctx.globalAlpha = 0.8;
                for (let i = 0; i < 6; i++) {
                    if (Math.sin(t * 8 + i * 2) > 0.6) {
                        this.ctx.strokeStyle = '#8B008B';
                        this.ctx.lineWidth = 3;
                        this.ctx.shadowColor = '#8B008B';
                        this.ctx.shadowBlur = 15;
                        
                        const startX = this.canvas.width * 0.2 + Math.random() * this.canvas.width * 0.6;
                        const startY = 50;
                        const endX = startX + (Math.random() - 0.5) * 200;
                        const endY = this.canvas.height - 50;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(startX, startY);
                        // Zigzag lightning effect
                        for (let j = 1; j < 8; j++) {
                            const segmentY = startY + (endY - startY) * (j / 8);
                            const segmentX = startX + (endX - startX) * (j / 8) + (Math.random() - 0.5) * 40;
                            this.ctx.lineTo(segmentX, segmentY);
                        }
                        this.ctx.stroke();
                    }
                }
                break;
                
            case 'confrontation':
                // Explosive clash effects - red vs gold
                this.ctx.globalAlpha = 0.4;
                
                // Energy clash in the center
                const clashCenterX = this.canvas.width / 2;
                const clashCenterY = this.canvas.height / 2;
                const clashIntensity = Math.sin(t * 6) * 0.5 + 0.5;
                
                // Red energy from right (villain side)
                for (let i = 0; i < 8; i++) {
                    const angle = (t * 3 + i * Math.PI / 4);
                    const radius = 60 + clashIntensity * 40;
                    const x = clashCenterX + 100 + Math.cos(angle) * radius;
                    const y = clashCenterY + Math.sin(angle) * radius;
                    
                    this.ctx.fillStyle = '#DC143C';
                    this.ctx.shadowColor = '#DC143C';
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 6 + clashIntensity * 8, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Gold energy from left (hero side)
                for (let i = 0; i < 8; i++) {
                    const angle = (t * -3 + i * Math.PI / 4);
                    const radius = 60 + clashIntensity * 40;
                    const x = clashCenterX - 100 + Math.cos(angle) * radius;
                    const y = clashCenterY + Math.sin(angle) * radius;
                    
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.shadowColor = '#FFD700';
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 6 + clashIntensity * 8, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Lightning clash in center
                if (clashIntensity > 0.7) {
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 4;
                    this.ctx.shadowColor = '#FFFFFF';
                    this.ctx.shadowBlur = 25;
                    
                    for (let i = 0; i < 5; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const length = 50 + Math.random() * 50;
                        this.ctx.beginPath();
                        this.ctx.moveTo(clashCenterX, clashCenterY);
                        this.ctx.lineTo(
                            clashCenterX + Math.cos(angle) * length,
                            clashCenterY + Math.sin(angle) * length
                        );
                        this.ctx.stroke();
                    }
                }
                break;
        }
        
        this.ctx.restore();
    }
    
    renderStoryTofu(t, slide = null) {
        if (!this.assets.tofuSprite) return;
        
        const centerY = this.canvas.height / 2;
        let centerX = this.canvas.width / 2 - 60;
        let scale = 1.2 + Math.sin(t * 3) * 0.1;
        
        // Pop in dramatically and stay in position  
        const popIn = Math.min(1, t / 10); // Pop in over 10 frames
        // Smooth entrance scaling - no sudden size change
        const entranceScale = popIn < 0.8 ? (popIn / 0.8) * 0.3 + 0.7 : 1;
        
        // For confrontation scenes, position on left side
        if (slide && (slide.effects === 'confrontation' || slide.speaker === 'narrator')) {
            centerX = this.canvas.width / 2 - 120; // Fixed position on left side
            scale = (1.8 + Math.sin(t * 3) * 0.2) * entranceScale; // Larger for confrontation
        } else {
            scale = (scale) * entranceScale;
        }
        
        // Heroic floating motion
        const floatY = Math.sin(t * 2) * 12;
        const glowIntensity = Math.sin(t * 4) * 0.3 + 0.7;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY + floatY);
        this.ctx.scale(scale, scale);
        
        // Enhanced heroic glow effect
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 25 * glowIntensity;
        this.ctx.globalAlpha = 0.95;
        
        // Draw Tofu sprite
        const spriteSize = 80;
        this.ctx.drawImage(
            this.assets.tofuSprite, 
            -spriteSize/2, 
            -spriteSize/2, 
            spriteSize, 
            spriteSize
        );
        
        this.ctx.restore();
        
        // Additional heroic effects for confrontation
        if (slide && (slide.effects === 'confrontation' || slide.speaker === 'narrator') && t > 20) {
            // Golden energy aura
            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            
            for (let i = 0; i < 8; i++) {
                const angle = (t * -2 + i * Math.PI / 4);
                const radius = 70 + Math.sin(t * 3 + i) * 15;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + floatY + Math.sin(angle) * radius;
                
                this.ctx.fillStyle = `hsl(${45 + Math.sin(t + i) * 10}, 100%, 60%)`;
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 20;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6 + Math.sin(t * 4 + i) * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }
    
    renderStoryEnemies(t) {
        // Clean soldier sprites with dramatic movement and red glow
        const soldiers = [
            { sprite: this.assets.soldier1Sprite, x: this.canvas.width - 140, size: 70 },
            { sprite: this.assets.soldier2Sprite, x: this.canvas.width - 220, size: 80 }
        ];
        
        soldiers.forEach((soldier, index) => {
            if (!soldier.sprite) return;
            
            const centerY = this.canvas.height / 2 + 30;
            const menacingBob = Math.sin(t * 1.5 + index) * 8;
            const redGlow = Math.sin(t * 4 + index) * 0.4 + 0.6;
            
            this.ctx.save();
            this.ctx.translate(soldier.x, centerY + menacingBob);
            
            // Red menacing glow around the soldier
            this.ctx.shadowColor = '#FF0000';
            this.ctx.shadowBlur = 25 * redGlow;
            this.ctx.globalAlpha = 0.9;
            
            // Draw the actual soldier sprite cleanly
            this.ctx.drawImage(
                soldier.sprite,
                -soldier.size/2,
                -soldier.size/2,
                soldier.size,
                soldier.size
            );
            
            this.ctx.restore();
        });
    }
    
    renderStoryPopcorn(t) {
        if (!this.assets.popcornSprite) return;
        
        // Dramatic popcorn villain - oversized and menacing
        const centerX = this.canvas.width / 2 + 120; // Offset to right side
        const centerY = this.canvas.height / 2 - 20;
        
        // Pop in dramatically and stay in position
        const popIn = Math.min(1, t / 10); // Pop in over 10 frames
        const actualX = this.canvas.width / 2 + 120; // Fixed position on right side
        // Smooth entrance scaling - no sudden size change
        const entranceScale = popIn < 0.8 ? (popIn / 0.8) * 0.3 + 0.7 : 1;
        
        // Menacing floating and scaling - BIGGER
        const scale = (2.5 + Math.sin(t * 2.5) * 0.3) * entranceScale; // Even larger and more dramatic
        const floatY = Math.sin(t * 1.8) * 15;
        const evilPulse = Math.sin(t * 6) * 0.3 + 0.7;
        
        this.ctx.save();
        this.ctx.translate(actualX, centerY + floatY);
        this.ctx.scale(scale, scale);
        
        // Evil purple/dark glow around sprite
        this.ctx.shadowColor = '#8B008B';
        this.ctx.shadowBlur = 40 * evilPulse;
        this.ctx.globalAlpha = 0.95;
        
        // Draw the actual popcorn sprite with evil aura
        const spriteSize = 100; // Massive villain size
        this.ctx.drawImage(
            this.assets.popcornSprite,
            -spriteSize / 2,
            -spriteSize / 2,
            spriteSize,
            spriteSize
        );
        
        this.ctx.restore();
        
        // Additional evil effects around the popcorn sprite
        if (popIn > 0.6) {
            // Dark energy swirls
            this.ctx.save();
            this.ctx.globalAlpha = 0.6;
            
            for (let i = 0; i < 8; i++) {
                const angle = (t * 2 + i * Math.PI / 4);
                const radius = 60 + Math.sin(t * 3 + i) * 20;
                const x = actualX + Math.cos(angle) * radius;
                const y = centerY + floatY + Math.sin(angle) * radius;
                
                this.ctx.fillStyle = `hsl(${280 + Math.sin(t + i) * 20}, 70%, 40%)`;
                this.ctx.shadowColor = '#8B008B';
                this.ctx.shadowBlur = 15;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8 + Math.sin(t * 4 + i) * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
        
        // Lightning effects around popcorn
        if (popIn > 0.8) {
            this.ctx.save();
            this.ctx.strokeStyle = '#8B008B';
            this.ctx.shadowColor = '#8B008B';
            this.ctx.shadowBlur = 15;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = 0.8;
            
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + t * 2;
                const radius = 90 + Math.sin(t * 3 + i) * 25;
                const startX = actualX + Math.cos(angle) * radius;
                const startY = centerY + Math.sin(angle) * radius + floatY;
                const endX = actualX + Math.cos(angle) * (radius + 40);
                const endY = centerY + Math.sin(angle) * (radius + 40) + floatY;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        }
    }
    
    // Helicopter drop-off intro: heli flies in, Tofu ropes down, soldiers shoot the heli,
    // it limps off and crash-lands far away. Finding the wreck is World 1 Level 1's objective.
    startHeliIntro() {
        this.gameState = 'heliIntro';
        this.camera.x = 0;
        this.heliIntro = {
            startTime: Date.now(),
            duration: 13,
            smoke: [],
            hitSoundPlayed: false,
            crashSoundPlayed: false,
            shotsFired: 0
        };
        const level = this.levelData[1][1];
        const wreckX = level.endX - 200;
        this.heliWreck = {
            x: wreckX, world: 1, level: 1,
            found: false, foundTime: 0,
            rescued: false, rescuedTime: 0,
            // Captured pilots stand beside the wreck with two guards holding them at gunpoint
            pilots: [wreckX + 120, wreckX + 175],
            guards: [{ x: wreckX + 225, type: 0 }, { x: wreckX + 300, type: 1 }]
        };
    }

    endHeliIntro() {
        this.gameState = 'playing';
        this.heliIntro = null;
        this.player.x = this.currentLevelData.startX + 100;
        this.player.y = 220;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.facingRight = true;
    }

    // World 1 -> World 2 transition: Tofu finds a hatch, slides down a rope into a deep
    // shaft, runs out of rope, and drops into the secret bunker
    startBunkerIntro() {
        this.gameState = 'bunkerIntro';
        this.camera.x = 0;
        this.bunkerIntro = {
            startTime: Date.now(),
            duration: 9,
            landed: false
        };
    }

    // Ignore skips for a moment so the key or tap that left the level-complete screen
    // doesn't skip the animation straight away
    skipBunkerIntro() {
        if (this.bunkerIntro && Date.now() - this.bunkerIntro.startTime > 500) {
            this.endBunkerIntro();
        }
    }
    
    endBunkerIntro() {
        this.gameState = 'playing';
        this.bunkerIntro = null;
        this.camera.x = this.currentLevelData.startX;
        this.player.x = this.currentLevelData.startX + 100;
        this.player.y = 220;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.facingRight = true;
        this.player.isMoving = false;
    }

    renderBunkerIntro() {
        const intro = this.bunkerIntro;
        const t = (Date.now() - intro.startTime) / 1000;
        if (t >= intro.duration) {
            this.endBunkerIntro();
            return;
        }

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const groundY = 320;
        const hatchX = 460;
        const player = this.player;
        player.facingRight = true;

        // Draws Tofu with an optional spin around its center
        const drawTofu = (x, y, spin = 0) => {
            player.x = x;
            player.y = y;
            ctx.save();
            if (spin) {
                ctx.translate(x + player.width / 2, y + player.height / 2);
                ctx.rotate(spin);
                ctx.translate(-(x + player.width / 2), -(y + player.height / 2));
            }
            player.render(ctx);
            ctx.restore();
        };

        let caption = '';
        let shake = 0;

        if (t < 3.0) {
            // --- Surface: walk up to the hatch and climb down the rope ---
            const savedWorld = this.currentWorld;
            this.currentWorld = 1; // still on the World 1 surface
            this.renderBackground();
            ctx.save();
            this.renderGround();
            this.currentWorld = savedWorld;

            // Open hatch: dark hole, metal rim, lid flipped back, rope tied to a post
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(hatchX, groundY + 4, 48, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#7D7D7D';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = '#5F6B4A';
            ctx.beginPath();
            ctx.moveTo(hatchX + 40, groundY + 2);
            ctx.lineTo(hatchX + 62, groundY - 44);
            ctx.lineTo(hatchX + 76, groundY - 40);
            ctx.lineTo(hatchX + 56, groundY + 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#FFC107';
            ctx.fillRect(hatchX - 56, groundY - 2, 10, 6);
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(hatchX - 70, groundY - 34, 8, 36);

            // Rope from the post, over the rim and down the hole
            const ropeSway = Math.sin(t * 3) * 2;
            ctx.strokeStyle = '#A1887F';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(hatchX - 66, groundY - 30);
            ctx.quadraticCurveTo(hatchX - 30, groundY - 12, hatchX + ropeSway, groundY + 2);
            ctx.stroke();

            if (t < 1.8) {
                // Walk in from the left
                const k = t / 1.8;
                player.isMoving = true;
                player.onGround = true;
                player.animationFrame = t * 10;
                drawTofu(-60 + (hatchX - 40 - -60) * k, 220);
                caption = 'Tofu found a secret hatch...';
            } else {
                // Grab the rope and slide down - clip everything below the ground line
                player.isMoving = false;
                const k = Math.min(1, (t - 1.8) / 1.2);
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, W, groundY + 4);
                ctx.clip();
                drawTofu(hatchX - 40, 220 + k * k * 130);
                ctx.restore();
                caption = 'Grab the rope!';
            }
            ctx.restore();
        } else if (t < 5.6) {
            // --- Shaft: concrete walls rush past as Tofu slides, then the rope runs out ---
            const shaftT = t - 3.0;
            const falling = shaftT > 1.8;
            const speed = falling ? 900 + (shaftT - 1.8) * 900 : 350;
            const scroll = falling
                ? 350 * 1.8 + 900 * (shaftT - 1.8) + 450 * Math.pow(shaftT - 1.8, 2)
                : 350 * shaftT;

            const grad = ctx.createLinearGradient(0, 0, W, 0);
            grad.addColorStop(0, '#1b1b1b');
            grad.addColorStop(0.5, '#2c2c2c');
            grad.addColorStop(1, '#1b1b1b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // Shaft walls with seams and warning lights scrolling upward
            const wallW = 230;
            ctx.fillStyle = '#3d3d3d';
            ctx.fillRect(0, 0, wallW, H);
            ctx.fillRect(W - wallW, 0, wallW, H);
            ctx.strokeStyle = '#2a2a2a';
            ctx.lineWidth = 3;
            const seamGap = 80;
            for (let y = -(scroll % seamGap); y < H; y += seamGap) {
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(wallW, y);
                ctx.moveTo(W - wallW, y); ctx.lineTo(W, y);
                ctx.stroke();
            }
            const lightGap = 260;
            for (let y = -(scroll % lightGap); y < H; y += lightGap) {
                ctx.fillStyle = '#FF3D00';
                ctx.fillRect(wallW - 14, y + 30, 10, 18);
                ctx.fillRect(W - wallW + 4, y + 150, 10, 18);
            }
            // Speed streaks once falling
            if (falling) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 8; i++) {
                    const sx = wallW + 20 + ((i * 97) % (W - 2 * wallW - 40));
                    const sy = (i * 61 + scroll * 0.6) % H;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(sx, sy + 40 + speed * 0.03);
                    ctx.stroke();
                }
            }

            const tofuX = W / 2 - player.width / 2;
            const ropeX = W / 2 + 4;
            if (!falling) {
                // Rope runs the whole height while sliding
                ctx.strokeStyle = '#A1887F';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(ropeX, 0);
                ctx.lineTo(ropeX, H);
                ctx.stroke();
                drawTofu(tofuX, 140);
                caption = 'Down, down, down...';
            } else {
                // Frayed rope end shoots up out of view; Tofu tumbles
                const ropeEnd = 120 - (scroll - 350 * 1.8);
                if (ropeEnd > -20) {
                    ctx.strokeStyle = '#A1887F';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(ropeX, 0);
                    ctx.lineTo(ropeX, ropeEnd);
                    ctx.stroke();
                }
                const fall = Math.min(1, (shaftT - 1.8) / 2);
                drawTofu(tofuX + Math.sin(shaftT * 9) * 6, 140 + fall * 60, (shaftT - 1.8) * 5);
                caption = 'The rope ran out! AAAAAH!';
            }
        } else {
            // --- Bunker: drop through the ceiling hatch and crash-land on the floor ---
            this.renderBackground();
            ctx.save();
            const landT = 6.2;
            const landedFor = t - landT;
            if (landedFor >= 0 && landedFor < 0.4) {
                shake = (1 - landedFor / 0.4) * 8;
            }
            ctx.translate(Math.sin(t * 60) * shake, Math.cos(t * 50) * shake);
            this.renderGround();

            // Ceiling hatch with the end of the rope dangling out
            const holeX = 140;
            ctx.fillStyle = '#0d0d0d';
            ctx.beginPath();
            ctx.ellipse(holeX, 58, 44, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#6b6b6b';
            ctx.lineWidth = 3;
            ctx.stroke();

            const startX = holeX - player.width / 2;
            if (t < landT) {
                // Falling in from the ceiling
                const k = (t - 5.6) / (landT - 5.6);
                drawTofu(startX, -100 + k * k * 320, (1 - k) * 1.5);
                caption = 'AAAAAH!';
            } else {
                if (!intro.landed) {
                    intro.landed = true;
                    this.playMineExplosion();
                }
                // Squash on impact, then stand back up
                const squash = landedFor < 0.3 ? 1 - landedFor / 0.3 : 0;
                ctx.save();
                ctx.translate(startX + player.width / 2, 320);
                ctx.scale(1 + squash * 0.25, 1 - squash * 0.3);
                ctx.translate(-(startX + player.width / 2), -320);
                drawTofu(startX, 220);
                ctx.restore();

                // Dust cloud from the landing
                if (landedFor < 1.2) {
                    const k = landedFor / 1.2;
                    for (let i = 0; i < 6; i++) {
                        const dir = i < 3 ? -1 : 1;
                        ctx.fillStyle = `rgba(150, 150, 150, ${0.6 * (1 - k)})`;
                        ctx.beginPath();
                        ctx.arc(holeX + dir * (20 + (i % 3) * 22 + k * 50), 312 - (i % 3) * 6 - k * 10, 10 + k * 16, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                caption = 'Welcome to the SECRET BUNKER!';
            }
            ctx.restore();
        }

        // Cinematic bars, caption and skip hint
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, 36);
        ctx.fillRect(0, H - 36, W, 36);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = caption.includes('AAAA') ? '#FF5252' : '#FFFFFF';
        ctx.fillText(caption, W / 2, 25);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#AAAAAA';
        ctx.textAlign = 'right';
        ctx.fillText('SPACE / tap to skip', W - 12, H - 14);
        ctx.restore();
    }

    // World 3 -> World 4 transition: Tofu hops onto his friends' train, it races out of the
    // city into the mountains, Popcorn's Apache blows up the bridge and the train plunges
    // into the mountain range below
    startTrainIntro() {
        this.gameState = 'trainIntro';
        this.camera.x = 0;
        this.trainIntro = {
            startTime: Date.now(),
            missileSoundPlayed: false,
            blastSoundPlayed: false,
            crashSoundPlayed: false
        };
    }

    skipTrainIntro() {
        if (this.trainIntro && Date.now() - this.trainIntro.startTime > 500) {
            this.endTrainIntro();
        }
    }

    endTrainIntro() {
        this.gameState = 'playing';
        this.trainIntro = null;
        this.camera.x = this.currentLevelData.startX;
        this.player.x = this.currentLevelData.startX + 100;
        this.player.y = 220;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.facingRight = true;
        this.player.isMoving = false;
    }

    // ===== End of World 4: Chinook pickup -> flight -> base camp briefing -> jeep to the nuclear base =====
    startCampIntro() {
        this.stopGameplayMusic();
        this.stopBossMusic();
        this.gameState = 'campIntro';
        this.camera.x = 0;
        this.campIntro = { startTime: Date.now() };
    }

    skipCampIntro() {
        if (this.campIntro && Date.now() - this.campIntro.startTime > 500) {
            this.endCampIntro();
        }
    }

    endCampIntro() {
        this.gameState = 'playing';
        this.campIntro = null;
        this.camera.x = this.currentLevelData.startX;
        this.player.x = this.currentLevelData.startX + 100;
        this.player.y = 220;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.facingRight = true;
        this.player.isMoving = false;
    }

    renderCampIntro() {
        const intro = this.campIntro;
        const t = (Date.now() - intro.startTime) / 1000;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const END = 29;
        if (t >= END) {
            this.endCampIntro();
            this.render();
            return;
        }

        if (t < 7) this.renderCampPickup(t);
        else if (t < 10.5) this.renderCampFlight(t - 7);
        else this.renderCampArrival(t - 10.5);

        // Fade through black between the three scenes, and out at the end
        const fade = Math.max(
            Math.max(0, 1 - Math.abs(t - 7) / 0.45),
            Math.max(0, 1 - Math.abs(t - 10.5) / 0.45),
            Math.max(0, 1 - t / 0.5),
            Math.max(0, (t - (END - 0.6)) / 0.6)
        );
        if (fade > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, fade)})`;
            ctx.fillRect(0, 0, W, H);
        }

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('SPACE to skip', W - 12, H - 10);
        ctx.restore();
    }

    // Big caption bar across the top of a cutscene
    drawCutsceneCaption(text, alpha = 1) {
        if (!text) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 18, this.canvas.width, 34);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, this.canvas.width / 2, 41);
        ctx.restore();
    }

    // Tofu in a cutscene, drawn exactly like in the game (same sprite, size and walking legs).
    // x is the centre of his feet; opts.scale shrinks him (climbing into the heli, riding in the jeep).
    drawCutsceneTofu(ctx, x, groundY, opts = {}) {
        const p = this.player;
        if (!p || !p.sprite) return;
        const saved = {
            x: p.x, y: p.y, facingRight: p.facingRight, isMoving: p.isMoving,
            onGround: p.onGround, animationFrame: p.animationFrame, shielded: p.shielded
        };
        ctx.save();
        ctx.translate(x, groundY);
        const scale = opts.scale || 1;
        ctx.scale(scale, scale);
        p.x = -p.width / 2;
        p.y = -p.height;
        p.facingRight = opts.facing !== -1;
        p.isMoving = !!opts.walking;
        p.onGround = true;
        p.animationFrame = (opts.t || 0) * 9;
        p.shielded = false;
        p.render(ctx);
        Object.assign(p, saved);
        ctx.restore();
    }

    // Where the Chinook's side door is on screen, for a heli drawn at (x, y, angle)
    getHeliDoor(x, y, angle) {
        const lx = -3, ly = -1;
        return { x: x + Math.cos(angle) * lx - Math.sin(angle) * ly, y: y + Math.sin(angle) * lx + Math.cos(angle) * ly };
    }

    // Dust kicked up by the rotors when the Chinook is near the ground
    drawRotorWash(ctx, x, y, groundY, t) {
        const near = Math.max(0, 1 - (groundY - (y + 33)) / 140);
        if (near <= 0) return;
        for (let i = 0; i < 10; i++) {
            const spread = ((t * 1.7 + i * 0.1) % 1);
            const side = i % 2 ? 1 : -1;
            ctx.fillStyle = `rgba(210, 200, 180, ${0.35 * near * (1 - spread)})`;
            ctx.beginPath();
            ctx.ellipse(x + side * (30 + spread * 170), groundY - 4 - spread * 10, 16 + spread * 24, 6 + spread * 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Scene 1: Chinook flies in over the summit, lands, Tofu runs aboard, it takes off
    renderCampPickup(t) {
        const ctx = this.ctx;
        // Draw the World 4 mountain scenery even though the game has moved on to World 5
        const world = this.currentWorld, camX = this.camera.x;
        this.currentWorld = 4; this.camera.x = 0;
        this.renderBackground();
        this.renderGround();
        this.currentWorld = world; this.camera.x = camX;

        const landX = 400, landY = 287;
        let hx, hy, ha;
        if (t < 3.2) {
            const p = t / 3.2;
            const e = 1 - Math.pow(1 - p, 2);
            hx = -220 + (landX + 220) * e;
            const d = Math.min(1, Math.max(0, (t - 0.8) / 2.4));
            hy = 110 + (landY - 110) * (1 - Math.pow(1 - d, 2));
            ha = 0.14 * (1 - e);
        } else if (t < 5.4) {
            hx = landX; hy = landY; ha = 0;
        } else {
            const k = (t - 5.4) / 1.6;
            hx = landX + 520 * k * k;
            hy = landY - 260 * k * k - 20 * k;
            ha = 0.16 * Math.min(1, k * 2);
        }
        this.drawRotorWash(ctx, hx, hy, 320, t);

        // Tofu waves at the summit, then runs to the door and hops in
        const door = this.getHeliDoor(hx, hy, ha);
        if (t < 3.6) {
            const wave = Math.abs(Math.sin(t * 5)) * 4;
            this.drawCutsceneTofu(ctx, 650, 320 - wave, { facing: -1 });
        } else if (t < 4.8) {
            const k = (t - 3.6) / 1.2;
            this.drawCutsceneTofu(ctx, 650 - (650 - (door.x + 30)) * k, 320, { facing: -1, walking: true, t });
        }
        if (t >= 4.8 && t < 5.2) {
            // Climb in through the doorway: drawn behind the fuselage, shrinking into the cabin
            const k = (t - 4.8) / 0.4;
            const cx = door.x + 30 * (1 - k);
            const feet = 320 + (door.y + 14 - 320) * k - Math.sin(k * Math.PI) * 10;
            this.drawCutsceneTofu(ctx, cx, feet, { facing: -1, scale: 1 - 0.7 * k });
        }
        this.drawHelicopter(ctx, hx, hy, ha, { t });
        if (t >= 5.2) {
            // Peeking out of the open door
            this.drawCutsceneTofu(ctx, door.x, door.y + 14, { scale: 0.3 });
        }

        if (t < 3.2) this.drawCutsceneCaption('YETI DEFEATED! The summit is clear.');
        else this.drawCutsceneCaption('Chinook inbound - get aboard, Tofu!');
    }

    // Scene 2: flying over the mountains at sunset
    renderCampFlight(t) {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#2A3D66');
        sky.addColorStop(0.55, '#C9746A');
        sky.addColorStop(1, '#F4B16A');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);
        // Low sun
        ctx.fillStyle = 'rgba(255, 220, 140, 0.9)';
        ctx.beginPath(); ctx.arc(620, 300, 46, 0, Math.PI * 2); ctx.fill();

        // Two ranges of peaks scrolling past
        const range = (speed, baseY, height, color, seed) => {
            const off = (t * speed) % 140;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-160, H);
            for (let i = -1; i < 9; i++) {
                const x = i * 140 - off;
                const n = Math.floor(t * speed / 140) + i + seed;
                const peak = height * (0.6 + 0.4 * Math.abs(Math.sin(n * 2.7)));
                ctx.lineTo(x, baseY);
                ctx.lineTo(x + 70, baseY - peak);
            }
            ctx.lineTo(W + 160, baseY);
            ctx.lineTo(W + 160, H);
            ctx.closePath();
            ctx.fill();
        };
        range(70, 330, 150, '#5A4E6E', 3);
        range(190, 380, 120, '#33304A', 11);

        // Clouds streaking by
        ctx.fillStyle = 'rgba(255, 240, 230, 0.55)';
        for (let i = 0; i < 4; i++) {
            const cx = ((i * 260 - t * 320) % 1040 + 1040) % 1040 - 120;
            const cy = 70 + i * 37;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 60, 12, 0, 0, Math.PI * 2);
            ctx.ellipse(cx + 34, cy - 6, 34, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        const hx = 380 + Math.sin(t * 1.3) * 10;
        const hy = 175 + Math.sin(t * 2.1) * 7;
        const ha = 0.1;
        this.drawHelicopter(ctx, hx, hy, ha, { t: t + 7 });
        const door = this.getHeliDoor(hx, hy, ha);
        this.drawCutsceneTofu(ctx, door.x, door.y + 14, { scale: 0.3 });

        this.drawCutsceneCaption('Flying to the Tofu Alliance base camp...');
    }

    // Scene 3: land at camp, the general briefs Tofu, then Tofu jumps in the jeep and it drives off
    renderCampArrival(t) {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        const now = t + 10.5;
        this.drawCampScenery(ctx, now);

        // Chinook comes down onto the helipad
        const padX = 190;
        let hx = padX, hy = 287;
        if (t < 2.6) {
            const p = t / 2.6;
            hx = padX + 160 * Math.pow(1 - p, 2);
            hy = -80 + (287 + 80) * (1 - Math.pow(1 - p, 2));
        }
        this.drawRotorWash(ctx, hx, hy, 320, now);
        const door = this.getHeliDoor(hx, hy, 0);

        // The general waits by the flag
        const genX = 410;
        const jeepX = 15.0 <= t ? 520 + 110 * Math.pow(t - 15, 2) + 30 * (t - 15) : 520;

        // Tofu: hidden in the heli, hops out, walks over, then to the jeep
        let tofu = null;
        if (t >= 2.9 && t < 3.4) {
            const k = (t - 2.9) / 0.5;
            tofu = { x: door.x - 10 + k * 40, y: 320 - Math.sin(k * Math.PI) * 30, walking: false };
        } else if (t >= 3.4 && t < 4.4) {
            const k = (t - 3.4) / 1.0;
            tofu = { x: door.x + 30 + (310 - door.x - 30) * k, y: 320, walking: true };
        } else if (t >= 4.4 && t < 13.4) {
            tofu = { x: 310, y: 320, walking: false };
        } else if (t >= 13.4 && t < 14.5) {
            const k = (t - 13.4) / 1.1;
            tofu = { x: 310 + (jeepX + 37 - 310) * k, y: 320, walking: true };
        } else if (t >= 14.5 && t < 14.9) {
            const k = (t - 14.5) / 0.4;
            tofu = { x: jeepX + 37, y: 320 - Math.sin(k * Math.PI) * 44 - k * 22, walking: false };
        }
        const tofuInJeep = t >= 14.9;

        // Camp soldiers: a patrol walking past the tents, guards with rifles, and a couple by the
        // campfire. They all cheer and wave when the jeep heads out.
        const cheering = t >= 15;
        const patrolX = 640 + Math.sin(now * 0.35) * 70;
        ctx.save();
        ctx.translate(patrolX + 17, 318);
        ctx.scale(0.72, 0.72);
        if (cheering) this.drawTofuPilot(ctx, -23, 0, { role: 'soldier', rescued: true, t: now, seed: 5 });
        else this.drawArmedCrew(ctx, -23, 0, { gun: 'rifle', facing: Math.cos(now * 0.35) > 0 ? 1 : -1, role: 'soldier' }, 5, now);
        ctx.restore();
        [{ x: 768, seed: 7 }].forEach(c => {
            ctx.save();
            ctx.translate(c.x + 17, 322);
            ctx.scale(0.72, 0.72);
            this.drawTofuPilot(ctx, -23, 0, cheering ? { role: 'soldier', rescued: true, t: now, seed: c.seed } : { role: 'soldier', pose: 'seated', t: now, seed: c.seed });
            ctx.restore();
        });
        if (cheering) {
            this.drawTofuPilot(ctx, 10, 320, { role: 'soldier', rescued: true, t: now, seed: 1 });
            this.drawTofuPilot(ctx, 470, 320, { role: 'soldier', rescued: true, t: now, seed: 3 });
        } else {
            this.drawArmedCrew(ctx, 10, 320, { gun: 'rifle', facing: 1, role: 'soldier' }, 1, now);
            this.drawArmedCrew(ctx, 470, 320, { gun: 'rifle', facing: -1, role: 'soldier' }, 3, now);
        }

        // Draw back to front: general, jeep (with crew), heli, Tofu
        this.drawTofuPilot(ctx, genX, 320, { role: 'general', pose: 'seated', t: now });
        this.drawJeep(ctx, jeepX, 320, { t: now, moving: t >= 15, passenger: tofuInJeep });
        this.drawHelicopter(ctx, hx, hy, 0, { t: now });
        if (tofu) this.drawCutsceneTofu(ctx, tofu.x + 22, tofu.y, { walking: tofu.walking, t: now });

        // The general's briefing
        const lines = [
            { from: 4.6, to: 9.0, text: "Outstanding work, Tofu!\nYou took down Popcorn's\ncyborg yeti!" },
            { from: 9.0, to: 13.4, text: "But our scouts found a\nNUCLEAR BASE past these hills.\nPopcorn is up to something.\nTake the jeep - GO!" }
        ];
        const line = lines.find(l => t >= l.from && t < l.to);
        if (line) {
            const chars = Math.floor((t - line.from) * 34);
            this.drawSpeechBubble(ctx, genX + 23, 216, line.text.substring(0, chars), 'GENERAL');
        }

        if (t < 2.6) this.drawCutsceneCaption('Tofu Alliance Base Camp');
        if (t >= 16.6) {
            const a = Math.min(1, (t - 16.6) / 0.6);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 140, W, 90);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#C6FF00';
            ctx.font = 'bold 34px Arial';
            ctx.fillText('WORLD 5', W / 2, 182);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 22px Arial';
            ctx.fillText('THE NUCLEAR BASE', W / 2, 214);
            ctx.restore();
        }
    }

    // Comic speech bubble with a speaker name, pointing down at (x, tipY)
    drawSpeechBubble(ctx, x, tipY, text, speaker) {
        const rows = text.split('\n');
        const all = text.length ? rows : [''];
        ctx.save();
        ctx.font = 'bold 14px Arial';
        const fullW = 250;
        const h = 30 + 4 * 18;
        const bx = Math.max(10, Math.min(this.canvas.width - fullW - 10, x - fullW / 2));
        const by = tipY - h - 14;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#2A241C';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, fullW, h, 10);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 10, by + h - 1);
        ctx.lineTo(x, tipY);
        ctx.lineTo(x + 8, by + h - 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(x - 9, by + h - 4, 16, 6);
        ctx.fillStyle = '#4B5320';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(speaker + ':', bx + 12, by + 18);
        ctx.fillStyle = '#1C1C1C';
        ctx.font = 'bold 14px Arial';
        all.forEach((r, i) => ctx.fillText(r, bx + 12, by + 38 + i * 18));
        ctx.restore();
    }

    // Tofu Alliance base camp: tents, flag, sandbags, crates, a helipad and a campfire,
    // with the nuclear base's cooling tower steaming behind the far hills
    drawCampScenery(ctx, t) {
        ctx.save();
        this.drawCampSceneryInner(ctx, t);
        ctx.restore();
    }

    drawCampSceneryInner(ctx, t) {
        const W = this.canvas.width, H = this.canvas.height;
        const sky = ctx.createLinearGradient(0, 0, 0, 320);
        sky.addColorStop(0, '#4E6FA8');
        sky.addColorStop(0.7, '#E9A86A');
        sky.addColorStop(1, '#F6D29B');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Ominous cooling tower peeking over the hills on the right
        ctx.fillStyle = '#6E6A78';
        ctx.beginPath();
        ctx.moveTo(668, 250); ctx.quadraticCurveTo(690, 205, 676, 160);
        ctx.lineTo(736, 160); ctx.quadraticCurveTo(722, 205, 744, 250);
        ctx.closePath(); ctx.fill();
        for (let i = 0; i < 4; i++) {
            const k = (t * 0.25 + i * 0.25) % 1;
            ctx.fillStyle = `rgba(235, 235, 240, ${0.5 * (1 - k)})`;
            ctx.beginPath();
            ctx.arc(706 + k * 30, 150 - k * 70, 14 + k * 20, 0, Math.PI * 2);
            ctx.fill();
        }
        // Hazard glow
        ctx.fillStyle = 'rgba(198, 255, 0, 0.18)';
        ctx.beginPath(); ctx.ellipse(706, 250, 90, 30, 0, 0, Math.PI * 2); ctx.fill();

        // Rolling hills
        ctx.fillStyle = '#5E7A3A';
        ctx.beginPath();
        ctx.moveTo(0, 270);
        for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 262 - Math.sin(x * 0.012) * 22 - Math.sin(x * 0.031) * 8);
        ctx.lineTo(W, 330); ctx.lineTo(0, 330); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#4C6630';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 292 - Math.sin(x * 0.02 + 1) * 12);
        ctx.lineTo(W, 330); ctx.lineTo(0, 330); ctx.closePath(); ctx.fill();

        // Ground and dirt road
        ctx.fillStyle = '#6B7B3A';
        ctx.fillRect(0, 320, W, H - 320);
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 326, W, 26);
        ctx.fillStyle = 'rgba(60, 45, 30, 0.35)';
        for (let x = 10; x < W; x += 46) ctx.fillRect(x, 336, 22, 3);

        // Helipad
        ctx.fillStyle = '#7D7D7D';
        ctx.beginPath(); ctx.ellipse(190, 322, 110, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#F5F5F5';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('H', 190, 326);

        // Tents
        const tent = (x, w, h, label) => {
            ctx.fillStyle = '#556B2F';
            ctx.strokeStyle = '#2E3A18';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, 320); ctx.lineTo(x + w / 2, 320 - h); ctx.lineTo(x + w, 320); ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#2B3417';
            ctx.beginPath();
            ctx.moveTo(x + w / 2 - 14, 320); ctx.lineTo(x + w / 2, 320 - h * 0.55); ctx.lineTo(x + w / 2 + 14, 320); ctx.closePath();
            ctx.fill();
            if (label) {
                ctx.fillStyle = '#F5F0DC';
                ctx.font = 'bold 9px Arial';
                ctx.fillText(label, x + w / 2, 320 - h * 0.62);
            }
        };
        tent(470, 150, 92, 'HQ');
        tent(650, 120, 70, '');
        // Radio antenna on the HQ tent
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        // Base sits on the roof: the HQ roof slopes from its peak (545, 228) down to (620, 320),
        // so at x 572 the roof is at y 261
        ctx.beginPath(); ctx.moveTo(572, 261); ctx.lineTo(576, 196); ctx.stroke();
        ctx.fillStyle = Math.floor(t * 2) % 2 ? '#FF5252' : '#8E0000';
        ctx.beginPath(); ctx.arc(576, 195, 3, 0, Math.PI * 2); ctx.fill();

        // Flagpole with the Tofu Alliance flag
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(386, 200, 4, 120);
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.moveTo(390, 204);
        for (let i = 0; i <= 6; i++) ctx.lineTo(390 + i * 8, 204 + Math.sin(t * 6 + i * 0.8) * 3);
        for (let i = 6; i >= 0; i--) ctx.lineTo(390 + i * 8, 232 + Math.sin(t * 6 + i * 0.8) * 3);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFF8E1';
        ctx.fillRect(408, 211 + Math.sin(t * 6 + 2) * 3, 12, 12);

        // Sandbag wall and supply crates
        ctx.fillStyle = '#C2B280';
        ctx.strokeStyle = '#8D7F55';
        ctx.lineWidth = 1.5;
        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < 4 - row; i++) {
                ctx.beginPath();
                ctx.ellipse(18 + i * 22 + row * 11, 312 - row * 11, 12, 6, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
            }
        }
        [[612, 300, 22], [632, 304, 18], [622, 284, 16]].forEach(([x, y, s2]) => {
            ctx.fillStyle = '#8B6B3E';
            ctx.fillRect(x, y, s2, 320 - y);
            ctx.strokeStyle = '#5A4426';
            ctx.strokeRect(x, y, s2, 320 - y);
        });

        // Campfire
        ctx.fillStyle = '#5A3A1E';
        ctx.fillRect(742, 314, 26, 5);
        for (let i = 0; i < 3; i++) {
            const fy = Math.sin(t * 14 + i * 2) * 3;
            ctx.fillStyle = ['#FF6F00', '#FFA000', '#FFEB3B'][i];
            ctx.beginPath();
            ctx.ellipse(755, 306 + fy - i * 3, 8 - i * 2, 12 - i * 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Olive military jeep, facing right. x is the back bumper, groundY where the tires sit.
    // A Tofu Alliance soldier drives; Tofu rides in the back when opts.passenger is set.
    drawJeep(ctx, x, groundY, opts = {}) {
        const t = opts.t || 0;
        const olive = '#556B2F', dark = '#3E4D22', outline = '#2A241C';
        // Sized for tofus: 1.35x, about 216px long, so Tofu and the driver fit at nearly full size
        const S = 1.35;
        ctx.save();
        ctx.translate(x, groundY);
        ctx.scale(S, S);
        x = 0;
        groundY = 0;
        ctx.save();
        if (opts.moving) {
            // Dust trail
            for (let i = 0; i < 6; i++) {
                const k = (t * 2 + i / 6) % 1;
                ctx.fillStyle = `rgba(190, 170, 130, ${0.45 * (1 - k)})`;
                ctx.beginPath();
                ctx.arc(x - 10 - k * 70, groundY - 8 - k * 14, 8 + k * 14, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        const bounce = opts.moving ? Math.sin(t * 30) * 1.2 : 0;
        const by = groundY + bounce;

        // Crew sit low in the seats; the doors and body hide their legs
        ctx.save();
        ctx.translate(x + 90, by - 16);
        ctx.scale(0.68, 0.68);
        this.drawTofuPilot(ctx, -23, 0, { role: 'soldier', pose: 'seated', t });
        ctx.restore();
        if (opts.passenger) {
            this.drawCutsceneTofu(ctx, x + 44, by - 20, { scale: 0.7 });
        }

        // Spare tire on the back
        ctx.fillStyle = '#1E1E1E';
        ctx.beginPath(); ctx.arc(x + 2, by - 34, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.arc(x + 2, by - 34, 5, 0, Math.PI * 2); ctx.fill();

        // Body tub, hood and fenders
        ctx.fillStyle = olive;
        ctx.strokeStyle = outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 6, by - 46);
        ctx.lineTo(x + 104, by - 46);
        ctx.lineTo(x + 108, by - 40);
        ctx.lineTo(x + 158, by - 40);
        ctx.lineTo(x + 160, by - 16);
        ctx.lineTo(x + 4, by - 16);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = dark;
        ctx.fillRect(x + 6, by - 30, 152, 4);
        // Grille and headlight
        ctx.fillStyle = '#2B3417';
        ctx.fillRect(x + 154, by - 38, 5, 20);
        ctx.fillStyle = '#FFE082';
        ctx.beginPath(); ctx.arc(x + 155, by - 33, 4, 0, Math.PI * 2); ctx.fill();
        // White star on the door
        ctx.fillStyle = '#F5F0DC';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 ? 4 : 9;
            const a = -Math.PI / 2 + i * Math.PI / 5;
            ctx.lineTo(x + 64 + Math.cos(a) * r, by - 33 + Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
        // Fold-down windshield frame
        ctx.strokeStyle = outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 106, by - 44); ctx.lineTo(x + 100, by - 76);
        ctx.stroke();
        ctx.fillStyle = 'rgba(170, 215, 240, 0.55)';
        ctx.beginPath();
        ctx.moveTo(x + 106, by - 44); ctx.lineTo(x + 100, by - 76); ctx.lineTo(x + 103, by - 76); ctx.lineTo(x + 109, by - 44);
        ctx.closePath(); ctx.fill();

        // Wheels with spinning hubs
        [x + 34, x + 128].forEach(wx => {
            ctx.fillStyle = '#1E1E1E';
            ctx.beginPath(); ctx.arc(wx, groundY - 15, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#6B7680';
            ctx.beginPath(); ctx.arc(wx, groundY - 15, 6, 0, Math.PI * 2); ctx.fill();
            const spin = opts.moving ? t * 18 : 0;
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(wx + Math.cos(spin) * 10, groundY - 15 + Math.sin(spin) * 10);
            ctx.lineTo(wx - Math.cos(spin) * 10, groundY - 15 - Math.sin(spin) * 10);
            ctx.stroke();
        });
        ctx.restore();
        ctx.restore();
    }

    // ----- World 5: The Nuclear Base -----
    renderNuclearBackground() {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8);
        sky.addColorStop(0, '#1E2A33');
        sky.addColorStop(0.6, '#4F6152');
        sky.addColorStop(1, '#A3B07A');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Distant ridge
        const p1 = this.camera.x * 0.15;
        ctx.fillStyle = '#2F3B34';
        ctx.beginPath();
        ctx.moveTo(0, 260);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 236 - Math.sin((x + p1) * 0.008) * 18 - Math.sin((x + p1) * 0.021) * 6);
        ctx.lineTo(W, 320); ctx.lineTo(0, 320); ctx.closePath(); ctx.fill();

        // Cooling towers with steam, and a reactor dome
        const t = Date.now() / 1000;
        const p2 = this.camera.x * 0.3;
        const spacing = 700;
        const first = Math.floor((p2 - 200) / spacing);
        for (let i = first; i < first + 3; i++) {
            const bx = i * spacing - p2 + 120;
            ctx.fillStyle = '#7A7F86';
            ctx.beginPath();
            ctx.moveTo(bx, 300); ctx.quadraticCurveTo(bx + 30, 230, bx + 14, 160);
            ctx.lineTo(bx + 96, 160); ctx.quadraticCurveTo(bx + 80, 230, bx + 110, 300);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(bx + 14, 166, 82, 8);
            for (let k2 = 0; k2 < 5; k2++) {
                const k = (t * 0.2 + k2 * 0.2) % 1;
                ctx.fillStyle = `rgba(230, 232, 235, ${0.45 * (1 - k)})`;
                ctx.beginPath();
                ctx.arc(bx + 55 + k * 40, 152 - k * 90, 18 + k * 26, 0, Math.PI * 2);
                ctx.fill();
            }
            // Reactor dome beside each tower
            ctx.fillStyle = '#8E949B';
            ctx.beginPath();
            ctx.arc(bx + 230, 300, 62, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = '#C6FF00';
            ctx.fillRect(bx + 222, 250, 16, 6);
        }

        // Toxic haze
        ctx.fillStyle = 'rgba(198, 255, 0, 0.06)';
        ctx.fillRect(0, 200, W, 120);

        // Chain-link fence with radiation signs
        const p3 = this.camera.x * 0.6;
        ctx.strokeStyle = 'rgba(160, 165, 170, 0.6)';
        ctx.lineWidth = 1;
        const fx0 = -((p3) % 24);
        for (let x = fx0; x < W + 24; x += 24) {
            ctx.beginPath();
            ctx.moveTo(x, 262); ctx.lineTo(x + 24, 312);
            ctx.moveTo(x + 24, 262); ctx.lineTo(x, 312);
            ctx.stroke();
        }
        ctx.fillStyle = '#5D646B';
        const px0 = -((p3) % 120);
        for (let x = px0; x < W + 120; x += 120) {
            ctx.fillRect(x, 254, 4, 66);
        }
        ctx.strokeStyle = '#5D646B';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 262); ctx.lineTo(W, 262); ctx.stroke();
        const sx0 = -((p3) % 480);
        for (let x = sx0 + 60; x < W + 480; x += 480) {
            ctx.fillStyle = '#FFD600';
            ctx.beginPath(); ctx.moveTo(x, 272); ctx.lineTo(x + 14, 296); ctx.lineTo(x - 14, 296); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#1C1C1C'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = '#1C1C1C';
            ctx.beginPath(); ctx.arc(x, 288, 2.5, 0, Math.PI * 2); ctx.fill();
            for (let j = 0; j < 3; j++) {
                const a = -Math.PI / 2 + j * (Math.PI * 2 / 3);
                ctx.beginPath();
                ctx.moveTo(x, 288);
                ctx.arc(x, 288, 7, a - 0.45, a + 0.45);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    renderNuclearGround(groundY) {
        const ctx = this.ctx;
        const left = this.camera.x - 100;
        const right = this.camera.x + this.canvas.width + 100;
        ctx.fillStyle = '#6E7277';
        ctx.fillRect(left, groundY, right - left, this.canvas.height - groundY);
        // Hazard stripe along the edge of the concrete
        const start = Math.floor(left / 30) * 30;
        for (let x = start; x < right; x += 30) {
            ctx.fillStyle = '#F2C200';
            ctx.fillRect(x, groundY, 15, 6);
            ctx.fillStyle = '#1C1C1C';
            ctx.fillRect(x + 15, groundY, 15, 6);
        }
        // Slab joints and cracks
        ctx.fillStyle = 'rgba(30, 30, 30, 0.35)';
        const slab = Math.floor(left / 160) * 160;
        for (let x = slab; x < right; x += 160) {
            ctx.fillRect(x, groundY + 6, 2, this.canvas.height - groundY);
            ctx.fillRect(x + 40, groundY + 30 + (x / 160 % 3) * 8, 26, 2);
        }
        // Glowing green puddles of goo
        for (let x = slab; x < right; x += 640) {
            ctx.fillStyle = 'rgba(160, 255, 40, 0.55)';
            ctx.beginPath(); ctx.ellipse(x + 300, groundY + 40, 30, 5, 0, 0, Math.PI * 2); ctx.fill();
        }
    }

    // How far the train has travelled (px) at time t: wait, speed up, cruise, then slam on the
    // brakes once the Apache shows up and creep toward the broken bridge
    getTrainDistance(t) {
        if (t < 2.6) return 0;
        if (t < 5) return 62.5 * Math.pow(t - 2.6, 2);
        if (t < 8.5) return 360 + 300 * (t - 5);
        if (t < 9) {
            const dt = t - 8.5;
            return 1410 + 300 * dt - 280 * dt * dt;
        }
        const dt = Math.min(t - 9, 2.5);
        return 1490 + 20 * dt - 4 * dt * dt;
    }

    renderTrainIntro() {
        const intro = this.trainIntro;
        const t = (Date.now() - intro.startTime) / 1000;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const railY = 305;
        const trainX = 20;            // left end of the train on screen
        const trainLength = 664;
        const trainFront = trainX + trainLength;
        const bridgeStart = 1400;     // world x where solid ground gives way to the bridge
        const gapLeft = 1490 + 700;   // world x of the hole the missiles blow in the bridge
        const gapWidth = 100;
        // The front of the train creeps the last 16px to the hole: solve 20dt - 4dt^2 = 16
        const fallStart = 9 + (20 - Math.sqrt(20 * 20 - 4 * 4 * 16)) / 8;
        const valleyStart = fallStart + 1.6;
        const duration = valleyStart + 3.6;
        if (t >= duration) {
            this.endTrainIntro();
            return;
        }

        let caption = '';
        let captionAlert = false;

        if (t < valleyStart) {
            const d = this.getTrainDistance(Math.min(t, fallStart));
            this.camera.x = d; // drives the background parallax

            // Background: the city fades into the mountain range
            const fade = Math.max(0, Math.min(1, (t - 4.5) / 2));
            if (fade < 1) this.renderConstructionBackground();
            if (fade > 0) {
                ctx.save();
                ctx.globalAlpha = fade;
                this.renderMountainBackground();
                ctx.restore();
            }

            // Solid ground (city, then mountain) up to the edge of the gorge
            const cliffScreen = bridgeStart - d;
            if (cliffScreen > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, cliffScreen, H);
                ctx.clip();
                ctx.translate(-d, 0);
                if (fade < 1) this.renderConstructionGround(320);
                if (fade > 0) {
                    ctx.globalAlpha = fade;
                    this.renderMountainGround(320);
                }
                ctx.restore();
                // Rocky cliff face where the ground ends
                if (cliffScreen < W + 20) {
                    ctx.fillStyle = '#5A4A3A';
                    ctx.beginPath();
                    ctx.moveTo(cliffScreen, 320);
                    ctx.lineTo(cliffScreen - 10, 350);
                    ctx.lineTo(cliffScreen + 6, 375);
                    ctx.lineTo(cliffScreen - 14, H);
                    ctx.lineTo(cliffScreen - 40, H);
                    ctx.lineTo(cliffScreen - 40, 320);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            // Gorge below the bridge: misty depths and a river far below
            const gorgeLeft = Math.max(0, cliffScreen);
            if (gorgeLeft < W) {
                const depth = ctx.createLinearGradient(0, 320, 0, H);
                depth.addColorStop(0, 'rgba(70, 90, 115, 0.9)');
                depth.addColorStop(1, 'rgba(25, 35, 50, 1)');
                ctx.fillStyle = depth;
                ctx.fillRect(gorgeLeft, 318, W - gorgeLeft, H - 318);
                ctx.strokeStyle = 'rgba(140, 200, 240, 0.6)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let x = gorgeLeft; x <= W; x += 20) {
                    const y = 388 + Math.sin((x + d) * 0.03) * 3;
                    if (x === gorgeLeft) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Track: a single concrete monorail beam on pylons - short ones on solid ground, tall
            // ones down into the gorge - and after the missile strike a smoking hole in the beam
            const bridgeBroken = t >= 9;
            const inGap = worldX => bridgeBroken && worldX > gapLeft && worldX < gapLeft + gapWidth;
            const beamTop = railY + 12;
            const beamH = 16;
            const pylonStart = Math.floor((d - 160) / 160) * 160;
            for (let wx = pylonStart; wx < d + W + 160; wx += 160) {
                if (inGap(wx)) continue;
                const sx = wx - d;
                const overGorge = wx >= bridgeStart;
                const bottom = overGorge ? H : 320;
                ctx.fillStyle = '#90A4AE';
                ctx.beginPath();
                ctx.moveTo(sx - 7, beamTop + beamH);
                ctx.lineTo(sx + 7, beamTop + beamH);
                ctx.lineTo(sx + (overGorge ? 13 : 9), bottom);
                ctx.lineTo(sx - (overGorge ? 13 : 9), bottom);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#B0BEC5';
                ctx.fillRect(sx - 16, beamTop + beamH, 32, 5); // pylon cap
                if (overGorge) {
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
                    ctx.fillRect(sx - 2, beamTop + beamH + 10, 4, bottom - beamTop - beamH - 10);
                }
            }
            const drawBeam = (fromX, toX) => {
                if (toX <= fromX) return;
                ctx.fillStyle = '#B0BEC5';
                ctx.fillRect(fromX, beamTop, toX - fromX, beamH);
                ctx.fillStyle = '#ECEFF1';
                ctx.fillRect(fromX, beamTop, toX - fromX, 3);
                ctx.fillStyle = '#78909C';
                ctx.fillRect(fromX, beamTop + beamH - 3, toX - fromX, 3);
                // Glowing guide strip down the side of the beam
                ctx.fillStyle = 'rgba(0, 229, 255, 0.55)';
                ctx.fillRect(fromX, beamTop + 7, toX - fromX, 2);
                // Panel joints
                ctx.fillStyle = 'rgba(69, 90, 100, 0.6)';
                const jointStart = Math.floor((fromX + d) / 80) * 80;
                for (let wx = jointStart; wx < toX + d; wx += 80) {
                    const sx = wx - d;
                    if (sx >= fromX && sx <= toX) ctx.fillRect(sx, beamTop + 3, 2, beamH - 6);
                }
            };
            if (bridgeBroken) {
                const gapScreenL = gapLeft - d;
                const gapScreenR = gapLeft + gapWidth - d;
                drawBeam(0, Math.min(W, gapScreenL));
                drawBeam(Math.max(0, gapScreenR), W);
                // Jagged broken concrete with bent rebar sticking out
                [[gapScreenL, 1], [gapScreenR, -1]].forEach(([ex, dir]) => {
                    ctx.fillStyle = '#B0BEC5';
                    ctx.beginPath();
                    ctx.moveTo(ex, beamTop);
                    ctx.lineTo(ex + dir * 8, beamTop + 5);
                    ctx.lineTo(ex + dir * 3, beamTop + 10);
                    ctx.lineTo(ex + dir * 10, beamTop + beamH);
                    ctx.lineTo(ex, beamTop + beamH);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#6D4C41';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(ex, beamTop + 4); ctx.lineTo(ex + dir * 18, beamTop + 16);
                    ctx.moveTo(ex, beamTop + 11); ctx.lineTo(ex + dir * 14, beamTop + 28);
                    ctx.stroke();
                });
            } else {
                drawBeam(0, W);
            }

            // Tofu runs in and hops aboard the last car
            const player = this.player;
            const tofuSeat = { x: trainX + 228, y: railY - 118 };
            let tofuAboard = false;
            if (t < 1.4) {
                player.facingRight = true;
                player.isMoving = true;
                player.onGround = true;
                player.animationFrame = t * 10;
                player.x = -80 + (tofuSeat.x - 40 - -80) * (t / 1.4);
                player.y = 220;
                player.render(ctx);
                caption = "Tofu's friends have a train waiting!";
            } else if (t < 2.3) {
                const k = (t - 1.4) / 0.9;
                player.isMoving = false;
                player.x = tofuSeat.x - 40 + 40 * k;
                player.y = 220 + (tofuSeat.y - 220) * k - Math.sin(k * Math.PI) * 90;
                player.render(ctx);
                caption = 'All aboard!';
            } else {
                tofuAboard = true;
            }

            // The train - pivots over the edge of the hole and plunges once it gets there
            const wheelRot = d * 0.08;
            ctx.save();
            if (t >= fallStart) {
                const ft = t - fallStart;
                const pivotX = trainFront;
                ctx.translate(pivotX, railY + 260 * ft * ft);
                ctx.rotate(Math.min(1.2, 2 * ft * ft));
                ctx.translate(-pivotX, -railY);
            }
            this.drawTofuTrain(ctx, trainX, railY, {
                t, wheelRot, tofuAboard, moving: t > 2.6 && t < fallStart
            });
            ctx.restore();

            // Apache swoops in ahead of the train, fires, then peels away
            if (t >= 7.3 && t < 11.5) {
                let ax, ay;
                if (t < 8.2) {
                    const k = 1 - Math.pow(1 - (t - 7.3) / 0.9, 3);
                    ax = W + 150 - (W + 150 - 640) * k;
                    ay = 60 + 30 * k;
                } else if (t < 10.2) {
                    ax = 640 + Math.sin(t * 2) * 6;
                    ay = 90 + Math.sin(t * 3) * 5;
                } else {
                    const k = t - 10.2;
                    ax = 640 + k * 300;
                    ay = 90 - k * 120;
                }
                // Missiles from the wing pods down onto the bridge
                if (t >= 8.6 && t < 9) {
                    if (!intro.missileSoundPlayed) {
                        intro.missileSoundPlayed = true;
                        this.playTankShoot();
                    }
                    const k = (t - 8.6) / 0.4;
                    const targetX = gapLeft + gapWidth / 2 - this.getTrainDistance(9);
                    [-12, 12].forEach((offset, i) => {
                        const sx = ax - 10 + offset;
                        const sy = ay + 18;
                        const mx = sx + (targetX + offset - sx) * k;
                        const my = sy + (railY - sy) * k;
                        ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                        ctx.fillStyle = '#37474F';
                        ctx.beginPath();
                        ctx.arc(mx, my, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#FFB300';
                        ctx.beginPath();
                        ctx.arc(mx + (sx - mx) * 0.05, my + (sy - my) * 0.05, 3 + (i % 2), 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
                this.drawApache(ctx, ax, ay, t);
            }

            // Bridge explosion, burning debris and smoke
            if (t >= 9) {
                const bt = t - 9;
                const bx = gapLeft + gapWidth / 2 - d;
                if (!intro.blastSoundPlayed) {
                    intro.blastSoundPlayed = true;
                    this.playBossExplosion();
                }
                if (bt < 1.2) {
                    const k = bt / 1.2;
                    for (let i = 0; i < 9; i++) {
                        const a = (i / 9) * Math.PI * 2;
                        ctx.fillStyle = i % 3 === 0 ? `rgba(255, 235, 59, ${1 - k})` : `rgba(255, 112, 0, ${1 - k})`;
                        ctx.beginPath();
                        ctx.arc(bx + Math.cos(a) * 60 * k, railY + Math.sin(a) * 40 * k - 10, 20 * (1 - k) + 6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                for (let i = 0; i < 6; i++) {
                    // Chunks of the concrete beam tumbling into the gorge
                    const px = bx - 50 + i * 20 + Math.sin(i * 7) * 10;
                    const py = railY + bt * bt * 220 + i * 6;
                    if (py > H) continue;
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(bt * (i % 2 ? 4 : -3));
                    ctx.fillStyle = i % 2 ? '#90A4AE' : '#B0BEC5';
                    ctx.fillRect(-9, -5, 18, 10);
                    ctx.restore();
                }
                for (let i = 0; i < 5; i++) {
                    const rise = (bt * 0.6 + i / 5) % 1;
                    ctx.fillStyle = `rgba(55, 55, 55, ${0.55 * (1 - rise)})`;
                    ctx.beginPath();
                    ctx.arc(bx + Math.sin(i * 2 + bt) * 12, railY - 10 - rise * 140, 10 + rise * 26, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (t >= 2.3 && t < 4.5) caption = 'Full speed ahead!';
            else if (t >= 4.5 && t < 7.3) caption = 'Leaving the city for the mountains...';
            else if (t >= 7.3 && t < 8.6) { caption = "INCOMING! It's Popcorn's Apache!"; captionAlert = true; }
            else if (t >= 8.6 && t < 9) { caption = 'MISSILES!'; captionAlert = true; }
            else if (t >= 9 && t < fallStart) { caption = 'The bridge is gone! BRAKES!!'; captionAlert = true; }
            else if (t >= fallStart) { caption = 'WHOAAAAAA!'; captionAlert = true; }
        } else {
            // --- The valley floor of World 4: the train crashes down, Tofu tumbles out ---
            const vt = t - valleyStart;
            this.camera.x = 0;
            this.renderBackground();
            ctx.save();
            const crashT = 0.6;
            if (vt >= crashT && vt < crashT + 0.5) {
                const s = (1 - (vt - crashT) / 0.5) * 10;
                ctx.translate(Math.sin(t * 60) * s, Math.cos(t * 47) * s);
            }
            this.renderGround();

            const wreckX = 240;
            const groundRail = 322;
            ctx.save();
            if (vt < crashT) {
                // Falling in from above, nose first
                const k = vt / crashT;
                ctx.translate(wreckX + 400, groundRail - 320 * (1 - k * k));
                ctx.rotate(0.45 * (1 - k) + 0.08);
                ctx.translate(-(wreckX + 400), -groundRail);
            } else {
                // Crumpled where it landed, slightly nose-down
                ctx.translate(wreckX + 400, groundRail);
                ctx.rotate(0.08);
                ctx.translate(-(wreckX + 400), -groundRail);
            }
            this.drawTofuTrain(ctx, wreckX, groundRail, { t, wheelRot: 0, tofuAboard: vt < crashT, moving: false, wrecked: vt >= crashT });
            ctx.restore();

            if (vt >= crashT) {
                if (!intro.crashSoundPlayed) {
                    intro.crashSoundPlayed = true;
                    this.playBossExplosion();
                }
                const ct = vt - crashT;
                // Crash dust and fire
                if (ct < 1.3) {
                    const k = ct / 1.3;
                    for (let i = 0; i < 10; i++) {
                        ctx.fillStyle = `rgba(150, 140, 125, ${0.6 * (1 - k)})`;
                        ctx.beginPath();
                        ctx.arc(wreckX + 20 + i * 70, 312 - (i % 3) * 8 - k * 20, 14 + k * 26, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                for (let i = 0; i < 6; i++) {
                    const rise = (ct * 0.5 + i / 6) % 1;
                    ctx.fillStyle = `rgba(60, 60, 60, ${0.5 * (1 - rise)})`;
                    ctx.beginPath();
                    ctx.arc(wreckX + 600 + Math.sin(i * 2 + ct) * 10, 230 - rise * 180, 10 + rise * 24, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Tofu is thrown clear and lands where World 4 begins
                const player = this.player;
                player.facingRight = true;
                player.isMoving = false;
                const flyT = Math.min(1, ct / 0.8);
                const seatX = wreckX + 228;
                player.x = seatX + (100 - seatX) * flyT;
                player.y = 220 - 160 * Math.sin(flyT * Math.PI) - (1 - flyT) * 100;
                ctx.save();
                if (flyT < 1) {
                    const cx = player.x + player.width / 2;
                    const cy = player.y + player.height / 2;
                    ctx.translate(cx, cy);
                    ctx.rotate(-flyT * Math.PI * 2);
                    ctx.translate(-cx, -cy);
                }
                player.render(ctx);
                ctx.restore();
                caption = ct < 0.9 ? 'CRASH!' : 'WORLD 4: THE MOUNTAIN RANGE';
                captionAlert = ct < 0.9;
            } else {
                caption = 'WHOAAAAAA!';
                captionAlert = true;
            }
            ctx.restore();
        }

        // Cinematic bars, caption and skip hint
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, 36);
        ctx.fillRect(0, H - 36, W, 36);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = captionAlert ? '#FF5252' : '#FFFFFF';
        const shake = captionAlert ? Math.sin(t * 50) * 2 : 0;
        ctx.fillText(caption, W / 2 + shake, 25);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#AAAAAA';
        ctx.textAlign = 'right';
        ctx.fillText('SPACE / tap to skip', W - 12, H - 14);
        ctx.restore();
    }

    // The Tofu Alliance monorail, facing right and riding on top of a single beam whose top is at
    // railY. Every car is fully enclosed, with big windows looking into a lit interior. From the
    // back: the passenger car with four soldier tofus (and Tofu once aboard), the captain's
    // command car, and the bullet-nosed lead car with the two pilots at the controls.
    drawTofuTrain(ctx, x, railY, opts = {}) {
        const t = opts.t || Date.now() / 1000;
        const sprite = this.assets.tofuSprite;
        const wrecked = !!opts.wrecked;
        const hull = wrecked ? '#8E989E' : '#EEF3F6';
        const hullShade = wrecked ? '#6B757B' : '#C5D0D6';
        const trim = '#263238';
        const glow = wrecked ? '#37474F' : '#00E5FF';
        const accent = wrecked ? '#55643A' : '#7CB342';
        const hover = opts.moving ? Math.sin(t * 12) * 0.8 : 0;
        const pulse = 0.55 + 0.45 * Math.sin(t * 10);
        const roofY = railY - 122;
        const winTop = railY - 106;
        const winBottom = railY - 48;
        const glassEdge = wrecked ? 'rgba(60, 70, 75, 0.9)' : 'rgba(190, 245, 255, 0.95)';

        // A crew member built on the pilot design, standing or sitting inside with feet on the floor
        const drawCrew = (cx, role, seed, scale = 0.55) => {
            if (opts.empty) return;
            ctx.save();
            ctx.translate(cx, winBottom);
            ctx.scale(scale, scale);
            this.drawTofuPilot(ctx, -23, 0, { rescued: true, pose: 'seated', role, t, seed });
            ctx.restore();
        };
        // Bogie fairings that straddle the beam, with a glowing maglev strip underneath
        const drawBogies = (left, width) => {
            [left + 14, left + width - 64].forEach(bx => {
                ctx.fillStyle = trim;
                ctx.beginPath();
                ctx.roundRect(bx, railY - 16, 50, 30, 6);
                ctx.fill();
                ctx.fillStyle = '#455A64';
                ctx.fillRect(bx + 6, railY - 10, 38, 4);
                if (!wrecked) {
                    ctx.fillStyle = `rgba(0, 229, 255, ${0.35 + 0.4 * pulse})`;
                    ctx.fillRect(bx + 4, railY + 10, 42, 3);
                }
            });
        };
        const windowPath = wins => {
            wins.forEach(w => ctx.roundRect(w.x, winTop, w.w, winBottom - winTop, 8));
        };
        // The lit cabin seen through the windows: back wall, ceiling light, floor, then whatever
        // drawContents puts inside, then tinted glass with a reflection on top
        const drawInterior = (left, width, wins, drawContents) => {
            ctx.save();
            ctx.beginPath();
            windowPath(wins);
            ctx.clip();
            const wall = ctx.createLinearGradient(0, winTop, 0, winBottom);
            wall.addColorStop(0, wrecked ? '#4E5B61' : '#F5F9FB');
            wall.addColorStop(1, wrecked ? '#3B464B' : '#B8C7CF');
            ctx.fillStyle = wall;
            ctx.fillRect(left, winTop, width, winBottom - winTop);
            if (!wrecked) {
                ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
                ctx.fillRect(left, winTop + 2, width, 3);       // ceiling light strip
                ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
                ctx.fillRect(left, winTop + 5, width, 14);      // its glow
            }
            ctx.fillStyle = '#78909C';
            ctx.fillRect(left, winBottom - 4, width, 4);        // floor
            drawContents();
            ctx.fillStyle = wrecked ? 'rgba(90, 110, 120, 0.4)' : 'rgba(120, 220, 255, 0.16)';
            ctx.fillRect(left, winTop, width, winBottom - winTop);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 6;
            wins.forEach(w => {
                ctx.beginPath();
                ctx.moveTo(w.x + w.w * 0.55, winTop);
                ctx.lineTo(w.x + w.w * 0.35, winBottom);
                ctx.stroke();
            });
            if (wrecked) {
                // Cracked glass
                ctx.strokeStyle = 'rgba(30, 30, 30, 0.7)';
                ctx.lineWidth = 1.5;
                wins.forEach(w => {
                    const kx = w.x + w.w * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(kx, winTop + 10); ctx.lineTo(kx + 14, winTop + 28); ctx.lineTo(kx + 6, winTop + 44);
                    ctx.moveTo(kx + 14, winTop + 28); ctx.lineTo(kx + 32, winTop + 22);
                    ctx.stroke();
                });
            }
            ctx.restore();
        };
        // A padded seat back sitting behind a crew member
        const drawSeat = cx => {
            ctx.fillStyle = '#37474F';
            ctx.beginPath();
            ctx.roundRect(cx - 18, winBottom - 40, 36, 36, 5);
            ctx.fill();
            ctx.fillStyle = wrecked ? '#455A64' : '#00ACC1';
            ctx.fillRect(cx - 14, winBottom - 38, 28, 4);
        };
        // Enclosed car shell with the windows cut out, plus glow and accent stripes
        const drawShell = (left, width, wins) => {
            const grad = ctx.createLinearGradient(0, roofY, 0, railY - 12);
            grad.addColorStop(0, hull);
            grad.addColorStop(1, hullShade);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(left, roofY, width, railY - 12 - roofY, 18);
            windowPath(wins);
            ctx.fill('evenodd');
            ctx.strokeStyle = trim;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = glassEdge;
            ctx.beginPath();
            windowPath(wins);
            ctx.stroke();
            // Roof fairing
            ctx.fillStyle = hullShade;
            ctx.beginPath();
            ctx.roundRect(left + 30, roofY - 5, width - 60, 7, 3);
            ctx.fill();
            ctx.fillStyle = glow;
            ctx.fillRect(left + 4, railY - 26, width - 8, 3);
            ctx.fillStyle = accent;
            ctx.fillRect(left + 4, railY - 21, width - 8, 4);
        };
        const drawLink = left => {
            ctx.fillStyle = trim;
            ctx.fillRect(left - 2, railY - 96, 16, 80);
            ctx.fillStyle = glow;
            ctx.fillRect(left - 2, railY - 30, 16, 3);
        };

        ctx.save();
        ctx.translate(0, hover);

        // Speed streaks trailing behind while it zips along
        if (opts.moving) {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const len = 30 + ((t * 7 + i * 0.37) % 1) * 60;
                const sy = railY - 100 + i * 18;
                ctx.beginPath();
                ctx.moveTo(x - 6, sy);
                ctx.lineTo(x - 6 - len, sy);
                ctx.stroke();
            }
        }

        // --- Passenger car (back): four soldiers in their seats, and Tofu once aboard ---
        const carA = x;
        const carAW = 290;
        const winsA = [{ x: carA + 12, w: 130 }, { x: carA + 150, w: 128 }];
        drawBogies(carA, carAW);
        drawInterior(carA, carAW, winsA, () => {
            const soldierSeats = [carA + 34, carA + 76, carA + 118, carA + 172];
            soldierSeats.forEach(drawSeat);
            drawSeat(carA + 236);
            soldierSeats.forEach((cx, i) => drawCrew(cx, 'soldier', i));
            if (opts.tofuAboard && sprite) ctx.drawImage(sprite, carA + 214, winBottom - 55, 44, 55);
        });
        drawShell(carA, carAW, winsA);
        ctx.fillStyle = trim;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TOFU ALLIANCE', carA + carAW / 2, railY - 32);
        drawLink(carA + carAW);

        // --- Captain's command car: the captain at a holographic map table ---
        const carB = carA + carAW + 12;
        const carBW = 150;
        const winsB = [{ x: carB + 12, w: 126 }];
        drawBogies(carB, carBW);
        drawInterior(carB, carBW, winsB, () => {
            // Wall screen with the route through the mountains and the train's position
            const sx = carB + 84, sy = winTop + 10;
            ctx.fillStyle = wrecked ? '#263238' : '#0D2B3E';
            ctx.fillRect(sx, sy, 46, 28);
            if (!wrecked) {
                ctx.strokeStyle = '#00E5FF';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(sx, sy, 46, 28);
                ctx.beginPath();
                ctx.moveTo(sx + 3, sy + 22);
                ctx.lineTo(sx + 12, sy + 10); ctx.lineTo(sx + 20, sy + 18);
                ctx.lineTo(sx + 30, sy + 6); ctx.lineTo(sx + 43, sy + 20);
                ctx.stroke();
                if (Math.sin(t * 8) > 0) {
                    ctx.fillStyle = '#FF5252';
                    ctx.beginPath();
                    ctx.arc(sx + 14, sy + 22, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            drawCrew(carB + 52, 'captain', 0, 0.6);
            // Map console in front of him
            ctx.fillStyle = '#455A64';
            ctx.fillRect(carB + 84, winBottom - 20, 46, 16);
            if (!wrecked) {
                ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
                ctx.fillRect(carB + 86, winBottom - 22, 42, 3);
            }
        });
        drawShell(carB, carBW, winsB);
        // Antenna mast on the roof with the captain's flag and a blinking beacon
        ctx.strokeStyle = '#90A4AE';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(carB + 120, roofY - 4);
        ctx.lineTo(carB + 120, roofY - 56);
        ctx.stroke();
        const wave = Math.sin(t * 8) * 3;
        ctx.fillStyle = '#FFF8E1';
        ctx.beginPath();
        ctx.moveTo(carB + 120, roofY - 54);
        ctx.quadraticCurveTo(carB + 135, roofY - 52 + wave, carB + 148, roofY - 48);
        ctx.lineTo(carB + 120, roofY - 36);
        ctx.closePath();
        ctx.fill();
        if (!wrecked && Math.sin(t * 6) > 0) {
            ctx.fillStyle = '#FF5252';
            ctx.beginPath();
            ctx.arc(carB + 120, roofY - 58, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = trim;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('COMMAND', carB + carBW / 2, railY - 32);
        drawLink(carB + carBW);

        // --- Bullet-nosed lead car ---
        const loco = carB + carBW + 12;
        const locoW = 200;
        drawBogies(loco, locoW);
        // Pilots behind a wraparound windscreen
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(loco + 10, railY - 82);
        ctx.lineTo(loco + 10, railY - 104);
        ctx.quadraticCurveTo(loco + 14, railY - 112, loco + 26, railY - 112);
        ctx.lineTo(loco + 92, railY - 112);
        ctx.quadraticCurveTo(loco + 112, railY - 104, loco + 122, railY - 82);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = wrecked ? '#56656C' : '#0D2B3E';
        ctx.fillRect(loco, railY - 120, 130, 40);
        if (!opts.empty) [loco + 14, loco + 56].forEach((px, i) => {
            ctx.save();
            ctx.translate(px, railY - 52);
            ctx.scale(0.55, 0.55);
            this.drawTofuPilot(ctx, 0, 0, { rescued: true, pose: 'seated', t, seed: i });
            ctx.restore();
        });
        // Control panel glow
        if (!wrecked) {
            ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
            ctx.fillRect(loco + 10, railY - 86, 112, 4);
        }
        ctx.fillStyle = wrecked ? 'rgba(90, 110, 120, 0.4)' : 'rgba(120, 220, 255, 0.25)';
        ctx.fillRect(loco, railY - 120, 130, 40);
        ctx.restore();
        // Body: a long streamlined nose, with the windscreen cut out so the pilots show
        const grad = ctx.createLinearGradient(0, railY - 122, 0, railY - 12);
        grad.addColorStop(0, hull);
        grad.addColorStop(1, hullShade);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(loco, railY - 12);
        ctx.lineTo(loco, railY - 106);
        ctx.quadraticCurveTo(loco, railY - 122, loco + 18, railY - 122);
        ctx.lineTo(loco + 90, railY - 122);
        ctx.bezierCurveTo(loco + 160, railY - 120, loco + locoW + 10, railY - 70, loco + locoW + 14, railY - 32);
        ctx.quadraticCurveTo(loco + locoW + 14, railY - 12, loco + locoW - 10, railY - 12);
        ctx.closePath();
        ctx.moveTo(loco + 10, railY - 82);
        ctx.lineTo(loco + 122, railY - 82);
        ctx.quadraticCurveTo(loco + 112, railY - 104, loco + 92, railY - 112);
        ctx.lineTo(loco + 26, railY - 112);
        ctx.quadraticCurveTo(loco + 14, railY - 112, loco + 10, railY - 104);
        ctx.closePath();
        ctx.fill('evenodd');
        ctx.strokeStyle = trim;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Windscreen frame
        ctx.strokeStyle = glassEdge;
        ctx.beginPath();
        ctx.moveTo(loco + 10, railY - 82);
        ctx.lineTo(loco + 10, railY - 104);
        ctx.quadraticCurveTo(loco + 14, railY - 112, loco + 26, railY - 112);
        ctx.lineTo(loco + 92, railY - 112);
        ctx.quadraticCurveTo(loco + 112, railY - 104, loco + 122, railY - 82);
        ctx.stroke();
        // Glow and accent stripes sweeping up into the nose
        ctx.lineWidth = 3;
        ctx.strokeStyle = glow;
        ctx.beginPath();
        ctx.moveTo(loco + 4, railY - 26);
        ctx.lineTo(loco + 150, railY - 26);
        ctx.quadraticCurveTo(loco + 190, railY - 28, loco + locoW + 8, railY - 44);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(loco + 4, railY - 19);
        ctx.lineTo(loco + locoW + 4, railY - 19);
        ctx.stroke();
        ctx.fillStyle = trim;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TOFU EXPRESS', loco + 70, railY - 40);
        // LED headlight strip at the tip of the nose
        if (!wrecked) {
            ctx.fillStyle = '#E0F7FA';
            ctx.beginPath();
            ctx.ellipse(loco + locoW + 4, railY - 40, 8, 3, -0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
            ctx.beginPath();
            ctx.moveTo(loco + locoW + 8, railY - 42);
            ctx.lineTo(loco + locoW + 70, railY - 62);
            ctx.lineTo(loco + locoW + 70, railY - 22);
            ctx.closePath();
            ctx.fill();
        }

        // Once wrecked: sparks and black smoke pouring out of the lead car
        if (wrecked) {
            for (let i = 0; i < 4; i++) {
                const age = (t * 1.5 + i / 4) % 1;
                ctx.fillStyle = `rgba(40, 40, 40, ${0.5 * (1 - age)})`;
                ctx.beginPath();
                ctx.arc(loco + 110 - age * 60, railY - 110 - age * 40, 6 + age * 12, 0, Math.PI * 2);
                ctx.fill();
            }
            for (let i = 0; i < 6; i++) {
                const age = (t * 3 + i / 6) % 1;
                ctx.fillStyle = `rgba(0, 229, 255, ${1 - age})`;
                ctx.fillRect(loco + 40 + i * 22 + age * 10, railY - 30 - age * 30, 2, 2);
            }
        }
        ctx.restore();
    }

    // Popcorn's Apache gunship facing left, centered on (x, y), flown by a stickman
    drawApache(ctx, x, y, t) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.08 + Math.sin(t * 2) * 0.03);
        const body = '#3B4232';

        // Tail boom, fin and tail rotor
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(30, -10);
        ctx.lineTo(130, -6);
        ctx.lineTo(130, 2);
        ctx.lineTo(30, 8);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(118, -4);
        ctx.lineTo(132, -30);
        ctx.lineTo(140, -30);
        ctx.lineTo(132, 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(112, 0, 24, 4); // horizontal stabilizer
        const tr = Math.cos(t * 55) * 13;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(136, -18 - tr);
        ctx.lineTo(136, -18 + tr);
        ctx.stroke();

        // Slim fuselage with a pointed nose and chin gun
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(-80, 6);
        ctx.quadraticCurveTo(-72, -12, -40, -16);
        ctx.lineTo(30, -16);
        ctx.lineTo(40, 2);
        ctx.lineTo(30, 14);
        ctx.lineTo(-50, 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1C2016';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#222';
        ctx.fillRect(-70, 12, 12, 6);
        ctx.fillRect(-84, 15, 16, 3);

        // Tandem cockpit with a stickman pilot in each seat
        [-52, -26].forEach(cx => {
            ctx.fillStyle = 'rgba(150, 190, 210, 0.85)';
            ctx.beginPath();
            ctx.ellipse(cx, -18, 13, 10, 0, Math.PI, 0);
            ctx.fill();
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, -22, 3.5, 0, Math.PI * 2);
            ctx.moveTo(cx, -18.5);
            ctx.lineTo(cx, -12);
            ctx.moveTo(cx - 5, -16);
            ctx.lineTo(cx + 5, -16);
            ctx.stroke();
        });

        // Engine hump and Popcorn's red badge
        ctx.fillStyle = '#2E3427';
        ctx.fillRect(-8, -24, 34, 9);
        ctx.fillStyle = '#C62828';
        ctx.beginPath();
        ctx.arc(10, 2, 6, 0, Math.PI * 2);
        ctx.fill();

        // Stub wings with rocket pods
        ctx.fillStyle = '#2E3427';
        ctx.fillRect(-12, 6, 34, 5);
        ctx.fillStyle = '#4E5543';
        [-14, 10].forEach(px => {
            ctx.beginPath();
            ctx.ellipse(px, 15, 9, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Main rotor
        ctx.fillStyle = '#222';
        ctx.fillRect(-2, -32, 5, 9);
        ctx.fillStyle = 'rgba(30, 30, 30, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, -33, 95, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        const blade = Math.cos(t * 42) * 95;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-blade, -33);
        ctx.lineTo(blade, -33);
        ctx.stroke();

        ctx.restore();
    }

    // Helicopter position/tilt over the course of the intro (world coords, camera at 0)
    getIntroHeliPose(t) {
        const bob = Math.sin(t * 3) * 4;
        if (t < 2.5) {
            const k = 1 - Math.pow(1 - t / 2.5, 3); // ease out
            return { x: -250 + 550 * k, y: 105 + bob, angle: 0.15 * (1 - k), damaged: false };
        }
        if (t < 5.5) {
            return { x: 300, y: 105 + bob, angle: 0, damaged: false };
        }
        if (t < 7) {
            const d = t - 5.5;
            return { x: 300 + d * d * 120, y: 105 - d * 10 + bob, angle: 0.15, damaged: false };
        }
        // Hit - wobbling, smoking, losing altitude as it flies off screen
        const d = t - 7;
        return {
            x: 570 + d * 260,
            y: 90 + d * d * 25,
            angle: 0.15 + Math.sin(d * 12) * 0.25 + d * 0.3,
            damaged: true
        };
    }

    renderHeliIntro() {
        const intro = this.heliIntro;
        const t = (Date.now() - intro.startTime) / 1000;
        if (t >= intro.duration) {
            this.endHeliIntro();
            return;
        }

        const ctx = this.ctx;
        const groundY = 320;
        const heli = this.getIntroHeliPose(t);

        this.renderBackground();
        ctx.save();
        ctx.translate(-this.camera.x, 0);
        this.renderGround();
        this.renderForceFields();

        // Distant crash on the far horizon, behind everything else
        if (t >= 9.5) {
            const k = t - 9.5;
            const cx = this.canvas.width - 90;
            const cy = 245;
            if (k < 0.8) {
                const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
                flash.addColorStop(0, `rgba(255, 240, 200, ${1 - k / 0.8})`);
                flash.addColorStop(1, 'rgba(255, 120, 0, 0)');
                ctx.fillStyle = flash;
                ctx.fillRect(cx - 70, cy - 70, 140, 140);
            }
            for (let i = 0; i < 6; i++) {
                const rise = (k * 0.6 + i / 6) % 1;
                ctx.fillStyle = `rgba(60, 60, 60, ${0.5 * (1 - rise)})`;
                ctx.beginPath();
                ctx.arc(cx + Math.sin(i * 2 + k) * 5, cy - rise * 110, 5 + rise * 14, 0, Math.PI * 2);
                ctx.fill();
            }
            if (!intro.crashSoundPlayed) {
                intro.crashSoundPlayed = true;
                this.playBossExplosion();
            }
        }

        // Artillery truck drives in from the right, parks, and fires flak at the helicopter.
        // First two shells miss, the third one hits at t = 7.
        if (t >= 4.5) {
            const truckScale = 1.5;
            const parkX = 440;
            const retreatStart = 8.2;
            let truckX = parkX;
            let moving = false;
            const retreating = t >= retreatStart;
            if (t < 5.5) {
                const k = 1 - Math.pow(1 - (t - 4.5), 2);
                truckX = 850 - (850 - parkX) * k;
                moving = true;
            } else if (retreating) {
                // Job done - turn around and speed off to the right
                const d = t - retreatStart;
                truckX = parkX + d * d * 260;
                moving = true;
            }
            const pivotX = truckX + 160 * truckScale;
            const pivotY = groundY - 72 * truckScale;
            const barrelLength = 95 * truckScale;
            const aimAt = (time) => {
                const p = this.getIntroHeliPose(time);
                return Math.atan2(p.y - pivotY, p.x - pivotX);
            };

            // Keep tracking the heli until it's out of sight; barrel rests while retreating
            const barrelAngle = retreating ? -2.6 : aimAt(Math.min(t, 7.6));

            const shots = [
                { fire: 5.6, miss: { x: -70, y: -45 } },
                { fire: 6.1, miss: { x: 60, y: -35 } },
                { fire: 6.6, miss: null }
            ];
            const flight = 0.4;

            let recoil = 0;
            shots.forEach((shot, i) => {
                const dt = t - shot.fire;
                if (dt < 0) return;
                if (dt < 0.25) recoil = 14 * (1 - dt / 0.25);
                if (intro.shotsFired <= i) {
                    intro.shotsFired = i + 1;
                    this.playTankShoot();
                }
            });

            // Dust kicked up when it spins around to retreat
            if (retreating && t - retreatStart < 0.8) {
                const k = (t - retreatStart) / 0.8;
                for (let i = 0; i < 4; i++) {
                    ctx.fillStyle = `rgba(160, 140, 100, ${0.5 * (1 - k)})`;
                    ctx.beginPath();
                    ctx.arc(parkX + 30 + i * 90 - k * 40, groundY - 8 - k * 15, 10 + k * 20, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (truckX < this.canvas.width + 50) {
                this.drawArtilleryTruck(ctx, truckX, groundY, {
                    barrelAngle,
                    recoil,
                    wheelRot: moving ? t * 12 : 4.5 * 12,
                    moving,
                    facingRight: retreating,
                    scale: truckScale,
                    t
                });
            }

            shots.forEach(shot => {
                const dt = t - shot.fire;
                if (dt < 0) return;
                const a = aimAt(shot.fire);
                const mx = pivotX + Math.cos(a) * barrelLength;
                const my = pivotY + Math.sin(a) * barrelLength;

                // Muzzle flash and smoke puff
                if (dt < 0.1) {
                    ctx.fillStyle = '#FFF59D';
                    ctx.beginPath();
                    ctx.arc(mx, my, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FF9800';
                    ctx.beginPath();
                    ctx.arc(mx + Math.cos(a) * 12, my + Math.sin(a) * 12, 9, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (dt < 0.8) {
                    ctx.fillStyle = `rgba(120, 120, 120, ${0.5 * (1 - dt / 0.8)})`;
                    ctx.beginPath();
                    ctx.arc(mx + dt * 10, my - dt * 30, 8 + dt * 20, 0, Math.PI * 2);
                    ctx.fill();
                }

                const target = this.getIntroHeliPose(shot.fire + flight);
                const tx = target.x + (shot.miss ? shot.miss.x : 0);
                const ty = target.y + (shot.miss ? shot.miss.y : 0);
                if (dt < flight) {
                    // Shell in flight with a glowing tracer tail
                    const p = dt / flight;
                    const sx = mx + (tx - mx) * p;
                    const sy = my + (ty - my) * p;
                    const tailP = Math.max(0, p - 0.12);
                    ctx.strokeStyle = 'rgba(255, 213, 79, 0.8)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(mx + (tx - mx) * tailP, my + (ty - my) * tailP);
                    ctx.lineTo(sx, sy);
                    ctx.stroke();
                    ctx.fillStyle = '#212121';
                    ctx.beginPath();
                    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shot.miss && dt < flight + 0.6) {
                    // Flak burst near the helicopter
                    const b = (dt - flight) / 0.6;
                    ctx.fillStyle = `rgba(40, 40, 40, ${0.8 * (1 - b)})`;
                    ctx.beginPath();
                    ctx.arc(tx, ty, 12 + b * 22, 0, Math.PI * 2);
                    ctx.fill();
                    if (b < 0.35) {
                        ctx.fillStyle = `rgba(255, 152, 0, ${1 - b / 0.35})`;
                        ctx.beginPath();
                        ctx.arc(tx, ty, 10, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
        }

        // Smoke trail once damaged
        if (heli.damaged && heli.x < 900) {
            intro.smoke.push({ x: heli.x - 80, y: heli.y - 40, born: t });
        }
        intro.smoke = intro.smoke.filter(p => t - p.born < 1.6);
        intro.smoke.forEach(p => {
            const age = t - p.born;
            ctx.fillStyle = `rgba(60, 60, 60, ${0.6 * (1 - age / 1.6)})`;
            ctx.beginPath();
            ctx.arc(p.x - age * 20, p.y - age * 25, 8 + age * 18, 0, Math.PI * 2);
            ctx.fill();
        });

        // Rope and Tofu sliding down it
        const ropeTopX = heli.x - 5;
        const ropeTopY = heli.y + 30;
        let tofuVisible = false;
        if (t >= 2.8 && t < 5.5) {
            const slide = Math.min(1, Math.max(0, (t - 3.0) / 1.6));
            const ropeBottom = t < 4.8 ? groundY - 10 : groundY - 10 - (t - 4.8) / 0.7 * (groundY - 10 - ropeTopY);
            ctx.strokeStyle = '#8D6E63';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ropeTopX, ropeTopY);
            ctx.lineTo(ropeTopX + Math.sin(t * 4) * 3, ropeBottom);
            ctx.stroke();

            if (t >= 3.0) {
                tofuVisible = true;
                this.player.x = ropeTopX - this.player.width / 2;
                this.player.y = ropeTopY - 20 + (220 - (ropeTopY - 20)) * slide;
            }
        } else if (t >= 5.5) {
            tofuVisible = true;
            this.player.x = 300 - 5 - this.player.width / 2;
            this.player.y = 220;
        }
        if (tofuVisible) {
            this.player.facingRight = true;
            this.player.isMoving = false;
            this.player.render(ctx);
        }

        // Helicopter
        if (heli.x < 1000) {
            this.drawHelicopter(ctx, heli.x, heli.y, heli.angle, { damaged: heli.damaged, t });
        }

        // Impact sparks when the heli is hit
        if (t >= 7 && t < 7.7) {
            const k = (t - 7) / 0.7;
            for (let i = 0; i < 8; i++) {
                const a = i / 8 * Math.PI * 2;
                ctx.fillStyle = `rgba(255, ${150 + i * 10}, 0, ${1 - k})`;
                ctx.beginPath();
                ctx.arc(heli.x + Math.cos(a) * 40 * k, heli.y + Math.sin(a) * 40 * k, 10 * (1 - k) + 3, 0, Math.PI * 2);
                ctx.fill();
            }
            if (!intro.hitSoundPlayed) {
                intro.hitSoundPlayed = true;
                this.playTankExplosion();
            }
        }

        ctx.restore();

        // Cinematic bars and captions
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, 36);
        ctx.fillRect(0, this.canvas.height - 36, this.canvas.width, 36);

        let caption;
        if (t < 2.5) caption = 'Somewhere behind enemy lines...';
        else if (t < 5.5) caption = 'DROP ZONE! Go get em, Tofu!';
        else if (t < 7) caption = 'ENEMY FIRE! Get out of here!';
        else if (t < 9.5) caption = 'MAYDAY! MAYDAY! We\'re going down!';
        else caption = 'The helicopter crash-landed far away... FIND IT!';

        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = t >= 7 && t < 9.5 ? '#FF5252' : '#FFFFFF';
        const shake = t >= 7 && t < 9.5 ? Math.sin(t * 50) * 2 : 0;
        ctx.fillText(caption, this.canvas.width / 2 + shake, 25);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#AAAAAA';
        ctx.textAlign = 'right';
        ctx.fillText('SPACE / tap to skip', this.canvas.width - 12, this.canvas.height - 14);
        ctx.restore();
    }

    // Draws Popcorn's anti-aircraft artillery truck facing left (or right with opts.facingRight). x is the truck's left edge,
    // groundY is where the wheels touch. Turret pivot is at (x + 160 * scale, groundY - 72 * scale).
    drawArtilleryTruck(ctx, x, groundY, opts = {}) {
        const t = opts.t || Date.now() / 1000;
        const olive = '#6B7B3A';
        const oliveDark = '#55622D';
        ctx.save();

        // Mirror around the truck's center to face right, then scale up from its bottom-left corner
        const scale = opts.scale || 1;
        if (opts.facingRight) {
            ctx.translate(x * 2 + 238 * scale, 0);
            ctx.scale(-1, 1);
        }
        ctx.translate(x, groundY);
        ctx.scale(scale, scale);
        ctx.translate(-x, -groundY);

        // Exhaust puffs while driving
        if (opts.moving) {
            for (let i = 0; i < 3; i++) {
                const age = (t * 2 + i / 3) % 1;
                ctx.fillStyle = `rgba(90, 90, 90, ${0.4 * (1 - age)})`;
                ctx.beginPath();
                ctx.arc(x + 232 + age * 25, groundY - 30 - age * 20, 4 + age * 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Chassis
        ctx.fillStyle = '#3B3B3B';
        ctx.fillRect(x + 8, groundY - 40, 222, 12);

        // Cab with slanted windshield
        ctx.fillStyle = olive;
        ctx.beginPath();
        ctx.moveTo(x + 6, groundY - 40);
        ctx.lineTo(x + 6, groundY - 70);
        ctx.lineTo(x + 22, groundY - 100);
        ctx.lineTo(x + 78, groundY - 100);
        ctx.lineTo(x + 78, groundY - 40);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3E4721';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Windshield and side window
        ctx.fillStyle = '#9FD3FF';
        ctx.beginPath();
        ctx.moveTo(x + 12, groundY - 72);
        ctx.lineTo(x + 25, groundY - 94);
        ctx.lineTo(x + 40, groundY - 94);
        ctx.lineTo(x + 40, groundY - 72);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x + 48, groundY - 94, 22, 20);

        // Headlight, bumper and grille
        ctx.fillStyle = '#FFF59D';
        ctx.fillRect(x + 2, groundY - 62, 6, 8);
        ctx.fillStyle = '#2B2B2B';
        ctx.fillRect(x, groundY - 46, 14, 8);
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 8, groundY - 66 + i * 6, 6, 3);
        }

        // Flatbed with camo spots
        ctx.fillStyle = oliveDark;
        ctx.fillRect(x + 80, groundY - 62, 150, 22);
        ctx.fillStyle = '#4A5527';
        ctx.beginPath();
        ctx.ellipse(x + 105, groundY - 52, 12, 5, 0.3, 0, Math.PI * 2);
        ctx.ellipse(x + 200, groundY - 50, 14, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Popcorn army emblem on the door
        ctx.fillStyle = '#C62828';
        ctx.beginPath();
        ctx.arc(x + 60, groundY - 56, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF8E1';
        ctx.beginPath();
        ctx.arc(x + 57, groundY - 58, 3, 0, Math.PI * 2);
        ctx.arc(x + 63, groundY - 58, 3, 0, Math.PI * 2);
        ctx.arc(x + 60, groundY - 53, 3, 0, Math.PI * 2);
        ctx.fill();

        // Ammo crates at the back of the bed
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(x + 196, groundY - 80, 28, 18);
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 196, groundY - 80, 28, 18);

        // Barrel (drawn before the turret so its base hides under the armor)
        const px = x + 160;
        const py = groundY - 72;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(opts.barrelAngle !== undefined ? opts.barrelAngle : -2.6);
        ctx.translate(-(opts.recoil || 0), 0);
        ctx.fillStyle = '#2E2E2E';
        ctx.fillRect(0, -5, 95, 10);
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(82, -8, 14, 16); // muzzle brake
        ctx.fillRect(30, -7, 8, 14);  // barrel collar
        ctx.restore();

        // Turret dome and armor shield
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(px - 30, groundY - 70, 60, 10);
        ctx.fillStyle = olive;
        ctx.beginPath();
        ctx.arc(px, py, 24, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3E4721';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wheels with rotating spokes
        const wheelRot = opts.wheelRot || 0;
        [40, 150, 198].forEach(wx => {
            const cx = x + wx;
            const cy = groundY - 17;
            ctx.fillStyle = '#1E1E1E';
            ctx.beginPath();
            ctx.arc(cx, cy, 17, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#757575';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#424242';
            ctx.lineWidth = 2;
            for (let s = 0; s < 3; s++) {
                const a = -wheelRot + s * Math.PI / 3;
                ctx.beginPath();
                ctx.moveTo(cx - Math.cos(a) * 8, cy - Math.sin(a) * 8);
                ctx.lineTo(cx + Math.cos(a) * 8, cy + Math.sin(a) * 8);
                ctx.stroke();
            }
        });

        ctx.restore();
    }

    // Draws a Chinook-style tandem-rotor helicopter facing right, centered on (x, y).
    // Fuselage spans roughly x -105..100, y -24..24; wheels reach y +38.
    drawHelicopter(ctx, x, y, angle, opts = {}) {
        const t = opts.t || Date.now() / 1000;
        const olive = opts.damaged ? '#4A5530' : '#556B2F';
        const oliveDark = '#3E4D22';
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Landing gear - two wheels front, two back
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(60, 20); ctx.lineTo(62, 32);
        ctx.moveTo(-62, 20); ctx.lineTo(-64, 32);
        ctx.stroke();
        ctx.fillStyle = '#1E1E1E';
        [62, 48, -64, -78].forEach(wx => {
            ctx.beginPath();
            ctx.arc(wx, 33, 6, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Rear pylon - tall fin holding the back rotor
        ctx.fillStyle = olive;
        ctx.beginPath();
        ctx.moveTo(-105, -18);
        ctx.lineTo(-98, -46);
        ctx.lineTo(-62, -46);
        ctx.lineTo(-50, -20);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = oliveDark;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Long boxy fuselage with a rounded nose and a sloped rear ramp
        ctx.fillStyle = olive;
        ctx.beginPath();
        ctx.moveTo(-105, -20);
        ctx.lineTo(70, -24);
        ctx.quadraticCurveTo(98, -22, 102, 2);
        ctx.quadraticCurveTo(100, 22, 80, 24);
        ctx.lineTo(-80, 24);
        ctx.lineTo(-110, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = oliveDark;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Front rotor hump over the cockpit
        ctx.fillStyle = olive;
        ctx.beginPath();
        ctx.moveTo(52, -23);
        ctx.lineTo(60, -34);
        ctx.lineTo(84, -34);
        ctx.lineTo(90, -22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Side fuel pods along the bottom
        ctx.fillStyle = oliveDark;
        ctx.beginPath();
        ctx.ellipse(-15, 18, 55, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cockpit glass
        ctx.fillStyle = opts.wrecked ? '#5C6B73' : '#9FD3FF';
        ctx.beginPath();
        ctx.moveTo(74, -20);
        ctx.quadraticCurveTo(94, -18, 98, -2);
        ctx.lineTo(78, -2);
        ctx.closePath();
        ctx.fill();
        
        // Row of round cabin windows
        ctx.fillStyle = opts.wrecked ? '#5C6B73' : '#B3E0FF';
        for (let i = 0; i < 6; i++) {
            if (i === 3) continue; // gap for the door
            ctx.beginPath();
            ctx.arc(-78 + i * 24, -8, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Open side door that Tofu ropes down from
        ctx.fillStyle = '#1E2412';
        ctx.fillRect(-14, -16, 22, 30);
        
        // Tofu Alliance emblem
        ctx.fillStyle = '#FFF8E1';
        ctx.beginPath();
        ctx.arc(38, 6, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Rotor masts
        ctx.fillStyle = '#333';
        ctx.fillRect(69, -40, 6, 7);
        ctx.fillRect(-83, -52, 6, 7);
        
        // Tandem rotors - front and back spin opposite ways
        const rotors = [{ hx: 72, hy: -41, dir: 1 }, { hx: -80, hy: -53, dir: -1 }];
        rotors.forEach(r => {
            if (opts.wrecked) {
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(r.hx, r.hy);
                ctx.lineTo(r.hx + 40 * r.dir, r.hy - 10);
                ctx.lineTo(r.hx + 60 * r.dir, r.hy + 12);
                ctx.moveTo(r.hx, r.hy);
                ctx.lineTo(r.hx - 30 * r.dir, r.hy + 4);
                ctx.stroke();
            } else {
                ctx.fillStyle = 'rgba(40, 40, 40, 0.22)';
                ctx.beginPath();
                ctx.ellipse(r.hx, r.hy, 85, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                const blade = Math.cos(t * 40 * r.dir) * 85;
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(r.hx - blade, r.hy);
                ctx.lineTo(r.hx + blade, r.hy);
                ctx.stroke();
            }
        });
        
        // Fire on the rear pylon of a damaged heli
        if (opts.damaged) {
            for (let i = 0; i < 3; i++) {
                const fy = Math.sin(t * 20 + i) * 4;
                ctx.fillStyle = i === 0 ? '#FF6F00' : i === 1 ? '#FFA000' : '#FFEB3B';
                ctx.beginPath();
                ctx.arc(-78 + i * 7, -36 + fy - i * 4, 10 - i * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
    
    // Crashed helicopter sitting on the ground, still smoking, with the captured
    // pilots surrendering to Popcorn's guards next to it
    renderHeliWreck() {
        const wreck = this.heliWreck;
        if (!wreck || this.currentWorld !== wreck.world || this.currentLevel !== wreck.level) return;
        const viewLeft = this.camera.x - 300;
        const viewRight = this.camera.x + this.canvas.width + 500;
        if (wreck.x < viewLeft || wreck.x > viewRight) return;

        const ctx = this.ctx;
        const t = Date.now() / 1000;

        // Scorch mark
        ctx.fillStyle = 'rgba(30, 20, 10, 0.5)';
        ctx.beginPath();
        ctx.ellipse(wreck.x, 322, 150, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        this.drawHelicopter(ctx, wreck.x, 287, 0.1, { wrecked: true, damaged: true, t });

        // Rising smoke
        for (let i = 0; i < 6; i++) {
            const rise = (t * 0.4 + i / 6) % 1;
            ctx.fillStyle = `rgba(70, 70, 70, ${0.5 * (1 - rise)})`;
            ctx.beginPath();
            ctx.arc(wreck.x - 80 + Math.sin(i * 2 + t) * 10, 245 - rise * 200, 10 + rise * 25, 0, Math.PI * 2);
            ctx.fill();
        }

        // Pulsing marker until found
        if (!wreck.found) {
            const bounce = Math.sin(t * 4) * 6;
            ctx.fillStyle = '#FFD600';
            ctx.beginPath();
            ctx.moveTo(wreck.x - 12, 150 + bounce);
            ctx.lineTo(wreck.x + 12, 150 + bounce);
            ctx.lineTo(wreck.x, 170 + bounce);
            ctx.closePath();
            ctx.fill();
        }

        // Guards stand frozen with rifles on the pilots until Tofu gets close
        wreck.guards.forEach(guard => {
            if (guard.enemy) return; // now a live enemy, drawn with the others
            const sprite = guard.type === 0 ? this.assets.soldier1Sprite : this.assets.soldier2Sprite;
            if (!sprite) return;
            const size = guard.type === 0 ? { w: 140, h: 150, y: 200 } : { w: 120, h: 140, y: 207 };
            ctx.save();
            ctx.translate(guard.x + size.w, size.y);
            ctx.scale(-1, 1); // face left, toward the pilots
            ctx.drawImage(sprite, 0, 0, size.w, size.h);
            ctx.restore();
        });

        // Pilots - hands up while guarded, cheering once rescued
        wreck.pilots.forEach((pilotX, i) => {
            this.drawTofuPilot(ctx, pilotX, 320, { rescued: wreck.rescued, t, seed: i });
        });

        // Speech bubble over the first pilot
        const bubble = wreck.rescued ? 'Thanks, Tofu!' : (Math.sin(t * 1.5) > -0.3 ? "Don't shoot!" : '');
        if (bubble) {
            const bx = wreck.pilots[0] + 25;
            const by = 196;
            ctx.save();
            ctx.font = 'bold 12px Arial';
            const w = ctx.measureText(bubble).width + 14;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#2A241C';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(bx - w / 2, by - 18, w, 20);
            ctx.moveTo(bx - 5, by + 2);
            ctx.lineTo(bx, by + 9);
            ctx.lineTo(bx + 5, by + 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#2A241C';
            ctx.textAlign = 'center';
            ctx.fillText(bubble, bx, by - 4);
            ctx.restore();
        }
    }

    // A tofu fighter-jet pilot drawn to match the main Tofu sprite: cream block with a dark
    // outline, in a gray jet helmet with the visor raised, a dangling oxygen mask, a
    // sage-green flight suit and torso harness. x is the left edge, groundY is where the feet touch.
    drawTofuPilot(ctx, x, groundY, opts = {}) {
        const t = opts.t || Date.now() / 1000;
        // role: 'pilot' (default), 'soldier' or 'captain'. pose 'seated' keeps them still with
        // their arms down - used for the crew riding inside the monorail.
        const role = opts.role || 'pilot';
        const seated = opts.pose === 'seated';
        const armed = opts.pose === 'armed'; // arms and gun are drawn by drawArmedCrew
        const seed = opts.seed || 0;
        const outline = '#2A241C';
        const bodyW = 46;
        const bodyH = 56;
        const legH = 20;
        // Rescued pilots hop for joy; captured ones tremble
        const hop = seated || armed ? 0 : opts.rescued ? Math.abs(Math.sin(t * 6 + seed)) * 10 : 0;
        const shake = seated || armed || opts.rescued ? 0 : Math.sin(t * 40 + seed * 2) * 0.8;
        const left = x + shake;
        const bottom = groundY - legH - hop;
        const top = bottom - bodyH;
        const cx = left + bodyW / 2;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Legs
        ctx.strokeStyle = outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 9, bottom); ctx.lineTo(cx - 10, groundY - hop);
        ctx.moveTo(cx + 9, bottom); ctx.lineTo(cx + 10, groundY - hop);
        ctx.stroke();

        // Arms up - straight up and trembling, or waving when rescued
        const wave = opts.rescued ? Math.sin(t * 10 + seed) * 0.5 : 0;
        if (seated) {
            // Arms resting at the sides
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            [-1, 1].forEach(side => {
                const shoulderX = cx + side * (bodyW / 2 - 2);
                const handX = cx + side * (bodyW / 2 + 5);
                ctx.beginPath();
                ctx.moveTo(shoulderX, top + 34);
                ctx.lineTo(handX, top + 50);
                ctx.stroke();
                ctx.fillStyle = outline;
                ctx.beginPath();
                ctx.arc(handX, top + 52, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        } else if (!armed) [-1, 1].forEach(side => {
            // Arms spread wide enough to clear the helmet so the "hands up" reads clearly
            const shoulderX = cx + side * (bodyW / 2 - 2);
            const shoulderY = top + 24;
            const elbowX = shoulderX + side * (16 + wave * 6);
            const elbowY = top + 6;
            const handX = shoulderX + side * (14 + wave * 14);
            const handY = top - 22 + (opts.rescued ? -wave * 4 : 0);
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(elbowX, elbowY);
            ctx.lineTo(handX, handY);
            ctx.stroke();
            ctx.fillStyle = outline;
            ctx.beginPath();
            ctx.arc(handX, handY - 2, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Tofu body
        ctx.fillStyle = '#EFE3C2';
        ctx.strokeStyle = outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(left, top, bodyW, bodyH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#D9C9A0';
        [[8, 24], [36, 30], [12, 40], [30, 18]].forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(left + dx, top + dy, 1.3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Sage-green flight suit from the chest down, zipped up the middle
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(left, top, bodyW, bodyH, 6);
        ctx.clip();
        ctx.fillStyle = role === 'soldier' ? '#556B2F' : role === 'captain' ? '#1F2A44' : role === 'general' ? '#4B5320' : '#7A8566';
        ctx.fillRect(left, top + 32, bodyW, bodyH - 32);
        ctx.restore();
        ctx.strokeStyle = outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left, top + 32); ctx.lineTo(left + bodyW, top + 32);
        ctx.stroke();
        if (role === 'soldier') {
            // Bandolier across the chest, webbing belt and ammo pouches
            ctx.strokeStyle = '#3E2F1C';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(left + 4, top + 33); ctx.lineTo(left + bodyW - 6, bottom - 8);
            ctx.moveTo(left + 1, bottom - 6); ctx.lineTo(left + bodyW - 1, bottom - 6);
            ctx.stroke();
            ctx.fillStyle = '#6B5A3A';
            ctx.fillRect(left + 6, bottom - 12, 8, 7);
            ctx.fillRect(left + bodyW - 14, bottom - 12, 8, 7);
            ctx.fillStyle = '#FFC107';
            ctx.fillRect(cx - 3, bottom - 8, 6, 4);
            // Tofu Alliance shoulder patch
            ctx.fillStyle = '#7CB342';
            ctx.beginPath();
            ctx.arc(left + bodyW - 9, top + 38, 3.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (role === 'captain' || role === 'general') {
            // Gold epaulettes, a double row of brass buttons and a row of medal ribbons
            ctx.fillStyle = '#FFC107';
            ctx.fillRect(left - 1, top + 31, 10, 4);
            ctx.fillRect(left + bodyW - 9, top + 31, 10, 4);
            if (role === 'general') {
                // Silver general's stars on both shoulders and a second row of ribbons
                ctx.fillStyle = '#ECEFF1';
                [left + 1, left + 4.5, left + bodyW - 7, left + bodyW - 3.5].forEach(sx => ctx.fillRect(sx, top + 31.5, 2.5, 2.5));
                ['#2E7D32', '#C62828', '#6A1B9A'].forEach((c, i) => {
                    ctx.fillStyle = c;
                    ctx.fillRect(left + 5 + i * 4, top + 41, 4, 3);
                });
                ctx.fillStyle = '#FFC107';
            }
            [0, 1, 2].forEach(i => {
                ctx.beginPath();
                ctx.arc(cx - 4, top + 38 + i * 6, 1.4, 0, Math.PI * 2);
                ctx.arc(cx + 4, top + 38 + i * 6, 1.4, 0, Math.PI * 2);
                ctx.fill();
            });
            ['#C62828', '#1565C0', '#FFC107'].forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.fillRect(left + 5 + i * 4, top + 37, 4, 3);
            });
            ctx.fillStyle = '#FFC107';
            ctx.fillRect(left + 1, bottom - 6, bodyW - 2, 2);
        } else {
            ctx.strokeStyle = '#B0B7A0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, top + 33); ctx.lineTo(cx, bottom - 1);
            ctx.stroke();
    
            // Black torso harness: shoulder straps down to a chest buckle, plus a lap belt
            ctx.strokeStyle = '#1C1C1C';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(left + 8, top + 32); ctx.lineTo(cx - 3, top + 44);
            ctx.moveTo(left + bodyW - 8, top + 32); ctx.lineTo(cx + 3, top + 44);
            ctx.moveTo(left + 2, bottom - 6); ctx.lineTo(left + bodyW - 2, bottom - 6);
            ctx.stroke();
            ctx.fillStyle = '#B0BEC5';
            ctx.fillRect(cx - 4, top + 42, 8, 5);
            ctx.fillRect(cx - 3, bottom - 8, 6, 4);
    
            // Squadron patch and leather name tag
            ctx.fillStyle = '#C62828';
            ctx.beginPath();
            ctx.arc(left + 10, top + 39, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath();
            ctx.arc(left + 10, top + 39, 1.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(left + bodyW - 15, top + 36, 11, 5);
    
        }

        // Face - worried eyes and an "o" mouth (big smile once rescued)
        ctx.fillStyle = outline;
        ctx.beginPath();
        ctx.ellipse(cx - 8, top + 20, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 8, top + 20, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        if (opts.rescued) {
            ctx.arc(cx, top + 25, 5, 0.15 * Math.PI, 0.85 * Math.PI);
        } else {
            ctx.moveTo(cx - 12, top + 15); ctx.lineTo(cx - 5, top + 12);  // worried brows, raised in the middle
            ctx.moveTo(cx + 12, top + 15); ctx.lineTo(cx + 5, top + 12);
            ctx.moveTo(cx + 2.5, top + 29);
            ctx.arc(cx, top + 29, 2.5, 0, Math.PI * 2);
        }
        ctx.stroke();
        if (!opts.rescued) {
            // Nervous sweat drop
            ctx.fillStyle = '#81D4FA';
            ctx.beginPath();
            ctx.moveTo(left + bodyW - 4, top + 10);
            ctx.quadraticCurveTo(left + bodyW + 1, top + 17, left + bodyW - 4, top + 19);
            ctx.quadraticCurveTo(left + bodyW - 9, top + 17, left + bodyW - 4, top + 10);
            ctx.fill();
        }

        if (role === 'captain' || role === 'general') {
            // Distinguished mustache (gray for the general)
            ctx.fillStyle = role === 'general' ? '#9E9E9E' : '#4E342E';
            ctx.beginPath();
            ctx.ellipse(cx - 4, top + 24, 4.5, 2, 0.25, 0, Math.PI * 2);
            ctx.ellipse(cx + 4, top + 24, 4.5, 2, -0.25, 0, Math.PI * 2);
            ctx.fill();
        }

        if (role === 'soldier') {
            // Olive steel combat helmet with a brim, chin strap and camo spots
            ctx.strokeStyle = '#3E2F1C';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(left + 3, top + 6); ctx.lineTo(left + 6, top + 30);
            ctx.moveTo(left + bodyW - 3, top + 6); ctx.lineTo(left + bodyW - 6, top + 30);
            ctx.stroke();
            ctx.fillStyle = '#5B6B3A';
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(left - 7, top + 8);
            ctx.quadraticCurveTo(left - 4, top - 18, cx, top - 18);
            ctx.quadraticCurveTo(left + bodyW + 4, top - 18, left + bodyW + 7, top + 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#3F4D25';
            [[-10, -8], [6, -11], [14, -2], [-2, 0]].forEach(([dx, dy]) => {
                ctx.beginPath();
                ctx.ellipse(cx + dx, top + dy, 4, 2.5, 0.4, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
            return;
        }
        if (role === 'captain' || role === 'general') {
            // Officer's peaked cap: tall crown, gold band and badge, shiny black visor (army green for the general)
            ctx.fillStyle = role === 'general' ? '#4B5320' : '#1F2A44';
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(left + 1, top + 6);
            ctx.lineTo(left - 6, top - 12);
            ctx.quadraticCurveTo(cx, top - 24, left + bodyW + 6, top - 12);
            ctx.lineTo(left + bodyW - 1, top + 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#FFC107';
            ctx.fillRect(left + 1, top - 1, bodyW - 2, 4);
            ctx.beginPath();
            ctx.arc(cx, top - 9, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.moveTo(left, top + 6);
            ctx.quadraticCurveTo(cx + 8, top + 13, left + bodyW + 8, top + 7);
            ctx.lineTo(left + bodyW - 1, top + 4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            return;
        }

        // Gunmetal-gray jet helmet that wraps down over the ears
        ctx.fillStyle = '#7B8691';
        ctx.strokeStyle = outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left - 5, top + 16);
        ctx.lineTo(left - 5, top + 2);
        ctx.quadraticCurveTo(left - 5, top - 17, cx, top - 17);
        ctx.quadraticCurveTo(left + bodyW + 5, top - 17, left + bodyW + 5, top + 2);
        ctx.lineTo(left + bodyW + 5, top + 16);
        ctx.lineTo(left + bodyW - 1, top + 16);
        ctx.lineTo(left + bodyW - 1, top + 6);
        ctx.lineTo(left + 1, top + 6);
        ctx.lineTo(left + 1, top + 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dark visor raised on the helmet front, with a glint
        ctx.fillStyle = '#212A31';
        ctx.beginPath();
        ctx.moveTo(left + 1, top + 4);
        ctx.quadraticCurveTo(cx, top - 6, left + bodyW - 1, top + 4);
        ctx.lineTo(left + bodyW - 3, top - 4);
        ctx.quadraticCurveTo(cx, top - 13, left + 3, top - 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 4, top - 6); ctx.lineTo(cx + 12, top - 3);
        ctx.stroke();

        // Squadron stripe across the crown
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.moveTo(cx - 14, top - 13);
        ctx.quadraticCurveTo(cx, top - 19, cx + 14, top - 13);
        ctx.lineTo(cx + 13, top - 10);
        ctx.quadraticCurveTo(cx, top - 15, cx - 13, top - 10);
        ctx.closePath();
        ctx.fill();

        // Oxygen mask unclipped, dangling from one side with its hose down to the chest
        const maskX = left + bodyW + 3;
        const maskY = top + 22;
        ctx.strokeStyle = '#2E3A40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left + bodyW + 2, top + 14); ctx.lineTo(maskX, maskY - 5);
        ctx.stroke();
        ctx.fillStyle = '#546E7A';
        ctx.strokeStyle = outline;
        ctx.beginPath();
        ctx.moveTo(maskX - 5, maskY - 5);
        ctx.lineTo(maskX + 5, maskY - 5);
        ctx.lineTo(maskX + 4, maskY + 5);
        ctx.lineTo(maskX, maskY + 8);
        ctx.lineTo(maskX - 4, maskY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#37474F';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(maskX, maskY + 8);
        ctx.quadraticCurveTo(maskX + 2, maskY + 18, left + bodyW - 8, top + 34);
        ctx.stroke();

        ctx.restore();
    }

    // The crew waiting at the World 4 monorail wreck. Kept between frames so each one remembers
    // which way it is facing and when it last fired.
    getMonorailCrew() {
        if (!this.monorailCrew) {
            this.monorailCrew = [
                { x: 190, role: 'soldier', gun: 'rifle', facing: -1 },
                { x: 290, role: 'soldier', gun: 'rifle', facing: 1 },
                { x: 370, role: 'pilot', gun: 'pistol', facing: -1 },
                { x: 545, role: 'captain', gun: 'pistol', facing: 1 },
                { x: 630, role: 'soldier', gun: 'rifle', facing: 1 },
                { x: 710, role: 'pilot', gun: 'pistol', facing: 1 },
                { x: 880, role: 'soldier', gun: 'rifle', facing: 1 }
            ].map((c, i) => ({ ...c, homeFacing: c.facing, lastShot: 0, flashUntil: 0, seed: i }));
        }
        return this.monorailCrew;
    }

    // Tofu's friends at the wreck turn toward any enemy that comes close and open fire.
    // Their shots are normal player bullets, so hits and points work just like Tofu's.
    updateMonorailCrew() {
        if (this.currentWorld !== 4 || this.currentLevel !== 1) return;
        const now = Date.now();
        const range = 300;
        this.getMonorailCrew().forEach(c => {
            const cx = c.x + 23;
            // Only shoot while on (or just off) screen
            if (cx < this.camera.x - 60 || cx > this.camera.x + this.canvas.width + 60) return;
            let target = null;
            let best = range;
            this.enemies.forEach(e => {
                if (e.mountedTower || e.health <= 0) return;
                const ex = e.x + e.width / 2;
                const dist = Math.abs(ex - cx);
                if (dist < best) { best = dist; target = e; }
            });
            if (!target) {
                c.facing = c.homeFacing;
                return;
            }
            c.facing = target.x + target.width / 2 >= cx ? 1 : -1;
            const cooldown = (c.gun === 'rifle' ? 650 : 950) + (c.seed % 3) * 120;
            if (now - c.lastShot < cooldown) return;
            c.lastShot = now;
            c.flashUntil = now + 80;
            const muzzleX = cx + c.facing * (c.gun === 'rifle' ? 50 : 56);
            const muzzleY = c.gun === 'rifle' ? 288 : 282;
            const bullet = new Bullet(muzzleX, muzzleY, c.facing > 0);
            this.bullets.push(bullet);
            this.playPlayerShoot();
        });
    }

    // World 4 Level 1: the wrecked monorail where the train came down, with the whole crew
    // standing guard, guns out, while they wait for a rescue chopper
    renderMonorailCamp() {
        if (this.currentWorld !== 4 || this.currentLevel !== 1) return;
        if (this.camera.x > 1100) return;
        const ctx = this.ctx;
        const t = Date.now() / 1000;
        const wreckX = 240;
        const groundRail = 322;

        // Scorch mark and the crumpled monorail, lying where it landed
        ctx.fillStyle = 'rgba(30, 20, 10, 0.45)';
        ctx.beginPath();
        ctx.ellipse(wreckX + 340, 324, 380, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.translate(wreckX + 400, groundRail);
        ctx.rotate(0.08);
        ctx.translate(-(wreckX + 400), -groundRail);
        this.drawTofuTrain(ctx, wreckX, groundRail, { t, wrecked: true, empty: true });
        ctx.restore();

        // Red signal flare on the ground so the rescue chopper can find them
        const flareX = wreckX + 500;
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(flareX - 3, 312, 6, 10);
        ctx.fillStyle = Math.sin(t * 30) > 0 ? '#FFEB3B' : '#FF5722';
        ctx.beginPath();
        ctx.arc(flareX, 311, 4, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 8; i++) {
            const rise = (t * 0.35 + i / 8) % 1;
            ctx.fillStyle = `rgba(229, 57, 53, ${0.45 * (1 - rise)})`;
            ctx.beginPath();
            ctx.arc(flareX + Math.sin(i * 3 + t) * 8 + rise * 40, 305 - rise * 230, 8 + rise * 26, 0, Math.PI * 2);
            ctx.fill();
        }

        // The crew, guns out, spread around the wreck. One soldier keeps watch to the left.
        const crew = this.getMonorailCrew();
        crew.forEach(c => this.drawArmedCrew(ctx, c.x, 322, c, c.seed, t));

        // The captain fills Tofu in when he walks past
        const captain = crew[3];
        const px = this.player.x + this.player.width / 2;
        if (Math.abs(px - (captain.x + 23)) < 260) {
            const bx = captain.x + 23;
            const by = 196;
            const lines = ["We'll hold here for the", 'rescue chopper. Go get', 'Popcorn, Tofu!'];
            ctx.save();
            ctx.font = 'bold 12px Arial';
            const bw = 168;
            const bh = 52;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#263238';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(bx - bw / 2, by - bh, bw, bh, 8);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx - 6, by);
            ctx.lineTo(bx, by + 10);
            ctx.lineTo(bx + 6, by);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#263238';
            ctx.textAlign = 'center';
            lines.forEach((line, i) => ctx.fillText(line, bx, by - bh + 16 + i * 15));
            ctx.restore();
        }
    }

    // A crew member standing guard, holding a rifle or pistol out to one side. x is the left
    // edge of the tofu body, groundY is where the feet touch.
    drawArmedCrew(ctx, x, groundY, c, seed, t) {
        const dir = c.facing || 1;
        // Shuffle a little and glance around while waiting
        const sway = Math.sin(t * 1.5 + seed * 1.7) * 1.5;
        const left = x + sway;
        this.drawTofuPilot(ctx, left, groundY, { rescued: true, pose: 'armed', role: c.role, t, seed });
        const top = groundY - 76;
        const cx = left + 23;
        const outline = '#2A241C';
        const gunY = top + 42 + Math.sin(t * 2 + seed) * 0.8;
        ctx.save();
        ctx.lineCap = 'round';
        if (c.gun === 'rifle') {
            // Rifle held across the chest, muzzle out past the body. Drawn as one path in local
            // coords pointing right, flipped for crew facing left.
            ctx.save();
            ctx.translate(cx, gunY);
            ctx.scale(dir, 1);
            ctx.fillStyle = '#5D4037';
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-34, -3); ctx.lineTo(-18, -4); ctx.lineTo(-18, 5); ctx.lineTo(-34, 8);
            ctx.closePath();
            ctx.fill(); ctx.stroke();                                   // stock
            ctx.fillStyle = '#546E7A';
            ctx.beginPath();
            ctx.rect(-18, -5, 38, 9);
            ctx.fill(); ctx.stroke();                                   // receiver
            ctx.beginPath();
            ctx.rect(20, -2, 30, 4);
            ctx.fill(); ctx.stroke();                                   // barrel
            ctx.fillStyle = '#37474F';
            ctx.beginPath();
            ctx.rect(2, 4, 8, 12);
            ctx.fill(); ctx.stroke();                                   // magazine
            ctx.beginPath();
            ctx.rect(-6, -9, 12, 4);
            ctx.fill(); ctx.stroke();                                   // scope
            ctx.restore();
            // Both hands on the rifle
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - dir * 21, top + 34); ctx.lineTo(cx - dir * 10, gunY + 4);
            ctx.moveTo(cx + dir * 21, top + 34); ctx.lineTo(cx + dir * 26, gunY + 1);
            ctx.stroke();
            ctx.fillStyle = outline;
            ctx.beginPath();
            ctx.arc(cx - dir * 10, gunY + 4, 4, 0, Math.PI * 2);
            ctx.arc(cx + dir * 26, gunY + 1, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Pistol held out at arm's length, the other arm at the side
            const handX = cx + dir * 38;
            ctx.strokeStyle = outline;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx + dir * 21, top + 34); ctx.lineTo(handX, gunY - 4);
            ctx.moveTo(cx - dir * 21, top + 34); ctx.lineTo(cx - dir * 26, top + 50);
            ctx.stroke();
            ctx.save();
            ctx.translate(handX, gunY - 4);
            ctx.scale(dir, 1);
            ctx.fillStyle = '#546E7A';
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.rect(-3, -8, 20, 7);
            ctx.fill(); ctx.stroke();                                   // slide
            ctx.fillStyle = '#37474F';
            ctx.beginPath();
            ctx.rect(-3, -2, 7, 10);
            ctx.fill(); ctx.stroke();                                   // grip
            ctx.restore();
            ctx.fillStyle = outline;
            ctx.beginPath();
            ctx.arc(handX, gunY - 3, 4, 0, Math.PI * 2);
            ctx.arc(cx - dir * 26, top + 52, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        // Muzzle flash right after a shot
        if (c.flashUntil && Date.now() < c.flashUntil) {
            const fx = cx + dir * (c.gun === 'rifle' ? 52 : 58);
            const fy = c.gun === 'rifle' ? gunY : gunY - 4;
            ctx.fillStyle = '#FFEB3B';
            ctx.beginPath();
            ctx.moveTo(fx, fy - 5);
            ctx.lineTo(fx + dir * 12, fy);
            ctx.lineTo(fx, fy + 5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#FF9800';
            ctx.beginPath();
            ctx.arc(fx, fy, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // Crash site objectives: find the wreck, then beat the guards to free the pilots
    checkHeliWreck() {
        const wreck = this.heliWreck;
        if (!wreck || this.currentWorld !== wreck.world || this.currentLevel !== wreck.level) return;
        if (!wreck.found && this.player.x + this.player.width > wreck.x - 80 && this.player.x < wreck.x + 80) {
            wreck.found = true;
            wreck.foundTime = Date.now();
            this.score += 500;
        }

        // Guards spring into action together once Tofu is close enough to have seen the scene
        const spotted = this.player.x > wreck.guards[0].x - 250;
        wreck.guards.forEach(guard => {
            if (!guard.enemy && spotted) {
                guard.enemy = new Enemy(guard.x, guard.type === 0 ? 200 : 207, guard.type, this.assets);
                guard.enemy.facingLeft = true;
                this.enemies.push(guard.enemy);
            }
        });

        if (!wreck.rescued && wreck.guards.every(guard => guard.enemy && !this.enemies.includes(guard.enemy))) {
            wreck.rescued = true;
            wreck.rescuedTime = Date.now();
            this.score += 250;
        }
    }

    // Objective box under the level info, and banners as each step is completed
    renderHeliObjective() {
        const wreck = this.heliWreck;
        if (!wreck || this.currentWorld !== wreck.world || this.currentLevel !== wreck.level) return;
        const ctx = this.ctx;
        const now = Date.now();
        ctx.save();

        let title = null;
        let detail = null;
        if (!wreck.found) {
            const dist = Math.max(0, Math.round((wreck.x - this.player.x) / 10));
            title = 'Find the helicopter!';
            detail = `Crash site: ${dist}m →`;
        } else if (!wreck.rescued) {
            const guardsLeft = wreck.guards.filter(guard => !guard.enemy || this.enemies.includes(guard.enemy)).length;
            title = 'Rescue the pilots!';
            detail = `Guards left: ${guardsLeft}`;
        }
        if (title) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(this.canvas.width - 200, 95, 190, 40);
            ctx.fillStyle = '#FFD600';
            ctx.font = 'bold 13px Arial';
            ctx.fillText(title, this.canvas.width - 192, 112);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.fillText(detail, this.canvas.width - 192, 128);
        }

        let banner = null;
        if (wreck.rescued && now - wreck.rescuedTime < 3500) banner = 'PILOTS RESCUED! +250';
        else if (wreck.found && now - wreck.foundTime < 3500) banner = 'HELICOPTER FOUND! +500';
        if (banner) {
            ctx.textAlign = 'center';
            ctx.font = 'bold 32px Arial';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 5;
            ctx.fillStyle = '#FFD600';
            ctx.strokeText(banner, this.canvas.width / 2, 150);
            ctx.fillText(banner, this.canvas.width / 2, 150);
        }
        ctx.restore();
    }

    // Move artillery shells; on hitting the ground (or the player) they blow up and
    // hurt the player if they're inside the blast
    updateArtilleryShells() {
        const groundY = 320;
        for (let i = this.artilleryShells.length - 1; i >= 0; i--) {
            const shell = this.artilleryShells[i];
            shell.update();
            const hitPlayer = this.checkCollision(shell, this.player);
            if (!hitPlayer && shell.y < groundY - 4) continue;

            const blastX = shell.x;
            const playerCenter = this.player.x + this.player.width / 2;
            const playerNearGround = this.player.y + this.player.height > groundY - 50;
            if (hitPlayer || (Math.abs(playerCenter - blastX) < shell.blastRadius && playerNearGround)) {
                this.player.takeDamage(shell.damage);
            }
            this.explosions.push(new Explosion(blastX, Math.min(shell.y, groundY - 10)));
            this.playMineExplosion();
            this.artilleryShells.splice(i, 1);
        }
    }

    triggerBossCutscene(bossType = 4) {
        // Which boss is coming decides what Popcorn says
        this.bossCutsceneBossType = bossType;
        
        // ONLY stop gameplay and boss music
        this.stopGameplayMusic();
        this.stopBossMusic();
        this.stopPopcornMusic(); // so the cutscene always starts Popcorn's track fresh, exactly once
        
        // Set gameState FIRST so echo effects activate
        this.gameState = 'bossCutscene';
        
        // DON'T start music here - let render loop handle it like story mode
        this.storyMusicPlaying = false; // Force render loop to start music
        this.currentStoryMusicType = 'villain';
        this.bossCutsceneTime = 0;
        this.bossCutsceneActive = true;
        
        // Pause player movement during cutscene
        this.player.velocityX = 0;
        this.player.isMoving = false;
    }
    
    renderBossCutscene() {
        const t = this.bossCutsceneTime;
        
        // Continue rendering the game world as background
        this.renderBackground();
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.renderGround();
        this.renderForceFields();
        this.player.render(this.ctx);
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.powerups.forEach(powerup => powerup.render(this.ctx));
        this.sandbags.forEach(sandbag => sandbag.render(this.ctx));
        this.platforms.forEach(platform => platform.render(this.ctx));
        this.barbedWire.forEach(wire => wire.render(this.ctx));
        this.woodenCrates.forEach(crate => crate.render(this.ctx));
        this.warehouseCrates.forEach(crate => crate.render(this.ctx));
        this.destructibleCrates.forEach(crate => crate.render(this.ctx));
        this.mines.forEach(mine => mine.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.tankRemnants.forEach(remnant => remnant.render(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.ctx.restore();
        
        // Render UI (hearts and score) - not affected by camera
        this.renderUI();
        this.renderScore();
        this.renderLevelProgress();
        this.renderHeliObjective();
        this.renderBossHealthUI();
        this.renderTouchControls();
        
        // Giant Popcorn entrance from right side
        this.renderGiantPopcorn(t);
        
        // Cutscene dialogue
        this.renderBossDialogue(t);
        
        // Auto-advance cutscene
        this.bossCutsceneTime++;
        
        // End cutscene after dialogue is complete
        if (t > 780) { // 13 seconds at 60fps - after all dialogue finishes
            this.endBossCutscene();
        }
    }
    
    renderGiantPopcorn(t) {
        if (!this.assets.popcornSprite) return;
        
        // YUUUGE popcorn - half the screen size
        const screenHeight = this.canvas.height;
        const popcornSize = screenHeight * 0.5; // Half screen height
        
        // Slide in from right side
        const slideProgress = Math.min(1, t / 60); // Slide in over 1 second
        const startX = this.canvas.width + popcornSize;
        const endX = this.canvas.width - popcornSize * 0.6; // Position on right side
        const currentX = startX - (slideProgress * (startX - endX));
        
        // Pan out after dialogue (after t > 720)
        let panOutProgress = 0;
        if (t > 720) {
            panOutProgress = Math.min(1, (t - 720) / 60); // Pan out over 1 second
        }
        const panX = currentX + (panOutProgress * (this.canvas.width + popcornSize));
        
        const centerY = this.canvas.height / 2;
        
        // Menacing floating animation
        const floatY = Math.sin(t * 0.05) * 20;
        const evilPulse = Math.sin(t * 0.15) * 0.3 + 0.7;
        
        this.ctx.save();
        this.ctx.translate(panX, centerY + floatY);
        
        // Evil aura effects
        this.ctx.shadowColor = '#8B008B';
        this.ctx.shadowBlur = 60 * evilPulse;
        this.ctx.globalAlpha = 0.95;
        
        // Draw massive Popcorn sprite
        this.ctx.drawImage(
            this.assets.popcornSprite,
            -popcornSize / 2,
            -popcornSize / 2,
            popcornSize,
            popcornSize
        );
        
        this.ctx.restore();
        
        // Additional menacing effects
        if (slideProgress > 0.8) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            
            // Dark energy swirls around the giant popcorn
            for (let i = 0; i < 12; i++) {
                const angle = (t * 0.02 + i * Math.PI / 6);
                const radius = popcornSize * 0.4 + Math.sin(t * 0.03 + i) * 30;
                const x = panX + Math.cos(angle) * radius;
                const y = centerY + floatY + Math.sin(angle) * radius;
                
                this.ctx.fillStyle = `hsl(${280 + Math.sin(t * 0.01 + i) * 20}, 70%, 30%)`;
                this.ctx.shadowColor = '#8B008B';
                this.ctx.shadowBlur = 25;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 15 + Math.sin(t * 0.05 + i) * 8, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }
    
    renderBossDialogue(t) {
        // Only show dialogue after Popcorn has mostly slid in
        if (t < 45) return;
        
        const dialogueTime = t - 45;
        
        // Dialogue text with typewriter effect
        let dialogue = "";
        let speaker = "";
        
        // Two lines per boss, 6 seconds each. The World 2 mech gets its own speech.
        const speeches = {
            5: [
                "So, you survived my\nunderground fortress...\nImpressive, little tofu.\nBut down here, YOU LOSE!",
                "Meet my MECH! Built in\nthe deepest bunker to\nstomp soybeans like you\ninto TOFU PASTE! ATTACK!"
            ],
            12: [
                "You found my secret\nNUCLEAR BASE? Too bad!\nMeet the REACTOR TITAN,\npowered by pure uranium!",
                "Jump all you like, tofu!\nIts core beam will fry\nyou into a crispy bean!\nTITAN, MELT HIM!"
            ],
            9: [
                "So you climbed all the way\nto the summit, little tofu?\nThen meet my CYBORG YETI!\nHalf beast, half machine!",
                "FIRE THE SHOULDER ROCKETS!\nFreeze that soybean solid\nand smash it to bits!\nGET HIM, YETI! RAAAWR!"
            ],
            default: [
                "BEHOLD MY ULTIMATE CREATION!\nThis massive war machine will\ncrush you like the pathetic\ntofu you are! MWAHAHAHA!",
                "You think your little\npea-shooter can stop\nTHIS monstrosity?\nPrepare for DOOM!"
            ]
        };
        const speech = speeches[this.bossCutsceneBossType] || speeches.default;
        
        let currentDialogueTime = 0;
        if (dialogueTime < 360) {
            dialogue = speech[0];
            speaker = "POPCORN";
            currentDialogueTime = dialogueTime;
        } else if (dialogueTime < 720) {
            dialogue = speech[1];
            speaker = "POPCORN";
            currentDialogueTime = dialogueTime - 360; // Reset for second dialogue
        }
        
        if (dialogue === "") return;
        
        // Typewriter effect - slower for readability
        const charsPerSecond = 24; // Double speed
        const maxChars = Math.floor(currentDialogueTime * charsPerSecond / 60);
        const visibleText = dialogue.substring(0, maxChars);
        
        // Dialogue box background
        const boxWidth = 400;
        const boxHeight = 120;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = this.canvas.height - boxHeight - 40;
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(75, 0, 130, 0.9)'; // Evil purple background
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Speaker name
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(speaker + ":", boxX + 15, boxY + 25);
        
        // Dialogue text with evil effects
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.shadowColor = '#8B008B';
        this.ctx.shadowBlur = 8;
        
        const lines = visibleText.split('\n');
        lines.forEach((line, index) => {
            const textY = boxY + 50 + (index * 18);
            // Evil text shake effect
            const shakeX = Math.sin(t * 0.3 + index) * 2;
            const shakeY = Math.cos(t * 0.25 + index) * 1;
            this.ctx.fillText(line, boxX + 15 + shakeX, textY + shakeY);
        });
        
        this.ctx.restore();
    }
    
    endBossCutscene() {
        // Stop any cutscene music that might be playing
        this.stopStoryMusic();
        this.stopPopcornMusic();
        
        this.gameState = 'playing';
        this.bossCutsceneActive = false;
        
        // Now spawn the actual boss
        const bossData = this.currentLevelData.enemies.find(e => isBossType(e.type));
        if (bossData && this.levelSpawnIndex < this.currentLevelData.enemies.length) {
            const boss = new Enemy(bossData.x, bossData.y, bossData.type, this.assets);
            this.enemies.push(boss);
            this.levelSpawnIndex++;
        }
        
        // Start boss music
        if (!this.bossMusicPlaying) {
            this.startBossMusic();
        }
    }
    
    renderActionLines(t) {
        // Anime-style action lines for dramatic effect
        this.ctx.save();
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.globalAlpha = 0.6;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + (t * 50) % 200;
            const lineLength = 30 + Math.sin(t * 4 + i) * 15;
            
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            const endX = startX + Math.cos(angle) * lineLength;
            const endY = startY + Math.sin(angle) * lineLength;
            
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    renderStoryProgress() {
        // Anime-style progress indicator with dramatic styling
        this.ctx.save();
        
        const centerX = this.canvas.width / 2;
        const y = this.canvas.height - 20;
        const dotSpacing = 25;
        const startX = centerX - (this.storySlides.length - 1) * dotSpacing / 2;
        
        for (let i = 0; i < this.storySlides.length; i++) {
            const x = startX + i * dotSpacing;
            const isActive = i === this.currentStorySlide;
            const pulse = isActive ? (1 + Math.sin(this.storyTime * 5) * 0.3) : 1;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.scale(pulse, pulse);
            
            if (isActive) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            }
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
    
    renderVictoryScreen() {
        // Draw background
        this.renderBackground();
        this.renderGround();
        
        // Victory overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.textAlign = 'center';
        
        // Victory text
        this.ctx.save();
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 4;
        this.ctx.font = 'bold 56px Arial';
        this.ctx.strokeText('VICTORY!', this.canvas.width / 2, 120);
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, 120);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('All enemies defeated!', this.canvas.width / 2, 160);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 220);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Press R to Restart  -  Press ESC for Title Screen', this.canvas.width / 2, 280);
        
        this.ctx.restore();
        this.ctx.textAlign = 'left';
    }
    
    renderLevelCompleteScreen() {
        // Draw background
        this.renderBackground();
        this.renderGround();
        
        // Level complete overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.textAlign = 'center';
        
        // Level complete text
        this.ctx.save();
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        
        this.ctx.fillStyle = '#00FF00';
        this.ctx.strokeStyle = '#008000';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.strokeText('LEVEL COMPLETE!', this.canvas.width / 2, 120);
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, 120);
        
        // Show completed level info
        const completedLevel = this.currentLevel;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`World ${this.currentWorld} - Level ${completedLevel} Complete`, this.canvas.width / 2, 160);
        
        // Show next level info or final victory
        let nextLevelExists = false;
        let nextLevelText = '';

        if (this.levelData[this.currentWorld][this.nextLevel]) {
            nextLevelExists = true;
            nextLevelText = `Next: ${this.levelData[this.currentWorld][this.nextLevel].name}`;
        } else if (this.levelData[this.currentWorld + 1]) {
            nextLevelExists = true;
            nextLevelText = `World ${this.currentWorld + 1} - ${this.levelData[this.currentWorld + 1][1].name}`;
        }

        if (nextLevelExists) {
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(nextLevelText, this.canvas.width / 2, 200);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Press SPACE or ENTER to Continue  -  Press ESC for Title', this.canvas.width / 2, 280);
        } else {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.fillText('ALL LEVELS COMPLETE!', this.canvas.width / 2, 200);
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Press SPACE or ENTER for Victory Screen  -  Press ESC for Title', this.canvas.width / 2, 280);
        }
        
        // Current score
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 22px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 240);
        
        this.ctx.restore();
        this.ctx.textAlign = 'left';
    }
    
    proceedToNextLevel() {
        // Check if there's a next level in the current world
        if (this.levelData[this.currentWorld][this.nextLevel]) {
            // Go to next level in current world
            this.startLevel(this.nextLevel);
            this.gameState = 'playing';
        } else if (this.levelData[this.currentWorld + 1]) {
            // Move to next world, level 1
            this.currentWorld++;
            this.currentLevel = 1;
            this.startLevel(1);
            this.gameState = 'playing';
            // Heading underground: Tofu ropes down into the secret bunker first
            if (this.currentWorld === 2) {
                this.startBunkerIntro();
            } else if (this.currentWorld === 4) {
                // Leaving the city: the train escape that ends in the mountains
                this.startTrainIntro();
            } else if (this.currentWorld === 5) {
                // Off the mountain: Chinook pickup, base camp briefing, then the jeep to the nuclear base
                this.startCampIntro();
            }
        } else {
            // All worlds and levels complete - check for high score first
            this.stopGameplayMusic();
            this.stopBossMusic();

            const highScorePosition = this.checkHighScore(this.score);
            if (highScorePosition !== -1) {
                this.enteringInitials = true;
                this.newHighScoreIndex = highScorePosition;
                this.currentInitials = '';
                this.wonGame = true; // Flag to show victory message
                this.gameState = 'gameOver'; // Use gameOver state to handle initials entry
            } else {
                this.gameState = 'victory';
            }
        }
    }
    
    renderLevelProgress() {
        if (!this.currentLevelData) return;
        
        // Level info in top right
        this.ctx.save();
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width - 200, 10, 190, 80);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`World ${this.currentWorld} - Level ${this.currentLevel}`, this.canvas.width - 190, 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillText(this.currentLevelData.name, this.canvas.width - 190, 50);
        
        // Progress bar based on distance
        const levelWidth = this.currentLevelData.endX - this.currentLevelData.startX;
        const playerProgress = Math.max(0, this.player.x - this.currentLevelData.startX);
        const progress = Math.min(playerProgress / levelWidth, 1);
        
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(this.canvas.width - 190, 60, 150, 8);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(this.canvas.width - 190, 60, 150 * progress, 8);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, this.canvas.width - 190, 85);
        
        this.ctx.restore();
    }
    
    initializeLevelBuilder() {
        this.levelBuilder = {
            active: true,
            selectedEnemyType: 0,
            currentLevelNumber: 1,
            enemyTypes: ['Soldier 1', 'Soldier 2', 'Tank'],
            cameraX: 0,
            mapWidth: 12000,
            mapHeight: 400,
            gridSize: 50,
            showGrid: true,
            editingLevel: {
                name: 'Custom Level 1',
                startX: 0,
                endX: 6000,
                enemies: [
                    // Start with a few example enemies
                    { type: 0, x: 800, y: 280 },
                    { type: 1, x: 1200, y: 280 },
                    { type: 2, x: 1800, y: 280 }
                ]
            }
        };
    }
    
    renderLevelBuilder() {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render map view
        this.renderMapView();
        
        // Render UI overlay
        this.renderBuilderUI();
    }
    
    renderMapView() {
        this.ctx.save();
        
        // Draw map background (sky and ground like in game)
        this.renderBackground();
        this.renderGround();
        
        // Apply camera translation
        this.ctx.translate(-this.levelBuilder.cameraX, 0);
        
        // Draw grid if enabled
        if (this.levelBuilder.showGrid) {
            this.renderGrid();
        }
        
        // Draw level boundaries
        this.renderLevelBoundaries();
        
        // Draw placed enemies
        this.renderPlacedEnemies();
        
        this.ctx.restore();
    }
    
    renderGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        const gridSize = this.levelBuilder.gridSize;
        const startX = Math.floor(this.levelBuilder.cameraX / gridSize) * gridSize;
        const endX = startX + this.canvas.width + gridSize;
        
        // Vertical grid lines
        for (let x = startX; x <= endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.levelBuilder.cameraX, y);
            this.ctx.lineTo(this.levelBuilder.cameraX + this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    renderLevelBoundaries() {
        const level = this.levelBuilder.editingLevel;
        
        // No-enemy zone (shaded red area)
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        this.ctx.fillRect(level.startX, 0, 100, this.canvas.height);
        
        // Start boundary
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(level.startX, 0);
        this.ctx.lineTo(level.startX, this.canvas.height);
        this.ctx.stroke();
        
        // Enemy placement boundary (100px buffer)
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(level.startX + 100, 0);
        this.ctx.lineTo(level.startX + 100, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // End boundary
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(level.endX, 0);
        this.ctx.lineTo(level.endX, this.canvas.height);
        this.ctx.stroke();
        
        // Boundary labels
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('START', level.startX + 5, 30);
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillText('ENEMIES', level.startX + 105, 30);
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillText('END', level.endX + 5, 30);
    }
    
    renderPlacedEnemies() {
        this.levelBuilder.editingLevel.enemies.forEach((enemy, index) => {
            // Draw enemy representation
            this.ctx.fillStyle = enemy.type === 2 ? '#8B4513' : '#4CAF50';
            const width = enemy.type === 2 ? 60 : 40;
            const height = enemy.type === 2 ? 45 : 35;
            
            this.ctx.fillRect(enemy.x - width/2, enemy.y - height/2, width, height);
            
            // Draw enemy border
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(enemy.x - width/2, enemy.y - height/2, width, height);
            
            // Draw enemy type indicator
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${enemy.type}`, enemy.x, enemy.y + 4);
            
            // Debug: draw coordinates
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`(${enemy.x},${enemy.y})`, enemy.x, enemy.y - height/2 - 5);
        });
        
        // Debug: show camera position
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Camera: ${this.levelBuilder.cameraX}`, this.levelBuilder.cameraX + 10, 50);
        this.ctx.fillText(`Enemies: ${this.levelBuilder.editingLevel.enemies.length}`, this.levelBuilder.cameraX + 10, 70);
    }
    
    renderBuilderUI() {
        // Semi-transparent overlay for UI
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, 60);
        
        // Title
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL BUILDER', this.canvas.width / 2, 25);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${this.levelBuilder.editingLevel.name} | Enemies: ${this.levelBuilder.editingLevel.enemies.length}`, this.canvas.width / 2, 45);
        
        // Enemy type selector (top right)
        this.renderEnemySelector();
        
        // Instructions (bottom)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('1-3: Select Enemy | Click Map to Place | Arrow Keys: Move Camera | G: Toggle Grid | ENTER: Test | S: Save | ESC: Return', this.canvas.width / 2, this.canvas.height - 20);
        
        this.ctx.textAlign = 'left';
    }
    
    renderEnemySelector() {
        const startX = this.canvas.width - 200;
        const startY = 70;
        const spacing = 60;
        
        for (let i = 0; i < this.levelBuilder.enemyTypes.length; i++) {
            const x = startX + (i * spacing);
            const y = startY;
            
            // Selection box
            if (i === this.levelBuilder.selectedEnemyType) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
            } else {
                this.ctx.strokeStyle = '#666666';
                this.ctx.lineWidth = 1;
            }
            this.ctx.strokeRect(x, y, 50, 40);
            
            // Enemy preview
            this.ctx.fillStyle = i === 2 ? '#8B4513' : '#4CAF50';
            this.ctx.fillRect(x + 5, y + 5, i === 2 ? 40 : 25, i === 2 ? 30 : 20);
            
            // Type number
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${i + 1}`, x + 25, y - 5);
        }
    }
    
    
    handleLevelBuilderClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        
        // Check if click is on enemy selector
        const selectorStartX = this.canvas.width - 200;
        const selectorY = 70;
        const spacing = 60;
        
        if (canvasY >= selectorY && canvasY <= selectorY + 40) {
            for (let i = 0; i < 3; i++) {
                const x = selectorStartX + (i * spacing);
                if (canvasX >= x && canvasX <= x + 50) {
                    this.levelBuilder.selectedEnemyType = i;
                    return;
                }
            }
        }
        
        // Check if click is in map area (below UI, above bottom bar)
        if (canvasY > 60 && canvasY < this.canvas.height - 40) {
            // Convert screen coordinates to world coordinates
            const worldX = canvasX + this.levelBuilder.cameraX;
            const worldY = canvasY;
            
            // Snap to grid if enabled
            let snapX = worldX;
            let snapY = worldY;
            
            if (this.levelBuilder.showGrid) {
                snapX = Math.round(worldX / this.levelBuilder.gridSize) * this.levelBuilder.gridSize;
                snapY = Math.round(worldY / this.levelBuilder.gridSize) * this.levelBuilder.gridSize;
            }
            
            // Check if clicking on existing enemy
            const clickedEnemyIndex = this.findEnemyAtPosition(snapX, snapY);
            if (clickedEnemyIndex >= 0) {
                // Remove existing enemy
                this.levelBuilder.editingLevel.enemies.splice(clickedEnemyIndex, 1);
            } else {
                // Only allow placing enemies to the right of the start position
                if (snapX > this.levelBuilder.editingLevel.startX + 100) { // 100px buffer from start
                    this.levelBuilder.editingLevel.enemies.push({
                        type: this.levelBuilder.selectedEnemyType,
                        x: snapX,
                        y: snapY
                    });
                } else {
                    this.showMessage('Place enemies ahead of the start line!');
                }
            }
        }
    }
    
    findEnemyAtPosition(x, y) {
        const threshold = 30; // Click tolerance
        
        for (let i = 0; i < this.levelBuilder.editingLevel.enemies.length; i++) {
            const enemy = this.levelBuilder.editingLevel.enemies[i];
            const dx = Math.abs(enemy.x - x);
            const dy = Math.abs(enemy.y - y);
            
            if (dx < threshold && dy < threshold) {
                return i;
            }
        }
        
        return -1;
    }
    
    handleLevelBuilderTouch(e) {
        // Convert touch to click event
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0] || e;
        const mockClick = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        this.handleLevelBuilderClick(mockClick);
    }
    
    
    saveCustomLevel() {
        const customLevel = {
            name: this.levelBuilder.editingLevel.name,
            startX: this.levelBuilder.editingLevel.startX,
            endX: this.levelBuilder.editingLevel.endX,
            enemies: [...this.levelBuilder.editingLevel.enemies] // Copy array
        };
        
        try {
            localStorage.setItem('customLevel', JSON.stringify(customLevel));
            // Show confirmation message briefly
            this.showMessage('Level saved!');
        } catch (e) {
            this.showMessage('Save failed!');
        }
    }
    
    testCustomLevel() {
        if (this.levelBuilder.editingLevel.enemies.length === 0) {
            this.showMessage('Add some enemies first!');
            return;
        }
        
        // Convert level builder format to game format
        const customLevelData = {
            name: this.levelBuilder.editingLevel.name,
            startX: this.levelBuilder.editingLevel.startX,
            endX: this.levelBuilder.editingLevel.endX,
            enemies: [...this.levelBuilder.editingLevel.enemies] // Copy array
        };
        
        // Add custom level to level data temporarily
        this.levelData['custom'] = customLevelData;
        
        // Start the custom level
        this.gameState = 'playing';
        this.score = 0;
        this.player.reset();
        this.enemies = [];
        this.bullets = [];
        this.powerups = [];
        this.mines = [];
        this.explosions = [];
        this.tankRemnants = [];
        this.sandbags = [];
        this.platforms = [];
        this.barbedWire = [];
        this.woodenCrates = [];
        this.warehouseCrates = [];
        this.destructibleCrates = [];
        this.bunkers = [];
        this.artilleryShells = [];
        this.lastEnemySpawn = 0;
        this.camera = { x: 0, y: 0 };
        
        // Start custom level
        this.startLevel('custom');
    }
    
    showMessage(text) {
        // Simple message display (could be enhanced with a proper notification system)
        console.log(text); // For now, just log it
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
        if (this.currentWorld === 5) {
            this.renderNuclearBackground();
            return;
        }
        if (this.currentWorld === 3) {
            this.renderConstructionBackground();
            return;
        }
        if (this.currentWorld === 4) {
            this.renderMountainBackground();
            return;
        }
        if (this.currentWorld === 2) {
            // Underground bunker background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#1a1a1a'); // Very dark gray ceiling
            gradient.addColorStop(0.3, '#2d2d2d'); // Dark gray
            gradient.addColorStop(0.7, '#3a3a3a'); // Medium dark gray
            gradient.addColorStop(1, '#4a4a4a'); // Slightly lighter for floor area

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Bunker ceiling with concrete texture
            this.ctx.fillStyle = '#2a2a2a';
            this.ctx.fillRect(0, 0, this.canvas.width, 60);

            // Ceiling support beams
            this.ctx.fillStyle = '#404040';
            for (let x = -100; x < this.canvas.width + 200; x += 120) {
                this.ctx.fillRect(x - this.camera.x * 0.1, 0, 8, 60);
            }

            // Distant bunker walls with subtle lighting
            this.ctx.fillStyle = '#333333';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height * 0.15);
            for (let x = 0; x <= this.canvas.width; x += 80) {
                const wallDepth = Math.sin((x + this.camera.x * 0.05) * 0.008) * 10 + this.canvas.height * 0.2;
                this.ctx.lineTo(x, wallDepth);
            }
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(0, this.canvas.height);
            this.ctx.fill();

            // Emergency lighting strips
            this.ctx.fillStyle = '#ff4444';
            this.ctx.globalAlpha = 0.6;
            for (let x = 50; x < this.canvas.width + 100; x += 200) {
                this.ctx.fillRect(x - this.camera.x * 0.1, 45, 30, 4);
            }
            this.ctx.globalAlpha = 1.0;

        } else {
            // Original World 1 - Sky gradient - light blue to horizon
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
    }
    
    // Stable pseudo-random value in [0, 1) for procedural scenery
    sceneryRand(i, seed) {
        const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
        return v - Math.floor(v);
    }

    // World 3 - a city under construction at dusk: half-built skyline, tower cranes
    // and steel frames, each layer scrolling at its own parallax speed
    renderConstructionBackground() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const t = Date.now() / 1000;

        // Hazy dusk sky
        const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8);
        sky.addColorStop(0, '#4A6585');
        sky.addColorStop(0.55, '#E9A26A');
        sky.addColorStop(1, '#F6D9A9');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Low sun
        const sunX = 620 - (this.camera.x * 0.02) % 200;
        const sun = ctx.createRadialGradient(sunX, 230, 10, sunX, 230, 90);
        sun.addColorStop(0, 'rgba(255, 236, 179, 0.95)');
        sun.addColorStop(0.3, 'rgba(255, 204, 128, 0.6)');
        sun.addColorStop(1, 'rgba(255, 204, 128, 0)');
        ctx.fillStyle = sun;
        ctx.fillRect(sunX - 90, 140, 180, 180);

        // Far skyline - finished towers with lit windows, unfinished ones with bare frames on top
        const farSpacing = 70;
        const farOff = this.camera.x * 0.05;
        const farStart = Math.floor(farOff / farSpacing) - 1;
        for (let i = farStart; i < farStart + W / farSpacing + 3; i++) {
            const bx = i * farSpacing - farOff;
            const bw = 45 + this.sceneryRand(i, 1) * 30;
            const bh = 70 + this.sceneryRand(i, 2) * 120;
            const top = 300 - bh;
            ctx.fillStyle = '#5B6478';
            ctx.fillRect(bx, top, bw, bh);
            if (this.sceneryRand(i, 3) > 0.45) {
                // Lit windows
                ctx.fillStyle = 'rgba(255, 224, 130, 0.55)';
                for (let wy = top + 8; wy < 290; wy += 12) {
                    for (let wx = bx + 5; wx < bx + bw - 6; wx += 10) {
                        if (this.sceneryRand(wx * 0.37 + wy, 4) > 0.55) ctx.fillRect(wx, wy, 4, 5);
                    }
                }
            } else {
                // Unfinished top floors - just the steel frame
                ctx.strokeStyle = '#5B6478';
                ctx.lineWidth = 2;
                const frameH = 36;
                for (let fx = bx; fx <= bx + bw; fx += bw / 3) {
                    ctx.beginPath();
                    ctx.moveTo(fx, top);
                    ctx.lineTo(fx, top - frameH);
                    ctx.stroke();
                }
                for (let fy = top - 12; fy >= top - frameH; fy -= 12) {
                    ctx.beginPath();
                    ctx.moveTo(bx, fy);
                    ctx.lineTo(bx + bw, fy);
                    ctx.stroke();
                }
            }
        }

        // Tower cranes
        const craneSpacing = 520;
        const craneOff = this.camera.x * 0.15;
        const craneStart = Math.floor(craneOff / craneSpacing) - 1;
        for (let i = craneStart; i < craneStart + W / craneSpacing + 3; i++) {
            const cx = i * craneSpacing - craneOff + this.sceneryRand(i, 5) * 120;
            const mastTop = 40 + this.sceneryRand(i, 6) * 40;
            this.drawTowerCrane(ctx, cx, mastTop, 300, i, t);
        }

        // Near steel skeletons of buildings going up
        const frameSpacing = 380;
        const frameOff = this.camera.x * 0.35;
        const frameStart = Math.floor(frameOff / frameSpacing) - 1;
        for (let i = frameStart; i < frameStart + W / frameSpacing + 3; i++) {
            const fx = i * frameSpacing - frameOff + this.sceneryRand(i, 7) * 80;
            const floors = 3 + Math.floor(this.sceneryRand(i, 8) * 4);
            const bays = 3 + Math.floor(this.sceneryRand(i, 9) * 2);
            const bayW = 34;
            const floorH = 30;
            const baseY = 322;
            ctx.strokeStyle = '#7A3E26';
            ctx.lineWidth = 4;
            for (let b = 0; b <= bays; b++) {
                // Columns stop at different heights - still being built
                const colFloors = b === bays ? floors - 1 : floors;
                ctx.beginPath();
                ctx.moveTo(fx + b * bayW, baseY);
                ctx.lineTo(fx + b * bayW, baseY - colFloors * floorH);
                ctx.stroke();
            }
            ctx.lineWidth = 3;
            for (let f = 1; f <= floors; f++) {
                const span = f === floors ? bays - 1 : bays;
                ctx.beginPath();
                ctx.moveTo(fx, baseY - f * floorH);
                ctx.lineTo(fx + span * bayW, baseY - f * floorH);
                ctx.stroke();
            }
            // Concrete poured on the lower floors
            ctx.fillStyle = 'rgba(150, 140, 130, 0.85)';
            for (let f = 1; f < Math.min(3, floors); f++) {
                ctx.fillRect(fx - 2, baseY - f * floorH - 3, bays * bayW + 4, 6);
            }
            // Green safety netting on one bay
            ctx.fillStyle = 'rgba(56, 142, 60, 0.35)';
            const netBay = Math.floor(this.sceneryRand(i, 10) * bays);
            ctx.fillRect(fx + netBay * bayW + 2, baseY - floors * floorH + 2, bayW - 4, (floors - 1) * floorH);
        }
    }

    // World 4 - The Mountain Range: icy sky, layers of snow-capped peaks and pine forests,
    // each scrolling at its own parallax speed
    renderMountainBackground() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8);
        sky.addColorStop(0, '#3F6EA8');
        sky.addColorStop(0.6, '#9CC3E6');
        sky.addColorStop(1, '#DCEBF7');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Three ranges of peaks: far and pale, then nearer and darker
        const ranges = [
            { parallax: 0.04, spacing: 220, base: 270, minH: 150, maxH: 220, color: '#A9BCD3', snow: 0.38, seed: 21 },
            { parallax: 0.1, spacing: 170, base: 285, minH: 110, maxH: 170, color: '#7D91AA', snow: 0.3, seed: 22 },
            { parallax: 0.2, spacing: 130, base: 300, minH: 70, maxH: 120, color: '#566A80', snow: 0.22, seed: 23 }
        ];
        ranges.forEach(range => {
            const off = this.camera.x * range.parallax;
            const start = Math.floor(off / range.spacing) - 1;
            for (let i = start; i < start + W / range.spacing + 3; i++) {
                const px = i * range.spacing - off + this.sceneryRand(i, range.seed) * 40;
                const peakH = range.minH + this.sceneryRand(i, range.seed + 1) * (range.maxH - range.minH);
                const halfW = range.spacing * 0.85;
                const top = range.base - peakH;
                ctx.fillStyle = range.color;
                ctx.beginPath();
                ctx.moveTo(px - halfW, range.base);
                ctx.lineTo(px, top);
                ctx.lineTo(px + halfW, range.base);
                ctx.closePath();
                ctx.fill();
                // Snowcap with a ragged lower edge
                const snowH = peakH * range.snow;
                const k = snowH / peakH;
                ctx.fillStyle = '#F4F8FC';
                ctx.beginPath();
                ctx.moveTo(px, top);
                ctx.lineTo(px + halfW * k, top + snowH);
                ctx.lineTo(px + halfW * k * 0.4, top + snowH * 0.8);
                ctx.lineTo(px, top + snowH);
                ctx.lineTo(px - halfW * k * 0.4, top + snowH * 0.75);
                ctx.lineTo(px - halfW * k, top + snowH);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = range.color;
            ctx.fillRect(0, range.base - 1, W, H - range.base + 1);
        });

        // Valley mist
        const mist = ctx.createLinearGradient(0, 240, 0, 320);
        mist.addColorStop(0, 'rgba(230, 240, 250, 0)');
        mist.addColorStop(1, 'rgba(230, 240, 250, 0.55)');
        ctx.fillStyle = mist;
        ctx.fillRect(0, 240, W, 80);

        // Near pine forest
        const treeSpacing = 46;
        const treeOff = this.camera.x * 0.4;
        const treeStart = Math.floor(treeOff / treeSpacing) - 1;
        for (let i = treeStart; i < treeStart + W / treeSpacing + 3; i++) {
            const tx = i * treeSpacing - treeOff + this.sceneryRand(i, 24) * 20;
            const th = 40 + this.sceneryRand(i, 25) * 35;
            const baseY = 322;
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(tx - 2, baseY - 8, 4, 8);
            ctx.fillStyle = this.sceneryRand(i, 26) > 0.5 ? '#2E5D3A' : '#24503A';
            for (let tier = 0; tier < 3; tier++) {
                const ty = baseY - 6 - tier * th * 0.28;
                const tw = (th * 0.36) * (1 - tier * 0.25);
                ctx.beginPath();
                ctx.moveTo(tx - tw, ty);
                ctx.lineTo(tx, ty - th * 0.45);
                ctx.lineTo(tx + tw, ty);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = 'rgba(245, 248, 252, 0.85)';
            ctx.beginPath();
            ctx.moveTo(tx - 5, baseY - 6 - th * 0.56 - 6);
            ctx.lineTo(tx, baseY - 6 - th * 0.56 - th * 0.45 + 2);
            ctx.lineTo(tx + 5, baseY - 6 - th * 0.56 - 6);
            ctx.closePath();
            ctx.fill();
        }
    }

    // World 4 ground - rocky earth with a grassy, snow-patched top and loose stones
    renderMountainGround(groundY) {
        const ctx = this.ctx;
        const left = this.camera.x - 100;
        const right = this.camera.x + this.canvas.width + 100;

        ctx.fillStyle = '#6B5A48';
        ctx.fillRect(left, groundY, right - left, this.canvas.height - groundY);

        // Rock strata
        ctx.fillStyle = 'rgba(40, 32, 24, 0.25)';
        ctx.fillRect(left, groundY + 34, right - left, 4);
        ctx.fillRect(left, groundY + 58, right - left, 3);

        // Stones
        const stoneStart = Math.floor(left / 26) * 26;
        for (let x = stoneStart; x < right; x += 26) {
            const r = this.sceneryRand(x, 27);
            ctx.fillStyle = r > 0.5 ? '#8A8178' : '#574A3D';
            ctx.beginPath();
            ctx.ellipse(x + r * 14, groundY + 18 + r * 40, 3 + r * 4, 2 + r * 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Grass edge with patches of snow
        ctx.fillStyle = '#4F7A35';
        ctx.fillRect(left, groundY, right - left, 7);
        const snowStart = Math.floor(left / 90) * 90;
        for (let x = snowStart; x < right; x += 90) {
            if (this.sceneryRand(x, 28) > 0.45) {
                const sw = 30 + this.sceneryRand(x, 29) * 40;
                ctx.fillStyle = '#F4F8FC';
                ctx.beginPath();
                ctx.ellipse(x + 20 + sw / 2, groundY + 2, sw / 2, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawTowerCrane(ctx, x, top, baseY, seed, t) {
        ctx.save();
        ctx.strokeStyle = '#D4A017';
        ctx.fillStyle = '#D4A017';

        // Lattice mast
        const mastW = 10;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, baseY); ctx.lineTo(x, top);
        ctx.moveTo(x + mastW, baseY); ctx.lineTo(x + mastW, top);
        for (let y = baseY; y > top; y -= 12) {
            ctx.moveTo(x, y); ctx.lineTo(x + mastW, y - 12);
        }
        ctx.stroke();

        // Jib reaching out, counter-jib behind
        const jibLen = 150 + this.sceneryRand(seed, 11) * 60;
        ctx.fillRect(x - 50, top - 4, jibLen + 50, 5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + mastW / 2, top - 22);
        ctx.lineTo(x + jibLen, top - 4);
        ctx.moveTo(x + mastW / 2, top - 22);
        ctx.lineTo(x - 50, top - 4);
        ctx.stroke();
        ctx.fillRect(x + 1, top - 24, mastW - 2, 20);

        // Counterweight and operator cab
        ctx.fillStyle = '#6E6E6E';
        ctx.fillRect(x - 48, top, 18, 12);
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(x + mastW, top + 2, 10, 9);

        // Trolley cable with a slowly swaying hook and load
        const trolleyX = x + jibLen * (0.45 + this.sceneryRand(seed, 12) * 0.4);
        const cableLen = 50 + this.sceneryRand(seed, 13) * 70;
        const sway = Math.sin(t * 0.8 + seed) * 4;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trolleyX, top + 1);
        ctx.lineTo(trolleyX + sway, top + cableLen);
        ctx.stroke();
        ctx.fillStyle = '#8E3B1F';
        ctx.fillRect(trolleyX + sway - 16, top + cableLen, 32, 5);

        // Blinking aviation light
        if (Math.sin(t * 3 + seed) > 0) {
            ctx.fillStyle = '#FF1744';
            ctx.beginPath();
            ctx.arc(x + mastW / 2, top - 26, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // World 3 ground - packed dirt and gravel with a hazard-striped curb and traffic cones
    renderConstructionGround(groundY) {
        const ctx = this.ctx;
        const left = this.camera.x - 100;
        const right = this.camera.x + this.canvas.width + 100;

        // Dirt
        ctx.fillStyle = '#7B6A55';
        ctx.fillRect(left, groundY, right - left, this.canvas.height - groundY);

        // Gravel specks
        const speckStart = Math.floor(left / 18) * 18;
        for (let x = speckStart; x < right; x += 18) {
            for (let row = 0; row < 4; row++) {
                const r = this.sceneryRand(x + row * 7, 14);
                ctx.fillStyle = r > 0.5 ? '#5E5040' : '#958470';
                ctx.fillRect(x + r * 12, groundY + 14 + row * 17 + r * 6, 3, 2);
            }
        }

        // Hazard stripe curb along the top edge
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(left, groundY, right - left, 8);
        ctx.fillStyle = '#212121';
        const stripeStart = Math.floor(left / 24) * 24;
        for (let x = stripeStart; x < right; x += 24) {
            ctx.beginPath();
            ctx.moveTo(x, groundY + 8);
            ctx.lineTo(x + 8, groundY);
            ctx.lineTo(x + 16, groundY);
            ctx.lineTo(x + 8, groundY + 8);
            ctx.closePath();
            ctx.fill();
        }

        // Tire tracks
        ctx.fillStyle = 'rgba(60, 50, 40, 0.35)';
        ctx.fillRect(left, groundY + 40, right - left, 5);
        ctx.fillRect(left, groundY + 52, right - left, 5);

        // Traffic cones standing just behind the action
        const coneStart = Math.floor(left / 430) * 430;
        for (let x = coneStart; x < right; x += 430) {
            const cx = x + 60 + this.sceneryRand(x, 15) * 200;
            ctx.fillStyle = '#FF6D00';
            ctx.beginPath();
            ctx.moveTo(cx - 8, groundY);
            ctx.lineTo(cx, groundY - 24);
            ctx.lineTo(cx + 8, groundY);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(cx - 4.5, groundY - 14, 9, 4);
            ctx.fillStyle = '#E65100';
            ctx.fillRect(cx - 11, groundY - 2, 22, 3);
        }
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

        if (this.currentWorld === 5) {
            this.renderNuclearGround(groundY);
            return;
        }
        if (this.currentWorld === 3) {
            this.renderConstructionGround(groundY);
            return;
        }
        if (this.currentWorld === 4) {
            this.renderMountainGround(groundY);
            return;
        }

        if (this.currentWorld === 2) {
            // Underground bunker floor - concrete with metal grating
            this.ctx.fillStyle = '#3c3c3c'; // Dark concrete
            this.ctx.fillRect(this.camera.x - 100, groundY, this.canvas.width + 200, this.canvas.height - groundY);

            // Concrete texture with subtle variations
            this.ctx.fillStyle = '#424242';
            const startX = Math.floor((this.camera.x - 100) / 60) * 60;
            for (let x = startX; x < this.camera.x + this.canvas.width + 100; x += 60) {
                for (let y = groundY; y < this.canvas.height; y += 40) {
                    if (Math.sin(x * 0.01 + y * 0.01) > 0.3) {
                        this.ctx.fillRect(x, y, 30, 20);
                    }
                }
            }

            // Metal grating lines
            this.ctx.strokeStyle = '#555555';
            this.ctx.lineWidth = 1;
            for (let x = this.camera.x - 50; x < this.camera.x + this.canvas.width + 50; x += 40) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, groundY);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }

            // Horizontal grating lines
            for (let y = groundY; y < this.canvas.height; y += 30) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.camera.x - 100, y);
                this.ctx.lineTo(this.camera.x + this.canvas.width + 100, y);
                this.ctx.stroke();
            }

            // Drainage grates
            this.ctx.fillStyle = '#2a2a2a';
            const grateStartX = Math.floor((this.camera.x - 100) / 200) * 200;
            for (let x = grateStartX; x < this.camera.x + this.canvas.width + 100; x += 200) {
                this.ctx.fillRect(x + 50, groundY + 10, 60, 8);
                // Grate slots
                this.ctx.fillStyle = '#1a1a1a';
                for (let i = 0; i < 6; i++) {
                    this.ctx.fillRect(x + 55 + i * 8, groundY + 12, 4, 4);
                }
                this.ctx.fillStyle = '#2a2a2a';
            }

        } else {
            // Original World 1 - Grass texture
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

        // Shield system
        this.shielded = false;
        this.shieldEndTime = 0;

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

        // Check shield timeout
        if (this.shielded && Date.now() > this.shieldEndTime) {
            this.shielded = false;
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

        // Render shield effect if active
        if (this.shielded) {
            const shieldRadius = Math.max(this.width, this.height) * 0.8;
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Add pulsing glow effect
            const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
            ctx.globalAlpha = 0.1 * pulse;
            ctx.fillStyle = '#00FFFF';
            ctx.fill();
            ctx.restore();
        }
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
        // Shield blocks all damage
        if (this.shielded) {
            return; // No damage taken while shielded
        }

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

    activateShield() {
        this.shielded = true;
        this.shieldEndTime = Date.now() + 5000; // 5 seconds of invincibility
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
        this.type = type; // 0 = soldier1, 1 = soldier2, 2 = tank, 3 = sniper, 4 = boss1, 5 = mech, 6 = tower
        this.assets = assets;

        if (type === 12) { // Reactor Titan - World 5 boss: core beam along the ground and toxic barrels
            this.width = 200;
            this.height = 240;
            this.speed = 0.55;
            this.sprite = null;
            this.maxHealth = 80;
            this.beamPhase = null;     // null | 'charge' | 'fire'
            this.beamTimer = 0;
            this.beamCooldown = 160;
            this.beamHitDone = false;
            this.barrelTimer = 90;
            this.walking = false;
            this.started = false;
            this.cannonFlash = 0;
        } else if (type === 11) { // hazmat trooper - World 5: back tank and a sprayer of radioactive goo
            this.width = 44;
            this.height = 88;
            this.speed = 1.1;
            this.sprite = null;
            this.sprayTimer = 70 + Math.floor(Math.random() * 50);
            this.spraying = 0;       // frames left in the current spray
        } else if (type === 10) { // construction worker - World 3: throws spinning wrenches
            this.width = 38;
            this.height = 82;
            this.speed = 1.4;
            this.sprite = null;
            this.throwTimer = 60 + Math.floor(Math.random() * 60);
            this.throwAnim = 0;      // counts down while the throwing arm swings
            this.variant = Math.random() < 0.5 ? 0 : 1;   // vest/hat colours
        } else if (type === 9) { // cyborg yeti - World 4 boss: shoulder rocket launchers and a ground slam
            this.width = 200;
            this.height = 215;
            this.speed = 0.7;
            this.sprite = null;
            this.maxHealth = 60;
            this.rocketTimer = 140;    // frames until the next rocket volley
            this.rocketQueue = [];     // rockets waiting to leave the launchers this volley
            this.slamPhase = null;     // null | 'windup' | 'slam'
            this.slamTimer = 0;
            this.slamCooldown = 120;
            this.launcherFlash = [0, 0];
            this.walking = false;
            this.roared = false;
        } else if (type === 8) { // shield stickman - World 4: tall metal shield that soaks 10 shots, electric axe up close
            this.width = 60;
            this.height = 110;
            this.speed = 1.3;
            this.sprite = null;
            this.shieldHP = 10;
            this.shieldMax = 10;
            this.attackPhase = null;   // null | 'windup' | 'swing'
            this.attackTimer = 0;
            this.attackCooldown = 40;
            this.shieldBrokenAt = 0;
            this.lastShieldHit = 0;
        } else if (type === 7) { // artillery truck - World 3 boss, drawn by Game.drawArtilleryTruck at 1.5x
            this.width = 357;
            this.height = 150;
            this.speed = 1.0;
            this.sprite = null;
            this.maxHealth = 60;
            this.truckScale = 1.5;
            this.cannonTimer = 120;   // frames until the next artillery shell
            this.mgTimer = 200;       // frames until the next machine-gun burst
            this.mgBurstCount = 0;
            this.recoil = 0;
            this.barrelAngle = -2.4;  // world-space angle, pointing up and to the left
            this.wheelRot = 0;
            this.moving = false;
        } else         if (type === 6) { // tower - stationary structure; soldiers are separate Enemy instances mounted on top
            this.width = 110;
            this.height = 170;
            this.speed = 0;
            this.sprite = null;
            this.maxHealth = 10;
        } else if (type === 5) { // mech - underground world boss, animated
            this.width = 280;  // Larger than boss1
            this.height = 210;
            this.speed = 0.25;  // Slower than boss1
            this.sprite = assets.mechSprite;
            this.maxHealth = 35; // Easier to beat than boss1
            this.machineGunMode = false;
            this.machineGunCooldown = 0;
            this.machineGunBurstCount = 0;
        } else if (type === 4) { // boss1 - powerful tank boss, 25% bigger
            this.width = 250;  // 200 * 1.25 = 250
            this.height = 188;  // 150 * 1.25 = 188
            this.speed = 0.3;
            this.sprite = assets.boss1Sprite;
            this.maxHealth = 50; // Boss has lots of health
            this.machineGunMode = false;
            this.machineGunCooldown = 0;
            this.machineGunBurstCount = 0;
        } else if (type === 3) { // sniper - 10% smaller
            this.width = 81;   // 90 * 0.9 = 81
            this.height = 99;  // 110 * 0.9 = 99
            this.speed = 1.0;
            this.sprite = assets.sniperSprite;
        } else if (type === 2) { // tank
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
        if (type === 0) { // soldier 1
            this.groundY = 200;
        } else if (type === 1) { // soldier 2
            this.groundY = 207;
        } else if (type === 2) { // tank
            this.groundY = 208;
        } else if (type === 3) { // sniper
            this.groundY = 229;
        } else if (type === 4) { // boss1
            this.groundY = 150; // Boss tank higher on ground
        } else if (type === 7) { // artillery truck - wheels on the ground at y=320
            this.groundY = 170;
        } else if (type === 8) { // shield stickman - feet on the ground at y=320
            this.groundY = 210;
        } else if (type === 12) { // Reactor Titan - feet on the ground at y=320
            this.groundY = 80;
        } else if (type === 11) { // hazmat trooper - feet on the ground at y=320
            this.groundY = 232;
        } else if (type === 10) { // construction worker - feet on the ground at y=320
            this.groundY = 238;
        } else if (type === 9) { // cyborg yeti - feet on the ground at y=320
            this.groundY = 105;
        } else if (type === 6) { // tower - pinned so base sits on ground (top ~y=180, bottom ~y=350)
            this.groundY = 180;
        } else { // mech boss
            this.groundY = 140; // Mech boss slightly higher
        }
        this.velocityY = 0;
        this.gravity = 0.5;
        this.onGround = false;
        this.animationFrame = Math.random() * Math.PI * 2;
        this.animationSpeed = 0.1;
        
        // Sound properties
        this.lastEngineSound = 0;
        this.engineSound = (type === 2 || type === 4 || type === 5 || type === 7); // Tanks and bosses make engine sounds
        
        // Health system
        if (isBossType(type)) { // bosses - maxHealth already set above but make sure
            if (!this.maxHealth) {
                this.health = type === 5 ? 35 : 50;
                this.maxHealth = type === 5 ? 35 : 50;
            } else {
                this.health = this.maxHealth;
            }
        } else if (type === 2) { // tank
            this.health = 3;
            this.maxHealth = 3;
        } else if (type === 3) { // sniper - tougher than regular soldiers
            this.health = 2;
            this.maxHealth = 2;
        } else if (type === 6) { // tower - many hits to destroy
            this.health = 10;
            this.maxHealth = 10;
        } else if (type === 10) { // construction worker
            this.health = 2;
            this.maxHealth = 2;
        } else if (type === 11) { // hazmat trooper - the suit is tough
            this.health = 3;
            this.maxHealth = 3;
        } else if (type === 8) { // shield stickman - 2 hits once the shield is gone
            this.health = 2;
            this.maxHealth = 2;
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
        } else if (type === 2) { // tank
            this.pointValue = 100;
        } else if (type === 3) { // sniper
            this.pointValue = 150;
        } else if (type === 4) { // boss1
            this.pointValue = 1000;
        } else if (type === 7) { // artillery truck boss
            this.pointValue = 2000;
        } else if (type === 6) { // tower
            this.pointValue = 250;
        } else if (type === 8) { // shield stickman
            this.pointValue = 200;
        } else if (type === 9) { // cyborg yeti boss
            this.pointValue = 2500;
        } else if (type === 10) { // construction worker
            this.pointValue = 75;
        } else if (type === 11) { // hazmat trooper
            this.pointValue = 150;
        } else if (type === 12) { // Reactor Titan boss
            this.pointValue = 3000;
        } else { // mech boss
            this.pointValue = 1500;
        }
    }
    
    update(player, enemyBullets, game) {
        const distanceToPlayer = Math.abs(player.x - this.x);

        // Mounted soldiers ride the tower until it's destroyed
        if (this.mountedTower) {
            const tower = this.mountedTower;
            if (game && game.enemies.indexOf(tower) !== -1 && tower.health > 0) {
                // Sit on top of the tower platform. Soldier sprites have ~30px
                // transparent space below their visible feet, so add that offset
                // to land the feet on the platform rather than floating above it.
                this.x = tower.x + tower.width / 2 - this.width / 2 + (this.mountOffsetX || 0);
                this.y = tower.y + 45 - this.height;
                this.velocityY = 0;
                this.onGround = true;
                this.facingLeft = player.x < this.x + this.width / 2;
                const shootChance = distanceToPlayer < 700 ? 0.008 : 0.003;
                if (Math.random() < shootChance) {
                    this.shoot(player, enemyBullets, game);
                }
                return;
            }
            // Tower gone — detach and fall normally from here
            this.mountedTower = null;
            this.velocityY = -1; // tiny upward nudge for visible fall arc
        }

        if (this.type === 6) { // Tower - stationary structure, no AI
            return;
        }

        if (this.type === 12) { // Reactor Titan boss has its own AI
            this.updateTitan(player, game);
            return;
        }

        if (this.type === 9) { // Cyborg yeti boss has its own AI
            this.updateYeti(player, game);
            return;
        }

        if (this.type === 7) { // Artillery truck boss has its own AI
            this.updateArtilleryTruck(player, enemyBullets, game);
            return;
        }

        if (this.type === 11) { // Hazmat trooper walks in close and sprays goo
            this.updateHazmat(player, enemyBullets, game);
        } else if (this.type === 10) { // Construction worker keeps his distance and lobs wrenches
            this.updateWorker(player, enemyBullets, game);
        } else if (this.type === 8) { // Shield stickman walks up and swings his electric axe
            this.updateShieldStickman(player, game);
        } else if (this.type === 5) { // Mech AI - underground boss, less aggressive for easier gameplay
            const optimalRange = 400; // Mech prefers longer range
            const tooClose = 250; // Retreat earlier

            // Machine gun burst mode logic
            if (this.machineGunCooldown > 0) {
                this.machineGunCooldown--;
            }

            if (distanceToPlayer < tooClose) {
                // Retreat when too close
                if (player.x < this.x) {
                    this.x += this.speed * 1.2;
                    this.facingLeft = true;
                } else {
                    this.x -= this.speed * 1.2;
                    this.facingLeft = false;
                }
            } else if (distanceToPlayer > optimalRange) {
                // Approach slowly to optimal range
                if (player.x < this.x) {
                    this.x -= this.speed * 0.5;
                    this.facingLeft = true;
                } else {
                    this.x += this.speed * 0.5;
                    this.facingLeft = false;
                }
            }
        } else if (this.type === 4) { // Boss1 AI - aggressive tank with machine gun
            const optimalRange = 400; // Boss wants longer range
            const tooClose = 250; // If player gets too close, retreat more aggressively
            
            // Machine gun burst mode logic
            if (this.machineGunCooldown > 0) {
                this.machineGunCooldown--;
            }
            
            if (distanceToPlayer < tooClose) {
                // Aggressive retreat
                if (player.x < this.x) {
                    this.x += this.speed * 1.5; // Move faster when retreating
                    this.facingLeft = true;
                } else {
                    this.x -= this.speed * 1.5;
                    this.facingLeft = false;
                }
            } else if (distanceToPlayer > optimalRange) {
                // Approach to optimal range
                if (player.x < this.x) {
                    this.x -= this.speed * 0.7;
                    this.facingLeft = true;
                } else {
                    this.x += this.speed * 0.7;
                    this.facingLeft = false;
                }
            }
        } else if (this.type === 3) { // Sniper AI - maintain long distance, rarely move
            const sniperRange = 500; // Snipers like long range
            const tooClose = 300; // Move away if player gets too close
            
            if (distanceToPlayer < tooClose) {
                // Retreat to maintain distance
                if (player.x < this.x) {
                    this.x += this.speed;
                    this.facingLeft = true;
                } else {
                    this.x -= this.speed;
                    this.facingLeft = false;
                }
            } else {
                // Just face player and shoot, rarely move
                this.facingLeft = player.x < this.x;
            }
        } else if (this.type === 2) { // Tank AI - maintain distance and retreat if too close
            const optimalRange = 300; // Tanks want to stay at medium range
            const tooClose = 200; // If player gets too close, retreat
            
            if (distanceToPlayer < tooClose) {
                // Retreat - move away from player
                if (player.x < this.x) {
                    this.x += this.speed; // Move right away from player
                    this.facingLeft = true; // Still face player
                } else {
                    this.x -= this.speed; // Move left away from player  
                    this.facingLeft = false; // Still face player
                }
            } else if (distanceToPlayer > optimalRange) {
                // Approach to optimal range
                if (player.x < this.x) {
                    this.x -= this.speed * 0.5; // Move slower when approaching
                    this.facingLeft = true;
                } else {
                    this.x += this.speed * 0.5;
                    this.facingLeft = false;
                }
            }
            // If at optimal range, just stay still and shoot
        } else { // Soldier AI - approach until close, then stop and shoot
            const stopDistance = 150; // Soldiers stop approaching at this distance
            
            if (distanceToPlayer > stopDistance) {
                // Approach player
                if (player.x < this.x) {
                    this.x -= this.speed;
                    this.facingLeft = true;
                } else {
                    this.x += this.speed;
                    this.facingLeft = false;
                }
            } else {
                // Close enough - just face player and shoot, don't move
                this.facingLeft = player.x < this.x;
            }
        }
        
        // Enemy shooting - different rates and patterns for each type
        let shootChance;
        let specialShoot = false;

        if (this.type === 5) { // Mech - easier machine gun bursts
            if (this.machineGunMode && this.machineGunBurstCount > 0) {
                shootChance = 0.25; // Lower chance during burst
                specialShoot = true;
                this.machineGunBurstCount--;
                if (this.machineGunBurstCount <= 0) {
                    this.machineGunMode = false;
                    this.machineGunCooldown = 150; // Longer cooldown
                }
            } else if (this.machineGunCooldown <= 0 && Math.random() < 0.008) {
                // Start machine gun burst less frequently
                this.machineGunMode = true;
                this.machineGunBurstCount = 6; // 6 bullet burst - shorter
                shootChance = 0.25;
                specialShoot = true;
            } else {
                shootChance = 0.004; // Less frequent regular shots
            }
        } else if (this.type === 4) { // Boss1 - machine gun bursts
            if (this.machineGunMode && this.machineGunBurstCount > 0) {
                shootChance = 0.3; // Very high chance during burst
                specialShoot = true;
                this.machineGunBurstCount--;
                if (this.machineGunBurstCount <= 0) {
                    this.machineGunMode = false;
                    this.machineGunCooldown = 120; // 2 second cooldown
                }
            } else if (this.machineGunCooldown <= 0 && Math.random() < 0.01) {
                // Start machine gun burst
                this.machineGunMode = true;
                this.machineGunBurstCount = 8; // 8 bullet burst
                shootChance = 0.3;
                specialShoot = true;
            } else {
                shootChance = 0.005; // Regular tank cannon shots
            }
        } else if (this.type === 3) { // Sniper - powerful, accurate shots
            shootChance = 0.004; // Less frequent but deadly
            specialShoot = true;
        } else if (this.type === 2) { // Tank
            shootChance = 0.003; // Steady fire rate for tanks
        } else if (this.type === 8 || this.type === 10 || this.type === 11) { // Axe / wrenches / goo only - no gun
            shootChance = 0;
        } else { // Soldiers
            shootChance = distanceToPlayer < 150 ? 0.008 : 0.002; // Shoot more when close
        }
        
        if (Math.random() < shootChance) {
            this.shoot(player, enemyBullets, game, specialShoot);
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
        
        // Ground collision - check platforms first, then default ground
        let standingOnPlatform = false;
        
        // Check if enemy is on any platform
        if (game && game.platforms) {
            for (let platform of game.platforms) {
                const enemyBottom = this.y + this.height;
                const platformTop = platform.y;
                
                // Check if enemy is mostly over the platform (need more overlap)
                const enemyCenter = this.x + this.width / 2;
                const platformCenter = platform.x + platform.width / 2;
                const horizontalOverlap = Math.abs(enemyCenter - platformCenter) < platform.width / 2;
                
                // Check if enemy should be standing on this platform
                if (horizontalOverlap) {
                    // If enemy is at or below platform level, put them on top
                    if (enemyBottom >= platformTop) {
                        // Different positioning adjustments for different enemy types
                        let adjustment = 3; // Default for tall soldiers
                        if (this.type === 0) adjustment = 7; // Smaller soldier needs more adjustment
                        this.y = (platform.y + platform.height) - this.height + adjustment;
                        this.velocityY = 0;
                        this.onGround = true;
                        standingOnPlatform = true;
                        break;
                    }
                }
            }
        }
        
        // If not on platform, use default ground collision
        if (!standingOnPlatform && this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        // Update animation
        this.animationFrame += this.animationSpeed;
    }
    
    // Construction worker: walks in to throwing range, then lobs spinning wrenches in an arc
    updateWorker(player, enemyBullets, game) {
        const pc = player.x + player.width / 2;
        const ec = this.x + this.width / 2;
        const dist = Math.abs(pc - ec);
        this.facingLeft = pc < ec;
        this.walking = false;
        if (this.throwAnim > 0) {
            this.throwAnim--;
            if (this.throwAnim === 6) {
                // Let go of the wrench at the top of the swing
                const dir = this.facingLeft ? -1 : 1;
                const w = new EnemyBullet(ec + dir * 12, this.y + 10, !this.facingLeft, 'wrench');
                const frames = 55;
                w.speed = Math.max(2.5, Math.min(6.5, dist / frames));
                w.vy = -5;
                enemyBullets.push(w);
                if (game) game.playWrenchThrow();
            }
            return;
        }
        if (dist > 230) {
            this.x += this.facingLeft ? -this.speed : this.speed;
            this.walking = true;
        }
        if (dist < 420 && --this.throwTimer <= 0) {
            this.throwAnim = 16;
            this.throwTimer = 90 + Math.floor(Math.random() * 70);
        }
    }

    // Paint pixel art at 1/P size into a shared little canvas, harden the edges, then scale it
    // back up with smoothing off so it matches the blocky soldier sprites.
    renderPixelArt(ctx, key, P, OX, OY, W, H, draw, scale = 1) {
        Enemy.pixCanvases = Enemy.pixCanvases || {};
        let pc = Enemy.pixCanvases[key];
        if (!pc) {
            pc = Enemy.pixCanvases[key] = document.createElement('canvas');
            pc.width = Math.ceil(W / P);
            pc.height = Math.ceil(H / P);
        }
        const p = pc.getContext('2d', { willReadFrequently: true });
        p.setTransform(1, 0, 0, 1, 0, 0);
        p.clearRect(0, 0, pc.width, pc.height);
        p.setTransform(1 / P, 0, 0, 1 / P, OX / P, OY / P);
        draw(p);
        const img = p.getImageData(0, 0, pc.width, pc.height);
        const d = img.data;
        for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 90 ? 255 : 0;
        p.putImageData(img, 0, 0);
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height);
        ctx.scale((this.facingLeft ? -1 : 1) * scale, scale);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pc, -OX, -OY, pc.width * P, pc.height * P);
        ctx.restore();
    }

    // Hazmat trooper: closes to short range, then hoses Tofu with a stream of radioactive goo
    updateHazmat(player, enemyBullets, game) {
        const pc = player.x + player.width / 2;
        const ec = this.x + this.width / 2;
        const dist = Math.abs(pc - ec);
        this.walking = false;
        if (this.spraying > 0) {
            this.spraying--;
            if (this.spraying % 4 === 0) {
                const dir = this.facingLeft ? -1 : 1;
                const g = new EnemyBullet(ec + dir * 30, this.y + 34, !this.facingLeft, 'goo');
                g.vy = -1.4 + Math.random() * 1.6;
                g.speed = 4.5 + Math.random() * 1.2;
                enemyBullets.push(g);
            }
            return;
        }
        this.facingLeft = pc < ec;
        if (dist > 170) {
            this.x += this.facingLeft ? -this.speed : this.speed;
            this.walking = true;
        }
        if (dist < 260 && --this.sprayTimer <= 0) {
            this.spraying = 48;
            this.sprayTimer = 110 + Math.floor(Math.random() * 60);
            if (game) game.playGooSpray();
        }
    }

    renderHazmat(ctx) {
        this.renderPixelArt(ctx, 'hazmat', 3, 51, 150, 120, 153, c => this.drawHazmatArt(c), 0.78);
        if (this.health < this.maxHealth) this.renderHealthBar(ctx);
    }

    // Local game pixels, feet at (0,0), facing +x. Based on the kid's drawing: big rounded helmet
    // with a visor, gas-mask teeth, spiky shoulders, back tank and hose, sprayer, raised staff.
    drawHazmatArt(c) {
        const OUT = '#1C211C';
        const hurt = this.lastHitTime && Date.now() - this.lastHitTime < 140;
        const SUIT = hurt ? '#C0392B' : '#8C8A3E', SUIT2 = '#6F6D2F';
        const MET = '#7D8790', MET2 = '#A3ADB6', GLOW = '#9CFF2E';
        const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
        const step = this.walking ? Math.round(Math.sin(this.animationFrame * 2.2) * 2) * 3 : 0;
        const pulse = Math.floor(Date.now() / 200) % 2 === 0;

        // Staff held up behind him with a glowing radioactive blob on top
        box(-30, -132, 6, 84, OUT); box(-27, -129, 3, 78, '#5A3A1E');
        box(-39, -147, 24, 21, OUT); box(-36, -144, 18, 15, pulse ? GLOW : '#5FCB14');
        box(-33, -141, 6, 6, '#E8FFC2');

        // Back tank with a radiation stripe
        box(-33, -90, 21, 45, OUT); box(-30, -87, 15, 39, MET);
        box(-30, -87, 15, 4, MET2); box(-30, -72, 15, 6, '#F2C200'); box(-24, -72, 3, 6, OUT);

        // Wide stance: skinny legs out to the sides, chunky boots
        box(-9 + step, -42, 6, 12, OUT); box(-12 + step, -30, 6, 12, OUT); box(-15 + step, -18, 6, 12, OUT);
        box(-21 + step, -6, 15, 6, OUT);
        box(3 - step, -42, 6, 12, OUT); box(6 - step, -30, 6, 12, OUT); box(9 - step, -18, 6, 12, OUT);
        box(6 - step, -6, 15, 6, OUT);

        // Hazmat suit body with a belt
        box(-15, -87, 30, 48, OUT);
        box(-12, -84, 24, 42, SUIT);
        box(-12, -84, 6, 42, SUIT2);
        box(-12, -48, 24, 6, OUT);
        // Spiky shoulder pads
        box(-18, -90, 12, 6, OUT); box(-15, -96, 6, 6, OUT);
        box(6, -90, 12, 6, OUT); box(9, -96, 6, 6, OUT);

        // Hose from the tank round to the sprayer
        box(-18, -51, 6, 6, OUT); box(-12, -45, 12, 6, OUT); box(0, -51, 9, 6, OUT); box(9, -57, 6, 9, OUT);
        // Front arm and the wide sprayer nozzle
        box(9, -78, 6, 24, OUT);
        box(9, -63, 24, 9, OUT); box(12, -60, 18, 3, MET);
        box(30, -69, 9, 21, OUT); box(33, -66, 3, 15, MET2);
        if (this.spraying > 0) {
            box(39, -66, 6, 6, GLOW); box(42, -60, 6, 6, '#E8FFC2'); box(39, -54, 6, 6, GLOW);
        }

        // Big rounded helmet with a dark visor and glowing green lenses
        box(-15, -129, 33, 36, OUT); box(-18, -123, 39, 24, OUT);
        box(-12, -126, 27, 30, SUIT); box(-15, -120, 33, 18, SUIT);
        box(-12, -126, 27, 6, SUIT2);
        box(-9, -114, 30, 9, OUT);
        box(3, -111, 6, 3, pulse ? GLOW : '#5FCB14'); box(12, -111, 6, 3, pulse ? GLOW : '#5FCB14');
        // Gas-mask jaw with zigzag teeth and a filter can
        box(0, -102, 18, 12, OUT);
        box(3, -99, 3, 3, '#D8D8D0'); box(9, -99, 3, 3, '#D8D8D0'); box(6, -96, 3, 3, '#D8D8D0'); box(12, -96, 3, 3, '#D8D8D0');
        box(18, -99, 6, 9, OUT); box(18, -96, 3, 3, MET2);
    }

    renderWorker(ctx) {
        this.renderPixelArt(ctx, 'worker', 3, 45, 129, 120, 132, c => this.drawWorkerArt(c), 0.78);
        if (this.health < this.maxHealth) this.renderHealthBar(ctx);
    }

    // Local game pixels, feet at (0,0), facing +x
    drawWorkerArt(c) {
        const OUT = '#1C211C', SKIN = '#D9C29A';
        const hurt = this.lastHitTime && Date.now() - this.lastHitTime < 140;
        // Muted work colours so they sit with the dark olive soldier sprites
        const vest = hurt ? '#C0392B' : (this.variant ? '#8E9A3A' : '#B8662E');
        const hat = this.variant ? '#C9C9BE' : '#C9A23A';
        const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
        const step = this.walking ? Math.round(Math.sin(this.animationFrame * 2.2) * 2) * 3 : 0;

        // Skinny legs with work boots
        box(-9 + step, -39, 6, 39, OUT); box(-15 + step, -6, 12, 6, '#5A3A1E'); box(-15 + step, -3, 12, 3, OUT);
        box(3 - step, -39, 6, 39, OUT); box(3 - step, -6, 12, 6, '#5A3A1E'); box(3 - step, -3, 12, 3, OUT);

        // Body: dark shirt with a hi-vis vest and reflective stripes
        box(-12, -75, 24, 39, OUT);
        box(-9, -72, 18, 30, vest);
        box(-9, -63, 18, 3, '#B9B79A'); box(-9, -54, 18, 3, '#B9B79A');
        box(-3, -72, 3, 30, OUT);                       // vest opening
        // Tool belt with a hammer handle
        box(-12, -42, 24, 6, '#6B4626');
        box(3, -42, 3, 3, '#C9A227');
        box(-15, -45, 3, 12, '#5A3A1E'); box(-18, -48, 9, 4, '#7D8790');

        // Back arm hangs down
        box(-15, -72, 6, 27, OUT);

        // Big blocky head with rounded corners (stepped pixels, like the soldier sprites)
        box(-12, -105, 27, 30, OUT); box(-15, -102, 33, 24, OUT);
        box(-9, -102, 21, 24, SKIN); box(-12, -99, 27, 18, SKIN);
        box(-12, -84, 3, 3, '#C4A97E'); box(12, -84, 3, 3, '#C4A97E');   // shaded jaw corners
        box(3, -93, 3, 6, OUT); box(10, -93, 3, 6, OUT);                 // eyes
        box(3, -84, 9, 3, OUT);                                           // mouth
        // Rounded hard hat with a ridge and brim
        box(-12, -117, 30, 15, OUT); box(-15, -114, 36, 12, OUT);
        box(-9, -114, 24, 9, hat); box(-12, -111, 30, 6, hat);
        box(0, -117, 6, 12, OUT); box(0, -114, 6, 9, this.variant ? '#A9A99E' : '#A8852C');
        box(-18, -105, 42, 6, OUT); box(-15, -105, 36, 3, hat);

        // Throwing arm with a wrench: down by his side, swinging back, then flinging forward
        let a = 0.35;
        if (this.throwAnim > 6) a = -2.2;                         // wound back over his head
        else if (this.throwAnim > 0) a = 1.3;                     // follow-through
        c.save();
        c.translate(6, -69);
        c.rotate(-a);
        box(-3, 0, 6, 24, OUT);
        if (this.throwAnim === 0 || this.throwAnim > 6) {
            // Wrench in hand
            box(-3, 21, 6, 18, '#7D8790'); box(-6, 36, 12, 6, '#7D8790'); box(-6, 39, 3, 3, OUT); box(3, 39, 3, 3, OUT);
        }
        c.restore();
    }

    // Reactor Titan: lumbers toward Tofu, lobs toxic barrels that splash where they land, and
    // charges its core beam - a laser fired low along the ground from its belly cannon. Jump over
    // the beam. Below half health the core overheats: faster barrels, quicker beams, two barrels.
    updateTitan(player, game) {
        const enraged = this.health <= this.maxHealth / 2;
        this.game = game;   // remembered so render can size the beam to the screen
        const pc = player.x + player.width / 2;
        const ec = this.x + this.width / 2;
        const dist = Math.abs(pc - ec);
        this.y = this.groundY;
        this.onGround = true;
        this.animationFrame += this.animationSpeed;
        if (this.cannonFlash > 0) this.cannonFlash--;
        if (!this.started && game) { this.started = true; game.playYetiRoar(); }

        // Core beam
        if (this.beamPhase === 'charge') {
            this.walking = false;
            if (--this.beamTimer <= 0) {
                this.beamPhase = 'fire';
                this.beamTimer = 22;   // shorter than a jump, so a well-timed jump clears it
                this.beamHitDone = false;
                if (game) game.playCoreBeam();
            }
            return;
        }
        if (this.beamPhase === 'fire') {
            this.walking = false;
            const beam = this.getBeamRect(game);
            const hit = player.x < beam.x + beam.w && player.x + player.width > beam.x &&
                        player.y < beam.y + beam.h && player.y + player.height > beam.y;
            if (hit && !this.beamHitDone) {
                this.beamHitDone = true;
                player.takeDamage(2);
                player.lastDamageTime = Date.now();
            }
            if (--this.beamTimer <= 0) {
                this.beamPhase = null;
                this.beamCooldown = enraged ? 150 : 230;
            }
            return;
        }

        this.facingLeft = pc < ec;
        if (--this.beamCooldown <= 0 && dist < 520) {
            this.beamPhase = 'charge';
            this.beamTimer = enraged ? 45 : 65;
            if (game) game.playBeamCharge();
            return;
        }

        // Keep a medium distance, stomping closer when Tofu backs off
        this.walking = false;
        if (dist > 300) {
            this.x += this.facingLeft ? -this.speed * (enraged ? 1.4 : 1) : this.speed * (enraged ? 1.4 : 1);
            this.walking = true;
        }
        if (game && game.getForceFieldBounds) {
            const b = game.getForceFieldBounds();
            if (b) this.x = Math.max(b.left, Math.min(b.right - this.width, this.x));
        }

        // Toxic barrels from the back cannon
        if (--this.barrelTimer <= 0 && game) {
            const shots = enraged ? 2 : 1;
            for (let i = 0; i < shots; i++) this.fireToxicBarrel(pc + (i ? (this.facingLeft ? -70 : 70) : 0), game, i * 18);
            this.barrelTimer = enraged ? 110 : 150;
        }
    }

    // The core beam: a thick laser along the ground from the belly cannon to the edge of the screen
    getBeamRect(game) {
        const dir = this.facingLeft ? -1 : 1;
        const startX = this.x + this.width / 2 + dir * 158;   // cannon muzzle
        const viewL = game ? game.camera.x - 50 : startX - 900;
        const viewR = game ? game.camera.x + game.canvas.width + 50 : startX + 900;
        const y = 272;
        return dir < 0 ? { x: viewL, y, w: startX - viewL, h: 18 } : { x: startX, y, w: viewR - startX, h: 18 };
    }

    fireToxicBarrel(targetX, game, delayFrames = 0) {
        const launch = () => {
            if (game.enemies.indexOf(this) === -1) return;
            const dir = this.facingLeft ? -1 : 1;
            const mx = this.x + this.width / 2 + dir * 2;     // dome turret hatch
            const my = this.y + this.height - 262;
            const gravity = 0.24;
            const frames = 72;
            const vx = (targetX - mx) / frames;
            const vy = (320 - my - 0.5 * gravity * frames * frames) / frames;
            const b = new ArtilleryShell(mx, my, vx, vy, gravity, targetX);
            b.barrel = true;
            b.damage = 2;
            b.blastRadius = 60;
            game.artilleryShells.push(b);
            this.cannonFlash = 8;
            game.playTankShoot();
        };
        if (delayFrames) setTimeout(launch, delayFrames * 16); else launch();
    }

    renderTitan(ctx) {
        this.renderPixelArt(ctx, 'titan', 4, 176, 304, 352, 308, c => this.drawTitanArt(c));
        // Red flash when hit
        if (this.lastHitTime && Date.now() - this.lastHitTime < 90) {
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#FF3030';
            ctx.fillRect(this.x + 20, this.y + 10, this.width - 40, this.height - 10);
            ctx.restore();
        }
        const dir = this.facingLeft ? -1 : 1;
        const cx = this.x + this.width / 2;
        // Charging: a red targeting line and a growing glow at the belly cannon
        if (this.beamPhase === 'charge') {
            const total = this.health <= this.maxHealth / 2 ? 45 : 65;
            const k = 1 - this.beamTimer / total;
            const beam = this.getBeamRect(this.game);
            ctx.save();
            ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(Date.now() * 0.03));
            ctx.fillStyle = '#FF1744';
            ctx.fillRect(beam.x, 280, beam.w, 2);
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#9CFF2E';
            const r = 6 + 14 * k;
            ctx.fillRect(cx + dir * 156 - r, 281 - r, r * 2, r * 2);
            ctx.restore();
        }
        if (this.beamPhase === 'fire') {
            const beam = this.getBeamRect(this.game);
            ctx.save();
            const wob = Math.sin(Date.now() * 0.05) * 2;
            ctx.fillStyle = 'rgba(156, 255, 46, 0.35)';
            ctx.fillRect(beam.x, beam.y - 6 + wob, beam.w, beam.h + 12);
            ctx.fillStyle = '#9CFF2E';
            ctx.fillRect(beam.x, beam.y + wob, beam.w, beam.h);
            ctx.fillStyle = '#F4FFE0';
            ctx.fillRect(beam.x, beam.y + 5 + wob, beam.w, 8);
            ctx.restore();
        }
    }

    // Local game pixels, feet at (0,0), facing +x. Drawn from the kid's sketch: a wide slanted
    // armour plate on top with a domed turret (striped vents, antenna with a ball), a square body
    // with a round porthole showing the spinning reactor core, a column of stacked blocks down to
    // two diamond feet, a big curved claw on the back side and a long cannon in front.
    drawTitanArt(c) {
        const OUT = '#1C211C', ARM = '#5E6B5A', ARM2 = '#7F8C79', ARM3 = '#3F4A3C', DARK = '#2A2F28';
        const enraged = this.health <= this.maxHealth / 2;
        const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
        const t = Date.now();
        const pulse = Math.floor(t / 160) % 2 === 0;
        const CORE = enraged ? (pulse ? '#FF5252' : '#D50000') : (pulse ? '#B6FF3B' : '#6FD116');
        // Walking: the whole mech rocks from foot to foot
        const step = this.walking ? Math.round(Math.sin(this.animationFrame * 1.4) * 2) * 4 : 0;
        const bob = this.walking ? Math.abs(step) / 2 : 0;

        // ---- Two diamond feet ----
        const foot = (cx, lift, shade) => {
            box(cx - 8, -28 - lift, 16, 4, OUT);
            box(cx - 16, -24 - lift, 32, 4, OUT); box(cx - 12, -24 - lift, 24, 4, shade);
            box(cx - 24, -20 - lift, 48, 8, OUT); box(cx - 20, -20 - lift, 40, 8, shade);
            box(cx - 16, -12 - lift, 32, 4, OUT); box(cx - 12, -12 - lift, 24, 4, shade);
            box(cx - 8, -8 - lift, 16, 8, OUT); box(cx - 4, -8 - lift, 8, 4, shade);
            box(cx - 4, -24 - lift, 8, 20, OUT);                 // the crease down the middle
        };
        foot(-34, Math.max(0, step), ARM3);
        foot(30, Math.max(0, -step), ARM2);
        box(-30, -36, 60, 12, OUT); box(-26, -32, 52, 4, ARM3);  // hip bar joining the feet

        c.save();
        c.translate(0, -bob);

        // ---- Column of stacked blocks (slightly offset, like the drawing) ----
        [[-26, -64, 44], [-20, -92, 44], [-28, -120, 48]].forEach(([x, y, w], i) => {
            box(x, y, w, 32, OUT);
            box(x + 4, y + 4, w - 8, 24, i % 2 ? ARM2 : ARM);
            box(x + 4, y + 4, w - 8, 4, '#A3ADB6');
            box(x + w / 2 - 2, y + 12, 4, 4, ARM3);               // bolt
        });

        // ---- Big curved claw on the back side ----
        box(-64, -168, 20, 20, OUT);                               // shoulder joint
        box(-96, -184, 36, 24, OUT); box(-92, -180, 28, 16, ARM);
        box(-112, -164, 28, 28, OUT); box(-108, -160, 20, 20, ARM);
        box(-120, -140, 28, 36, OUT); box(-116, -136, 20, 28, ARM2);
        box(-112, -108, 28, 20, OUT); box(-108, -104, 20, 12, ARM);
        box(-92, -96, 24, 16, OUT); box(-88, -92, 16, 8, ARM3);    // claw tip curling back in
        box(-72, -100, 12, 12, OUT);

        // ---- Square body with the round porthole ----
        box(-52, -196, 104, 80, OUT);
        box(-48, -192, 96, 72, ARM);
        box(-48, -192, 96, 6, ARM2);
        [[-44, -184], [36, -184], [-44, -132], [36, -132]].forEach(([x, y]) => box(x, y, 6, 6, ARM3));
        // Stepped round porthole
        box(-20, -184, 40, 56, OUT); box(-28, -176, 56, 40, OUT);
        box(-16, -180, 32, 48, '#20301C'); box(-24, -172, 48, 32, '#20301C');
        // Spinning reactor turbine inside (the lines in the drawing's circle)
        const spin = Math.floor(t / 120) % 4;
        box(-12, -168, 24, 24, CORE);
        const blades = [[[-4, -180, 8, 12], [-4, -144, 8, 12]], [[8, -176, 8, 8], [-16, -144, 8, 8]],
                        [[12, -160, 12, 8], [-24, -160, 12, 8]], [[8, -144, 8, 8], [-16, -176, 8, 8]]][spin];
        blades.forEach(([x, y, w, h]) => box(x, y, w, h, CORE));
        box(-4, -160, 8, 8, '#F4FFE0');

        // ---- Long cannon arm in front, angled down toward the ground ----
        box(44, -156, 20, 20, OUT); box(48, -152, 12, 12, ARM3);   // shoulder
        box(56, -144, 24, 24, OUT); box(60, -140, 16, 16, ARM2);
        box(72, -124, 24, 24, OUT); box(76, -120, 16, 16, ARM2);
        // Barrel in steps down to the muzzle
        box(88, -108, 28, 20, OUT); box(92, -104, 20, 12, ARM3);
        box(108, -96, 28, 20, OUT); box(112, -92, 20, 12, ARM3);
        box(128, -84, 28, 20, OUT); box(132, -80, 20, 12, ARM3);
        box(148, -72, 16, 20, OUT);
        box(152, -68, 8, 12, this.beamPhase ? CORE : DARK);       // muzzle glows while the beam is up

        // ---- Wide slanted armour plate on top (dark hatching, pointed front corner) ----
        // Simple slanted slab: higher at the back, lower at the front, like the drawing
        // Outline first, then the fill, so the slab reads as one solid piece with no seams
        for (let i = 0; i < 16; i++) box(-124 + i * 16, -236 + i * 2, 16, 34, OUT);
        for (let i = 0; i < 16; i++) {
            const x = -124 + i * 16, y = -236 + i * 2;
            box(x + (i === 0 ? 4 : 0), y + 4, i === 15 ? 12 : 16, 26, ARM2);
            box(x + (i === 0 ? 4 : 0), y + 4, i === 15 ? 12 : 16, 4, '#A3ADB6');
            // Dark diagonal hatching scribbled across it, like the drawing
            if (i % 2 === 0) box(x + 4, y + 14 + (i % 4), 12, 4, ARM3);
            if (i % 3 === 0) box(x + 2, y + 22, 10, 3, ARM3);
        }
        box(132, -206, 12, 20, OUT); box(144, -198, 8, 8, OUT);     // pointed front corner
        box(-124, -240, 8, 16, OUT);                                 // raised back lip

        // ---- Dome turret on top with striped vents and an antenna ball ----
        box(-44, -264, 64, 32, OUT); box(-36, -272, 48, 8, OUT); box(-28, -276, 32, 4, OUT);
        box(-40, -260, 56, 28, ARM); box(-32, -268, 40, 8, ARM2);
        // Striped vent on the back of the dome
        box(-60, -252, 20, 20, OUT);
        box(-56, -248, 4, 12, '#F2C200'); box(-48, -248, 4, 12, '#F2C200');
        // Turret hatch for the barrels
        box(-8, -260, 20, 12, DARK);
        if (this.cannonFlash > 0) { box(-12, -284, 28, 16, '#FFEB3B'); box(-4, -296, 12, 12, '#FF9800'); }
        // Antenna with a ball on the end
        box(20, -252, 8, 8, OUT); box(28, -260, 8, 8, OUT); box(36, -268, 8, 8, OUT);
        box(40, -280, 16, 16, OUT); box(44, -276, 8, 8, enraged && pulse ? '#FF1744' : '#9CFF2E');

        // Overheating sparks
        if (enraged && Math.random() < 0.6) {
            for (let i = 0; i < 5; i++) box(Math.floor((Math.random() * 180 - 90) / 4) * 4, Math.floor((-60 - Math.random() * 180) / 4) * 4, 4, 4, Math.random() < 0.5 ? '#FFC107' : '#9CFF2E');
        }
        c.restore();
    }

    // Cyborg yeti boss: stomps toward Tofu, fires rocket volleys from both shoulder launchers
    // that arc down where Tofu is standing (a red ring marks each landing spot), and slams the
    // ground when Tofu gets close - jump to dodge the shockwave. Below half health it gets
    // angry: bigger volleys, more often, and it walks faster.
    updateYeti(player, game) {
        const enraged = this.health <= this.maxHealth / 2;
        const pc = player.x + player.width / 2;
        const ec = this.x + this.width / 2;
        const dist = Math.abs(pc - ec);
        this.y = this.groundY;
        this.onGround = true;
        this.animationFrame += this.animationSpeed;
        if (!this.roared && game) { this.roared = true; game.playYetiRoar(); }
        this.launcherFlash = this.launcherFlash.map(f => Math.max(0, f - 1));

        // Ground slam
        if (this.slamPhase === 'windup') {
            this.walking = false;
            if (--this.slamTimer <= 0) {
                this.slamPhase = 'slam';
                this.slamTimer = 18;
                if (game) {
                    game.playMineExplosion();
                    const dir = this.facingLeft ? -1 : 1;
                    [40, 110, 180].forEach(off => game.explosions.push(new Explosion(ec + dir * off, 305)));
                    const playerOnGround = player.onGround && player.y + player.height > 300;
                    if (playerOnGround && dist < 260) {
                        player.takeDamage(2);
                        player.lastDamageTime = Date.now();
                        player.velocityY = -6;
                        player.x += pc < ec ? -60 : 60;
                    }
                }
            }
            return;
        }
        if (this.slamPhase === 'slam') {
            if (--this.slamTimer <= 0) {
                this.slamPhase = null;
                this.slamCooldown = enraged ? 110 : 170;
            }
            return;
        }
        if (this.slamCooldown > 0) this.slamCooldown--;

        this.facingLeft = pc < ec;
        if (dist < 260 && this.slamCooldown <= 0) {
            this.slamPhase = 'windup';
            this.slamTimer = enraged ? 28 : 38;
            this.walking = false;
            if (game) game.playYetiRoar();
            return;
        }

        // Keep at rocket range, stomping closer when Tofu backs off
        const step = this.speed * (enraged ? 1.5 : 1);
        this.walking = false;
        if (dist > 330) {
            this.x += this.facingLeft ? -step : step;
            this.walking = true;
        }
        if (game && game.getForceFieldBounds) {
            const b = game.getForceFieldBounds();
            if (b) this.x = Math.max(b.left, Math.min(b.right - this.width, this.x));
        }

        // Rocket volleys
        if (this.rocketQueue.length) {
            const next = this.rocketQueue[0];
            if (--next.delay <= 0) {
                this.rocketQueue.shift();
                this.fireYetiRocket(next.side, pc + next.spread, game);
            }
        } else if (--this.rocketTimer <= 0) {
            const count = enraged ? 4 : 2;
            for (let i = 0; i < count; i++) {
                this.rocketQueue.push({ side: i % 2, delay: i === 0 ? 1 : 14, spread: (i - (count - 1) / 2) * 55 });
            }
            this.rocketTimer = enraged ? 120 : 170;
        }
    }

    // Launch one rocket from a shoulder launcher (0 = back shoulder, 1 = front shoulder)
    fireYetiRocket(side, targetX, game) {
        if (!game) return;
        const dir = this.facingLeft ? -1 : 1;
        const cx = this.x + this.width / 2;
        const lx = side === 1 ? 110 : -46;   // front end of each launcher tube
        const mx = cx + dir * lx;
        const my = this.y + this.height - 214;
        const gravity = 0.22;
        const flightFrames = 70;
        const vx = (targetX - mx) / flightFrames;
        const vy = (320 - my - 0.5 * gravity * flightFrames * flightFrames) / flightFrames;
        const rocket = new ArtilleryShell(mx, my, vx, vy, gravity, targetX);
        rocket.rocket = true;
        rocket.damage = 2;
        rocket.blastRadius = 55;
        game.artilleryShells.push(rocket);
        this.launcherFlash[side] = 8;
        game.playRocketLaunch();
    }

    // Big blocky pixel-art yeti, painted at 1/4 size and scaled up like the other pixel troops
    renderYeti(ctx) {
        const P = 4;
        const OX = 168, OY = 260, W = 336, H = 264;
        if (!Enemy.yetiCanvas) {
            Enemy.yetiCanvas = document.createElement('canvas');
            Enemy.yetiCanvas.width = W / P;
            Enemy.yetiCanvas.height = H / P;
        }
        const pc = Enemy.yetiCanvas;
        const p = pc.getContext('2d', { willReadFrequently: true });
        p.setTransform(1, 0, 0, 1, 0, 0);
        p.clearRect(0, 0, pc.width, pc.height);
        p.setTransform(1 / P, 0, 0, 1 / P, OX / P, OY / P);
        this.drawYetiArt(p);
        const img = p.getImageData(0, 0, pc.width, pc.height);
        const d = img.data;
        for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 90 ? 255 : 0;
        p.putImageData(img, 0, 0);
        // Flash red when hit
        if (this.lastHitTime && Date.now() - this.lastHitTime < 100) {
            p.setTransform(1, 0, 0, 1, 0, 0);
            p.globalCompositeOperation = 'source-atop';
            p.fillStyle = 'rgba(255, 40, 40, 0.45)';
            p.fillRect(0, 0, pc.width, pc.height);
            p.globalCompositeOperation = 'source-over';
        }

        const cx = this.x + this.width / 2;
        const by = this.y + this.height;
        ctx.save();
        ctx.translate(cx, by);
        ctx.scale(this.facingLeft ? -1 : 1, 1);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pc, -OX, -OY, W, H);
        ctx.restore();
    }

    // Local game pixels, feet at (0,0), facing +x
    drawYetiArt(c) {
        const OUT = '#1C211C', FUR = '#E8EEF2', FUR2 = '#B9C6CF', FUR3 = '#93A3AE';
        const MET = '#6B7680', MET2 = '#9AA5AF', MET3 = '#454E57';
        const enraged = this.health <= this.maxHealth / 2;
        const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
        const step = this.walking ? Math.round(Math.sin(this.animationFrame * 1.6) * 2) * 4 : 0;
        const bob = this.walking ? Math.abs(step) / 2 : 0;
        let armLift = 0;          // 0 = hanging, 1 = fully raised for the slam
        if (this.slamPhase === 'windup') armLift = Math.min(1, 1.6 * (1 - this.slamTimer / 38));
        const crouch = this.slamPhase === 'slam' ? 8 : 0;

        // ---- Legs ----
        box(-56 + step, -64, 40, 64, OUT); box(-52 + step, -64, 32, 56, FUR2); box(-60 + step, -12, 48, 12, OUT);
        box(16 - step, -64, 40, 64, OUT); box(20 - step, -64, 32, 56, FUR); box(12 - step, -12, 52, 12, OUT);
        box(24 - step, -40, 24, 12, MET); box(24 - step, -40, 24, 4, MET2);   // cyborg knee brace

        c.save();
        c.translate(0, -bob + crouch);

        // ---- Back arm (fur) ----
        c.save();
        c.translate(-60, -168);
        c.rotate(-armLift * 2.6);
        box(-16, 0, 32, 92, OUT); box(-12, 0, 24, 84, FUR2); box(-20, 80, 40, 24, OUT); box(-16, 84, 32, 16, FUR3);
        c.restore();

        // ---- Body ----
        box(-72, -184, 144, 128, OUT);
        box(-68, -180, 136, 120, FUR);
        // Shaggy fur tufts
        for (let i = 0; i < 8; i++) box(-64 + i * 16, -64, 12, 8, i % 2 ? FUR2 : FUR);
        box(-68, -140, 8, 40, FUR2); box(-40, -120, 8, 24, FUR2);
        // Cyborg chest plate with glowing core
        box(-28, -168, 60, 72, OUT); box(-24, -164, 52, 64, MET); box(-24, -164, 52, 6, MET2);
        box(-20, -110, 8, 8, MET3); box(16, -110, 8, 8, MET3);
        const glow = Math.floor(Date.now() / 150) % 2 === 0;
        box(-12, -148, 28, 28, OUT);
        box(-8, -144, 20, 20, enraged ? (glow ? '#FF5252' : '#D50000') : (glow ? '#7FE9FF' : '#00B8D4'));
        box(-4, -140, 8, 8, '#FFFFFF');
        // Wires
        box(-40, -150, 12, 4, '#E53935'); box(-48, -146, 8, 4, '#E53935'); box(-40, -130, 12, 4, '#FFC107');

        // ---- Shoulder rocket launchers: long boxes tilted up, rockets poking out the front ----
        const launcher = (lx, flash) => {
            c.save();
            c.translate(lx, -202);
            c.rotate(-0.35);
            box(-8, 10, 16, 20, OUT); box(-4, 10, 8, 16, MET3);           // mount on the shoulder
            box(-30, -18, 64, 32, OUT);
            box(-26, -14, 56, 24, MET);
            box(-26, -14, 56, 5, MET2);
            box(-18, -6, 4, 12, MET3); box(-8, -6, 4, 12, MET3);            // vents
            box(30, -14, 10, 10, OUT); box(30, -1, 10, 10, OUT);           // rocket noses
            box(32, -12, 6, 6, '#E53935'); box(32, 1, 6, 6, '#E53935');
            if (flash > 0) {
                box(40, -22, 20, 36, '#FFEB3B');
                box(56, -14, 14, 20, '#FF9800');
                box(-46, -10, 16, 16, 'rgba(230,230,230,0.9)');            // back-blast smoke
            }
            c.restore();
        };
        launcher(-78, this.launcherFlash[0]);

        // ---- Head ----
        box(-40, -236, 80, 64, OUT);
        box(-36, -232, 72, 56, FUR);
        box(-36, -232, 72, 8, FUR2);
        // Metal half of the face (front side) with a glowing red eye
        box(4, -228, 32, 44, MET); box(4, -228, 32, 4, MET2);
        box(12, -216, 16, 12, OUT); box(16, -212, 12, 8, enraged || glow ? '#FF1744' : '#C62828');
        box(8, -192, 4, 4, MET3); box(28, -192, 4, 4, MET3);
        // Angry fur-side eye and brow
        box(-24, -216, 16, 8, OUT); box(-20, -212, 8, 4, '#FFEB3B');
        box(-28, -224, 24, 6, OUT);
        // Mouth with fangs
        box(-24, -196, 52, 16, OUT);
        box(-20, -196, 8, 8, '#FFFFFF'); box(16, -196, 8, 8, '#FFFFFF');
        if (this.slamPhase || this.rocketQueue.length) box(-8, -192, 20, 8, '#8E0000');   // roaring
        // Horns
        box(-44, -252, 16, 24, OUT); box(-40, -248, 8, 16, FUR3);
        box(28, -252, 16, 24, OUT); box(32, -248, 8, 16, MET2);

        launcher(78, this.launcherFlash[1]);

        // ---- Front arm (cyborg) ----
        c.save();
        c.translate(64, -168);
        c.rotate(-armLift * 2.6);
        box(-16, 0, 32, 92, OUT); box(-12, 0, 24, 84, MET);
        box(-12, 0, 6, 84, MET2);
        box(-16, 36, 32, 12, OUT); box(-12, 40, 24, 4, '#FFC107');            // elbow joint
        box(-24, 80, 48, 28, OUT); box(-20, 84, 40, 20, MET3);                  // fist
        box(-20, 104, 8, 12, OUT); box(-4, 104, 8, 12, OUT); box(12, 104, 8, 12, OUT);  // claws
        c.restore();

        // Steam/sparks when he's angry
        if (enraged && Math.random() < 0.5) {
            for (let i = 0; i < 4; i++) box(Math.floor((Math.random() * 120 - 40) / 4) * 4, Math.floor((-150 - Math.random() * 90) / 4) * 4, 4, 4, Math.random() < 0.5 ? '#FFC107' : '#7FE9FF');
        }
        c.restore();
    }

    // Shield stickman: marches up to Tofu behind his shield, raises the electric axe
    // (it crackles while charging), then swings it down. Gets faster once his shield breaks.
    updateShieldStickman(player, game) {
        const pc = player.x + player.width / 2;
        const ec = this.x + this.width / 2;
        const dist = Math.abs(pc - ec);
        const broken = this.shieldHP <= 0;
        if (this.attackCooldown > 0) this.attackCooldown--;

        if (!this.attackPhase) {
            this.facingLeft = pc < ec;
            const verticalClose = Math.abs((player.y + player.height) - (this.y + this.height)) < 60;
            if (dist > 78) {
                const step = this.speed * (broken ? 1.5 : 1);
                this.x += this.facingLeft ? -step : step;
            } else if (this.attackCooldown <= 0 && verticalClose) {
                this.attackPhase = 'windup';
                this.attackTimer = broken ? 22 : 30;
                if (game) game.playAxeCharge();
            }
        } else if (this.attackPhase === 'windup') {
            if (--this.attackTimer <= 0) {
                this.attackPhase = 'swing';
                this.attackTimer = 10;
                if (game) game.playAxeZap();
                // The blade reaches about 100px in front of him; jumping over it dodges the hit
                const inFront = this.facingLeft ? (pc < ec + 10 && pc > ec - 105) : (pc > ec - 10 && pc < ec + 105);
                const lowEnough = player.y + player.height > this.y + 30;
                if (inFront && lowEnough) {
                    player.takeDamage(2); // 1 full heart
                    player.lastDamageTime = Date.now();
                    player.x += this.facingLeft ? -40 : 40;
                    this.zapHitUntil = Date.now() + 250;
                }
            }
        } else if (this.attackPhase === 'swing') {
            if (--this.attackTimer <= 0) {
                this.attackPhase = null;
                this.attackCooldown = broken ? 50 : 70;
            }
        }
    }

    // How far the axe arm is raised: 0 = straight up, negative = pulled back, positive = chopping forward
    getAxeAngle() {
        if (this.attackPhase === 'windup') {
            const total = this.shieldHP <= 0 ? 22 : 30;
            const p = 1 - this.attackTimer / total;
            return -0.45 - p * 0.75;
        }
        if (this.attackPhase === 'swing') {
            const p = 1 - this.attackTimer / 10;
            return -1.2 + Math.min(1, p * 3.5) * 2.9;
        }
        return -0.45 + Math.sin(this.animationFrame * 0.6) * 0.06;
    }

    // Shield stickman is drawn as chunky pixel art to match the soldier sprites: the figure is
    // painted at 1/3 size into a tiny canvas, hard-edged, then blown back up with smoothing off.
    renderShieldStickman(ctx) {
        const now = Date.now();
        const P = 3;                          // game pixels per art pixel
        const OX = 120, OY = 201;             // local origin (feet) inside the art canvas, in game px
        const W = 270, H = 207;
        if (!Enemy.pixCanvas) {
            Enemy.pixCanvas = document.createElement('canvas');
            Enemy.pixCanvas.width = W / P;
            Enemy.pixCanvas.height = Math.ceil(H / P);
        }
        const pc = Enemy.pixCanvas;
        const p = pc.getContext('2d', { willReadFrequently: true });
        p.setTransform(1, 0, 0, 1, 0, 0);
        p.clearRect(0, 0, pc.width, pc.height);
        p.setTransform(1 / P, 0, 0, 1 / P, OX / P, OY / P);
        this.drawShieldStickmanArt(p, now);
        // Hard edges: every art pixel is either solid or empty, like the sprites
        const img = p.getImageData(0, 0, pc.width, pc.height);
        const d = img.data;
        for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 90 ? 255 : 0;
        p.putImageData(img, 0, 0);

        const cx = this.x + this.width / 2;
        const by = this.y + this.height;
        const dir = this.facingLeft ? -1 : 1;
        ctx.save();
        ctx.translate(cx, by);
        ctx.scale(dir, 1);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pc, -OX, -OY, W, pc.height * P);
        ctx.restore();

        // Shield chunks tumbling to the ground after it breaks
        if (this.shieldBrokenAt && now - this.shieldBrokenAt < 1600) {
            const t = (now - this.shieldBrokenAt) / 1000;
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 0.9) / 0.7);
            const pieces = [{ vx: 70, vy: -120, w: 4, h: 6 }, { vx: 30, vy: -170, w: 3, h: 5 }, { vx: 110, vy: -60, w: 4, h: 4 }];
            pieces.forEach(pc2 => {
                const px = Math.round((this.shieldBreakX + dir * pc2.vx * t) / P) * P;
                const py = Math.round(Math.min(by - pc2.h * P, this.shieldBreakY + pc2.vy * t + 400 * t * t) / P) * P;
                ctx.fillStyle = '#1C211C';
                ctx.fillRect(px - P, py - P, (pc2.w + 2) * P, (pc2.h + 2) * P);
                ctx.fillStyle = '#7D8790';
                ctx.fillRect(px, py, pc2.w * P, pc2.h * P);
            });
            ctx.restore();
        }

        if (this.health < this.maxHealth) this.renderHealthBar(ctx);
    }

    // The figure itself, in local game pixels (feet at 0,0, facing +x). Colours match soldier_1/2.png.
    drawShieldStickmanArt(c, now) {
        const OUT = '#1C211C', DARK = '#262D25', CAMO = '#3E4C34', SKIN = '#D9C29A';
        const hurt = this.lastHitTime && now - this.lastHitTime < 140 && this.shieldHP <= 0;
        const body = hurt ? '#8E2A20' : DARK;
        const walking = !this.attackPhase;
        const step = walking ? Math.round(Math.sin(this.animationFrame * 2.2) * 2) * 3 : 0;
        const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };

        // Legs (blocky, outlined)
        box(-9 + step, -42, 6, 42, OUT); box(-15 + step, -3, 12, 3, OUT);   // skinny legs, like the soldier sprites
        box(3 - step, -42, 6, 42, OUT); box(3 - step, -3, 12, 3, OUT);
        // Torso with camo patches and belt
        box(-15, -84, 30, 45, OUT);
        box(-12, -81, 24, 39, body);
        if (!hurt) { box(-9, -75, 9, 6, CAMO); box(3, -66, 9, 9, CAMO); box(-9, -57, 6, 9, CAMO); }
        box(-12, -48, 24, 6, OUT);
        box(-3, -48, 6, 6, '#6B6B4A');

        // ---- Electric axe on the back arm ----
        const a = this.getAxeAngle();
        c.save();
        c.translate(-3, -78);                 // shoulder
        c.rotate(a);
        box(-6, -36, 12, 36, OUT);            // arm
        box(-3, -33, 6, 30, body);
        c.translate(0, -36);                  // hand
        box(-3, -36, 6, 48, '#4A3018');       // handle
        box(-3, -36, 3, 48, '#6B4626');
        box(-3, -42, 24, 18, OUT);            // blade head
        box(0, -39, 18, 12, '#9AA4AE');
        box(15, -39, 3, 12, '#D5DBE0');
        const charging = this.attackPhase === 'windup' || this.attackPhase === 'swing';
        const bolt = charging ? '#FFF59D' : '#F4D03F';
        box(-3, -54, 9, 12, OUT); box(0, -51, 6, 9, bolt);      // jagged lightning tip
        box(3, -63, 9, 12, OUT); box(6, -60, 3, 9, bolt);
        box(-3, -72, 9, 12, OUT); box(0, -69, 3, 9, bolt);
        // Sparks - a few blue pixels idle, a crackling cloud while charging
        const sparks = charging ? 9 : (Math.random() < 0.35 ? 2 : 0);
        for (let i = 0; i < sparks; i++) {
            box(-12 + Math.floor(Math.random() * 9) * 3, -78 + Math.floor(Math.random() * 10) * 3, 3, 3,
                Math.random() < 0.5 ? '#7FE9FF' : '#E0FFFF');
        }
        c.restore();

        // Lightning bolt where the swing lands
        if (this.attackPhase === 'swing' && this.attackTimer > 4) {
            for (let k = 0; k < 2; k++) {
                let x = 39, y = -66 + k * 12;
                for (let j = 0; j < 9; j++) {
                    box(x, y, 6, 6, j % 2 ? '#7FE9FF' : '#E0FFFF');
                    x += 9; y += Math.random() < 0.5 ? 6 : 3;
                }
            }
        }

        // ---- Square head, metal helmet with a spike, goggles ----
        box(-15, -111, 30, 30, OUT);
        box(-12, -102, 24, 18, SKIN);
        box(6, -90, 6, 3, OUT);               // mouth
        box(-18, -120, 36, 18, OUT);          // helmet
        box(-15, -117, 30, 12, '#56606B');
        box(-12, -117, 24, 3, '#7D8893');
        box(-3, -129, 6, 9, OUT); box(-3, -126, 3, 6, '#AAB4BE');   // spike
        box(-15, -102, 33, 9, OUT);           // goggles band
        box(0, -102, 6, 6, '#7FE9FF'); box(9, -102, 6, 6, '#7FE9FF');
        box(0, -102, 3, 3, '#E0FFFF'); box(9, -102, 3, 3, '#E0FFFF');

        // ---- Front arm: holds the shield, or hangs once it's gone ----
        if (this.shieldHP > 0) {
            box(9, -78, 18, 9, OUT); box(12, -75, 12, 3, body);
            this.drawStickmanShield(c, 21, -93, now);
        } else {
            box(9, -78, 9, 33, OUT); box(12, -75, 3, 27, body);
        }
    }

    // Tall riot shield in local space (front side is +x). A new crack appears with every hit.
    drawStickmanShield(c, x, y, now) {
        const box = (bx, by, w, h, col) => { c.fillStyle = col; c.fillRect(x + bx, y + by, w, h); };
        const flash = now - this.lastShieldHit < 90;
        box(0, 0, 18, 72, '#1C211C');
        box(3, 3, 12, 66, flash ? '#FFFFFF' : '#7D8790');
        if (!flash) {
            box(3, 3, 3, 66, '#A3ADB6');          // light edge
            box(6, 9, 6, 6, '#2E3A44');           // viewport
            box(9, 27, 3, 3, '#4A535C'); box(9, 57, 3, 3, '#4A535C');   // rivets
        }
        const hits = this.shieldMax - this.shieldHP;
        const cracks = [
            [[9, 33], [6, 36], [6, 39], [9, 42]],
            [[9, 30], [12, 27], [12, 21]],
            [[9, 45], [12, 48], [9, 51], [6, 54]],
            [[6, 39], [3, 45], [6, 48], [6, 60]]
        ];
        // Cracks spread evenly over the shield's 10 hits
        const shown = Math.ceil(hits / this.shieldMax * cracks.length);
        for (let i = 0; i < Math.min(shown, cracks.length); i++) {
            cracks[i].forEach(([px, py]) => box(px, py, 3, 3, '#1C211C'));
        }
    }

    // Turret pivot in world space, matching Game.drawArtilleryTruck's layout
    getTruckPivot() {
        const s = this.truckScale;
        const facingRight = !this.facingLeft;
        return {
            x: facingRight ? this.x + (238 - 160) * s : this.x + 160 * s,
            y: 320 - 72 * s
        };
    }

    // Artillery truck boss: keeps its distance, lobs shells that land where the player
    // is standing, and sprays the machine gun when the player gets close. Below half
    // health it gets angry - fires three-shell spreads, more often.
    updateArtilleryTruck(player, enemyBullets, game) {
        const s = this.truckScale;
        const enraged = this.health <= this.maxHealth / 2;
        const playerCenter = player.x + player.width / 2;
        const truckCenter = this.x + this.width / 2;
        const distance = Math.abs(playerCenter - truckCenter);
        this.facingLeft = playerCenter < truckCenter;

        // Drive to stay at artillery range (close enough that the whole truck stays on
        // screen with the camera following the player), never past the force fields
        const prevX = this.x;
        const away = this.facingLeft ? 1 : -1;
        if (distance < 260) {
            this.x += away * this.speed * (enraged ? 1.6 : 1.2);
        } else if (distance > 340) {
            this.x -= away * this.speed * 0.8;
        }
        if (game && game.getForceFieldBounds) {
            const bounds = game.getForceFieldBounds();
            if (bounds) this.x = Math.max(bounds.left, Math.min(bounds.right - this.width, this.x));
        }
        this.moving = this.x !== prevX;
        this.wheelRot += (this.x - prevX) * 0.08;
        this.y = this.groundY;
        this.velocityY = 0;
        this.onGround = true;

        // Barrel eases toward a lob angle aimed at the player
        const pivot = this.getTruckPivot();
        const aim = this.getShellAngle(pivot, playerCenter);
        this.barrelAngle += (aim - this.barrelAngle) * 0.08;
        this.recoil = Math.max(0, this.recoil - 1);

        // Artillery cannon
        this.cannonTimer--;
        if (this.cannonTimer <= 0) {
            const offsets = enraged ? [-130, 0, 130] : [0];
            offsets.forEach(offset => {
                const targetX = playerCenter + offset + (Math.random() - 0.5) * 60;
                this.fireArtilleryShell(pivot, targetX, game);
            });
            this.recoil = 14;
            this.cannonTimer = enraged ? 110 : 160;
            if (game) game.playTankShoot();
        }

        // Machine gun from the cab when the player gets close - jump over the bullets
        this.mgTimer--;
        if (this.mgBurstCount > 0) {
            if (this.mgTimer % 6 === 0) {
                const gunX = this.facingLeft ? this.x + 10 * s : this.x + this.width - 10 * s;
                enemyBullets.push(new EnemyBullet(gunX, 258, !this.facingLeft, 'machinegun'));
                if (game) game.playEnemyShoot();
                this.mgBurstCount--;
            }
        } else if (this.mgTimer <= 0) {
            if (distance < 480) {
                this.mgBurstCount = enraged ? 10 : 7;
            }
            this.mgTimer = enraged ? 150 : 220;
        }

        // Engine rumble
        if (this.engineSound && game && Date.now() - this.lastEngineSound > 1000) {
            game.playTankEngine(this);
        }
        this.animationFrame += this.animationSpeed;
    }

    // Launch direction for a shell from the pivot that lands at targetX
    getShellAngle(pivot, targetX) {
        const gravity = 0.25;
        const flightFrames = 75;
        const vx = (targetX - pivot.x) / flightFrames;
        const vy = (320 - pivot.y - 0.5 * gravity * flightFrames * flightFrames) / flightFrames;
        return Math.atan2(vy, vx);
    }

    // Launch a shell on a ballistic arc that comes down at targetX
    fireArtilleryShell(pivot, targetX, game) {
        if (!game) return;
        const gravity = 0.25;
        const flightFrames = 75;
        const barrelLength = 95 * this.truckScale;
        // Aim from the pivot first, then launch from the muzzle along that line
        const angle = this.getShellAngle(pivot, targetX);
        this.barrelAngle = angle;
        const mx = pivot.x + Math.cos(angle) * barrelLength;
        const my = pivot.y + Math.sin(angle) * barrelLength;
        const vx = (targetX - mx) / flightFrames;
        const vy = (320 - my - 0.5 * gravity * flightFrames * flightFrames) / flightFrames;
        game.artilleryShells.push(new ArtilleryShell(mx, my, vx, vy, gravity, targetX));
        game.explosions.push(new Explosion(mx, my)); // muzzle flash
    }

    shoot(player, enemyBullets, game, specialShoot = false) {
        const bulletX = this.x;
        const bulletY = this.y + this.height * 0.5;
        
        // Determine bullet type and properties
        let bulletType = 'normal';
        if (this.type === 5) { // Mech
            bulletType = specialShoot ? 'machinegun' : 'tank';
        } else if (this.type === 4) { // Boss1
            bulletType = specialShoot ? 'machinegun' : 'tank';
        } else if (this.type === 3) { // Sniper
            bulletType = 'sniper';
        } else if (this.type === 2) { // Tank
            bulletType = 'tank';
        }
        
        // Shoot towards the player
        const shootRight = player.x > this.x;
        enemyBullets.push(new EnemyBullet(bulletX, bulletY, shootRight, bulletType));
        
        // Play appropriate sound effect
        if (game) {
            if (bulletType === 'tank' || bulletType === 'sniper') {
                game.playTankShoot();
            } else {
                game.playEnemyShoot();
            }
        }
    }
    
    takeDamage(amount) {
        // The shield stickman's shield soaks the first shots
        if (this.type === 8 && this.shieldHP > 0) {
            this.shieldHP--;
            this.lastShieldHit = Date.now();
            this.shieldBlocked = true;
            if (this.shieldHP <= 0) {
                this.shieldJustBroke = true;
                this.shieldBrokenAt = Date.now();
                this.shieldBreakX = this.x + this.width / 2 + (this.facingLeft ? -26 : 26);
                this.shieldBreakY = this.y + this.height - 55;
            }
            return false;
        }
        this.health -= amount;
        this.lastHitTime = Date.now();
        if (this.health <= 0) {
            this.health = 0;
            return true; // Enemy is destroyed
        }
        return false; // Enemy still alive
    }
    
    render(ctx) {
        if (this.type === 12) {
            this.renderTitan(ctx);
            return;
        }
        if (this.type === 11) {
            this.renderHazmat(ctx);
            return;
        }
        if (this.type === 10) {
            this.renderWorker(ctx);
            return;
        }
        if (this.type === 9) {
            this.renderYeti(ctx);
            return;
        }
        if (this.type === 8) {
            this.renderShieldStickman(ctx);
            return;
        }
        if (this.type === 6) {
            this.renderTower(ctx);
            if (this.health < this.maxHealth) this.renderHealthBar(ctx);
            return;
        }
        if (this.type === 7) {
            this.renderArtilleryTruck(ctx);
            return;
        }
        if (this.sprite) {
            ctx.save();

            // Flip sprite based on facing direction
            // Boss1 and Mech need special handling - reverse the normal flipping
            const shouldFlip = (this.type === 4 || this.type === 5) ? !this.facingLeft : this.facingLeft;

            if (shouldFlip) {
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

            // Mech boss (type 5) uses frame-based animation with 2x2 grid
            if (this.type === 5) {
                // Calculate which frame to show (0-3) based on animationFrame
                const frameIndex = Math.floor(this.animationFrame / (Math.PI / 2)) % 4;

                // 2x2 grid layout
                const frameWidth = this.sprite.width / 2;
                const frameHeight = this.sprite.height / 2;
                const col = frameIndex % 2;
                const row = Math.floor(frameIndex / 2);

                ctx.drawImage(
                    this.sprite,
                    col * frameWidth, row * frameHeight,  // source x, y
                    frameWidth, frameHeight,              // source width, height
                    0, 0,                                 // dest x, y
                    this.width, this.height               // dest width, height
                );
            } else {
                // Other enemy types draw the full sprite
                if (this.facingLeft) {
                    ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
                } else {
                    ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
                }
            }

            ctx.restore();

            // Draw health indicator for damaged enemies
            if (this.health < this.maxHealth) {
                this.renderHealthBar(ctx);
            }
        }
    }

    renderTower(ctx) {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        ctx.save();

        // Damage flash
        if (this.health < this.maxHealth) {
            const flash = Math.sin(Date.now() * 0.02) * 0.25 + 0.75;
            ctx.globalAlpha = flash;
        }

        // Tower body (slimmer than full width, centered)
        const bodyTop = y + 25;
        const bodyW = w * 0.6;
        const bodyX = x + (w - bodyW) / 2;
        ctx.fillStyle = '#6b5a3e';
        ctx.fillRect(bodyX, bodyTop, bodyW, h - 25);
        ctx.strokeStyle = '#2e2618';
        ctx.lineWidth = 2;
        ctx.strokeRect(bodyX, bodyTop, bodyW, h - 25);

        // Ladder rungs down the body
        ctx.strokeStyle = '#2e2618';
        ctx.lineWidth = 1.5;
        for (let yy = bodyTop + 20; yy < y + h - 5; yy += 18) {
            ctx.beginPath();
            ctx.moveTo(bodyX + 8, yy);
            ctx.lineTo(bodyX + bodyW - 8, yy);
            ctx.stroke();
        }

        // Top platform — wider than body so soldiers visibly stand on it
        const platW = w * 1.6;
        const platH = 12;
        const platX = x + (w - platW) / 2;
        const platY = y + 15;
        ctx.fillStyle = '#5a4a30';
        ctx.fillRect(platX, platY, platW, platH);
        ctx.strokeStyle = '#2e2618';
        ctx.lineWidth = 2;
        ctx.strokeRect(platX, platY, platW, platH);

        // Antenna/mast at top center
        const mastX = x + w / 2;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mastX, platY);
        ctx.lineTo(mastX, y - 30);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mastX - 8, y - 8);
        ctx.lineTo(mastX + 8, y - 8);
        ctx.moveTo(mastX - 5, y - 18);
        ctx.lineTo(mastX + 5, y - 18);
        ctx.stroke();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(mastX, y - 32, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderArtilleryTruck(ctx) {
        if (typeof game === 'undefined') return;
        const t = Date.now() / 1000;
        const facingRight = !this.facingLeft;
        ctx.save();
        // Flash bright for a moment when hit
        if (this.lastHitTime && Date.now() - this.lastHitTime < 90) {
            ctx.filter = 'brightness(1.8)';
        }
        game.drawArtilleryTruck(ctx, this.x, 320, {
            scale: this.truckScale,
            facingRight,
            // drawArtilleryTruck takes the barrel angle in the truck's own (unmirrored) frame
            barrelAngle: facingRight ? Math.PI - this.barrelAngle : this.barrelAngle,
            recoil: this.recoil,
            wheelRot: this.wheelRot,
            moving: this.moving,
            t
        });
        ctx.restore();

        // Smoke and fire pouring off the engine once it's badly damaged
        if (this.health <= this.maxHealth / 2) {
            const cabX = facingRight ? this.x + this.width - 60 : this.x + 60;
            for (let i = 0; i < 5; i++) {
                const rise = (t * 0.7 + i / 5) % 1;
                ctx.fillStyle = `rgba(50, 50, 50, ${0.55 * (1 - rise)})`;
                ctx.beginPath();
                ctx.arc(cabX + Math.sin(i * 3 + t * 2) * 8, 175 - rise * 90, 8 + rise * 16, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = Math.sin(t * 25) > 0 ? '#FF6F00' : '#FFA000';
            ctx.beginPath();
            ctx.arc(cabX, 178, 7 + Math.sin(t * 18) * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        this.renderHealthBar(ctx);
    }

    renderHealthBar(ctx) {
        const isBoss = isBossType(this.type);
        const barWidth = isBoss ? this.width * 0.9 : this.width * 0.8;
        const barHeight = isBoss ? 8 : 4;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - (isBoss ? 15 : 10);
        
        // Background
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health portion
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = isBoss ? '#FFD700' : '#00FF00'; // Gold for boss, green for others
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = isBoss ? 2 : 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Boss health text
        if (isBoss) {
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            const healthText = `${this.health}/${this.maxHealth}`;
            const textX = barX + barWidth / 2;
            const textY = barY - 5;
            ctx.strokeText(healthText, textX, textY);
            ctx.fillText(healthText, textX, textY);
            ctx.restore();
        }
    }
}

// Shell lobbed by the artillery truck boss. Flies on a gravity arc; Game.updateArtilleryShells
// blows it up when it lands. A red marker on the ground shows where it will come down.
class ArtilleryShell {
    constructor(x, y, vx, vy, gravity, targetX) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.gravity = gravity;
        this.targetX = targetX;
        this.width = 10;
        this.height = 10;
        this.damage = 3;
        this.blastRadius = 70;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }

    render(ctx) {
        ctx.save();

        // Landing marker - grows more urgent as the shell drops
        const urgency = Math.min(1, Math.max(0, this.y / 320));
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.02);
        ctx.strokeStyle = `rgba(255, 23, 68, ${0.4 + 0.5 * urgency * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.targetX, 322, this.blastRadius * (0.5 + 0.5 * urgency), 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Smoke trail
        this.trail.forEach((p, i) => {
            ctx.fillStyle = this.rocket ? `rgba(230, 230, 230, ${0.07 * i})` : `rgba(90, 90, 90, ${0.05 * i})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 + i * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });

        if (this.barrel) {
            // Tumbling yellow toxic-waste barrel with a radiation band
            ctx.translate(Math.round(this.x), Math.round(this.y));
            ctx.rotate(Math.floor(Date.now() / 90) % 4 * Math.PI / 2);
            ctx.fillStyle = '#1C211C'; ctx.fillRect(-10, -13, 20, 26);
            ctx.fillStyle = '#F2C200'; ctx.fillRect(-7, -10, 14, 20);
            ctx.fillStyle = '#1C211C'; ctx.fillRect(-7, -2, 14, 4);
            ctx.fillStyle = '#9CFF2E'; ctx.fillRect(-4, -14, 8, 4);
            ctx.restore();
            return;
        }
        if (this.rocket) {
            // Yeti rocket: pixel-style body, red nose, fins and a flickering flame
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.atan2(this.vy, this.vx));
            const flame = 6 + Math.random() * 6;
            ctx.fillStyle = '#FF9800'; ctx.fillRect(-12 - flame, -3, flame, 6);
            ctx.fillStyle = '#FFEB3B'; ctx.fillRect(-12 - flame * 0.5, -1.5, flame * 0.5, 3);
            ctx.fillStyle = '#1C211C'; ctx.fillRect(-13, -5, 24, 10);
            ctx.fillStyle = '#B0BEC5'; ctx.fillRect(-11, -3, 16, 6);
            ctx.fillStyle = '#E53935'; ctx.fillRect(5, -3, 6, 6);
            ctx.fillStyle = '#1C211C'; ctx.fillRect(-13, -8, 6, 3); ctx.fillRect(-13, 5, 6, 3);
            ctx.restore();
            return;
        }

        // Shell body pointing along its flight path
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.vy, this.vx));
        ctx.fillStyle = '#37474F';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFB300';
        ctx.fillRect(-9, -2, 4, 4);

        ctx.restore();
    }
}

class EnemyBullet {
    constructor(x, y, facingRight, bulletType = 'normal') {
        this.x = x;
        this.y = y;
        this.startX = x; // Remember starting position for range calculation
        this.direction = facingRight ? 1 : -1;
        this.bulletType = bulletType;
        
        // Set properties based on bullet type
        if (bulletType === 'sniper') {
            this.width = 8;
            this.height = 3;
            this.speed = 12; // Much faster
            this.damage = 3; // Much more powerful
        } else if (bulletType === 'machinegun') {
            this.width = 4;
            this.height = 2;
            this.speed = 8; // Fast machine gun bullets
            this.damage = 1;
        } else if (bulletType === 'tank') {
            this.width = 16;
            this.height = 12;
            this.speed = 4;
            this.damage = 2;
        } else if (bulletType === 'goo') { // hazmat trooper's radioactive goo, sprayed in a short arc
            this.width = 8;
            this.height = 8;
            this.speed = 5;
            this.damage = 1;
            this.vy = -1;
            this.gravity = 0.14;
            this.spin = 0;
        } else if (bulletType === 'wrench') { // construction worker's spinning wrench, thrown in an arc
            this.width = 14;
            this.height = 14;
            this.speed = 4;
            this.damage = 1;
            this.vy = -5;
            this.gravity = 0.18;
            this.spin = 0;
        } else { // normal soldier bullets
            this.width = 6;
            this.height = 6;
            this.speed = 4;
            this.damage = 1;
        }
        
        // Backward compatibility
        this.isTank = (bulletType === 'tank');
    }
    
    update() {
        this.x += this.speed * this.direction;
        if (this.bulletType === 'wrench' || this.bulletType === 'goo') {
            this.vy += this.gravity;
            this.y += this.vy;
            this.spin++;
            if (this.y > 318) this.landed = true;   // clatters onto the ground
        }
    }
    
    render(ctx) {
        if (this.bulletType === 'goo') {
            // Chunky glowing green blob
            const x = Math.round(this.x / 2) * 2, y = Math.round(this.y / 2) * 2;
            ctx.fillStyle = 'rgba(156, 255, 46, 0.35)';
            ctx.fillRect(x - 3, y - 3, 14, 14);
            ctx.fillStyle = '#7BE021';
            ctx.fillRect(x, y, 8, 8);
            ctx.fillStyle = '#E8FFC2';
            ctx.fillRect(x + 2, y + 2, 3, 3);
            return;
        }
        if (this.bulletType === 'wrench') {
            // Blocky wrench that turns a quarter-turn every few frames
            ctx.save();
            ctx.translate(Math.round(this.x + 7), Math.round(this.y + 7));
            ctx.rotate(Math.floor(this.spin / 4) * Math.PI / 2 * this.direction);
            ctx.fillStyle = '#1C211C';
            ctx.fillRect(-3, -10, 6, 20); ctx.fillRect(-8, -12, 16, 7); ctx.fillRect(-8, 6, 16, 7);
            ctx.fillStyle = '#9AA4AE';
            ctx.fillRect(-1, -8, 3, 16); ctx.fillRect(-6, -10, 4, 3); ctx.fillRect(3, -10, 4, 3);
            ctx.fillRect(-6, 8, 4, 3); ctx.fillRect(3, 8, 4, 3);
            ctx.restore();
            return;
        }
        if (this.bulletType === 'sniper') {
            // Sniper bullets - bright yellow/orange, very thin and fast-looking
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#FF8C00';
            ctx.fillRect(this.x + 1, this.y, this.width - 2, this.height);
        } else if (this.bulletType === 'machinegun') {
            // Machine gun bullets - small, fast, bright red
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.bulletType === 'tank') {
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

class GoldenHeartPowerup {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.sprite = assets.goldenHeartSprite;
        this.animationFrame = Math.random() * Math.PI * 2;
        this.animationSpeed = 0.12;
        this.floatOffset = 0;
        this.pulseScale = 1;
    }

    update() {
        this.animationFrame += this.animationSpeed;
        this.floatOffset = Math.sin(this.animationFrame) * 6;
        this.pulseScale = 1 + Math.sin(this.animationFrame * 2) * 0.08;
    }

    render(ctx) {
        const renderY = this.y + this.floatOffset;
        const cx = this.x + this.width / 2;
        const cy = renderY + this.height / 2;
        const w = this.width * this.pulseScale;
        const h = this.height * this.pulseScale;

        if (this.sprite) {
            // Outer gold halo
            ctx.save();
            ctx.globalAlpha = 0.45;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 22;
            ctx.drawImage(this.sprite, cx - w / 2, cy - h / 2, w, h);
            ctx.restore();
            // Main heart
            ctx.drawImage(this.sprite, cx - w / 2, cy - h / 2, w, h);
        } else {
            // Fallback golden heart
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(this.pulseScale, this.pulseScale);
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#6B4A00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.bezierCurveTo(-5, -11, -11, -7, -5, -1);
            ctx.lineTo(0, 5);
            ctx.lineTo(5, -1);
            ctx.bezierCurveTo(11, -7, 5, -11, 0, -7);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    collect(player) {
        // Full restore
        player.heal(player.maxHealth);
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

class ShieldPowerup {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.sprite = assets.shieldSprite;
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.floatOffset = 0;
    }

    update() {
        // Gentle floating animation with shield glow
        this.animationFrame += this.animationSpeed;
        this.floatOffset = Math.sin(this.animationFrame) * 5;
    }

    render(ctx) {
        const renderY = this.y + this.floatOffset;

        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);

            // Add shield glow effect
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.shadowColor = '#00FFFF';
            ctx.shadowBlur = 20;
            ctx.drawImage(this.sprite, this.x, renderY, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback shield icon
            ctx.save();
            ctx.fillStyle = '#00FFFF';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;

            const centerX = this.x + this.width / 2;
            const centerY = renderY + this.height / 2;
            const radius = this.width * 0.4;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Shield cross pattern
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX - radius * 0.5, centerY);
            ctx.lineTo(centerX + radius * 0.5, centerY);
            ctx.moveTo(centerX, centerY - radius * 0.5);
            ctx.lineTo(centerX, centerY + radius * 0.5);
            ctx.stroke();
            ctx.restore();
        }
    }

    collect(player) {
        // Activate shield mode
        player.activateShield();
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

class BossExplosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.maxTime = 180; // Dramatic long explosion (3 seconds)
        this.finished = false;
        this.particles = [];
        
        // Create MASSIVE explosion particles for boss
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 24, // Even faster spread
                vy: (Math.random() - 0.5) * 24 - 6,
                size: Math.random() * 18 + 6, // Huge particles
                color: this.getParticleColor(),
                life: Math.random() * 0.8 + 0.7 // Long-lasting particles
            });
        }
        
        // Add massive smoke cloud
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 80,
                y: y + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 12 - 4, // Strong upward smoke
                size: Math.random() * 25 + 15,
                color: '#333333', // Dark dramatic smoke
                life: 1.0,
                isSmoke: true
            });
        }
    }
    
    getParticleColor() {
        const colors = ['#FF0000', '#FF4500', '#FFD700', '#FF6600', '#FFA500', '#FFFF00', '#FF1493', '#8A2BE2'];
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
            particle.vy += particle.isSmoke ? 0.03 : 0.25; // Gentler gravity for longer effect
            particle.size *= particle.isSmoke ? 0.995 : 0.98; // Slower fade for dramatic effect
            particle.vx *= 0.99; // Less air resistance for bigger explosion
            particle.life -= particle.isSmoke ? 0.005 : 0.008; // Much slower fade
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0 && p.size > 1);
    }
    
    render(ctx) {
        const alpha = 1 - (this.timer / this.maxTime);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw MASSIVE explosion flash (much bigger and longer)
        if (this.timer < 30) {
            const flashRadius = (30 - this.timer) * 40; // Enormous flash
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, flashRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(0.2, 'rgba(255, 100, 100, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.6)');
            gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(100, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, flashRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Screen shake effect for first 60 frames
        if (this.timer < 60) {
            const shakeIntensity = (60 - this.timer) / 6;
            ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
        }
        
        // Draw all particles
        this.particles.forEach(particle => {
            if (particle.size > 1 && particle.life > 0) {
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

class Bunker {
    constructor(x, y, width = 220, height = 130) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        ctx.save();

        // Main concrete body
        ctx.fillStyle = '#7b7b6f';
        ctx.fillRect(x, y, w, h);

        // Lighter top band
        ctx.fillStyle = '#8d8d80';
        ctx.fillRect(x, y, w, h * 0.32);

        // Outer border
        ctx.strokeStyle = '#2e2e26';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        // band separator
        ctx.beginPath();
        ctx.moveTo(x, y + h * 0.32);
        ctx.lineTo(x + w, y + h * 0.32);
        ctx.stroke();

        // Slit/window left of center with soldier visible inside
        const slitW = w * 0.32;
        const slitH = h * 0.26;
        const slitX = x + w * 0.10;
        const slitY = y + h * 0.46;
        ctx.fillStyle = '#15140f';
        ctx.fillRect(slitX, slitY, slitW, slitH);
        ctx.strokeStyle = '#2e2e26';
        ctx.lineWidth = 2;
        ctx.strokeRect(slitX, slitY, slitW, slitH);

        // Soldier inside slit
        const sCenterX = slitX + slitW * 0.45;
        const sBaseY = slitY + slitH * 0.95;
        // body in shadow
        ctx.fillStyle = '#3a4a2a';
        ctx.fillRect(sCenterX - 9, sBaseY - 20, 18, 20);
        // face
        ctx.fillStyle = '#c9a484';
        ctx.beginPath();
        ctx.arc(sCenterX, sBaseY - 24, 6, 0, Math.PI * 2);
        ctx.fill();
        // helmet
        ctx.fillStyle = '#2e3a22';
        ctx.beginPath();
        ctx.arc(sCenterX, sBaseY - 26, 7, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(sCenterX - 7, sBaseY - 27, 14, 2);
        // eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(sCenterX - 3, sBaseY - 24, 2, 2);
        ctx.fillRect(sCenterX + 1, sBaseY - 24, 2, 2);

        // Right-side entrance opening (gateway to next world)
        const doorW = w * 0.20;
        const doorH = h * 0.62;
        const doorX = x + w - doorW - 4;
        const doorY = y + h - doorH - 2;
        ctx.fillStyle = '#0a0a08';
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.strokeStyle = '#2e2e26';
        ctx.lineWidth = 2;
        ctx.strokeRect(doorX, doorY, doorW, doorH);

        // Antennas / poles on top
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.18, y);
        ctx.lineTo(x + w * 0.18, y - 34);
        ctx.moveTo(x + w * 0.38, y);
        ctx.lineTo(x + w * 0.36, y - 42);
        ctx.lineTo(x + w * 0.40, y - 38);
        ctx.stroke();

        // Concrete horizontal seams
        ctx.strokeStyle = '#5d5d52';
        ctx.lineWidth = 1;
        for (let yy = y + h * 0.32 + 14; yy < y + h - 6; yy += 18) {
            ctx.beginPath();
            ctx.moveTo(x, yy);
            ctx.lineTo(x + w, yy);
            ctx.stroke();
        }

        ctx.restore();
    }
}

class Sandbag {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.type = 'sandbag';
    }
    
    render(ctx) {
        ctx.save();
        
        // Main sandbag body - beige/tan color
        ctx.fillStyle = '#D2B48C'; // Tan color
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Sandbag border
        ctx.strokeStyle = '#8B4513'; // Saddle brown
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Sandbag texture lines
        ctx.strokeStyle = '#B8860B'; // Dark golden rod
        ctx.lineWidth = 1;
        
        // Horizontal stitching lines
        for (let y = this.y + 10; y < this.y + this.height - 5; y += 10) {
            ctx.beginPath();
            ctx.moveTo(this.x + 5, y);
            ctx.lineTo(this.x + this.width - 5, y);
            ctx.stroke();
        }
        
        // Vertical tie marks
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 3, this.y + 5);
        ctx.lineTo(this.x + this.width / 3, this.y + this.height - 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + (2 * this.width) / 3, this.y + 5);
        ctx.lineTo(this.x + (2 * this.width) / 3, this.y + this.height - 5);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Check collision with bullets
    collidesWith(bullet) {
        return bullet.x < this.x + this.width &&
               bullet.x + bullet.width > this.x &&
               bullet.y < this.y + this.height &&
               bullet.y + bullet.height > this.y;
    }
}

class BarbedWire {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }

    render(ctx) {
        ctx.save();

        // Main wire lines - multiple strands
        ctx.strokeStyle = '#444444'; // Dark gray wire
        ctx.lineWidth = 2;

        // Top wire line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 3);
        ctx.lineTo(this.x + this.width, this.y + 3);
        ctx.stroke();

        // Middle wire line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x + this.width, this.y + 10);
        ctx.stroke();

        // Bottom wire line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 17);
        ctx.lineTo(this.x + this.width, this.y + 17);
        ctx.stroke();

        // Barbs along the wires
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        const barbSpacing = 8;

        for (let x = this.x; x < this.x + this.width; x += barbSpacing) {
            // Barbs on top wire
            ctx.beginPath();
            ctx.moveTo(x, this.y + 3);
            ctx.lineTo(x - 3, this.y);
            ctx.moveTo(x, this.y + 3);
            ctx.lineTo(x + 3, this.y);

            // Barbs on middle wire
            ctx.moveTo(x + 4, this.y + 10);
            ctx.lineTo(x + 1, this.y + 6);
            ctx.moveTo(x + 4, this.y + 10);
            ctx.lineTo(x + 7, this.y + 14);

            // Barbs on bottom wire
            ctx.moveTo(x + 2, this.y + 17);
            ctx.lineTo(x - 1, this.y + 14);
            ctx.moveTo(x + 2, this.y + 17);
            ctx.lineTo(x + 5, this.y + 20);
            ctx.stroke();
        }

        ctx.restore();
    }
}

class WoodenCrate {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 40; // Taller than barbed wire
    }

    collidesWith(object) {
        return object.x < this.x + this.width &&
               object.x + object.width > this.x &&
               object.y < this.y + this.height &&
               object.y + object.height > this.y;
    }

    render(ctx) {
        ctx.save();

        // Main crate body - wood brown
        ctx.fillStyle = '#8B4513'; // Saddle brown
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Wood grain texture
        ctx.strokeStyle = '#654321'; // Dark brown
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const grainY = this.y + 8 + i * 12;
            ctx.beginPath();
            ctx.moveTo(this.x + 2, grainY);
            ctx.lineTo(this.x + this.width - 2, grainY);
            ctx.stroke();
        }

        // Vertical wood planks
        for (let x = this.x + 15; x < this.x + this.width - 5; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, this.y + 2);
            ctx.lineTo(x, this.y + this.height - 2);
            ctx.stroke();
        }

        // Metal reinforcement bands
        ctx.strokeStyle = '#444444'; // Dark gray metal
        ctx.lineWidth = 3;

        // Top band
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 5);
        ctx.lineTo(this.x + this.width, this.y + 5);
        ctx.stroke();

        // Bottom band
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width, this.y + this.height - 5);
        ctx.stroke();

        // Metal corner brackets
        ctx.fillStyle = '#333333';
        // Top left bracket
        ctx.fillRect(this.x - 2, this.y - 2, 8, 8);
        // Top right bracket
        ctx.fillRect(this.x + this.width - 6, this.y - 2, 8, 8);
        // Bottom left bracket
        ctx.fillRect(this.x - 2, this.y + this.height - 6, 8, 8);
        // Bottom right bracket
        ctx.fillRect(this.x + this.width - 6, this.y + this.height - 6, 8, 8);

        // Military stencil text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SUPPLY', this.x + this.width/2, this.y + 20);
        ctx.fillText('MK-47', this.x + this.width/2, this.y + 30);

        ctx.restore();
    }
}

class DestructibleCrate {
    constructor(x, y, width, points) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 40;
        this.points = points;
        this.health = 2; // Takes 2 shots to destroy
        this.destroyed = false;
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroyed = true;
            return this.points; // Return points awarded
        }
        return 0;
    }

    checkBulletCollision(bullet) {
        return !this.destroyed &&
               bullet.x < this.x + this.width &&
               bullet.x + bullet.width > this.x &&
               bullet.y < this.y + this.height &&
               bullet.y + bullet.height > this.y;
    }

    render(ctx) {
        if (this.destroyed) return;

        ctx.save();

        // Main crate body - darker wood if damaged
        const crateColor = this.health === 1 ? '#654321' : '#8B4513';
        ctx.fillStyle = crateColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Wood grain texture
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const grainY = this.y + 8 + i * 12;
            ctx.beginPath();
            ctx.moveTo(this.x + 2, grainY);
            ctx.lineTo(this.x + this.width - 2, grainY);
            ctx.stroke();
        }

        // Vertical wood planks
        for (let x = this.x + 12; x < this.x + this.width - 5; x += 12) {
            ctx.beginPath();
            ctx.moveTo(x, this.y + 2);
            ctx.lineTo(x, this.y + this.height - 2);
            ctx.stroke();
        }

        // Metal reinforcement bands
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 2;

        // Top band
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 5);
        ctx.lineTo(this.x + this.width, this.y + 5);
        ctx.stroke();

        // Bottom band
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width, this.y + this.height - 5);
        ctx.stroke();

        // Damage indicators (cracks) if damaged
        if (this.health === 1) {
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            // Diagonal crack
            ctx.beginPath();
            ctx.moveTo(this.x + 5, this.y + 8);
            ctx.lineTo(this.x + this.width - 5, this.y + this.height - 8);
            ctx.stroke();
        }

        // Destructible indicator - small "X" mark
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('X', this.x + this.width/2, this.y + 12);

        // Point value
        ctx.fillStyle = '#FFFF00';
        ctx.font = '8px Arial';
        ctx.fillText('+' + this.points, this.x + this.width/2, this.y + this.height - 5);

        ctx.restore();
    }
}

// World 3 concrete jersey barrier - solid obstacle with the same collision as a crate
class ConcreteBarrier extends WoodenCrate {
    render(ctx) {
        ctx.save();
        const x = this.x, y = this.y, w = this.width, h = this.height;

        // Tapered jersey barrier profile
        ctx.fillStyle = '#B8B2A7';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + 6, y + h - 14);
        ctx.lineTo(x + 14, y + 4);
        ctx.lineTo(x + w - 14, y + 4);
        ctx.lineTo(x + w - 6, y + h - 14);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8A857C';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Orange and white reflective stripes
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 10, y + 12, w - 20, 9);
        ctx.clip();
        for (let sx = x - 10; sx < x + w; sx += 16) {
            ctx.fillStyle = '#FF6D00';
            ctx.beginPath();
            ctx.moveTo(sx, y + 21);
            ctx.lineTo(sx + 8, y + 12);
            ctx.lineTo(sx + 16, y + 12);
            ctx.lineTo(sx + 8, y + 21);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // Concrete specks
        ctx.fillStyle = 'rgba(90, 85, 78, 0.5)';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(x + 12 + ((i * 37) % (w - 24)), y + 26 + (i % 3) * 4, 2, 2);
        }

        ctx.restore();
    }
}

// World 4 mountain boulder - solid obstacle with the same collision as a crate
class Boulder extends WoodenCrate {
    render(ctx) {
        ctx.save();
        const x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.fillStyle = '#7E7A73';
        ctx.strokeStyle = '#4E4A44';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + 3, y + h * 0.45);
        ctx.lineTo(x + w * 0.25, y + 4);
        ctx.lineTo(x + w * 0.6, y);
        ctx.lineTo(x + w - 4, y + h * 0.3);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Highlight facet and cracks
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y + 5);
        ctx.lineTo(x + w * 0.58, y + 2);
        ctx.lineTo(x + w * 0.45, y + h * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(40, 36, 32, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.62, y + h * 0.35);
        ctx.lineTo(x + w * 0.7, y + h * 0.6);
        ctx.lineTo(x + w * 0.64, y + h * 0.85);
        ctx.stroke();
        // Snow cap and moss
        ctx.fillStyle = '#F5F7FA';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.22, y + 6);
        ctx.lineTo(x + w * 0.6, y + 1);
        ctx.lineTo(x + w * 0.85, y + h * 0.22);
        ctx.quadraticCurveTo(x + w * 0.55, y + 12, x + w * 0.22, y + 6);
        ctx.fill();
        ctx.fillStyle = '#5B7F3A';
        ctx.fillRect(x + 2, y + h - 5, w - 4, 5);
        ctx.restore();
    }
}

// World 4 pile of cut logs
class LogPile extends WoodenCrate {
    render(ctx) {
        ctx.save();
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const r = h / 4;
        // Two logs on the bottom row, one on top, seen end-on with long sides behind
        const ends = [
            { cx: x + w * 0.28, cy: y + h - r },
            { cx: x + w * 0.72, cy: y + h - r },
            { cx: x + w * 0.5, cy: y + h - r * 2.8 }
        ];
        ctx.fillStyle = '#6D4C30';
        ctx.fillRect(x, y + h - r * 2, w, r * 2);
        ctx.fillRect(x + w * 0.2, y + h - r * 3.8, w * 0.6, r * 2);
        ends.forEach(e => {
            ctx.fillStyle = '#D7B98E';
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(e.cx, e.cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#A1825F';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(e.cx, e.cy, r * 0.55, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.cx, e.cy, r * 0.2, 0, Math.PI * 2);
            ctx.stroke();
        });
        // Rope binding
        ctx.strokeStyle = '#C8B07A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + h - r * 1.2);
        ctx.lineTo(x + w - 2, y + h - r * 1.2);
        ctx.stroke();
        ctx.restore();
    }
}

// World 3 pallet of stacked cinder blocks
class CinderBlockPallet extends WoodenCrate {
    render(ctx) {
        ctx.save();
        const x = this.x, y = this.y, w = this.width, h = this.height;

        // Wooden pallet base
        ctx.fillStyle = '#A1887F';
        ctx.fillRect(x, y + h - 7, w, 7);
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(x + 4, y + h - 4, 6, 4);
        ctx.fillRect(x + w / 2 - 3, y + h - 4, 6, 4);
        ctx.fillRect(x + w - 10, y + h - 4, 6, 4);

        // Three rows of blocks, staggered like brickwork
        const rows = 3;
        const rowH = (h - 7) / rows;
        for (let r = 0; r < rows; r++) {
            const by = y + r * rowH;
            const offset = r % 2 === 0 ? 0 : -10;
            for (let bx = x + offset; bx < x + w; bx += 20) {
                const left = Math.max(x, bx);
                const right = Math.min(x + w, bx + 20);
                ctx.fillStyle = '#9E9E9E';
                ctx.fillRect(left, by, right - left, rowH);
                ctx.strokeStyle = '#6E6E6E';
                ctx.lineWidth = 1;
                ctx.strokeRect(left + 0.5, by + 0.5, right - left - 1, rowH - 1);
                // Hollow cores
                ctx.fillStyle = '#757575';
                if (right - left > 12) {
                    ctx.fillRect(left + 4, by + 3, 4, rowH - 6);
                    ctx.fillRect(right - 8, by + 3, 4, rowH - 6);
                }
            }
        }

        // Strap holding the stack together
        ctx.fillStyle = '#1565C0';
        ctx.fillRect(x + w / 2 - 2, y, 4, h - 7);

        ctx.restore();
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'platform';
    }
    
    render(ctx) {
        if (this.style === 'girder') {
            this.renderGirder(ctx);
            return;
        }
        if (this.style === 'rock') {
            this.renderRockLedge(ctx);
            return;
        }
        ctx.save();

        // Platform surface - concrete gray
        ctx.fillStyle = '#808080'; // Gray
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Platform border
        ctx.strokeStyle = '#555555'; // Dark gray
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Platform texture lines
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        
        // Horizontal lines every 8px
        for (let y = this.y + 8; y < this.y + this.height; y += 8) {
            ctx.beginPath();
            ctx.moveTo(this.x + 2, y);
            ctx.lineTo(this.x + this.width - 2, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // World 4 rocky ledge with a grassy, snow-dusted top
    renderRockLedge(ctx) {
        ctx.save();
        ctx.fillStyle = '#6F6A62';
        ctx.strokeStyle = '#47433D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 3);
        ctx.lineTo(this.x + this.width, this.y + 3);
        ctx.lineTo(this.x + this.width - 6, this.y + this.height);
        ctx.lineTo(this.x + 6, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#5B7F3A';
        ctx.fillRect(this.x, this.y, this.width, 5);
        ctx.fillStyle = '#F5F7FA';
        for (let sx = this.x + 6; sx < this.x + this.width - 8; sx += 22) {
            ctx.fillRect(sx, this.y, 10, 3);
        }
        ctx.restore();
    }

    // World 3 steel I-beam: orange-red flanges, darker web with rivets
    renderGirder(ctx) {
        ctx.save();
        const flange = Math.max(4, Math.round(this.height * 0.28));

        // Web
        ctx.fillStyle = '#8E3B1F';
        ctx.fillRect(this.x + 3, this.y + flange, this.width - 6, this.height - flange * 2);

        // Top and bottom flanges
        ctx.fillStyle = '#C8532B';
        ctx.fillRect(this.x, this.y, this.width, flange);
        ctx.fillRect(this.x, this.y + this.height - flange, this.width, flange);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(this.x, this.y, this.width, 1.5);

        // Rivets
        ctx.fillStyle = '#5A2412';
        for (let rx = this.x + 8; rx < this.x + this.width - 4; rx += 14) {
            ctx.beginPath();
            ctx.arc(rx, this.y + this.height / 2, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Overhead girders hang from crane cables
        if (this.y < 250) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x + 12, this.y);
            ctx.lineTo(this.x + this.width / 2, this.y - 40);
            ctx.lineTo(this.x + this.width - 12, this.y);
            ctx.moveTo(this.x + this.width / 2, this.y - 40);
            ctx.lineTo(this.x + this.width / 2, 0);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Check if something is standing on top of platform
    isOnTop(obj) {
        return obj.x + obj.width > this.x &&
               obj.x < this.x + this.width &&
               obj.y + obj.height >= this.y &&
               obj.y + obj.height <= this.y + 10; // Small tolerance
    }
}

const game = new Game();