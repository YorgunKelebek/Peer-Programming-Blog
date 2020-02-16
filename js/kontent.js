const projectId = "99b0b3b0-4838-0051-3d57-8af72f55e8a0";
const apiBlogItems = `https://deliver.kontent.ai/${projectId}/items`;
const apiBlogPost = `https://deliver.kontent.ai/${projectId}/items/`;
const apiTaxonomyGroup = `https://deliver.kontent.ai/${projectId}/taxonomies/`;
const pageSize = 10;

class URLBuilder {
    constructor(baseURL) {
        this.contentCodeName = "";
        this.includeTotalCount = true;
        this.limit = null;
        this.orderByElementProp = null;
        this.blogTagsContains = null;
        this.baseURL = new URL(baseURL + this.contentCodeName);
    }

    build() {
        const working = new URL(this.baseURL + (this.contentCodeName));
        const searchParams = working.searchParams;
        if (this.includeTotalCount) searchParams.set("includeTotalCount", this.includeTotalCount);
        if (this.limit) searchParams.set("limit", this.limit);
        if (this.orderByElementProp) searchParams.set("order", `elements.${this.orderByElementProp}`);
        if (this.blogTagsContains) searchParams.set("elements.blog_tags[contains]", this.blogTagsContains);
        return working;
    }
}
const itemsFetchKontentApi = new URLBuilder(apiBlogItems);
const itemFetchKontentApi = new URLBuilder(apiBlogPost);
const taxonomiesFetchKontentApi = new URLBuilder(apiTaxonomyGroup);


export function buildBlogItemsUrl(tag) {
    itemsFetchKontentApi.includeTotalCount = true;
    itemsFetchKontentApi.limit = pageSize;
    itemsFetchKontentApi.orderByElementProp = "post_date[desc]";
    if (tag) itemsFetchKontentApi.blogTagsContains = tag;
    return itemsFetchKontentApi.build();
}


export function buildBlogItemUrl(itemCodeName) {
    itemFetchKontentApi.contentCodeName = itemCodeName;
    return itemFetchKontentApi.build();
}


export function buildTaxonomiesUrl() {
    taxonomiesFetchKontentApi.contentCodeName = "blog_tags";
    return taxonomiesFetchKontentApi.build();
}


export async function fetchKontent(api) {
    var resError = { items: [], error: true };
    try {
        const res = await fetch(api);
        if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
        const json = await res.json();
        if (json.error_code !== undefined) { return resError; }
        return json;
    } catch (error) {
        return resError;
    }
}
