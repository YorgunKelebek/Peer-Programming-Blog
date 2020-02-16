function mapContent(data, element, expression) {
    element.textContent = data[expression] || "";
}

function createElement(template, data) {
    const node = template.content.cloneNode(true);
    const contentElements = node.querySelectorAll("[data-content]");
    for(let i = 0; i < contentElements.length; i++) {
        const element = contentElements[i];
        const expression = element.dataset.content;
        mapContent(data, element, expression);
    }
    return node;
}

export default function NodeArtist(templateSelector) {

    const template = typeof templateSelector === "string"
        ? document.querySelector(templateSelector)
        : templateSelector;

    if (!( template && template.content)) throw new Error("No template (or no content)");
    return data => createElement(template, data);

}