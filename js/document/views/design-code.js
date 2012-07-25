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
var Montage =           require("montage/core/core").Montage,
    Component =         require("montage/ui/component").Component,
    CodeDocumentView =  require("js/document/views/code").CodeDocumentView;
////////////////////////////////////////////////////////////////////////
//Code View for the HTML file
//
exports.DesignCodeView = Montage.create(CodeDocumentView, {
    ////////////////////////////////////////////////////////////////////
    //
    identifier: {
        value: "design-code"
    },
    ////////////////////////////////////////////////////////////////////
    //
    init:{
        value: function (content) {

        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    load:{
        value:function(content){
            //initialize the editor if not yet created
            if(this.editor === null){
                //todo: get the proper content
                this.textArea.value = content;
                this.initializeTextView(this.application.ninja.currentDocument.model.file, this.application.ninja.currentDocument);
                return true;
            }else{//reload the editor
                this.editor.setValue(content);
                this.editor.focus();
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    show: {
        value: function (callback) {
            this.textViewContainer.setAttribute("class", "codeViewContainer cm-s-default");

            this.textViewContainer.style.display = "block";
			
			//todo : update options bar

            //
            if (callback) callback();
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    hide: {
        value: function (callback) {
            if(this.editor){
                this.editor.save();//save to textarea
            }
            this.textViewContainer.style.display = "none";

            //todo : update options bar

            //
            if (callback) callback();
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    applyTheme:{
        value:function(themeClass){
            //Todo: change for bucket structure of documents
            this.textViewContainer.className = "codeViewContainer "+themeClass;
        }
    }
});