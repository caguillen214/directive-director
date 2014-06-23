(function () {

'use strict';

var customDirectives = [];


angular.module('deedLib', [])
  .config(['$provide', function($provide) {
    $provide.decorator('$compile', ['$delegate', function($delegate) {
      return function(elem) {
        for(var i = 0; i < elem.length; i+=2){
          var toSend = Array.prototype.slice.call(elem[i].getElementsByTagName('*'));
          var result = ddLib.beginSearch(toSend,customDirectives);
        }
        return $delegate.apply(this,arguments);
      };
    }]);
  }]);

var originalAngularModule = angular.module;
angular.module = function() {
  var module = originalAngularModule.apply(this, arguments);
  var originalDirective = module.directive;
  module.directive = function(directiveName, directiveFactory) {
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
