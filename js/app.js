import { firstOrDefaultValue, firstOrDefaultContent } from "/js/parsing.js";
//$(document).foundation()

/* TO-DO: Load More Blog items */

const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiItems = "https://deliver.kontent.ai/{0}/items{1}";
const apiItem = "https://deliver.kontent.ai/{0}/items/{1}";
const pageSize = 5;
const itemsParams = "?includeTotalCount={0}&limit={1}&order=elements.{2}";

const blogSummaryTemplate = document.querySelector("#blog_summary_template");


async function fetchKontent(api)
{
	return await fetch(api).then(res => res.json());
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
}

function buildBlogSummary(blog, modularContent)
{
	const blogSummary = document.importNode(blogSummaryTemplate.content, true);

	const title = firstOrDefaultValue(blog, "title") || "unknown";
	blogSummary.querySelector(".summary-title").textContent = title;

	const blogMediaImageURL = firstOrDefaultValue(blog, "blog_media___image", "url");
	if (blogMediaImageURL)
	{
		blogSummary.querySelector(".blog-image").src = blogMediaImageURL;
	}

	const authorContent = firstOrDefaultContent(blog, modularContent, "author");
	const authorName = firstOrDefaultValue(authorContent, "full_name") || "(none)";

	blogSummary.querySelector(".summary-author").textContent = authorName;

	const postDate = firstOrDefaultValue(blog, "post_date");
	if (postDate) {
		try {
			const blogDate = new Date(postDate);
			blogSummary.querySelector(".summary-date").textContent = blogDate.toDateString();
		} catch(e) {
			console.warn("Blog post date couldn't be parsed for " + JSON.stringify(blog));
		}
	}

	const body = firstOrDefaultValue(blog, "body") || "";
	blogSummary.querySelector(".summary-body").innerHTML = body.substr(0, body.indexOf("</p>"));

	processMediaContent(blogSummary, modularContent);
	return blogSummary;
}

function getAuthor(keyName, data)
{
	var author = "";
    for (var key in data) {
        if (data.hasOwnProperty(key))
        {
            if (key === keyName) { author = "Posted by " + data[key].elements.full_name.value; }
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

window.addEventListener("DOMContentLoaded", initiateBlogSummaryList);