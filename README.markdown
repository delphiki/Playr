# Playr: yet another HTML5 <video> player

## Compatibility

* Opera
* Chrome / Safari
* Firefox (except volume control: range type inputs not supported) 

## Features

* Easy integration
* Multiple SubRip / WebSRT tracks support
* Fullscreen not working yet
* No Flash fallback yet

## Usage

Configure your images directory in the playr.js file.

Just add the class name "playr_video" to your video tag:
`<video src="myVideo.ext" class="playr_video">
	<track kind="subtitles" srclang="en" src="mySubs.srt"></track> // optional
</video>`

If you want to use tracks, don't forget the "srclang" attribute.

## Demos

See demos [on the project page](http://www.delphiki.com/html5/playr/).
