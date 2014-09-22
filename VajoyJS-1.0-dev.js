/*VaJoyJS 1.1
Widget based On jQuery and base.css
@author VaJoy Larn 
https://github.com/VaJoy/VaJoyJS
http://vajoy.cnblogs.com
NOTICE:
Here sets the minimum z-index as 1000.
*/

  (function($) {
	  var z_index0=1000, z_index1=1001, z_index2=1002, z_index3=1003, z_index4=1004, z_index5=1005;
	  
	  //获取窗口大小复用
	  $.VJ_getWin = function(){
		  var $win = $(window);
		  return {
			 h:$win.height(),
			 w:$win.width(),
			 t:$win.scrollTop(),
			 l:$win.scrollLeft()
		  }
	  }
	  //居中模块
	  $.VJ_stayCenter = function(obj,padding,m_left,m_top){	
		  var m_left = m_left&&typeof m_left!=="function"?m_left:0, m_top = m_top&&typeof m_top!=="function"?m_top:0;
		  var $obj = $(obj);
		  var o_l = $.VJ_getWin().w/2 - m_left -padding + $.VJ_getWin().l, o_h = $.VJ_getWin().h/2 - m_top  -padding + $.VJ_getWin().t;
		  var obj_w = $obj.width()/2, obj_h = $obj.height()/2;
		  $obj.css({"left":o_l,"margin-left":-obj_w, "top":o_h,"margin-top":-obj_h});
	  }
		  
	  //幻灯片模块
	  $.fn.VJ_slidePics = function(li_default_class, li_active_class, arrow_left, arrow_right, isAutoplay, style){
		  var  arrow_left=arrow_left||true,isAuto = isAutoplay===!1?isAutoplay:true, isArrow=!1, isScroll=!1;
		  if(typeof(arrow_left)==="boolean"){
			  isAuto = arrow_left;
		  }
		  else if(typeof(arrow_left)==="string"){ 
			  isArrow=!0 ; 
		  }
		  if(arrow_left==="scroll"||arrow_right==="scroll"||isAutoplay==="scroll"||style==="scroll"){ 
			  isScroll=!0 ; 
		  }
		  var auto_time = 5000,   //图片停显时间
			  li_margin = "5px", li_bottom = 10,  //li之间的左右间距，和距离图片底部的距离
			  arrow_margin = "10px"; //左右箭头分别距离两端的长度
		  var $slide = $(this),
			  $pic = $("a",this), $ul = $("<ul></ul>"),
			  pic_w , pic_h = $slide.height(), pic_l = $pic.length;
		  $ul.appendTo(this);
		  if(isScroll){
			  $slide.css("overflow","hidden");
			  $pic.css({"display":"block","float":"left","height":pic_h}).wrapAll("<div></div>"); 
			  var $picWrap = $pic.parent();
			  $picWrap.css({"position":"absolute","width":pic_w * pic_l});
		  }else{
			  $pic.css({"display":"block","position":"absolute","z-index":z_index0,"height":pic_h});
			  $("a:gt(0)",this).hide();
		  }
		  var pl=pic_l; while(pl--){ $("<li></li>").appendTo($ul); }  //添加li按钮
		  var $li = $("li",this),
		  cirNum = 1, cirCount = pic_l-1;
		  $ul.addClass("clearfix").css({"position":"absolute","display":"inline","z-index":z_index2,"bottom":li_bottom});
		  $li.css({"float":"left","margin":"0 "+li_margin,"cursor":"pointer"}).addClass(li_default_class).eq(0).removeClass(li_default_class).addClass(li_active_class);
		  
		  var addHover = function(obj){obj.removeClass(li_default_class).addClass(li_active_class);}    //鼠标移上li按钮
		  var removeHover = function(obj){obj.removeClass(li_active_class).addClass(li_default_class);}     //鼠标移出li按钮
  
		  $("li:gt(0)",this).on("mouseover",function(){addHover($(this));}).on("mouseleave",function(){removeHover($(this));})   //初始化绑定li的hover效果（激活状态的li不绑定）
		  
		  var UlMiddle = (function ResetAll(){   //窗口resize的时候调用
			  pic_w = $slide.width();
			  $pic.css("width",pic_w);
			  $ul.css({"margin-left":-$ul.width()/2 ,"left":pic_w/2});
			  if(isScroll){ $picWrap.css("width",pic_w * pic_l); }
			  return ResetAll;
		  })();
		  function changeimg(i){     //图片切换效果函数
				  if(cirNum>cirCount){
						  cirNum=0;
						  i=0;
				  }
				  else if(cirNum<0){
						  cirNum=cirCount;
						  i=cirCount;
				  }
				  cirNum= i+1;
				  $li.eq(i).removeClass(li_default_class).addClass(li_active_class)
				  .off("mouseover").off("mouseleave")  //激活状态的li不绑定hover
				  .siblings("li").removeClass(li_active_class).addClass(li_default_class)
				  .on("mouseover",function(){addHover($(this));}).on("mouseleave",function(){removeHover($(this));})   //绑定非激活状态的li的hover效果
				  
				  if(isScroll){
					  var pic_left = pic_w * i;
					  $picWrap.animate({"left": -pic_left });
					  if(isAuto){
						  clearTimeout(st);
						  st = setInterval("VJ_slideScroll_autoPlay()",auto_time);
					  }
				  }else{
					  if($pic.eq(i).css("z-index")!=z_index1)
					  $pic.fadeOut(500).css("z-index",z_index0).eq(i).css("z-index",z_index1).fadeIn(500);
						  if(isAuto){
							  clearTimeout(st);
							  st = setInterval("VJ_slideFade_autoPlay()",auto_time);
						  }
				  }
			  } 
			  
			  $li.each(function(index){     //绑定li的click事件
				  $(this).click(function(){
					  cirNum = index;
					  changeimg(index);
				  })
		  })
		  
		  if(isArrow){      //左右箭头按钮
			  var $arrows = $("<span></span><span></span>");
			  $arrows.eq(0).addClass(arrow_left).css({"left":arrow_margin}).click(function(){ cirNum-=2; changeimg(cirNum);});
			  $arrows.eq(1).addClass(arrow_right).css({"right":arrow_margin}).click(function(){ changeimg(cirNum);});
			  $arrows.css({"display":"block","position":"absolute","z-index":z_index3,"cursor":"pointer","opacity":"0.7"}).appendTo(this);
			  $arrows.hover(function(){$(this).css("opacity","1");},function(){$(this).css("opacity","0.7")});
			  var arrow_t = pic_h/2 - $arrows.eq(0).height()/2;  //左右两箭头距离顶部的高度，默认居中
			  
			  $arrows.css("top",arrow_t+"px");
		  }
		  
		  if(isAuto){
			VJ_slideFade_autoPlay = function(){  //自动播放函数（全局）
					changeimg(cirNum);
				}
			st = setInterval("VJ_slideFade_autoPlay()",auto_time);
		  }
		  $(window).on("resize",function(){UlMiddle();});
  
	  }
  
	  //模态窗口模块
	  $.VJ_Dialog = function(clicked_obj,show_obj,close_elm,m_left,m_top,open_fun){
		  var $black_modalback = $("<div></div>");
		  var $show_obj = $(show_obj);
		  var so_padding = $show_obj.css("padding").replace("px",""); 
		  var isOpenFun = typeof m_left==="function"?m_left:typeof m_top==="function"?m_top:typeof open_fun==="function"?open_fun:!1;
		  $(clicked_obj).click(function(){
			  $black_modalback.appendTo($("body"));
			  var body_h = $("body").height();
			  $show_obj.appendTo($("body")).css({"position":"absolute","z-index":z_index5}).fadeIn();
			  $black_modalback.css({"position":"absolute","width":"100%","height":body_h,"background-color":"black","opacity":"0.6","left":"0","top":"0","z-index":z_index4,"display":"none"}).fadeIn();
			  $.VJ_stayCenter(show_obj,so_padding,m_left,m_top);
			  if(isOpenFun!==!1){  //回调
				  isOpenFun();
			  }
			  $(window).resize(function(){
				  if($show_obj.css("display")!=="none"){
					  $.VJ_stayCenter(show_obj,so_padding,m_left,m_top);
				  }
			  });
		  })	
		  $(close_elm).click(function(){
			  $show_obj.hide();
			  $black_modalback.remove();
		  })
	  }
	  
	  //上推效果模块
	  $.fn.VJ_pushUp = function(relative_obj,space){
		  var $ro = $(relative_obj);
		  var space = space?space:0;
		  var $po = $(this);
		  var po_b = $po.css("bottom");
		  var ro_ot = $ro.offset().top;
		  var dealPush = function(){
			  var winh = $.VJ_getWin().h, wint =  $.VJ_getWin().t;
			  if( winh + wint >= ro_ot ){
				  var thebottom = winh +  wint - ro_ot + space;
				  $po.css("bottom",thebottom);
			  }else{
				  $po.css("bottom",po_b);
			  }
		  }
		  dealPush();
		  $(window).on("scroll resize",dealPush);
	  }
	  
	  //上推效果模块
	  $.fn.VJ_pin = function(relative_obj,space){
		  var $r_o = relative_obj?$(relative_obj):false;
		  var $p_o = $(this);
		  var space = space?space:0;
		  var ro_bt = relative_obj?$r_o.height() + $r_o.offset().top:0;
		  var ro_t = relative_obj?$r_o.offset().top:0;
		  var po_f = $p_o.css("float");
		  var po_p = $p_o.css("position");
		  var po_pd = $p_o.css("padding").replace("px","");
		  var po_w = $p_o.width()-po_pd;
		  var po_h = $p_o.height()-po_pd;
		  var po_t = $p_o.offset().top;
		  var $wrap = $("<div></div>");
		  $wrap.css({"width":po_w,"height":po_h,"float":po_f,"position":po_p});
		  $p_o.css({"width":po_w,"height":po_h});
		  $p_o.wrap($wrap);
		  var dealPin = function(){
			  var thetop;
			  var top1 = ro_bt - po_t - po_h;
			  var top2 = ro_t - po_t - po_h - space;
			  var wint =  $.VJ_getWin().t;
			  if(!$r_o){
				  if(po_t<wint){
					  var thetop = wint - po_t;
					  $p_o.css({"top":"0px","position":"fixed"});
				  }else{
					  $p_o.css({"top":"auto","position":po_p});
				  }
			  }else{ //有relative_obj参数的时候
			  		if($p_o.closest(relative_obj).length > 0){ //relative_obj为祖先元素
						if(po_t<wint && wint+po_h<ro_bt){
							thetop = wint - po_t;
							$p_o.css({"top":"0px","position":"fixed"});
						}else if(wint+po_h>=ro_bt){
							$p_o.css({"top":top1,"position":"relative"});
						}else{
							$p_o.css({"top":"auto","position":po_p});
						}
					}else{   //relative_obj为下方元素
						var winh = $.VJ_getWin().h, wint =  $.VJ_getWin().t;
						if(po_t < wint && winh + wint < ro_t - space){
							var thetop = wint - po_t;
					  		$p_o.css({"top":"0px","position":"fixed"});
						}else if(po_t > wint){
							$p_o.css({"top":"auto","position":po_p});
						}else{
							if(po_h>winh){
								$p_o.css({"top":top2,"position":"relative"});
							}else{
								if(po_h+wint>ro_t - space){
									$p_o.css({"top":top2,"position":"relative"});
								}else{
									$p_o.css({"top":"0px","position":"fixed"});
								}
							}
						}
					}
			  }
		  }
		  dealPin();
		  $(window).on("scroll resize",dealPin);
	  }
  
	  
  })(jQuery);