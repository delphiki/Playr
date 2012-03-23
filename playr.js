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
		img_dir: './images/',
		fontSize: '12pt',
		customFontSize: '12pt',
		defaultVolume: 0.75
	};
	
	this.setupStarted = false;
	this.ready = false;
	this.video_id = v_id;
	this.video = v_el;
	this.timecode_refresh = false;
	this.captions_refresh = false;
	this.isFullscreen = false;
	this.isTrueFullscreen = false;
	this.isHoldingTime = false;
	this.isHoldingVolume = false;
	this.focusedElem = null;
	this.fsStyle = null;
	this.fsVideoStyle = null;
	this.track_tags = [];
	this.current_track = -1;
	this.subs = [];
	this.chapters = [];
	this.subtitlesDelay = 0;
		
	if(typeof Playr.initialized == "undefined"){
		
		Playr.prototype.init = function(){
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
				+'<ul class="playr_controls" role="menubar">'
				+'<li><button class="playr_play_btn" id="playr_play_btn_'+this.video_id+'" tabindex="0"><img src="'+this.config.img_dir+'playr_play.png" id="playr_play_img_'+this.video_id+'" alt="play" /></button></li>'
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
				+'<li><button class="playr_mute_btn" id="playr_mute_btn_'+this.video_id+'" tabindex="0"><img src="'+this.config.img_dir+'playr_sound.png" class="playr_mute_icon" id="playr_mute_icon_'+this.video_id+'" alt="mute" /></button>'
					+'<div class="playr_volume_ctrl" id="playr_volume_ctrl_'+this.video_id+'" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="'+this.config.defaultVolume+'" tabindex="0">'
						+'<div class="playr_volumebar" id="playr_volumebar_'+this.video_id+'"><div class="playr_volumebar_inner" id="playr_volumebar_inner_'+this.video_id+'"><div class="playr_volumebar_pos"></div></div></div>'
					+'</div>'
				+'</li>'
				+'<li><button class="playr_captions_btn" id="playr_captions_btn_'+this.video_id+'" tabindex="0">Menu</button>'
					+'<ul class="playr_cc_tracks" id="playr_cc_tracks_'+this.video_id+'">'
						+'<li class="playr_menu_title">Subtitles</li>'
						+'<li class="playr_subtitles_item" id="playr_cc_track_'+this.video_id+'_none">'
							+'<label for="playr_current_cc_'+this.video_id+'_none">'
							+'<input type="radio" name="playr_current_cc_'+this.video_id+'" id="playr_current_cc_'+this.video_id+'_none" value="-1" />'
							+' None</label>'
						+'</li>'
					+'</ul>'
				+'</li>'
				+'<li><button class="playr_fullscreen_btn" id="playr_fullscreen_btn_'+this.video_id+'" tabindex="0"><img src="'+this.config.img_dir+'playr_fullscreen.png" alt="fullscreen" /></button></li>'
				+'</ul>';
			wrapper.innerHTML = template;

			this.video.parentNode.insertBefore(wrapper,this.video);
			document.getElementById('playr_video_container_'+this.video_id).appendChild(this.video);
			document.getElementById('playr_video_container_'+this.video_id).style.height = h+'px';
			document.getElementById('playr_wrapper_'+this.video_id).style.width = w+'px';

			this.video.volume = this.config.defaultVolume;
			this.initEventListeners();
			this.loadTrackTags();
			this.ready = true;
		};
		
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
				document.getElementById('playr_play_img_'+this.video_id).src = this.config.img_dir+'playr_play.png';
				document.getElementById('playr_play_img_'+this.video_id).alt = 'play';
			}
			else{
				document.getElementById('playr_play_img_'+this.video_id).src = this.config.img_dir+'playr_pause.png';
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
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.config.img_dir+'playr_sound_mute.png';
				document.getElementById('playr_mute_icon_'+this.video_id).alt = 'unmute';
			}
			else{
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.config.img_dir+'playr_sound.png';
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
				
				if(document.documentElement.requestFullScreen){
					this.isTrueFullscreen = true;
					document.documentElement.requestFullScreen();
				}
				else if(document.documentElement.mozRequestFullScreen){
					this.isTrueFullscreen = true;
					document.documentElement.mozRequestFullScreen();
				}
				else if(document.documentElement.webkitRequestFullScreen){
					this.isTrueFullscreen = true;
					document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
				}
				
				if(this.isTrueFullscreen){
					wrapper.style.position = 'fixed';
					wrapper.style.top = 0;
					wrapper.style.left = 0;
					wrapper.style.height = '100%';
					wrapper.style.width = '100%';
					wrapper.style.backgroundColor = '#000000';
					this.video.style.height = (screen.height - 30)+'px';
					document.body.style.overflow = 'hidden';
				}
				else{
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
			}
			else{
				if(document.cancelFullScreen){
					document.cancelFullScreen();  
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
		};
		
		/**
		 * Look up for <track>s
		 */
		Playr.prototype.loadTrackTags = function(){
			this.track_tags = this.video.getElementsByTagName('track');
			for(i = 0; i < this.track_tags.length; i++){
				var newAttr = document.createAttribute('id');
				newAttr.nodeValue = 'playr_track_'+this.video_id+'_'+i;
				this.track_tags[i].setAttributeNode(newAttr);
			}
			if(this.track_tags.length > 0)
				this.loadTrackContent(0);
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
						that.parseTrack(req_track.responseText, curTrack.getAttribute('kind'));
						
						if(curTrack.getAttribute('kind') == 'subtitles'){
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
			for(i = 0; i < track_inputs.length; i++){
				if(track_inputs[i].checked){
					track_li[i].className = 'playr_subtitles_item active_track';
				}
				else
					track_li[i].className = 'playr_subtitles_item';
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
			if(track_kind == 'subtitles'){ var pattern_identifier = /^([0-9]+)$/; }
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
  			if(track_kind == 'subtitles') this.subs.push(entries);
  			else if(track_kind == 'chapters') this.chapters.push(entries);
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
						var voice_declarations = /(<v (.+)>)/i;
						while(test_vd = voice_declarations.exec(text)){
							text.replace(voice_declarations, '');
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
			document.getElementById('playr_play_img_'+this.video_id).src = this.config.img_dir+'playr_play.png';
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
		 * Manage the keyboard events
		 * @param {Event} ev The keyup event
		 */
		Playr.prototype.keyboard = function(ev){
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
					if(this.video.currentTime - 5 < 0){
						this.video.currentTime = 0;	
					}
					else{
						this.video.currentTime -= 5;
					}
					ev.preventDefault();
				break;
				case 38: // arrow up
					if(this.video.volume + .1 > 1){
						this.video.volume = 1;
					}
					else{
						this.video.volume += .1;
					}
					ev.preventDefault();
				break;
				case 39: // arrow right
					if(this.video.currentTime + 5 > this.video.duration){
						this.video.currentTime = this.video.duration;	
					}
					else{
						this.video.currentTime += 5;
					}
					ev.preventDefault();
				break;				
				case 40: // arrow down
					if(this.video.volume - .1 < 0){
						this.video.volume = 0;
					}
					else{
						this.video.volume -= .1;
					}
					ev.preventDefault();
				break;
				case 67: // c
					this.subtitlesDelay += 0.5;
					var overlay = document.getElementById('playr_top_overlay_'+this.video_id);
					overlay.innerHTML = '<span style="font-size:0.7em;">Subtitles delay: '+this.subtitlesDelay+' second(s).</span>';
					overlay.style.opacity = 1;
					setTimeout(function(){ overlay.style.opacity = 0;  }, 1000);
				break;
				case 68: // d
					this.subtitlesDelay = 0.0;
					var overlay = document.getElementById('playr_top_overlay_'+this.video_id);
					overlay.innerHTML = '<span style="font-size:0.7em;">Subtitles delay: '+this.subtitlesDelay+' second(s).</span>';
					overlay.style.opacity = 1;
					setTimeout(function(){ overlay.style.opacity = 0; }, 1000);
				break;
				case 88: // x
					this.subtitlesDelay -= 0.5;
					var overlay = document.getElementById('playr_top_overlay_'+this.video_id);
					overlay.innerHTML = '<span style="font-size:0.7em;">Subtitles delay: '+this.subtitlesDelay+' second(s).</span>';
					overlay.style.opacity = 1;
					setTimeout(function(){ overlay.style.opacity = 0; }, 1000);
				break;
				case 70: // f
					this.fullscreen();
				break;
				
			}
		};
		
		/*
		 * Setup the player
		 */
		Playr.prototype.setup = function(){
			var that = this;
			
			this.video.addEventListener('durationchange', function(){
				if(!that.ready && !that.setupStarted) that.init();
			}, false);

			this.video.addEventListener('loadeddata', function(){
				if(!that.ready && !that.setupStarted) that.init();
			}, false);
			
			this.video.addEventListener('canplay', function(){
			if(!that.ready && !that.setupStarted) that.init();
			}, false);
		};
		
		Playr.initialized = true;
	}
	
	/**
	 * Init the player
	 */
	this.setup();
};

var browser_track_support = 'track' in document.createElement('track');

if(!browser_track_support){
	window.addEventListener('DOMContentLoaded',function(){
		var video_tags = document.querySelectorAll('video.playr_video');
		var video_objects = [];
		for(v = 0; v < video_tags.length; v++){
			video_objects.push(new Playr(v, video_tags[v]));
		}
	}, false);
}
else{
	console.log('Native track support detected, aborting.')
}