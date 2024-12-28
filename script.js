const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120; // 留出控制按钮的空间
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏对象
const game = {
    player: {
        x: 50,
        y: 0,
        width: 40,
        height: 40,
        speedX: 0,
        speedY: 0,
        gravity: 0.5,
        jumpPower: -12,
        isJumping: false
    },
    
    platforms: [],
    
    // 初始化平台
    initPlatforms() {
        // 地面
        this.platforms.push({
            x: 0,
            y: canvas.height - 40,
            width: canvas.width,
            height: 40
        });
        
        // 添加一些跳跃平台
        const platformPositions = [
            { x: 300, y: canvas.height - 120 },
            { x: 500, y: canvas.height - 200 },
            { x: 200, y: canvas.height - 280 }
        ];
        
        platformPositions.forEach(pos => {
            this.platforms.push({
                x: pos.x,
                y: pos.y,
                width: 100,
                height: 20
            });
        });
    },
    
    // 检查碰撞
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    // 更新游戏状态
    update() {
        // 应用重力
        this.player.speedY += this.player.gravity;
        
        // 更新位置
        this.player.x += this.player.speedX;
        this.player.y += this.player.speedY;
        
        // 检查平台碰撞
        this.player.isJumping = true;
        
        this.platforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                if (this.player.speedY > 0) {
                    this.player.isJumping = false;
                    this.player.speedY = 0;
                    this.player.y = platform.y - this.player.height;
                }
            }
        });
        
        // 边界检查
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > canvas.width) {
            this.player.x = canvas.width - this.player.width;
        }
    },
    
    // 绘制游戏画面
    draw() {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制玩家
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
        
        // 绘制平台
        ctx.fillStyle = 'green';
        this.platforms.forEach(platform => {
            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        });
    }
};

// 控制器
const controls = {
    init() {
        // 移动端控制
        document.getElementById('leftBtn').addEventListener('touchstart', () => {
            game.player.speedX = -5;
        });
        
        document.getElementById('rightBtn').addEventListener('touchstart', () => {
            game.player.speedX = 5;
        });
        
        document.getElementById('jumpBtn').addEventListener('touchstart', () => {
            if (!game.player.isJumping) {
                game.player.speedY = game.player.jumpPower;
            }
        });
        
        ['leftBtn', 'rightBtn'].forEach(id => {
            document.getElementById(id).addEventListener('touchend', () => {
                game.player.speedX = 0;
            });
        });
        
        // PC端控制
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    game.player.speedX = -5;
                    break;
                case 'ArrowRight':
                    game.player.speedX = 5;
                    break;
                case ' ':
                case 'ArrowUp':
                    if (!game.player.isJumping) {
                        game.player.speedY = game.player.jumpPower;
                    }
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                game.player.speedX = 0;
            }
        });
    }
};

// 初始化游戏
function init() {
    game.initPlatforms();
    controls.init();
    
    // 设置玩家初始位置
    game.player.y = canvas.height - game.player.height - 40;
}

// 游戏循环
function gameLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
}

// 启动游戏
init();
gameLoop();

// 防止移动端滚动和缩放
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault()); 