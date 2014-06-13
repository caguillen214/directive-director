describe('dd-app', function() {
  describe('windowElements', function() {
    it('should be an HTMLCollection', function() {
      expect(windowElements instanceof HTMLCollection).toBe(true);
    })
    it('should retrieve an array with the <html> element as the first spot', function() {
      var all = windowElements;
      expect(all[0].nodeName).toBe("HTML");
    })
  })
})