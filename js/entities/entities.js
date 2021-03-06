game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper();
        this.setPlayerTimers();
        this.setAttributes();
        
        this.type = "PlayerEntity";
        
        this.setFlags();

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        this.setAnimation();
        this.renderable.setCurrentAnimation("idle");

    },
    
    setSuper: function(x, y){
    this._super(me.Entity, "init", [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);
    },
    
    setPlayerTimers: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastAttack = new Date().getTime();
    },
    
    setAttributes: function(){
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
        this.facing = "right";
        this.dead = false;
    },
    //the code below is the animations for my character
    setAnimation: function(){
        this.renderable.addAnimation("idle", [143]);
        this.renderable.addAnimation("walk", [143, 144, 145, 146, 147,148,149, 151], 80);
        this.renderable.addAnimation("attack", [195, 196, 197, 198, 199, 200], 80);
    },
    
    
    update: function(delta) {
        this.now = new Date().getTime();
        
        this.dead = this.checkIfDead();
        
        this.checkKeyPressesAndMove();
        
        this.checkAbilityKeys();

        //thhe code below allows the animations to opperate 
        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        } else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }


        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function(){
        if(this.health <= 0 ){
            return true;
        }
        return false;
    },
    //the code below checks to see if the code works if you pressed the key
    checkKeyPressesAndMove: function(){
        if (me.input.isKeyPressed("right")) {
            this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
           this.moveLeft();
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
            this.jump();
        }

    },
    //this is the code that makes your player move right
    moveRight: function(){
        this.facing = "right";
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.flipX(false);
    },
    //this is the code that makes your player move left 
    moveLeft: function(){
         this.facing = "left";
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
    },
    //this the code that make your player jump
    jump: function(){
        this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    //this code is for all your abilities
    checkAbilityKeys: function(){
      if(me.input.isKeyPressed("skill1")){
          //this.speedBoost();
      }else if(me.input.isKeyPressed("skill2")) {
          //this.eatCreep();
      } else if(me.input.isKeyPressed ("skill3")){
         this.throwSpear();
      } 
    },
    //this is the code that makes your player have the ability to throw a spear
    throwSpear: function(){
        if(this.now - this.lastSpear >= game.data.spearTimer * 1000 && game.data.ability3 > 0){ 
        this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    //this code makes your character lose health when hit
    loseHealth: function(damage) {
        console.log(this.health);
        this.health = this.health - damage;
    },
    //these are the codes for when your player collides with something
    collideHandler: function(response) {
        if (response.b.type === "EnemyBaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            if (ydif > -70 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;

            }
            else if (xdif < -35 && this.facing === "right" && (xdif < 0)) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x - 1;

            } else if (xdif > 70 && this.facing === "left" && (xdif > 0)) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x + 1;
            }

//this code is the code for colliding with an enemy by attacking
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        } else if (response.b.type === "EnemyCreep") {

            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            if (xdif > 0) {
               // this.pos.x = this.pos.x + 1;
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
               // this.pos.x = this.pos.x - 1;
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }
            }

            if (this.renderable.isCurrentAnimation("attack") && ((this.now - this.lastHit) >= game.data.playerAttackTimer)
                    && (Math.abs(ydif <= 40)) &&
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                    ) {
                this.lastHit = this.now;

                if(response.b.health <= game.data.playerAttack){
                    game.data.gold += 1;
                }

                response.b.loseHealth(game.data.playerAttack);
            }
        }
    }
});