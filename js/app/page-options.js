import queryStringPatcher from "../lib/query-string-patcher.js";

const projectMetaTag = document.head.querySelector(`meta[name="project-id"]`);
if (!projectMetaTag) throw new Error("You need to define a <meta> tag with the project Id as content");
const projectId = projectMetaTag.content;

const defaultResourceQuery = new URLSearchParams({
    limit: 3,
    elements: "author,title,post_date,blog_tage,full_name,avatar",
    order: "elements.post_date[desc]",
    includeTotalCount: true,
    "system.type": "blog_post"
}).toString();

export const pageOptions = queryStringPatcher({
    baseURI: `https://deliver.kontent.ai/${projectId}/`,
    resource: `items?${defaultResourceQuery}`
});