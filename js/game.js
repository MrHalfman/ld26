/// <reference path="melonJS-0.9.7.js" />
/// <reference path="entities.js" />
var game = {
    assets: [
        { name: "level1", type: "tmx", src: "http://ludum.quantum-softwares.com/datas/maps/level1.tmx" },
        { name: "metatiles16x16", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/metatiles16x16.png" },
        { name: "Moquette", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/moquette.png" },
        { name: "furnitures", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/furnitures26.png" },
        { name: "metaset", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/metaset.png" },
        { name: "walls", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/walls.png" },
        { name: "character", type: "image", src: "http://ludum.quantum-softwares.com/datas/sprites/character.png" },
        { name: "alpha1", type: "tmx", src: "http://ludum.quantum-softwares.com/datas/maps/alpha1.tmx" },
        { name: "meta", type: "image", src: "http://ludum.quantum-softwares.com/datas/tilesets/metaset2.png" },
        { name: "selected", type: "image", src: "http://ludum.quantum-softwares.com/datas/sprites/select.png" }
    ],
    onload: function () {
        if (!me.video.init('screen', 800, 600, true)) {
            alert("This browser does not support HTML5 canvas");
            return;
        }

        me.video.setImageSmoothing(false);

        me.audio.init("mp3, ogg");
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.assets);
        me.state.change(me.state.LOADING);
    },
    loaded: function () {
        me.state.set(me.state.PLAY, new PlayScreen());

        me.state.transition("fade", "#FFFFF", 250);

        me.entityPool.add("PlayerEntity", PlayerEntity);
        me.entityPool.add("MoveableItem", MoveableItem);
        me.entityPool.add("DummySelector", DummySelector);
        me.entityPool.add("Selector", Selector);

        me.state.change(me.state.PLAY);
    }
};

var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        me.levelDirector.loadLevel("alpha1");
    }
});

window.onReady(function onReady() {
    game.onload();
});

me.debug.renderHitBox = true; // Displays hitboxes & movement vectors.