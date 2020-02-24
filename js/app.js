import { pageOptions } from "./app/page-options.js";
import { prepareData } from "./app/prepare-data.js";
import { DOMContentLoaded } from "./lib/DOM.js";
import NodeArtist from "./lib/node-artist/index.js";

(async function main() {

    const preparingData = prepareData(pageOptions);
    await DOMContentLoaded();
    const { blogs, paging } = await preparingData;
    const blogListItemArtist = NodeArtist("#blog-list-item");

    const blogList = document.querySelector("ol.blogs");
    for(let blog of blogs) {
        const listItem = blogListItemArtist(blog);
        blogList.appendChild(listItem);
    }

    console.log(blogs, paging);

}());