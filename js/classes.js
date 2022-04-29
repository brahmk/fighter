class Sprite {
    constructor({position,imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}})
    { 
        this.position = position;  
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frames = frames
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6
        this.offset = offset
     }

    draw(){
        c.drawImage(
             this.image,
             //crop coordinates
            this.framesCurrent * (this.image.width / this.frames),
            0,
            this.image.width / this.frames, //6 frames  wide png
            this.image.height,


             this.position.x - this.offset.x,
             this.position.y - this.offset.y,
             (this.image.width / this.frames) * this.scale,
             this.image.height * this.scale)
    } 

    animateFrames(){
        this.framesElapsed++ //add 1 to frames elapsed

    if (this.framesElapsed % this.framesHold === 0){ //if end of frames is re
     if (this.framesCurrent < this.frames - 1) {this.framesCurrent++
    } else {
        this.framesCurrent = 0;
    } }
    }
    update() 
    {  
    this.draw() 
  this.animateFrames()
}}


class Fighter extends Sprite {
            constructor({position,
                 velocity,
                  color,
                   
                    imageSrc, 
                scale = 1,
                 frames = 1,
                 offset = {x:0,y:0},
                 sprites,
                attackBox = {offset: {}, width: undefined, height: undefined}})
                 { //argument ((position) and (velocity) taken from fighter  x and y)
                
            super({
                    imageSrc,
                    scale,frames,position,offset
                })
               
                this.velocity = velocity;
                this.height = 150
                this.width = 50
                this.lastKey
                this.isAttacking
                this.health = 100
                this.framesCurrent = 0
                this.framesElapsed = 0
                this.framesHold = 6 // speed of animation loop
                this.dead = false
        
                this.sprites = sprites 
                for (const sprite in sprites){
                    sprites[sprite].image = new Image()
                    sprites[sprite].image.src = sprites[sprite].imageSrc
                }

                
                this.attackBox = {
                    position: {
                        x: this.position.x,
                        y: this.position.y}
                    ,offset: attackBox.offset
                    ,width: attackBox.width
                    ,height: attackBox.height
                } }
        
                
            
        
         
        
        
        
        
            update() {  //submethod to move sprites
            this.draw() // calls draw sub so only need to do player.update and will .draw automatically
            if (!this.dead) this.animateFrames()

            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y

            //draw attack box (broken)
            c.fillRect(
                this.attackBox.position.x,
                 this.attackBox.position.y,
                  this.attackBox.width,
                   this.attackBox.y,)      
                     

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y // adds velocity to position for movement
            if (this.position.y + this.height + this.velocity.y >=canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330 //
            } else this.velocity.y += gravity
                }
        
            attack() {
                this.switchSprite('attack1')
            this.isAttacking = true;
            
        
            }

            takeHit(){
                this.health -=20
                

                if (this.health <=0){
                    this.switchSprite('death')
                } else this.switchSprite('hit')
            }
            switchSprite(sprite){

                //overrides other animations so attack/death/hit can finish
                if (this.image === this.sprites.death.image){
                    if (this.framesCurrent === this.sprites.death.frames - 1)
                     this.dead = true
                return } 
                
               if (this.image == this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.frames - 1) return
               if (this.image == this.sprites.hit.image && this.framesCurrent < this.sprites.hit.frames - 1) return
               
               
               switch(sprite){
                    case 'idle': 
                    if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.frames = this.sprites.idle.frames
                this.framesCurrent = 0 }
                    break

                    case 'run': 
                    if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.frames = this.sprites.run.frames
                    this.framesCurrent = 0 }
                    break
                    
                    case 'jump': 
                    if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.frames = this.sprites.jump.frames
                    this.framesCurrent = 0}

                    case 'fall': 
                    if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.frames = this.sprites.fall.frames
                    this.framesCurrent = 0}
                    break

                    case 'attack1': 
                    if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.frames = this.sprites.attack1.frames
                    this.framesCurrent = 0}
                    break

                    case 'hit': 
                    if (this.image !== this.sprites.hit.image){
                    this.image = this.sprites.hit.image
                    this.frames = this.sprites.hit.frames
                    this.framesCurrent = 0}
                    break

                    case 'death': 
                    if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.frames = this.sprites.death.frames
                    this.framesCurrent = 0}
                    break
                }
            }
                }
