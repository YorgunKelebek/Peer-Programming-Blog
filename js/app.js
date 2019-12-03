import { firstOrDefaultValue, firstOrDefaultContent } from "/js/parsing.js";

const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiItems = "https://deliver.kontent.ai/{0}/items{1}";
const apiItem = "https://deliver.kontent.ai/{0}/items/{1}";
const pageSize = 10;
const itemsParams = "?includeTotalCount={0}&limit={1}&order=elements.{2}";

const blogSummaryTemplate = document.querySelector("#blog_summary_template");
const apiErrorMessageTemplate = document.querySelector("#api_error_message");


window.addEventListener('DOMContentLoaded', (event) => {
    initiateBlogSummaryList();
    initiateEventListeners();
});


function initiateEventListeners() {
    document.querySelector("main").addEventListener("click", function(e) {
       if (e.target.classList.contains("blog-preview-toggle")) {
           toggleBlogPreview(e.target);
       }
    });
    document.querySelector("#loadMoreBlogItems").addEventListener("click", loadNextBlogBatch);
}


async function fetchKontent(api)
{
    var resError = { items: [], error: true };
    try {
        const res = await fetch(api);
        const json = await res.json();
        if (json.error_code !== undefined) { return resError; }
        return json;
    } catch (error) {
        return resError;
    }
}


async function initiateBlogSummaryList()
{
    const params = formatString(itemsParams, ["true", pageSize, "post_date[desc]"]);
    const api = formatString(apiItems, [projectId, params]);
	const json = await fetchKontent(api);

    if (json.items.length > 0) {
        var blogSummary = "";
        for (var i = 0; i < json.pagination.count; i++) {
            if (json.items[i].system.type === "blog_post") {
                blogSummary = buildBlogSummary(json.items[i], json.modular_content);
                document.querySelector("main").appendChild(blogSummary);
            }
        }
        setNextBatchLoad(json.pagination.next_page);
    } else {
        errorMessage = getApiError();
        document.getElementById("loadMoreBlogItems").setAttribute("style", "display:none;");
        document.querySelector("main").appendChild(errorMessage);
    }
}


async function loadNextBlogBatch() {
    var btnLoadMore = document.getElementById("loadMoreBlogItems");
    const api = btnLoadMore.dataset.next_page;
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
            scrollToItem(btnLoadMore.dataset.first_item);
        }
    } else {
        errorMessage = getApiError();
        document.querySelector("main").appendChild(errorMessage);
    }
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

    blogSummary.querySelector(".summary-blog-post").dataset.item_id = blog.system.id;
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
    el.innerHTML = itemSummary.classList.contains("blog-preview") ? "Read more" : "Close";
    scrollToItem(itemId);
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
                    if (data[key].elements.language.value[0].codename === "html") {
                        elementCodeSnippet = document.createElement('xmp');
                    }
                    elementCodeSnippet.innerHTML = data[key].elements.code.value;
                    objCodeSnippet.parentNode.replaceChild(elementCodeSnippet, objCodeSnippet);
                }
            }
        }
    }
}


function getApiError() {
    return document.importNode(apiErrorMessageTemplate.content, true);
}


function formatString(str, args) {
    if (args.length > 0) {
        for (var i = 0; i < args.length; i++) {
            str = str.replace("{" + i + "}", args[i]);
        }
    }
    return str;
}
