var game = {
    assets: [
        {name: "level1", type: "tmx", src: "../datas/maps/level1.tmx"}
    ],
    onload: function () {
        if (!me.video.init('screen', 800, 600, true, 'auto')) {
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

        /*
            Entity pool here
        */
        me.state.change(me.state.PLAY);
    }
};

var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        me.levelDirector.loadLevel("level1");
    }
});

window.onReady(function onReady() {
    game.onload();
});