import NodeArtist from "../../lib/node-artist/index.js";

export default function({ blog }) {

    if (!blog) return;
    const blogArtist = NodeArtist("#blog");
    const rendered = blogArtist(blog);
    document.body.appendChild(rendered);


    console.log(blog);

}