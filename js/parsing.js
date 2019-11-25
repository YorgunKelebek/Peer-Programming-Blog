function extract(source, extractor) {
    if (!source) return undefined;
    // if it's a function, execute the function to get the value out
    if (typeof extractor === "function") return extractor(source);
    // otherwise we assume that it's a key to extract from what we assume to be an object
    return source[extractor];
}

/**
 * Extracts the first value from a Kontent item, first by extracting a property, then (if defined) by extracting a value from the found object. Returns undefined rather than throwing if the algorithm cannot be continued.
 * @param {object} item
 * @param {string|function} propertyExtractor - factory function taking the item as its sole parameter, or the key of the property
 * @param {string|function} [valueExtractor] - factory function taking the property's value as its sole parameter, or the key of the value. If not specified, the property's entire value will be returned.
 */
export function firstOrDefaultValue(item, propertyExtractor, valueExtractor) {
    // no item?
    if (!item) return undefined;
    const elements = item.elements;
    // no elements?
    if (!elements) return undefined;
    const prop = extract(elements, propertyExtractor);
    // property extractor returned nothing?
    if (typeof prop === "undefined") return undefined;
    const valueObject = Array.isArray(prop.value) ? prop.value[0] : prop.value;
    // nothing in the value object?
    if (typeof valueObject === "undefined") return undefined;
    const value = valueExtractor ? extract(valueObject, valueExtractor) : valueObject;
    // nothing extracted from the value object?
    if (typeof value === "undefined") return undefined;
    // else
	return value;
}

/**
 * Given an item and associated property and value extractors (see firstOrDefaultValue for details), extracts the key for a piece of content, then extracts and returns the matching content object. Returns undefined if the algorithm cannot be completed.
 * @param {object} item
 * @param {object} modularContent
 * @param {function|string} propertyExtractor
 * @param {function|string} valueExtractor
 */
export function firstOrDefaultContent(item, modularContent, propertyExtractor, valueExtractor) {
    // get the content's key from the item via normal property/value extraction
    const itemValue = firstOrDefaultValue(item, propertyExtractor, valueExtractor);
    if (typeof item === "undefined") return undefined;
    if (typeof modularContent === "undefined") return undefined;
    // extract the content
    return modularContent[itemValue];
}