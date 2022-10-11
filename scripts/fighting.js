const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7



class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
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
            this.image.height * this.scale
        )
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
    constructor({
        position,
        velocity,
        color = 'blue',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { position: this.position.x,
            y: this.position.y, offset: {}, width: 100, height: 50 }
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc

        }

        
    }

    
    
    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        // this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //draw attack box rectangle 
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

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
        }, 1000)
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }


    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }


        // overridning all other animations with the atatck animation
        if (this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1)
            return

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 15
                }
                break

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 10
                }
                break

            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                    this.framesHold = 10
                }
                break

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}


function rectangularCollision({rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
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
            framesMax: 8
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
        },
        takeHit: {
            imageSrc: '.././images/fighting-game/hero-take-hit-white.png',
            framesMax: 4
        },
        death: {
            imageSrc: '.././images/fighting-game/hero-death.png',
            framesMax: 6
        }
    },

    attackBox: {
        offset: {
            x: 200,
            y: 60
        },
        width: 165,
        height: 50

    }
})


const enemy = new Fighter({
    position: {
        x: 800,
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
        },
        takeHit: {
            imageSrc: '.././images/fighting-game/take-hit-white.png',
            framesMax: 4
        },
        death: {
            imageSrc: '.././images/fighting-game/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -100,
            y: 60
        },
        width: 165,
        height: 50

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
            rectangel1: player,
            rectangel2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })

        // enemy.health -= 7
        // document.querySelector('#enemyCurrentHealth').style.width = enemy.health + '%'
    }
    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (
        rectangularCollision({
            rectangel1: enemy,
            rectangel2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 4
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#player.health', {
            width: player.health + '%'
        })

        // player.health -= 5
        // document.querySelector('#playerCurrentHealth').style.width = player.health + '%'
    }

    //if player 2 misses
    if (enemy.isAttacking && enemy.framesCurrent === 4) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })

    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
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
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
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
                enemy.attack()
                break
        }
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