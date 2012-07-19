/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

var PropertyTrack = exports.PropertyTrack = Montage.create(Component, {


    hasTemplate:{
        value: true
    },

    /* Begin: Models */

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

    trackEditorProperty:{
        value:""
    },

    animatedElement:{
        value:null
    },

    isSubproperty:{
        value:true
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

    timelineTrack:{
        value:null
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

    /* End: Models */

    /* Begin: Draw Cycle */
    prepareForDraw:{
        value:function(){
            this.element.addEventListener("click", this, false);
            this.timelineTrack = this.parentComponent.parentComponent.parentComponent.parentComponent;
            this.trackID = this.timelineTrack.trackID;
            this.animatedElement = this.timelineTrack.animatedElement;
            this.ninjaStylesContoller = this.application.ninja.stylesController;
            this.eventManager.addEventListener("tlZoomSlider", this, false);
            
                        // Drag and Drop event handlers
            this.element.addEventListener("dragstart", this.handleKeyframeDragstart.bind(this), false);
            this.element.addEventListener("dragend", this.handleKeyframeDragstart.bind(this), false);
            this.element.addEventListener("drop", this.handleKeyframeDragstart.bind(this), false);
        }
    },

    didDraw:{
        value:function () {
            if(this.currentKeyframeRule){
                this.retrieveStoredStyleTweens();
            }
        }
    },

    /* End: Draw Cycle */

    /* Begin: Event Handlers */
   
    handleKeyframeDragstart: {
        value: function(event) {
            event.stopPropagation();
            return false;
        }
    },

    handleClick:{
        value:function (ev) {

            var selectIndex ,
                currentSelectedStyleIndex;

            if (ev.shiftKey) {

                if (this.trackType == "position") {
                    this.timelineTrack.handleNewTween(ev);
                }

                if (this.propTweens.length < 1) {

                    selectIndex = this.application.ninja.timeline.getLayerIndexByID(this.trackID);
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
            var findXOffset,
                targetElementOffset,
                position;

            if (ev.offsetX > this.propTweens[this.propTweens.length - 1].tweenData.keyFramePosition) {
                this.insertPropTween(ev.offsetX);
            } else {
                // An easy function that adds up offsets and scrolls and returns the page x value of an element
                findXOffset = function (obj) {
                    var curleft = 0;
                    if (obj.offsetParent) {
                        do {
                            curleft += (obj.offsetLeft - obj.scrollLeft);

                        } while (obj = obj.offsetParent);
                    }
                    return curleft;
                };
                targetElementOffset = findXOffset(ev.currentTarget);
                position = event.pageX - targetElementOffset;

                this.splitPropTweenAt(position - 18);
            }
        }
    },

    handleTlZoomSlider: {
        value: function(event) {

            var currentMilliSecPerPixel , currentMilliSec , clickPos,thingToPush;
            var i = 0,
                tweensLength = this.propTweens.length;

            for (i = 0; i < tweensLength; i++) {

                if (i === 0) {
                    // Exception: 0th item does not depend on anything
                    // If 0th tween is draggable, this will need to be fixed.
                    this.propTweens[i].tweenData.spanWidth=0;
                    this.propTweens[i].tweenData.spanPosition=0;
                    this.propTweens[i].tweenData.keyFramePosition=0;
                    this.propTweens[i].tweenData.keyFrameMillisec=0;

                } else {
                    var prevKeyFramePosition = this.propTweens[i - 1].tweenData.keyFramePosition,
                        myObj = {},
                        thing = {};

                    currentMilliSecPerPixel = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80);
                    currentMilliSec = this.propTweens[i].tweenData.keyFrameMillisec;
                    clickPos = currentMilliSec / currentMilliSecPerPixel;

                    for (thing in this.propTweens[i].tweenData) {
                        myObj[thing] = this.propTweens[i].tweenData[thing];
                    }
                    myObj.spanWidth = clickPos - prevKeyFramePosition;
                    myObj.keyFramePosition = clickPos;
                    myObj.spanPosition = clickPos - (clickPos - prevKeyFramePosition);

                    this.propTweens[i].tweenData = myObj;
                }
            }
        }
    },

    /* End: Event Handlers */

    /* Begin: Controllers */

    getCurrentSelectedStyleIndex: {
        value: function(layerIndex) {
            var returnVal = false,
                i = 0,
                arrLayerStylesLength = this.application.ninja.timeline.arrLayers[layerIndex].layerData.arrLayerStyles.length,
                currItem;
            for (i = 0; i < arrLayerStylesLength; i++) {
                currItem =  this.application.ninja.timeline.arrLayers[layerIndex].layerData.arrLayerStyles[i];
                if (currItem.isSelected === true) {
                    returnVal = i;
                }
            }
            return returnVal;
        }
    },

    insertPropTween:{
        value:function(clickPos){
            var selectedIndex,
                currentMillisecPerPixel,
                currentMillisec,
                propVal,
                newTween;

            selectedIndex = this.application.ninja.timeline.getLayerIndexByID(this.trackID);
            this.application.ninja.timeline.selectLayers([selectedIndex]);

            currentMillisecPerPixel = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80);
            currentMillisec = currentMillisecPerPixel * clickPos;
            this.trackDuration = currentMillisec;

            /* Creating a newTween Object */
            newTween = {};
            newTween.tweenData = {};
            newTween.tweenData.tweenedProperties = [];

            /* Getting the Property Style for the animatedElement */

            propVal = this.ninjaStylesContoller.getElementStyle(this.animatedElement, this.trackEditorProperty);
            if(propVal == null){
                propVal = "1px";
            }
            newTween.tweenData.tweenedProperties[this.trackEditorProperty] = propVal;

            if (clickPos == 0) {

                /* Setting the tweenData Properties for the first Keyframe */

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
                splitTweenIndex,
                newTweenToInsert;

            /* Traverse through the property tweens array */

            for (i = 0; i < tweensLength; i++) {
                prevTween = this.propTweens[i].tweenData.keyFramePosition;
                nextTween = this.propTweens[i + 1].tweenData.keyFramePosition;
                if (position > prevTween && position < nextTween) {

                    /* Insert a new tween at this index */
                    splitTweenIndex = i + 1;

                    /* Update the next tween to have new span position and width */

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

                    /* Create a new Tween and splice it into the model */
                    newTweenToInsert = {};
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
            var j,k,i,percentValue,
                fraction,
                splitValue,
                styleLength,
                firstChar,
                currProp,
                propVal ,
                currentMilliSec,
                currentMilliSecPerPixel,
                clickPosition,
                tempTiming,
                tempTimingFloat,
                trackTiming,
                keyframeStyles,
                newTween;

            if (this.animatedElement !== undefined) {
                this.animationName = this.currentKeyframeRule.name;
                if (this.animationName) {

                    trackTiming = this.application.ninja.stylesController.getElementStyle(this.animatedElement, "-webkit-animation-duration");
                    this.nextKeyframe = 0;

                    /* Traverse through the currentKeyFrameRule for the animatedElement */

                    for (i = 0; this.currentKeyframeRule[i]; i++) {
                        newTween = {};
                        newTween.tweenData = {};

                        styleLength = this.currentKeyframeRule[i].style.length;
                        keyframeStyles = [];

                        /* Traversering through the style of the currentKeyFrameRule of the animatedElement */
                        for (j = 0; j < styleLength; j++) {

                            firstChar = this.currentKeyframeRule[i].style[j].charAt(0);
                            if (firstChar === "-") {
                                break;
                            } else {
                                currProp = this.currentKeyframeRule[i].style[j];
                                propVal = this.currentKeyframeRule[i].style[currProp];
                                keyframeStyles.push([currProp, propVal]);
                            }
                        }

                        newTween.tweenData.tweenedProperties = [];
                        for (k in keyframeStyles) {
                            newTween.tweenData.tweenedProperties[keyframeStyles[k][0]] = keyframeStyles[k][1];
                        }

                        if (this.currentKeyframeRule[i].keyText === "0%") {

                            /* Setting the tweenData Property for only the first Keyframe */
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
            var keyframeString,
                keyMill,
                trackDur,
                keyframePercent,
                keyframePropertyString,
                prop;

            this.ninjaStylesContoller.deleteRule(this.currentKeyframeRule);

            // build the new keyframe string
            keyframeString = "@-webkit-keyframes " + this.animationName + " {";

            for (i = 0; i < this.propTweens.length; i++) {
                keyMill = parseInt(this.propTweens[i].tweenData.keyFrameMillisec);
                trackDur = parseInt(this.trackDuration);
                keyframePercent = Math.round((keyMill / trackDur) * 100) + "%";
                keyframePropertyString = " " + keyframePercent + " {";
                for(prop in this.propTweens[i].tweenData.tweenedProperties){
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

            /* Adding the style property as an animation rule to the animatedElement */

            var currentStyleValue,
                currentAnimationNameString,
                newAnimationNames,
                currentAnimationDuration,
                newAnimationDuration,
                currentIterationCount,
                newIterationCount,
                initRule;

            /* Retrieveing the current style value on the animatedElement */
            currentStyleValue = this.ninjaStylesContoller.getElementStyle(this.animatedElement, this.trackEditorProperty);
            if (currentStyleValue == null) {
                currentStyleValue = "1px";
            }
            this.propTweens[0].tweenData.tweenedProperties[this.trackEditorProperty] = currentStyleValue;
            this.animationName = this.animatedElement.classList[0] + "_" + this.trackEditorProperty;
            currentAnimationNameString = this.timelineTrack.animationNamesString;
            newAnimationNames = "";
            if(currentAnimationNameString.length == 0){
                newAnimationNames = this.animationName;
            } else {
                newAnimationNames = currentAnimationNameString + "," + this.animationName;
            }
            currentAnimationDuration = this.ninjaStylesContoller.getElementStyle(this.animatedElement, "-webkit-animation-duration");
            newAnimationDuration = currentAnimationDuration + "," + currentAnimationDuration;
            currentIterationCount = this.ninjaStylesContoller.getElementStyle(this.animatedElement, "-webkit-animation-iteration-count");
            newIterationCount = currentIterationCount + ",1";

            this.timelineTrack.animationNamesString = newAnimationNames;

            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-name", newAnimationNames);
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-duration", newAnimationDuration);
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-fill-mode", "forwards");
            this.ninjaStylesContoller.setElementStyle(this.animatedElement, "-webkit-animation-iteration-count", newIterationCount);

            /* Creating the animation rule */
            initRule = "@-webkit-keyframes " + this.animationName + " { 0% {" + this.trackEditorProperty + ": " + currentStyleValue + ";} 100% {" + this.trackEditorProperty + ": " + currentStyleValue + ";} }";
            this.currentKeyframeRule = this.ninjaStylesContoller.addRule(initRule);
            this.insertPropTween(tweenEvent.offsetX);
        }
    }
    /* End: Controllers */
});
