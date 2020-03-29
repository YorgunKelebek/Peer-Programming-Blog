export default function(content) {

    const buffer = document.createRange();
    return buffer.createContextualFragment(content);

}