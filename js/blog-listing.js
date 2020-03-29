import { buildBlogItemUrl, buildBlogItemsUrl, fetchKontent } from "./kontent-fetching.js";
import { buildBlogItem } from "./blog-item.js";
import { tags } from "./blog-tags.js";

let pageFirstLoad = true;


export async function loadBlogItems(blogCodename) {
    if (blogCodename) loadBlogItem(blogCodename);
    else loadBlogListing();
}

async function loadBlogItem(blogCodeName) {
    const api = buildBlogItemUrl(blogCodeName);
    const json = await fetchKontent(api);

    if (!json.item) {
        const errorMessage = json.error ? getApiErrorMessage() : getNoResultsMessage();
        document.querySelector("main").appendChild(errorMessage);
    }
    else processBlogItem(json);
}
function processBlogItem(data) {
    var blogSummary = "";
    blogSummary = buildBlogItem(data.item, data.modular_content, data.item.elements.body.links);
    document.querySelector("main").appendChild(blogSummary);
}


async function loadBlogListing() {
    var btnLoadMore = document.getElementById("loadMoreBlogItems");
    const api = pageFirstLoad ? buildBlogItemsUrl(tags) : btnLoadMore.dataset.next_page;
    const json = await fetchKontent(api);

    if (json.items.length === 0) {
        const errorMessage = json.error ? getApiErrorMessage() : getNoResultsMessage();
        document.querySelector("main").appendChild(errorMessage);
        return;
    }

    processBlogItems(json);
    setNextBatchLoading(json, btnLoadMore);
    pageFirstLoad = false;
    initiateEventListeners();
}
function processBlogItems(data) {
    var blogPost = "";
    for (var i = 0; i < data.pagination.count; i++) {
        if (data.items[i].system.type === "blog_post") {
            blogPost = buildBlogItem(data.items[i], data.modular_content, data.items[i].elements.body.links, true);
            document.querySelector("main").appendChild(blogPost);
        }
    }
}
function setNextBatchLoading(data, btnLoadMore) {
    if (data.pagination.count > 0) {
        btnLoadMore.dataset.first_item = data.items[0].system.id;
        setNextBatchLoad(data.pagination.next_page);
    }
    if (!pageFirstLoad) scrollToItem(btnLoadMore.dataset.first_item);
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


const apiErrorMessageTemplate = document.querySelector("#api_error_message");
const apiNoResultsMessageTemplate = document.querySelector("#api_noresults_message");
function getApiErrorMessage() {
    return document.importNode(apiErrorMessageTemplate.content, true);
}
function getNoResultsMessage() {
    return document.importNode(apiNoResultsMessageTemplate.content, true);
}


function initiateEventListeners() {
    document.querySelector("main").addEventListener("click", function (e) {
        if (e.target.classList.contains("blog-preview-toggle")) {
            toggleBlogPreview(e.target);
        }
    });
    document.querySelector("#loadMoreBlogItems").addEventListener("click", loadBlogListing);
}


function toggleBlogPreview(el) {
    const itemId = el.dataset.item_id;
    var itemContainer = document.querySelector('div[data-item_id="' + itemId + '"]');
    var itemSummary = itemContainer.querySelector(".blog-body");
    itemSummary.classList.toggle("blog-preview");
    el.innerHTML = itemSummary.classList.contains("blog-preview") ? "Read more" : "Read less";
    scrollToItem(itemId);
}
