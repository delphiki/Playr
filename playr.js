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
		img_dir: './images/'
	};
	
	this.setupStarted = false;
	this.ready = false;
	this.video_id = v_id;
	this.video = v_el;
	this.timecode_refresh = false;
	this.captions_refresh = false;
	this.isFullscreen = false;
	this.isHoldingTime = false;
	this.isHoldingVolume = false;	
	this.fsStyle = null;
	this.fsVideoStyle = null;
	this.track_tags = new Array();
	this.current_track = -1;
	this.subs = new Array();
		
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
		    
		    var newAttr = document.createAttribute('id');
		    newAttr.nodeValue = 'playr_video_'+this.video_id;
		    this.video.setAttributeNode(newAttr);
		    this.video.removeAttribute('controls');
		    
		    var template = '<div class="playr_captions_wrapper" id="playr_captions_wrapper_'+this.video_id+'">'
		    	+'<div class="playr_top_overlay" id="playr_top_overlay_'+this.video_id+'"><a href="http://www.delphiki.com/html5/playr/">Playr</a></div>'
		    	+'<div class="playr_video_container" id="playr_video_container_'+this.video_id+'"></div>'
		    	+'<div class="playr_captions" id="playr_captions_'+this.video_id+'"></div>'
		    	+'</div>'
		    	+'<ul class="playr_controls">'
		    	+'<li><a class="playr_play_btn" id="playr_play_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_play.png" id="playr_play_img_'+this.video_id+'" alt="play" /></a></li>'
		    	+'<li>'
		    		+'<div class="playr_timebar" id="playr_timebar_'+this.video_id+'">'
		    			+'<div class="playr_timebar_buffer" id="playr_timebar_buffer_'+this.video_id+'"></div>'
		    			+'<div class="playr_timebar_inner" id="playr_timebar_inner_'+this.video_id+'">'
		    				+'<div class="playr_timebar_pos"></div>'
		    			+'</div>'
		    		+'</div>'
		    		+'<span class="playr_timebar_notice" id="playr_timebar_notice_'+this.video_id+'">00:00</span>'
		    	+'</li>'
		    	+'<li><span id="playr_video_curpos_'+this.video_id+'">00:00</span> / <span id="playr_video_duration_'+this.video_id+'">00:00</span></li>'
		    	+'<li><a class="playr_mute_btn" id="playr_mute_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_sound.png" class="playr_mute_icon" id="playr_mute_icon_'+this.video_id+'" alt="mute" /></a>'
		    		+'<div class="playr_volume_ctrl" id="playr_volume_ctrl_'+this.video_id+'">'
		    			+'<div class="playr_volumebar" id="playr_volumebar_'+this.video_id+'"><div class="playr_volumebar_inner" id="playr_volumebar_inner_'+this.video_id+'"><div class="playr_volumebar_pos"></div></div></div>'
		    		+'</div>'
		    	+'</li>'
		    	+'<li><a class="playr_captions_btn" id="playr_captions_btn_'+this.video_id+'">CC</a>'
		    		+'<ul class="playr_cc_tracks" id="playr_cc_tracks_'+this.video_id+'">'
		    			+'<li id="playr_cc_track_'+this.video_id+'_none">'
		    				+'<label for="playr_current_cc_'+this.video_id+'_none">'
		    				+'<input type="radio" name="playr_current_cc_'+this.video_id+'" id="playr_current_cc_'+this.video_id+'_none" value="-1" />'
		    				+' None</label>'
		    			+'</li>'
		    		+'</ul>'
		    	+'</li>'
		    	+'<li><a class="playr_fullscreen_btn" id="playr_fullscreen_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_fullscreen.png" alt="fullscreen" /></a></li>'
		    	+'</ul>';
		    wrapper.innerHTML = template;
		    
		    this.video.parentNode.insertBefore(wrapper,this.video);
		    document.getElementById('playr_video_container_'+this.video_id).appendChild(this.video);
		    document.getElementById('playr_video_container_'+this.video_id).style.height = h+'px';
		    document.getElementById('playr_wrapper_'+this.video_id).style.width = w+'px';
		    
			this.initEventListeners();
			this.video.volume = 0.75;
			this.loadTracks();
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
			
			document.getElementById('playr_captions_btn_'+this.video_id).parentNode.addEventListener('mouseover', function(){ that.displayTrackCtrl(); }, false);
			document.getElementById('playr_captions_btn_'+this.video_id).parentNode.addEventListener('mouseout', function(){ that.displayTrackCtrl(); }, false);
			
			document.addEventListener('keydown', function(e){ that.keyboard(e); }, false);
			window.addEventListener('resize', function(e){ if(that.isFullscreen) that.updateFullscreen(); }, false);
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
			if(!this.video.buffered)
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
				
				this.fsStyle = { height: wrapper.style.height, width: wrapper.style.width };
				this.fsVideoStyle = { height: this.video.offsetHeight, width: this.video.offsetWidth };
				
				wrapper.style.backgroundColor = '#000000';
				wrapper.style.position = 'fixed';
				wrapper.style.top = 0;
				wrapper.style.left = '50%';
				wrapper.style.height =  window.innerHeight+'px';
				wrapper.style.width = window.innerWidth+'px';
				wrapper.style.marginLeft = '-'+Math.round(wrapper.offsetWidth / 2)+'px';
				this.video.style.width = window.innerWidth+'px';
				this.video.style.height = (window.innerHeight - 30)+'px';
								
				this.isFullscreen = true;
			}
			else{
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
		Playr.prototype.loadTracks = function(){
			this.track_tags = this.video.getElementsByTagName('track');
			for(i = 0; i < this.track_tags.length; i++){
				var newAttr = document.createAttribute('id');
		    	newAttr.nodeValue = 'playr_track_'+this.video_id+'_'+i;
		    	this.track_tags[i].setAttributeNode(newAttr);
			}
			if(this.track_tags.length > 0)
				this.loadSubtitles(0);
		};
		
		/**
		 * Get the content of the <track>s' sources (via XMLHttpRequest) and add an entrie to the track menu
		 * @param {DOMElement} track A <track> node
		 */
		Playr.prototype.loadSubtitles = function(track){
			var that = this;
			var curTrack = that.track_tags[track];
			var req_track = new XMLHttpRequest();
			req_track.open('GET', curTrack.getAttribute('src'));
			req_track.onreadystatechange = function(){
				if(req_track.readyState == 4 && (req_track.status == 200 || req_track.status == 0)){
					that.subs.push(that.parseTrack(req_track.responseText, 'subtitles'));
					if(req_track.responseText != ''){
						var label = curTrack.getAttribute('label');
						var lang = curTrack.getAttribute('srclang');
						if(label != null) track_label = label;
						else if(lang != null) track_label = lang;
						else track_label = 'Track '+ (track + 1);
						var str = '<li><label for="playr_current_cc_'+that.video_id+'_'+track+'"><input type="radio" name="playr_current_cc_'+that.video_id+'" id="playr_current_cc_'+that.video_id+'_'+track+'" value="'+track+'" /> '+track_label+'</label></li>';
						document.getElementById('playr_cc_tracks_'+that.video_id).innerHTML += str;
					}
					track++;
					if(track < that.track_tags.length){
						that.loadSubtitles(track);
					}
					else{
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
				if(this.track_tags[i].getAttribute('srclang') == lang){
					to_check = i+1;
				}
				track_list[i+1].addEventListener('change', function(){
					that.setActiveTrack();
				},false);
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
			var track_li = document.querySelectorAll('#playr_cc_tracks_'+this.video_id+' li');
			var track_inputs = document.querySelectorAll('input[name="playr_current_cc_'+this.video_id+'"]');
			for(i = 0; i < track_inputs.length; i++){
				if(track_inputs[i].checked){
					track_li[i].className = 'active_track';
				}
				else
					track_li[i].className = '';
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
			var pattern_identifier = /^[0-9]+$/;
			var pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})(.*)$/;
			var lines = track_content.split(/\r?\n/);
			var entries = new Array();
			for(i = 0; i<lines.length; i++) {
				if(pattern_identifier.exec(lines[i])){
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
	        				'start': this.tc2sec(timecode[1]),
	                    	'stop': this.tc2sec(timecode[2]),
	                       	'text': text,
	                       	'settings': timecode[3]
	                   	});
					}
	    		}
  			}
			return entries;
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
					if(this.video.currentTime >= this.subs[this.current_track][i].start && this.video.currentTime <= this.subs[this.current_track][i].stop){

						var text = this.subs[this.current_track][i].text;
						var captions_wrapper = document.getElementById('playr_captions_wrapper_'+this.video_id);
						var wrapper_classes = ['playr_captions_wrapper'];
						var captions_container_classes = ['playr_captions'];
						var captions_container_styles = ['text-align:center'];
						var captions_styles = [];						
						
						// voice declaration tags
						var voice_declarations = /(<v.(.+)>)/i;
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
						var timestamps = /<([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})>/;
						var timestamp_opened = false;
						var prefix = '';
						while(test_timestamps = timestamps.exec(text)){
							if(timestamp_opened){
								var prefix = '</span>';
							}
							if(this.tc2sec(test_timestamps[1]) < this.video.currentTime){
								text = text.replace(test_timestamps[0], prefix+'<span class="playr_cue_past">');
							}
							else{
								text = text.replace(test_timestamps[0], prefix+'<span class="playr_cue_future">');
							}
						}
						
						// if cue settings
						if(this.subs[this.current_track][i].settings != ''){
							var text_align = /A:(start|middle|end)/i;
							var text_size = /S:([0-9]{0,3})%/i;
							var text_position = /T:([0-9]{0,3})%/i;
							var vertical_text = /D:(vertical|vertical-lr)/i;
							var line_position_percent = /L:([0-9]{0,3})%/i;
							
							var test_ta = text_align.exec(this.subs[this.current_track][i].settings);
							var test_ts = text_size.exec(this.subs[this.current_track][i].settings);
							var test_tp = text_position.exec(this.subs[this.current_track][i].settings);
							var test_vt = vertical_text.exec(this.subs[this.current_track][i].settings);
							var test_lpp = line_position_percent.exec(this.subs[this.current_track][i].settings);
							
							// if text align specified
							if(test_ta){
								if(test_ta[1] == 'start'){ captions_styles.push('text-align:left') }
								else if(test_ta[1] == 'middle'){ captions_styles.push('text-align:center') }
								else if(test_ta[1] == 'end'){ captions_styles.push('text-align:right') }
							}
							
							// if text position specified
							if(test_tp && test_tp[1] >= 0 && test_tp[1] < 50){
								captions_container_styles.push('text-align:left');
								captions_styles.push('margin-left:'+test_tp[1]+'%');
							}
							else if(test_tp && test_tp[1] > 50 && test_tp[1] <= 100){
								captions_container_styles.push('text-align:right');
								captions_styles.push('margin-right:'+(100-test_tp[1])+'%');
							}
							
							// if text size specified
							if(test_ts){ captions_styles.push('font-size:'+(test_ts[1]/100)+'em'); }
							
							// if vertical text specified
							if(test_vt){}
							
							// if line position (%) specified
							if(test_lpp && test_lpp[1] >= 0 && test_lpp[1] <= 100){
								captions_container_styles.push('bottom:'+(90-test_lpp[1])+'%');
							}
						}
						
						if(this.isFullscreen){
							var factor = Math.round((window.innerHeight - 30) / this.fsVideoStyle.height * 100) / 100;
							captions_styles.push('font-size:' + Math.round(12*factor) + 'pt');
						}
						else{
							
						}
						
						captions_wrapper.setAttribute('class', wrapper_classes.join(' '));
						captions_div.setAttribute('class', captions_container_classes.join(' '));
						captions_div.setAttribute('style', captions_container_styles.join(';'));
						
						text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1</span><br /><span>$2');
						captions_div.innerHTML = '<p style="'+captions_styles.join(';')+'"><span>'+text+'</span></p>';
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
		 * Display the track menu
		 */
		Playr.prototype.displayTrackCtrl = function(){
			var menu = document.getElementById('playr_cc_tracks_'+this.video_id);
			if(menu.style.display == 'block'){
				menu.style.display = 'none';
				menu.style.visibility = 'hidden';
			}
			else{
				menu.style.display = 'block';
				menu.style.marginTop = '-'+(menu.offsetHeight + 26)+'px';
				menu.style.visibility = 'visible';
			}
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
				case 27:
					if(this.isFullscreen){
						this.fullscreen();
					}
				break;
			}
		};
		
		Playr.prototype.setup = function(){
			var that = this;
			
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
	/*
	alert(this.video.readyState);
	this.video.addEventListener('canplay', function(e){ if(!that.ready) that.init(); }, false);	
	*/
	//this.video.addEventListener('loadedmetadata', function(){ alert('loadeddata') }, false);
};

window.addEventListener('DOMContentLoaded',function(){
	var video_tags = document.querySelectorAll('video.playr_video');
	var video_objects = [];
	for(v = 0; v < video_tags.length; v++){
		video_objects.push(new Playr(v, video_tags[v]));
	}
}, false);
