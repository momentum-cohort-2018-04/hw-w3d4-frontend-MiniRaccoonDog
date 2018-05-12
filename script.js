class Game {
    constructor(canvas){
        this.screen = canvas.getContext('2d')
        this.canvas = canvas
        this.gameSize = { x: 350, y: 350 };
        this.pieces= []
        this.player=new Player(this)
        // console.log(this.player)
        this.coin=new Coin(this)
        this.trouble=new Trouble(this)
        this.counter = 0
    }
    draw() {
        this.screen.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.screen.strokeStyle = "#000000"
        this.screen.lineWidth = 10
        this.screen.strokeRect(150,150,200,200)
        this.player.draw()
        this.coin.draw()
        this.trouble.draw()
        this.screen.font = "100px Arial";
        this.screen.strokeText(this.coin.score,10,90)
    }
    update(){
        this.player.update()
        this.coin.update(this.player.location)
        this.trouble.update(this.player.location)
    }
    tick() {
        this.update()
        if (Math.random() < .005){
            this.trouble.maketrouble()
        }
        if (this.counter%60 == 0){
            this.trouble.maketrouble()
        }
        this.draw()
        this.counter+=1
        requestAnimationFrame(this.tick.bind(this))
    }
} 

class Player {
    constructor (game) {
        this.game = game
        this.screen=game.screen
        this.canvas=game.canvas
        this.keyboarder=new Keyboarder()
        this.location= {x:230,y:230,size:40}
    }
    draw() {
        this.screen.fillStyle = "#FF00FF"
        var size=this.location.size
        var leftX=this.location.x
        var leftY=this.location.y
        this.screen.fillRect(leftX,leftY,size,size)
    }
    update() {
        if (this.keyboarder.isDown(Keyboarder.KEYS.LEFT)&& this.location.x>155){
            this.location.x -= 5;
        }else if (this.keyboarder.isDown(Keyboarder.KEYS.RIGHT) && this.location.x<305){
            this.location.x += 5;
        }else if (this.keyboarder.isDown(Keyboarder.KEYS.UP) && this.location.y>155){
            this.location.y -= 5;
        }else if (this.keyboarder.isDown(Keyboarder.KEYS.DOWN) && this.location.y<305){
            this.location.y += 5;
        }else{
            return
        }
    }
}
class Keyboarder {
    constructor () {
    this.keyState = {}
    
    window.addEventListener('keydown', function(e) {
        this.keyState[e.keyCode] = true
    }.bind(this))

    window.addEventListener('keyup', function(e) {
        this.keyState[e.keyCode] = false
    }.bind(this))
    }
    
    isDown (keyCode) {
    return this.keyState[keyCode] === true
    }
    
    on (keyCode, callback) {
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === keyCode) {
        callback()
        }
    })
    }                      
}
Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }

class Coin {
    constructor (game) {
        this.game = game
        this.screen=this.game.screen
        this.canvas=this.game.canvas
        this.coindrop={x:230,y:300,size:20}
        this.score=0
    }
    draw() {
        this.screen.fillStyle = "#F0000F"
        var size=this.coindrop.size
        var leftX=this.coindrop.x
        var leftY=this.coindrop.y
        this.screen.fillRect(leftX,leftY,size,size)
    }
    randomlocation(coindrop, playerlocate) {
        var array = []
        for (var i = 155; i < 325 ; i++){
            array.push(i)
        }
        var arrayX= array.slice(0)
        var arrayY= array.slice(0)

        var invalidX = []
        var invalidY = []

        for (var i = coindrop.x; i < (coindrop.x+coindrop.size) ; i++){
            invalidX.push(i)
        }
        for (var i = playerlocate.x; i < (playerlocate.x+playerlocate.size) ; i++){
            invalidX.push(i)
        }

        for (var i = coindrop.y; i < (coindrop.y+coindrop.size) ; i++){
            invalidY.push(i)
        }
        for (var i = playerlocate.y; i < (playerlocate.y+playerlocate.size) ; i++){
            invalidY.push(i)
        }

        var finalX = arrayX.filter(function(num) {
            return !(invalidX.indexOf(num) !== -1)
        })
        var finalY = arrayY.filter(function(num) {
            return !(invalidY.indexOf(num) !== -1)
        })

        function getRandomArbitrary(array) {
            var randomindex =  Math.floor(Math.random() * array.length)
            return array[randomindex]
        }
        this.coindrop.x = getRandomArbitrary(finalX)
        this.coindrop.y = getRandomArbitrary(finalY)
    }
    update(playerlocate) {
        if (colliding(this.coindrop, playerlocate)){
            console.log("IT HIT")
            this.randomlocation(this.coindrop, playerlocate)
            this.score+= 1
            console.log(this.score)
        }
        // console.log("no collision")
    }
}
class Trouble {
    constructor(game){
        this.coin=new Coin(this)
        this.game=game
        this.troublesX=[]
        this.troublesY=[]
    }
    draw() {
        for (var blip of this.troublesX){
            this.game.screen.fillStyle = "#000"
            var size=blip.size
            var leftX=blip.x
            var leftY=blip.y
            this.game.screen.fillRect(leftX,leftY,size,size)
        }
        for (var blip of this.troublesY){
            this.game.screen.fillStyle = "#000"
            var size=blip.size
            var leftX=blip.x
            var leftY=blip.y
            this.game.screen.fillRect(leftX,leftY,size,size)
        }
    }
    maketrouble(v){
        function getRandomInt() {
            return Math.floor(Math.random() * (305 - 155)) + 155; //The maximum is exclusive and the minimum is inclusive
        }
        // this.troublesX.push({x:getRandomInt(),y:10,size:20})
        // this.troublesY.push({x:10,y:getRandomInt(),size:20})
        if (Math.random() > .5) {
            this.troublesX.push({x:getRandomInt(),y:10,size:20})
        }else {this.troublesY.push({x:10,y:getRandomInt(),size:20})}

        this.troublesX.filter(function(unit) {
            return !(unit.x > 350)
        })
        this.troublesY.filter(function(unit) {
            return !(unit.y > 350)
        }) 
            
    }
    update(playerlocate){
        for (var blip of this.troublesX){
            blip.y+=3
            if (colliding(blip, playerlocate)){
                console.log("BLIP HIT")
                this.coin.score = 0
                console.log(this.coin.score)
            }
        }

        for (var blip of this.troublesY){
            blip.x+=3
            if (colliding(blip, playerlocate)){
                console.log("BLIP HIT")
                this.coin.score=0
                console.log(this.coin.score)
            }
        }
    }
}
//OG code again but i change less
var colliding = function(b1, b2) {
    var b1centerX= b1.x+(b1.size/2)
    var b1centerY= b1.y+(b1.size/2)

    var b2centerX= b2.x+(b2.size/2)
    var b2centerY= b2.y+(b2.size/2)

    return !( b1 === b2 ||
        b1centerX + b1.size / 2 < b2centerX - b2.size / 2 ||
        b1centerY + b1.size / 2 < b2centerY - b2.size / 2 ||
        b1centerX - b1.size / 2 > b2centerX + b2.size / 2 ||
        b1centerY - b1.size / 2 > b2centerY + b2.size / 2
    );
};

window.addEventListener('load', function() {
    var setup=new Game(document.getElementById("gameCanvas"))
    setup.tick()
});

//Add hazards to the game. 
//flying squares that come from a random edge of the canvas
    //and travel to the opposite edge. 
    //They should cross through the outer rectangle that encloses the player. 
    //If the player and a hazard collide, reset the score.
