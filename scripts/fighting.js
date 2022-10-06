const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7




class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 1024
        this.height = 576
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 20
        this.offset = offset
    }


    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {

            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ position,
        velocity,
        color = 'blue',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        framehold = 15

    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15 
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc

        }
    }

    update() {
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 112) {
            this.velocity.y = 0
            this.position.y = 314
        } else this.velocity.y += gravity


    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 15 
                }

                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 10 
                }

                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 10
                }
                break;
        }
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '.././images/fighting-game/fighting-background.png'
})

const shop = new Sprite({
    position: {
        x: 550,
        y: 106
    },
    imageSrc: '.././images/fighting-game/shop_anim.png',
    scale: 2.8,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: '.././images/fighting-game/hero-Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 110,
        y: 152
    },
    
    sprites: {
        idle: {
            imageSrc: '.././images/fighting-game/hero-Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: '.././images/fighting-game/hero-run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '.././images/fighting-game/hero-Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '.././images/fighting-game/hero-Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '.././images/fighting-game/hero-attack1.png',
            framesMax: 6
        }
    }
})


const enemy = new Fighter({
    position: {
        x: 900,
        y: 300
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: '.././images/fighting-game/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 110,
        y: 152
    },
    sprites: {
        idle: {
            imageSrc: '.././images/fighting-game/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: '.././images/fighting-game/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '.././images/fighting-game/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '.././images/fighting-game/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '.././images/fighting-game/Attack1.png',
            framesMax: 6
        }
    }
})



console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangular1, rectangular2 }) {
    return (
        rectangular1.attackBox.position.x + rectangular1.attackBox.width >=
        rectangular2.position.x &&
        rectangular1.attackBox.position.x <=
        rectangular2.position.x + rectangular2.width &&
        rectangular1.attackBox.position.y + rectangular1.attackBox.height >=
        rectangular2.position.y &&
        rectangular1.attackBox.position.y <=
        rectangular2.position.y + rectangular2.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#winner').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#winner').innerHTML = 'Tie'

    } else if (player.health > enemy.health) {
        document.querySelector('#winner').innerHTML = 'Player 1 wins'
        document.querySelector('#winner').style.color = 'blue'
    } else if (enemy.health > player.health) {
        document.querySelector('#winner').innerHTML = 'Player 2 wins'
        document.querySelector('#winner').style.color = 'red'
    }
}

let timer = 60
let timerId
function decreaseTimer() {

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {

        determineWinner({ player, enemy })
    }
}
decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player 1 movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }


    //jumping

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //player 2 movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }


    //jumping

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detecht collision & enemy gets hit
    if (
        rectangularCollision({
            rectangular1: player,
            rectangular2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyCurrentHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangular1: enemy,
            rectangular2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerCurrentHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })

    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //Player 1
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        //player 2
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    // player 1
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // player 2
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})