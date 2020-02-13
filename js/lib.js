const currentURL = new URL(location.href);

function decodedValue(key) {
    try {
        return decodeURIComponent(currentURL.searchParams.get(key));
    } catch(err) {
        throw new Error(`An error occurred attempting to decode the querystring value for ${key}. ${err.message}`);
    }
}

const combineExistingValuesWithURLSearchParamValue =
    (existingValues, key) =>
        ({
            ...existingValues,
            [key]: decodedValue(key)
        });

export const queryStringPatcher =
    data =>
        Array.from(currentURL.searchParams.keys())
            .filter(key => key in data)
            .reduce(combineExistingValuesWithURLSearchParamValue, data);

const defaultResponseParser = async res => await res.text();

export async function fetcher(url, parseAction = defaultResponseParser) {
    const fetched = await fetch(url);
    if (!fetched.ok) throw new Error(`${fetched.statusText} (${fetched.status})`);
    return await parseAction(fetched);
}

function stringify(object) {
    try {
        return JSON.stringify(object);
    } catch(err) {
        return "[object]";
    }
}

function pathExtractItem(data, schemaItem) {
    try {
        const [ name, path ] = schemaItem;
        if (!(path && name)) throw new Error("Expected path and name");
        if (typeof name !== "string") throw new Error("Name is not a string");
        if (!Array.isArray(path)) throw new Error("Path is not an array");
        let node = data;
        for(let step of path) {
            if(!node) break;
            if (typeof step === "function")
                node = step(node);
            else
                node = node[step];
        }
        return {
            key: name,
            value: node
        };
    } catch(err) {
        throw new Error(`Malformed schemaItem. ${err.message}. ${stringify(schemaItem)}`);
    }
}

function pathExtract(data, schema) {
    return Object.entries(schema)
        .map(schemaItem => pathExtractItem(data, schemaItem))
        .reduce((result, item) => ({
            ...result,
            [item.key]: item.value
        }), {});
}

export function dataArtist(schema) {
    return function(data) {
        return pathExtract(data, schema);
    }
}