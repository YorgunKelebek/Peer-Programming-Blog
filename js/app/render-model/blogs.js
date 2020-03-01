import NodeArtist from "../../lib/node-artist/index.js";

export default function(viewModel) {

    if (!viewModel.blogs) return;

    const blogListArtist = NodeArtist("#blog-list");
    const blogs = blogListArtist(viewModel);
    document.body.appendChild(blogs);

}