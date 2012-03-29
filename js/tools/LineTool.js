/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

var Montage = 	require("montage/core/core").Montage,
    ShapeTool = require("js/tools/ShapeTool").ShapeTool,
    DrawingToolBase = require("js/tools/drawing-tool-base").DrawingToolBase,
    ElementMediator = require("js/mediators/element-mediator").ElementMediator,
    NJUtils = require("js/lib/NJUtils").NJUtils,
    TagTool = require("js/tools/TagTool").TagTool,
    ShapesController = 	require("js/controllers/elements/shapes-controller").ShapesController,
    ShapeModel = require("js/models/shape-model").ShapeModel;

var Line = require("js/lib/geom/line").Line;
var MaterialsModel = require("js/models/materials-model").MaterialsModel;

exports.LineTool = Montage.create(ShapeTool, {
	_toolID: { value: "lineTool" },
	_imageID: { value: "lineToolImg" },
	_toolImageClass: { value: "lineToolUp" },
	_selectedToolImageClass: { value: "lineToolDown" },
	_toolTipText: { value: "Line Tool (L)" },

    _tmpDrawIndex : { value : 1, writable:true},

    _mode: {value: null, writable:true},

    // Need to keep track of current mouse position for KEY modifiers event which do not have mouse coordinates
    _currentX: {value: 0, writable: true},
    _currentY: {value: 0, writable: true},
    _lineView: {value: null, writable:true},
    _ovalView: {value: null, writable:true},

    _strokeSize: { value: 1 },
    _strokeColor: { value: null },

    HandleLeftButtonDown:
    {
        value: function (event)
        {
            if(this._canDraw) {
                this._isDrawing = true;
            }

            this._strokeSize = ShapesController.GetValueInPixels(this.options.strokeSize.value, this.options.strokeSize.units, null);
			if (this.application.ninja.colorController.colorToolbar.stroke.color)
				this._strokeColor = this.application.ninja.colorController.colorToolbar.stroke.color.css;
			else
				this._strokeColor = [0,0,0,1];
            this.startDraw(event);
        }
    },

    HandleLeftButtonUp:
    {
        value: function (event)
        {
            var slope = this._getSlope(),
                drawData = this.getDrawingData();

            if(drawData) {
                var canvas,
                    xAdj = 0,
                    yAdj = 0,
                    w = ~~drawData.width,
                    h = ~~drawData.height;
                if(!this._useExistingCanvas())
                {
                    // set the dimensions
                    if(slope === "horizontal")
                    {
                        h = Math.max(this._strokeSize, 1);
                    }
                    else if(slope === "vertical")
                    {
                        w = Math.max(this._strokeSize, 1);
                    }
                    else
                    {
                        // else make the line's stroke fit inside the canvas by growing the canvas
                        var theta = Math.atan(slope);
                        xAdj = Math.abs((this._strokeSize/2)*Math.sin(theta));
                        yAdj = Math.abs((this._strokeSize/2)*Math.cos(theta));

                        w += ~~(xAdj*2);
                        h += ~~(yAdj*2);
                    }

                    canvas = NJUtils.makeNJElement("canvas", "Canvas", "shape", {"data-RDGE-id": NJUtils.generateRandom()}, true);
                    var elementModel = TagTool.makeElement(w, h, drawData.planeMat, drawData.midPt, canvas);

                    ElementMediator.addElement(canvas, elementModel.data, true);
                    canvas.elementModel.isShape = true;
                }
                else
                {
                    canvas = this._targetedElement;
                    canvas.elementModel.controller = ShapesController;
                    if(!canvas.elementModel.shapeModel)
                    {
                        canvas.elementModel.shapeModel = Montage.create(ShapeModel);
                    }
                }
                this.RenderShape(w, h, drawData.planeMat, drawData.midPt,
                                    canvas, slope, xAdj, yAdj);
                NJevent("elementAdded", canvas);
            }

            this.endDraw(event);

            this._isDrawing = false;
            this._hasDraw=false;


            this.DrawHandles();
        }
    },

    _getSlope: {
        value: function() {
            var hitRec0 = this._mouseDownHitRec,
                hitRec1 = this._mouseUpHitRec,
                slope;
            
			if (hitRec0 && hitRec1)
			{
				var p0 = hitRec0.getLocalPoint(),
					p1 = hitRec1.getLocalPoint();

                // check for divide by 0 for vertical line:
                if( Math.round(p0[0] - p1[0]) === 0 )
                {
                    // vertical line
                    slope = "vertical";
                }
                else if (Math.round(p0[1] - p1[1]) === 0 )
                {
                    // horizontal line
                    slope = "horizontal";
                }
                else
                {
                    // if slope is positive, draw a line from top-left to bottom-right
                    slope = (p0[1] - p1[1])/(p0[0] - p1[0]);
                }
            }

            return slope;
        }
    },

    _doDraw: {
        value: function () {
            if (this.mouseDownHitRec !== null) {
                DrawingToolBase.stageComponent = this.application.ninja.stage;
                DrawingToolBase.drawLine(this.mouseDownHitRec, this.mouseUpHitRec, this._strokeSize, this._strokeColor);
            }
        }
    },

    HandleShiftKeyDown: {
        value: function (event) {
            if (this._isDrawing) {
                var slope = Math.abs((this.downPoint.y - this.currentY)/(this.downPoint.x - this.currentX));
                // If slope is less than 0.5, make it a horizontal line
                if(slope < 0.5)
                {
                    this._mouseUpHitRec = DrawingToolBase.getUpdatedSnapPoint(this.currentX, this.downPoint.y, false, this._mouseDownHitRec);
                }
                // If slope is greater than 2, make it a vertical line
                else if(slope > 2)
                {
                    this._mouseUpHitRec = DrawingToolBase.getUpdatedSnapPoint(this.downPoint.x, this.currentY, false, this._mouseDownHitRec);
                }
                // make it a 45 degree line
                else
                {
                    var square = this.toSquare(this.downPoint.x, this.currentX, this.downPoint.y, this.currentY);
                    this._mouseUpHitRec = DrawingToolBase.getUpdatedSnapPoint(square[0] + square[2], square[1] + square[3], false, this._mouseDownHitRec);
                }
                this._doDraw();
            }
        }
    },

    HandleShiftKeyUp: {
        value: function () {
            if (this._isDrawing) {
                this.mouseUpHitRec = DrawingToolBase.getUpdatedSnapPoint(this.currentX, this.currentY, false, this.mouseDownHitRec);
                this._doDraw();
            }
        }
    },

    RenderShape: {
		value: function (w, h, planeMat, midPt, canvas, slope, xAdj, yAdj)
        {

            var strokeStyleIndex = this.options.strokeStyleIndex;
            var strokeStyle = this.options.strokeStyle;
            var strokeSize = this._strokeSize;

            var left = Math.round(midPt[0] - 0.5*w);
            var top = Math.round(midPt[1] - 0.5*h);

            var strokeColor = this.application.ninja.colorController.colorToolbar.stroke.webGlColor;
            // for default stroke and fill/no materials
            var strokeMaterial = null;

            if(this.options.use3D)
            {
                var strokeM = this.options.strokeMaterial;
                if(strokeM)
                {
                    strokeMaterial = Object.create(MaterialsModel.getMaterial(strokeM));
                }
            }

            var world = this.getGLWorld(canvas, this.options.use3D);

            var xOffset = ((left - canvas.offsetLeft + w/2) - canvas.width/2);
            var yOffset = (canvas.height/2 - (top - canvas.offsetTop + h/2));

            var line = new Line(world, xOffset, yOffset, w, h, slope, strokeSize, strokeColor, strokeMaterial, strokeStyle, xAdj, yAdj);

            world.addObject(line);
            world.render();

            canvas.elementModel.shapeModel.shapeCount++;
            if(canvas.elementModel.shapeModel.shapeCount === 1)
            {
                canvas.elementModel.selection = "Line";
                canvas.elementModel.pi = "LinePi";
                canvas.elementModel.shapeModel.strokeSize = this.options.strokeSize.value + " " + this.options.strokeSize.units;

                canvas.elementModel.shapeModel.strokeStyleIndex = strokeStyleIndex;
                canvas.elementModel.shapeModel.strokeStyle = strokeStyle;

                canvas.elementModel.shapeModel.GLGeomObj = line;
                canvas.elementModel.shapeModel.useWebGl = this.options.use3D;
            }
            else
            {
                // TODO - update the shape's info only.  shapeModel will likely need an array of shapes.
            }

            if(canvas.elementModel.isShape)
            {
                this.application.ninja.selectionController.selectElement(canvas);
            }

        }
    }
});


