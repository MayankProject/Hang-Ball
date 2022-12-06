let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')
let ballRadius = 15;
let velocity = {
    x: 0,
    y: 0,
}
let gravity = 1/5
let ballColor = 'black'
let ballInitialPosition = {x: 100, y: 300}
let lossVelocity = 1/10
let maxVelocity = 15

canvas.height = innerHeight
canvas.width = innerWidth

class PLayer{
    constructor(){
        this.color = ballColor
        this.position = ballInitialPosition
        this.radius = ballRadius
        this.velocity = velocity
        this.lossVelocity = lossVelocity
        this.gravity = gravity
        this.grabbed = false
        this.grabbedPosition = {};
        this.grabbedDistance = false;
    }
    draw() {
        c.beginPath()
        c.fillStyle = ballColor
        c.arc(this.position['x'], this.position['y'], this.radius, 0, Math.PI*2, false)
        c.fill()  
        if (this.grabbed) {
            c.beginPath();
            c.moveTo(this.position['x'], this.position['y'])
            c.lineTo(this.grabbedPosition['x'], this.grabbedPosition['y'])
            c.strokeStyle = 'red'  
            c.stroke()
        }
    }
    distanceFromPlayer(client_x, client_y){
        let {x, y} = this.position
        return Math.sqrt((y-client_y)**2 + (x-client_x)**2)
    }
    update(){
        this.position = {
            x: this.velocity['x']+this.position['x'],
            y: this.velocity['y']+this.position['y']
        }
        if (this.position['y']+this.radius<innerHeight) {
            this.velocity['y']+=this.gravity
        }
        if (this.velocity['x']) {
            // this.velocity['x']=this.gravity
        }
        if (this.position['y']+this.radius>=innerHeight || this.position['y']-this.radius<=0) {
            this.velocity['y'] = -this.velocity['y']+this.velocity['y']*this.lossVelocity
            if (this.position['y']-this.radius<=0) {
                this.velocity['y']+=0.5
            }
            if (this.position['y']+this.radius>=innerHeight) {
                this.velocity['y']-=0.5
            }
        }
        if (this.position['x']+this.radius>=innerWidth || this.position['x']-this.radius<=0) {
            this.velocity['x'] = -this.velocity['x']+this.velocity['x']*this.lossVelocity*2
            if (this.position['x']-this.radius<=0 && this.velocity['x']>-5 && this.velocity['x']<5) {
                this.velocity['x']+=1
            }
            if (this.position['x']+this.radius>=innerWidth && this.velocity['x']>-5 && this.velocity['x']<5) {
                this.velocity['x']-=1
            }
        }
        if (!this.grabbed && this.grabbedDistance>0) {
            let throwSpeed = this.grabbedDistance
            let overspeed;
            this.grabbedDistance = false
            if ((throwSpeed + Math.sqrt(velocity['x']**2 +velocity['y']**2))>maxVelocity) {
                throwSpeed = maxVelocity
                overspeed=true;
            }
            let angle = Math.atan2((this.grabbedPosition['y']-this.position['y']), (this.grabbedPosition['x']-this.position['x']))
            let xSpeed = Math.cos(angle)*throwSpeed
            let ySpeed = Math.sin(angle)*throwSpeed
            if (overspeed) {
                this.velocity = {x: xSpeed, y:ySpeed}            
            }
            else{
                this.velocity = {x: xSpeed+this.velocity['x'], y:ySpeed+this.velocity['y']}            
            }
            
        }
        this.draw()

    }
}

let player = new PLayer()

function engine(){
    player.update()
}
function main(ctime){
    c.clearRect(0, 0, innerWidth, innerHeight)
    engine()
    requestAnimationFrame(main)
}

addEventListener('mousedown', (e)=>{
    let position = {x: e.clientX, y: e.clientY}
    let distanceFromPlayer = player.distanceFromPlayer(position['x'], position['y'])
    if (distanceFromPlayer<200) {
        document.querySelector('body').style.cursor = 'grabbing'
        player.grabbed = true
        player.grabbedPosition = position
        player.grabbedDistance = distanceFromPlayer
    }
})
addEventListener('mousemove', (e)=>{
    let position = {x: e.clientX, y: e.clientY}
    let distanceFromPlayer = player.distanceFromPlayer(position['x'], position['y'])
    if (player.grabbed) {
        player.grabbedPosition = position
        player.grabbedDistance = distanceFromPlayer
    }
})
addEventListener('mouseup', ()=>{
    document.querySelector('body').style.cursor = 'grab'
    player.grabbed = false
    // player.grabbedDistance = false
})
requestAnimationFrame(main)