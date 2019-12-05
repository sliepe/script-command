// Test
var string1 = "testtest test test </> </>";
var regExp1 = new RegExp('<[^/>]*/>', 'g');
var regExpMatchArray1 = string1.match(regExp1);
var newString1 = string1.replace(regExp1, function (substring) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return 'test';
});
console.log(newString1);
//# sourceMappingURL=test-regexp.js.map