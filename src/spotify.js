function revealSpotifyPlayer(spinner, player) {
    spinner?.classList.add('hidden');
    player?.classList.add('animate-spotify-fade-in');
}

export function setupSpotify({ player, spinner }) {
    if (!player) return;

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const spotifyUrl = player.dataset.spotifyUrl;
        if (!spotifyUrl) return;

        IFrameAPI.createController(player, {
            url: spotifyUrl,
            width: '100%',
            height: '152',
            theme: 'dark'
        }, controller => {
            controller.addListener('ready', () => revealSpotifyPlayer(spinner, player));
        });
    };
}
