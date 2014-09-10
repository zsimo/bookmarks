/*!
 * Copyright (C) 2014 Simone Sacchi
 */

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();


// **************************************************
//
// domElement: elemento che vuoi manipolare
//             puoi passare sia id che elemento stesso
//
// style: oggetto chiave/valore
// ***************************************************
// NOTE Css
(function( global ) {

//    "use strict";

    var Css = (function() {
        var elementsCounter = 0,
            elements = {};
        var buildAnimation = {
            "transition-property" : "all",
            "transition-duration" : "500ms",
            "transition-timing-function" : "ease",
            "transition-delay" : 0
        };
    //    var styleObj= document.styleSheets[0].cssRules[0].style;
    //console.log(styleObj);

        var setStyleLoop = function(styleElement, style) {
            for (var key in style) {
                if (style.hasOwnProperty(key)) {
        //            console.log(key+" : "+style[key]);
                    styleElement.setProperty(key, style[key]);
                }
            }
        };

        var getElement = function(element) {
            var domElement,
                elementId;
            if (typeof element === "object") {
                elementId = element.id;
                domElement = element;
            } else {
                elementId = element;
                domElement = document.getElementById(element);
            }
            if (!elements.hasOwnProperty(elementId)) {
                elements[elementId] = domElement;
                elementsCounter += 1;
            }
            return domElement;
        };

        var getElementsCounter = function() {
            return elementsCounter;
        };

        var getAllTheObjects = function() {
            return elements;
        };

        var getStyle = function(domElement) {
            return getElement(domElement).style;
        };

        var setStyle = function(domElement, style, animation) {
            var elementId;
            var styleElement;
            styleElement = getElement(domElement).style;
            setStyleLoop(styleElement, style);
            if (animation) {
                setStyleLoop(styleElement, buildAnimation);
            }
        };

        // ***************************************************************************************
        // Kirupa algorithm: http://www.kirupa.com/html5/get_element_position_using_javascript.htm
        // ***************************************************************************************
        // @element culd be both the ID string or the reference to the element
        var getPosition = function (element) {
            var xPosition = 0,
                yPosition = 0;
            if (typeof element === "string") {
                element = elements[element];
            }
            while (element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        };

        // ***************************************************************************************
        // David Walsh algorithm: http://davidwalsh.name/vendor-prefix
        // ***************************************************************************************
        var prefix = function () {
          var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
              .call(styles)
              .join('')
              .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1],
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

          return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre[0].toUpperCase() + pre.substr(1)
          };
        };
        // @type dom-lowercase-css-js
        var getPrefix = function(type) {
            return prefix()[type];
        };

        // **************************************************************************
        // David Walsh algorithm: http://davidwalsh.name/ways-css-javascript-interact
        // **************************************************************************
        // use: setCssRule(document.styleSheets[0], "header", "float: left");
        var setCssRule = function(sheet, selector, rules, index) {
            if(sheet.insertRule) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else {
                sheet.addRule(selector, rules, index);
            }
        };
        // use: fastSetCssRule(".class", "color:red;")
        var fastSetCssRule = function(selector, rules) {
            document.styleSheets[0].addRule(selector, rules);
        };
        var getCssRule = function(sheet, selector, rules, index) {
            if(sheet.insertRule) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else {
                sheet.addRule(selector, rules, index);
            }
        };

        // **************************************************************************
        // http://jss-lang.org/home/how_to_use_jss/browser.en.html
        // **************************************************************************
        // use: createStyleSheetInTheHeader(".myClass {color:red}" )
        var createStyleSheetInTheHeader = function(css) {
            var head = document.getElementsByTagName("head")[0];
            var style_el = document.createElement("style");
            style_el.setAttribute("type", "text/css");
            head.appendChild(style_el);

            if(style_el.styleSheet){// IE
                style_el.styleSheet.cssText = css;
            }
            else {// w3c
                var style_content = document.createTextNode(css)
                style_el.appendChild(style_content);
            }
        };

        // public interface
        return {
            createStyleSheetInTheHeader : createStyleSheetInTheHeader,
            getAllTheObjects : getAllTheObjects,
            getElement : getElement,
            getPrefix : getPrefix,
            getStyle : getStyle,
            setStyle : setStyle,
            getPosition : getPosition,
            fastSetCssRule : fastSetCssRule,
            setCssRule : setCssRule,
            getElementsCounter : getElementsCounter
        };

    })();

    global.css = Css;

})( this );

// NOTE ZTooltip
var ZTooltip = function(element, origin, settings) {
    settings = settings || {};

    var positionRespectToTarget = settings.positionRespectToTarget;
//    var css = new Css();
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var tooltip = new function(element) {
        this.domElement = function() {
            if (typeof element === "string") {
                return document.getElementById(element);
            }
            return element;
        }();
        this.padding = 15;
        this.border = 1;
        this.offset = 0;
        this.x;
        this.y;
        this.destinationX = null;
        this.destinationY;
        this.isShown;
    }(element);

    var target = new function(){
        var domElement = document.getElementById(settings.targetId);
        this.x = css.getPosition(domElement).x;
        this.y = css.getPosition(domElement).y;
        this.width = domElement.clientWidth;
        this.height = domElement.clientHeight;
    }();

    var style = {
        "background-color" : "rgba(240, 240, 240, .95)",
        "border" : tooltip.border+"px solid darkgray",
        "border-radius" : "5px",
        "display" : "none",
        "font" : "60px Myriad, Helvetica, Arial, sans-serif",
        "transition-property" : "all",
        "transition-duration" : "450ms",
        "transition-timing-function" : "ease",
        "padding" : tooltip.padding+"px",
        "position" : "absolute",
        "width" : "auto",
        "height" : "auto",
        "z-index" : 9999
    };


    if (origin === "left") {
        tooltip.x = "-150px";
        tooltip.y = "40%";
    } else if (origin === "top") {
        tooltip.x = "40%";
        tooltip.y = "-150px";
    } else if (origin === "right") {
        tooltip.x = windowWidth + 150 + "px";
        tooltip.y = "40%";
    } else if (origin === "bottom") {
        tooltip.x = "40%";
        tooltip.y = windowHeight + 150 + "px";
    }

//    css.setStyle(tooltip.domElement, {
//        left : tooltip.x,
//        top : tooltip.y
//    });
    css.setStyle(tooltip.domElement, style);
    css.setCssRule(document.styleSheets[0], ".hide", "left:"+tooltip.x+";top:"+tooltip.y+";opacity:0;");
    // TODO
    var showRule = "opacity:0;transform:translate3d("+tooltip.x+","+tooltip.y+",0px);";
//    console.log(showRule);
//    css.setCssRule(document.styleSheets[0], ".hide", showRule);
    tooltip.domElement.className = "hide";

//    css.setStyle(tooltip.domElement, {
//        "left" : tooltip.x,
//        "top" : tooltip.y
//    });

    var getDestination = function(type) {
        var targetCoord;
        var tooltipDim;
        if (type === "X") {
            targetCoord = target.x;
            tooltipDim = window.getComputedStyle(tooltip.domElement).width;
            tooltipDim = parseInt(tooltipDim.substring(0, tooltipDim.length-2));
        } else {
            targetCoord = target.y;
            tooltipDim = window.getComputedStyle(tooltip.domElement).height;
            tooltipDim = parseInt(tooltipDim.substring(0, tooltipDim.length-2));
        }
        return targetCoord -
               (tooltip.padding*2) -
               (tooltip.border*2) -
               tooltip.offset -
               tooltipDim;
    };

    var setDestination = function(positionRespectToTarget) {
        switch(positionRespectToTarget) {
            case "top":
                tooltip.destinationX = (target.x) + (target.width/2);
                tooltip.destinationY = getDestination("Y");
            break;

            case "bottom":
                tooltip.destinationX = target.x + (target.width/2);
                tooltip.destinationY = target.y + target.height + tooltip.offset;
            break;

            case "left":
                tooltip.destinationX = getDestination("X");
                tooltip.destinationY = target.y + (target.height/2);
            break;

            case "right":
                tooltip.destinationX = target.x + target.width + tooltip.offset;
                tooltip.destinationY = target.y + (target.height/2);
            break;

            default:
            break;
        }
    };


    this.show = function() {

        css.setStyle(tooltip.domElement, {"display" : "inline"});

        if (tooltip.destinationX == null) {
            setDestination(settings.positionRespectToTarget);
            css.setCssRule(document.styleSheets[0], ".show", "left:"+tooltip.destinationX+
                                                "px;opacity:1;top:"+tooltip.destinationY+"px;");
            // TODO
            var hideRule = "opacity:1;transform:translate3d("+tooltip.destinationX+"px,"+
                                    tooltip.destinationY+"px,0px);";
//            console.log(hideRule);
//            css.setCssRule(document.styleSheets[0], ".show", hideRule);

        }

        setTimeout(function() {
//            css.setStyle(tooltip.domElement, {
//                "left" : tooltip.destinationX+"px",
//                "top" : tooltip.destinationY+"px"
//            });
            tooltip.domElement.className = "show";
//            console.log(tooltip.domElement.className);
            tooltip.isShown = true;
        }, 50);

    };

    this.hide = function() {
//        css.setStyle(tooltip.domElement, {
//            // non server aggiungere px
//            "left" : tooltip.x,
//            "top" : tooltip.y
//        });
//        console.log(css.getStyle(tooltip.domElement).left);
        tooltip.domElement.className = "hide";

        tooltip.isShown = false;

        setTimeout(function() {
            css.setStyle(tooltip.domElement, {"display" : "none"});
        }, 550);
    };

    this.isShown = function() {
        return tooltip.isShown;
    };

    this.toggle = function() {
        if (tooltip.isShown) {
          this.hide();
        }
        else {
            this.show();
        }
    };


};


var BasicConstructor = function() {
    // uso:
    // var basic = new BasicConstructor()
    // basic.publicMethod()
    // basic.publicVariable

    var privateVariable = "private...";
    var privateMethod = function() {
      console.log(privateVariable);
    };

    this.publicVariable = "public!!";
    this.publicMethod = function() {
         privateMethod();
    };

};


var parameters = "eventuali parametri da importare";
var Module = (function(parameters) {
    // uso: se alla fine viene subito chiamato, non c'è bisogno di new
    // ES:
    // var modulo = (function(param) {
    //    ...
    // })(eventualiParametri);
    // Module.publicMethod()
    // Module.publicVarible

    // invece, se alla fine NON viene chiamato subito
    // ES:
    // var modulo = (function(param) {
    //    ...
    // });
    // l oggetto viene inizializzato con new
    // var modulo = new Modulo(eventualiParametri);

    var privateVariable = "private...";
    var privateMethod = function() {
      console.log(privateVariable);
    };

    var mpublic = {};
    mpublic.publicVarible = "public!!";
    mpublic.publicMethod = function() {
         privateMethod();
    };
    mpublic.useParameters = function() {
         console.log(parameters);
    };

    return mpublic;

})(parameters);




// FUTURE A Practical Module
(function( global ) {
  var Module = (function() {

    var data = "secret";

    return {
      // This is some boolean property
      bool: true,
      // Some string value
      string: "a string",
      // An array property
      array: [ 1, 2, 3, 4 ],
      // An object property
      object: {
        lang: "en-Us"
      },
      getData: function() {
        // get the current value of `data`
        return data;
      },
      setData: function( value ) {
        // set the value of `data` and return it
        return ( data = value );
      }
    };
  })();

  // Other things might happen here

  // expose our module to the global object
  global.Module = Module;

})( this );


// FUTURE A Practical Constructor
(function( global ) {

  function Ctor( foo ) {

    this.foo = foo;

    return this;
  }

  var mprivate = "private";
  var privateArray = [];

  Ctor.prototype.getFoo = function() {
    return this.foo;
  };

  Ctor.prototype.getPrivate = function() {
    return mprivate;
  };

  Ctor.prototype.addPrivateArray = function(value) {
    privateArray.push(value);
  };

  Ctor.prototype.getPrivateArray = function() {
    return privateArray;
  };

  Ctor.prototype.setPrivate = function(value) {
    mprivate = value;
  };

  Ctor.prototype.setFoo = function( val ) {
    return ( this.foo = val );
  };

  // To call constructor's without `new`, you might do this:
  var ctor = function( foo ) {
    return new Ctor( foo );
  };

  // expose our constructor to the global object
  global.ctor = ctor;

})( this );














