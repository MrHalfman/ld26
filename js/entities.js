/// <reference path="melonJS-0.9.7.js" />
var IsDummy = false, PlayerDirection = "top", selectedItem = null;
console.log("Commit 144");

var PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(3, 3); // Init values : 3; 15
        this.setFriction(0.2, 0.2);
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
    },
    changedirection: function (direction) {
        PlayerDirection = direction;
        this.renderable.setCurrentAnimation("walk" + direction);
    },
    usePower: function (power) {
        if (this.power[power]) {
            switch (power) {
                case "jumpover":
                    // Jumping over an item
                    break;
                case "pull":
                    // Pull an item
                    break;
                case "putbehind":
                    // Take an item and put it behind the player
                    break;
                case "superpush":
                    // Pushing 2 items at a time
                    break;
                case "doorbypass":
                    // Opens any door
                    break;
                case "remove":
                    // Removes an item
                    break;
                default:
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
        var res = me.game.collide(this);
        if (res && res.obj.type == "moveableitem") {
            if (this.vel.x != 0 || this.vel.y != 0) {
                this.vel.x = 0;
                this.vel.y = 0;
                //res.obj.setOpacity(0.5); Todo : add opacity effect
                if (res.y > 0) {
                    if (me.input.isKeyPressed('push')) {
                        res.obj.pos.y += 3;
                        res.obj.hasMoved = true;
                    }
                    this.pos.y -= 3;
                } else if (res.y < 0) {
                    if (me.input.isKeyPressed('push')) {
                        res.obj.pos.y -= 3;
                        res.obj.hasMoved = true;
                    }
                    this.pos.y += 3
                } else if (res.x > 0) {
                    if (me.input.isKeyPressed('push')) {
                        res.obj.pos.x += 3;
                        res.obj.hasMoved = true;
                    }
                    this.pos.x -= 3;
                } else if (res.x < 0) {
                    if (me.input.isKeyPressed('push')) {
                        res.obj.pos.x -= 3;
                        res.obj.hasMoved = true;
                    }
                    this.pos.x += 3;
                }
            }
            this.updateMovement();
            this.parent(this);
            return true;
        }

        // Check if moved
        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent(this);
            return true;
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
        this.gravity = 0;
        this.hasMoved = false;
        /*this.renderable = new me.AnimationSheet(0, 0, "furnitures", 16, 16);
        settings.spritewidth = 16;
        settings.spriteheight = 16;*/
        this.renderable.addAnimation("sofa", [1]);
        this.renderable.setCurrentAnimation(settings.type);
        this.weight = 1;
    },
    update: function () {
        if (this.hasMoved == true) {
            // Todo : %32 position.
            this.hasMoved == false;

        }

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
        this.setVelocity(0.1, 0.1);
        this.ttl = 10; // Time to live before removing
        this.collidable = true;
        this.gravity = 0;
        this.direction = settings.direction;
        this.updateColRect(0, 2, 0, 2);
        IsDummy = true;
    },
    update: function () {
        if (this.ttl > 0) {
            this.ttl--;
        } else {
            me.game.remove(this);
            IsDummy = false;
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
        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent(this);
            return true;
        }

        var res = me.game.collide(this);
        if (res)
            console.log(res.obj.type);
        if (res && res.obj.type == "moveableitem") {
            me.game.remove(this);
            IsDummy = false;
            selectedItem = res.obj.GUID;
            console.log(selectedItem);
            // TODO : Add selected effect, so the player can see it.
        }
        return false;
    }
});