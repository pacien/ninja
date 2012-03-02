/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component;

exports.StyleSheetsView = Montage.create(Component, {
    noDocumentCondition : {
        value: true
    },
    showToolbar : {
        value: false
    },
    styleSheets : {
        value: []
    },
    stylesController : {
        value: null
    },
    deserializedFromTemplate : {
        value: function() {
            console.log("style sheet view - deserialized");

            this.stylesController = this.application.ninja.stylesController;

            this.eventManager.addEventListener("styleSheetsReady", this, false);
            this.eventManager.addEventListener("newStyleSheet", this, false);
        }
    },
    _initView : {
        value: false
    },
    handleStyleSheetsReady : {
        value: function(e) {
            this._initView = this.needsDraw = true;

//            this.noDocumentCondition = false;
//            this.showToolbar = true;
//            this.styleSheets = this.stylesController.userStyleSheets;

        }
    },
    handleNewStyleSheet : {
        value: function(e) {
            this.styleSheets.push(e._event.detail);
        }
    },
    prepareForDraw : {
        value: function() {
            console.log("style sheet view - prepare for draw");
        }
    },
    draw : {
        value: function() {
            console.log("styles sheet view - draw");

            if(this._initView) {
                this.noDocumentCondition = false;
                this.showToolbar = true;
                this.styleSheets = this.stylesController.userStyleSheets;
                this._initView = false;
            }
        }
    }
});