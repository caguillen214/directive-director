var ddApp = {
  directiveTypes : {
    'html-directives': {
      message: 'Incorrect HTML attribute: ',
      directives: {
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
      'width': 'width'}},
    'angular-default-directives': {
      message: 'Incorrect Angular attribute: ',
      directives: {
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
        'ng-value': 'ng-value'}}
  }
}

ddApp.beginSearch = function(scopeElements, options) {
  if(!Array.isArray(scopeElements)) {
    throw new Error("Function beginSearch must be passed an array.");
  }

  options = options || {};
  options.directiveTypes = options.directiveTypes ||
    ['html-directives','angular-default-directives'];;
  options.tolerance = options.tolerance || 4;

  var failedElements = ddApp.findFailedElements(scopeElements, options);
  var messages = ddApp.displayResults(failedElements);
  console.log(failedElements);
  return failedElements;
};

ddApp.findFailedElements = function(scopeElements, options) {
  return scopeElements.map(ddApp.getFailedAttributesOfElement.bind(null,options))
    .filter(function(x) {return x;});
}

ddApp.getFailedAttributesOfElement = function(options, element) {
  if(element.attributes.length) {
    var failedAttributes = ddApp.getFailedAttributes(element.attributes, options);
    if(failedAttributes.length) {
      return {
        domElement: element,
        data: failedAttributes
      };
    }
  }
};

ddApp.getFailedAttributes = function(attributes, options) {
  var failedAttributes = [];
  for(var i = 0; i < attributes.length; i++) {
    var attr = attributes[i].nodeName;
    var exsists = ddApp.attributeExsistsInTypes(attr,options);
    if(!exsists) {
      var result = ddApp.getSuggestions(attr,options);
      failedAttributes.push({match: result.match, error: attr, directiveType:result.directiveType});
    }
  }
  return failedAttributes;
};

ddApp.attributeExsistsInTypes = function(attribute, options) {
  var allTrue = false;
  options.directiveTypes.forEach(function(directiveType) {
    if(ddApp.directiveTypes[directiveType].directives[attribute]) {
      allTrue = allTrue || true;
    }
  });
  return allTrue;
};

ddApp.getSuggestions = function(attribute, options) {
  var min_levDist = Number.MAX_SAFE_INTEGER, match = '', dirType = '';
  options.directiveTypes.forEach(function(directiveType) {
      directiveTypeData = ddApp.directiveTypes[directiveType].directives
      var tempMatch = ddApp.findClosestMatchIn(directiveTypeData, attribute);
      if(tempMatch.min_levDist < options.tolerance && tempMatch.min_levDist < min_levDist) {
        match = tempMatch.match;
        dirType = directiveType;
      }

  });
  return {match:match, directiveType:dirType};
};

ddApp.findClosestMatchIn = function(directiveTypeData, attribute) {
  if(typeof attribute != 'string') {
    throw new Error('Function must be passed a string as second parameter.');
  }
  if((directiveTypeData === null || directiveTypeData === undefined) ||
    typeof directiveTypeData != 'object') {
    throw new Error('Function must be passed a defined object as first parameter.');
  }
  var min_levDist = Number.MAX_SAFE_INTEGER, closestMatch = '';
  for(var directive in directiveTypeData){
    if(Math.abs(attribute.length-directive.length) < 3) {
      var currentlevDist = ddApp.levenshteinDistance(attribute, directive);
      var closestMatch = (currentlevDist < min_levDist)? directive : closestMatch;
      var min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return {min_levDist: min_levDist, match: closestMatch};
};

ddApp.displayResults = function(failedElements) {
  var messageOptions = {
    'html-directives': 'There was an HTML error in ',
    'angular-default-directives': 'There was an AngularJS error in '
  }
  var messages = [];
  failedElements.forEach(function(obj) {
    obj.data.forEach(function(attr) {
      id = (obj.domElement.id) ? ' with id: #'+obj.domElement.id : '';
      type = obj.domElement.nodeName;
      message = messageOptions[attr.directiveType]+type+' element'+id+
      '. Found incorrect attribute "'+attr.error+'" try "'+attr.match+'".';
      console.log(message)
      //console.log(obj.domElement)
      messages.push(message)
    })
  })
  return messages;
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

var toSend = Array.prototype.slice.call(document.getElementsByTagName("*"));
var result = ddApp.beginSearch(toSend);
