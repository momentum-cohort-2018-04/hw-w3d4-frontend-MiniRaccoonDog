class Game {
    constructor(canvas){
        this.screen = canvas.getContext('2d')
        this.canvas = canvas
        this.gameSize = { x: 350, y: 350 };
        this.pieces= []
        this.player=new Player(this)
        this.coin=new Coin(this)
        this.trouble=new Trouble(this)
        this.counter = 0
        this.score = 0
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
        this.screen.strokeText(this.score,10,90)
        // this.screen.strokeText(this.score,380,90)
        // this.screen.strokeText(this.score,10,460)
        // this.screen.strokeText(this.score,380,460)
    }
    update(){
        this.player.update()
        
        if (colliding(this.coin.coindrop, this.player.location)){
            // console.log("IT HIT")
            this.coin.randomlocation(this.coin.coindrop, this.player.location)
            this.score+= 1
            // console.log(this.score)
        }
        for (var blip of this.trouble.troublesXRight){
            blip.y+=2
            //speed debate to be had here
            if (colliding(blip, this.player.location)){
                // console.log("BLIP HIT")
                // this.score -= 1 //lol deficit version
                this.score = 0*this.score
            }
        }
        for (var blip of this.trouble.troublesYDown){
            blip.x+=2
            if (colliding(blip, this.player.location)){
                // console.log("BLIP HIT")
                // this.score -= 1  //lol deficit version
                this.score= 0*this.score
            }
        }
        for (var blip of this.trouble.troublesXLeft){
            blip.y-=2
            if (colliding(blip, this.player.location)){
                this.score = 0*this.score
            }
        }
        for (var blip of this.trouble.troublesYUp){
            blip.x-=2
            if (colliding(blip, this.player.location)){
                this.score= 0*this.score
            }
        }
    }

    tick() {
        this.update()
        if (Math.random() < .005){
            this.trouble.maketrouble()
        }
        if (this.counter%300 == 0){
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
        this.screen.fillStyle = "#419D78"
        //2D728F 3B8EA5
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
    }
    draw() {
        this.screen.fillStyle = "#C04ABC"
        //F4BF4B
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
}
class Trouble {
    constructor(game){
        this.coin=new Coin(this)
        this.game=game
        this.troublesXRight=[]
        this.troublesXLeft=[]
        this.troublesYDown=[]
        this.troublesYUp=[]
    }
    parseTrouble(troublearray){
        for (var blip of troublearray){
            this.game.screen.fillStyle = "#000"
            var size=blip.size
            var leftX=blip.x
            var leftY=blip.y
            this.game.screen.fillRect(leftX,leftY,size,size)
        }
    }
    draw() {
        this.parseTrouble(this.troublesXRight)
        this.parseTrouble(this.troublesYDown)
        this.parseTrouble(this.troublesXLeft)
        this.parseTrouble(this.troublesYUp)
    }
    maketrouble(){
        function getRandomInt() {
            return Math.floor(Math.random() * (305 - 155)) + 155;
        }
        var randoNum = Math.random()
        if (randoNum > .75) {
            this.troublesXRight.push({x:getRandomInt(),y:10,size:20})
        }else if (randoNum < .25) {
            this.troublesYDown.push({x:10,y:getRandomInt(),size:20})
        }else if ((randoNum > .5) && (randoNum > .25)) {
            this.troublesXLeft.push({x:getRandomInt(),y:490,size:20})
        }else {
            this.troublesYUp.push({x:490,y:getRandomInt(),size:20})
        }

        this.troublesXRight.filter(function(unit) {
            return !(unit.x > 350)
        })
        this.troublesYDown.filter(function(unit) {
            return !(unit.y > 350)
        })
        this.troublesXLeft.filter(function(unit) {
            return !(unit.x < 350)
        })
        this.troublesYUp.filter(function(unit) {
            return !(unit.y < 350)
        })      
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
