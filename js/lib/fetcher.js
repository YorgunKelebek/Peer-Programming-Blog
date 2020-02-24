const defaultResponseParser = async res => await res.text();

export default async function fetcher(url, parseAction = defaultResponseParser) {
    const fetched = await fetch(url);
    if (!fetched.ok) throw new Error(`${fetched.statusText} (${fetched.status})`);
    return await parseAction(fetched);
}