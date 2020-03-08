import { firstOrDefaultValue, firstOrDefaultContent } from "./kontent-parsing.js";
import { processContentSnippets } from "./blog-snippets.js";

const blogSummaryTemplate = document.querySelector("#blog_summary_template");
const blogImageTemplate = document.querySelector("#blog_image_template");


export function buildBlogSummary(blog, modularContent) {
    const title = firstOrDefaultValue(blog, "title") || "unknown";
    let blogSummary = document.importNode(blogSummaryTemplate.content, true);
    blogSummary.querySelector(".summary-title").textContent = title;

    let blogPost = blogSummary.querySelector(".summary-blog-post");
    blogPost.dataset.item_id =
        blogSummary.querySelector(".blog-preview-toggle").dataset.item_id = blog.system.id;
    blogPost = insertBlogImage(blog, blogPost);

    const authorContent = firstOrDefaultContent(blog, modularContent, "author");
    const authorName = firstOrDefaultValue(authorContent, "full_name") || "(none)";
    blogSummary.querySelector(".summary-author").textContent = authorName;
    blogSummary = insertBlogDate(blog, blogSummary);

    let body = firstOrDefaultValue(blog, "body") || "";
    body = convertImagesToHyperlink(body);
    body = wrapTablesForOverflow(body);
    blogSummary.querySelector(".summary-body").innerHTML = body;

    processContentSnippets(blogSummary, modularContent);
    return blogSummary;
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
        blogSummary.querySelector(".summary-date").textContent = blogDate.toDateString();
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