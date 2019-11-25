function extract(source, extractor) {
    if (!source) return undefined;
    // if it's a function, execute the function to get the value out
    if (typeof extractor === "function") return extractor(source);
    // otherwise we assume that it's a key to extract from what we assume to be an object
    return source[extractor];
}

/**
 * Extracts the first value from a Kontent item, first by extracting a property, then (if defined) by extracting a value from the found object. Finally, returns defaultValue if the result is still undefined.
 * @param {object} item
 * @param {string|function} propertyExtractor - factory function taking the item as its sole parameter, or the key of the property
 * @param {string|function} [valueExtractor] - factory function taking the property's value as its sole parameter, or the key of the value. If not specified, the property's entire value will be returned.
 * @param {*} [defaultValue] - default value to return if the output would otherwise by undefined
 */
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

/**
 * Given an item and associated property and value extractors (see firstOrDefaultValue for details), extracts the key for a piece of content, then extracts and returns the matching content object. Returns defaultContent if it would otherwise return undefined.
 * @param {object} item
 * @param {object} modularContent
 * @param {function|string} propertyExtractor
 * @param {function|string} valueExtractor
 * @param {*} defaultContent
 */
export function firstOrDefaultContent(item, modularContent, propertyExtractor, valueExtractor, defaultContent) {
    // get the content's key from the item via normal property/value extraction
    const itemValue = firstOrDefaultValue(item, propertyExtractor, valueExtractor);
    if (!itemValue) return defaultContent;
    if (!modularContent) return defaultContent;
    // extract the content
    const content = modularContent[itemValue];
    return typeof content === "undefined" ? defaultContent : content;
}