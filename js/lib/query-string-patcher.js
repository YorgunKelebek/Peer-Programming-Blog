const currentURL = new URL(location.href);

function decodedValueFromCurrentURL(key) {
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
            [key]: decodedValueFromCurrentURL(key)
        });

const queryStringPatcher =
    defaultValues =>
        Array.from(currentURL.searchParams.keys())
            .filter(key => key in defaultValues)
            .reduce(combineExistingValuesWithURLSearchParamValue, defaultValues);

export default queryStringPatcher;