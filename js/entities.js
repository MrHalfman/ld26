/// <reference path="melonJS-0.9.7.js" />
console.log("Commit 69");
var PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(3, 3); // Init values : 3; 15
        this.setFriction(0.2, 0.2);
        this.type = "player";
        me.game.viewport.follow(this, me.game.viewport.AXIS.HORIZONTAL);
        this.gravity = 0;
        this.collidable = true;
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");

        this.renderable.addAnimation("walk", [0]);
        this.renderable.addAnimation("push", [1]);
        this.renderable.setCurrentAnimation("walk");
    },

    update: function () {
        if (me.input.isKeyPressed('left')) {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.flipX(true);
        } else if (me.input.isKeyPressed('right')) {
            this.vel.x += this.accel.x * me.timer.tick;
            this.flipX(false);
        }

        if (me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick;
        } else if (me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick;
        }

        this.updateMovement();


        // Check if moved
        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent();
            return true;
        }

        return false;
    }
})

var MoveableItem = me.ObjectEntity.extend({
    //We can move this entity.
    // ==> Check for collide
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = true;
        this.setVelocity(3, 3);
        this.gravity = 0;
        /*this.renderable = new me.AnimationSheet(0, 0, "furnitures", 16, 16);
        settings.spritewidth = 16;
        settings.spriteheight = 16;*/
        this.renderable.addAnimation("sofa", [1]);
        this.renderable.setCurrentAnimation(settings.type);
        this.weight = 1;
        me.input.bindKey(me.input.KEY.ENTER, "push");
    },
    update: function () {
        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent();
            return true;
        }
        
        var res = me.game.collide(this);
        if (res) {
            if (res.obj.type == "player") {
                if (me.input.isKeyPressed('push')) {
                    this.vel.x = res.obj.vel.x / this.weight;
                    this.vel.y = res.obj.vel.y / this.weight;
                } else {
                    res.obj.vel.x = 0;
                    res.obj.vel.y = 0;
                }
            }
            this.updateMovement();
        }
        return false;
    }
});

