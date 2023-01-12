var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function instantiateTHEOplayer(playerID, configuration) {
    var element = getActiveDocument().createElement('div');
    THEOplayer.ChromelessPlayer(element, __assign({ uid: playerID }, JSON.parse(configuration)));
}
function loadTHEOplayerScript(path, playerID, configuration) {
    evaluateScripts([path], function (success) {
        if (success) {
            instantiateTHEOplayer(playerID, configuration);
            theoplayerScriptLoaded(playerID);
        }
    });
}
