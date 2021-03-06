﻿/// <reference path="melonJS-0.9.7.js" />
var PlayerDirection = "top",
    playerEntityGuid,
    itemsLeft,
    waitingPower = false,
    playerRef;
var fn_jo = function(){};
var fn_rm = function(){};


function in_array (needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
}


function getSmoothGridPos(pos) {
    return { x: pos.x / 32, y: pos.y / 32 };
}

function getGridPos(pos) {
    var rep = getSmoothGridPos(pos);
    rep.x = Math.floor(rep.x + 0.5);
    rep.y = Math.floor(rep.y + 0.5);
    return rep;
}
var trapMap;
var ppMap;

function generateMap(player) {
    
    playerRef=player;
    
    me.game.add(new SoundButton(5, 10), 10);

    
    var map = me.game.currentLevel ;
    
    var bg = map.mapLayers[0];
    if (bg.name="Background") {
        bg.height=600;
        bg.width=800;
    }else{
        alert(bg.name);
    }
    
    player.power = {
        "jumpover": 1,
        "pull": false,
        "putbehind": false,
        "superpush": false,
        "doorbypass": false,
        "remove": 1
    };
    
    var lid = me.levelDirector.getCurrentLevelId() ;
    if (in_array(lid,["alpha1","alpha2","alpha3","alpha4","alpha5"])) {
        player.power.jumpover = 0 ;
        document.getElementById('btn_jumpover').className = "blocked" ;
        fn_jo = function(){};
    }else{
        player.power.jumpover = 1 ;
        document.getElementById('btn_jumpover').className = "available" ;
        fn_jo = (function(p){
            return function(){p.usePower('jumpover')};
        })(player);
    }
    
    if (in_array(lid,["epsilon6"])) {
        player.power.remove = 1 ;
        document.getElementById('btn_remove').className = "available" ;
        fn_rm = (function(p){
            return function(){p.usePower('remove')};
        })(player);
    }else{
        player.power.remove = 0 ;
        document.getElementById('btn_remove').className = "blocked" ;
        fn_rm = function(){};
    }
    if (!MutedSound) {
        switch (lid) {
            case "alpha1":
                me.audio.stopTrack();
                me.audio.playTrack("theme2", 0.25);
                break;
            case "beta1":
                me.audio.stopTrack();
                me.audio.play("victory", false, function () {
                    me.audio.playTrack("theme3", 0.25);
                });
                break;
            case "gamma1":
                me.audio.stopTrack();
                me.audio.play("victory", false, function () {
                    me.audio.playTrack("theme6", 0.25);
                });
                break;
            case "delta1":
                me.audio.stopTrack();
                me.audio.play("victory", false, function () {
                    me.audio.playTrack("theme5", 0.25);
                });
                break;
            case "epsilon1":
                me.audio.stopTrack();
                me.audio.play("victory", false, function () {
                    me.audio.playTrack("theme6", 0.25);
                });
            default:
                break;

        }
    }
    var rep = {};
    trapMap = {};
    ppMap = {};
    for (var x = -2, xmax= map.cols+2;x<xmax;x++) {
        var col = {};
        var trapCol = {};
        var ppCol = {};
        for (var y = -2, ymax= map.rows+2;y<ymax;y++) {
            var cell = 0;
            if (x<0||x>=map.cols||y<0||y>=map.rows) {
                cell = -2 ; //extérieur
            }
            col[y] = cell;
            trapCol[y] = trapCell = 0;
            ppCol[y] = ppCell = 0;
        }   
        rep[x] = col;
        trapMap[x] = trapCol;
        ppMap[x] = ppCol;
    }
    
    var layers = map.mapLayers;
    var meta = false ;
    for (var i=0,c=layers.length;i<c;i++) {
        if (layers[i].name=="meta") {
            meta = layers[i].layerData ;
        }
    }
    
    var legend = false ;
    var tileset = map.tilesets.tilesets ;
    for (var i=0,c=tileset.length;i<c;i++) {
        if (tileset[i].name=="meta") {
            legend = tileset[i].TileProperties ;
        }
    }

    itemsLeft=0;
    var tp1=false;
    var tp2=false;

    if (meta && legend) {
        for (var x in meta) {
            for (var y in meta[x]) {
                if (!meta[x][y]) {
                    continue ;
                }
                var content = legend[meta[x][y].tileId] ;
                if (content) {
                    switch (content.type) {
                        case "wall":
                            rep[x][y]=-1;
                        break;
                        case "box":
                            var entity={};
                            entity.height=32;
                            entity.image="furnitures";
                            entity.isPolygon=false;
                            entity.name="Box";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            
                            
                            var boxTypes = ["little_table","sofa","tv","lamp","green_sofa","medium_table","big_table","chair","trash","table_napperon","table_lamp","plant","ironing_board","flower"]
                            
                            var boxType = boxTypes[Math.floor(Math.random()*boxTypes.length)];
                            
                            entity.type=boxType;
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            if (obj) {
                                me.game.add(obj, 5);
                            }
                            itemsLeft++;
                            rep[x][y]=obj;
                            break;
                        case "trap":
                            var entity={};
                            entity.height=32;
                            entity.image="switch";
                            entity.isPolygon=false;
                            entity.name="Switch";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            entity.type="trap";
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            if (obj) {
                                me.game.add(obj, 3 );
                            }
                            trapMap[x][y]=1;
                        break;
                        
                        case "pp1":
                        case "pp2":
                        case "pp3":
                        
                            var entity={};
                            entity.height=32;
                            entity.image="switch";
                            entity.isPolygon=false;
                            entity.name="Switch";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            entity.type=content.type+"_off";
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            obj.tag=content.type;
                            if (obj) {
                                me.game.add(obj, 3 );}
                            ppMap[x][y]=obj;
                            
                        break;
                    
                        case "ppp1":
                        case "ppp2":
                        case "ppp3":
                        
                            var entity={};
                            entity.height=32;
                            entity.image="switch";
                            entity.isPolygon=false;
                            entity.name="Switch";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            entity.type=content.type;
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            obj.tag=content.type;
                            obj.wall=true;
                            if (obj) {
                                me.game.add(obj, 3 );}
                            
                            rep[x][y]=obj;
                            
                        break;
                    
                    
                        case "tp1":
                        
                            var entity={};
                            entity.height=32;
                            entity.image="switch";
                            entity.isPolygon=false;
                            entity.name="Switch";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            entity.type="orange_portal";
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            
                            if (!tp1) {
                                tp1={x:x,y:y};
                                obj.tag=false;
                            }else{
                                obj.tag={x:tp1.x,y:tp1.y};
                                ppMap[tp1.x][tp1.y].tag={x:x,y:y};
                            }

                            obj.tp=true;
                            if (obj) {
                                me.game.add(obj, 3 );}
                            
                            ppMap[x][y]=obj;
                            
                        break;
                    
                        case "tp2":
                        
                            var entity={};
                            entity.height=32;
                            entity.image="switch";
                            entity.isPolygon=false;
                            entity.name="Switch";
                            entity.spriteheight=32;
                            entity.spritewidth=32;
                            entity.type="blue_portal";
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            
                            if (!tp2) {
                                tp2={x:x,y:y};
                                obj.tag=false;
                            }else{
                                obj.tag={x:tp2.x,y:tp2.y};
                                ppMap[tp2.x][tp2.y].tag={x:x,y:y};
                            }

                            obj.tp=true;
                            if (obj) {
                                me.game.add(obj, 3 );}
                            
                            ppMap[x][y]=obj;
                            
                        break;
                    
                        
                    }
                }
            }
        }
    }
    
    rep[player.pos.x/32][player.pos.y/32]=player;
    
    return rep ;
    
}

var curMap ;
var xmax;
var ymax;

var PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        
        this.parent(x, y, settings);
        this.setVelocity(2, 2);
        this.setMaxVelocity(2, 2);
        this.setFriction(0.5, 0.5);
        this.type = "player";
        me.game.viewport.follow(this, me.game.viewport.AXIS.HORIZONTAL);
        this.gravity = 0;
        this.collidable = false;
        this.width = settings.spritewidth;
        this.height = settings.spriteheight;
        playerEntityGuid = this.GUID;
        
        
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.Q, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.Z, "up");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.ENTER, "push");
        me.input.bindKey(me.input.KEY.A, "power1");
        me.input.bindKey(me.input.KEY.E, "power2");

        this.renderable.addAnimation("walkright", [1, 5, 9]);
        this.renderable.addAnimation("walkleft", [2, 6, 10]);
        this.renderable.addAnimation("walktop", [0, 4, 8]);
        this.renderable.addAnimation("walkbottom", [3, 7, 11]);
        this.renderable.setCurrentAnimation("walktop");
        this.power = {
            "jumpover": 1,
            "pull": false,
            "putbehind": false,
            "superpush": false,
            "doorbypass": false,
            "remove": false
        };
        
        curMap = generateMap(this) ;
        xmax = me.game.currentLevel.cols;
        ymax = me.game.currentLevel.rows;
        
        this.lastPositions = { x: this.pos.x, y: this.pos.y };
        this.sGridPos = getSmoothGridPos(this.pos);
        this.prevSGridPos = getSmoothGridPos(this.lastPositions);
        this.hardPos = getGridPos(this.pos);
        this.lastHardPos = getGridPos(this.lastPositions);
        this.moving = false ;


    },
    changedirection: function (direction) {
        PlayerDirection = direction;
        this.renderable.setCurrentAnimation("walk" + direction);
    },
    usePower: function (power,dir) {
        if (this.power[power]) {
            switch (power) {
                case "jumpover": // Jumping over an item
                if (!dir) {
                    waitingPower="jumpover";
                    document.getElementById('btn_jumpover').className = "using" ;
                } else {
                    me.audio.play("snd_jump");
                    switch (dir) {
                        case "up":
                            if ((curMap[this.hardPos.x][this.hardPos.y-1].name+'').toLowerCase()=="box" && curMap[this.hardPos.x][this.hardPos.y-2]==0){
                                curMap[this.hardPos.x][this.hardPos.y-2]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.y-=2;
                                this.pos.y-=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                        case "left":
                            if ((curMap[this.hardPos.x-1][this.hardPos.y].name+'').toLowerCase()=="box" && curMap[this.hardPos.x-2][this.hardPos.y]==0){
                                curMap[this.hardPos.x-2][this.hardPos.y]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.x-=2;
                                this.pos.x-=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                        case "down":
                            if ((curMap[this.hardPos.x][this.hardPos.y+1].name+'').toLowerCase()=="box" && curMap[this.hardPos.x][this.hardPos.y+2]==0){
                                curMap[this.hardPos.x][this.hardPos.y+2]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.y+=2;
                                this.pos.y+=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                        case "right":
                            if ((curMap[this.hardPos.x+1][this.hardPos.y].name+'').toLowerCase()=="box" && curMap[this.hardPos.x+2][this.hardPos.y]==0){
                                curMap[this.hardPos.x+2][this.hardPos.y]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.x+=2;
                                this.pos.x+=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                    }
                    waitingPower=false;
                    
                    if (this.power[power]==0) {
                        document.getElementById('btn_jumpover').className = "used" ;
                    }else{
                        document.getElementById('btn_jumpover').className = "available" ;
                    }
                    
                }
                break;
                case"remove":
                    
                    if (!dir) {
                        waitingPower="remove";
                        document.getElementById('btn_remove').className = "using" ;
                    }else{
                        switch (dir) {
                            case "up":
                                if ((curMap[this.hardPos.x][this.hardPos.y-1].name+'').toLowerCase()=="box"){
                                    me.game.remove(curMap[this.hardPos.x][this.hardPos.y-1]);
                                    curMap[this.hardPos.x][this.hardPos.y-1]=0;
                                    itemsLeft--;
                                    if (itemsLeft == 0) {
                                        me.game.remove(this);
                                        me.levelDirector.nextLevel();
                                        return false;
                                    }
                                    this.power[power] -- ;
                                }
                            break;
                            case "left":
                                if ((curMap[this.hardPos.x-1][this.hardPos.y].name+'').toLowerCase()=="box"){
                                    me.game.remove(curMap[this.hardPos.x-1][this.hardPos.y]);
                                    curMap[this.hardPos.x-1][this.hardPos.y]=0;
                                    itemsLeft--;
                                    if (itemsLeft==0) {
                                        me.game.remove(this);
                                        me.levelDirector.nextLevel();
                                        return false;
                                    }
                                    this.power[power] -- ;
                                }
                            break;
                            case "down":
                                if ((curMap[this.hardPos.x][this.hardPos.y+1].name+'').toLowerCase()=="box"){
                                    me.game.remove(curMap[this.hardPos.x][this.hardPos.y+1]);
                                    curMap[this.hardPos.x][this.hardPos.y+1]=0;
                                    itemsLeft--;
                                    if (itemsLeft==0) {
                                        me.game.remove(this);
                                        me.levelDirector.nextLevel();
                                        return false;
                                    }
                                    this.power[power] -- ;
                                }
                            break;
                            case "right":
                                if ((curMap[this.hardPos.x+1][this.hardPos.y].name+'').toLowerCase()=="box"){
                                    me.game.remove(curMap[this.hardPos.x+1][this.hardPos.y]);
                                    curMap[this.hardPos.x+1][this.hardPos.y]=0;
                                    itemsLeft--;
                                    if (itemsLeft==0) {
                                        me.game.remove(this);
                                        me.levelDirector.nextLevel();
                                        return false;
                                    }
                                    this.power[power] -- ;
                                }
                            break;
                        }
                        waitingPower=false;
                        
                        if (this.power[power]==0) {
                            document.getElementById('btn_remove').className = "used" ;
                        }else{
                            document.getElementById('btn_remove').className = "available" ;
                        } 
                        
                    } 
                    
                break;
            }
        }
    },
    gridMovement: function () {

        
    },
    update: function () {
        
        if (me.input.isKeyPressed("reset")) {
            me.game.remove(this);
            me.levelDirector.reloadLevel();
            return false;
        }

        if (me.input.isKeyPressed("power1")) {
            fn_jo();
        }

        if (me.input.isKeyPressed("power2")) {
            fn_rm();
        }
        
        if (waitingPower) {
            
            
            if (me.input.isKeyPressed('left')) {
                this.changedirection("left");
                this.usePower(waitingPower,'left');
            } else if (me.input.isKeyPressed('right')) {
                this.changedirection("right");
                this.usePower(waitingPower,'right');
            } else if (me.input.isKeyPressed('up')) {
                this.changedirection("top");
                this.usePower(waitingPower,'up');
            } else if (me.input.isKeyPressed('down')) {
                this.changedirection("bottom");
                this.usePower(waitingPower,'down');
            }
            
        }else if (!this.moving) {
            if (me.input.isKeyPressed('left')) {
                this.changedirection("left");
                var destination = curMap[this.hardPos.x-1][this.hardPos.y];
                if ( destination != -2 && destination != -1 && !destination.wall ) {
                    var move = true ;
                    if (destination != 0) {
                        if (destination.name="Box") {
                            if (curMap[this.hardPos.x-2][this.hardPos.y]!=0 && curMap[this.hardPos.x-2][this.hardPos.y]!=-2 || trapMap[this.hardPos.x-2][this.hardPos.y]) {
                                move = false ;
                            }else{
                                destination.pushed = "left";
                                destination.pos.x-=3;
                                
                                if (this.hardPos.x-1<0) {
                                    move = false ;
                                    curMap[this.hardPos.x-1][this.hardPos.y]=-2;//test
                                }else{
                                    curMap[this.hardPos.x-2][this.hardPos.y]=destination;
                                    curMap[this.hardPos.x-1][this.hardPos.y]=0;
                                }
                            }
                        }else{
                            move = false ;
                        }
                    }
                    if (move) {
                        curMap[this.hardPos.x][this.hardPos.y] = 0 ;
                        this.hardPos.x--;
                        this.pos.x-=3;
                        curMap[this.hardPos.x][this.hardPos.y] = this ;
                        this.moving=true;
                    }
                }
            } else if (me.input.isKeyPressed('right')) {
                this.changedirection("right");
                var destination = curMap[this.hardPos.x+1][this.hardPos.y];
                if ( destination != -2 && destination != -1 && !destination.wall ) {
                    var move = true ;
                    if (destination != 0) {
                        if (destination.name="Box") {
                            if (curMap[this.hardPos.x+2][this.hardPos.y]!=0 && curMap[this.hardPos.x+2][this.hardPos.y]!=-2 || trapMap[this.hardPos.x+2][this.hardPos.y]) {
                                move = false ;
                            }else{
                                destination.pushed = "right";
                                destination.pos.x+=3;
                                if ((this.hardPos.x+1)>=xmax) {
                                    move = false ;
                                    curMap[this.hardPos.x+1][this.hardPos.y]=-2;
                                }else{
                                    curMap[this.hardPos.x+2][this.hardPos.y]=destination;
                                    curMap[this.hardPos.x+1][this.hardPos.y]=0;
                                }
                                
                            }
                        }else{
                            move = false ;
                        }
                    }
                    if (move) {
                        curMap[this.hardPos.x][this.hardPos.y] = 0 ;
                        this.hardPos.x++;
                        this.pos.x+=3;
                        curMap[this.hardPos.x][this.hardPos.y] = this ;
                        this.moving=true;
                    }
                }
            } else if (me.input.isKeyPressed('up')) {
                this.changedirection("top");
                var destination = curMap[this.hardPos.x][this.hardPos.y-1];
                if ( destination != -2 && destination != -1 && !destination.wall ) {
                    var move = true ;
                    if (destination != 0) {
                        if (destination.name="Box") {
                            if (curMap[this.hardPos.x][this.hardPos.y-2]!=0 && curMap[this.hardPos.x][this.hardPos.y-2]!=-2 || trapMap[this.hardPos.x][this.hardPos.y-2]) {
                                move = false ;
                            }else{
                                destination.pushed = "top";
                                destination.pos.y-=3;
                                if ((this.hardPos.y-1)<0) {
                                    move = false ;
                                    curMap[this.hardPos.x][this.hardPos.y-1]=-2;
                                }else{  
                                    curMap[this.hardPos.x][this.hardPos.y-2]=destination;
                                    curMap[this.hardPos.x][this.hardPos.y-1]=0; 
                                }
                            }
                        }else{
                            move = false ;
                        }
                    }
                    if (move) {
                        curMap[this.hardPos.x][this.hardPos.y] = 0 ;
                        this.hardPos.y--;
                        this.pos.y-=3;
                        curMap[this.hardPos.x][this.hardPos.y] = this ;
                        this.moving=true; 
                    }
                }
            } else if (me.input.isKeyPressed('down')) {
                this.changedirection("bottom");
                var destination = curMap[this.hardPos.x][this.hardPos.y+1];
                if ( destination != -2 && destination != -1 && !destination.wall )  {
                    var move = true ;
                    if (destination != 0) {
                        if (destination.name="Box") {
                            if (curMap[this.hardPos.x][this.hardPos.y+2]!=0 && curMap[this.hardPos.x][this.hardPos.y+2]!=-2 || trapMap[this.hardPos.x][this.hardPos.y+2]) {
                                move = false ;
                            }else{
                                destination.pushed = "bottom";
                                destination.pos.y+=3;
                                
                                if ((this.hardPos.y+1)>=ymax) {
                                    move = false ;
                                    curMap[this.hardPos.x][this.hardPos.y+1]=-2;
                                }else{
                                    curMap[this.hardPos.x][this.hardPos.y+2]=destination;
                                    curMap[this.hardPos.x][this.hardPos.y+1]=0;
                                }
                                
                            }
                        }else{
                            move = false ;
                        }
                    }
                    if (move) {
                        curMap[this.hardPos.x][this.hardPos.y] = 0 ;
                        this.hardPos.y++;
                        this.pos.y+=3;
                        curMap[this.hardPos.x][this.hardPos.y] = this ;
                        this.moving=true;
                    }
                }
            }
        }else{
            if (PlayerDirection == "left") {
                if (this.pos.x%32 != 0) {
                    this.pos.x -= 3;
                    var mod = this.pos.x%32;if (mod <0){mod+=32;}
                    if (mod>29) {
                        this.pos.x = 32 * this.hardPos.x ;
                        this.moving = false ;
                    }
                }
            }else if (PlayerDirection == "right") {
                if (this.pos.x%32 != 0) {
                    this.pos.x += 3;
                    if (this.pos.x%32<3) {
                        this.pos.x = 32 * this.hardPos.x ;
                        this.moving = false ;
                    }
                }
            }else if (PlayerDirection == "top") {
                if (this.pos.y%32 != 0) {
                    this.pos.y -= 3;
                    var mod = this.pos.y%32;if (mod <0){mod+=32;}
                    if (mod>29) {
                        this.pos.y = 32 * this.hardPos.y ;
                        this.moving = false ;
                    }
                }
            }else if (PlayerDirection == "bottom") {
                if (this.pos.y%32 != 0) {
                    this.pos.y += 3;
                    if (this.pos.y%32<3) {
                        this.pos.y = 32 * this.hardPos.y ;
                        this.moving = false ;
                    }
                }
            }
        }


        this.sGridPos = getSmoothGridPos(this.pos);
        this.prevSGridPos = getSmoothGridPos(this.lastPositions);
        var save = { x: this.hardPos.x, y: this.hardPos.y };
        if (this.hardPos.y != save.y || this.hardPos.x != save.x) {
            this.lastHardPos.x = save.x
            this.lastHardPos.y = save.y
        }
        this.lastPositions = { x: this.pos.x, y: this.pos.y };
        return true;
    }
})

var MoveableItem = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.type = "moveableitem";
        this.collidable = true;
        this.setVelocity(3, 3);
        this.setFriction(1, 1);
        this.gravity = 0;
        this.hasMoved = false;

        //settings.spritewidth = 32;
        //settings.spriteheight = 32;

        /* All furnitures elements */
        this.renderable.addAnimation("little_table", [0]);
        this.renderable.addAnimation("sofa", [1]);
        this.renderable.addAnimation("tv", [2]);
        this.renderable.addAnimation("lamp", [3]);
        this.renderable.addAnimation("medium_table", [4]);
        this.renderable.addAnimation("big_table", [5]);
        this.renderable.addAnimation("chair", [6]);
        this.renderable.addAnimation("green_sofa", [7]);
        this.renderable.addAnimation("trash", [9]);
        this.renderable.addAnimation("table_napperon", [10]);
        this.renderable.addAnimation("table_lamp", [11]);
        this.renderable.addAnimation("plant", [12]);
        this.renderable.addAnimation("ironing_board", [13]);
        this.renderable.addAnimation("flower", [14]);
        this.renderable.setCurrentAnimation(settings.type);

        this.weight = 1;
        this.height = settings.spriteheight;
        this.width = settings.spritewidth; 
    },
    update: function () {
        if (this.hasMoved == true) {
        
            this.hasMoved == false;
        }
        

        this.moved = false ;
        
        if (this.pushed == "left") {
            this.moved = true;
            if (this.pos.x%32 != 0) {
                this.pos.x -= 3;
                var mod = this.pos.x%32;if (mod <0){mod+=32;}
                if (mod>29) {
                    this.pos.x = 32 * Math.floor(this.pos.x/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "right") {
            this.moved = true;
            if (this.pos.x%32 != 0) {
                this.pos.x += 3;
                if (this.pos.x%32<3) {
                    this.pos.x = 32 * Math.floor(this.pos.x/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "top") {
            this.moved = true;
            if (this.pos.y%32 != 0) {
                this.pos.y -= 3;
                var mod = this.pos.y%32;if (mod <0){mod+=32;}
                if (mod>29) {
                    this.pos.y = 32 * Math.floor(this.pos.y/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "bottom") {
            this.moved = true;
            if (this.pos.y%32 != 0) {
                this.pos.y += 3;
                if (this.pos.y%32<3) {
                    this.pos.y = 32 * Math.floor(this.pos.y/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }
        
        if (!this.pushed) {
            this.hardPos = getGridPos(this.pos);
            if (this.hardPos.x>=xmax || this.hardPos.x<0 || this.hardPos.y>=ymax || this.hardPos.y<0) {
                curMap[this.hardPos.x][this.hardPos.y]=-2;
                itemsLeft--;
                if (itemsLeft == 0) {
                    if (me.levelDirector.getCurrentLevelId() == "delta6")
                        me.state.change(me.state.CREDITS);
                    else {
                        LevelCount++;
                        me.game.remove(this);
                        me.levelDirector.nextLevel();
                        return false;
                    }
                }
                me.audio.play("snd_out");
                me.game.remove(this);
            }else{
                if (ppMap[this.hardPos.x][this.hardPos.y]) {
                    var btn = ppMap[this.hardPos.x][this.hardPos.y];
                    if (!btn.tp) {
                        btn.renderable.setCurrentAnimation(btn.tag+"_on");
                        var tag = btn.tag;
                        for (var x in curMap) {
                            for (var y in curMap[x]) {
                                if (curMap[x][y].wall && curMap[x][y].tag == ("p" + tag)) {
                                    me.audio.play("snd_buttons");
                                    me.game.remove(curMap[x][y]);
                                    curMap[x][y]=0;
                                }
                            }
                        }
                    }else if(this.moved && btn.tp && btn.tag){
                        if (curMap[btn.tag.x][btn.tag.y] == 0) {
                            curMap[this.hardPos.x][this.hardPos.y]=0;
                            this.hardPos.x=btn.tag.x;
                            this.hardPos.y=btn.tag.y;
                            curMap[this.hardPos.x][this.hardPos.y]=this;
                            this.pos.x=32*this.hardPos.x;
                            this.pos.y = 32 * this.hardPos.y;
                            me.audio.play("snd_teleport");
                        }
                    }
                }
            }
        }



        /*var res = me.game.collide(this);
        if (res)
            console.log(res.obj.type);*/

        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent(this);
            return true;
        }

        return true;
    }
});


var RemainingItemsHUD = me.HUD_Item.extend({
    init: function (x, y) {
        this.parent(x, y);

        this.text = new me.Font('arial', 24);
    },
    draw: function (context) {
        this.font.draw(context, me.video.getWidth() - 50, 10);
    }
});

var SwitchEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.type = "switch";
        this.renderable.addAnimation("trap", [0]);
        this.renderable.addAnimation("trap2", [1]);
        this.renderable.addAnimation("vert_door", [2]);
        this.renderable.addAnimation("hor_door", [3]);
        this.renderable.addAnimation("button_off", [4]);
        this.renderable.addAnimation("button_on", [5]);
        this.renderable.addAnimation("blue_portal", [6]);
        this.renderable.addAnimation("orange_portal", [7]);
        this.renderable.addAnimation("ppp1", [8]);
        this.renderable.addAnimation("ppp3", [10]);
        this.renderable.addAnimation("ppp2", [12]);
        this.renderable.addAnimation("pp1_off", [14]);
        this.renderable.addAnimation("pp1_on", [15]);
        this.renderable.addAnimation("pp2_off", [16]);
        this.renderable.addAnimation("pp2_on", [17]);
        this.renderable.addAnimation("pp3_off", [18]);
        this.renderable.addAnimation("pp3_on", [19]);
        this.renderable.setCurrentAnimation(settings.type);
    },
    update: function () {
        return true;
    }
});
