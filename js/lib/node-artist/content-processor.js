function mapContent(data, element, expression) {

    element.textContent = data[expression] || "";

}

export default function(node, data) {

    const contentElements = node.querySelectorAll("[data-content]");
    for(let i = 0; i < contentElements.length; i++) {

        const element = contentElements[i];
        const expression = element.dataset.content;
        mapContent(data, element, expression);

    }

}