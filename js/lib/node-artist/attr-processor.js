function mapAttribute(data, element, binding) {
    const name = binding.nodeName;
    const value = binding.value;
    const attributeToSet = name.substring(10);
    const boundValue = data[value];
    if(boundValue !== undefined)
        element.setAttribute(attributeToSet, boundValue);
}

const isDataAttrAttribute = attr => attr.nodeName.startsWith("data-attr-");

const findDataAttrBindings = element => Array.from(element.attributes).filter(isDataAttrAttribute);

function findElementsWithDataAttrBindings(elements) {
    const found = []; // this will be an array of elements which contain the bindings we need, and those bindings
    for(let element of elements) {
        const attributeBindings = findDataAttrBindings(element);
        // found any?
        if(attributeBindings.length)
            found.push([element, attributeBindings]);
    }
    return found;
}

export default function(node, data) {
    const attrElements = findElementsWithDataAttrBindings(Array.from(node.querySelectorAll("*")));
    for(let [ element, bindings ] of attrElements) {
        for(let binding of bindings) {
            mapAttribute(data, element, binding);
        }
    }
}