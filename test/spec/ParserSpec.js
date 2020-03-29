import parser from "../../js/lib/rich-text/parser.js";

describe("Given rich-text content from Kentico", () => {

    const content = "<div>hello</div>";

    describe("When I parse it", () => {

        let parsed;
        beforeEach(() => {

            parsed = parser(content);

        });

        it("Then it should return a parsed fragment", () => {

            expect(parsed.firstElementChild.tagName).toEqual("DIV");
            expect(parsed.firstElementChild.childNodes.length).toEqual(1);

        });

    });

});
