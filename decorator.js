(function () {

'use strict';

var customDirectives = [];


angular.module('deedLib', [])
  .config(['$provide', function($provide) {
    var compiledElements = [];
    //customDirectives = []; why did we have this here again?
    $provide.decorator('$compile', ['$delegate', function($delegate) {
      return function(elem) {
        compiledElements.push(elem[0]);
        return $delegate.apply(this,arguments);
      };
    }]);

    $provide.decorator('$rootScope', ['$delegate',
      function($delegate) {
        var scopeProto = Object.getPrototypeOf($delegate);
        var _apply = scopeProto.$apply;
        scopeProto.$apply = function() {
          //console.log(compiledElements[0])
          var ret = _apply.apply(this, arguments);
          var toSend = Array.prototype.slice.call(compiledElements[0].getElementsByTagName('*'));
          //console.log(toSend);
          var result = ddLib.beginSearch(toSend,customDirectives);
          return ret;
        };
        return $delegate;
    }]);
  }]);

var originalAngularModule = angular.module;
angular.module = function() {
  var module = originalAngularModule.apply(this, arguments);
  var originalDirective = module.directive;
  module.directive = function(directiveName, directiveFactory) {
    //console.log('hi')
    var originalDirectiveFactory = typeof directiveFactory === 'function' ? directiveFactory :
        directiveFactory[directiveFactory.length - 1];
    var directive = {directiveName: directiveName, restrict: 'AE'}
    customDirectives.push(directive);
    var matchRestrict = originalDirectiveFactory.toString().match(/restrict:\s*'(.+?)'/);
    var matchScope = originalDirectiveFactory.toString().match(/scope:\s*?{\s*?(\w+):\s*?'(.+?)'/);
    if(matchScope) {
      var name = (matchScope[2]=='=')? matchScope[1] : matchScope[2].substring(1);
      customDirectives.push({directiveName: name , restrict:'A'})
    }
    if (matchRestrict) {
      directive.restrict = matchRestrict[1];
    }
    arguments[1][0] = function () {
      var ddo = originalDirectiveFactory.apply(this, arguments);
      directive.restrict = ddo.restrict || 'A';
      return ddo;
    };
    return originalDirective.apply(this, arguments);
  };
  return module;
}

}());
