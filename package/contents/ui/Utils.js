.pragma library

// Since Plasma 6.8, Kicker favorite ids carry an "applications:" scheme
// (e.g. "applications:steam.desktop"). Older versions / this applet's saved
// tiles use the bare id (e.g. "steam.desktop"). Normalize both to the bare
// id so they are comparable regardless of which form is present.
function normAppId(id) {
	if (typeof id !== 'string') {
		return id
	}
	if (id.indexOf('applications:') === 0) {
		id = id.substr('applications:'.length)
	}
	return id
}

function parseDropUrl(url) {
	var startsWithAppsScheme = url.indexOf('applications:') === 0 // Search Results add this prefix
	if (startsWithAppsScheme) {
		// console.log('parseDropUrl', 'startsWithAppsScheme', url)
		url = url.substr('applications:'.length)
	}

	var workingDir = Qt.resolvedUrl('.')
	var endsWithDesktop = url.indexOf('.desktop') === url.length - '.desktop'.length
	var isRelativeDesktopUrl = endsWithDesktop && (
		url.indexOf(workingDir) === 0
		// || url.indexOf('file:///usr/share/applications/') === 0
		// || url.indexOf('/.local/share/applications/') >= 0
		|| url.indexOf('/share/applications/') >= 0 // 99% certain this desktop file should be accessed relatively.
	)
	// console.log('parseDropUrl', workingDir, endsWithDesktop, isRelativeDesktopUrl)
	// console.log('onUrlDropped', 'url', url)
	if (isRelativeDesktopUrl) {
		// Remove the path because .favoriteId is just the file name.
		// However passing the favoriteId in mimeData.url will prefix the current QML path because it's a QUrl.
		var tokens = url.toString().split('/')
		var favoriteId = tokens[tokens.length-1]
		// console.log('isRelativeDesktopUrl', tokens, favoriteId)
		return favoriteId
	} else {
		return url
	}
}
