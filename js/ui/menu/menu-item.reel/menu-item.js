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

exports.MenuItem = Montage.create(Component, {

    _enabled: {
        value: false
    },

    enabled: {
        get: function() {
            return this._enabled;
        },
        set: function(value) {
            if(value !== this._enabled) {
                this._enabled = value;
                this.needsDraw = true;
            }
        }
    },

    _label: {
        value: null
    },

    label: {
        get: function() {
            return this._label;
        },
        set: function(value) {
            if(this._label !== value) {
                this._label = value;
            }
        }
    },

    _submenu: {
        value: false
    },

    submenu: {
        get: function() {
            return this._submenu;
        },
        set: function(value) {
            if(this._submenu !== value) {
                this._submenu = value;
            }
        }
    },

    _entries: {
        value: null
    },

    entries: {
        get: function() {
            return this._entries;
        },
        set: function(value) {
            if(this._entries !== value) {
                this._entries = value;
            }
        }
    },

    submenuElement: {
        value: null
    },

    checkMark: {
        value: null
    },

    _checked: {
        value: null
    },

    checked: {
        get: function() {
            return this._checked;
        },
        set: function(value) {
            if(this._checked !== value) {
                this._checked = value;
                this.needsDraw = true;
            }
        }
    },

    _action: {
        value: ""
    },

    action: {
        get: function() {
            return this._action;
        },
        set: function(value) {
            if(this._action !== value) {
                this._action = value;
            }
        }
    },

    prepareForDraw: {
        value: function() {
            // Don't add mouse event if this is a separator
            if(this.label === "" ) {
                return;
            }

            this.element.addEventListener("mouseover", this, false);
            this.element.addEventListener("mouseout", this, false);
            this.element.addEventListener("mouseup", this, true);
        }
    },

    draw: {
        value: function() {
            if(this.label === "") {
                this.element.classList.add("separatorContainer");
                this.element.innerHTML = "<div class='separator'></div>";
            }

            if(this.enabled) {
                this.element.classList.remove("disabled");
            } else {
                this.element.classList.add("disabled");
            }


            if(this.checked) {
                this.checkMark.classList.add("checked");
            } else {
                this.checkMark.classList.remove("checked");
            }

        }
    },

    captureMouseup: {
        value: function(event) {
            if( this.enabled === true && this.submenu === false ) {
                if(this.action !== "") {

                    var menuItemClick = document.createEvent("CustomEvent");
                    menuItemClick.initCustomEvent("menuItemClick", true, true, this.action);
                    this.dispatchEvent(menuItemClick);

                }
            }
        }
    },

    handleMouseover: {
        value: function() {
            if(this.enabled){
                this.element.style.backgroundColor = "#7f7f7f";
                if(this.submenu) {
                    this.submenuElement.classList.add("show");
                }
            }
        }
    },

    handleMouseout: {
        value: function() {
            this.element.style.backgroundColor = "#474747";

            if(this.submenu) {
                this.submenuElement.classList.remove("show");
            }
        }
    }

});
