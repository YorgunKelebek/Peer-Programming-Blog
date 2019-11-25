function extract(source, extractor) {
    if (!source) return undefined;
    // if it's a function, execute the function to get the value out
    if (typeof extractor === "function") return extractor(source);
    // otherwise we assume that it's a key to extract from what we assume to be an object
    return source[extractor];
}

export function firstOrDefaultValue(item, propertyExtractor, valueExtractor, defaultValue) {
    // no item?
    if (!item) return defaultValue;
    const elements = item.elements;
    // no elements?
    if (!elements) return defaultValue;
    const prop = extract(elements, propertyExtractor);
    // property extractor returned nothing?
    if (typeof prop === "undefined") return defaultValue;
    const valueObject = Array.isArray(prop.value) ? prop.value[0] : prop.value;
    // nothing in the value object?
    if (typeof valueObject === "undefined") return defaultValue;
    const value = valueExtractor ? extract(valueObject, valueExtractor) : valueObject;
    // nothing extracted from the value object?
    if (typeof value === "undefined") return defaultValue;
    // else
	return value;
}

export function firstOrDefaultContent(item, modularContent, propertyExtractor, valueExtractor, defaultContent) {
    // get the content's key from the item via normal property/value extraction
    const itemValue = firstOrDefaultValue(item, propertyExtractor, valueExtractor);
    if (!itemValue) return defaultContent;
    if (!modularContent) return defaultContent;
    // extract the content
    const content = modularContent[itemValue];
    return content || defaultContent;
}