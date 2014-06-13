describe('dd-app', function() {
  beforeEach(function() {
    workspace = document.createElement('div');
    //workspace.setAttribute('id','workspace');
    workspace.appendChild('div');
    workspace.setAttribute('id')
  })
  describe('windowElements', function() {
    it('should be an HTMLCollection', function() {
      expect(windowElements instanceof HTMLCollection).toBe(true);
    })
    it('should be an array with the <html> element as the first element', function() {
      var all = windowElements;
      expect(all[0].nodeName).toBe("HTML");
    })
  })

  describe('should fill windowElements with exsisting HTML DOM elements',function() {

  })
})