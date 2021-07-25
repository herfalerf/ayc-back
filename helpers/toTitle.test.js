const { toTitle } = require("./toTitle");

describe("toTitle", function () {
  test("works: converts kebab case to title case", function () {
    const testCase = toTitle("kebab-case");
    expect(testCase).toEqual("Kebab Case");
  });
});
