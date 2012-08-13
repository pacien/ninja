var Montage = require("montage/core/core").Montage;

var cmObject = require("ninjaapp/js/models/color-model"),
   cm = cmObject.ColorModel;

console.log(cm);

describe('ColorManager', function() {
    /** **************** alpha tests **************** */
    describe('alpha', function() {
        it('default is 1', function() {
            expect(cm.alpha).toEqual(1);
        });
        it('can be set/get', function() {
            cm.alpha = 0.2;
            expect(cm.alpha).toEqual(0.2);
        });
    });


    /** **************** rgbToHex() tests **************** */
    describe('rgbToHex()', function() {
        it('rgbToHex(0,0,0) is 000000/black', function() {
            var hex = cm.rgbToHex(0,0,0);
            expect(hex).toEqual("000000");
        });
        it('rgbToHex(255,255,255) is FFFFFF/white', function() {
            var hex = cm.rgbToHex(255,255,255);
            expect(hex).toEqual("FFFFFF");
        });
        it('rgbToHex(255,0,0) is FF0000/red', function() {
            var hex = cm.rgbToHex(255,0,0);
            expect(hex).toEqual("FF0000");
        });
        it('rgbToHex(0,255,0) is 00FF00/green', function() {
            var hex = cm.rgbToHex(0,255,0);
            expect(hex).toEqual("00FF00");
        });
        it('rgbToHex(0,0,255) is 0000FF/blue', function() {
            var hex = cm.rgbToHex(0,0,255);
            expect(hex).toEqual("0000FF");
        });
        it('rgbToHex(255,160,122) is FFA07A/salmon', function() {
            var hex = cm.rgbToHex(255,160,122);
            expect(hex).toEqual("FFA07A");
        });
    });


    /** **************** rgbToHsl() tests **************** */
    describe('rgbToHsl()', function() {
        it('rgbToHsl(0,0,0) is {h:0, s:0, l:0}/black', function() {
            var value = cm.rgbToHsl(0,0,0);
            expect(value.h).toEqual(0);
            expect(value.s).toEqual(0);
            expect(value.l).toEqual(0);
        });
        it('rgbToHsl(255,255,255) is {h:0, s:0, l:100}/white', function() {
            var value = cm.rgbToHsl(255,255,255);
            expect(value.h).toEqual(0);
            expect(value.s).toEqual(0);
            expect(value.l).toEqual(100);
        });
        it('rgbToHsl(255,0,0) is {h:0, s:100, l:50}/red', function() {
            var value = cm.rgbToHsl(255,0,0);
            expect(value.h).toEqual(0);
            expect(value.s).toEqual(100);
            expect(value.l).toEqual(50);
        });
        it('rgbToHsl(0,255,0) is {h:120, s:100, l:50}/green', function() {
            var value = cm.rgbToHsl(0,255,0);
            expect(value.h).toEqual(120);
            expect(value.s).toEqual(100);
            expect(value.l).toEqual(50);
        });
        it('rgbToHsl(0,0,255) is {h:240, s:100, l:50}/blue', function() {
            var value = cm.rgbToHsl(0,0,255);
            expect(value.h).toEqual(240);
            expect(value.s).toEqual(100);
            expect(value.l).toEqual(50);
        });
        it('rgbToHsl(255,160,122) is {h:17.14, s:100, l:73.92}/salmon', function() {
            var value = cm.rgbToHsl(255,160,122);
            expect(value.h).toEqual(17.142857142857142);
            expect(value.s).toEqual(100);
            expect(value.l).toEqual(73.92156862745098);
        });
    });


    /** **************** hexToRgb() tests **************** */
    describe('hexToRgb()', function() {
        it('hexToRgb(000000) is {r:0, g:0, b:0}', function() {
            var value = cm.hexToRgb("000000");
            expect(value.r).toEqual(0); // red channel
            expect(value.g).toEqual(0); // green channel
            expect(value.b).toEqual(0); // blue channel
        });
        it('hexToRgb(FFFFFF) is {r:255, g:255, b:255}', function() {
            var value = cm.hexToRgb("FFFFFF");
            expect(value.r).toEqual(255); // red channel
            expect(value.g).toEqual(255); // green channel
            expect(value.b).toEqual(255); // blue channel
        });
        it('hexToRgb(FF0000) is {r:255, g:0, b:0}', function() {
            var value = cm.hexToRgb("FF0000");
            expect(value.r).toEqual(255); // red channel
            expect(value.g).toEqual(0);   // green channel
            expect(value.b).toEqual(0);   // blue channel
        });
        it('hexToRgb(00FF00) is {r:0, g:255, b:0}', function() {
            var value = cm.hexToRgb("00FF00");
            expect(value.r).toEqual(0);   // red channel
            expect(value.g).toEqual(255); // green channel
            expect(value.b).toEqual(0);   // blue channel
        });
        it('hexToRgb(0000FF) is {r:0, g:0, b:255}', function() {
            var value = cm.hexToRgb("0000FF");
            expect(value.r).toEqual(0);   // red channel
            expect(value.g).toEqual(0);   // green channel
            expect(value.b).toEqual(255); // blue channel
        });
        it('hexToRgb(FFA07A) is {r:255, g:160, b:122}', function() {
            var value = cm.hexToRgb("FFA07A");
            expect(value.r).toEqual(255); // red channel
            expect(value.g).toEqual(160); // green channel
            expect(value.b).toEqual(122); // blue channel
        });
    });
});