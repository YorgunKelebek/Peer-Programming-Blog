import { loadBlogItems } from "./blog-listing.js";
import { loadAsideBlogTags } from "./blog-tags.js";

export const baseUrl = new URL(location);
baseUrl.search = "";
baseUrl.hash = "";
export const tags = getUrlParamater("tag");


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


function toggleBlogPreview(el)
{
    const itemId = el.dataset.item_id;
    var itemContainer = document.querySelector('div[data-item_id="' + itemId + '"]');
    var itemSummary = itemContainer.querySelector(".summary-body");
    itemSummary.classList.toggle("blog-preview");
    el.innerHTML = itemSummary.classList.contains("blog-preview") ? "Read more" : "Read less";
    scrollToItem(itemId);
}


function getUrlParamater(param) {
    const url = new URL(location.href);
    return new Set(url.searchParams.getAll(param));
}
