/// <reference path="melonJS-0.9.7.js" />
var IsDummy = false, PlayerDirection = "top", selectedItem = null, selectedSprite;
console.log("Commit 144");
var PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(2, 2);
        this.setMaxVelocity(2, 2);
        this.setFriction(0.5, 0.5);
        this.type = "player";
        me.game.viewport.follow(this, me.game.viewport.AXIS.HORIZONTAL);
        this.gravity = 0;
        this.collidable = true;
        this.width = settings.spritewidth;
        this.height = settings.spriteheight;

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
        this.lastPositions = { x: this.pos.x, y: this.pos.y };
        this.collisiondInterp = 4;
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
                    // Jump over the selected item
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
    update: function () {
        if (!IsDummy) {
            var Dummy = new DummySelector(this.pos.x + (this.width/2), this.pos.y + (this.height/2), { direction: PlayerDirection });
            me.game.add(Dummy, this.z);
            me.game.sort();
        }

        if (me.input.isKeyPressed('left')) {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.changedirection("left");
        } else if (me.input.isKeyPressed('right')) {
            this.vel.x += this.accel.x * me.timer.tick;
            this.changedirection("right");
        }

        if (me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick;
            this.changedirection("top");
        } else if (me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick;
            this.changedirection("bottom");
        }

        this.updateMovement();
        var res = me.game.collideType(this,"moveableitem");
        var moveAllowed = true;
        if (res) {
            if (me.input.isKeyPressed("push")) {
                res.obj.vel.x = this.vel.x;
                res.obj.vel.y = this.vel.y;
            } else {
                moveAllowed = false;
                this.vel.x = 0;
                this.vel.y = 0;
                this.pos.y -= res.y;
                this.pos.x -= res.x;
                return false;
            }
        }

        // Check if moved
        if (moveAllowed) {
            this.lastPositions = { x: this.pos.x, y: this.pos.y };
            return true;
        } else {
            this.pos = { x: this.lastPositions.x, y: this.lastPositions.y };
        }
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
        /*this.renderable = new me.AnimationSheet(0, 0, "furnitures", 16, 16);
        settings.spritewidth = 16;
        settings.spriteheight = 16;*/
        this.renderable.addAnimation("sofa", [1]);
        this.renderable.setCurrentAnimation(settings.type);
        this.weight = 1;
        this.height = settings.spriteheight;
        this.width = settings.spritewidth;
    },
    update: function () {
        if (this.hasMoved == true) {
            // Todo : %32 position.
            this.hasMoved == false;
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