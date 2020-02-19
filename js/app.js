import { firstOrDefaultValue, firstOrDefaultContent } from "./parsing.js";
import { buildBlogItemsUrl, buildTaxonomiesUrl, fetchKontent } from "./kontent.js";

const baseUrl = new URL(location);
baseUrl.search = "";
baseUrl.hash = "";
const tags = getUrlParamater("tag");
const blogSummaryTemplate = document.querySelector("#blog_summary_template");
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

    blogSummary.querySelector(".summary-blog-post").dataset.item_id =
        blogSummary.querySelector(".blog-preview-toggle").dataset.item_id = blog.system.id;

    const blogMediaImageURL = firstOrDefaultValue(blog, "blog_media___image", "url");
	if (blogMediaImageURL)
	{
		blogSummary.querySelector(".blog-image").src = blogMediaImageURL;
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

    const body = firstOrDefaultValue(blog, "body") || "";
	blogSummary.querySelector(".summary-body").innerHTML = body;

    processContentSnippets(blogSummary, modularContent);
	return blogSummary;
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


function processContentSnippets(blogSummary, data)
{
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key].system.type === "media_embed") {
                var objMediaEmbed = blogSummary.querySelector("[data-codename='" + key + "']");
                if (objMediaEmbed !== null) {
                    var elementMediaEmbed = document.createElement('div');
                    elementMediaEmbed.innerHTML = data[key].elements.media_item__text.value;
                    objMediaEmbed.parentNode.replaceChild(elementMediaEmbed, objMediaEmbed);
                }
            }
            if (data[key].system.type === "code_snippet") {
                var objCodeSnippet = blogSummary.querySelector("[data-codename='" + key + "']");
                if (objCodeSnippet !== null) {
                    var elementCodeSnippet = document.createElement('pre');
                    elementCodeSnippet.textContent = data[key].elements.code.value;
                    objCodeSnippet.parentNode.replaceChild(elementCodeSnippet, objCodeSnippet);
                }
            }
        }
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
