import { baseUrl } from "./kontent-fetching.js";


export function processBlogLinks(blogSummary, data) {
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
            parseBlogLink(blogSummary, data, key);
		}
	}
}
function parseBlogLink(blogSummary, data, key) {
    const blogUrl = new URL(baseUrl);
    const blogPostLinks = blogSummary.querySelectorAll("[data-item-id='" + key + "']");
    for (const blogPostLink of blogPostLinks) {
        const blogCodename = data[key].codename || "";
        blogUrl.hash = blogCodename;
        blogPostLink.href = blogUrl.href;
        blogPostLink.target = '_blank';
        blogPostLink.setAttribute('data-item_code', blogCodename);
    }
}
