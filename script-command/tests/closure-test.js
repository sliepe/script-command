var outer = [['1A', '1B', '1C'], ['2A', '2B', '2C'], ['3A', '3B', '3C']];
function outerFunction(innerFunction) {
    innerFunction();
}
var _loop_1 = function (out) {
    var outIndex = 0;
    outerFunction(function innerFunction() {
        outIndex++;
        console.log(outIndex, out.length, out);
        if (outIndex < out.length) {
            outerFunction(innerFunction);
        }
    });
};
for (var _i = 0, outer_1 = outer; _i < outer_1.length; _i++) {
    var out = outer_1[_i];
    _loop_1(out);
}
//# sourceMappingURL=closure-test.js.map