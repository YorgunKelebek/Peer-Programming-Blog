import fetcher from "../lib/fetcher.js";
import { modularContentArtist, blogDataArtist, pagingArtist, authorIndex } from "./data-artists.js";

// the main function

export async function prepareData({ baseURI, resource }) {

    // fetch the raw data
    const dataURI = `${baseURI}${resource}`;
    const data = await fetcher(dataURI, res => res.json());

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
console.log(blogs);

    // get pagination
    const paging = pagingArtist(data);

    return {
        blogs,
        paging
    };

}