App.onLaunch = function (options) {
    navigationDocument.pushDocument(getDocument());
};
function getDocument() {
    var parser = new DOMParser();
    var templateString = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n    <document>\n    </document>";
    return parser.parseFromString(templateString, 'application/xml');
}
