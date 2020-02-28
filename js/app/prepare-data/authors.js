import {
    modularContentArtist,
    authorIndex
} from "../data-artists.js";

const defaultValueSelector = x => x;
function buildHashReducer(keySelector, valueSelector = defaultValueSelector) {
    return (hash, x) => ({
        ...hash,
        [keySelector(x)]: valueSelector(x)
    });
}

const keyValueObjectToHash = buildHashReducer(x => x.key, x => x.value);

export function populateAuthorIndexFromData(data) {

    // get modular content
    const modularContent = Object.entries(data.modular_content).map(([key, value]) => ({
        key,
        value: modularContentArtist(value)
    }));

    const index = modularContent
        .filter(x => x.value.contentType === "author")
        .reduce(keyValueObjectToHash, {});

    Object.assign(authorIndex, index);

}