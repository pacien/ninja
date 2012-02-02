/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

var Montage = require("montage/core/core").Montage;
var baseDocumentModule = require("js/io/document/base-document");


var TextDocument = exports.TextDocument = Montage.create(baseDocumentModule.BaseDocument, {
    // PRIVATE MEMBERS
    _codeEditor: {
        value: {
            "editor": { value: null, enumerable: false },
            "hline": { value: null, enumerable: false }
        }
    },

    _source: { value: null, enumerable: false},

    source: {
        get: function() { return this._source;},
        set: function(value) { this._source = value;}
    },

    // PUBLIC MEMBERS

    //****************************************//
    //PUBLIC API


    // GETTERS / SETTERS
    editor: {
        get: function() { return this._codeEditor.editor; },
        set: function(value) { this._codeEditor.editor = value}
    },

    hline: {
        get: function() { return this._codeEditor.hline; },
        set: function(value) {this._codeEditor.hline = value; }
    },

    
    // PUBLIC METHODS
    initialize: {
        value: function(doc, uuid, textArea, callback) {
            this.init(doc.name, doc.uri, doc.type, textArea, uuid, null, doc.externalUri);
            this.currentView = "code";
            this.textArea = textArea;

//            this._loadContent();
        }
    },

    // PRIVATE METHODS
    _loadContent: {
        value: function() {
            // Start and AJAX call to load the HTML Document as a String
            var xhr = new XMLHttpRequest();
            var ref = this;

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    ref.source = xhr.responseText;
                    ref.textArea.innerHTML = xhr.responseText;
                    //ref.callback(xhr.responseText);
                    ref.callback(ref);
                }
            };

            if(this.documentType === "js") {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/appdelegate.js');
            } else if(this.documentType === "css") {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/default_html.css');
            } else {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/index.html');
            }
            
            xhr.send('');
        }
    }
    
});