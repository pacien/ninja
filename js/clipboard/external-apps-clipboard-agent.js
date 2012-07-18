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

var Montage =               require("montage/core/core").Montage,
    Component =     require("montage/ui/component").Component,
    ClipboardUtil = require("js/clipboard/util").ClipboardUtil;

var ExternalAppsClipboardAgent = exports.ExternalAppsClipboardAgent = Montage.create(Component, {

    //count how many times pasted
    //used to move multiple pastes of same copy
    pasteCounter:{
        value: 0
    },

    paste:{
        value: function(clipboardEvent){
            var clipboardData = clipboardEvent.clipboardData,
            htmlData = clipboardData.getData("text/html"),
            textData = clipboardData.getData("text/plain"),
            i=0,
            imageMime, imageData, imageElement, isImage = false, imageItem;

            if(clipboardData.items &&  (clipboardData.items.length > 0)){//handle image blobs
                for(i=0; i < clipboardData.items.length; i++ ){
                    if((clipboardData.items[i].kind === "file") && (clipboardData.items[i].type.indexOf("image") === 0)){//example type -> "image/png"
                        isImage = true;
                        if(clipboardData.items[i].type === "image/png"){
                            imageItem = clipboardData.items[i];//grab the png image from clipboard
                        }
                        else if(i===0){
                            imageItem = clipboardData.items[i];
                        }
                    }
                }
            }

            if(isImage && imageItem){
                imageMime = imageItem.type;
                imageData = imageItem.getAsFile();
                try{
                    imageElement = this.pasteImageBinary(imageData);
                }catch(e){
                    console.log(""+e.stack);
                }
                this.application.ninja.currentDocument.model.needsSave = true;
            }

            if(!isImage && (!!htmlData || !!textData)){
                try{
                    this.doPasteHtml(htmlData, textData);
                }catch(e){
                    console.log(""+e.stack);
                }
            }
        }
    },

    pasteImageBinary:{
        value: function(imageBlob){
            var element, self = this,
                fileType = imageBlob.type;

            element = this.application.ninja.ioMediator.createFileFromBinary(imageBlob, {"addFileToStage" : self.addImageElement.bind(self)});

            return element;

        }
    },

    addImageElement:{
        value: function(status){
            var save = status.save,
                fileName = status.filename,
                url = status.url,
                fileType = status.fileType,
                element, rules, self = this;

            if (save && save.success && save.status === 201) {
                //
                if (fileType.indexOf('svg') !== -1) {
                    element = document.application.njUtils.make('embed', null, this.application.ninja.currentDocument);
                    element.type = 'image/svg+xml';
                    element.src = url+'/'+fileName;
                } else {
                    element = document.application.njUtils.make('image', null, this.application.ninja.currentDocument);
                    element.src = url+'/'+fileName;
                }
                //Adding element once it is loaded
                element.onload = function () {
                    element.onload = null;
                    self.application.ninja.elementMediator.addElements(element, rules, true/*notify*/, false /*callAddDelegate*/);
                };
                //Setting rules of element
                rules = {
                    'position': 'absolute',
                    'top' : '0px',
                    'left' : '0px'
                };
                //
                self.application.ninja.elementMediator.addElements(element, rules, false/*notify*/, false /*callAddDelegate*/);
            } else {
                //HANDLE ERROR ON SAVING FILE TO BE ADDED AS ELEMENT
            }

            return element;
        }
    },

    doPasteHtml:{
        value: function(htmlData, textData){
            var divWrapper = null, data = null, theclass, height, width;

            htmlData = this.sanitize(htmlData);
            textData = this.sanitize(textData);

            data = htmlData ? htmlData : textData;

            if (data && data.length) {
                //deselect current selections
                this.application.ninja.selectedElements.length = 0;
                NJevent("selectionChange", {"elements": this.application.ninja.selectedElements, "isDocument": true} );

                divWrapper = document.application.njUtils.make("div", null, this.application.ninja.currentDocument);
                this.application.ninja.elementMediator.addElements(divWrapper, {"height": "68px",
                                                                                "left": "0px",
                                                                                "position": "absolute",
                                                                                "top": "0px",
                                                                                "width": "161px"}, false);

                divWrapper.innerHTML = data;

                //hack to set the wrapper div's height and width as per the pasted content
                theclass = divWrapper.getAttribute("class");
                //temporarily remove the class to find the computed styles for the pasted content
                if(theclass){
                    divWrapper.removeAttribute("class");
                }
                height = divWrapper.ownerDocument.defaultView.getComputedStyle(divWrapper).getPropertyValue("height");
                width = divWrapper.ownerDocument.defaultView.getComputedStyle(divWrapper).getPropertyValue("width");

                divWrapper.setAttribute("class", theclass);

                this.application.ninja.stylesController.setElementStyle(divWrapper, "height", height);
                this.application.ninja.stylesController.setElementStyle(divWrapper, "width", width);
                //-end hack

                NJevent("elementAdded", divWrapper);

                this.application.ninja.currentDocument.model.needsSave = true;
            }
        }
    },

    sanitize : {
        value: function(data){
            data = data.replace(/\<meta [^>]+>/gi, ""); // Remove meta tags
            data = data.replace(/\<script [^>]+>/g," "); // Remove script tags to prevenet script injection attack
            data = data.replace(/\<link [^>]+>/g," "); // Remove link tags to prevent unwanted css files that may corrupt the stage
            data = data.replace(/\<xml [^>]+>/g," "); // Remove xml tags since it works only for IE browsers
            data = data.replace(/\<iframe [^>]+>/g," "); // Remove iframe tags to prevent iframe injection attack

            return data;
        }
    }
});
