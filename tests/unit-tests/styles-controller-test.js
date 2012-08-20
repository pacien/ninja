/**
 * Created by JetBrains WebStorm.
 * User: kfg834
 * Date: 12/27/11
 * Time: 10:52 AM
 * To change this template use File | Settings | File Templates.
 */
var Montage = require("montage/core/core").Montage;
var cmObject = require("ninjaapp/js/controllers/styles-controller"),
    cm = cmObject.StylesController;


describe('StylesController', function() {

    
    function makeAndAppend(tag, attr) {
        var el = document.createElement(tag);
        if (typeof attr === 'object') {
            for (var a in attr) {
                if (attr.hasOwnProperty(a)) {
                    el[a] = attr[a];
                }
            }
        } else if (typeof attr === 'string') {
            el.className = (el.className + ' ' + attr).trim();
        }

        document.body.appendChild(el);

        return el;
    }

    /** **************** Rule tests **************** */
    
    
    /* Add a Rule */
    describe('addRule', function() {
        it('Add Rule', function() {
            cm.activeDocument = { "_document": document };
            var rule = cm.addRule('div#Div_1 { background-color: rgb(0, 0, 0) }');
            expect(rule.cssText).toEqual("div#Div_1 { background-color: rgb(0, 0, 0); }");

        });

    });
    
    /* Create OverRide Rule */
    describe('createOverrideRule', function() {
        it('Override rule created successfully', function() {
            var object = sm.createOverrideRule('div#Div_1 { background-color: black }', 'div');
            expect(object.rule).toEqual("div#Div_1 { background-color: black }");
            
        });

    });
    
    
    /*Delete a Rule*/
    describe('Delete Rule', function() {
        it('Rule deleted successfully', function() {
             var index = sm.deleteRule('div#Div_1 { background-color: black }');
             expect(index).toBeGreaterThan(-1);
        });

    });


    /* Get Dominant Rule for an Element */
    describe('GetDominantRule-Element', function() {

        it('Got Dominant rule for element successfully', function() {

                var rules = ['div#Div_1 { background-color: black }',
                    '#UserContent div#Div_1 { background-color: blue }',
                    '#UserContent #Div_1 { background-color: white }',
                    'div div#Div_1 { background-color: red }'];

                     rules.forEach(function(rule) {
                     stylesController.addRule(rule);
                     });
                     
                var rule = sm.getDominantRuleForElement('div','background-color',true);
                expect(rule).toEqual("#UserContent div#Div_1 { background-color: blue }");

        });

    });

    /* Disable a Rule */
    describe('DisableRule', function() {
    
        it('Rule disabled successfully', function() {
            //Type of rule is not a number
            var rule = sm.disableRule('div#Div_1 { background-color: black }');
            expect(rule).toEqual('div#Div_1'+ sm.CONST.GARBAGE_SELECTOR);

        });

    });

    
    /* Enable a Rule */
    describe('EnableRule', function() {
        it('Rule enabled successfully', function() {

           //Type of rule is not a number
           var rule = sm.enableRule('div#Div_1 { background-color: black }');
           expect(rule.selectorText).toEqual('div#Div_1');

            //Type of rule is a number ie index
            var rule = sm.enableRule('div#Div_1 { background-color: black }');
            expect(rule).toEqual("div#Div_1 { background-color: black }");

        });

    });

    
    /* Set Rule Selector */
    describe('SetRuleSelector', function() {
    
            it('Set Rule Selector successfully', function() {
                var rule = sm.setRuleSelector('div#Div_1 { background-color: black }', 'Div');
                expect(rule).toEqual("Div { background-color: black }");
                expect(rule.specificity.specificity.id).toEqual(0);
                //expect(rule.specificity.specificity.class).toEqual(0);
                expect(rule.specificity.specificity.element).toEqual(1);
            });

    });
    
    
    /*Calculate Specificity */
    describe('Calculate Specificity', function() {
    
            it('Calculated specificity successfully', function() {
                var specificity = sm.calculateSpecificity(0,1);
                expect(specificity.specificity[2]).toEqual(1);
            });

    });

});