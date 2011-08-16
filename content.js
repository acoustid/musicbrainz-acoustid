// ==UserScript==
// @name          MusicBrainz/AcoustID integration
// @description   Display AcoustID data on MusicBrainz
// @include       http://musicbrainz.org/recording/*/puids
// @include       http://musicbrainz.org/puid/*
// ==/UserScript==

function injected() {

	function buildAcoustidTable(tracks) {
		var tbl = $('<table class="tbl"><thead><tr><th>AcoustID</th></tr></thead><tbody></tbody></table>');
		for (var i = 0; i < tracks.length; i++) {
			var row = $('<tr><td><code><a></a></code></td></tr>');
			var link = row.find('a');
			link.attr('href', 'http://acoustid.org/track/' + tracks[i].id);
			link.text(tracks[i].id);
			tbl.find('tbody').append(row);
		}
		return tbl;
	}

	function updateRecordingPUIDsPage(mbid) {
		$.getJSON("http://api.acoustid.org/v2/track/list_by_mbid?format=jsonp&jsoncallback=?",
			{ 'mbid': mbid },
			function(json) {
				$('#content').append('<h2>Associated AcoustID tracks</h2>');
				if (json.tracks.length) {
					$('#content').append(buildAcoustidTable(json.tracks));
				}
				else {
					$('#content').append('<p>This recording does not have any associated AcoustID tracks</p>');
				}
			}
		);
	}

	function updatePUIDPage(puid) {
		$.getJSON("http://api.acoustid.org/v2/track/list_by_puid?format=jsonp&jsoncallback=?",
			{ 'puid': puid },
			function(json) {
				$('#page').append('<h2>Associated with AcoustID tracks</h2>');
				if (json.tracks.length) {
					$('#page').append(buildAcoustidTable(json.tracks));
				}
				else {
					$('#page').append('<p>This PUID does not have any associated AcoustID tracks</p>');
				}
			}
		);
	}

	var match = window.location.href.match(/recording\/([A-Fa-f0-9-]+)\/puids/);
	if (match) {
		updateRecordingPUIDsPage(match[1]);
	}
	else {
		var match = window.location.href.match(/puid\/([A-Fa-f0-9-]+)/);
		if (match) {
			updatePUIDPage(match[1]);
		}
	}

}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ injected +')();'));
document.body.appendChild(script);

