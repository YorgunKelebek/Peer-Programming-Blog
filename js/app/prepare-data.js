import fetcher from "../lib/fetcher.js";
import dataArtist from "../lib/data-artist.js";

const modularContentArtist = dataArtist({
    contentType: ["system", "type"],
    name: ["elements", "full_name", "value"]
});

const authors = {};

function findAuthorName(key) {
    const author = authors[key];
    return author ? author.name : undefined;
}

const parseISODate = x => new Date(x);

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
    page: ["pagination", p => p.skip ? (p.skip / p.limit) + 1 : 1]
});

export async function prepareData({ baseURI, resource }) {

    // fetch the raw data
    const dataURI = `${baseURI}${resource}`;
    const data = await fetcher(dataURI, res => res.json());

    // pull out the authors
    const modularContent = Object.entries(data.modular_content)
        .map(([key, object]) => [key, modularContentArtist(object)])
    const authorContent = modularContent.filter(([_, x]) => x.contentType === "author");
    for (const author of authorContent) {
        const [key, object] = author;
        authors[key] = object;
    }
    // get blogs
    const blogs = data.items.map(blogDataArtist);
    // get pagination
    const paging = pagingArtist(data);

    return {
        blogs,
        paging
    };

}