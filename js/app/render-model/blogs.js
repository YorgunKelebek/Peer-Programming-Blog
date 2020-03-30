import NodeArtist from "../../lib/node-artist/index.js";

export default function renderBlogs(viewModel) {

    if (!viewModel) return;

    const blogListArtist = NodeArtist("#blog-list");
    const rendered = blogListArtist(viewModel);
    document.body.appendChild(rendered);

}