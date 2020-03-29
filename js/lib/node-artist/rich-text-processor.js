import parser from "../../lib/rich-text/parser.js";

function mapContent(data, element, expression) {

    const parsed = parser(data[expression]);
    element.appendChild(parsed);

}

export default function processRichText(node, data) {

    const richTextElements = node.querySelectorAll("[data-rich-text]");
    for(let i = 0; i < richTextElements.length; i++) {

        const element = richTextElements[i];
        const expression = element.dataset.richText;
        mapContent(data, element, expression);

    }

}
