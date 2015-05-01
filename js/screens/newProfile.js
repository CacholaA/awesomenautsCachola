game.NewProfile = me.ScreenObject.extend({
    //allows users to make profile
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('lava-screen')), -10); // TODO
                document.getElementById("input").style.visibility = "visible";
                document.getElementById("register").style.visibility = "visible";
                
                //ability keys
                me.input.unbindKey(me.input.KEY.B);
                me.input.unbindKey(me.input.KEY.Q);
                me.input.unbindKey(me.input.KEY.E);
                me.input.unbindKey(me.input.KEY.W);
                me.input.unbindKey(me.input.KEY.A);
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                        this.font = new me.Font("Arial", 26, "white");
                    },
                    //tells user to register 
                    draw: function(render){
                        this.font.draw(render.getContext(), "PICK USERNAME AND PASSWORD", this.pos.x, this.pos.y);
                    }
                })));
                
                
	},
	//hides register/load bar
	onDestroyEvent: function() {
            document.getElementById("input").style.visibility = "hidden";
            document.getElementById("register").style.visibility = "hidden";   
	}
});
