$(document).ready(function(){
	$('.head .search a:not(.login_yes a):last').css('background','none');
	$('.pos_164:last,.filter_search div:last').css('margin-right','0');
	
	$('.items_img li:not(#of .items_img li)').each(function(i){
		if(i%4 == 3) $(this).css('margin-right','0');
	});
	
	$("div.next:not(.best_obraz div.next)").hover(function(){
		$(this).css({'background-position':'0 -50px'});
	},function(){
		$(this).css({'background-position':'0 0'});
	});
	
	$("div.prev:not(.best_obraz div.prev)").hover(function(){
		$(this).css({'background-position':'0 -50px'});
	},function(){
		$(this).css({'background-position':'0 0'});
	});
	
	// MENU HEAD
	$(".head .menu li.mn1").hover(function(){
		$(this).addClass('active');
	},function(){
		$(this).removeClass('active');
	});
	$('.menu li:last a').css({'background':'none'});
	$('.crumb_ob .menu li.mn1:last,.menu_inner .menu li:last').css({
		'background':'none',
		'padding-right':'0',
		'margin-right':'0'
	});
	
	//BEST OBRAZ
	var wBest = 0;
	$('.slide ul li').each(function(){
		wBest = wBest + $(this).width();
	});
	$('.slide ul').width(wBest);
	
	var hBest = $('.best_obraz').height();
	$('.best_obraz .best_c .title').toggle(function(){
		$(this).parent().parent().animate({height:'3px'},{queue:false, duration:200, easing: 'easeInCirc'});
		$('.best_cc').slideUp(200);
		$(this).addClass('active');
	},function(){
		$(this).parent().parent().animate({height:hBest+'px'},{queue:false, duration:200, easing: 'easeInCirc'});
		$('.best_cc').slideDown(200);
		$(this).removeClass('active');
	});
	$('.obraz_list li,.vechi_all li,.friends_list li').each(function(i){
		if(i%3 == 2) $(this).css('margin-right','0');
	});
	
	//BEST TODAY
	var wBestTo = 0;
	$('.best_today_c ul li').each(function(){
		wBestTo = wBestTo + $(this).width();
	});
	$('.best_today_c ul').width(wBestTo);
	
	$('.gal_small_c ul').each(function(){
		var wGalSm = 0;
		$(this).children('li').each(function(i){
			wGalSm = wGalSm + $(this).width();
		});
		$(this).width(wGalSm);
	});
	
	//LIST item164
	$('.item164').each(function(){
		$(this).children('li:last').css({
			'border':'0',
			'margin-bottom':'0'
		});
	});

	//LIST item94
	$('.item94 li:odd').css({
		'margin-right':'0'
	});
	$('.comment_list li:last').css({
		'border':'0',
		'margin-bottom':'0'
	});
	
	//WINDOW
	$('.search a').click(function(e){
		$('#popup').height($('#content').height()).css('opacity','0.54').show();
        scrOfY = 0;
       if( typeof( window.pageYOffset ) == 'number' ) {
               //Netscape compliant
               scrOfY = window.pageYOffset;
       } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
               //DOM compliant
               scrOfY = document.body.scrollTop;
       } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
               //IE6 Strict
               scrOfY = document.documentElement.scrollTop;
       }
		$('#log').css("top", scrOfY + 50 + 'px').fadeIn();
		e.preventDefault();
	});
	$('.window .close span').click(function(e){
		$('#popup').fadeOut(300);
		$('.window').hide();
		e.preventDefault();
	});
	
	$('.stoit a.button').click(function(e){
		$('#popup').height($('#content').height()+30).css('opacity','0.54').show();
        scrOfY = 0;
       if( typeof( window.pageYOffset ) == 'number' ) {
               //Netscape compliant
               scrOfY = window.pageYOffset;
       } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
               //DOM compliant
               scrOfY = document.body.scrollTop;
       } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
               //IE6 Strict
               scrOfY = document.documentElement.scrollTop;
       }
		$('#save').css("top", scrOfY + 10 + 'px').fadeIn();
		e.preventDefault();
	});
	
	
	$('#w_brends').click(function(e){
		$('#popup').height($('#content').height()+30).css('opacity','0.54').show();
        scrOfY = 0;
       if( typeof( window.pageYOffset ) == 'number' ) {
               //Netscape compliant
               scrOfY = window.pageYOffset;
       } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
               //DOM compliant
               scrOfY = document.body.scrollTop;
       } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
               //IE6 Strict
               scrOfY = document.documentElement.scrollTop;
       }
		$('#brends').css("top", scrOfY + 10 + 'px').fadeIn();
		e.preventDefault();
	});
	
	$('.pro_new').click(function(e){
		$('#popup').height($('#content').height()+30).css('opacity','0.54').show();
        scrOfY = 0;
       if( typeof( window.pageYOffset ) == 'number' ) {
               //Netscape compliant
               scrOfY = window.pageYOffset;
       } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
               //DOM compliant
               scrOfY = document.body.scrollTop;
       } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
               //IE6 Strict
               scrOfY = document.documentElement.scrollTop;
       }
		$('#new_msg').css("top", scrOfY + 150 + 'px').fadeIn();
		e.preventDefault();
	});
	
	$('#oformit').click(function(e){
		$('#popup').height($('#content').height()+30).css('opacity','0.54').show();
        scrOfY = 0;
       if( typeof( window.pageYOffset ) == 'number' ) {
               //Netscape compliant
               scrOfY = window.pageYOffset;
       } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
               //DOM compliant
               scrOfY = document.body.scrollTop;
       } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
               //IE6 Strict
               scrOfY = document.documentElement.scrollTop;
       }
		$('#of').css("top", scrOfY + 150 + 'px').fadeIn();
		e.preventDefault();
	});
	
	
	//REDACTOR
	$('.r_right .imgs,.r_right .red,.r_left').css('height',$('.redactor').height()+'px');
	$('.vechi .vechi_list .list_table table tr:not(.vechi .vechi_list .list_table table tr:first)').hover(function(){
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
	});
	
	$('.drag_scrol').each(function(){
		$(this).height($(this).parent().height());
	});
	
	// RIGHT VESCHI
	$('.vechi_obraza ul li div.vesh').hide();
	$('.vechi_obraza ul li').hover(function(){
		$(this).children('div.vesh').fadeIn(200);
	},function(){
		$(this).children('div.vesh').fadeOut(200);
	});
	
	//search
	$('.comment_ul li:last').css('border','0');
	$('.rezult li.rez:last').css('border','0');
	$('.rezult li.rez .pos:odd').each(function(){
		$(this).css('margin-right','0');
	});
	
	// MENU PROFIL DEYSTVIE
	var mHeight = $('.pro_menu div').height();
	$('.pro_menu div').height(0);
	$('.pro_menu').toggle(function(){
		$(this).addClass('active');
		$(this).children('.pro_menu div').animate({height:mHeight+'px'},{queue:false, duration:200, easing: 'easeInCirc'});
	},function(){
		$(this).removeClass('active');
		$(this).children('.pro_menu div').animate({height:'0px'},{queue:false, duration:200, easing: 'easeInCirc'});
	});
	
	////////////////////////////////

});
$(window).resize(function(){

});