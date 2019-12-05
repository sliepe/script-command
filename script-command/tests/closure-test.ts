const outer = [['1A', '1B', '1C'], ['2A', '2B', '2C'], ['3A', '3B', '3C']];

function outerFunction(innerFunction: Function) {
    innerFunction();
}

for (const out of outer) {
    let outIndex = 0;

    outerFunction(function innerFunction() {
        outIndex++;

        console.log(outIndex, out.length, out);

        if (outIndex < out.length) {
            outerFunction(innerFunction);
        }
    })
}