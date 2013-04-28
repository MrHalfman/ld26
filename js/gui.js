﻿/// <reference path="melonJS-0.9.7.js" />

var SpellButton = me.GUI_Object.extend({
    init: function (x, y, settings) {
        this.isClickable = true;
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        this.spell = settings.spell;
        this.parent(x, y, settings);
    },
    onClick: function () {
        var MainPlayer = me.game.getEntityByGUID(playerEntityGuid);
        MainPlayer.usePower(this.spell);
        console.log("Clicked on " + this.spell + " button");
    }
});

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