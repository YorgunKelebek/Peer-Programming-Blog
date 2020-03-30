import renderBlogs from "./blogs.js";
import renderBlog from "./blog.js";

export default function render(model) {

    renderBlogs(model);
    renderBlog(model);

}