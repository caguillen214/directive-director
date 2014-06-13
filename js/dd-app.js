var windowElements = document.getElementsByTagName("*");
var DEFAULT = true, CUSTOM = false;
var defaultDirectives = {
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
      var matchFound = attrsOfEleExsistIn(DEFAULT, attrsOfEle);
      if(!matchFound && !inCustomDirs(attrsOfEle)) {
        failedElements.push(windowElements[elesIndex]);
      }
    }
  }
  findClosestMatches();
}
var findClosestMatch = function() {
  for(var failedIndex = 0; failedIndex < failedElements.length; failedIndex++) {
    var min_levDist = Number.MAX_SAFE_INTEGER;
    var closestMatch;
    for(var customIndex = 0; customIndex < customDirectives.length; customIndex++) {
      var dirFail = failedElements[failedIndex];
      var dirCust = customDirectives[customIndex];
      if(Math.abs(dirFail.length-dirCust.length)) {
        var currentlevDist = levenshteinDistance(dirFail,dirCust);
        min_levDist = (min_levDist > currentlevDist)? currentlevDist : min_levDist;
        closestMatch = (min_levDist > currentlevDist)? dirFail : closestMatch;
      }
    }
    for(var defaultIndex = 0; defaultIndex < defaultDirectives.length; defaultIndex++) {
      var dirFail = failedElements[failedIndex];
      var dirCust = defaultDirectives[defaultIndex];
      if(Math.abs(dirFail.length-dirCust.length)) {
        var currentlevDist = levenshteinDistance(dirFail,dirCust);
        min_levDist = (min_levDist > currentlevDist)? currentlevDist : min_levDist;
        closestMatch = (min_levDist > currentlevDist)? dirFail : closestMatch;
      }
    }
    var toPush = {htmlComponent: failedElements[failedIndex], correction: closestMatch};
    correctionsFound.push(toPush);
  }
}

var inCustomDirs = function(attrsOfEle) {
  return attrsOfEleExsistIn(CUSTOM, attrsOfEle);
}
var attrsOfEleExsistIn = function(isDefault,attrsOfEle){
  for(var attrIndex = 0; attrIndex < attrsOfEle.length; attrIndex++) {
    var currentAttr = (isDefault)? defaultDirectives[attrsOfEle[attrIndex].nodeName]:
      customDirectives[attrsOfEle[attrIndex].nodeName];
    if(currentAttr) {
      return true;
    }
  }
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
console.log(windowElements);
console.log(failedElements);

