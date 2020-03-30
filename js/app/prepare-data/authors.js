import {
    modularContentArtist,
    authorIndex
} from "../data-artists.js";

function prepareData([ contentKey, rawData ]) {
    return {
        key: contentKey,
        value: modularContentArtist(rawData)
    };
}

export function populateAuthorIndexFromData(data) {

    const modularContent = Object.entries(data.modular_content).map(prepareData);

    for(const entry of modularContent) {

        if(entry.value.contentType === "author")
            authorIndex[entry.key] = entry.value;

    }

}