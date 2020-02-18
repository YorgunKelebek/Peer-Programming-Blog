import NodeArtist from "./index.js";

export default function(node, data) {

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