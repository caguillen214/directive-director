describe('dd-app', function() {

  ddescribe('Decorator: $rootScope', function() {
    var $rootScope, spy;
    beforeEach(module('deedApp'));
    beforeEach(inject(function(_$rootScope_) {
      $rootScope = _$rootScope_;
      spy = spyOn(ddApp, 'beginSearch').andReturn();
    }))

    it('should track that ddApp.beginSearch was called', function() {
      $rootScope.$apply();
      expect(spy).toHaveBeenCalled();
    })
  });

  describe('beginSearch()', function() {
    it('should throw if not passed an array', function() {
      var notAnArray = {};
      expect(function() {
        ddApp.beginSearch(notAnArray)
      }).toThrow("Function beginSearch must be passed an array.");
    })
    it('should return an array with the correct number of failed elements', function() {
      var elementsToTest = [
        {attributes: [{nodeName:'ng-ap'},{nodeName:'ng-hef'}]},
        {attributes: [{nodeName:'ng-src'}]},
        {attributes: [{nodeName:'ng-clic'}]}
      ]
      var results = ddApp.beginSearch(elementsToTest);
      expect(results.length).toBe(2);
    })
    it('should return an array of objects that have match and error properties', function(){
      var elementsToTest = [
        {attributes: [{nodeName:'ng-ap'},{nodeName:'ng-hef'}]},
        {attributes: [{nodeName:'ng-src'}]},
        {attributes: [{nodeName:'ng-clic'}]}
      ]
      var corrections = ddApp.beginSearch(elementsToTest);
      missingProperties = false;
      corrections.forEach(function(correction){
        if(!correction.data[0].error && !correction.data[0].match)
        {
          missingProperties = true;
        }
      });
      expect(missingProperties).toBe(false);
    });
  });

  describe('getSuggestions()', function() {
    it('should return an array of objects with the proper match for each error', function() {
      var failedAttr = 'ng-ap';
      var options = {
        directiveTypes:['angular-default-directives'],
        tolerance: 4
      };
      var result = ddApp.getSuggestions(failedAttr, options);
      expect(result.match).toBe('ng-app');
    })
  });

  describe('displayResults()', function() {
    it('should display the correct message with respect to the correction found', function() {
      var failedElements = [{
        domElement:{id:'',nodeName:'HTML'},
        data: [{
          directiveType: 'angular-default-directives',
          error: 'ng-ap',
          match: 'ng-app'
        }]
      }]
      var messages = ddApp.displayResults(failedElements);
      var display = 'There was an AngularJS error in HTML element. Found incorrect '+
        'attribute "ng-ap" try "ng-app".';
      expect(messages[0]).toBe(display);
    })
  });

  describe('getFailedAttributes()', function() {
    it('should find failed attributes in element', function() {
      var options = {
        directiveTypes:['angular-default-directives'],
        tolerance: 4
      };
      var elementToTest = [{nodeName:'ng-ap'},{nodeName:'ng-hef'}];
      var results = ddApp.getFailedAttributes(elementToTest,options);
      expect(results[0].error).toBe('ng-ap');
      expect(results[1].error).toBe('ng-hef');
    })
  });

  describe('findClosestMatchIn()', function() {
    it('should throw if passed undefined or null', function() {
      expect(function() {
        ddApp.findClosestMatchIn({a:''},null);
      }).toThrow('Function must be passed a string as second parameter.');
      expect(function() {
        ddApp.findClosestMatchIn({a:''},undefined);
      }).toThrow('Function must be passed a string as second parameter.');
      expect(function() {
        ddApp.findClosestMatchIn('','toPass');
      }).toThrow('Function must be passed a defined object as first parameter.');
    })
    it('should find the closest match from list of given attributes', function() {
      var directiveTypeData = {'ng-src':'ng-src','ng-app':'ng-app','ng-click':'ng-click'};
      var attribute = 'ng-ap';
      var result = ddApp.findClosestMatchIn(directiveTypeData,attribute);
      expect(result.match).toBe('ng-app');
    })
  });

  /* Upper and lower bounds of LD
      It is always at least the difference of the sizes of the two strings.
      It is at most the length of the longer string.
      It is zero if and only if the strings are equal.
  */
  describe('levenshteinDistance()', function() {
    it('should only accept strings to be passed',function() {
      expect(function() {
        ddApp.levenshteinDistance(null,null);
      }).toThrow('Function must be passed two strings, given: object and object.');
      expect(function() {
        ddApp.levenshteinDistance(2,6);
      }).toThrow('Function must be passed two strings, given: number and number.');
      expect(function() {
        ddApp.levenshteinDistance(undefined,undefined);
      }).toThrow('Function must be passed two strings, given: undefined and undefined.');
    })
    it('should return the proper levenshtein distance between two strings', function() {
      var test1 = ddApp.levenshteinDistance("nf-ap","ng-app");
      var test2 = ddApp.levenshteinDistance("","");
      var bound1 = ddApp.levenshteinDistance('ng-onmouseo','ng-onmouseover');
      var bound2 = ddApp.levenshteinDistance('asdf','qwertyuiop');
      var bound3 = ddApp.levenshteinDistance('ng-href','ng-href');
      expect(test1).toBe(2)
      expect(test2).toBe(0)
      expect(bound1).toBe(3)
      expect(bound2).toBe(10)
      expect(bound3).toBe(0)
    })
  });

})







