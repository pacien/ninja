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

exports.MenuEntry = Montage.create(Component, {

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

    _entries: {
        value: []
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

    menuHeaderButton: {
        value: null
    },


    prepareForDraw: {
        value: function() {
           this.menuHeaderButton.element.addEventListener("mousedown", this, true);
        }
    },

    captureMousedown: {
        value: function(event) {
            var mouseDownEvent = document.createEvent("CustomEvent");
            mouseDownEvent.initCustomEvent("headermousedown", true, true, this);
            this.dispatchEvent(mouseDownEvent);
        }
    },

    _menuIsActive: {
        value: false
    },

    menuIsActive: {
        get: function() {
            return this._menuIsActive;
        },
        set: function(value) {
            if(value) {
                this.element.addEventListener("mouseover", this, false);
            } else {
                this.element.removeEventListener("mouseover", this, false);
            }
        }
    },

    handleMouseover: {
        value: function(event) {
            var mouseOverEvent = document.createEvent("CustomEvent");
            mouseOverEvent.initCustomEvent("headermouseover", true, true, this);
            this.dispatchEvent(mouseOverEvent);
        }
    }
});
