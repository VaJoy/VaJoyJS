/*VaJoyJS 1.2
Widget based On jQuery and base.css
@author VaJoy Larn 
https://github.com/VaJoy/VaJoyJS
http://vajoy.cnblogs.com
NOTICE:
Here sets the minimum z-index as 1000.
Do not delete here while you are using VaJoyJS
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
	  //获取页面可视区域高度复用
	  $.VJ_getBH = function(){
		  return Math.max($("body").height(),$("html").height());
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
		  var st = null, rd = Math.ceil(Math.random()*10000);
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
						  clearInterval(st);
						  st = setInterval(eval("VJ_slide_autoPlay"+rd),auto_time);
					  }
				  }else{
					  if($pic.eq(i).css("z-index")!=z_index1)
					  $pic.fadeOut(500).css("z-index",z_index0).eq(i).css("z-index",z_index1).fadeIn(500);
						  if(isAuto){
							  clearInterval(st);
							  st = setInterval(eval("VJ_slide_autoPlay"+rd),auto_time);
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
			eval("VJ_slide_autoPlay"+rd+" = function(){ changeimg(cirNum);}"); //动态生成函数，防止setInterval覆盖
			st = setInterval(eval("VJ_slide_autoPlay"+rd),auto_time); 
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
			  var body_h = $.VJ_getBH();
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
		  var thebottom
		  var dealPush = function(){
			  var winh = $.VJ_getWin().h, wint =  $.VJ_getWin().t;
			  if( winh + wint >= ro_ot ){
				  thebottom = winh +  wint - ro_ot + space;
				  $po.css("bottom",thebottom);
			  }else{
				  $po.css("bottom",po_b);
			  }
		  }
		  dealPush();
		  $(window).on("scroll resize",dealPush);
	  }
	  
	  //钉子模块
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
							}else if(po_h+wint>ro_t - space){
								  $p_o.css({"top":top2,"position":"relative"});
							 }else{
								  $p_o.css({"top":"0px","position":"fixed"});
							 }
						}
					}
			  }
		  }
		  dealPin();
		  $(window).on("scroll resize",dealPin);
	  }
	  
	  //表单过滤模块
	  $.fn.VJ_filter = function(issus){ 
		  var $input = $(this);
		  var theval = "";
		  var dealRepalce = function(obj,reg){
			  var patt = new RegExp(reg);
			  if(patt.test(obj.val())){
				  theval = obj.val().replace(reg,"");
				  obj.val(theval);
			  }
		  }
		  $input.keyup(function(){
			  switch(issus){
				  case "chi": 
					  dealRepalce($(this),/[\u4e00-\u9fa5]/g);  //过滤汉字
					  break;
				  case "db": 
					  dealRepalce($(this),/[^\x00-\xff]/g);  //过滤含汉字在内的双字节字符
					  break;
				  case "spe": 
					  dealRepalce($(this),/[^0-9a-zA-Z\u4e00-\u9fa5\-\_\.@#,\/\\\|\$\%\^\&\*\(\)\~\`\"\+\=\[\]\{\}\<\>\?\!\;\:，。？！：；“”《》｛｝—（）￥…·、～]/g);  //过滤特殊字符
					  break;
				  case "only_c": 
					  dealRepalce($(this),/[^\u4e00-\u9fa5]/g);  //过滤除汉字外的字符
					  break;
				  case "only_e": 
					  dealRepalce($(this),/[^a-zA-Z]/g);  //过滤英文外的字符
					  break;
				  case "only_n": 
					  dealRepalce($(this),/[^0-9]/g);  //过滤正整数外的字符
					  break;
				  case "only_fn": 
					  dealRepalce($(this),/^\.|[^\d\.]|\d*\.\d*\./g);  //过滤正浮点数外的字符
				  case "only_nn": 
					  dealRepalce($(this),/^[^\d\-]|[\d\-]{1}[^\d]+/g);  //过滤整数（含负数）外的字符
					  break;
				  case "only_nfn": 
					  dealRepalce($(this),/^[^\d\-]|[^\d\.\-]|\-{0,1}\d+\.\d*\.|\-{0,1}\d+\.{0,1}\-/g);  //过滤浮点数（含负数）外的字符
					  break;
				  case "only_e_n": 
					  dealRepalce($(this),/[^0-9a-zA-Z]/g);  //过滤数字和英文外的字符
					  break;
				  case "only_e_c_n": 
					  dealRepalce($(this),/[^0-9a-zA-Z\u4e00-\u9fa5]/g);  //过滤除英文、汉字、数字外的字符
					  break;
				  case "only_name": 
					  dealRepalce($(this),/[^0-9a-zA-Z\u4e00-\u9fa5\-\_]/g);  //过滤除英文、汉字、数字、_-外的字符
					  break;
				  case "only_ename": 
					  dealRepalce($(this),/[^0-9a-zA-Z\u4e00-\u9fa5\-\_\.@]|\w*@\w*@/g);  //过滤除英文、汉字、数字、_-@.外的字符（匹配邮箱）
					  break;
				  case "only_mail": 
					  dealRepalce($(this),/[^0-9a-zA-Z\_\.\@]|\w*@\w*@/g);  //过滤邮箱外的字符
					  break;
				  case "only_tel": 
					  dealRepalce($(this),/[^\d\-]|\d{3,4}\-\d*\-|\d{4}\d+\-|\d{9}/g);  //过滤电话格式（含-）外的字符
					  break;
				  case "only_mobile": 
					  dealRepalce($(this),/[^\d]|\d{12}/g);  //过滤手机号码
					  break;
				  default: 
					  return false;
					  break;
			  }
		  })
	  }
	  //表单验证模块
	  $.fn.VJ_verify = function(issus,error_fun,correct_fun,empty_fun,fill_fun){
		   var $input = $(this);
		   var e_fun = error_fun;
		   var c_fun = correct_fun?correct_fun:!1;
		   var ep_fun = empty_fun?empty_fun:!1;
		   var f_fun = fill_fun?fill_fun:!1;
		   var is_ctn = !0;
		   var dealEmpty = function(obj,e_fun,c_fun){
			   if(!obj.val()){
				   e_fun();
				   return false;
			   }else if(c_fun){
					c_fun();	
			   }
			   return true;
		   }
		   var dealVeri = function(obj,reg,e_fun,c_fun,ep_fun,f_fun){
			    var patt = new RegExp(reg);
				if(!patt.test(obj.val())){
					e_fun();
					return false;
				}else if(c_fun){
					if(ep_fun) is_ctn=dealEmpty(obj,ep_fun,f_fun);
					if(is_ctn) c_fun();
					is_ctn = !0;
				}
		   }
		   var dealVeri2 = function(obj,reg,e_fun,c_fun,ep_fun,f_fun){ 
			    var patt = new RegExp(reg);
				if(patt.test(obj.val())){
					e_fun();
					return false;
				}else if(c_fun){
					if(ep_fun) is_ctn=dealEmpty(obj,ep_fun,f_fun);
					if(is_ctn) c_fun();
					is_ctn = !0;
				}
		   }
		   $input.blur(function(){
			    switch(issus){
				  case "mail": 
					  dealVeri($(this),/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配邮箱
					  break;
				  case "mobile": 
					  dealVeri($(this),/^(13[0-9]|15[0|3|6|7|8|9]|18[0|5|6|7|8|9])\d{8}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配手机
					  break;
				  case "tel_area": 
					  dealVeri($(this),/^\d{3,4}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配区号
					  break;
				  case "tel": 
					  dealVeri($(this),/^\d{7,8}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配电话号码
					  break;
				  case "tel_all": 
					  dealVeri($(this),/^\d{3,4}\-\d{7,8}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配完整电话，如010-8888788
					  break;
				  case "iden": 
					  dealVeri($(this), /^\d{15}$|^\d{17}[0-9xX]$/,e_fun,c_fun,ep_fun,f_fun);  //匹配身份证号
					  break;
				  case "zip": 
					  dealVeri($(this),/^[1-9][0-9]{5}$/,e_fun,c_fun,ep_fun,f_fun);  //匹配邮编
					  break;
				  case "ip": 
					  dealVeri($(this),/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,e_fun,c_fun,ep_fun,f_fun);  //匹配ip地址
					  break;
				  case "avoid_num": 
					  dealVeri2($(this),/^\d+$/,e_fun,c_fun,ep_fun,f_fun);  //禁止纯数字
					  break;
				  case "avoid_en": 
					  dealVeri2($(this),/^[a-zA-Z]+$/,e_fun,c_fun,ep_fun,f_fun);  //禁止纯英文
					  break;
				  case "empty": 
					  dealEmpty($(this),e_fun,c_fun);  //为空处理（这块主要是处理仅要求不能为空的字段）
					  break;
				  default: 
				  	  if(typeof issus === "number"){    //匹配位数
					    var thelen =  $(this).val().replace(/[^\x00-\xff]/g,"**").length; 
					  	if(typeof e_fun !== "number"){  //只有下限
							if(thelen<issus){ 
								e_fun();
							}else if(c_fun){
								c_fun();
							}
						}else{  //含有上限
							if(e_fun<thelen||thelen<issus){ 
								c_fun();
							}else if(ep_fun){
								ep_fun();
							}
						}
					  }else return false;
					  break;
			   }
		   })
	  }
	  //取消滚轮事件
	  $.VJ_unMouseScroll = function(scrollFun){
		  if(document.addEventListener){ 
		  	document.removeEventListener('DOMMouseScroll',scrollFun,false); 
		  }
		  window.onmousewheel=document.onmousewheel= null; 
	  }
	  //鼠标滚轮事件1 按照滚动几小轮算一次有效滚动来防抖
	  $.VJ_mouseScroll = function(up_fun,down_fun,sp){
		  var up_fun = up_fun?up_fun:!1;
		  var down_fun = down_fun?down_fun:!1;
		  var sp = sp?sp:7;    //默认滚动7小轮为一次有效滚动
		  var shake_proof = 0;  //防抖
		  if(typeof sp==="number"){
			  var scrollFunc=function(e){ 
				e=e || window.event; 
				if(e.wheelDelta){//IE/Opera/Chrome 
					shake_proof++;
					if(e.wheelDelta==120&&shake_proof>=sp)
					{
						if(up_fun) up_fun();
						shake_proof=0;
					}
					else if(shake_proof==sp){		
						if(down_fun) down_fun();
						shake_proof=0;
					 } 
				}else if(e.detail){//Firefox 
					shake_proof++;
					if(e.detail==-3&&shake_proof>=sp){
						if(up_fun) up_fun();
						shake_proof=0;
					}else if(shake_proof>=sp){ 
						if(down_fun) down_fun();
						shake_proof=0;
					} 
				}
			  }
			  if(document.addEventListener){ 
				document.addEventListener('DOMMouseScroll',scrollFunc,false); 
			  }
			  window.onmousewheel=document.onmousewheel=scrollFunc;
		  }else{
			  $.VJ_unMouseScroll(scrollFunc);
		  }
	  }
	  //鼠标滚轮事件2 用setTimeOut来防抖
	  $.VJ_mouseScroll2 = function(up_fun,down_fun,st){
		  var up_fun = up_fun?up_fun:!1;
		  var down_fun = down_fun?down_fun:!1;
		  var st = st?st:1000;  //默认1秒
		  if(typeof st==="number"){
			  var stopAndCall = function(){
				  $.VJ_unMouseScroll(scrollFunc);
				  setTimeout(function(){
					  $.VJ_mouseScroll2(up_fun,down_fun,st);
				  },st);
			  }
			  function scrollFunc(e){ 
				e=e || window.event; 
				if(e.wheelDelta){//IE/Opera/Chrome 
					if(e.wheelDelta==120)
					{
						if(up_fun) up_fun();
						stopAndCall();
					}
					else{		
						if(down_fun) down_fun();
						stopAndCall();
					 } 
				}else if(e.detail){//Firefox 
					if(e.detail==-3){
						if(up_fun) up_fun();
						stopAndCall();
					}else{ 
						if(down_fun) down_fun();
						stopAndCall();
					} 
				}
			  }
			  if(document.addEventListener){ 
				document.addEventListener('DOMMouseScroll',scrollFunc,false); 
			  }
			  window.onmousewheel=document.onmousewheel=scrollFunc;
		  }else{
			  $.VJ_unMouseScroll(scrollFunc);
		  }
	  }
	  
	  //滚页效果模块
	  $.fn.VJ_scrollPage = function(wrap,callback_prefix,reset_prefix,cssname){
		  var a_index=0,thetop,win_h;
		  var c_prefix = callback_prefix?callback_prefix:"";
		  var r_prefix = reset_prefix?reset_prefix:"";
		  var cssname = cssname?cssname:"";
		  var $a = $(this);
		  var a_len = $a.length;
		  var $wrap = $(wrap);
		  var $pages = $wrap.children();
		  var $moveWrap = $("<div></div>");
		  $moveWrap.css({"position":"relative","height":"100%"});
		  $pages.wrapAll($moveWrap);
		  $a.click(function(){
			  a_index = $a.index(this);
			  if(cssname){
				  $(this).addClass(cssname).siblings("a").removeClass(cssname);
			  }
			  thetop = a_index * win_h;
			  $pages.parent().stop().animate({"top":-thetop},600,  //默认切页时间600毫秒
				function(){  //animate结束后的回调
					hasfun = eval("typeof "+c_prefix+a_index+"==='function'"); 
					if(hasfun){
						eval("page"+a_index+"()");  //如果有回调函数则执行该函数
					} 
					for(var i=0;i<a_len;i++){ 
						if(i==a_index) continue;
						hasfun = eval("typeof "+r_prefix+i+"==='function'"); 
						if(hasfun){ 
						eval("reset"+i+"()");  //如果有其它page初始化函数则执行该函数
						}
					}
				}
			  );
		  }) 
		  var setHeight = function(){
			win_h = $.VJ_getWin().h;
			$a.eq(a_index).click();
		  }
		  setHeight();
		  $(window).on("resize",setHeight);
		  var up_fun = function(){  //鼠标滚轮UP事件
			  if(a_index>0){
				  var temp = a_index-1;
				  $a.eq(temp).click();
			  }
		  }
		  var down_fun = function(){  //鼠标滚轮DOWN事件
			  if(a_len-1>a_index){
				  var temp = a_index+1;
				  $a.eq(temp).click();
			  }
		  }
		  $.VJ_mouseScroll2(up_fun,down_fun);
	  }
	  
	  //识别是否万恶的IE
	  $.VJ_isIE = function(){
		  var ua = navigator.userAgent.toLowerCase();
		  var iereg = new RegExp("trident","gi");
		  return iereg.test(ua);
	  }
	  
  
	  
  })(jQuery);