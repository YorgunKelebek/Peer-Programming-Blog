import { firstOrDefaultValue, firstOrDefaultContent } from "./kontent-parsing.js";
import { processContentSnippets } from "./blog-snippets.js";
import { processBlogLinks } from "./blog-links.js";
import { baseUrl } from "./kontent-fetching.js";

const blogItemTemplate = document.querySelector("#blog_item_template");
const blogImageTemplate = document.querySelector("#blog_image_template");


export function buildBlogItem(blog, modularContent, blogLinks, summary = false) {
    const title = firstOrDefaultValue(blog, "title") || "unknown";
    let blogItemContent = document.importNode(blogItemTemplate.content, true);
    blogItemContent = inserBlogTitle(title, firstOrDefaultValue(blog, "url"), blogItemContent, summary);

    let blogPost = blogItemContent.querySelector(".blog-post");
    blogPost = insertBlogImage(blog, blogPost);
    blogItemContent = setBlogPreviewToggle(blogPost, blog, blogItemContent, summary);

    const authorContent = firstOrDefaultContent(blog, modularContent, "author");
    const authorName = firstOrDefaultValue(authorContent, "full_name") || "(none)";
    blogItemContent.querySelector(".blog-author").textContent = authorName;
    blogItemContent = insertBlogDate(blog, blogItemContent);

    let body = firstOrDefaultValue(blog, "body") || "";
    body = convertImagesToHyperlink(body);
    body = wrapTablesForOverflow(body);
    const blogElement = blogItemContent.querySelector(".blog-body");
    blogElement.innerHTML = body;
    if (summary) blogElement.classList.add("blog-preview");

    processContentSnippets(blogItemContent, modularContent);
    processBlogLinks(blogItemContent, blogLinks);
    return blogItemContent;
}
function inserBlogTitle(blogTitle, itemUrlSlug, blogItemContent, summary) {
    if (summary === false) {
        blogItemContent.querySelector(".blog-title").textContent = blogTitle;
        return blogItemContent;
    }

    const blogUrl = new URL(baseUrl);
    blogUrl.hash = itemUrlSlug;
    const elementHyperlink = document.createElement("a");
    elementHyperlink.innerText = blogTitle;
    elementHyperlink.href = blogUrl;
    elementHyperlink.target = '_blank';
    elementHyperlink.setAttribute('data-item_code', itemUrlSlug);
    blogItemContent.querySelector(".blog-title").appendChild(elementHyperlink);
    return blogItemContent;
}
function insertBlogImage(blog, blogPost) {
    const blogMediaImageURL = firstOrDefaultValue(blog, "blog_media___image", "url");
    if (blogMediaImageURL) {
        const blogImage = document.importNode(blogImageTemplate.content, true);
        blogImage.querySelector(".blog-image").src = blogMediaImageURL;
        blogPost.insertBefore(blogImage, blogPost.childNodes[0]);
    }
    return blogPost;
}
function insertBlogDate(blog, blogSummary) {
    const postDate = firstOrDefaultValue(blog, "post_date");
    if (postDate) {
        const blogDate = new Date(postDate);
        blogSummary.querySelector(".blog-date").textContent = blogDate.toDateString();
    }
    return blogSummary;
}
function convertImagesToHyperlink(blogBody) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = blogBody;
    wrapper.querySelectorAll("img").forEach(image => {
        const imageParentNode = image.parentNode;
        const elementHyperlink = document.createElement("a");
        elementHyperlink.appendChild(image.cloneNode());
        elementHyperlink.href = image.src;
        elementHyperlink.target = "_blank";
        imageParentNode.replaceChild(elementHyperlink, image);
    });
    return wrapper.innerHTML;
}
function wrapTablesForOverflow(blogBody) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = blogBody;
    wrapper.querySelectorAll(":scope > table").forEach(table => {
        const elementContainer = document.createElement("div");
        elementContainer.appendChild(table.cloneNode(true));
        elementContainer.classList.add("table-wrapper");
        wrapper.replaceChild(elementContainer, table);
    });
    return wrapper.innerHTML;
}
function setBlogPreviewToggle(blogPost, blog, blogItemContent, summary) {
    blogPost.dataset.item_id = blogItemContent.querySelector(".blog-preview-toggle").dataset.item_id = blog.system.id;
    if (summary === false) blogItemContent.querySelector(".blog-preview-toggle").style.display = "none";
    return blogItemContent;
}
