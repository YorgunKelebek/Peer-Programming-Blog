import {
    modularContentArtist,
    blogDataArtist,
    pagingArtist,
    authorIndex
} from "../data-artists.js";

export default function prepareItemsData(data) {

    if (!data.items) return null;

    // pull out the authors
    Object.entries(data.modular_content)
        // we only want the modular content where the type is "author"
        .filter(entry => entry[1].system.type === "author")
        // for each key and raw data object,
        .forEach(entry => {

            const [ key, rawData ] = entry;
            // store the output of the data artist in our author index
            authorIndex[key] = modularContentArtist(rawData);

        });

    // get blogs
    const blogs = data.items.map(blogDataArtist);

    // get pagination
    const paging = pagingArtist(data);

    return {
        blogs,
        paging
    };

}