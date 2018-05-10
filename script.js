class Game {
    constructor(canvas){
        this.screen = canvas.getContext('2d')
        this.canvas = canvas
        this.gameSize = { x: 350, y: 350 };
        this.pieces= []
        this.player=new Player (this)
        console.log(this.player)
        this.coin=new Coin (this)
    }
    draw() {
        this.screen.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.screen.strokeStyle = "#000000"
        this.screen.lineWidth = 10
        this.screen.strokeRect(150,150,200,200)
        this.player.draw()
        this.coin.draw()
    }
    update(){
        this.player.update()
    }
    tick() {
        this.update()
        this.draw()
        requestAnimationFrame(this.tick.bind(this))
    }
} 

class Player {
    constructor (game) {
        this.game = game
        this.screen=game.screen
        this.canvas=game.canvas
        this.keyboarder=new Keyboarder()
        console.log(this.keyboarder)
        this.location= {x:230,y:230}
    }
    draw() {
        this.screen.fillStyle = "#FF00FF"
        var size= 40
        var leftX=this.location.x
        var leftY=this.location.y
        this.screen.fillRect(leftX,leftY,size,size)
    }
    update() {
        if (this.keyboarder.isDown(37)&& this.location.x>150){
            //move left
            this.location.x -= 3;
        }else if (this.keyboarder.isDown(39) && this.location.x<310){
            //move right
            this.location.x += 3;
        }else if (this.keyboarder.isDown(38) && this.location.y>150){
            //move up
            this.location.y -= 3;
        }else if (this.keyboarder.isDown(40) && this.location.y<310){
            //move down
            this.location.y += 3;
        // }else if (this.keyboarder.isDown(83)){
        //     //S press
        //     console.log("i dunno what 's' does yet")
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
        this.coindrop= {x:300,y:200}
    }
    draw() {
        this.screen.fillStyle = "#F0000F"
        var size= 20
        var leftX=this.coindrop.x
        var leftY=this.coindrop.y
        this.screen.fillRect(leftX,leftY,size,size)
    }
    
}

// }
window.addEventListener('load', function() {
    var setup=new Game(document.getElementById("gameCanvas"))
    setup.tick()
    // var players=new Player(setup)
    // players.draw()

  });


// Create a Player class
//  a method draw that draws a 40x40 square in the middle of the canvas.
// The Game class's draw method should call the Player class's draw method.

// Add movement to the player's rectangle. Create a Keyboarder class.
  //You can use the one from Cook's annotated Space Invaders
  //Use your keyboarder to make the player's rectangle move
  //you will need to add an update method to the Game class
  // and an update method to the Player class.
// The rectangle should not be allowed to move outside the containing hollow rectangle.

//Add a coin for the player to gather to the game. 
//This coin should appear in a random position that is not the player's current position
//When the player collects it, it should disappear and reappear elsewhere.

//Add a score to the game. The score should go up by one every time the coin is collected.
    //To do this, you will likely want to create a Coin class.

//Add hazards to the game. 
//flying squares that come from a random edge of the canvas
    //and travel to the opposite edge. 
    //They should cross through the outer rectangle that encloses the player. 
    //If the player and a hazard collide, reset the score.


/*
var Keyboarder = function() {
    // Records up/down state of each key that has ever been pressed.
    var keyState = {};
    // When key goes down, record that it is down.
    window.addEventListener('keydown', function(e) {
        keyState[e.keyCode] = true;
    });
    // When key goes up, record that it is up.
    window.addEventListener('keyup', function(e) {
        keyState[e.keyCode] = false;
    });
    // Returns true if passed key is currently down. 
    // keyCode is a unique number that represents a particular key on the keyboard.
    this.isDown = function(keyCode) {
        return keyState[keyCode] === true;
    };
    // Handy constants that give keyCodes human-readable names.
    this.KEYS = { LEFT: 37, RIGHT: 39, S: 83 };
};*/

