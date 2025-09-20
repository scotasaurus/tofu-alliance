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
        this.assetsToLoad = 10;
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
        this.sandbags = [];
        this.platforms = [];
        this.barbedWire = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnDelay = 3000;
        this.lastPowerupSpawn = 0;
        this.powerupSpawnDelay = 12000; // Spawn heart powerups every 12 seconds
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
                ]
            }
        };
    }
    
    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.currentLevelData = this.levelData[levelNumber];
        this.levelSpawnIndex = 0;
        this.levelComplete = false;
        
        if (!this.currentLevelData) {
            // No more levels - victory!
            this.stopGameplayMusic();
            this.stopBossMusic();
            this.gameState = 'victory';
            return;
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
        
        // Spawn sandbags for this level
        if (this.currentLevelData.sandbags) {
            for (const sandbagData of this.currentLevelData.sandbags) {
                this.sandbags.push(new Sandbag(sandbagData.x, sandbagData.y));
            }
        }
        
        // Spawn platforms for this level
        if (this.currentLevelData.platforms) {
            for (const platformData of this.currentLevelData.platforms) {
                this.platforms.push(new Platform(platformData.x, platformData.y, platformData.width, platformData.height));
            }
        }
        
        // Spawn barbed wire for this level
        if (this.currentLevelData.barbedWire) {
            for (const wireData of this.currentLevelData.barbedWire) {
                this.barbedWire.push(new BarbedWire(wireData.x, wireData.y, wireData.width));
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
                if (enemy.type === 4 && !this.bossCutsceneActive) {
                    this.triggerBossCutscene();
                    return; // Don't spawn the boss yet, wait for cutscene to finish
                }
                
                // Spawn this enemy
                console.log('Spawning enemy type', enemy.type, 'at', enemy.x, enemy.y);
                this.enemies.push(new Enemy(enemy.x, enemy.y, enemy.type, this.assets));
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
                    this.startStory();
                    e.preventDefault();
                } else if (e.key === 'l' || e.key === 'L') {
                    // Stop music before entering level builder
                    this.stopTitleMusic();
                    this.gameState = 'levelBuilder';
                    this.initializeLevelBuilder();
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
            
            // Regular click - start story
            this.unlockAudio().then(() => {
                this.startStory();
            }).catch(() => {
                this.startStory(); // Start anyway if audio fails
            });
        } else if (this.gameState === 'story') {
            this.nextStorySlide();
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
                this.stopBossMusic();
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
                continue;
            }
            
            // Check bullet-sandbag collisions
            for (let j = 0; j < this.sandbags.length; j++) {
                if (this.sandbags[j].collidesWith(this.bullets[i])) {
                    this.bullets.splice(i, 1);
                    break; // Exit sandbag loop since bullet is destroyed
                }
            }
        }
        
        // Update level-based spawning instead of random spawning
        this.updateLevelSpawning();
        
        // Spawn powerups (only spawn if no powerups currently exist)
        const currentTime = Date.now();
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
            
        }
        
        // Boss music management - only during gameplay
        if (this.gameState === 'playing') {
            const bossPresent = this.enemies.some(enemy => enemy.type === 4);
            if (bossPresent && !this.bossActive) {
                this.startBossMusic();
            } else if (!bossPresent && this.bossActive) {
                this.stopBossMusic();
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
                bulletRange > maxRange) {
                this.enemyBullets.splice(i, 1);
                continue;
            }
            
            // Check enemy bullet-sandbag collisions
            for (let j = 0; j < this.sandbags.length; j++) {
                if (this.sandbags[j].collidesWith(this.enemyBullets[i])) {
                    this.enemyBullets.splice(i, 1);
                    break; // Exit sandbag loop since bullet is destroyed
                }
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
                        
                        // Dramatic boss explosion and victory music
                        if (enemy.type === 4) {
                            this.playBossExplosion();
                            this.playVictoryMusic();
                            // Create massive boss explosion
                            this.explosions.push(new BossExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2));
                            // Stop boss music
                            this.stopBossMusic();
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
        
        // Reset to level 1
        this.currentLevel = 1;
        this.wonGame = false;
        
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
        this.lastEnemySpawn = 0;
        this.lastPowerupSpawn = 0;
        this.camera = { x: 0, y: 0 };
        
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
            this.startGame();
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
        bassGain.connect(this.audioContext.destination);
        
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
        discordGain.connect(this.audioContext.destination);
        
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
        pulseGain.connect(this.audioContext.destination);
        
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
            echoGain.connect(this.audioContext.destination);
            
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
            gain.connect(this.audioContext.destination);
            
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
        masterGain.connect(this.audioContext.destination);
        
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
        this.storyMusicPlaying = false;
        this.currentStoryMusicType = null;
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
            gain.connect(this.audioContext.destination);
            
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
            gain.connect(this.audioContext.destination);
            
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
        const bossPresent = this.enemies.some(enemy => enemy.type === 4);
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
        
        if (this.gameState === 'story') {
            if (!this.storyMusicPlaying && this.audioUnlocked) {
                console.log('RENDER LOOP: Starting story music for slide', this.currentStorySlide);
                this.startStoryMusic(this.currentStorySlide);
            }
            this.renderStoryScreen();
            return;
        }
        
        if (this.gameState === 'bossCutscene') {
            // Same music handling as story mode
            if (!this.storyMusicPlaying && this.audioUnlocked) {
                console.log('BOSS CUTSCENE RENDER LOOP: Starting music like story mode');
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
        
        // Render barbed wire
        this.barbedWire.forEach(wire => wire.render(this.ctx));
        
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
        this.renderLevelProgress();
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
        const bosses = this.enemies.filter(enemy => enemy.type === 4 && enemy.health > 0);
        
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
        const bossTitle = 'BOSS TANK';
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
            
            // Level builder access
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.fillText('Press L for Level Builder', this.canvas.width / 2, 360);
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
    
    triggerBossCutscene() {
        // ONLY stop gameplay and boss music
        this.stopGameplayMusic();
        this.stopBossMusic();
        
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
        this.player.render(this.ctx);
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.powerups.forEach(powerup => powerup.render(this.ctx));
        this.sandbags.forEach(sandbag => sandbag.render(this.ctx));
        this.platforms.forEach(platform => platform.render(this.ctx));
        this.barbedWire.forEach(wire => wire.render(this.ctx));
        this.mines.forEach(mine => mine.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.tankRemnants.forEach(remnant => remnant.render(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.ctx.restore();
        
        // Render UI (hearts and score) - not affected by camera
        this.renderUI();
        this.renderScore();
        this.renderLevelProgress();
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
        
        let currentDialogueTime = 0;
        if (dialogueTime < 360) {
            dialogue = "BEHOLD MY ULTIMATE CREATION!\nThis massive war machine will\ncrush you like the pathetic\ntofu you are! MWAHAHAHA!";
            speaker = "POPCORN";
            currentDialogueTime = dialogueTime;
        } else if (dialogueTime < 720) {
            dialogue = "You think your little\npea-shooter can stop\nTHIS monstrosity?\nPrepare for DOOM!";
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
        const bossData = this.currentLevelData.enemies.find(e => e.type === 4);
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
        this.ctx.fillText(`Level ${completedLevel} Complete`, this.canvas.width / 2, 160);
        
        // Show next level info or final victory
        if (this.levelData[this.nextLevel]) {
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`Next: ${this.levelData[this.nextLevel].name}`, this.canvas.width / 2, 200);
            
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
        if (this.levelData[this.nextLevel]) {
            // Go to next level
            this.startLevel(this.nextLevel);
            this.gameState = 'playing';
        } else {
            // All levels complete - check for high score first
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width - 200, 10, 190, 80);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`Level ${this.currentLevel}`, this.canvas.width - 190, 30);
        
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
        this.lastEnemySpawn = 0;
        this.lastPowerupSpawn = 0;
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
        this.type = type; // 0 = soldier1, 1 = soldier2, 2 = tank, 3 = sniper, 4 = boss1
        this.assets = assets;
        
        if (type === 4) { // boss1 - powerful tank boss, 25% bigger
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
        } else { // boss1
            this.groundY = 150; // Boss tank higher on ground
        }
        this.velocityY = 0;
        this.gravity = 0.5;
        this.onGround = false;
        this.animationFrame = Math.random() * Math.PI * 2;
        this.animationSpeed = 0.1;
        
        // Sound properties
        this.lastEngineSound = 0;
        this.engineSound = (type === 2 || type === 4); // Tanks and boss1 make engine sounds
        
        // Health system
        if (type === 4) { // boss1 - already set above but make sure
            if (!this.maxHealth) {
                this.health = 50;
                this.maxHealth = 50;
            } else {
                this.health = this.maxHealth;
            }
        } else if (type === 2) { // tank
            this.health = 3;
            this.maxHealth = 3;
        } else if (type === 3) { // sniper - tougher than regular soldiers
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
        } else { // boss1
            this.pointValue = 1000;
        }
    }
    
    update(player, enemyBullets, game) {
        const distanceToPlayer = Math.abs(player.x - this.x);
        
        if (this.type === 4) { // Boss1 AI - aggressive tank with machine gun
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
        
        if (this.type === 4) { // Boss1 - machine gun bursts
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
    
    shoot(player, enemyBullets, game, specialShoot = false) {
        const bulletX = this.x;
        const bulletY = this.y + this.height * 0.5;
        
        // Determine bullet type and properties
        let bulletType = 'normal';
        if (this.type === 4) { // Boss1
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
            // Boss1 needs special handling - reverse the normal flipping
            const shouldFlip = this.type === 4 ? !this.facingLeft : this.facingLeft;
            
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
            
            if (this.facingLeft) {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
            }
            
            ctx.restore();
            
            // Draw health indicator for damaged enemies
            if (this.health < this.maxHealth) {
                this.renderHealthBar(ctx);
            }
        }
    }
    
    renderHealthBar(ctx) {
        const isBoss = this.type === 4;
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
    }
    
    render(ctx) {
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

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'platform';
    }
    
    render(ctx) {
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
    
    // Check if something is standing on top of platform
    isOnTop(obj) {
        return obj.x + obj.width > this.x &&
               obj.x < this.x + this.width &&
               obj.y + obj.height >= this.y &&
               obj.y + obj.height <= this.y + 10; // Small tolerance
    }
}

const game = new Game();