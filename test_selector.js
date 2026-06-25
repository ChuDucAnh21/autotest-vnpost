const fs = require('fs');
const html = fs.readFileSync('full_body.html', 'utf8');

const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;

const searchInputs = document.querySelectorAll('input[placeholder="Tìm kiếm"]');
console.log("Found search inputs:", searchInputs.length);

if (searchInputs.length > 0) {
    const input = searchInputs[searchInputs.length - 1];
    let parent = input.parentElement;
    while (parent && !parent.className.includes('px-3')) {
        parent = parent.parentElement;
    }
    
    console.log("Search container class:", parent?.className);
    
    if (parent) {
        const listContainer = parent.nextElementSibling;
        console.log("List container class:", listContainer?.className);
        
        if (listContainer) {
            const checkboxes = listContainer.querySelectorAll('.ant-checkbox-inner, .ant-tree-checkbox-inner');
            console.log("Found checkboxes inside list container:", checkboxes.length);
        }
    }
}
