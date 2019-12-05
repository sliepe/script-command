// Test
const string1 = "testtest test test </> </>";
const regExp1 = new RegExp('<[^/>]*/>', 'g');
const regExpMatchArray1 = string1.match(regExp1);
const newString1 = string1.replace(regExp1, function (substring: string, ...args: any[]) {
    return 'test';
});
console.log(newString1);