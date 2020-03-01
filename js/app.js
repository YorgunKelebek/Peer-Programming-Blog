import { firstOrDefaultValue, firstOrDefaultContent } from "./parsing.js";
import { buildBlogItemsUrl, buildTaxonomiesUrl, fetchKontent } from "./kontent.js";

const baseUrl = new URL(location);
baseUrl.search = "";
baseUrl.hash = "";
const tags = getUrlParamater("tag");
const blogSummaryTemplate = document.querySelector("#blog_summary_template");
const blogImageTemplate = document.querySelector("#blog_image_template");
const apiErrorMessageTemplate = document.querySelector("#api_error_message");
const apiNoResultsMessageTemplate = document.querySelector("#api_noresults_message");
let pageFirstLoad = true;

window.addEventListener('DOMContentLoaded', (event) => {
    loadBlogItems();
    loadAsideBlogTags();
    initiateEventListeners();
});


function initiateEventListeners() {
    document.querySelector("main").addEventListener("click", function(e) {
       if (e.target.classList.contains("blog-preview-toggle")) {
           toggleBlogPreview(e.target);
       }
    });
    document.querySelector("#loadMoreBlogItems").addEventListener("click", loadBlogItems);
}


async function loadBlogItems() {
    var btnLoadMore = document.getElementById("loadMoreBlogItems");
    const api = pageFirstLoad ? buildBlogItemsUrl(tags) : btnLoadMore.dataset.next_page;
    const json = await fetchKontent(api);

    if (json.items.length > 0) {
        if (json.pagination.count > 0) {
            btnLoadMore.dataset.first_item = json.items[0].system.id;
            var blogSummary = "";
            for (var i = 0; i < json.pagination.count; i++) {
                if (json.items[i].system.type === "blog_post") {
                    blogSummary = buildBlogSummary(json.items[i], json.modular_content);
                    document.querySelector("main").appendChild(blogSummary);
                }
            }
            setNextBatchLoad(json.pagination.next_page);
            if (!pageFirstLoad) scrollToItem(btnLoadMore.dataset.first_item);
        }
    } else {
        const errorMessage = json.error ? getApiErrorMessage() : getNoResultsMessage();
        document.querySelector("main").appendChild(errorMessage);
    }
    pageFirstLoad = false;
}


function setNextBatchLoad(nextBatchUrl) {
    var btnLoadMore = document.getElementById("loadMoreBlogItems");
    if (nextBatchUrl !== "") {
        btnLoadMore.dataset.next_page = nextBatchUrl;
        btnLoadMore.style.removeProperty("display");
    } else { btnLoadMore.style.display = "none"; }
}


function scrollToItem(itemId) {
    var item = document.querySelector('div[data-item_id="' + itemId + '"]');
    item.scrollIntoView();
}

function buildBlogSummary(blog, modularContent)
{
    const blogSummary = document.importNode(blogSummaryTemplate.content, true);

    const title = firstOrDefaultValue(blog, "title") || "unknown";
    blogSummary.querySelector(".summary-title").textContent = title;

    const blogPost = blogSummary.querySelector(".summary-blog-post");
    blogPost.dataset.item_id =
        blogSummary.querySelector(".blog-preview-toggle").dataset.item_id = blog.system.id;

    const blogMediaImageURL = firstOrDefaultValue(blog, "blog_media___image", "url");
	if (blogMediaImageURL)
	{
        const blogImage = document.importNode(blogImageTemplate.content, true);
        blogImage.querySelector(".blog-image").src = blogMediaImageURL;
        blogPost.insertBefore(blogImage, blogPost.childNodes[0]);
    }

    const authorContent = firstOrDefaultContent(blog, modularContent, "author");
    const authorName = firstOrDefaultValue(authorContent, "full_name") || "(none)";
    blogSummary.querySelector(".summary-author").textContent = authorName;

    const postDate = firstOrDefaultValue(blog, "post_date");
    if(postDate) {
        try {
            const blogDate = new Date(postDate);
            blogSummary.querySelector(".summary-date").textContent = blogDate.toDateString();
        } catch(e) {
            console.warn("Blog post date couldn't be parsed for " + JSON.stringify(blog));
        }
    }

    let body = firstOrDefaultValue(blog, "body") || "";
    body = convertImagesToHyperlink(body);
	blogSummary.querySelector(".summary-body").innerHTML = body;

    processContentSnippets(blogSummary, modularContent);
	return blogSummary;
}


function convertImagesToHyperlink(blogBody) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = blogBody;
    wrapper.querySelectorAll("img").forEach(image => {
        const imageParentNode = image.parentNode;
        const elementHyperlink = document.createElement('a');
        elementHyperlink.appendChild(image.cloneNode());
        elementHyperlink.href = image.src;
        elementHyperlink.target = "_blank";
        imageParentNode.replaceChild(elementHyperlink, image);
    });
    return wrapper.innerHTML;
}


function toggleBlogPreview(el)
{
    const itemId = el.dataset.item_id;
    var itemContainer = document.querySelector('div[data-item_id="' + itemId + '"]');
    var itemSummary = itemContainer.querySelector(".summary-body");
    itemSummary.classList.toggle("blog-preview");
    el.innerHTML = itemSummary.classList.contains("blog-preview") ? "Read more" : "Read less";
    scrollToItem(itemId);
}


async function loadAsideBlogTags() {
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


const snippetTypes = {
    "media_embed": { "property": "media_item__text.value", "tag": "div", "format": "html", "classname": "" },
    "code_snippet": { "property": "code", "tag": "pre", "format": "text", "classname": "" },
    "aside_note": { "property": "note_text", "tag": "aside", "format": "html", "classname": "" },
    "quotation": { "property": "quote", "tag": "aside", "format": "html", "classname": "quotation" }
    };
function processContentSnippets(blogSummary, data)
{
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key].system.type in snippetTypes) {
                buildContentSnippet(blogSummary, data, key);
            }
        }
    }
}
function buildContentSnippet(blogSummary, data, key) {
    const typeCode = data[key].system.type;
    const snippetType = snippetTypes[typeCode];
    const objSnippet = blogSummary.querySelector("[data-codename='" + key + "']");
    if (objSnippet !== null) {
        const elementSnippet = document.createElement(snippetType.tag);
        const snippetContent = firstOrDefaultValue(data[key], snippetType.property) || "";
        if (snippetType.format === "text") elementSnippet.textContent = snippetContent;
        else elementSnippet.innerHTML = snippetContent;
        if (snippetType.classname) elementSnippet.classList.add(snippetType.classname);
        if (typeCode === "aside_note") {
            const asideStyle = firstOrDefaultValue(data[key], "note_style");
            if (asideStyle) elementSnippet.classList.add("aside-" + asideStyle.codename);
        }
        else if (typeCode === "quotation") {
            const quoteReference = firstOrDefaultValue(data[key], "reference");
            if (quoteReference) {
                var elementReference = document.createElement('div');
                elementReference.innerHTML = quoteReference;
                elementReference.classList.add("quote-reference");
                elementSnippet.appendChild(elementReference);
            }
        }
        objSnippet.parentNode.replaceChild(elementSnippet, objSnippet);
    }
}


function getApiErrorMessage() {
    return document.importNode(apiErrorMessageTemplate.content, true);
}


function getNoResultsMessage() {
    return document.importNode(apiNoResultsMessageTemplate.content, true);
}


function getUrlParamater(param) {
    const url = new URL(location.href);
    return new Set(url.searchParams.getAll(param));
}
