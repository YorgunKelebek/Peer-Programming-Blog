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

const patchObject = (originalObject, key, value) =>
    Object.assign(originalObject, {
        [key]: value
    });

const pathExtract = (data, schema) =>
    Object.entries(schema)
        .map(schemaItem => pathExtractItem(data, schemaItem))
        .reduce((result, item) => patchObject(result, item.key, item.value), {});

export default function dataArtist(schema) {

    // our data artist is a function which accepts data and returns the desired model
    return data => pathExtract(data, schema);

}