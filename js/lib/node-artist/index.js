import processAttrAttributes from "./attr-processor.js";
import processContentAttributes from "./content-processor.js";
import processItemsAttributes from "./items-processor.js";

function createElement(template, data) {

    const node = template.content.cloneNode(true);
    processContentAttributes(node, data);
    processAttrAttributes(node, data);
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