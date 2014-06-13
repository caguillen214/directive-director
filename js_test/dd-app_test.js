describe('dd-app', function() {
  var testDiv = document.createElement('div');
  testDiv.innerHTML = '<div class="ddAppTest" id="test" ng-click="" ng-src="" width="">id="test" '+
    'ng-click="" ng-src="" width=""</div><div class="ddAppTest" id="failBasicHTML" widt="" scr="">'+
    'id="failBasicHTML" widt="" scr=""</div><span class="ddAppTest" id="fail" ngclick="" ngsr="">'+
    'id="fail" ngclick="" ngsr=""</span><div class="ddAppTest" id="passCustom" ha-breadcrumbs>'+
    'id="passCustom" ha-breadcrumbs</div><p class="ddAppTest" id="failCustom" ha-baerdcrumbs>'+
    'id="failCustom" ha-baerdcrumbs</p><div id="nested"><div id="passNested" class="nested '+
    'ddAppTest">id="passNested" class="nested ddAppTest"</div><div id="failNested" class="nested'+
    'ddAppTest" ng-readonl="">id="failNested" class="nested" ng-readonl=""</div></div>';
  var isTest = true;
  ddApp.setScope(isTest);

  it('should set ddApp.windowElements to test elements', function() {
    var allClassTest = false;
    ddApp.scopeElements.forEach(function(element) {
      if(element.className.indexOf('ddAppTest') >= 0){
        allClassTest = true;
      }
      else {
        allClassTest = false;
      }
    });
    expect(allClassTest).toBe(true);
  })


  describe('findFailedElements()', function() {
    it('should throw if not passed an array', function() {
      var notAnArray = {};
      expect(function() {
        ddApp.findFailedElements(notAnArray)
      }).toThrow("Function findFailedElements must be passed an array.");
    })
    it('should set ddApp.failedElements with objects of the failed elements', function() {
      ddApp.findFailedElements(ddApp.scopeElements);
      console.log(ddApp.scopeElements)
      expect(ddApp.failedElements.length).toBe(5);
    })
  })

})