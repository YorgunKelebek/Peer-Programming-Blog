//$(document).foundation()

const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiItems = "https://deliver.kontent.ai/{0}/items{1}";
const apiItem = "https://deliver.kontent.ai/{0}/items/{1}";
const pageSize = 10;
const itemsParams = "?includeTotalCount={0}&limit={1}&order=elements.{2}";

const blogSummaryTemplate = document.querySelector("#blog_summary_template");
const apiErrorMessageTemplate = document.querySelector("#api_error_message");


window.addEventListener('DOMContentLoaded', (event) => {
    initiateBlogSummaryList();
});


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
    const params = itemsParams.format(["true", pageSize, "post_date[desc]"]);
	const api = apiItems.format([projectId, params]);
	const json = await fetchKontent(api);
	console.log(json);

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
        document.getElementById("btnLoadMore").setAttribute("style", "display:none;");
        document.querySelector("main").appendChild(errorMessage);
    }
}


async function loadNextBlogBatch() {
    var btnLoadMore = document.getElementById("btnLoadMore");
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
    var btnLoadMore = document.getElementById("btnLoadMore");
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
    const blogSummaryTitle = blogSummary.querySelector(".summary-title").textContent = blog.elements.title.value;
    blogSummary.querySelector(".summary-blog-post").dataset.item_id = blog.system.id;
    blogSummary.querySelector(".blog-preview-toggle").dataset.item_id = blog.system.id;
	if (blog.elements.blog_media___image.value.length > 0)
	{
		blogSummary.querySelector(".blog-image").src = blog.elements.blog_media___image.value[0].url;
	}
    blogSummary.querySelector(".summary-author").textContent = getAuthor(blog.elements.author.value[0], modularContent);
    var blogDate = new Date(blog.elements.post_date.value);
    blogSummary.querySelector(".summary-date").textContent = blogDate.toDateString();
    blogSummary.querySelector(".summary-body").innerHTML = blog.elements.body.value;
	processMediaContent(blogSummary, modularContent);
	return blogSummary;
}


function toggleBlogPreview(el)
{
    itemId = el.dataset.item_id;
    var itemContainer = document.querySelector('div[data-item_id="' + itemId + '"]');
    var itemSummary = itemContainer.querySelector(".summary-body");
    itemSummary.classList.toggle("blog-preview");
    el.innerHTML = itemSummary.classList.contains("blog-preview") ? "Read more" : "Close";
    scrollToItem(itemId);
}


function getAuthor(keyName, data)
{
	var author = "";
    for (var key in data) {
        if (data.hasOwnProperty(key))
        {
            if (key === keyName) { author = "by " + data[key].elements.full_name.value; }
        }
    }
    return author;
}


function processMediaContent(blogSummary, data)
{
    for (var key in data) {
    if (data.hasOwnProperty(key))
    {
        if (data[key].system.type === "media_embed")
        {
            var objMediaEmbed = blogSummary.querySelector("[data-codename='" + key + "']");
            if (objMediaEmbed !== null)
            {
                var elementMediaEmbed = document.createElement('div');
                elementMediaEmbed.innerHTML = data[key].elements.media_item__text.value;
                objMediaEmbed.parentNode.replaceChild(elementMediaEmbed, objMediaEmbed);
            }
        }
        if (data[key].system.type === "code_snippet")
        {
            var objCodeSnippet = blogSummary.querySelector("[data-codename='" + key + "']");
            if (objCodeSnippet !== null) {
                var elementCodeSnippet = document.createElement('pre');
                if (data[key].elements.language.value[0].codename === "html")
                {
                    elementCodeSnippet.innerHTML = htmlentities.encode(data[key].elements.code.value);
                } else
                {
                    elementCodeSnippet.innerHTML = data[key].elements.code.value;
                }
                objCodeSnippet.parentNode.replaceChild(elementCodeSnippet, objCodeSnippet);
            }
        }
    }
	}
}


function getApiError() {
    return document.importNode(apiErrorMessageTemplate.content, true);
}



/* String format function */
String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
/* /String format function */


/* Encode/Decode html */
/* https://ourcodeworld.com/articles/read/188/encode-and-decode-html-entities-using-pure-javascript */
(function (window) {
    window.htmlentities = {
        encode: function (str) {
            var buf = [];

            for (var i = str.length - 1; i >= 0; i--) {
                buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
            }

            return buf.join('');
        },
        decode: function (str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        }
    };
})(window);
/* /Encode/Decode html */
