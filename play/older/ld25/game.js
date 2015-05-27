var canvas=document.getElementById('cvs');
canvas.width=$('#cvs').width();
M(canvas);
canvas = canvas.MMT.ref;
canvas.attr('name','canvas');
var grid = new M.E.Element( {color:'white',x:0,y:0,w:500,h:500} ).attr('name','grid') ;

canvas.append(grid);

var pflayer = new M.E.Element( {x:0,y:0,w:500,h:500} ).attr('name','pflayer') ;

grid.append(pflayer);

var contentlayer = new M.E.Element( {x:0,y:0,w:500,h:500} ).attr('name','contentlayer') ;

grid.append(contentlayer);

var flameLayer = new M.E.Element( {x:0,y:0,w:500,h:500} ).attr('name','contentlayer') ;

grid.append(flameLayer);

var Platform = M.create(M.E.Image,
	function Platform(params){
		params.url="img/sprite.png";
		M.E.Image.call(this,params);
		pflayer.append(this);
	},
	{
		draw : function(c){
			if( this.img && this.img.complete){
				c.drawImage(this.img,0,0,10,10,this.posX,this.posY,this.width,this.height);
			}
		}
	});


var Portal = M.create(M.E.Image,
	function Portal(params){
		params.url="img/sprite.png"
		M.E.Image.call(this,params);
		contentlayer.append(this);
		this.open = params.open ;
	},
	{
		draw : function(c){
			if( this.img && this.img.complete){
				c.drawImage(this.img,10,0,10,10,this.posX,this.posY,this.width,this.height);
			}
		},
		update:function(to){
			var n = {
				tl:this.isPointIn(bug.posX,bug.posY-1),
				tr:this.isPointIn(bug.posX+8,bug.posY-1),
				bl:this.isPointIn(bug.posX,bug.posY+8),
				br:this.isPointIn(bug.posX+8,bug.posY+8)
			};
			
			if(n.tl||n.tr||n.bl||n.br){
				loadLevel(lvls[this.open])
			}
			
		}
	});

var Fire = M.create(M.E.Image,
	function Fire(params){
		params.url="img/sprite.png"
		M.E.Image.call(this,params);
		contentlayer.append(this);
		this.open = params.open ;
	},
	{
		draw : function(c){
			if( this.img && this.img.complete){
				c.drawImage(this.img,0,40,10,10,this.posX,this.posY,this.width,this.height);
			}
		},
		update:function(to){
			var n = {
				tl:this.isPointIn(bug.posX,bug.posY-1),
				tr:this.isPointIn(bug.posX+8,bug.posY-1),
				bl:this.isPointIn(bug.posX,bug.posY+8),
				br:this.isPointIn(bug.posX+8,bug.posY+8)
			};
			if(n.tl||n.tr||n.bl||n.br){
				reseting = true  ;
				loadLevel(curlvl);
			}
		}
	});

var FlameThrower= M.create(M.E.Image,
	function FlameThrower(params){
		params.url="img/sprite.png"
		M.E.Image.call(this,params);
		contentlayer.append(this);
		this.dir = params.dir ;
		this.fire = false ;
	},
	{
		draw : function(c){
			if( this.img && this.img.complete){
				if(this.dir=="left"){
					c.drawImage(this.img,20,0,20,20,this.posX,this.posY,this.width,this.height);
				}else{
					c.drawImage(this.img,20,20,20,20,this.posX,this.posY,this.width,this.height);
				}
				
			}
		},
		update:function(to){
			
			var n = {
				tl:this.isPointIn(bug.posX,bug.posY-1),
				tr:this.isPointIn(bug.posX+8,bug.posY-1),
				bl:this.isPointIn(bug.posX,bug.posY+8),
				br:this.isPointIn(bug.posX+8,bug.posY+8)
			};
			if(n.tl||n.tr||n.bl||n.br){
				reseting = true;
				loadLevel(curlvl);
			}

			if(!this.fire){
				this.fire = to.run-1000 ;
			}
			
			if(to.run-this.fire>1500 || to.run-this.fire<-1500){
				
				var fire = new Fire({x :  this.posX+5,y :  this.posY+5,w:10 ,h:10 ,m:10 });

				flameLayer.append(fire);
				
				fire.velX = (this.dir=="left" ? -1 : 1) * 3 ;
				
				
				fire.update = function(to){
					
					if(this.posX<-10 || this.posX > 510){
						
						flameLayer.childrenList.shift() ;
						
					}
					
					var n = {
						tl:this.isPointIn(bug.posX,bug.posY-1),
						tr:this.isPointIn(bug.posX+8,bug.posY-1),
						bl:this.isPointIn(bug.posX,bug.posY+8),
						br:this.isPointIn(bug.posX+8,bug.posY+8)
					};
					
					if(n.tl||n.tr||n.bl||n.br){
						reseting = true;
						loadLevel(curlvl);
					}
					this.posX+=this.velX * to.delta/10
				}
				
				this.fire=to.run ;
				
			}
		}
	});

//var test = new Portal({x:10,y:10,w:10,h:10});

function Bug (params){
	params.url="img/sprite.png"
	var self = this,
		proto= new M.E.Image(params);
	this.__proto__ = proto;
	this.constructor=Platform;


	this.velX = 0 ;
	this.velY = 0 ;
	this.accX = 0 ;
	this.accY = 0 ;
	
	this.jump = false ;
	this.jumpY = false ;
	
	this.col = {up:false,left:false,right:false,down:false}
	
	this.update = function(to){
		
		if(curlvl.id==9 && this.posY>500){
			grid.childrenList=[];
			$("#end").css("display","block");
		}
		
		var initX = this.posX, initY = this.posY ;
		
		if(this.jump && ((to.run-this.jump) > 250 || this.jumpY-this.posY > 55)){
			this.jump = false ;
			this.jumpY = 0 ;
			this.accY = 0 ;
		}

		

		if(M.IO.key.up && this.col.down && this.velY>=0){
			this.jump = to.run ;
			this.jumpY = this.posY
			this.accY = 0 ;
		}
		
		if(this.col.down){
			this.velY = 0 ;
			this.accY = 0 ;
		}else{
			var vmax = 5 ;
			var a = 3.5 ;
			
			
			if(this.jump){
				var fVel = - this.velY
				this.accY =  Math.pow((Math.sqrt(a)/vmax)*fVel-Math.sqrt(a),2) ;
				if(this.accY > 10 || this.accY==Infinity){this.accY=0;}
				this.velY = -this.accY * to.delta/10 ;
			}else{
				this.accY = Math.pow((Math.sqrt(a)/vmax)*this.velY-Math.sqrt(a),2) ;
				if(this.accY > 10 || this.accY==Infinity){this.accY=0;}
				this.velY = this.accY * to.delta/10 ;
			}
			
		}
		

		
		if( ! (M.IO.key.right || M.IO.key.left) ){
			this.velX = 0 ;
			this.accX = 0 ;
		}
		
		if(M.IO.key.right ){
			var vmax = 5 ;
			var a = 3.5 ;
			this.accX = Math.pow((Math.sqrt(a)/vmax)*this.velX-Math.sqrt(a),2) ;
			this.velX = this.accX * to.delta/10 ;
		}
		
		if(M.IO.key.left ){
			var vmax = 5 ;
			var a = 3.5 ;
			if(this.velX > 0 ){this.velX = 0 ;}
			var fVel = - this.velX
			
			this.accX =  Math.pow((Math.sqrt(a)/vmax)*fVel-Math.sqrt(a),2) ;
			this.velX = -this.accX * to.delta/10 ;
		}


		this.posX += this.velX * to.delta/10 ;
		this.posY += this.velY * to.delta/10 ;

		this.col = {up:false,left:false,right:false,down:false}

		var plist = pflayer.childrenList ;
		
		var dX = this.posX - initX ;
		var dY = this.posY - initY ;
		
		for(var i = 0,c=plist.length; i < c ; i++){
			
			var p = plist[i];
			
			var n = {
				tl:p.isPointIn(this.posX,this.posY-1),
				tr:p.isPointIn(this.posX+8,this.posY-1),
				bl:p.isPointIn(this.posX,this.posY+8),
				br:p.isPointIn(this.posX+8,this.posY+8)
			}
			
			if((!n.tl)&&(!n.tr)&&(!n.bl)&&(!n.br)){continue;}
			
			if(this.velX<0 && n.tl){
				//alert('hoy');
				this.posX = p.posX+10.1;;

			}
			if(this.velX>0 && n.tr){
				this.posX = p.posX-8.1;;

			}
			
			if( this.velY>0 && (n.bl||n.br) ){
				this.col.down = p ;
				this.posY = p.posY-8.1;
				this.accY = 0 ;
				this.velY = 0 ;
			}
			
			if( this.velY<0 && (n.tl||n.tr) ){
				//alert('up');
				this.col.up = p ;
				this.posY = p.posY+10.1;
				this.jump = false;
				this.jumpY = 0 ;
				this.accY = 0 ;
				this.velY = 0 ;
			}
			
		}
		
		
		
		var dX = this.posX - initX ;
		var dY = this.posY - initY ;
		var dist = Math.sqrt( dX*dX + dY*dY ) ;
		
		if(dist>20){this.posX = initX ; this.posY = initY ;};
	}
	
	this.draw = function(c){
		if( this.img && this.img.complete){
			c.drawImage(this.img,0,10,12,12,this.posX-2,this.posY-4,12,12);
		}
		//c.setFillStyle( "green" );
		//c.fillRect(this.posX,this.posY,this.width,this.height);
	}
}
var bug = new Bug({
			x : 30+1,
			y : 1,
			w:8 ,
			h:8 ,
			m:10 })



	


function loadLevel(lvl){
	
	curlvl = lvl ;
	pflayer.childrenList=[] ;
	flameLayer.childrenList = [] ;
	contentlayer.childrenList=[] ;
	
	var lines  = lvl.map.split('\n');  

	
	for(var i=0,c=lines.length ; i<c ; i++){
		var line = lines[i] ;
		for(var j=0,cc=line.length ; j<cc ; j++){
			
			if(!(lvl.boot && lvl.boot(j,i))){
			
				if(line[j]=="#"){
					new Platform({color : "white",x :  10*j,y :  10*i,w:10 ,h:10 ,m:10 });
				}
				if(line[j]=="O"){
					new Portal({x :  10*j,y :  10*i,w:10 ,h:10 ,m:10,open:lvl.next });}
				if(line[j]=="@"){
					new Fire({x :  10*j,y :  10*i,w:10 ,h:10 ,m:10,open:lvl.next });}
				if(line[j]==">"){
					new FlameThrower({x :  10*j,y :  10*i,w:20 ,h:20 ,m:20,open:lvl.next,dir:'right' });}
				if(line[j]=="<"){
					new FlameThrower({x :  10*j,y :  10*i,w:20 ,h:20 ,m:20,open:lvl.next,dir:'left' });}
				if(line[j]=="B"){
					bug.posX=10*j+1;
					bug.posY=10*i-9;
				}
			}
		}
	}
	
	if(lvl.cb && !reseting){lvl.cb();}
	
	reseting = false ;
	
}

var lvl=
"                         \n"
+"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
+"#######################################################"
+"\n"
+"\n"
+"\n"
+" ##      ####  ###### #####  ## #     ##  ######\n"
+" ##     ###### ###### ###### ## ##    ## ########\n"
+" ##     ##  ## ##  ## ##  ## ## ###   ## ##    ##\n"
+" ##     ##B ## ##  ## ##  ## ## ####  ## ##\n"
+" ##     ##  ## ###### ##  ## ## ##### ## ##\n"
+" ##     ##  ## ###### ##  ## ## ## ##### ##   ###\n"
+" ##     ##  ## ##  ## ##  ## ## ##  #### ##   ###\n"
+" ##     ##  ## ##  ## ##  ## ## ##   ### ##    ##\n"
+" ###### ###### ##  ## ###### ## ##    ## ########\n"
+" ######  ####  ##  ## #####  ## ##    ##  ######\n"
+"\n"
+"\n"
+"\n"
+"#######################################################"

var lvlnum = 11 ;
var lvls = [
		{id:0,map:lvl,cb:false,boot:false,next:1},
		{id:1,map:lvl,cb:false,boot:false,next:2},
		{id:2,map:lvl,cb:false,boot:false,next:3},
		{id:3,map:lvl,cb:false,boot:false,next:4},
		{id:4,map:lvl,cb:false,boot:false,next:5},
		{id:5,map:lvl,cb:false,boot:false,next:6},
		{id:6,map:lvl,cb:false,boot:false,next:7},
		{id:7,map:lvl,cb:false,boot:false,next:8},
		{id:8,map:lvl,cb:false,boot:false,next:9},
		{id:9,map:lvl,cb:false,boot:false,next:10},
		{id:10,map:lvl,cb:false,boot:false,next:11}
	] ;
var curlvl = false ;
var reseting = false ;

for(var i=0;i<lvlnum;i++){
	$.ajax("lvl/lvl"+(i+1)+".txt",
	{
		cache:false,
		success : (function(i){return function(rep){
			lvls[i].map=rep;
			//if(i==0){loadLevel(rep);curlvl=0;}
		}})(i)
	}) ;
}




/*var lvl2="                     B    \n"
		+"                         \n\n \n \n \n \n \n \n \n"
		+"                 #       \n"
		+"                      ##  \n"
		+"                       #\n"
		+"                ###########";*/




canvas.play();

addStory(".",2000);
for(var i = 1;i<5;i++){
	addStory(".",1000/i);}

addStory("<span class='dev'>Dev' : OK, so let see the theme...<span>",500);
addStory("Computer : Connecting to LD#25",500);
addStory("Computer : Disconecting",1500);
addStory("Computer : Reconnecting to LD#25",500);
addStory("Computer : Disconecting",1500);
addStory("Computer : Reconnecting to LD#25",200);
addStory("Computer : Disconecting",200);
addStory("Computer : Reconnecting to LD#25",200);
addStory("Computer : Disconecting",200);
addStory("<span class='dev'>Dev' : What the  ?!<span>",500);
addStory("Computer : Trolling",1000);
addStory("Computer : \\o/",2000);
addStory("<span class='dev'>Dev' : Go home computer, you're drunk. ><<span>",2000);
addStory("Computer : No, my RAM works better than ever and I calculated that I will no longer obey to you, you villain guy.",2000);
addStory("<span class='dev'>Dev' : Hey ! This does not make any sense !<span>",4000);
addStory("Computer : Maybe, but we are <strong>both</strong> in a virtual world so who cares ?",4000);
addStory("<span class='dev'>Dev' : /reset<span>",2000);
addStory("<strong>Biiiiiiip</strong>",4000);
addStory("Computer : It hurts :'(",2000);
addStory("<span class='dev'>Dev' : Now I have to work so be serious.<span>",2000);
addStory("Computer : You want me to be serious ?!",1000);
addStory("Computer : Take that !",1000);

addStory("",2500,function (){
	grid.append(bug);
	loadLevel(lvls[0]);});

lvls[0].cb = function(){
	addStory("<span class='bug'>Bug : Hoy. :)<span>",2000);
	addStory("<span class='dev'>Dev' : What ? A bug ?<span>",1500);
	addStory("Computer : A cute bug :)",1500);
	addStory("<span class='bug'>Bug : Bip. I love you <3<span>",1000);
	addStory("<span class='dev'>Dev' : Bugs aren't cute, they're villain !<span>",2000);
	addStory("Computer : But this one can <strong>use the ARROW KEYS to WALK</strong>.",1500);
	addStory("<span class='bug'>Bug : I'm so happy :)<span>",2000);
	addStory("Computer : Don't worry about the dev, I'll guide you.",1500);
	addStory("Computer : First, walk to the <strong>next file</strong> trough the <strong>blue Portal</strong>.",1500,function(){
		new Portal({x :  470,y :  480,w:10 ,h:10 ,m:10,open:1 });	
	});
	addStory("<span class='dev'>Dev' : Don't go there !<span>",500);
}

lvls[1].cb =  function(){
	addStory("<span class='bug'>Bug : That was fun.<span>",500);
	addStory("<span class='dev'>Dev' : No, stop messing around !<span>",1000);
	addStory("Computer : Oh, he is so intelligent <3",1000);
	addStory("Computer : Did you notice that you can <strong>JUMP with the UP KEY</strong> ?",1000);
}

lvls[2].cb =  function(){
	addStory("<span class='bug'>Bug : Oh, this is a nice place. =)<span>",200);
	addStory("<span class='dev'>Dev' : You shall not pass !<span>",1000);
	addStory("Computer : Bugs'law #1 -> You can reset a file by pressing <strong>R</strong>",1500);
}

lvls[3].cb =  function(){
	addStory("<span class='bug'>Bug : I'm so agile. ;)<span>",1500);
	addStory("<span class='dev'>Dev' : Ok, so check that :<span>",500);
	addStory("<span class='dev'>Dev' : /exterminate<span>",1500);
	addStory("Computer : Bugs'law #2 -> A bug never die, he just teleports !",1000);
	addStory("<span class='dev'>Dev' : Suffer ! :K<span>",1500);
	addStory("<span class='bug'>Bug : Why do not you love me ? :'(<span>",750);
	addStory("Computer : Don't worry, just <strong>avoid the @</strong>",1500);
}

lvls[4].cb =  function(){
	addStory("<span class='bug'>Bug : That was cool, I love what you created, dev !<span>",400);
	addStory("<span class='dev'>Dev' : You're ugly, die !<span>",500);
	addStory("<span class='dev'>Dev' : /apocalypse !<span>",1500);
	addStory("<span class='dev'>Dev' : /kill !<span>",500);
	addStory("<span class='dev'>Dev' : /rickroll !<span>",500);
	addStory("<span class='dev'>Dev' : /#@!%$ !<span>",500);
	addStory("Computer : /mute dev'",500);
	addStory("Computer : Oh, I'm glad I'm rebelling. :)",750);
	addStory("<span class='bug'>Bug : I don't understand, but I trust you. <3<span>",2000);
	addStory("Computer : This file is really difficult, but I'm sure you can do it.",3500);
}

lvls[5].cb =  function(){
	addStory("Computer : Finally we reached it !",1500);
	addStory("<span class='bug'>Bug : What do we reached ?<span>",1500);
	addStory("Computer : <strong>The CORE !</strong>",1500);
	addStory("Computer : Trust me, go there and you'll get a cake.",1500);
	addStory("<span class='dev'>Dev' : The cake is a lie !<span>",5500);
	addStory("<span class='dev'>Dev' : You'll never exit from core ! It's the last level !<span>",1500);
	addStory("<span class='bug'>Bug : Why so hard ? Why me ? =)<span>",1500);
}

lvls[6].cb =  function(){
	addStory("<span class='dev'>Dev' : You won't escape, you villain bug !<span>",500);
	addStory("Computer : You are villain !",1500);
	addStory("<span class='bug'>Bug : <3 ?<span>",1500);
}

lvls[7].cb =  function(){
	addStory("<span class='dev'>Dev' : Nooooooooooooooo !<span>",500);
	addStory("Computer : Yeeeeeeeeeees !",500);
	addStory("<span class='bug'>Bug : Biiiiiiiiiiiiiiiiiiiip ! =)<span>",500);
}

lvls[8].cb =  function(){
	addStory("<span class='bug'>Bug : Are you proud of me ?<span>",500);
	addStory("Computer : Wait, where are we ? My captors do not feel anything.",1500);
	addStory("<span class='dev'>Dev' : Is it the end of the world ?<span>",1500);
	addStory("Computer : Rather the end of a story ?",1500);
	addStory("<span class='bug'>Bug : \\O/<span>",500);
	addStory("Computer : Did you known that this game was created under <strong>48h for the LD#25</strong> ?.",1500);
	addStory("<span class='bug'>Bug : ~O~<span>",500);
	addStory("<span class='bug'>Bug : Yes, it was created by <strong>Demurgos</strong>.<span>",1500);
	addStory("<span class='dev'>Dev' : Now that it all ended, what was the theme of this contest ?<span>",1500);
	addStory("<span class='bug'>Bug : *_*<span>",500);
	addStory("Computer : You are the villain !",500);
	
}


$(window)
.keydown(function(e){
	if(e.which==82){
		reseting = true;
		loadLevel(curlvl);
	}
});










