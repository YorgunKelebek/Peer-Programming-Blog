const promiseDOMContent = new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));

export async function DOMContentLoaded() {
    await promiseDOMContent;
}