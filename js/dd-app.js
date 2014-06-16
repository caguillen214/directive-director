var ddApp = {
  defaultDirectives : {
    'abbr' : 'abbr',
    'accept': 'accept',
    'accesskey': 'accesskey',
    'action': 'action',
    'align': 'align',
    'alt':'alt',
    'background':'background',
    'bgcolor': 'bgcolor',
    'border': 'border',
    'cellpadding': 'cellpadding',
    'char': 'char',
    'charoff': 'charoff',
    'charset': 'charset',
    'checked': 'checked',
    'cite': 'cite',
    'class': 'class',
    'classid': 'classid',
    'code': 'code',
    'codebase': 'codebase',
    'color': 'color',
    'cols': 'cols',
    'colspan': 'colspan',
    'content': 'content',
    'data': 'data',
    'defer': 'defer',
    'dir': 'dir',
    'face': 'face',
    'for': 'for',
    'frame': 'frame',
    'frameborder': 'frameborder',
    'headers': 'headers',
    'height': 'height',
    'http-equiv':'http-equiv',
    'href': 'href',
    'id': 'id',
    'label': 'label',
    'lang': 'lang',
    'language': 'language',
    'link': 'link',
    'marginheight': 'marginheight',
    'marginwidth': 'marginwidth',
    'maxlength':'maxlength',
    'media': 'media',
    'multiple': 'multiple',
    'name': 'name',
    'object': 'object',
    'onblur': 'onblur',
    'onchange': 'onchange',
    'onclick': 'onclick',
    'onfocus': 'onfocus',
    'onkeydown':'onkeydown',
    'onkeypress': 'onkeypress',
    'onkeyup': 'onkeyup',
    'onload': 'onload',
    'onmousedown': 'onmousedown',
    'onmousemove': 'onmousemove',
    'onmouseout': 'onmouseout',
    'onmouseover': 'onmouseover',
    'onmouseup': 'onmouseup',
    'onreset': 'onreset',
    'onselect': 'onselect',
    'onsubmit': 'onsubmit',
    'readonly': 'readonly',
    'rel': 'rel',
    'rev': 'rev',
    'rows': 'rows',
    'rowspan': 'rowspan',
    'size': 'size',
    'span': 'span',
    'src': 'src',
    'start': 'start',
    'style': 'style',
    'text': 'text',
    'target': 'target',
    'title': 'title',
    'type': 'type',
    'value': 'value',
    'width': 'width',
    'ng-app': 'ng-app',
    'ng-bind': 'ng-bind',
    'ng-bindhtml': 'ng-bindhtml',
    'ng-bindtemplate': 'ng-bindtemplate',
    'ng-blur': 'ng-blur',
    'ng-change': 'ng-change',
    'ng-checked': 'ng-checked',
    'ng-class': 'ng-class',
    'ng-classeven': 'ng-classeven',
    'ng-classodd': 'ng-classodd',
    'ng-click': 'ng-click',
    'ng-cloak': 'ng-cloak',
    'ng-controller': 'ng-controller',
    'ng-copy': 'ng-copy',
    'ng-csp': 'ng-csp',
    'ng-cut': 'ng-cut',
    'ng-dblclick': 'ng-dblclick',
    'ng-disabled': 'ng-disabled',
    'ng-focus': 'ng-focus',
    'ng-form': 'ng-form',
    'ng-hide': 'ng-hide',
    'ng-href': 'ng-href',
    'ng-if': 'ng-if',
    'ng-include': 'ng-include',
    'ng-init': 'ng-init',
    'ng-keydown': 'ng-keydown',
    'ng-keypress': 'ng-keypress',
    'ng-keyup': 'ng-keyup',
    'ng-list': 'ng-list',
    'ng-model': 'ng-model',
    'ng-modeloptions': 'ng-modeloptions',
    'ng-mousedown': 'ng-mousedown',
    'ng-mouseenter': 'ng-mouseenter',
    'ng-mouseleave': 'ng-mouseleave',
    'ng-mousemove': 'ng-mousemove',
    'ng-mouseover': 'ng-mouseover',
    'ng-mouseup': 'ng-mouseup',
    'ng-nonbindable': 'ng-nonbindable',
    'ng-open': 'ng-open',
    'ng-paste': 'ng-paste',
    'ng-pluralize': 'ng-pluralize',
    'ng-readonly': 'ng-readonly',
    'ng-repeat': 'ng-repeat',
    'ng-selected': 'ng-selected',
    'ng-show': 'ng-show',
    'ng-src': 'ng-src',
    'ng-srcset': 'ng-srcset',
    'ng-style': 'ng-style',
    'ng-submit': 'ng-submit',
    'ng-switch': 'ng-switch',
    'ng-transclude': 'ng-transclude',
    'ng-value': 'ng-value'},
}

ddApp.beginSearch = function(scopeElements, options) {
  var customDirectives = false, tolerance = 4;
  if(!Array.isArray(scopeElements)) {
    throw new Error("Function beginSearch must be passed an array.");
  }
  options = (options)? options: {};
  customDirectives = (options.includeCustom)? ddApp.getCustomDirectives() : false;
  tolerance = (options.tolerance)? options.tolerance: tolerance;

  var failedElements = ddApp.findFailedElements(scopeElements, customDirectives);
  var correctionsFound = ddApp.getSuggestions(failedElements, tolerance);
  var messages = ddApp.displayResults(correctionsFound);

  return correctionsFound;
};

ddApp.findFailedElements = function(scopeElements, customDirectives) {
  var failedElements = [];
  scopeElements.forEach(function(element) {
    if(element.attributes.length) {
      failedAttributes = ddApp.getFailedAttributes(element.attributes,customDirectives);
      if(failedAttributes.length) {
        failedElement = {
          element: element,
          failedAttributes: failedAttributes
        };
        failedElements.push(failedElement);
      }
    }
  });
  return failedElements;
}
ddApp.getSuggestions = function(failedElements, tolerance) {
  var correctionsFound = [], CUSTOM = true, DEFAULT = false;
  failedElements.forEach(function(failed) {
    var cDirMatch = ddApp.findClosestMatchIn(CUSTOM, failed);
    var dDirMatch = ddApp.findClosestMatchIn(DEFAULT, failed);
    var match, minDifference;
    for(var i in cDirMatch) {
      minDifference = Math.min(cDirMatch[i].levDist,dDirMatch[i].levDist);
      match = (minDifference == cDirMatch[i].levDist)? cDirMatch: dDirMatch;
    }
    if(minDifference < tolerance-2) {
      var toPush = {domElement:failed, results: match};
      correctionsFound.push(toPush);
    }
  })
  return correctionsFound;
};
ddApp.displayResults = function(correctionsFound) {
  var messages = [];
  correctionsFound.forEach(function(obj) {
    obj.results.forEach(function(attr) {
      id = (obj.domElement.element.id) ? ' with id: #'+obj.domElement.element.id : '';
      type = obj.domElement.element.nodeName;
      message = 'There was an error in '+type+' element'+id+
      '. Found incorrect attribute "'+attr.error+'" try "'+attr.match+'".';
      console.log(message)
      console.log(obj.domElement.element)
      messages.push(message)
    })
  })
  return messages;
};
ddApp.getFailedAttributes = function(attributes, customDirectives) {
  var CUSTOM = false, DEFAULT = true;
  var failedAttributes = [];
  for(var i = 0; i < attributes.length; i++) {
    var attr = attributes[i].nodeName;
    var inDefault = ddApp.attrOfEleExsistIn(DEFAULT, attr);
    var inCustom = (customDirectives)? ddApp.attrOfEleExsistIn(CUSTOM, attr) : false;
    if(!inDefault && !inCustom) {
      failedAttributes.push(attr);
    }
  }
  return failedAttributes;
};
ddApp.findClosestMatchIn = function(isDefault, failedEle, customDirectives) {
  if(failedEle === null || failedEle === undefined) {
    throw new Error('Function must be passed a defined object as second parameter.')
  }
  var directiveData = (isDefault)? ddApp.defaultDirectives : customDirectives;
  var failedAttrs = failedEle.failedAttributes;
  var correctionsToSend = [];
  failedAttrs.forEach(function(failedAttr) {
    var min_levDist = Number.MAX_SAFE_INTEGER;
    for(var i in directiveData){
      var attr = directiveData[i]
      if(Math.abs(failedAttr.length-attr.length) < 3) {
        var currentlevDist = ddApp.levenshteinDistance(failedAttr, attr);
        var closestMatch = (min_levDist > currentlevDist)? attr : closestMatch;
        var min_levDist = (min_levDist > currentlevDist)? currentlevDist : min_levDist;
      }
    }
    correctionsToSend.push({
      error: failedAttr,
      match: closestMatch,
      levDist: min_levDist
    });
  })
  return correctionsToSend;
};
ddApp.attrOfEleExsistIn = function(isDefault,attribute, customDirectives){
  if(typeof attribute !== 'string') {
    throw new Error('Function must be passed string as second parameter, given: '+
      typeof attribute+'.');
  }
  var currentAttr = (isDefault)? ddApp.defaultDirectives[attribute]:
    customDirectives[attribute];
  if(currentAttr) {
    return true;
  }
  return false;
};
ddApp.levenshteinDistance = function(s, t) {
    if(typeof s !== 'string' || typeof t !== 'string') {
      throw new Error('Function must be passed two strings, given: '+typeof s+' and '+typeof t+'.');
    }
    var d = [];
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    for (var i = n; i >= 0; i--) d[i] = [];
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        for (var j = 1; j <= m; j++) {
            if (i == j && d[i][j] > 4) return n;
            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1;
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;
            if (b < mi) mi = b;
            if (c < mi) mi = c;
            d[i][j] = mi;
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }
    return d[n][m];
};
ddApp.getCustomDirectives = function() {
  return {'ha-breadcrumbs':'ha-breadcrumbs','ha-footer':'ha-footer'};
};
var toSend = Array.prototype.slice.call(document.getElementsByTagName("*"));
var result = ddApp.beginSearch(toSend);
