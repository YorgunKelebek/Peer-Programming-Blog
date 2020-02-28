import dataArtist from "../lib/data-artist.js";
import formatDate from "../lib/date-format.js";
import { buildBlogLink } from "./route-builder.js";

// some parsing functions

export const authorIndex = {};
function findAuthorName(key) {
    const author = authorIndex[key];
    return author ? author.name : undefined;
}

const calculateCurrentPage = p => p.skip ? (p.skip / p.limit) + 1 : 1;

// three data artists we need

export const modularContentArtist = dataArtist({
    contentType: ["system", "type"],
    name: ["elements", "full_name", "value"]
});

export const blogDataArtist = dataArtist({
    id: ["system", "codename"],
    author: ["elements", "author", "value", 0, findAuthorName],
    title: ["elements", "title", "value"],
    posted: ["elements", "post_date", "value", formatDate],
    modified: ["system", "last_modified", formatDate],
    tags: ["elements", "blog_tags", "value"],
    href: ["system", buildBlogLink ]
});

export const pagingArtist = dataArtist({
    next: ["pagination", "next_page"],
    count: ["pagination", "count"],
    total_count: ["pagination", "total_count"],
    page: ["pagination", calculateCurrentPage]
});