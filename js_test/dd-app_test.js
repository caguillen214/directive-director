describe('dd-app', function() {

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
        if(!correction.results[0].error && !correction.results[0].match)
        {
          missingProperties = true;
        }
      });
      expect(missingProperties).toBe(false);
    });
  });

  describe('getSuggestions()', function() {
    it('should return an array of objects with the proper match for each error', function() {
      var failedElement = [{
        element: 'html',
        failedAttributes: ['ng-ap']
      }]
      var suggestion = ddApp.getSuggestions(failedElement);
      expect(suggestion[0].results[0].match).toBe('ng-app');
    })
  })

  describe('displayResults()', function() {
    it('should display the correct message with respect to the correction found', function() {
      var obj = {
        element: {id:'test',nodeName:'DIV'}
      };
      var correction = [{
        domElement: obj,
        results: [{error:'ng-clic',match:'ng-click'}]
      }]
      var messages = ddApp.displayResults(correction);
      var display = 'There was an error in DIV element with id: #test. Found incorrect'+
        ' attribute "ng-clic" try "ng-click".';
      expect(messages[0]).toBe(display);
    })
  })

  describe('getFailedAttributes()', function() {
    it('should find failed attributes in element', function() {
      var elementToTest = [{nodeName:'ng-ap'},{nodeName:'ng-hef'}];
      var results = ddApp.getFailedAttributes(elementToTest);
      expect(results[0]).toBe('ng-ap');
      expect(results[1]).toBe('ng-hef');
    })
  })

  describe('findClosestMatchIn()', function() {
    it('should throw if passed undefined or null', function() {
      expect(function() {
        ddApp.findClosestMatchIn(true,null);
      }).toThrow('Function must be passed a defined object as second parameter.');
      expect(function() {
        ddApp.findClosestMatchIn(true,undefined);
      }).toThrow('Function must be passed a defined object as second parameter.');
    })
    it('should find the closest match from list of given attributes', function() {
      var failedElement = {
        element: 'html',
        failedAttributes: ['ng-ap']
      };
      var corrections = ddApp.findClosestMatchIn(true,failedElement);
      expect(corrections[0].match).toBe('ng-app');
    })
  })

  describe('attrOfEleExsistIn()', function() {
    it('should throw if not passed a string', function() {
       expect(function() {
        ddApp.attrOfEleExsistIn(true,null);
      }).toThrow('Function must be passed string as second parameter, given: object.');
      expect(function() {
        ddApp.attrOfEleExsistIn(true,6);
      }).toThrow('Function must be passed string as second parameter, given: number.');
      expect(function() {
        ddApp.attrOfEleExsistIn(true,undefined);
      }).toThrow('Function must be passed string as second parameter, given: undefined.');
    })
    it('should check if attribute exsist in list', function() {
      var testAttrFail = 'notInList';
      var testAttrPass = 'ng-click';
      expect(ddApp.attrOfEleExsistIn(true,testAttrFail)).toBe(false);
      expect(ddApp.attrOfEleExsistIn(true,testAttrPass)).toBe(true);
    })
  })

  describe('setCustomDirectives()', function() {
    it('should set the custom directives in ddApp', function() {
      var custom = {'ha-breadcrumbs':'ha-breadcrumbs','ha-footer':'ha-footer'};
      ddApp.setCustomDirectives(custom);
      expect(ddApp.customDirectives['ha-breadcrumbs']).toBe('ha-breadcrumbs');
    })
  })
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
  })

})







