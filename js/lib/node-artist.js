function mapContent(data, element, expression) {

    element.textContent = data[expression] || "";

}

function processContentAttributes(node, data) {

    const contentElements = node.querySelectorAll("[data-content]");
    for(let i = 0; i < contentElements.length; i++) {

        const element = contentElements[i];
        const expression = element.dataset.content;
        mapContent(data, element, expression);

    }

}

function processItemsAttributes(node, data) {

    const itemsElements = node.querySelectorAll("[data-items]");
    for (let i = 0; i < itemsElements.length; i++) {

        const element = itemsElements[i];
        const itemsProp = element.dataset.items;
        const templateSelector = element.dataset.template;
        if(!(itemsProp && templateSelector)) continue;
        const items = data[itemsProp];
        if(!Array.isArray(items)) continue;
        const nodeAttribute = NodeArtist(templateSelector);
        items.forEach(item => element.appendChild(nodeAttribute(item)));

    }

}

function createElement(template, data) {

    const node = template.content.cloneNode(true);
    processContentAttributes(node, data);
    processItemsAttributes(node, data);
    return node;
}

export default function NodeArtist(templateSelector) {

    const template = typeof templateSelector === "string"
        ? document.querySelector(templateSelector)
        : templateSelector;

    if (!(template && template.content))
        throw new Error(`No template (or no template content): ${templateSelector}`);

    return data => createElement(template, data);

}