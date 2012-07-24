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

////////////////////////////////////////////////////////////////////////
//
var Montage =   require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component;
////////////////////////////////////////////////////////////////////////
//
exports.DocumentBar = Montage.create(Component, {
    ////////////////////////////////////////////////////////////////////
    //
    _currentDocument: {value: null},
    ////////////////////////////////////////////////////////////////////
    //
    currentDocument: {
        get: function() {return this._currentDocument;},
        set: function(value) {
            //
            if (value === this._currentDocument) {
                return;
            }
            //
            this._currentDocument = value;
            this.disabled = !this._currentDocument;
            //          
            if(this._currentDocument && this._currentDocument.model && this._currentDocument.model.currentView === this._currentDocument.model.views.design) {
                this.btnCode.setAttribute('class', 'inactive');
                this.btnDesign.removeAttribute('class');
            } else if(this._currentDocument && this._currentDocument.model && this._currentDocument.model.currentView === this._currentDocument.model.views.code) {
                this.btnDesign.setAttribute('class', 'inactive');
                this.btnCode.removeAttribute('class');
            }
            //
            this.visible = true;

            //TODO: check if the code's options bar can be unified
            if(this._currentDocument && this._currentDocument.model && (this._currentDocument.model.views.design === null) && (this._currentDocument.model.views.code !== null)){
                this.visible = false;
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    _codeEditorWrapper:{
        value: null
    },

    codeEditorWrapper:{
        get : function() {
            return this._codeEditorWrapper;
        },
        set : function(value) {
            if(this._codeEditorWrapper !== value){
                this._codeEditorWrapper = value;
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    btnCode: {
        value: null
    },
    btnDesign: {
        value: null
    },
    btnPreview: {
        value: null
    },
    ////////////////////////////////////////////////////////////////////
    //
    _visible: {
        value: false
    },
    ////////////////////////////////////////////////////////////////////
    //
    visible: {
        get: function() {return this._visible;},
        set: function(value) {
            //
            if(this._visible !== value) {
                this._visible = value;
                this.needsDraw = true;
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    zoomControl: {
        value: null,
        serializable: true
    },
    ////////////////////////////////////////////////////////////////////
    //
    _zoomFactor: {
        value: 100
    },
    ////////////////////////////////////////////////////////////////////
    //
    zoomFactor: {
        get: function() {return this._zoomFactor;},
        set: function(value) {
            if(value !== this._zoomFactor) {
                //
                this._zoomFactor = value;
                //
                if (!this._firstDraw) {
                    if(this._currentDocument && this._currentDocument.model && this._currentDocument.model.currentView === this._currentDocument.model.views.design){
                        this.application.ninja.stage.setZoom(value);
                    }else if(this._currentDocument && this._currentDocument.model && this._currentDocument.model.currentView === this._currentDocument.model.views.code){
                        this._zoomFactor = value;
                        if(this.codeEditorWrapper){this.codeEditorWrapper.handleZoom(value)};
                    }
                }
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    prepareForDraw: {
        value: function() {
            //
            this.btnCode.addEventListener('click', this.showViewCode.bind(this), false);
            this.btnDesign.addEventListener('click', this.showViewDesign.bind(this), false);
            this.btnPreview.addEventListener('click', this, false);
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    willDraw: {
        value: function() {
            //
            this.btnCode.setAttribute('class', 'inactive');
            this.btnDesign.setAttribute('class', 'inactive');
            //
            if (this._currentDocument && this._currentDocument.model && this._currentDocument.model.currentView) {
                //
                if (this._currentDocument.model.currentView === this._currentDocument.model.views.design) {
                    this.btnDesign.removeAttribute('class');
                } else if (this._currentDocument.model.currentView === this._currentDocument.model.views.code) {
                    this.btnCode.removeAttribute('class');
                }
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    draw: {
        value: function() {
            //
            if(this.visible) {
                this.element.style.display = "block";
            } else {
                this.element.style.display = "none";
            }

        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    didDraw: {
        value: function() {
            //
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    _disabled: {
        value: true
    },
    ////////////////////////////////////////////////////////////////////
    //
    disabled: {
        get: function() {return this._disabled;},
        set: function(value) {
            //
            if(value !== this._disabled) {
                this._disabled = value;
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    renderDesignView: {
        value: function () {
            //Reloading in design view (with updates from other view)
            this.reloadView('design', this.fileTemplate);
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    renderCodeView: {
        value: function () {
            //Reloading in code view (with updates from other view)
            this.reloadView('code', this.fileTemplate);
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    showViewDesign: {
        value: function () {
            //
            if (this._currentDocument.model.currentView !== 'design') {
                //
                this._currentDocument.model.switchViewTo('design');
                this.btnCode.setAttribute('class', 'inactive');
                this.btnDesign.removeAttribute('class');
                //this._currentDocument.model.file.content.body = '<div class="test">hello</div><div class="test">hello</div>';
                var render = this.renderDesignView.bind(this._currentDocument);
                render();
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //TODO: Implement code with that updates the file template through the ninja document parser
    showViewCode: {
        value: function () {
            //
            if (this._currentDocument.model.currentView !== 'code') {
                //
                this._currentDocument.model.switchViewTo('code');
                this.btnDesign.setAttribute('class', 'inactive');
                this.btnCode.removeAttribute('class');
                var render = this.renderCodeView.bind(this._currentDocument);
                render();
            }
        }
    },

    handleClick: {
        value: function(evt) {
            NJevent("executePreview");
        }
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
