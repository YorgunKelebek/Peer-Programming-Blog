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

export const modularContentArtist = dataArtist({
    contentType: ["system", "type"],
    name: ["elements", "full_name", "value"]
});

export const blogDataArtist = dataArtist({
    id: ["system", "id"],
    author: ["elements", "author", "value", 0, findAuthorName],
    title: ["elements", "title", "value"],
    posted: ["elements", "post_date", "value", parseISODate],
    modified: ["system", "last_modified", parseISODate]
});

export const pagingArtist = dataArtist({
    next: ["pagination", "next_page"],
    count: ["pagination", "count"],
    total_count: ["pagination", "total_count"],
    page: ["pagination", calculateCurrentPage]
});