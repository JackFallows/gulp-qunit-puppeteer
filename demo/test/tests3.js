QUnit.module("DOM");

QUnit.test("id #my-elem exists", function(assert) {
    assert.ok(document.getElementById("my-elem"));
});