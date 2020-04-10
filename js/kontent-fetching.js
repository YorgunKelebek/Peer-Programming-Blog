const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiRoot = "https://deliver.kontent.ai";
const apiPreviewRoot = "https://preview-deliver.kontent.ai";
const apiBlogItems = `${apiRoot}/${projectId}/items`;
const apiBlogPost = `${apiRoot}/${projectId}/items/`;
const apiTaxonomyGroup = `${apiRoot}/${projectId}/taxonomies/`;
const pageSize = 10;
export const baseUrl = new URL(location);
baseUrl.search = "";
baseUrl.hash = "";

class URLBuilder {
    constructor(baseURL) {
        this.urlSlug = null;
        this.contentType = "blog_post";
        this.contentCodeName = null;
        this.includeTotalCount = true;
        this.limit = null;
        this.orderByElementProp = null;
        this.selectedTags = null;
        this.baseURL = new URL(baseURL);
    }

    build() {
        const working = new URL(this.baseURL + (this.contentCodeName || ""));
        const searchParams = working.searchParams;
        if (this.urlSlug) searchParams.set("elements.url", this.urlSlug);
        if (this.includeTotalCount) searchParams.set("includeTotalCount", this.includeTotalCount);
        if (this.limit) searchParams.set("limit", this.limit);
        if (this.orderByElementProp) searchParams.set("order", `elements.${this.orderByElementProp}`);
        if (this.selectedTags) searchParams.set("elements.blog_tags[any]", Array.from(this.selectedTags).join(","));
        return working;
    }
}
const itemsFetchKontentApi = new URLBuilder(apiBlogItems);
const taxonomiesFetchKontentApi = new URLBuilder(apiTaxonomyGroup);


export function buildBlogItemsUrl(tags) {
    itemsFetchKontentApi.includeTotalCount = true;
    itemsFetchKontentApi.limit = pageSize;
    itemsFetchKontentApi.orderByElementProp = "post_date[desc]";
    if (tags.size > 0) itemsFetchKontentApi.selectedTags = tags;
    return itemsFetchKontentApi.build();
}


export function buildBlogItemUrl(itemUrlSlug) {
    itemsFetchKontentApi.urlSlug = itemUrlSlug;
    return itemsFetchKontentApi.build().href;
}


export function buildTaxonomiesUrl() {
    taxonomiesFetchKontentApi.contentCodeName = "blog_tags";
    return taxonomiesFetchKontentApi.build();
}


export async function fetchKontent(api, preview = false, token = "") {
    var resError = { items: [], error: true };
    try {
        let res;
        if (preview) {
            res = await fetch(api.replace(apiRoot, apiPreviewRoot), {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
        } else { res = await fetch(api); }
        if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
        const json = await res.json();
        if (json.error_code !== undefined) { return resError; }
        return json;
    } catch (error) {
        return resError;
    }
}
