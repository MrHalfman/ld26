/// <reference path="melonJS-0.9.7.js" />
/// <reference path="entities.js" />
var game = {
    assets: [
        { name: "level1", type: "tmx", src: "datas/maps/level1.tmx" },
        { name: "metatiles16x16", type: "image", src: "datas/tilesets/metatiles16x16.png" },
        { name: "Moquette", type: "image", src: "datas/tilesets/moquette.png" },
        { name: "furnitures", type: "image", src: "datas/tilesets/furnitures26.png" },
        { name: "metaset", type: "image", src: "datas/tilesets/metaset.png" },
        { name: "walls", type: "image", src: "datas/tilesets/walls.png" },
        { name: "character", type: "image", src: "datas/sprites/character.png" },
        { name: "alpha1", type: "tmx", src: "datas/maps/alpha1.tmx" },
        { name: "meta", type: "image", src: "datas/tilesets/metaset2.png" },
        { name: "selected", type: "image", src: "datas/sprites/select.png" },
        { name: "MainThemeEssai1", type: "audio", src: "datas/sounds/" }
    ],
    onload: function () {
        if (!me.video.init('screen', 800, 600, true)) {
            alert("This browser does not support HTML5 canvas");
            return;
        }

        me.video.setImageSmoothing(false);

        me.audio.init("mp3");
        me.audio.enable();
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.assets);
        me.state.change(me.state.LOADING);
    },
    loaded: function () {
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.MENU, new StartScreen());

        me.state.transition("fade", "#FFFFF", 250);

        me.entityPool.add("PlayerEntity", PlayerEntity);
        me.entityPool.add("MoveableItem", MoveableItem);
        me.entityPool.add("DummySelector", DummySelector);
        me.entityPool.add("Selector", Selector);

        me.state.change(me.state.MENU);
    }
};

var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        me.levelDirector.loadLevel("alpha1");
    }
});

var StartScreen = me.ScreenObject.extend({
    init: function () {
        this.parent(true);
        this.logo = new me.Font('century gothic', 32, 'white');
        this.presstoplay = new me.font('century gothic', 24, 'white');
        this.invalidate = false;
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.ENTER, "use");
        me.audio.playTrack("MainThemeEssai1");
    },
    draw: function (context) {
        me.video.clearSurface(context, "black");

        logo_width = this.logo.measureText(context, "Shrink Shift").width;
        presstoplay_width = this.logo.measureText(context, "Press enter to play.").width;
        this.logo.draw(context,
                        "Shrink Shift",
                        ((me.video.getWidth() - logo_width) / 2),
                        (me.video.getHeight()) / 2);
        this.presstoplay.draw(context,
                        "Press enter to play.",
                        ((me.video.getWidth() - presstoplay_width) / 2),
                        (me.video.getHeight() + 60) / 2);
    },
    update: function () {
        if (me.input.isKeyPressed("use"))
            me.state.change(me.state.PLAY);
    },
    onDestroyEvent: function () {
        this.logo = null;
    }
})

window.onReady(function onReady() {
    game.onload();
});

me.debug.renderHitBox = false; // Displays hitboxes & movement vectors.