//$(document).foundation()

const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiItems = "https://deliver.kontent.ai/{0}/items{1}";
const apiItem = "https://deliver.kontent.ai/{0}/items/{1}";
const pageSize = 2;
const itemsParams = "?includeTotalCount={0}&limit={1}&order=elements.{2}";

const blogSummaryTemplate = document.querySelector("#blog_summary_template");


async function fetchKontent(api)
{
    const res = await fetch(api);
    const json = await res.json();
    return json;
}

async function initiateBlogSummaryList()
{
    const params = itemsParams.format(["true", pageSize, "post_date[desc]"]);
	const api = apiItems.format([projectId, params]);
	const json = await fetchKontent(api);
	console.log(json);
	
	var blogSummary = "";
	for (var i = 0; i < json.pagination.count; i++)
	{
		if (json.items[i].system.type === "blog_post")
		{
			blogSummary = buildBlogSummary(json.items[i], json.modular_content);
			document.querySelector("main").appendChild(blogSummary);
		}
    }
    setNextBatchLoad(json.pagination.next_page);
}


async function loadNextBlogBatch() {
    var btnLoadMore = document.getElementById("btnLoadMore");
    const api = btnLoadMore.dataset.next_page;
    const json = await fetchKontent(api);

    if (json.pagination.count > 0)
    {
        btnLoadMore.dataset.first_item = json.items[0].system.id;
        var blogSummary = "";
        for (var i = 0; i < json.pagination.count; i++) {
            if (json.items[i].system.type === "blog_post") {
                blogSummary = buildBlogSummary(json.items[i], json.modular_content);
                document.querySelector("main").appendChild(blogSummary);
            }
        }
        setNextBatchLoad(json.pagination.next_page);
        scrollToNewBatch(btnLoadMore.dataset.first_item);
    }
}


function setNextBatchLoad(nextBatchUrl) {
    var btnLoadMore = document.getElementById("btnLoadMore");
    if (nextBatchUrl !== "") {
        btnLoadMore.dataset.next_page = nextBatchUrl;
        btnLoadMore.style.removeProperty("display");
    } else { btnLoadMore.style.display = "none"; }
}

function scrollToNewBatch(itemId) {
    var item = document.querySelector('div[data-item_id="' + itemId + '"]');
    item.scrollIntoView();
}


function buildBlogSummary(blog, modularContent)
{
    const blogSummary = document.importNode(blogSummaryTemplate.content, true);
    blogSummaryTitle = blogSummary.querySelector(".summary-title").textContent = blog.elements.title.value;
    blogSummary.querySelector(".summary-blog-post").dataset.item_id = blog.system.id;
	if (blog.elements.blog_media___image.value.length > 0)
	{
		blogSummary.querySelector(".blog-image").src = blog.elements.blog_media___image.value[0].url;
	}
    blogSummary.querySelector(".summary-author").textContent = getAuthor(blog.elements.author.value[0], modularContent);
    var blogDate = new Date(blog.elements.post_date.value);
    blogSummary.querySelector(".summary-date").textContent = blogDate.toDateString();
    blogSummary.querySelector(".summary-body").innerHTML = blog.elements.body.value.substr(0, blog.elements.body.value.indexOf("</p>"));
	processMediaContent(blogSummary, modularContent);
	return blogSummary;
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
            var obj = blogSummary.querySelector("[data-codename='" + key + "']");
            if (obj !== null)
            {
                var elementMediaEmbed = document.createElement('div');
                elementMediaEmbed.innerHTML = data[key].elements.media_item__text.value;
                obj.parentNode.replaceChild(elementMediaEmbed, obj);
            }
        }
    }
	}
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