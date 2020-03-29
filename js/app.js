import { loadBlogItems } from "./blog-listing.js";
import { loadAsideBlogTags } from "./blog-tags.js";

function getHash() {
    return location.hash.toLowerCase() || '';
}


window.addEventListener('DOMContentLoaded', (event) => {
    const blogCodename = getHash().replace("#","");
    loadBlogItems(blogCodename);
    loadAsideBlogTags();
});
