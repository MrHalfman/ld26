/// <reference path="melonJS-0.9.7.js" />
var IsDummy = false,
    PlayerDirection = "top",
    selectedItem = null,
    selectedSprite,
    playerEntityGuid;


function getSmoothGridPos(pos) {
    return { x: pos.x / 32, y: pos.y / 32 };
}

function getGridPos(pos) {
    var rep = getSmoothGridPos(pos);
    rep.x = Math.floor(rep.x + 0.5);
    rep.y = Math.floor(rep.y + 0.5);
    return rep;
}

function generateMap(player) {
    var map = me.game.currentLevel ;
    
    var rep = {};
    for (var x = -2, xmax= map.cols+2;x<xmax;x++) {
        var col = {};
        for (var y = -2, ymax= map.rows+2;y<ymax;y++) {
            var cell = 0;
            if (x<0||x>=map.cols||y<0||y>=map.rows) {
                cell = -2 ; //extérieur
            }
            col[y]=cell;
        }   
        rep[x]=col;
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
                            entity.type="sofa";
                            entity.width=32;
                            entity.x=32*parseInt(x);
                            entity.y=32*parseInt(y);
                            entity.z=5;
                            
                            var obj = me.entityPool.newInstanceOf(entity.name, entity.x, entity.y, entity);
                            if (obj) {
                                me.game.add(obj, 5);
                            }       
                            rep[x][y]=obj;
                            
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
            "jumpover": false,
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
    usePower: function (power) {
        if (this.power[power] && selectedItem) {
            var SelectedEntity = me.game.getEntityByGUID(selectedItem);
            switch (power) {
                case "jumpover":
                    // Jumping over an item
                switch (PlayerDirection) {
                        case "top":
                            this.pos.y = SelectedEntity.pos.y + 2;
                            break;
                        case "left":
                            this.pos.x = SelectedEntity.pos.x - 2;
                            break;
                        case "bottom":
                            this.pos.y = SelectedEntity.pos.y - SelectedEntity.height - 2;
                            break;
                        case "right":
                            this.pos.x = SelectedEntity.pos.x + SelectedEntity.width + 2;
                            break;
                        default:
                            console.log("Error: can't recognise direction");
                            break;
                    }
                    break;

                case "pull":
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
            }
            this.power[power] = false;
        }
    },
    gridMovement: function () {

        
    },
    update: function () {
        
        
        if (!IsDummy) {
            var Dummy = new DummySelector(this.pos.x + (this.width/2), this.pos.y + (this.height/2), { direction: PlayerDirection });
            me.game.add(Dummy, this.z);
            me.game.sort();
        }
        if (!this.moving) {
            if (me.input.isKeyPressed('left')) {
                this.changedirection("left");
                var destination = curMap[this.hardPos.x-1][this.hardPos.y];
                if ( destination != -2 && destination != -1 ) {
                    var move = true ;
                    if (destination != 0) {
                        if (destination.name="Box") {
                            if (curMap[this.hardPos.x-2][this.hardPos.y]!=0 && curMap[this.hardPos.x-2][this.hardPos.y]!=-2) {
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
                            if (curMap[this.hardPos.x+2][this.hardPos.y]!=0 && curMap[this.hardPos.x+2][this.hardPos.y]!=-2) {
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
                            if (curMap[this.hardPos.x][this.hardPos.y-2]!=0 && curMap[this.hardPos.x][this.hardPos.y-2]!=-2) {
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
                            if (curMap[this.hardPos.x][this.hardPos.y+2]!=0 && curMap[this.hardPos.x][this.hardPos.y+2]!=-2) {
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
                    if (this.pos.x%32>29) {
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
                    if (this.pos.y%32>29) {
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
        this.updateMovement();

        this.sGridPos = getSmoothGridPos(this.pos);
        this.prevSGridPos = getSmoothGridPos(this.lastPositions);
        var save = { x: this.hardPos.x, y: this.hardPos.y };
        if (this.hardPos.y != save.y || this.hardPos.x != save.x) {
            this.lastHardPos.x = save.x
            this.lastHardPos.y = save.y
        }
        this.lastPositions = { x: this.pos.x, y: this.pos.y };
        return false;
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
                if (this.pos.x%32>29) {
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
                if (this.pos.y%32>29) {
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
                me.game.remove(this);
            }
        }


        this.updateMovement();
        /*var res = me.game.collide(this);
        if (res)
            console.log(res.obj.type);*/

        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent(this);
            return true;
        }

        return false;
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

        return false;
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

var CheckEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
    },
    update: function () {
        var res = me.game.collideType(this, "moveableitem");
        if (res) {
            me.game.remove(res.obj);
        }
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
