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

## WebVTT implementation

Working features:

* Track kinds:
	* subtitles
	* chapters
* Text position (T:...%)
* Text alignment (A:start|middle|end)
* Text size (S:...%)
* Vertical text (incompatible with other cue settings)
* Line position
* Class tags
* Cue timestamps tags

Note on cue timestamps:

	00:00:17,556 --> 00:00:20,631
	Can you hear it?
	<00:00:18,556>The noise, <00:00:19,600>the drumbeat?
	
::cue:past & ::cue:future are remplaced with the CSS classes playr_cue_past & playr_cue_future.
They're not defined by default. Customize them as you wish.

## Demos

See demos [on the project page](http://www.delphiki.com/html5/playr/).
