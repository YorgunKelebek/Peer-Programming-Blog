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

const queryStringPatcher =
    data =>
        Array.from(currentURL.searchParams.keys())
            .filter(key => key in data)
            .reduce(combineExistingValuesWithURLSearchParamValue, data);

export default queryStringPatcher;