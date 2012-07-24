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
var ArrayController = require("montage/ui/controller/array-controller").ArrayController;
var ToolProperties = require("js/components/tools-properties/tool-properties").ToolProperties;

exports.TextProperties = Montage.create(ToolProperties, {


    _keepSelected: {value: false, serializable: false},
    _addedColorChips: {value: false, serializable: false},

    _setColor: {
        enumerable: false,
        value: { colorMode: 'rgb', color: {r:0,g:0,b:0,a:1,css: "rgb(0,0,0)"}, webGlColor: null }
    },

    setColor: {
        enumerable: true,
        get: function () {
            return this._setColor;
        },
        set: function (value) {
            if (value !== this._setColor) {
                this._setColor = value;
            }
        }
    },

    fontName: {value: null, serializable: true},
    fontSize: {value: null, serializable: true},
    fontColor: {value: null, serializable: true},

    btnBold: {value: null, serializable: true},
    btnItalic: {value: null, serializable: true},
    btnUnderline: {value: null, serializable: true},
    btnStrikethrough: {value: null, serializable: true},

    alignLeft: {value: null, serializable: true},
    alignCenter: {value: null, serializable: true},
    alignRight: {value: null, serializable: true},
    alignJustify: {value: null, serializable: true},

    indent: {value: null, serializable: true},
    outdent: {value: null, serializable: true},

    numberedList: {value: null, serializable: true},
    bulletedList: {value: null, serializable: true},
    lastSelection: {value: null, serializable: true},

    // Events
    handleEditorSelect: {
        value: function(e) {

            //Reset Buttons
            this.alignLeft.pressed = false;
            this.alignCenter.pressed = false;
            this.alignRight.pressed = false;
            this.alignJustify.pressed = false;
            this.bulletedList.pressed = false;
            this.numberedList.pressed = false;

            switch(this.application.ninja.stage.textTool.justify) {
                case "left":
                    this.alignLeft.pressed = true;
                    break;
                case "center":
                    this.alignCenter.pressed = true;
                    break;
                case "right":
                    this.alignRight.pressed = true;
                    break;
                case "full":
                    this.alignJustify.pressed = true;
            }

            switch(this.application.ninja.stage.textTool.listStyle) {
                case "ordered":
                    this.numberedList.pressed = true;
                    break;
                case "unordered":
                    this.bulletedList.pressed = true;
            }

            if(!this._keepSelected) {
                this.lastSelection = e.target._savedSelectedRange;
            }
            if(this.application.ninja.stage.textTool.foreColor) {
                this.setColor.color = this.application.ninja.colorController.parseCssToColor(this.application.ninja.stage.textTool.foreColor);
                this.fontColor.color(this.setColor.colorMode, this.setColor.color);
            }

        }
    },

    handleEditorClicked: {
        value: function(e) {
            this._keepSelected = false;
        }
    },

    handleEditorBlur: {
        value: function(e) {
            window.getSelection().addRange(this.lastSelection);
            e.target.focus();
        }
    },


    // Draw Cycle
    prepareForDraw: {
        value: function() {
            this.application.ninja.stage.textTool.addEventListener("editorSelect", this.handleEditorSelect.bind(this), false);
            this.application.ninja.stage.textTool.element.addEventListener("blur", this.handleEditorBlur.bind(this), false);
            this.application.ninja.stage.textTool.element.addEventListener("click", this.handleEditorClicked.bind(this), false);

            //Bind to Rich Text editor that lives on the stage component
            Object.defineBinding(this.application.ninja.stage.textTool, "fontName", {
                boundObject: this.fontName,
                boundObjectPropertyPath: "value",
                oneway: false
            });

            Object.defineBinding(this.application.ninja.stage.textTool, "fontSize", {
                boundObject: this.fontSize,
                boundObjectPropertyPath: "value",
                oneway: false
            });

                Object.defineBinding(this.btnBold, "pressed", {
                  boundObject: this.application.ninja.stage.textTool,
                  boundObjectPropertyPath: "bold",
                  oneway: false
                });

                Object.defineBinding(this.btnItalic, "pressed", {
                  boundObject: this.application.ninja.stage.textTool,
                  boundObjectPropertyPath: "italic",
                  oneway: false
                });

                Object.defineBinding(this.btnUnderline, "pressed", {
                  boundObject: this.application.ninja.stage.textTool,
                  boundObjectPropertyPath: "underline",
                  oneway: false
                });

                Object.defineBinding(this.btnStrikethrough, "pressed", {
                  boundObject: this.application.ninja.stage.textTool,
                  boundObjectPropertyPath: "strikeThrough",
                  oneway: false
                });
        }
    },

    willDraw: {
        value: function() {
            if (this._addedColorChips === false && this.application.ninja.colorController.colorPanelDrawn) {
                this.fontColor.props = { side: 'top', align: 'center', wheel: true, palette: true, gradient: false, image: false, nocolor: false, offset: -80 };
                this.application.ninja.colorController.addButton("chip", this.fontColor);
                this.fontColor.addEventListener("change", this.handleFontColorChange.bind(this), false);
                this.fontColor.addEventListener("mousedown", this.handleColorChangeClick.bind(this), false);
                this._addedColorChips = true;
            }

            if (this._addedColorChips) {
                this.fontColor.color(this.setColor.colorMode, this.setColor.color);
                this.application.ninja.stage.textTool.foreColor = this.setColor.color.css;
            }
        }
    },

    // Actions
    handleJustifyLeftAction: {
        value: function(e) {
            this.alignCenter.pressed = false;
            this.alignRight.pressed = false;
            this.alignJustify.pressed = false;
            this.application.ninja.stage.textTool.justify = "left";
            }
    },

    handleJustifyCenterAction: {
        value: function(e) {
            this.alignLeft.pressed = false;
            this.alignRight.pressed = false;
            this.alignJustify.pressed = false;
            this.application.ninja.stage.textTool.justify = "center"
        }
    },

    handleJustifyRightAction: {
        value: function(e) {
            this.alignLeft.pressed = false;
            this.alignCenter.pressed = false;
            this.alignJustify.pressed = false;
            this.application.ninja.stage.textTool.justify = "right";
        }
    },

    handleJustifyAction: {
        value: function(e) {
            this.alignLeft.pressed = false;
            this.alignCenter.pressed = false;
            this.alignRight.pressed = false;
            this.application.ninja.stage.textTool.justify = "full";
        }
    },

    handleIndentAction: {
        value: function(e) {
            this.application.ninja.stage.textTool.indent();
        }
    },

    handleOutdentAction: {
        value: function(e) {
            this.application.ninja.stage.textTool.outdent();
        }
    },

    handleBulletedListAction: {
        value: function(e) {
            this.numberedList.pressed = false;
            if(e._currentTarget.pressed) {
                this.application.ninja.stage.textTool.listStyle = "unordered";
            } else {
                this.application.ninja.stage.textTool.listStyle = "none";
            }
        }
    },

    handleNumberedListAction: {
        value: function(e) {
            this.bulletedList.pressed = false;
            if(e._currentTarget.pressed) {
                this.application.ninja.stage.textTool.listStyle = "ordered";
            } else {
                this.application.ninja.stage.textTool.listStyle = "none";
        }
        }
    },

    handleColorChangeClick: {
        value: function(e) {
            this._keepSelected = true;
        }
    },


    handleFontColorChange: {
        value: function(e) {
            this.setColor = e._event;
            this.application.ninja.stage.textTool.foreColor = this.setColor.color.css;
            //this.application.ninja.stage.textTool.element.style.color = e._event.color.css;
        }
    }

});
