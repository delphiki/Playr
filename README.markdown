# Playr: yet another HTML5 &lt;video&gt; player

## Compatibility

* Opera
* Chrome / -Safari-
* Firefox

## Features

* Easy integration
* Multiple [SubRip](http://en.wikipedia.org/wiki/SubRip) / [WebVTT](http://www.delphiki.com/webvtt/) tracks support

## Notes on local testing

Some browsers disable XMLHttpRequest on local files by default.

* Opera: enable opera:config#UserPrefs|AllowFileXMLHttpRequest
* Chrome: launch it with --allow-file-access-from-files

## Usage

Configure your images directory in the playr.js file.

Just add the class name "playr_video" to your video tag:

	<video src="myVideo.ext" class="playr_video">
		<track kind="subtitles" label="English Subtitles" srclang="en" src="mySubs.srt" /> // optional
	</video>

## Demos

See demos [on the project page](http://www.delphiki.com/html5/playr/).
