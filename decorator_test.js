'use strict';

describe('ddLib and Angular Integration Test', function() {

  beforeEach(module('deedLib'));

  describe('Decorator: $rootScope', function() {
    var $rootScope, $compile;

    beforeEach(inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;

      spyOn(console, 'log').andCallThrough();
    }));

    it('should track that ddLib.beginSearch was called', function() {
      var spy = spyOn(ddLib, 'beginSearch').andCallThrough();
      var html = '<div id="topTest"><div ng-click="">Testing</div><p ng-src="">Testing</p></div>';
      var element = angular.element(html);
      $compile(element)($rootScope);
      $rootScope.$digest();
      $rootScope.$apply();
      expect(spy).toHaveBeenCalled();
    });

    it('should have no return no errors if there are none', function() {
      var html = '<div id="topTest"><div ng-click="">Testing</div><p ng-src="">Testing</p></div>';
      var element = angular.element(html);
      $compile(element)($rootScope);
      $rootScope.$digest();
      spyOn(ddLib, 'displayResults').andCallFake(
        function(data) {
          console.log(data.length);
        });

      $rootScope.$apply();
      expect(console.log)
        .toHaveBeenCalledWith(0);
    });

    it('should return the console.log the correct number of errors', function() {
      var html = '<div id="topTest"><div ng-cick="">Testing</div><p ng-src="">Testing</p></div>';
      var element = angular.element(html);
      $compile(element)($rootScope);
      $rootScope.$digest();
      spyOn(ddLib, 'displayResults').andCallFake(
        function(data) {
          console.log(data.length);
        });
      $rootScope.$apply();
      expect(console.log).toHaveBeenCalledWith(1);
    });

  });
  ddescribe('angular.module Decorator', function() {
    var $rootScope, $compile;

    angular.module('testModule',[]).directive('testDirective', [function() {
      return {
        restrict: 'CE',
        template: '<h3>This is Test Directive</h3>'
      }
    }]);

    beforeEach(module('testModule'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      spyOn(console, 'warn').andCallThrough();
    }));

    it('should add custom directives to ddLib.directiveTypes', function() {
      var html = '<div id="outer"><test-directive></test-directive></div>';
      var element = angular.element(html);
      $compile(element)($rootScope);
      $rootScope.$apply()
      var customDirectives = ddLib.directiveTypes['angular-custom-directives'].directives;
      expect(customDirectives['test-directive']).toBeTruthy();
    })
    it('should log error if custom directive is misspelled', function() {
      var html2 = '<div id="outer2"><p id="toFailTest" tst-dirctive=""></p></div>';
      var element2 = angular.element(html2);
      $compile(element2)($rootScope);
      $rootScope.$apply();
      expect(console.warn).toHaveBeenCalledWith('There was an AngularJS error in P element with id:'+
        ' #toFailTest. Found incorrect attribute "tst-dirctive" try "test-directive".');
    })
    it('should log error if custom directive is used incorrectly based on restrict', function() {
      var html3 = '<div id="outer3"><p id="toFailTest3" test-directive=""></p></div>';
      var element3 = angular.element(html3);
      $compile(element3)($rootScope);
      $rootScope.$apply();
      expect(console.warn).toHaveBeenCalledWith('There was an AngularJS error in P element with '+
        'id: #toFailTest3. Attribute "test-directive" is reserved for element and class tag names'+
        ' only.');
    });
    it
  });
});
