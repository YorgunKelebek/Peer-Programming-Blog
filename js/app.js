import { pageOptions } from "./app/page-options.js";
import prepareData from "./app/prepare-data/index.js";
import { DOMContentLoaded } from "./lib/DOM.js";
import renderModel from "./app/render-model/index.js";

(async function main() {

    const preparingData = prepareData(pageOptions);
    await DOMContentLoaded();
    const viewModel = await preparingData;
    renderModel(viewModel);

}());