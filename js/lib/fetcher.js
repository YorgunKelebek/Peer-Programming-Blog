const defaultResponseParser = async res => await res.text();

export default async function fetcher(url, parseAction = defaultResponseParser) {
    const fetched = await fetch(url);
    if (!fetched.ok) throw new Error(`${fetched.statusText} (${fetched.status})`);
    return await parseAction(fetched);
}

function doctor(data) {
    const when = new Date();
    when.setMinutes(when.getMinutes() - 30);
    data.items[0].elements.post_date.value = when.toString();
    when.setMinutes(when.getMinutes() - 60);
    data.items[1].elements.post_date.value = when.toString();
    when.setHours(when.getHours() - 24);
    data.items[2].elements.post_date.value = when.toString();
    return data;
}