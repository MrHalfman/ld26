/// <reference path="melonJS-0.9.7.js" />
var IsDummy = false,
    PlayerDirection = "top",
    selectedItem = null,
    selectedSprite,
    playerEntityGuid;
var itemsLeft ;
var waitingPower=false ;

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
function generateMap(player) {
    
    
<<<<<<< HEAD
    
    
    
    
=======
    me.game.add(new SpellButton(40, 10, { image: "doorbypass", spell: "doorbypass" }), 10);
    me.game.add(new SpellButton(80, 10, { image: "pull", spell: "pull" }), 10);
    me.game.add(new SpellButton(120, 10, { image: "jumpover", spell: "jumpover" }), 10);
    me.game.add(new SpellButton(160, 10, { image: "putbehind", spell: "putbehind" }), 10);
    me.game.add(new SpellButton(200, 10, { image: "remove", spell: "remove" }), 10);
    me.game.add(new SoundButton(5, 10));

>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
    
    var map = me.game.currentLevel ;
    
    player.power = {
        "jumpover": false,
        "pull": false,
        "putbehind": false,
        "superpush": false,
        "doorbypass": false,
        "remove": false
    };
    switch (me.levelDirector.getCurrentLevelId()) {
        case "alpha1":
            me.audio.playTrack("theme1");
            break;
        case "beta1":
            me.audio.stopTrack();
            me.audio.playTrack("theme2");
            player.power.jumpover = 1;
            break;
        case "gamma1":
            me.audio.stopTrack();
            me.audio.playTrack("theme3");
            break;
        case "delta1":
            me.audio.stopTrack();
            me.audio.playTrack("theme4");
            break;
        case "epsilon1":
            me.audio.stopTrack();
            me.audio.playTrack("theme5");
        default:
            break;

    }
    var rep = {};
    trapMap = {};
    for (var x = -2, xmax= map.cols+2;x<xmax;x++) {
        var col = {};
        var trapCol = {};
        for (var y = -2, ymax= map.rows+2;y<ymax;y++) {
            var cell = 0;
            if (x<0||x>=map.cols||y<0||y>=map.rows) {
                cell = -2 ; //extérieur
            }
            col[y] = cell;
            trapCol[y] = trapCell = 0;
        }   
        rep[x] = col;
        trapMap[x] = trapCol;
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
                }else{
                    switch (dir) {
                        case "up":
<<<<<<< HEAD
                            if (curMap[this.hardPos.x][this.hardPos.y-1].name=="box" && curMap[this.hardPos.x][this.hardPos.y-2]==0){
=======
                            if ((curMap[this.hardPos.x][this.hardPos.y-1].name+'').toLowerCase()=="box" && curMap[this.hardPos.x][this.hardPos.y-2]==0){
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
                                curMap[this.hardPos.x][this.hardPos.y-2]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.y-=2;
                                this.pos.y-=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                        case "left":
<<<<<<< HEAD
                            if (curMap[this.hardPos.x-1][this.hardPos.y].name=="box" && curMap[this.hardPos.x-2][this.hardPos.y]==0){
=======
                            if ((curMap[this.hardPos.x-1][this.hardPos.y].name+'').toLowerCase()=="box" && curMap[this.hardPos.x-2][this.hardPos.y]==0){
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
                                curMap[this.hardPos.x-2][this.hardPos.y]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.x-=2;
                                this.pos.x-=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
<<<<<<< HEAD
                        case "bottom":
                            if (curMap[this.hardPos.x][this.hardPos.y+1].name=="box" && curMap[this.hardPos.x][this.hardPos.y+2]==0){
=======
                        case "down":
                            if ((curMap[this.hardPos.x][this.hardPos.y+1].name+'').toLowerCase()=="box" && curMap[this.hardPos.x][this.hardPos.y+2]==0){
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
                                curMap[this.hardPos.x][this.hardPos.y+2]=this;
                                curMap[this.hardPos.x][this.hardPos.y]=0;
                                this.hardPos.y+=2;
                                this.pos.y+=33;
                                this.moving=true;
                                this.power[power] -- ;
                            }
                        break;
                        case "right":
<<<<<<< HEAD
                            if (curMap[this.hardPos.x+1][this.hardPos.y].name=="box" && curMap[this.hardPos.x+2][this.hardPos.y]==0){
=======
                            if ((curMap[this.hardPos.x+1][this.hardPos.y].name+'').toLowerCase()=="box" && curMap[this.hardPos.x+2][this.hardPos.y]==0){
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
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
                } 
             /*   case "pull":
                    // Pull an item
	            switch (PlayerDirection) {
                        case "top":
                            SelectedEntity.pos.y -= 32;
                            this.pos.y -= 32;
                            break;
                        case "left":
                            SelectedEntity.pos.x -= 32;
                            this.pos.y -= 32;
                            break;
                        case "bottom":
                            SelectedEntity.pos.y += 32;
                            this.pos.y += 32;
                            break;
                        case "right":
                            SelectedEntity.pos.x += 32;
                            this.pos.x += 32;
                            break;
                        default:
                            console.log("Error: can't recognise direction");
                    }
                    break;
                case "putbehind":
                    // Put the selected item behind player
                    switch (PlayerDirection) {
                        case "top":
                            SelectedEntity.pos.y = this.pos.y + this.height + 2;
                            break;
                        case "left":
                            SelectedEntity.pos.x = this.pos.x - this.width - 2;
                            break;
                        case "right":
                            SelectedEntity.pos.x = this.pos.x + this.width + 2;
                            break;
                        case "bottom":
                            SelectedEntity.pos.y = this.pos.y - this.height + 2;
                            break;
                        default:
                            console.log("Error: can't recognise direction");
                            break;
                    }
                    break;
                case "superpush":
                    // Pushing 2 items at a time
                    break;
                case "doorbypass":
                    // Opens any door
                    if (SelectedEntity.type == "switch")
                        SelectedEntity.toggle();
                    break;
                case "remove":
                    // Removes an item
                    me.game.remove(SelectedEntity);
                    break;
                default:
                    console.log("Error: can't find spell.");
                    break;
            */
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

        if (me.input.isKeyPressed("nextLevel") && me.game.currentLevel.levelId != "beta6") {
            me.game.remove(this);
            me.levelDirector.nextLevel();
            return false;
        }
        if (me.input.isKeyPressed("previousLevel") && me.game.currentLevel.levelId != "alpha1") {
            me.game.remove(this);
            me.levelDirector.previousLevel();
            return false;
        }
        
        
        if (!IsDummy) {
            var Dummy = new DummySelector(this.pos.x + (this.width/2), this.pos.y + (this.height/2), { direction: PlayerDirection });
            me.game.add(Dummy, this.z);
            me.game.sort();
        }
        
        if (waitingPower) {
            
            
            if (me.input.isKeyPressed('left')) {
                this.changedirection("left");
                this.usePower(waitingPower,'left');
            } else if (me.input.isKeyPressed('right')) {
                this.changedirection("right");
                this.usePower(waitingPower,'right');
            } else if (me.input.isKeyPressed('up')) {
<<<<<<< HEAD
                this.changedirection("up");
                this.usePower(waitingPower,'up');
            } else if (me.input.isKeyPressed('down')) {
                this.changedirection("down");
=======
                this.changedirection("top");
                this.usePower(waitingPower,'up');
            } else if (me.input.isKeyPressed('down')) {
                this.changedirection("bottom");
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
                this.usePower(waitingPower,'down');
            }
            
        }else if (!this.moving) {
            if (me.input.isKeyPressed('left')) {
                this.changedirection("left");
                var destination = curMap[this.hardPos.x-1][this.hardPos.y];
                if ( destination != -2 && destination != -1 ) {
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
                if ( destination != -2 && destination != -1 ) {
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
                if ( destination != -2 && destination != -1 ) {
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
                if ( destination != -2 && destination != -1 )  {
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
        

        
        
        if (this.pushed == "left") {
            if (this.pos.x%32 != 0) {
                this.pos.x -= 3;
                var mod = this.pos.x%32;if (mod <0){mod+=32;}
                if (mod>29) {
                    this.pos.x = 32 * Math.floor(this.pos.x/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "right") {
            if (this.pos.x%32 != 0) {
                this.pos.x += 3;
                if (this.pos.x%32<3) {
                    this.pos.x = 32 * Math.floor(this.pos.x/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "top") {
            if (this.pos.y%32 != 0) {
                this.pos.y -= 3;
                var mod = this.pos.y%32;if (mod <0){mod+=32;}
                if (mod>29) {
                    this.pos.y = 32 * Math.floor(this.pos.y/32 + 0.5);
                    this.pushed = false ;
                }
            }
        }else if (this.pushed == "bottom") {
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
                if (itemsLeft==0) {
                    me.game.remove(this);
<<<<<<< HEAD
                    me.levelDirector.previousLevel();
                    //me.levelDirector.nextLevel();
=======
                    //me.levelDirector.previousLevel();
                    me.levelDirector.nextLevel();
>>>>>>> f58d8e8f7979888e623739777d5bc0de1c478332
                    return false;
                }
                me.game.remove(this);
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

var DummySelector = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(8, 8);
        this.ttl = 8; // Time to live before removing
        this.collidable = true;
        this.gravity = 0;
        this.type = "dummy";
        this.direction = settings.direction;
        this.updateColRect(0, 2, 0, 2);
        IsDummy = true;
    },
    update: function () {
        if (this.ttl > 0) {
            this.ttl--;
        } else {
            /*
                Todo : Remove selector properly */         
            var OldSelector = me.game.getEntityByGUID(selectedSprite);
            me.game.remove(OldSelector);
            me.game.remove(this);
            IsDummy = false;
            selectedItem = null;
        }
        switch (this.direction) {
            case "top":
                this.vel.y -= 3;
                break;
            case "bottom":
                this.vel.y += 3;
                break;
            case "left":
                this.vel.x -= 3;
                break;
            case "right":
                this.vel.x += 3;
                break;
            default:
                console.log("Error in dummy direction");
                break;
        }

        this.updateMovement();
        var res = me.game.collide(this);

        if (res && res.obj.type == "moveableitem" && selectedItem == null) {
            me.game.remove(this);
            IsDummy = false;
            selectedItem = res.obj.GUID;
            // console.log(selectedItem);
            // TODO : Add selected effect, so the player can see it.
            var SelectedImage = new Selector(res.obj.pos.x, res.obj.pos.y, { image: "selected", spritewidth: 32, spriteheight: 32 });
            me.game.add(SelectedImage, this.z);
            me.game.sort();
        }
         

        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent(this);
            return true;
        }

        return true;
    }
});

var Selector = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.renderable.addAnimation("selected", [0, 1, 2]);
        this.renderable.setCurrentAnimation("selected");
        selectedSprite = this.GUID;
    },
    update: function () {
        this.parent(this);

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
        this.renderable.setCurrentAnimation(settings.type);
    },
    update: function () {
        return true;
    }
});
