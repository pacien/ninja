/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

var PropertyTrack = exports.PropertyTrack = Montage.create(Component, {

    /* ===- Begin Models ==== */
    hasTemplate:{
        value: true
    },

    trackEditorProperty:{
        value:""
    },

    animatedElement:{
        value:null
    },

    isSubproperty:{
        value:true
    },

    _propTweenRepetition:{
        value:null
    },
    propTweenRepetition:{
        get:function () {
            return this._propTweenRepetition;
        },
        set:function (newVal) {
            this._propTweenRepetition = newVal;
        }
    },

    _propTweens:{
        value:[]
    },
    propTweens:{
        serializable:true,
        get:function () {
            return this._propTweens;
        },
        set:function (newVal) {
            this._propTweens = newVal;
        }
    },

    _propTrackData:{
        value:false
    },
    propTrackData:{
        serializable:true,
        get:function () {
            return this._propTrackData;
        },
        set:function (val) {
            this._propTrackData = val;
            if (this._propTrackData) {
                this.setData();
            }
        }
    },

    nextKeyframe:{
        value:1
    },

    ninjaStylesContoller:{
        value:null
    },

    animationName:{
        value:null
    },

    currentKeyframeRule:{
        value:null
    },

    trackDuration:{
        value:0
    },

    _trackID:{
        value:null
    },
    trackID:{
        serializable:true,
        get:function () {
            return this._trackID;
        },
        set:function (value) {
            if (value !== this._trackID) {
                this._trackID = value;
            }
        }
    },

    _trackType:{
        value:null
    },
    trackType:{
        serializable:true,
        get:function () {
            return this._trackType;
        },
        set:function (value) {
            if (value !== this._trackType) {
                this._trackType = value;
            }
        }
    },

    _styleIndex:{
        value:null
    },
    styleIndex:{
        serializable:true,
        get:function () {
            return this._styleIndex;
        },
        set:function (value) {
            if (value !== this._styleIndex) {
                this._styleIndex = value;
            }
        }
    },

    setData:{
        value:function () {
            if (typeof(this.propTrackData) === "undefined") {
                return;
            }

            this.styleIndex = this.propTrackData.styleIndex;
            this.propTweens = this.propTrackData.propTweens;
            this.trackType = this.propTrackData.trackType;
            this.trackEditorProperty = this.propTrackData.trackEditorProperty;
            this.currentKeyframeRule = this.propTrackData.existingRule;
            this.needsDraw = true;
        }
    },
    /* ===- End Models ==== */

    /* ===- Begin Draw Cycle ==== */
    prepareForDraw:{
        value:function () {
            this.element.addEventListener("click", this, false);
            this.trackID = this.parentComponent.parentComponent.parentComponent.parentComponent.trackID;
            this.animatedElement = this.parentComponent.parentComponent.parentComponent.parentComponent.animatedElement;
            this.ninjaStylesContoller = this.application.ninja.stylesController;
        }
    },

    didDraw:{
        value:function () {
            if (this.currentKeyframeRule) {
                this.retrieveStoredStyleTweens();
            }
        }
    },
    /* ===- End Draw Cycle ==== */

    /* ===- Begin Event Handlers ==== */
    handleClick:{
        value:function (ev) {
            if (ev.shiftKey) {
                if (this.trackType == "position") {
                    this.parentComponent.parentComponent.parentComponent.parentComponent.handleNewTween(ev);
                }
                if (this.propTweens.length < 1) {
                    var selectIndex = this.application.ninja.timeline.getLayerIndexByID(this.trackID),
                    	currentSelectedStyleIndex = this.getCurrentSelectedStyleIndex(selectIndex);

                    if (this.trackType == "style") {
                    	if (this.application.ninja.timeline.arrLayers[selectIndex].layerData.arrLayerStyles[currentSelectedStyleIndex].editorProperty == null) {
                            console.log("Please enter a style property for this track before adding keyframes.");
                            return;
                        } else {
                            this.trackEditorProperty = this.application.ninja.timeline.arrLayers[selectIndex].layerData.arrLayerStyles[currentSelectedStyleIndex].editorProperty;
                        }
                        this.insertPropTween(0);
                        this.addPropAnimationRuleToElement(ev);
                        this.updatePropKeyframeRule();
                    } else if (this.trackType == "position") {

                    }
                } else {
                    this.handleNewPropTween(ev);
                    if (this.trackType == "style") {
                        this.updatePropKeyframeRule();
                    }
                }
            }
        }
    },

    handleNewPropTween:{
        value:function (ev) {
            if (ev.offsetX > this.propTweens[this.propTweens.length - 1].tweenData.keyFramePosition) {
                this.insertPropTween(ev.offsetX);
            } else {
                var findXOffset = function (obj) {
                    var curleft = 0;
                    if (obj.offsetParent) {
                        do {
                            curleft += (obj.offsetLeft - obj.scrollLeft);

                        } while (obj = obj.offsetParent);
                    }
                    return curleft;
                }
                var targetElementOffset = findXOffset(ev.currentTarget),
                    position = event.pageX - targetElementOffset;

                this.splitPropTweenAt(position - 18);
            }
        }
    },
    /* ===- End Event Handlers ==== */

    /* ===- Begin Controllers ==== */
    getCurrentSelectedStyleIndex: {
    	value: function(layerIndex) {
    		var returnVal = false,
    			i = 0,
    			arrLayerStylesLength = this.application.ninja.timeline.arrLayers[layerIndex].layerData.arrLayerStyles.length;
    		for (i = 0; i < arrLayerStylesLength; i++) {
    			var currItem =  this.application.ninja.timeline.arrLayers[layerIndex].layerData.arrLayerStyles[i];
    			if (currItem.isSelected === true) {
    				returnVal = i;
    			}
    		}
    		return returnVal;
    	}
    },

    insertPropTween:{
        value:function(clickPos){
            var selectedIndex = this.application.ninja.timeline.getLayerIndexByID(this.trackID);
            this.application.ninja.timeline.selectLayer(selectedIndex, true);

            var currentMillisecPerPixel = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80);
            var currentMillisec = currentMillisecPerPixel * clickPos;
            this.trackDuration = currentMillisec;

            var newTween = {};
            newTween.tweenData = {};
            newTween.tweenData.tweenedProperties = [];

            // TODO - check for color values vs px values and set the correct default
            var propVal = this.ninjaStylesContoller.getElementStyle(this.animatedElement, this.trackEditorProperty);
            if(propVal == null){
                propVal = "1px";
            }
            newTween.tweenData.tweenedProperties[this.trackEditorProperty] = propVal;

            if (clickPos == 0) {
                newTween.tweenData.spanWidth = 0;
                newTween.tweenData.keyFramePosition = 0;
                newTween.tweenData.keyFrameMillisec = 0;
                newTween.tweenData.tweenID = 0;
                newTween.tweenData.spanPosition = 0;

                this.propTweens.push(newTween);

            } else {
                newTween.tweenData.spanWidth = clickPos - this.propTweens[this.propTweens.length - 1].tweenData.keyFramePosition;
                newTween.tweenData.keyFramePosition = clickPos;
                newTween.tweenData.keyFrameMillisec = currentMillisec;
                newTween.tweenData.tweenID = this.nextKeyframe;
                newTween.tweenData.spanPosition = clickPos - newTween.tweenData.spanWidth;

                this.propTweens.push(newTween);

                this.nextKeyframe += 1;
            }

            this.application.ninja.currentDocument.model.needsSave = true;
        }
    },

    splitPropTweenAt:{
        value:function (position) {
            var i, j, nextComponentIndex,
                tweensLength = this.propTweens.length - 1,
                prevTween,
                nextTween,
                splitTweenIndex;

            for (i = 0; i < tweensLength; i++) {
                prevTween = this.propTweens[i].tweenData.keyFramePosition;
                nextTween = this.propTweens[i + 1].tweenData.keyFramePosition;
                if (position > prevTween && position < nextTween) {

                    splitTweenIndex = i + 1;

                    this.propTweens[i + 1].tweenData.spanPosition = position;
                    this.propTweens[i + 1].spanPosition = position;
                    this.propTweens[i + 1].tweenData.spanWidth = this.propTweens[i + 1].tweenData.keyFramePosition - position;
                    this.propTweens[i + 1].spanWidth = this.propTweens[i + 1].keyFramePosition - position;

                    for (j = 0; j < tweensLength + 1; j++) {
                        if (this.propTweenRepetition.childComponents[j].keyFramePosition === nextTween) {
                            nextComponentIndex = j;
                        }
                    }
                    this.propTweenRepetition.childComponents[nextComponentIndex].setData();

                    var newTweenToInsert = {};
                    newTweenToInsert.tweenData = {};
                    newTweenToInsert.tweenData.spanWidth = position - prevTween;
                    newTweenToInsert.tweenData.keyFramePosition = position;
                    newTweenToInsert.tweenData.keyFrameMillisec = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80) * position;
                    newTweenToInsert.tweenData.tweenID = this.propTweens.length;
                    newTweenToInsert.tweenData.spanPosition = position - newTweenToInsert.tweenData.spanWidth;
                    newTweenToInsert.tweenData.tweenedProperties = [];
                    newTweenToInsert.tweenData.tweenedProperties[this.trackEditorProperty] = this.ninjaStylesContoller.getElementStyle(this.animatedElement, this.trackEditorProperty);
                    this.propTweens.splice(splitTweenIndex, 0, newTweenToInsert);

                    i = tweensLength;
                }
            }
            this.application.ninja.currentDocument.model.needsSave = true;
            for (i = 0; i <= tweensLength + 1; i++) {
                this.propTweens[i].tweenID = i;
                this.propTweens[i].tweenData.tweenID = i;
            }
        }
    },

    retrieveStoredStyleTweens:{
        value:function(){
            var percentValue, fraction, splitValue;
            var currentMilliSec, currentMilliSecPerPixel, clickPosition, tempTiming, tempTimingFloat, trackTiming, i = 0;

            if (this.animatedElement !== undefined) {
                this.animationName = this.currentKeyframeRule.name;
                if (this.animationName) {

                    trackTiming = this.application.ninja.stylesController.getElementStyle(this.animatedElement, "-webkit-animation-duration");
                    this.nextKeyframe = 0;

                    for (i = 0; this.currentKeyframeRule[i]; i++) {
                        var newTween = {};
                        newTween.tweenData = {};

                        var j, styleLength = this.currentKeyframeRule[i].style.length, keyframeStyles = [];

                        for (j = 0; j < styleLength; j++) {
                            // check for vendor prefixes and skip them for now
                            var firstChar = this.currentKeyframeRule[i].style[j].charAt(0);
                            if (firstChar === "-") {
                                break;
                            } else {
                                var currProp = this.currentKeyframeRule[i].style[j];
                                var propVal = this.currentKeyframeRule[i].style[currProp];
                                keyframeStyles.push([currProp, propVal]);
                            }
                        }

                        newTween.tweenData.tweenedProperties = [];
                        for (var k in keyframeStyles) {
                            newTween.tweenData.tweenedProperties[keyframeStyles[k][0]] = keyframeStyles[k][1];
                        }

                        if (this.currentKeyframeRule[i].keyText === "0%") {
                            newTween.tweenData.spanWidth = 0;
                            newTween.tweenData.keyFramePosition = 0;
                            newTween.tweenData.keyFrameMillisec = 0;
                            newTween.tweenData.tweenID = 0;
                            newTween.tweenData.spanPosition = 0;
                            this.propTweens.push(newTween);
                        }
                        else {
                            tempTiming = trackTiming.split("s");
                            tempTimingFloat = parseFloat(tempTiming[0]);
                            this.trackDuration = tempTimingFloat * 1000;
                            percentValue = this.currentKeyframeRule[i].keyText;
                            splitValue = percentValue.split("%");
                            fraction = splitValue[0] / 100;
                            currentMilliSec = fraction * this.trackDuration;
                            currentMilliSecPerPixel = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80);
                            clickPosition = currentMilliSec / currentMilliSecPerPixel;
                            newTween.tweenData.spanWidth = clickPosition - this.propTweens[this.propTweens.length - 1].tweenData.keyFramePosition;
                            newTween.tweenData.keyFramePosition = clickPosition;
                            newTween.tweenData.keyFrameMillisec = currentMilliSec;
                            newTween.tweenData.tweenID = this.nextKeyframe;
                            newTween.tweenData.spanPosition = clickPosition - newTween.tweenData.spanWidth;
                            this.propTweens.push(newTween);
                        }
                        this.nextKeyframe += 1;
                    }
                }
            }
        }
    },

    updatePropKeyframeRule:{
        value:function(){
            this.ninjaStylesContoller.deleteRule(this.currentKeyframeRule);
            var keyframeString = "@-webkit-keyframes " + this.animationName + " {";
            for (var i = 0; i < this.propTweens.length; i++) {
                var keyMill = parseInt(this.propTweens[i].tweenData.keyFrameMillisec);
                // trackDur should be parseFloat rounded to significant digits
                var trackDur = parseInt(this.trackDuration);
                var keyframePercent = Math.round((keyMill / trackDur) * 100) + "%";
                var keyframePropertyString = " " + keyframePercent + " {";
                for(var prop in this.propTweens[i].tweenData.tweenedProperties){
                    keyframePropertyString += prop + ": " + this.propTweens[i].tweenData.tweenedProperties[prop] + ";";
                }
                keyframePropertyString += "}";
                keyframeString += keyframePropertyString;
            }
            keyframeString += " }";
            this.currentKeyframeRule = this.ninjaStylesContoller.addRule(keyframeString);
            this.application.ninja.currentDocument.model.needsSave = true;
        }
    },

    addPropAnimationRuleToElement:{
        value:function(tweenEvent){
            var currentStyleValue = this.ninjaStylesContoller.getElementStyle(this.animatedElement, this.trackEditorProperty);
            if (currentStyleValue == null) {
                currentStyleValue = "1px";
            }
            this.propTweens[0].tweenData.tweenedProperties[this.trackEditorProperty] = currentStyleValue;
            this.animationName = this.animatedElement.classList[0] + "_" + this.trackEditorProperty;
            var currentAnimationNameString = this.parentComponent.parentComponent.parentComponent.parentComponent.animationNamesString;
            var newAnimationNames = "";
            if(currentAnimationNameString.length == 0){
                newAnimationNames = this.animationName;
            } else {
                newAnimationNames = currentAnimationNameString + "," + this.animationName;
            }
            var currentAnimationDuration = this.ninjaStylesContoller.getElementStyle(this.animatedElement, "-webkit-animation-duration");
            var newAnimationDuration = currentAnimationDuration + "," + currentAnimationDuration;
            var currentIterationCount = this.ninjaStylesContoller.getElementStyle(this.animatedElement, "-webkit-animation-iteration-count");
            var newIterationCount = currentIterationCount + ",1";

            this.parentComponent.parentComponent.parentComponent.parentComponent.animationNamesString = newAnimationNames;

            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-name", newAnimationNames);
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-duration", newAnimationDuration);
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-fill-mode", "forwards");
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-iteration-count", newIterationCount);

            var initRule = "@-webkit-keyframes " + this.animationName + " { 0% {" + this.trackEditorProperty + ": " + currentStyleValue + ";} 100% {" + this.trackEditorProperty + ": " + currentStyleValue + ";} }";
            this.currentKeyframeRule = this.ninjaStylesContoller.addRule(initRule);
            this.insertPropTween(tweenEvent.offsetX);
        }
    }
    /* ===- End Controllers ==== */
});
