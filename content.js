// ==UserScript==
// @name          MusicBrainz/AcoustID integration
// @description   Display AcoustID data on MusicBrainz
// @include       http://musicbrainz.org/recording/*/puids
// ==/UserScript==

function injected() {
	var match = window.location.href.match(/recording\/(.*)\/puids/);
	$.getJSON("http://api.acoustid.org/v2/track/list_by_mbid?format=jsonp&jsoncallback=?",
		{ 'mbid': match[1] },
		function(json) {
			$('#content').append('<h2>Associated AcoustID tracks</h2>');
			if (json.tracks.length) {
				var tbl = $('<table class="tbl"><thead><tr><th>AcoustID</th></tr></thead><tbody></tbody></table>');
				for (var i = 0; i < json.tracks.length; i++) {
					var row = $('<tr><td><code><a></a></code></td></tr>');
					var link = row.find('a');
					link.attr('href', 'http://acoustid.org/track/' + json.tracks[i].id);
					link.text(json.tracks[i].id);
					tbl.find('tbody').append(row);
				}
				$('#content').append(tbl);
			}
			else {
				$('#content').append('<p>This recording does not have any associated AcoustID tracks</p>');
			}
		}
	);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ injected +')();'));
document.body.appendChild(script);

