import { blogDataArtist, pagingArtist } from "../data-artists.js";
import { populateAuthorIndexFromData } from "./authors.js";

export default function(data) {

    if (!data.items) return null;

    populateAuthorIndexFromData(data);

    // get blogs
    const blogs = data.items.map(blogDataArtist);

    // get pagination
    const paging = pagingArtist(data);

    return {
        blogs,
        paging
    };

}