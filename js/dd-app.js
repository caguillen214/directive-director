var windowElements = document.getElementsByTagName("*");
var DEFAULT = true, CUSTOM = false;
var defaultDirectives = {
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
  'ng-value': 'ng-value'};
var customDirectives = {'ha-breadcrumbs':'ha-breadcrumbs'}
var failedElements = [];
var correctionsFound = [];

var checkDefaultDirs = function() {
  for(var elesIndex = 0; elesIndex < windowElements.length; elesIndex++) {
    var attrsOfEle = windowElements[elesIndex].attributes;
    if(attrsOfEle.length){
      console.log(attrsOfEle);
      failedAttributes = getFailedAttributes(attrsOfEle);
      if(failedAttributes.length){
        failedEle = {
          htmlComponent:windowElements[elesIndex],
          failedAttributes: failedAttributes
        };
        failedElements.push(failedEle);
      }
    }
  }
}
var getFailedAttributes = function(attributes) {
  var failedAttributes = [];
  for(var attrIndex = 0; attrIndex < attributes.length; attrIndex++) {
    var attrName = attributes[attrIndex].nodeName;
    var inDefault = attrOfEleExsistIn(DEFAULT, attrName);
    var inCustom = attrOfEleExsistIn(CUSTOM, attrName);
    if(!inDefault && !inCustom) {
      var failedAttr = {
        failedAttr: attrName,
        correction: ''
      }
      failedAttributes.push(failedAttr);
    }
  }
  return failedAttributes;
}
var getSuggestions = function() {
  for(var failedEleIndex = 0; failedEleIndex < failedElements.length; failedEleIndex++) {
    var cDirMatch = findClosestMatchIn(CUSTOM, failedEleIndex);
    var dDirMatch = findClosestMatchIn(DEFAULT, failedEleIndex);
    var closestMatch = (Math.min(cDirMatch.levDist, dDirMatch.levDist)==cDirMatch.levDist)?
      cDirMatch.match : dDirMatch.match;
    var toPush = {htmlComponent: failedElements[failedEleIndex], correction: closestMatch};
    correctionsFound.push(toPush);
  }
}
var findClosestMatchIn = function(isDefault, currentEle) {
  var min_levDist = Number.MAX_SAFE_INTEGER;
  var toSearch = (isDefault)? defaultDirectives : customDirectives;
  for(var index = 0; index < toSearch.length; index++) {
    var failedEleAttrs = failedElements[currentEle].failedAttributes;
    for(var failedAttrIndex = 0; failedAttrIndex < failedEleAttrs.length; failedAttrIndex++) {
      var dirFail = failedEleAttrs[failedAttrIndex];
      var dirCust = toSearch[index];
      if(Math.abs(dirFail.length-dirCust.length) < 3) {
        var currentlevDist = levenshteinDistance(dirFail,dirCust);
        var min_levDist = (min_levDist > currentlevDist)? currentlevDist : min_levDist;
        var closestMatch = (min_levDist > currentlevDist)? dirFail : closestMatch;
      }
    }
  }
  return {
    match:closestMatch,
    levDist:min_levDist
  };
}
var attrOfEleExsistIn = function(isDefault,attribute){
  //for(var attrIndex = 0; attrIndex < attribute.length; attrIndex++) {
    //attrName = attribute[attrIndex].nodeName;
    var currentAttr = (isDefault)? defaultDirectives[attribute]:
      customDirectives[attribute];
    if(currentAttr) {
      return true;
    }
  //}
  return false;
}
var levenshteinDistance = function(s, t) {
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
}

checkDefaultDirs();
//getSuggestions();
console.log("windowElements")
console.log(windowElements);
console.log("failedElements")
console.log(failedElements);
// console.log("correctionsFound")
// console.log(correctionsFound);

