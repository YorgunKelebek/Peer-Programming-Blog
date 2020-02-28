import { blogDataArtist } from "../data-artists.js";
import { populateAuthorIndexFromData } from "./authors.js";

export default function(data) {

    if (!data.item) return null;

    populateAuthorIndexFromData(data);

    // get blog
    const blog = blogDataArtist(data.item);

    return { blog };

}