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
            switch (me.levelDirector.getCurrentLevelId()) {
                case "alpha1":
                case "alpha2":
                case "alpha3":
                case "alpha4":
                case "alpha5":
                case "alpha6":
                    me.audio.stopTrack();
                    me.audio.playTrack("theme2");
                    break;
                case "beta1":
                case "beta2":
                case "beta3":
                case "beta4":
                case "beta5":
                case "beta6":
                    me.audio.stopTrack();
                    me.audio.playTrack("theme3");
                    break;
                case "gamma1":
                case "gamma2":
                case "gamma3":
                case "gamma4":
                case "gamma5":
                case "gamma6":
                    me.audio.stopTrack();
                    me.audio.playTrack("theme4");
                    break;
                case "delta1":
                case "delta2":
                case "delta3":
                case "delta4":
                case "delta5":
                case "delta6":
                    me.audio.stopTrack();
                    me.audio.playTrack("theme5");
                    break;
                case "epsilon1":
                    me.audio.stopTrack();
                    me.audio.playTrack("theme6");
                default:
                    break;
            }
        } else {
            MutedSound = true;
            me.audio.stopTrack();
        }
    }
})