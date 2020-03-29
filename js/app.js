import { loadBlogItems } from "./blog-listing.js";
import { loadAsideBlogTags } from "./blog-tags.js";

function getHash() {
    let blogCodename = location.hash.toLowerCase() || '';
    return blogCodename.replace("#","");
}


window.addEventListener('DOMContentLoaded', (event) => {
    const blogCodename = getHash();
    loadBlogItems(blogCodename);
    loadAsideBlogTags();
});
