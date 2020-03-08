import { firstOrDefaultValue, firstOrDefaultContent } from "./kontent-parsing.js";


const snippetTypes = {
	"media_embed": { "property": "media_item__text.value", "tag": "div", "format": "html", "classname": "" },
	"code_snippet": { "property": "code", "tag": "pre", "format": "text", "classname": "" },
	"aside_note": { "property": "note_text", "tag": "aside", "format": "html", "classname": "" },
	"quotation": { "property": "quote", "tag": "blockquote", "format": "html", "classname": "quotation" }
};
export function processContentSnippets(blogSummary, data) {
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (data[key].system.type in snippetTypes) {
				parseContentSnippet(blogSummary, data, key);
			}
		}
	}
}
function parseContentSnippet(blogSummary, data, key) {
	const typeCode = data[key].system.type;
	const snippetType = snippetTypes[typeCode];
	const objSnippet = blogSummary.querySelector("[data-codename='" + key + "']");
	if (objSnippet !== null) {
		const elementSnippet = document.createElement(snippetType.tag);
		if (!elementSnippet) return;
		const snippetContent = firstOrDefaultValue(data[key], snippetType.property) || "";
		setElementContent(elementSnippet, snippetType, snippetContent);
		setElementClass(elementSnippet, snippetType);
		setElementOptions(elementSnippet, data, key);
		loadElementSnippet(elementSnippet, objSnippet);
	}
}
function setElementContent(elementSnippet, snippetType, snippetContent) {
	if (snippetType.format === "text") elementSnippet.textContent = snippetContent;
	else elementSnippet.innerHTML = snippetContent;
}
function setElementClass(elementSnippet, snippetType) {
	if (snippetType.classname) elementSnippet.classList.add(snippetType.classname);
}
function setElementOptions(elementSnippet, data, key) {
	tryProcessAsideNote(elementSnippet, data, key);
	tryProcessQuotation(elementSnippet, data, key);
}
function tryProcessAsideNote(elementSnippet, data, key) {
	const asideStyle = firstOrDefaultValue(data[key], "note_style");
	if (asideStyle) elementSnippet.classList.add("aside-" + asideStyle.codename);
}
function tryProcessQuotation(elementSnippet, data, key) {
	const quoteReference = firstOrDefaultValue(data[key], "reference");
	if (quoteReference) {
		var elementReference = document.createElement('footer');
		elementReference.innerHTML = quoteReference;
		elementReference.classList.add("quote-reference");
		elementSnippet.appendChild(elementReference);
	}
}
function loadElementSnippet(elementSnippet, objSnippet) {
	objSnippet.parentNode.replaceChild(elementSnippet, objSnippet);
}