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


export function getUrlParamater(param) {
    const url = new URL(location.href);
    return new Set(url.searchParams.getAll(param));
}
