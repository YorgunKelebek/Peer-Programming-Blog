import fetcher from "../../lib/fetcher.js";
import prepareItemsData from "./items.js";
import prepareItemData from "./item.js";

export default async function({ baseURI, resource }) {

    // fetch the raw data
    const dataURI = `${baseURI}${resource}`;
    const data = await fetcher(dataURI, res => res.json());

    // prepare whatever data is found in what we just loaded
    return Object.assign(
        {},
        prepareItemsData(data),
        prepareItemData(data)
    );

}