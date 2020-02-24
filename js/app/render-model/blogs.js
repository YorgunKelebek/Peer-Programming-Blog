import NodeArtist from "../../lib/node-artist/index.js";

export default function({ blogs, paging }) {

    if (!blogs) return;

    const blogListItemArtist = NodeArtist("#blog-list-item");

    const blogList = document.querySelector("ol.blogs");
    for(let blog of blogs) {
        const listItem = blogListItemArtist(blog);
        blogList.appendChild(listItem);
    }

}