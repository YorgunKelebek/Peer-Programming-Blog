import { pageOptions } from "./app/page-options.js";
import { prepareData } from "./app/prepare-data.js";
import { DOMContentLoaded } from "./lib/DOM.js";

(async function() {

    const preparingData = prepareData(pageOptions);
    await DOMContentLoaded();
    const { blogs, paging } = await preparingData;

}());