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

var Montage =   require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component;

exports.MenuController = Montage.create(Component, {

    _currentDocument: {
            value : null
    },

    currentDocument : {
        get : function() {
            return this._currentDocument;
        },
        set : function(value) {
            if (value === this._currentDocument) {
                return;
            }

            if(this._currentDocument && this._currentDocument.currentView === "design") {
                this._currentDocument.model.draw3DGrid = document.application.model.show3dGrid;
            }

            this._currentDocument = value;

            if(this._currentDocument && this._currentDocument.currentView === "design") {
                document.application.model.show3dGrid = this._currentDocument.model.draw3DGrid;
                this.topLevelMenu[2].entries[5].checked = this._currentDocument.model.draw3DGrid;
            }

            if(!this._currentDocument) {
                // No document - disable all menu items
                this.documentEnabledItems.forEach(function(index) {
                    index.enabled = false;
                });
                this.designDocumentEnabledItems.forEach(function(index) {
                    index.enabled = false;
                });
            } else {
                this.documentEnabledItems.forEach(function(index) {
                    index.enabled = true;
                });

                if(this.currentDocument.currentView === "design") {
                    this.designDocumentEnabledItems.forEach(function(index) {
                        index.enabled = true;
                    });
                } else {
                    this.designDocumentEnabledItems.forEach(function(index) {
                        index.enabled = false;
                    });
                }
            }

        }
    },

    didCreate: {
        value: function() {
            var self = this;

            this.topLevelMenu.forEach(function(item) {
                item.entries.forEach(function(entry) {
                    if(entry.depend) {
                        if(entry.depend === "document") {
                            self.documentEnabledItems.push(entry);
                        } else if(entry.depend === "designDocument") {
                            self.designDocumentEnabledItems.push(entry);
                        }
                    }
                });
            });
        }
    },

    documentEnabledItems: {
        value: []
    },

    designDocumentEnabledItems: {
        value: []
    },

    toggleItem: {
        value: function(value) {
            this['handle' + value.substr(0, value.indexOf("-"))](value.slice(value.indexOf("-") + 1));
        }
    },


    handlelayout: {
        value: function(value) {
            this.topLevelMenu[2].entries[2].entries.forEach(function(entry) {
                if(entry.boundProperty === value && !entry.checked){
                    entry.checked = true;
                    document.application.model.layoutView = value;
                } else if(entry.boundProperty !== value && entry.checked) {
                    entry.checked = false;
                }
            });
        }
    },

    handlesnap: {
        value: function(value) {
            if(value === "onoff") {
                this.topLevelMenu[2].entries[3].checked = !this.topLevelMenu[2].entries[3].checked;
                this.topLevelMenu[2].entries[4].enabled = this.topLevelMenu[2].entries[3].checked;
                document.application.model.snap = value;
            } else {
                this.topLevelMenu[2].entries[4].entries.forEach(function(entry) {
                    if(entry.boundProperty === value) {
                        entry.checked = !entry.checked;
                        document.application.model[entry.boundProperty] = entry.checked;
                    }
                });
            }
        }
    },

    handlegrid: {
        value: function(value) {
            this.topLevelMenu[2].entries[5].checked = !this.topLevelMenu[2].entries[5].checked;
            document.application.model.show3dGrid = this.topLevelMenu[2].entries[5].checked;
        }
    },

    handleview: {
        value: function(value) {
            if(this.topLevelMenu[2].entries[7].boundProperty === value) {
                if(!this.topLevelMenu[2].entries[7].checked) {
                    this.topLevelMenu[2].entries[7].checked = true;
                    this.topLevelMenu[2].entries[8].checked = false;
                    this.topLevelMenu[2].entries[9].checked = false;
                    document.application.model.documentStageView = value;
                }
            } else if(this.topLevelMenu[2].entries[8].boundProperty === value) {
                if(!this.topLevelMenu[2].entries[8].checked) {
                    this.topLevelMenu[2].entries[7].checked = false;
                    this.topLevelMenu[2].entries[8].checked = true;
                    this.topLevelMenu[2].entries[9].checked = false;
                    document.application.model.documentStageView = value;
                }
            } else {
                if(!this.topLevelMenu[2].entries[9].checked) {
                    this.topLevelMenu[2].entries[7].checked = false;
                    this.topLevelMenu[2].entries[8].checked = false;
                    this.topLevelMenu[2].entries[9].checked = true;
                    document.application.model.documentStageView = value;
                }
            }
        }
    },

    topLevelMenu: {
        value: [
                {
                    "label": "File",
                    "entries": [
                        {
                            "label" : "New Project",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action":   "executeNewProject"
                        },
                        {
                            "label" : "New File",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action":   "executeNewFile"
                        },
                        {
                            "label" : "Open File",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action": "executeFileOpen"
                        },
                        {
                            "label" : "Close File",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action": "executeFileClose"
                        },
                        {
                            "label" : "Close All",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action": "executeFileCloseAll"
                        },
                        {
                            "label" : "",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "separator": true,
                            "enabled": true,
                            "action": ""
                        },
                        {
                            "label" : "Save",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action": "executeSave"
                        },
                        {
                            "label" : "Save As",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action":"executeSaveAs"
                        },
                        {
                            "label" : "Save All",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action": "executeSaveAll"
                        },
                        {
                            "label" : "",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "separator": true,
                            "enabled": true,
                            "action": ""
                        },
                        {
                            "label" : "Open Project",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Open Recent",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Close Project",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        }
                    ]
                },
                {
                    "label": "Edit",
                    "entries": [
                        {
                            "label" : "Undo",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "newenabled": {
                                "value": false,
                                "boundObj": "undocontroller",
                                "boundProperty": "canUndo",
                                "oneway": true
                            },
                            "action":   "executeUndo"
                        },
                        {
                            "label" : "Redo",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "newenabled": {
                                "value": false,
                                "boundObj": "undocontroller",
                                "boundProperty": "canRedo",
                                "oneway": true
                            },
                            "action":   "executeRedo"
                        },
                        {
                            "label" : "Cut",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action":   "executeCut"
                        },
                        {
                            "label" : "Copy",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action":   "executeCopy"
                        },
                        {
                            "label" : "Paste",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "document",
                            "action":   "executePaste"
                        }
                    ]
                },
                {
                    "label": "View",
                    "entries": [
                        {
                            "label" : "Chrome Preview",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "executePreview"
                        },
                        {
                            "label" : "",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "separator": true,
                            "enabled": true,
                            "action": ""
                        },
                        {
                            "label" : "Layout View",
                            "checked": false,
                            "submenu" : true,
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "",
                            "entries": [
                                {
                                    "label" : "View All",
                                    "checked": true,
                                    "boundProperty": "layoutAll",
                                    "submenu" : false,
                                    "entries": [],
                                    "depend": "layout",
                                    "enabled": true,
                                    "action": "toggle-layout-layoutAll"
                                },
                                {
                                    "label" : "View Items Only",
                                    "checked": false,
                                    "boundProperty": "layoutItems",
                                    "submenu" : false,
                                    "entries": [],
                                    "depend": "layout",
                                    "enabled": true,
                                    "action": "toggle-layout-layoutItems"
                                },
                                {
                                    "label" : "Off",
                                    "checked": false,
                                    "boundProperty": "layoutOff",
                                    "submenu" : false,
                                    "entries": [],
                                    "depend": "layout",
                                    "enabled": true,
                                    "action": "toggle-layout-layoutOff"
                                }
                            ]
                        },
                        {
                            "label" : "Snap",
                            "checked": true,
                            "boundProperty": "snap",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "toggle-snap-onoff"
                        },
                        {
                            "label" : "Snap To",
                            "checked": false,
                            "submenu" : true,
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "",
                            "entries": [
                                {
                                    "label" : "Grid",
                                    "submenu" : false,
                                    "checked": true,
                                    "boundProperty": "snapGrid",
                                    "entries": [],
                                    "enabled": true,
                                    "action": "toggle-snap-snapGrid"
                                },
                                {
                                    "label" : "Objects",
                                    "checked": true,
                                    "boundProperty": "snapObjects",
                                    "submenu" : false,
                                    "entries": [],
                                    "enabled": true,
                                    "action": "toggle-snap-snapObjects"
                                },
                                {
                                    "label" : "Snap Align",
                                    "checked": true,
                                    "boundProperty": "snapAlign",
                                    "submenu" : false,
                                    "entries": [],
                                    "enabled": true,
                                    "action": "toggle-snap-snapAlign"
                                }
                            ]
                        },
                        {
                            "label" : "Show 3D Grid",
                            "checked": false,
                            "boundProperty": "show3dGrid",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "toggle-grid-onoff"
                        },
                        {
                            "label" : "",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "separator": true,
                            "enabled": true,
                            "action": ""
                        },
                        {
                            "label" : "Front View",
                            "checked": true,
                            "boundProperty": "front",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "toggle-view-front"
                        },
                        {
                            "label" : "Top View",
                            "checked": false,
                            "boundProperty": "top",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "toggle-view-top"
                        },
                        {
                            "label" : "Side View",
                            "checked": false,
                            "boundProperty": "side",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "depend": "designDocument",
                            "action": "toggle-view-side"
                        }
                    ]
                },
                {
                    "label": "Window",
                    "entries": [
                        {
                            "label" : "Tools",
                            "checked": true,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Timeline",
                            "checked": true,
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Properties",
                            "checked": true,
                            "boundProperty": "PropertiesPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Color",
                            "checked": true,
                            "boundProperty": "ColorPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Components",
                            "checked": true,
                            "boundProperty": "ComponentsPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "CSS",
                            "checked": true,
                            "boundProperty": "CSSPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Materials",
                            "checked": true,
                            "boundProperty": "MaterialsPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        },
                        {
                            "label" : "Presets",
                            "checked": true,
                            "boundProperty": "PresetsPanel",
                            "submenu" : false,
                            "entries": [],
                            "enabled": false,
                            "action": ""
                        }
                    ]
                },
                {
                    "label": "Help",
                    "entries": [
                        {
                            "label" : "Ninja FAQ",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action":   "executeHelpFAQ"
                        },
                        {
                            "label" : "Ninja Forums",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action":   "executeHelpForums"
                        },
                        {
                            "label" : "Help Topics",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action":   "executeHelpTopics"
                        },
                        {
                            "label" : "About Ninja...",
                            "checked": false,
                            "submenu" : false,
                            "entries": [],
                            "enabled": true,
                            "action":   "executeHelpAbout"
                        }
                    ]
                }
            ]
    }
});