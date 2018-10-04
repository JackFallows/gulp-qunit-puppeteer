// const assert = require("chai").assert;
const assert = chai.assert;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe("namespaces", function(){
  describe("window", function(){
    it("should exist", function(){
      assert.ok(window);
    })
  })
  describe("TopLevel", function(){
    it("should exist",function(){
      assert.ok(window.TopLevel);
    })
  })
})