function setupPictureInPicture(player, isNativePip) {
    var errorMessage = 'THEOplayer PiP. Something went wrong while communicating with the native app. Error: ';
    var baseButton = THEOplayer.videojs.getComponent('Button');
    // Create a PiP button for the control bar
    var pipButton = THEOplayer.videojs.extend(baseButton, {
        constructor: function () {
            var _this = this;
            baseButton.apply(this, arguments);
            this.controlText('Picture In Picture');
            if (isNativePip && player.ads) {
                player.ads.addEventListener('adbreakbegin', function () {
                    _this.disablePipButton();
                });
                player.ads.addEventListener('adbreakend', function () {
                    _this.enablePipButton();
                });
            }
        },
        enablePipButton: function () {
            this.enable();
        },
        disablePipButton: function () {
            this.disable();
        },
        handleClick: function () {
            try {
                webkit.messageHandlers.THEOPiP.postMessage('pip');
            }
            catch (e) {
                console.log(errorMessage + e);
            }
        },
        buildCSSClass: function () {
            return 'vjs-icon-picture-in-picture-enter theo-controlbar-button vjs-control vjs-button';
        },
        dispose: function () {
            if (isNativePip && player.ads) {
                player.ads.removeEventListener('adbreakbegin', this.disablePipButton);
                player.ads.removeEventListener('adbreakend', this.enablePipButton);
            }
            baseButton.prototype.dispose.call(this);
        }
    });
    THEOplayer.videojs.registerComponent('pipButton', pipButton);
    player.ui.getChild('controlBar').addChild('pipButton', {});
    // Create a custom fullscreen button for PiP
    var pipFullscreenButton = THEOplayer.videojs.extend(baseButton, {
        constructor: function () {
            baseButton.apply(this, arguments);
            this.controlText('Fullsreen');
        },
        handleClick: function () {
            try {
                webkit.messageHandlers.THEOPiP.postMessage('fullscreen');
                player.presentationMode = 'fullscreen';
            }
            catch (e) {
                console.log(errorMessage + e);
            }
        },
        buildCSSClass: function () {
            return 'theo-ios-sdk-pip-fullscreen theo-controlbar-button vjs-fullscreen-control vjs-control vjs-button';
        }
    });
    THEOplayer.videojs.registerComponent('pipFullscreenButton', pipFullscreenButton);
    player.ui.getChild('controlBar').addChild('pipFullscreenButton', {});
}
