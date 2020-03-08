import { buildTaxonomiesUrl, fetchKontent } from "./kontent-fetching.js";

const baseUrl = new URL(location);
baseUrl.search = "";
baseUrl.hash = "";
export const tags = getUrlParamater("tag");


export async function loadAsideBlogTags() {
    const api = buildTaxonomiesUrl();
    const json = await fetchKontent(api);
    if (json.terms.length > 0) {
        var elementAsideBlogTagsHeading = document.createElement('h1');
        elementAsideBlogTagsHeading.innerHTML = "Tags";
        document.querySelector(".aside-blog-tags").appendChild(elementAsideBlogTagsHeading);
        for (var i = 0; i < json.terms.length; i++) {
            appendBlogTagToTagCloud(json.terms[i]);
        }
    }
}
function appendBlogTagToTagCloud(blogTag) {
    var elementBlogTag = document.createElement('a');
    if (tagIsSelected(blogTag.codename)) { elementBlogTag.classList.add("selected-tag"); }
    elementBlogTag.innerHTML = blogTag.name;
    elementBlogTag.addEventListener('click', function () {
        navigateToBlogs(blogTag.codename);
    });
    document.querySelector(".aside-blog-tags").appendChild(elementBlogTag);
    if (blogTag.terms.length > 0) {
        for (var i = 0; i < blogTag.terms.length; i++) {
            appendBlogTagToTagCloud(blogTag.terms[i]);
        }
    }
}
function navigateToBlogs(blogTag) {
    var toggledTags = toggledBlogTags(blogTag);
    const newUrl = new URL(baseUrl);
    if (toggledTags) toggledTags.forEach(tag => newUrl.searchParams.append("tag", tag));
    window.location.href = newUrl.href;
}
function toggledBlogTags(blogTag) {
    if (!tags) { return blogTag; }
    var selectedTags = toggleTagSelection(blogTag);
    return selectedTags;
}
function toggleTagSelection(blogTag) {
    if (tags.has(blogTag)) {
        tags.delete(blogTag);
    } else {
        tags.add(blogTag);
    }
    return tags;
}


function tagIsSelected(blogTag) {
    if (!tags) { return false; }
    return tags.has(blogTag);
}


function getUrlParamater(param) {
    const url = new URL(location.href);
    return new Set(url.searchParams.getAll(param));
}
