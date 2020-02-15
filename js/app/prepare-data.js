import fetcher from "../lib/fetcher.js";
import dataArtist from "../lib/data-artist.js";

// some parsing functions

const authorIndex = {};
function findAuthorName(key) {
    const author = authorIndex[key];
    return author ? author.name : undefined;
}

const parseISODate = x => new Date(x);

const calculateCurrentPage = p => p.skip ? (p.skip / p.limit) + 1 : 1;

// three data artists we need

const modularContentArtist = dataArtist({
    contentType: ["system", "type"],
    name: ["elements", "full_name", "value"]
});

const blogDataArtist = dataArtist({
    id: ["system", "id"],
    author: ["elements", "author", "value", 0, findAuthorName],
    title: ["elements", "title", "value"],
    posted: ["elements", "post_date", "value", parseISODate],
    modified: ["system", "last_modified", parseISODate]
});

const pagingArtist = dataArtist({
    next: ["pagination", "next_page"],
    count: ["pagination", "count"],
    total_count: ["pagination", "total_count"],
    page: ["pagination", calculateCurrentPage]
});

// the main function

export async function prepareData({ baseURI, resource }) {

    // fetch the raw data
    const dataURI = `${baseURI}${resource}`;
    const data = await fetcher(dataURI, res => res.json());

    // pull out the authors
    Object.entries(data.modular_content)
        // we only want the modular content where the type is "author"
        .filter(entry => entry[1].contentType === "author")
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