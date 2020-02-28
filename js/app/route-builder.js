export function buildBlogLink(system_node) {

    const url = new URL(location.href);
    url.hash = "";
    url.search = "";
    url.searchParams.set("resource", `items/${system_node.codename}`);
    return url.toString();

}