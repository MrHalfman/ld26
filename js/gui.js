/// <reference path="melonJS-0.9.7.js" />

var SoundButton = me.GUI_Object.extend({
    init: function (x, y) {
        settings = {};
        settings.image = "soundmute";
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        this.parent(x, y, settings);
    },
    onClick: function () {
        if (MutedSound) {
            MutedSound = false;
            me.audio.unmuteAll();
        } else {
            MutedSound = true;
            me.audio.muteAll();
        }
    }
})