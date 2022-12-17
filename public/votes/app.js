$(function($){
	$('.bottom_khdxz_close').click(function(){
		$(this).parents('.bottom_khdxz').hide();
	});
	
	$('#searchBtn').click(function(){
			var $searchText=$('#searchText');
			if (!$searchText.val()) {
	    		return false;
	    	}
			$("#search_form").submit();
	});

	$(".toupiao").on('click',function(e){
		if(false){//已关注
			$(".toupiao_pop").show();
		} else {
			$(".guanzhu_pop").show();
		}
		e.preventDefault();
	});
	
	
	
	
	$(".fenxiang").on('click', function(e){
		$(".share_overmask").show().on('click', function(){
			$(this).hide();
		});
		e.preventDefault();
	});
	
	$(".close_pop_up").on('click',function(){
		$(this).parents(".pop").hide();
	});
});
