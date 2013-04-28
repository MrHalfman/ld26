/// <reference path="melonJS-0.9.7.js" />

var SpellButton = new me.GUI_Object.extend({
    init: function (x, y, settings) {
        settings = {};
        this.isClickable = true;
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        this.spell = settings.spell;
        this.parent(x, y, settings);
    },
    onClick: function () {
        var MainPlayer = me.game.getEntityByGUID(playerEntityGuid);
        MainPlayer.usePower(this.spell);
    }
});