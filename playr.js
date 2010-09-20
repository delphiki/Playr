/**
 * Playr v0.1
 *
 * @author Julien 'delphiki' Villetorte <gdelphiki@gmail.com>
 * http://twitter.com/delphiki
 * http://www.delphiki.com/html5/playr
 */

function Playr(v_id, v_el){
	this.config = {
		img_dir: './images/'
	};
	
	this.video_id = v_id;
	this.video = v_el;
	this.timecode_refresh = false;
	this.captions_refresh = false;
	this.isFullscreen = false;
	this.wwidth = 0;
	this.track_tags = new Array();
	this.current_track = -1;
	this.subs = new Array();
	
	if(typeof Playr.initialized == "undefined"){
		Playr.prototype.init = function(){
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
		    					    		    		    
		    var template = '<div class="playr_captions_wrapper" id="playr_captions_wrapper_'+this.video_id+'">'
		    	+'<div class="playr_top_overlay" id="playr_top_overlay_'+this.video_id+'"><a href="http://www.delphiki.com/html5/playr/">Playr</a></div>'
		    	+'<div class="playr_video_container" id="playr_video_container_'+this.video_id+'"></div>'
		    	+'<div class="playr_captions" id="playr_captions_'+this.video_id+'"></div>'
		    	+'</div>'
		    	+'<ul class="playr_controls">'
		    	+'<li><a class="playr_play_btn" id="playr_play_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_play.png" id="playr_play_img_'+this.video_id+'" alt="play" /></a></li>'
		    	+'<li><div class="playr_timebar" id="playr_timebar_'+this.video_id+'"><div class="playr_timebar_inner" id="playr_timebar_inner_'+this.video_id+'"><div class="playr_timebar_pos"></div></div></div></li>'
		    	+'<li><span id="playr_video_curpos_'+this.video_id+'">00:00</span> / <span id="playr_video_duration_'+this.video_id+'">00:00</span></li>'
		    	+'<li><a class="playr_mute_btn" id="playr_mute_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_sound.png" class="playr_mute_icon" id="playr_mute_icon_'+this.video_id+'" alt="mute" /></a>'
		    		+'<input type="range" class="video_volume" id="playr_volume_'+this.video_id+'" min="0" max="100" value="75" /></li>'
		    	+'<li><a class="playr_captions_btn">CC</a>'
		    		+'<form id="playr_cc_form_'+this.video_id+'"><ul class="playr_cc_tracks" id="playr_cc_tracks_'+this.video_id+'">'
		    			+'<li id="playr_cc_track_'+this.video_id+'_none">'
		    				+'<input type="radio" name="playr_current_cc_'+this.video_id+'" id="playr_current_cc_'+this.video_id+'_none" value="-1" checked="checked" />'
		    				+'<label for="playr_current_cc_'+this.video_id+'_none"> None</label>'
		    			+'</li>'
		    		+'</ul></form>'
		    	+'</li>'
		    	+'<li><a class="playr_fullscreen_btn" id="playr_fullscreen_btn_'+this.video_id+'"><img src="'+this.config.img_dir+'playr_fullscreen.png" alt="fullscreen" /></a></li>'
		    	+'</ul>';
		    wrapper.innerHTML = template;
		    
		    this.video.parentNode.insertBefore(wrapper,this.video);
		    document.getElementById('playr_video_container_'+this.video_id).appendChild(this.video);
		    
			var that = this;
			this.video.addEventListener('click', function(){ that.play(); return false; }, false);
			document.getElementById('playr_play_btn_'+this.video_id).addEventListener('click', function(){ that.play(); }, false);
			document.getElementById('playr_timebar_'+this.video_id).addEventListener('click', function(){ that.setPosition(); }, false);
			document.getElementById('playr_mute_btn_'+this.video_id).addEventListener('click', function(){ that.toggleMute(); }, false);
			document.getElementById('playr_volume_'+this.video_id).addEventListener('change', function(){ that.setVolume(); }, false);
			document.getElementById('playr_fullscreen_btn_'+this.video_id).addEventListener('click', function(){ that.fullscreen(); }, false);
			
			this.loadTracks();
		};
		
		Playr.prototype.play = function(){
			var that = this;
			this.timecode_refresh = setInterval(function(){ that.timeCode(); }, 100);
			this.captions_refresh = setInterval(function(){ that.displayCaptions(); }, 50);
			
			if(document.getElementById('playr_play_img_'+this.video_id).alt == 'play'){
				this.video.play();
				document.getElementById('playr_play_img_'+this.video_id).src = this.config.img_dir+'playr_pause.png';
				document.getElementById('playr_play_img_'+this.video_id).alt = 'pause';
			}
			else{
				this.video.pause();
				document.getElementById('playr_play_img_'+this.video_id).src = this.config.img_dir+'playr_play.png';
				document.getElementById('playr_play_img_'+this.video_id).alt = 'play';
				this.timecode_refresh = clearInterval(this.timecode_refresh);
				this.captions_refresh = clearInterval(this.captions_refresh);
			}
			return false;
		};
		
		Playr.prototype.timeCode = function(){
			document.getElementById('playr_video_curpos_'+this.video_id).innerHTML = this.parseTimeCode(this.video.currentTime);
				
			if(!isNaN(this.video.duration) && document.getElementById('playr_video_duration_'+this.video_id).innerHTML == '00:00'){
				document.getElementById('playr_video_duration_'+this.video_id).innerHTML = this.parseTimeCode(this.video.duration);
			}
			document.getElementById('playr_timebar_inner_'+this.video_id).style.width = this.video.currentTime * 100 / this.video.duration + '%' ;
		};
		
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
		
		Playr.prototype.findPos = function(el){
			var x = y = 0;
			if(el.offsetParent){
				x = el.offsetLeft;
				y = el.offsetTop;
				while(el = el.offsetParent){
					x += el.offsetLeft;
					y += el.offsetTop;
				}
			}
			return x;
		};
		
		Playr.prototype.setPosition = function(){
			var timebar = document.getElementById('playr_timebar_'+this.video_id);
			var ev = window.event;
			var pos = this.findPos(timebar);
			var diffx = ev.clientX - pos;
			var dur = this.video.duration;
			var curTime = Math.round(diffx * 100 / timebar.offsetWidth);
			document.getElementById('playr_timebar_inner_'+this.video_id).style.width = curTime.toString()+'%';
			this.video.currentTime = Math.round(curTime * dur / 100);
		};
		
		Playr.prototype.toggleMute = function(){
			if(document.getElementById('playr_mute_icon_'+this.video_id).alt == 'mute'){
				this.video.muted = true;
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.config.img_dir+'playr_sound_mute.png';
				document.getElementById('playr_mute_icon_'+this.video_id).alt = 'unmute';
			}
			else{
				this.video.muted = false;
				document.getElementById('playr_mute_icon_'+this.video_id).src = this.config.img_dir+'playr_sound.png';
				document.getElementById('playr_mute_icon_'+this.video_id).alt = 'mute';
			}
			return false;
		};
				
		Playr.prototype.setVolume = function(){
			this.video.volume = document.getElementById('playr_volume_'+this.video_id).value / 100;			
		};
		
		Playr.prototype.fullscreen = function(){
			if(!this.isFullscreen){				
				this.video.style.position = 'fixed';
				this.video.style.top = 0;
				this.video.style.top = 0;
				this.video.style.margin = 'auto';
				this.video.style.height = window.innerHeight+'px';
				document.getElementById('playr_wrapper_'+this.video_id).style.height = '100%';
				this.isFullscreen = true;
			}
			else{
				this.video.style.position = 'normal';
				document.getElementById('playr_wrapper_'+this.video_id).style.width = this.wwidth+'px';
				this.isFullscreen = false;
			}
			return false;
		};
		
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
		
		Playr.prototype.loadSubtitles = function(track){
			var that = this;
			var curTrack = that.track_tags[track];
			var req_track = new XMLHttpRequest();
			req_track.open('GET', curTrack.getAttribute('src'), false);
			req_track.onreadystatechange = function(){
				 if(req_track.readyState == 4){
					that.subs.push(that.parseTrack(req_track.responseText, 'subtitles'));
					var lang = curTrack.getAttribute('srclang');
					var str = '<li><input type="radio" name="playr_current_cc_'+that.video_id+'" id="playr_current_cc_'+that.video_id+'_'+track+'" value="'+track+'" /><label for="playr_current_cc_'+that.video_id+'_'+track+'"> '+lang+'</label></li>';
					document.getElementById('playr_cc_tracks_'+that.video_id).innerHTML += str;
					track++;
					if(track < that.track_tags.length){
						that.loadSubtitles(track);
					}
				 }
			}
  			req_track.send(null);		
		};
		
		Playr.prototype.tc2sec = function(timecode){
  			var tab = timecode.split(':');
	  		return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
		};
	
		Playr.prototype.parseTrack = function(track_source, track_kind){
			var pattern_identifier = /^[0-9]+$/;
			var pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})(.*)$/;
			var lines = track_source.split(/\r?\n/);
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
						var styles = '';
						
						var voice_declarations = /(<narrator>|<music>|<sound>|<comment>|<credit>)/i;
						var test_vd = voice_declarations.exec(text);
						if(test_vd){
							text.replace(voice_declarations, '');
							if(test_vd[1] == '<narrator>'){ styles += 'color:yellow;'; }
							else if(test_vd[1] == '<music>' || test_vd[1] == '<sound>'){ text = '# ' + text + ' #'; }
							else if(test_vd[1] == '<comment>' || test_vd[1] == '<credit>'){ text = '[ ' + text + ' ]'; }
						}
						
						text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
		
						if(this.subs[this.current_track][i].settings != ''){
							var text_align = /A:(start|middle|end)/i;
							var text_size = /S:([0-9]{0,3})%/i;
							var vertical_text = /D:vertical/;
							var test_ta = text_align.exec(this.subs[this.current_track][i].settings);
							var test_ts = text_size.exec(this.subs[this.current_track][i].settings);
							var test_vt = vertical_text.exec(this.subs[this.current_track][i].settings);
							if(test_ta){
								if(test_ta[1] == 'start'){ styles += 'text-align:left;'; }
								else if(test_ta[1] == 'middle'){ styles += 'text-align:center;'; }
								else if(test_ta[1] == 'end'){ styles += 'text-align:right;'; }
							}
							if(test_ts){
								styles += 'font-size:'+(test_ts[1]/100)+'em;';
							}
							if(test_vt){
								styles += 'writing-mode:tb-rl;';
							}
						}
						captions_div.innerHTML = '<p style="'+styles+'">'+text+'</p>';
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
		
		Playr.initialized = true;
	}
};

window.onload = function(){
	setTimeout(function(){
		var video_tags = document.querySelectorAll('video.playr_video');
		for(v = 0; v < video_tags.length; v++){
			var w = video_tags[v].offsetWidth;
			var p = new Playr(v, video_tags[v]);
			p.init();
			document.getElementById('playr_wrapper_'+v).style.width = w+'px';
		}	
	},1000);	
}