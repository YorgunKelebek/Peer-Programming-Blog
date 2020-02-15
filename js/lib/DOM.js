export async function DOMContentLoaded() {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
}