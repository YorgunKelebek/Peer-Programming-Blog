import { buildBlogItemsUrl, fetchKontent } from "./kontent-fetching.js";
import { buildBlogSummary } from "./blog-item.js";
import { tags } from "./app.js";

let pageFirstLoad = true;


export async function loadBlogItems() {
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
}
function processBlogItems(data) {
    var blogSummary = "";
    for (var i = 0; i < data.pagination.count; i++) {
        if (data.items[i].system.type === "blog_post") {
            blogSummary = buildBlogSummary(data.items[i], data.modular_content);
            document.querySelector("main").appendChild(blogSummary);
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
