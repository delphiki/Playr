/**
 * Playr
 *
 * @author Julien 'delphiki' Villetorte <gdelphiki@gmail.com>
 * http://twitter.com/delphiki
 * http://www.delphiki.com/html5/playr
 */

/**
 * The Playr object
 * @constructor
 * @param {Integer} v_id A video id
 * @param {DOMElement} v_el The video node
 */
function Playr(v_id, v_el){
	this.config = {
		fontSize: '12pt',
		customFontSize: '12pt',
		defaultVolume: 0.75, 
		skipStep: 5, // fast-forward
		volumeStep: 0.1,
		subsDelayStep: 0.5,
	};

	this.base64images = {
		fullscreen_control: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ3bsYwAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAPklEQVQoU7VPSQoAQAiy/z+6UhJmu46X1IIUQaQgCit7iJy9brIvOAbkNOyIwlvPP8b19hHsjL5oFu62e/0CFqTLaX136gAAAAAASUVORK5CYII=',
		pause_control:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGeYUxB9wAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAUggAARVYAAA6lwAAF2/XWh+QAAACgklEQVR42lyR22pbRxSGv5nZZ21H2kqxIrdur+JQ0ppepPEjhIS0F3Gfpn2Y4pbSF+gDlARKIL02hIJTCsanOKmsw97aM7OmF5LlqAsGBr41//rXPyqEwOMnTz978PWDfRExCsVoNGoODn78dTIev7390SZ7e3t3H+49/LZpGq21Vm8vLiY//3Twy3Q6HUUAu7tfPvpuf/+HWV0rEUEk2Jcv/3jz56tXv03GV9y7t/PN/rNn34+urlQIgdba5sWL54fA7xrg7s7Obrfb65dlWRVFp9ocDDY//mR7F6BpagaDwVfdXtXf2Nioik6nunNnOBwOtz4HiBZNTTurZ9R1g/celMLa1rKsZj5v6w+4SMA661YC3nusdVjn8N4TOUeQcP0eEaFt7YprYyAs+FJAsNZinUWWdwk3At57rLM4Z/FeMMYgywEawIvHOodbHvlg+rWDBfNLLiumryc45/DOE4A4jtBK3TgQobUW5xxKKZIkQWu1voKXhbUoMvy/JpMpR3//Q9s0pGmK0nrFIgAFJHGMbVsu370nzeq1DMQL3jkkLPKZzWarNSMAbTTT6ZTziwuMiej3CyJz40QbTZalRMaQJDFlWWKWPAJoW8vVeEye52RpxkZZYsyNTRNp8izHx44sTdd4BGCMpuyUaA1ZltO9dWsti9jEdDoF4j15vuBrDsqyjHu9LlorOkXB7aoiidPoWqDI87jqdhEROkVBv+oRx7FZfeNfr18fpUni8jSVyBh5P/rXHh8fHwNorTk/PztKksRlWSJRZOTy8t389OT0FECFEFBKxdvbn36htYoXmbT25OTkEJgrpTDGpMOtrftaKQNKNU09Pzs7Owwh2P8GAAruVo9cZ9KlAAAAAElFTkSuQmCC',
		play_control:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUklEQVR42mNkAAIOTk4mTU0tdXsHB5sF8+ct//D+/RcGIgEjiFBT1xDz8vJOjImNqezu6qpctXLFjP9AQLQBAUHBup6enmUe7h4x33/8YNixY/v27q7OnKdPntwjygBvX18tV1e3Umdnl4RPnz4BvcTB8Orlq/fTpk2p2Lxx4yyCBnj5+Gk5OTuVOjg4Jnz+/Inh9+8/QBlGBjZWVoajR45snzZlcs7Tp9hdAzbAw9tHy9HRsdTWxi7h0+fPDH/+/mH4/+8fAyMTEwM/Pz/Dl8+f38+YPrVi4/r1s7Ab4OWjZWdnV2ppbZ3w5QskAliYmRlYWFjAmJubm4GPl5dh794929paWkCuuY9igLuHl5aNrW2phZVVwq+fPxlYgU6HY6ABbOxsDBzs7AxioqIMHz58+BQcHOR/4fz5A3AD3KAG2DvYJ/z+BfQ/w3+4F9jYWBm4ODnBrhAVEWEAWRAQ4B9x6tSpDUCFPyEu8PTWsre3L7WysUn48P4DSDvYRm4uLgYeoEYBAX4GPj4+hj179lytqqosuHf37h6MQLS0tCo1MjZJ+P//HwMPUCPIRh4ebgYRYWGGjx8//u7o6JgKTKVN//79e48RiJ7evlrWNjaltra2CUxMjGBb+YE2gmIAZGt1VWXhnTt3duNPB05OpW5ubgnMQH+LiAgzfPr48U87xNZGdFuxJOUQHU9Pj/KAgIAYUPQBo+tqVSVuWzEMUFJWlgoODslKT0+v7uzsmDx37tz6f3//viekGW4ACLCzs3Pz8vLKvHnz5jaQ+48YzSAAAGPF5xGsLhIBAAAAAElFTkSuQmCC',
		sound_control:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH0SURBVDjLxdPPS9tgGAfwgH/ATmPD0w5jMFa3IXOMFImsOKnbmCUTacW1WZM2Mf1ho6OBrohkIdJfWm9aLKhM6GF4Lz3No/+AMC/PYQXBXL1+95oxh1jGhsgOX/LywvN5n/fN+3IAuKuEuzagVFoO27b1/Z+BcrnUx4otx7FPLWsJvYpIM2SS9H4PqNWqfK1W8VKplHlW/G1zs4G9vS9YXPx4CaDkXOFES4Om4gceUK2WsbZWR72+gtXVFezsbKHVamF7ewtm/sMFgBJZhd6pvm4kDndaAo2KOmt5Gfv7X9HpdNBut9FsNmFZFgPrMHKZc4DkjHyi6KC3MZNehTOuGAH5Xx5ybK/Y3f0Mx3Fg2zaKxSIMw2DjT0inNQ84nogcUUQJHIfZquNT3hzx46DBALizg2o01qEoCqLRKERRRDAYhKYlWRK/AJdCMwH2BY28+Qk8fg667wdXKJjY2FiHaeaRzWYQCk1AEASGzSCZjP/ewtik5r6eBD0dM+nRSMb1j4LuPDnkFhZymJ/PsmLdazmV0jxEkqKsK+niIQ69mKUBwdd9OAx3SADdHtC53FyK12dVXlVlPpF4zytK7OgMyucNyHLs8m+8+2zJHRwG3fId9LxIbNU+OR6zWU57AR5y84FKN+71//EqM2iapfv/HtPf5gcdtKR8VW88PgAAAABJRU5ErkJggg==',
		mute_control:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFsSURBVDjLxZO/SwJhHMYF16b+gP6GZiehwcm7hBORKLXzPT1SIhMUHCKO48TT88emhwchHTiEERQhTrlE1FIhQS1BGRTU5vr0ntgS6BFBDR94eeH5fPk+L68DgOM3OP5MUCjkg7IsPf9YoKoFJw1LiiKPJGkX7wyToCxMFWhayaVpxTHFouqi4ftmU0enc4CTGLEE15T5qYJSSUWtVkW1WkalUkartYd2u43zbBZPPp8lMGeuoKp59Ptn6PV66Ha7MAwDp6KIIcfh1u+3BHMzBXRXmOY+FEWBLMs4FoTx5LtgENuJOGxLtIrS9ToIITADATwyDC69XmzGBYiiYC/I5bJoNOo44vnx5CuWgcftRii0iliMtxek01s4jIRoeBk3dO/URhw+eo7QO0Ii9oIBx+lvLPvxwrKDnfW1JULCD8mkiEwmhWg0PFtAG16kvFIuvtqmU51RPixTRraCicTz/akmohXK8P8+0zQ+AXBHwZp9sfnqAAAAAElFTkSuQmCC'
	}

	this.nativeTrackSupport = 'track' in document.createElement('track');
	this.setupStarted       = false;
	this.ready              = false;
	this.video_id           = v_id;
	this.video              = v_el;
	this.timecode_refresh   = false;
	this.captions_refresh   = false;
	this.isFullscreen       = false;
	this.isTrueFullscreen   = false;
	this.isHoldingTime      = false;
	this.isHoldingVolume    = false;
	this.focusedElem        = null;
	this.fsStyle            = null;
	this.fsVideoStyle       = null;
	this.track_tags         = [];
	this.current_track      = -1;
	this.subs               = [];
	this.chapters           = [];
	this.subtitlesDelay     = 0;
		
	if(typeof Playr.initialized == "undefined"){
		
		Playr.prototype.init = function(){
			if(this.ready || this.setupStarted) return;

			this.setupStarted = true;
			
			var w = this.video.offsetWidth;
			var h = this.video.offsetHeight;
			
			var wrapper = document.createElement('div');
			var newAttr = document.createAttribute('class');
			newAttr.nodeValue = 'playr_wrapper';
			wrapper.setAttributeNode(newAttr);
			var newAttr = document.createAttribute('id');
			newAttr.nodeValue = 'playr_wrapper_'+this.video_id;
			wrapper.setAttributeNode(newAttr);
			var newAttr = document.createAttribute('tabindex');
			newAttr.nodeValue = '0';
			wrapper.setAttributeNode(newAttr);

			var newAttr = document.createAttribute('id');
			newAttr.nodeValue = 'playr_video_'+this.video_id;
			this.video.setAttributeNode(newAttr);
			this.video.removeAttribute('controls');

			var template = '<div class="playr_captions_wrapper" id="playr_captions_wrapper_'+this.video_id+'">'
				+'<div class="playr_top_overlay" id="playr_top_overlay_'+this.video_id+'"><a href="http://www.delphiki.com/html5/playr/">Playr</a></div>'
				+'<div class="playr_video_container" id="playr_video_container_'+this.video_id+'"></div>'
				+'<div class="playr_captions" id="playr_captions_'+this.video_id+'"></div>'
				+'</div>'
				+'<ul class="playr_controls" id="playr_controls_'+this.video_id+'" role="menubar">'
				+'<li><button class="playr_play_btn" id="playr_play_btn_'+this.video_id+'" tabindex="0"><img src="'+this.base64images.play_control+'" id="playr_play_img_'+this.video_id+'" alt="play" /></button></li>'
				+'<li>'
					+'<div class="playr_timebar" id="playr_timebar_'+this.video_id+'" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0">'
						+'<div class="playr_timebar_buffer" id="playr_timebar_buffer_'+this.video_id+'"></div>'
						+'<div class="playr_timebar_inner" id="playr_timebar_inner_'+this.video_id+'">'
							+'<div class="playr_timebar_pos"></div>'
						+'</div>'
					+'</div>'
					+'<span class="playr_timebar_notice" id="playr_timebar_notice_'+this.video_id+'">00:00</span>'
				+'</li>'
				+'<li><span id="playr_video_curpos_'+this.video_id+'" role="timer">00:00</span> / <span id="playr_video_duration_'+this.video_id+'">00:00</span></li>'
				+'<li><button class="playr_mute_btn" id="playr_mute_btn_'+this.video_id+'" tabindex="0"><img src="'+this.base64images.sound_control+'" class="playr_mute_icon" id="playr_mute_icon_'+this.video_id+'" alt="mute" /></button>'
					+'<div class="playr_volume_ctrl" id="playr_volume_ctrl_'+this.video_id+'" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="'+this.config.defaultVolume+'" tabindex="0">'
						+'<div class="playr_volumebar" id="playr_volumebar_'+this.video_id+'"><div class="playr_volumebar_inner" id="playr_volumebar_inner_'+this.video_id+'"><div class="playr_volumebar_pos"></div></div></div>'
					+'</div>'
				+'</li>'
				+'<li><button class="playr_captions_btn" id="playr_captions_btn_'+this.video_id+'" tabindex="0">Menu</button>'
					+'<ul class="playr_cc_tracks" id="playr_cc_tracks_'+this.video_id+'">'
						+'<li class="playr_menu_title">Subtitles &amp; Captions</li>'
						+'<li class="playr_subtitles_item" id="playr_cc_track_'+this.video_id+'_none">'
							+'<label for="playr_current_cc_'+this.video_id+'_none">'
							+'<input type="radio" name="playr_current_cc_'+this.video_id+'" id="playr_current_cc_'+this.video_id+'_none" value="-1" />'
							+' None</label>'
						+'</li>'
					+'</ul>'
				+'</li>'
				+'<li><button class="playr_fullscreen_btn" id="playr_fullscreen_btn_'+this.video_id+'" tabindex="0"><img src="'+this.base64images.fullscreen_control+'" alt="fullscreen" /></button></li>'
				+'</ul>';
			wrapper.innerHTML = template;

			this.video.parentNode.insertBefore(wrapper,this.video);
			document.getElementById('playr_video_container_'+this.video_id).appendChild(this.video);
			document.getElementById('playr_video_container_'+this.video_id).style.height = h+'px';
			document.getElementById('playr_wrapper_'+this.video_id).style.width = w+'px';

			this.video.volume = this.config.defaultVolume;
			this.initEventListeners();

			var attr = this.video.attributes;
			for (var i=0; i<attr.length; i++){
				// autoplay fix
				if(attr.item(i).nodeName == 'autoplay')
					this.play();

				// disable native support
				if(attr.item(i).nodeName == 'data-rendering' && attr.item(i).nodeValue == 'playr')
					this.setNativeTrackSupport(false);
			}

			this.loadTrackTags();
			this.ready = true;
		};
		
		Playr.prototype.setNativeTrackSupport = function(nativeSupport){
			this.nativeTrackSupport = nativeSupport;

			if(!this.nativeTrackSupport)
				this.disableNativeTextTracks();
		}

		/**
		 * Inits most the the event listeners
		 */		
		Playr.prototype.initEventListeners = function(){
			var that = this;
			
			// video events
			this.video.addEventListener('click', function(){ that.play(); return false; }, false);
			this.video.addEventListener('timeupdate', function(){ that.timeCode(); that.displayCaptions(); }, false);
			this.video.addEventListener('ended', function(){ that.eventEnded(); }, false);
			this.video.addEventListener('play', function(){ that.playEvent(); }, false);
			this.video.addEventListener('pause', function(){ that.playEvent(); }, false);
			this.video.addEventListener('volumechange', function(){ that.volumeChangedEvent(); }, false);
			this.video.addEventListener('progress', function(){ that.progressEvent(); }, false);
			
			// true fullscreen
			document.addEventListener("mozfullscreenchange",function(){ if(!document.mozFullScreen && that.isTrueFullscreen){that.fullscreen();} }, false);
			document.addEventListener("webkitfullscreenchange",function(){ if(!document.webkitIsFullScreen && that.isTrueFullscreen){that.fullscreen();} }, false);

			document.getElementById('playr_play_btn_'+this.video_id).addEventListener('click', function(){ that.play(); }, false);
			
			// timebar events
			document.getElementById('playr_timebar_'+this.video_id).addEventListener('mousedown', function(){ that.isHoldingTime = true; }, false);
			document.getElementById('playr_timebar_'+this.video_id).addEventListener('mouseup', function(e){ that.isHoldingTime = false; that.setPosition(e, true); }, false);
			document.getElementById('playr_timebar_'+this.video_id).parentNode.addEventListener('mousemove', function(e){ that.noticeTimecode(e); if(that.isHoldingTime){that.setPosition(e, false);}; }, false);
			
			// volume control events
			document.getElementById('playr_volumebar_'+this.video_id).addEventListener('mousedown', function(){ that.isHoldingVolume = true; }, false);
			document.getElementById('playr_volumebar_'+this.video_id).addEventListener('mouseup', function(e){ that.isHoldingVolume = false; that.setVolume(e); }, false);
			document.getElementById('playr_volumebar_'+this.video_id).addEventListener('mousemove', function(e){ if(that.isHoldingVolume){that.setVolume(e);}; }, false);
			document.getElementById('playr_mute_btn_'+this.video_id).addEventListener('click', function(){ that.toggleMute(); }, false);
			
			document.getElementById('playr_fullscreen_btn_'+this.video_id).addEventListener('click', function(){ that.fullscreen(); }, false);
			
			// focus handling
			document.getElementById('playr_wrapper_'+this.video_id).addEventListener('focus', function(){ that.focusedElem = 'playr'; }, false);
			document.getElementById('playr_play_btn_'+this.video_id).addEventListener('focus', function(){ that.focusedElem = 'play_btn'; }, false);
			document.getElementById('playr_timebar_'+this.video_id).addEventListener('focus', function(){ that.focusedElem = 'timebar'; }, false);

			document.addEventListener('keydown', function(e){ that.keyboard(e); }, false);
			document.addEventListener('mousewheel', function(e){ that.scrollHandler(e); }, false);
			document.addEventListener('DOMMouseScroll', function(e){ that.scrollHandler(e); }, false); // Firefox
			window.addEventListener('resize', function(e){ if(that.isFullscreen && !that.isTrueFullscreen) that.updateFullscreen(); }, false);
		}
			
		/**
		 * Toggle play / pause (+ change the play button icon) 
		 * @return false to prevent default
		 */		
		Playr.prototype.play = function(){
			if(this.video.paused){
				this.video.play();
			}
			else{
				this.video.pause();
			}
			return false;
		};
		
		/**
		 * Called when 'play' or 'pause' events are fired
		 */
		Playr.prototype.playEvent = function(){
			if(this.video.paused){
				document.getElementById('playr_play_img_'+this.video_id).src = this.base64images.play_control;
				document.getElementById('playr_play_img_'+this.video_id).alt = 'play';
			}
			else{
				document.getElementById('playr_play_img_'+this.video_id).src = this.base64images.pause_control;
				document.getElementById('playr_play_img_'+this.video_id).alt = 'pause';
			}
		}
		
		/**
		 * Toggle Mute (+ changes the mute icon)
		 * @return false to prevent default
		 */
		Playr.prototype.toggleMute = function(){
			if(!this.video.muted){
				this.video.muted = true;
			}
			else{
				this.video.muted = false;
			}
			return false;
		};
		
		/**
		 * Set the volume (0 < V < 1)
		 * @param {Event} ev The click event
		 */
		Playr.prototype.setVolume = function(ev){
			var volumebar = document.getElementById('playr_volumebar_'+this.video_id);
			var pos = this.findPos(volumebar);
			var diffy = ev.pageY - pos.y;
			var curVol = 100 - Math.round(diffy * 100 / volumebar.offsetHeight);
			if(curVol <= 100){
				document.getElementById('playr_volumebar_inner_'+this.video_id).style.height = curVol.toString()+'%';
				this.video.volume = curVol / 100;
				document.getElementById('playr_volume_ctrl_'+this.video_id).setAttribute('aria-valuenow', curVol / 100);
			}
		};
		
		/**
		 * Called when 'volumechanged' event is fired
		 */
		Playr.prototype.volumeChangedEvent = function(){
			if(this.video.volume <= 1){
				document.getElementById('playr_volumebar_inner_'+this.video_id).style.height = (this.video.volume * 100).toString()+'%';
			}
			
			if(this.video.muted){
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.base64images.mute_control;
				document.getElementById('playr_mute_icon_'+this.video_id).alt = 'unmute';
			}
			else{
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.base64images.sound_control;
				document.getElementById('playr_mute_icon_'+this.video_id).alt = 'mute';
			}
		};
		
		/**
		 * Display the current time code of the video
		 */		
		Playr.prototype.timeCode = function(){
			document.getElementById('playr_timebar_'+this.video_id).setAttribute('aria-valuemax', Math.round(this.video.duration * 100) / 100);
			document.getElementById('playr_timebar_'+this.video_id).setAttribute('aria-valuenow', this.video.currentTime);

			document.getElementById('playr_video_curpos_'+this.video_id).innerHTML = this.parseTimeCode(this.video.currentTime);
				
			if(!isNaN(this.video.duration) && document.getElementById('playr_video_duration_'+this.video_id).innerHTML == '00:00'){
				document.getElementById('playr_video_duration_'+this.video_id).innerHTML = this.parseTimeCode(this.video.duration);
			}
			if(!this.isHoldingTime){
				document.getElementById('playr_timebar_inner_'+this.video_id).style.width = this.video.currentTime * 100 / this.video.duration + '%' ;
			}
		};
		
		/**
		 * Convert seconds to MM:SS
		 * @param {Integer} nb_sec A number of seconds
		 * @return A time code string
		 */
		Playr.prototype.parseTimeCode = function(nb_sec){
			nb_sec = Math.floor(nb_sec);
			var nb_min = 0;
			while(nb_sec - 60  > 0){
				nb_sec = nb_sec - 60;
				nb_min++;
			}
			var sec = nb_sec.toString();
			if(sec.length==1){
				sec = '0'+sec;
			}
			var min = nb_min.toString();
			if(min.length==1){
				min = '0'+min;
			}	
			return min+':'+sec;
		};
		
		/**
		 * Find the global coordinates of the mouse
		 * @param {DOMElement} The clicked element
		 * @return A object containing the coordinates
		 */
		Playr.prototype.findPos = function(el){
			var x = y = 0;
			if(el.offsetParent){
				do {
					x += el.offsetLeft;
					y += el.offsetTop;
				}while(el = el.offsetParent);					
			}
			return {x:x,y:y};
		};
		
		/**
		 * Set the current time of the video (by clicking on the timebar)
		 * @param {Event} ev The click event
		 * @param {Boolean} update_cT If true, update the timecode
		 */
		Playr.prototype.setPosition = function(ev, update_cT){
			var timebar = document.getElementById('playr_timebar_'+this.video_id);
			var pos = this.findPos(timebar);
			var diffx = ev.pageX - pos.x;
			var curTime = Math.round(diffx * 100 / timebar.offsetWidth);
			document.getElementById('playr_timebar_inner_'+this.video_id).style.width = curTime.toString()+'%';
			if(update_cT){
				this.video.currentTime = Math.round(curTime * this.video.duration / 100);
			}
		};
		
		/**
		 * Updates the progress bar (buffered video)
		 */
		Playr.prototype.progressEvent = function(){
			if(this.video.buffered.length == 0)
				return;
			
			var that = this;
			var buff = {
				start: that.video.buffered.start(0),
				end:  that.video.buffered.end(0)
			}
			
			if(buff.end == that.video.duration){
				document.getElementById('playr_timebar_buffer_'+this.video_id).style.width = (document.getElementById('playr_timebar_'+this.video_id).offsetWidth - 2)  + 'px';
			}
			else{
				var bar_width = document.getElementById('playr_timebar_'+this.video_id).offsetWidth;
				var cur_width = Math.round((buff.end * bar_width) / this.video.duration);
				document.getElementById('playr_timebar_buffer_'+this.video_id).style.width = cur_width+'px';
			}
		};
		
		/**
		 * Toggle fullscreen
		 * @return false to prevent default
		 */
		Playr.prototype.fullscreen = function(){
			var vids = document.querySelectorAll('.playr_wrapper');
			var wrapper = document.getElementById('playr_wrapper_'+this.video_id);
			var captions = document.getElementById('playr_captions_'+this.video_id);
			
			if(!this.isFullscreen){
				for(i = 0; i<vids.length; i++)
					vids[i].style.visibility = 'hidden';
				wrapper.style.visibility = 'visible';
				
				this.fsStyle = { 
					height: wrapper.style.height, 
					width: wrapper.style.width 
				};
				this.fsVideoStyle = { 
					height: this.video.offsetHeight,
					width: this.video.offsetWidth 
				};
				
				if(wrapper.requestFullscreen){
					this.isTrueFullscreen = true;
					wrapper.requestFullscreen();
				}
				else if(wrapper.mozRequestFullScreen){
					this.isTrueFullscreen = true;
					wrapper.mozRequestFullScreen();
				}
				else if(wrapper.webkitRequestFullScreen){
					this.isTrueFullscreen = true;
					wrapper.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
				}
				
				if(this.isTrueFullscreen){
					console.log('True fullscreen');
					wrapper.style.position = 'fixed';
					wrapper.style.top = 0;
					wrapper.style.left = 0;
					wrapper.style.height = '100%';
					wrapper.style.width = '100%';
					wrapper.style.backgroundColor = '#000000';
					this.video.style.width = '100%';
					this.video.style.height = (screen.height - 30)+'px';
					document.body.style.overflow = 'hidden';
				}
				else{
					console.log('Fake fullscreen');
					wrapper.style.backgroundColor = '#000000';
					wrapper.style.position = 'fixed';
					wrapper.style.top = 0;
					wrapper.style.left = '50%';
					wrapper.style.height =  window.innerHeight+'px';
					wrapper.style.width = window.innerWidth+'px';
					wrapper.style.marginLeft = '-'+Math.round(wrapper.offsetWidth / 2)+'px';
					this.video.style.width = window.innerWidth+'px';
					this.video.style.height = (window.innerHeight - 30)+'px';
					document.body.style.overflow = 'hidden';
				}
				this.isFullscreen = true;
				wrapper.className += (wrapper.className ? ' ' : '')+'playr_is_fullscreen';
			}
			else{
				if(document.cancelFullscreen){
					document.cancelFullscreen();  
				}
				else if(document.exitFullscreen){
					document.exitFullscreen();
				}
				else if(document.mozCancelFullScreen){
					document.mozCancelFullScreen();  
				}
				else if(document.webkitCancelFullScreen){
					document.webkitCancelFullScreen();
				}
				
				for(i = 0; i<vids.length; i++)
					vids[i].style.visibility = 'visible';
				wrapper.style.backgroundColor = 'transparent';
				wrapper.style.position = 'inherit';
				wrapper.style.height = this.fsStyle.height;
				wrapper.style.width = this.fsStyle.width;
				wrapper.style.left = 0;
				wrapper.style.marginLeft = 0;
				this.video.style.height = this.fsVideoStyle.height+'px';
				this.video.style.width = this.fsVideoStyle.width+'px';
				document.body.style.overflow = 'auto';

				this.isTrueFullscreen = false;
				this.isFullscreen = false;
				wrapper.className = wrapper.className.replace(new RegExp('(\\s|^)playr_is_fullscreen(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
				this.progressEvent();
			}
			
			document.getElementById('playr_video_container_'+this.video_id).style.height = this.video.offsetHeight+'px';
			
			return false;
		};
		
		/**
		 * If fullscreen, auto-resize the player when the widow is resized
		 */
		Playr.prototype.updateFullscreen = function(){
			var wrapper = document.getElementById('playr_wrapper_'+this.video_id);
			wrapper.style.height = window.innerHeight+'px';
			wrapper.style.width = window.innerWidth+'px';
			this.video.style.width = window.innerWidth+'px';
			this.video.style.height = (window.innerHeight - 30)+'px';
			wrapper.style.marginLeft = '-'+Math.round(wrapper.offsetWidth / 2)+'px';
			var factor = Math.round((window.innerHeight - 30) / this.fsVideoStyle.height * 100) / 100;
			document.getElementById('playr_captions_'+this.video_id).style.fontSize = factor + 'em';
			document.getElementById('playr_video_container_'+this.video_id).style.height = (window.innerHeight-30)+'px';
		};
		
		/**
		 * Look up for <track>s
		 */
		Playr.prototype.loadTrackTags = function(){
			if(this.nativeTrackSupport){
				for(var i=0; i < this.video.textTracks.length; i++){
					t = this.video.textTracks[i];

					if(t.kind == 'subtitles' || t.kind == 'captions' || t.kind == 'descriptions'){
						if(t.label != null) track_label = t.label;
						else if(t.lang != null) track_label = t.lang;
						else track_label = 'Track '+ (i+1);

						var str = '<li class="playr_subtitles_item">'
								+'<label for="playr_current_cc_'+this.video_id+'_'+i+'">'
								+'<input type="radio" name="playr_current_cc_'+this.video_id+'" id="playr_current_cc_'+this.video_id+'_'+i+'" value="'+i+'" '
									+(t.mode=="showing" ? 'checked="checked"' : '')
								+' /> '
								+track_label
							+'</label></li>';
						document.getElementById('playr_cc_tracks_'+this.video_id).innerHTML += str;

						this.setActiveTrack();
					}
				}
				var track_list = document.querySelectorAll('input[name="playr_current_cc_'+this.video_id+'"]');
				var that = this;
				for(i = 0; i < track_list.length; i++){
					track_list[i].addEventListener('change', function(){
						that.setActiveTrack();
					},false);
				}

				this.setDefaultTrack();
			}
			else{
				this.track_tags = this.video.getElementsByTagName('track');
				for(i = 0; i < this.track_tags.length; i++){
					var newAttr = document.createAttribute('id');
					newAttr.nodeValue = 'playr_track_'+this.video_id+'_'+i;
					this.track_tags[i].setAttributeNode(newAttr);
				}
				if(this.track_tags.length > 0)
					this.loadTrackContent(0);
			}
		};
		
		/**
		 * Get the content of the <track>s' sources (via XMLHttpRequest) and add an entrie to the track menu
		 * @param {DOMElement} track A <track> node
		 */
		Playr.prototype.loadTrackContent = function(track){
			var that = this;
			var curTrack = that.track_tags[track];
			var req_track = new XMLHttpRequest();
			req_track.open('GET', curTrack.getAttribute('src'));
			req_track.onreadystatechange = function(){
				if(req_track.readyState == 4 && (req_track.status == 200 || req_track.status == 0)){
					if(req_track.responseText != ''){
						var kind = curTrack.getAttribute('kind');
						if(kind == null || kind == ''){ kind = 'subtitles'; }

						that.parseTrack(req_track.responseText, kind);
						
						if(kind == 'subtitles' || kind == 'captions' || kind == 'descriptions'){
							var label = curTrack.getAttribute('label');
							var lang = curTrack.getAttribute('srclang');
							if(label != null) track_label = label;
							else if(lang != null) track_label = lang;
							else track_label = 'Track '+ (track + 1);
							var str = '<li class="playr_subtitles_item"><label for="playr_current_cc_'+that.video_id+'_'+track+'">'
									+'<input type="radio" name="playr_current_cc_'+that.video_id+'" id="playr_current_cc_'+that.video_id+'_'+track+'" value="'+track+'" /> '
									+track_label
								+'</label></li>';
							document.getElementById('playr_cc_tracks_'+that.video_id).innerHTML += str;
						}
					}
					track++;
					if(track < that.track_tags.length){
						that.loadTrackContent(track);
					}
					else{
						that.buildChaptersMenu();
						that.setDefaultTrack();
					}
				}
			};
			req_track.send(null);
		};
		
		/**
		 * Set the default track base on srclang <track> attributes and <html> lang attribute
		 */
		Playr.prototype.setDefaultTrack = function(){
			var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
			var track_list = document.querySelectorAll('input[name="playr_current_cc_'+this.video_id+'"]');
			var to_check = 0;
			var that = this;
			track_list[0].addEventListener('change', function(){
				that.setActiveTrack();
			},false);
			
			for(i = 0; i < this.track_tags.length; i++){
				if(this.track_tags[i].getAttribute('kind') == 'subtitles'){
					if(this.track_tags[i].getAttribute('srclang') == lang && to_check == 0){
						to_check = i+1;
					}
					if(this.track_tags[i].hasAttribute('default')){
						to_check = i+1;
					}
					track_list[i+1].addEventListener('change', function(){
						that.setActiveTrack();
					},false);
				}
			}
			if(track_list[to_check])
				track_list[to_check].checked = true;
			else
				track_list[0].checked = true;
			this.setActiveTrack();
		};
		
		/**
		 * Highlights the current track
		 */		
		Playr.prototype.setActiveTrack = function(){
			var track_li = document.querySelectorAll('#playr_cc_tracks_'+this.video_id+' li.playr_subtitles_item');
			var track_inputs = document.querySelectorAll('input[name="playr_current_cc_'+this.video_id+'"]');

			this.disableNativeTextTracks();

			for(i = 0; i < track_inputs.length; i++){
				if(track_inputs[i].checked){
					track_li[i].className = 'playr_subtitles_item active_track';

					if(this.nativeTrackSupport && track_inputs[i].value >= 0){
						this.video.textTracks[track_inputs[i].value].mode = 'showing';
					}
				}
				else{
					track_inputs[i].checked = null;
					track_li[i].className = 'playr_subtitles_item';
				}
			}
		}
			
		/**
		 * Disables native text tracks
		 */
		Playr.prototype.disableNativeTextTracks = function(){
			if(this.nativeTrackSupport){
				for(i = 0; i < this.video.textTracks.length; i++)
					this.video.textTracks[i].mode = 'disabled';
			}
		}

		/** 
		 * Convert MM:SS into seconds
		 * @param {String} timecode A string with the format: MM:SS
		 * @return A number of seconds
		 */
		Playr.prototype.tc2sec = function(timecode){
			var tab = timecode.split(':');
			return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
		};
	
		/**
		 * Parse WebSRT / SubRip subtitles
		 * @param {String} track_content The content of the file
		 * @param {String} track_kind 'subtitles', 'captions'... 
		 * @return An array of cues' objects
		 */
		Playr.prototype.parseTrack = function(track_content, track_kind){
			if(track_kind == 'subtitles' || track_kind == 'captions' || track_kind == 'descriptions'){ var pattern_identifier = /^([0-9]+)$/; }
			else if(track_kind == 'chapters'){ var pattern_identifier = /^chapter-([0-9])+$/; }
			
			var pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3}) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3})(.*)$/;
			var lines = track_content.split(/\r?\n/);
			
			var entries = new Array();
			for(i = 0; i<lines.length; i++) {
				if(identifier = pattern_identifier.exec(lines[i])){
					i++;
					var timecode = pattern_timecode.exec(lines[i])
					if(timecode && i<lines.length){
						i++;
						var text = lines[i];
						i++;
						while(lines[i] != '' && i<lines.length){
							text = text + '\n' + lines[i];
							i++;
						}
						entries.push({
							'identifier': identifier[0],
							'start': this.tc2sec(timecode[1]),
							'stop': this.tc2sec(timecode[2]),
							'start_tc': timecode[1],
							'stop_tc': timecode[2],
							'text': text,
							'settings': timecode[3]
						});
					}
				}
			}

			switch(track_kind){
				case 'chapters':
					this.chapters.push(entries);
					break;
				case 'subtitles':
				case 'captions':
				case 'descriptions':
				default:
					this.subs.push(entries);
					break;
			}
		};
		
		/**
		 * Builds the chapters menu
		 */		
		Playr.prototype.buildChaptersMenu = function(){
			var that = this;
			var track_menu = document.getElementById('playr_cc_tracks_'+this.video_id);
			if(this.chapters.length > 0){
				var tmp = '<li class="playr_chapters_menu_title" id="playr_chapters_menu_title_'+this.video_id+'">Chapters <span style="float:right;">&gt;</span><ul class="playr_chapters_menu">';
				for(i = 0; i < this.chapters[0].length; i++){
					tmp += '<li><a href="#'+this.chapters[0][i].start_tc+'" class="playr_chapter_'+this.video_id+'" id="playr_chapter_'+this.video_id+'_'+i+'">'+this.chapters[0][i].text+'</a> ('+this.chapters[0][i].start_tc.split('.')[0]+')</li>';
				}
				tmp += '</ul></li>'
				track_menu.innerHTML = tmp + track_menu.innerHTML;
			}
			var c = document.querySelectorAll('.playr_chapter_'+this.video_id);
			for(i = 0; i < c.length; i++){
				c[i].addEventListener('click', function(){ that.goToChapter(this); return false; }, false);
			}
		};
		
		/**
		 * Jump to the specified chapter
		 */
		Playr.prototype.goToChapter = function(c){
			var jumpto = c.getAttribute('href').split('#')[1];
			this.video.currentTime = this.tc2sec(jumpto);
			
			return false;
		};
		
		/**
		 * Display the captions on the video (called on timeupdate)
		 */
		Playr.prototype.displayCaptions = function(){
			if(this.nativeTrackSupport) return;

			var captions_div = document.getElementById('playr_captions_'+this.video_id);
			var playr_cc_choices = document.querySelectorAll('input[name="playr_current_cc_'+this.video_id+'"]');
			
			for (var i=0; i < playr_cc_choices.length; i++){
				if(playr_cc_choices[i].checked){
					this.current_track = playr_cc_choices[i].value;
				}
			}
			
			if(this.current_track >= 0){
				for(i=0; i<this.subs[this.current_track].length; i++){
					if((this.video.currentTime + this.subtitlesDelay) >= this.subs[this.current_track][i].start 
						&& (this.video.currentTime + this.subtitlesDelay) <= this.subs[this.current_track][i].stop){

						var text = this.subs[this.current_track][i].text;
						var captions_wrapper = document.getElementById('playr_captions_wrapper_'+this.video_id);
						var wrapper_classes = ['playr_captions_wrapper'];
						var captions_container_classes = ['playr_captions'];
						var captions_container_styles = ['text-align:center'];
						var captions_styles = [];
						var captions_lines_styles = [];
						var captions_words_styles = [];
						var captions_letters_styles = [];
						
						// voice declaration tags
						var voice_declarations = /<v ([^>]+)>/i;
						while(test_vd = voice_declarations.exec(text)){
							text = text.replace(test_vd[0], '<span class="'+test_vd[1].replace(' ', '_')+'">');
						}
						
						// classes tags
						var classes = /<c\.([a-z0-9-_.]+)>/i;
						while(test_classes = classes.exec(text)){
							var classes_str = test_classes[1].replace('.', ' ');
							text = text.replace(test_classes[0], '<span class="'+classes_str+'">');
						}
						text = text.replace(/(<\/v>|<\/c>)/ig, '</span>');
						
						// karaoke (timestamps)
						var timestamps = /<([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3})>/;
						var prefix = false;
						while(test_timestamps = timestamps.exec(text)){
							if(this.tc2sec(test_timestamps[1]) < this.video.currentTime){
								text = text.replace(test_timestamps[0], '</span><span class="playr_cue_past">');
							}
							else{
								text = text.replace(test_timestamps[0], '</span><span class="playr_cue_future">');
							}
							prefix = true;
						}
						if(prefix)
							text = '<span class="playr_cue_past">' + text;
						
						// if cue settings
						if(this.subs[this.current_track][i].settings != ''){
							var text_align = /(A|align):(start|middle|end)/i;
							var text_size = /(S|size):([0-9]{0,3})%/i;
							var text_position = /(T|position):([0-9]{0,3})%/i;
							var vertical_text = /(D|vertical):(vertical-lr|vertical|lr|rl)/i;
							var line_position = /(L|line):(-?[0-9]{0,3})(%?)/i;
							
							var test_ta = text_align.exec(this.subs[this.current_track][i].settings);
							var test_ts = text_size.exec(this.subs[this.current_track][i].settings);
							var test_tp = text_position.exec(this.subs[this.current_track][i].settings);
							var test_vt = vertical_text.exec(this.subs[this.current_track][i].settings);
							var test_lpp = line_position.exec(this.subs[this.current_track][i].settings);
							
							// if text align specified
							if(test_ta){
								if(test_ta[2] == 'start'){ captions_styles.push('text-align:left') }
								else if(test_ta[2] == 'middle'){ captions_styles.push('text-align:center') }
								else if(test_ta[2] == 'end'){ captions_styles.push('text-align:right') }
							}
							
							// if text position specified
							if(test_tp && test_tp[2] >= 0 && test_tp[2] < 50){
								captions_container_styles.push('text-align:left');
								captions_styles.push('margin-left:'+test_tp[1]+'%');
							}
							else if(test_tp && test_tp[2] > 50 && test_tp[2] <= 100){
								captions_container_styles.push('text-align:right');
								captions_styles.push('margin-right:'+(100-test_tp[2])+'%');
							}
							
							// if text size specified
							if(test_ts){ 
								var new_font_size = (test_ts[2]/100) * parseInt(this.config.fontSize);
								captions_styles.push('font-size:'+new_font_size+'pt');
							}
							
							// if vertical text specified
							if(test_vt){
								captions_letters_styles.push('display:block');
								captions_letters_styles.push('min-height:5px');
								captions_letters_styles.push('min-width:1px');
								text = '<span style="'+captions_letters_styles.join(';')+'">'
									+text.split('').join('</span><span style="'+captions_letters_styles.join(';')+'">')
									+'</span>';
								text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1</span><br /><span>$2');

								captions_lines_styles.push('display:block');
								captions_lines_styles.push('padding:5px');
								captions_lines_styles.push('text-align:center');
								if(test_vt[2] == 'vertical-lr' || test_vt[2] == 'lr'){
									captions_lines_styles.push('float:left');
									captions_styles.push('float:left');
								}
								else{
									captions_lines_styles.push('float:right');
									captions_styles.push('float:right');
								}
								
								captions_lines_styles.push('background-color:rgba(0,0,0,0.75)');
								captions_styles.push('background:none');
						
								captions_container_styles.push('top:0');
								
								text = text.replace(/<br \/>/, '</span><span style="'+captions_lines_styles.join(';')+'">');
								text = text.replace(/<span>(\r\n|\n\r|\r|\n)<\/span>/g, '');
							}
							
							// if line position specified
							if(test_lpp && test_lpp[2] >= -100 && test_lpp[2] <= 100){
								if(test_lpp[3] == '%'){
									var side = (test_lpp[2] < 0) ? 'bottom':'top';
									var value = Math.abs(test_lpp[2]);
									captions_container_styles.push(side+':'+value+'%');
								}
							}
						}
						
						if(this.isFullscreen){
							var factor = Math.round((window.innerHeight - 30) / this.fsVideoStyle.height * 100) / 100;
							captions_styles.push('font-size:' + Math.round(parseInt(this.config.fontSize)*factor) + 'pt');
						}
						else{
							
						}
						
						captions_wrapper.setAttribute('class', wrapper_classes.join(' '));
						captions_div.setAttribute('class', captions_container_classes.join(' '));
						captions_div.setAttribute('style', captions_container_styles.join(';'));
						
						if(!test_vt){
							text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1</span><br /><span style="'+captions_lines_styles.join(';')+'">$2');
						}
						captions_div.innerHTML = '<p style="'+captions_styles.join(';')+'">'+'<span style="'+captions_lines_styles.join(';')+'">'+text+'</span>'+'</p>';
						captions_div.style.visibility = 'visible';
						return;
					}
					else{
						captions_div.style.visibility = 'hidden';
					}
				}
			}
			else{
				captions_div.style.visibility = 'hidden';
			}
			return;
		};
		
		/**
		 * Reset the video when the end is reached
		 */
		Playr.prototype.eventEnded = function(){
			this.video.currentTime = 0;
			this.video.pause();
			document.getElementById('playr_play_img_'+this.video_id).src = this.base64images.play_control;
			document.getElementById('playr_play_img_'+this.video_id).alt = 'play';
		};
		
		/**
		 * Display a time code indicator when hovering the timebar
		 * @param {Event} ev The mouseover event
		 */
		Playr.prototype.noticeTimecode = function(ev){
			var timebar = document.getElementById('playr_timebar_'+this.video_id);
			var notice = document.getElementById('playr_timebar_notice_'+this.video_id);
			var pos = this.findPos(timebar);
			var diffx = ev.pageX - pos.x;
			var curTime = Math.round(diffx * 100 / timebar.offsetWidth);
			if(curTime < 0) curTime = 0;
			notice.innerHTML = this.parseTimeCode(Math.round(curTime * this.video.duration / 100));
			
			notice.style.marginLeft = (diffx + 3 - notice.offsetWidth / 2)+'px';
		};

		/**
		 * Checks if the current playr instance has the focus
		 */
		Playr.prototype.playrHasFocus = function(){
			var aElem_id = document.activeElement.getAttribute('id');
			var focusRegex = new RegExp('^playr_.+_'+this.video_id+'$');
			
			return (focusRegex.test(aElem_id));
		};

		/**
		 * Manage the keyboard events
		 * @param {Event} ev The keyup event
		 */
		Playr.prototype.keyboard = function(ev){
			if(!this.playrHasFocus()) return true;

			switch(ev.keyCode){
				case 27: // escape
					if(this.isFullscreen){
						this.fullscreen();
					}
				break;
				case 32: // spacebar
					this.play();
				break;
				case 37: // arrow left
					if(this.video.currentTime - this.config.skipStep < 0){
						this.video.currentTime = 0;	
					}
					else{
						this.video.currentTime -= this.config.skipStep;
					}
					ev.preventDefault();
				break;
				case 38: // arrow up
					if(this.video.volume + this.config.volumeStep > 1){
						this.video.volume = 1;
					}
					else{
						this.video.volume += this.config.volumeStep;
					}
					this.notification('Volume: '+Math.round(this.video.volume*100)+'%');
					ev.preventDefault();
				break;
				case 39: // arrow right
					if(this.video.currentTime + this.config.skipStep > this.video.duration){
						this.video.currentTime = this.video.duration;	
					}
					else{
						this.video.currentTime += this.config.skipStep;
					}
					ev.preventDefault();
				break;				
				case 40: // arrow down
					if(this.video.volume - this.config.volumeStep < 0){
						this.video.volume = 0;
					}
					else{
						this.video.volume -= this.config.volumeStep;
					}
					this.notification('Volume: '+Math.round(this.video.volume*100)+'%');
					ev.preventDefault();
				break;
				case 67: // c
					this.subtitlesDelay += this.config.subsDelayStep;
					this.notification('Subtitles delay: '+this.subtitlesDelay+' second(s)');
				break;
				case 68: // d
					this.subtitlesDelay = 0.0;
					this.notification('Subtitles delay: '+this.subtitlesDelay+' second(s)');
				break;
				case 88: // x
					this.subtitlesDelay -= this.config.subsDelayStep;
					this.notification('Subtitles delay: '+this.subtitlesDelay+' second(s)');
				break;
				case 70: // f
					this.fullscreen();
				break;
				
			}
		};

		/**
		 * Handles mouse wheel events
		 */
		Playr.prototype.scrollHandler = function(ev){
			if(!this.playrHasFocus() || !this.isFullscreen) return true;

			if('wheelDelta' in ev) {
				rolled = ev.wheelDelta;
			}
			else{
				rolled = -ev.detail;
			}

			if(rolled < 0){
				if(this.video.volume - this.config.volumeStep < 0){
					this.video.volume = 0;
				}
				else{
					this.video.volume -= this.config.volumeStep;
				}
			}
			else if(rolled > 0){
				if(this.video.volume + this.config.volumeStep > 1){
					this.video.volume = 1;
				}
				else{
					this.video.volume += this.config.volumeStep;
				}
			}

			this.notification('Volume: '+Math.round(this.video.volume*100)+'%');

			return false;
		};
		
		/**
		 * Displays notifications
		 */
		Playr.prototype.notification = function(message, duration){
			if(!duration) duration = 1000;
			var overlay = document.getElementById('playr_top_overlay_'+this.video_id);
			overlay.innerHTML = '<span style="font-size:0.7em;">'+message+'</span>';
			overlay.style.opacity = 1;
			setTimeout(function(){ overlay.style.opacity = 0; }, duration);
		}

		/*
		 * Setup the player
		 */
		Playr.prototype.setup = function(){
			var that = this;
			
			this.video.addEventListener('loadeddata', function(){
				that.init();
			}, false);
			
			this.video.addEventListener('canplay', function(){
				that.init();
			}, false);
		};
		
		Playr.initialized = true;
	}
	
	/**
	 * Init the player
	 */
	this.setup();
};

window.addEventListener('DOMContentLoaded',function(){
	var video_tags = document.querySelectorAll('video.playr_video');
	var video_objects = [];
	for(v = 0; v < video_tags.length; v++){
		video_objects.push(new Playr(v, video_tags[v]));
	}
}, false);
