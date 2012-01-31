/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

exports.PosSize = Montage.create(Component, {
    leftPosition: {
        value: 0
    },

    topPosition: {
        value: 0
    },

    heightSize: {
        value: 0
    },

    widthSize: {
        value: 0
    },

    savedPosition: {
        value: null
    },

    _disablePosition: {
        value: true
    },

    disablePosition: {
        get: function () {
            return this._disablePosition;
        },
        set: function (value) {
            if(value !== this._disablePosition) {
                this._disablePosition  = value;
                this.needsDraw = true;
            }
        }
    },

    prepareForDraw: {
        value: function() {
            this.leftControl.identifier = "left";
            this.leftControl.addEventListener("change", this, false);
            this.leftControl.addEventListener("changing", this, false);

            this.topControl.identifier = "top";
            this.topControl.addEventListener("change", this, false);
            this.topControl.addEventListener("changing", this, false);

            this.heightControl.identifier = "height";
            this.heightControl.addEventListener("change", this, false);
            this.heightControl.addEventListener("changing", this, false);

            this.widthControl.identifier = "width";
            this.widthControl.addEventListener("change", this, false);
            this.widthControl.addEventListener("changing", this, false);

            
            //this._controlList[0].control.addEventListener("action", this._handleStageEvent.bind(this), false);
            //PropertiesPanelModule.PropertiesPanelBase.PIControlList["stageWidthHeightLock"] = this._controlList[0].control;

        }
    },

    draw: {
        value: function() {
            if(this._disablePosition) {
                this.leftPosition = 0;
                this.leftControl.enabled = false;
                this.topPosition = 0;
                this.topControl.enabled = false;
                this.leftLabel.classList.add("disabled");
                this.topLabel.classList.add("disabled");
            } else {
                this.leftControl.enabled = true;
                this.topControl.enabled = true;
                this.leftLabel.classList.remove("disabled");
                this.topLabel.classList.remove("disabled");
            }
        }
    },

    handleLeftChange: {
        value: function(event) {
            var prevPosition;

            if(!event.wasSetByCode) {
                if(this.savedPosition) prevPosition = [this.savedPosition + "px"];

                this.application.ninja.elementMediator.setProperty(this.application.ninja.selectedElements, "left", [this.leftControl.value + "px"] , "Change", "pi", prevPosition);
                this.savedPosition = null;
            }
        }
    },

    handleTopChange: {
        value: function(event) {
            var prevPosition;

            if(!event.wasSetByCode) {
                if(this.savedPosition) prevPosition = [this.savedPosition + "px"];

                this.application.ninja.elementMediator.setProperty(this.application.ninja.selectedElements, "top", [this.topControl.value + "px"] , "Change", "pi", prevPosition);
                this.savedPosition = null;
            }
        }
    },

    handleHeightChange: {
        value: function(event) {
            var prevPosition, items;

            if(!event.wasSetByCode) {
                if(this.savedPosition) prevPosition = [this.savedPosition + "px"];

                this.application.ninja.selectedElements.length ? items = this.application.ninja.selectedElements : items = [this.application.ninja.currentDocument.documentRoot];
                this.application.ninja.elementMediator.setProperty(items, "height", [this.heightControl.value + "px"] , "Change", "pi", prevPosition);
                this.savedPosition = null;
            }
        }
    },

    handleWidthChange: {
        value: function(event) {
            var prevPosition, items;

            if(!event.wasSetByCode) {
                if(this.savedPosition) prevPosition = [this.savedPosition + "px"];

                this.application.ninja.selectedElements.length ? items = this.application.ninja.selectedElements : items = [this.application.ninja.currentDocument.documentRoot];
                this.application.ninja.elementMediator.setProperty(items, "width", [this.widthControl.value + "px"] , "Change", "pi", prevPosition);
                this.savedPosition = null;
            }
        }
    },

    handleLeftChanging: {
        value: function(event) {
            if(!event.wasSetByCode) {
                if(!this.savedPosition) this.savedPosition = this.leftPosition;
                this.application.ninja.elementMediator.setProperty(this.application.ninja.selectedElements, "left", [this.leftControl.value + "px"] , "Changing", "pi");
            }

        }
    },

    handleTopChanging: {
        value: function(event) {
            if(!event.wasSetByCode) {
                if(!this.savedPosition) this.savedPosition = this.topPosition;
                this.application.ninja.elementMediator.setProperty(this.application.ninja.selectedElements, "top", [this.topControl.value + "px"] , "Changing", "pi");
            }

        }
    },

    handleHeightChanging: {
        value: function(event) {
            var items;
            if(!event.wasSetByCode) {

                if(this.bindButton.value) {
                    if(!this.savedPosition) this.savedPosition = this.heightSize;
                    var delta = this.heightControl.value - this.savedPosition;

                    var hwRatio = Math.round(Math.round(this.widthControl.value / this.savedPosition * 10) / 10);
                    var newWidth = this.widthControl.value + hwRatio * delta;

                    this.application.ninja.selectedElements.length ? items = this.application.ninja.selectedElements : items = [this.application.ninja.currentDocument.documentRoot];
                    this.widthControl.value = newWidth;
                    this.application.ninja.elementMediator.setProperty(items, "height", [this.heightControl.value + "px"] , "Changing", "pi");
                    this.application.ninja.elementMediator.setProperty(items, "width", [newWidth + "px"] , "Changing", "pi");
                } else {

                    if(!this.savedPosition) this.savedPosition = this.heightSize;

                    this.application.ninja.selectedElements.length ? items = this.application.ninja.selectedElements : items = [this.application.ninja.currentDocument.documentRoot];
                    this.application.ninja.elementMediator.setProperty(items, "height", [this.heightControl.value + "px"] , "Changing", "pi");
                }
            }
        }
    },

    handleWidthChanging: {
        value: function(event) {
            var items;
            if(!event.wasSetByCode) {
                if(!this.savedPosition) this.savedPosition = this.widthSize;
                this.application.ninja.selectedElements.length ? items = this.application.ninja.selectedElements : items = [this.application.ninja.currentDocument.documentRoot];
                this.application.ninja.elementMediator.setProperty(items, "width", [this.widthControl.value + "px"] , "Changing", "pi");
            }
        }
    }


});