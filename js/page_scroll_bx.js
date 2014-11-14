/*
** 变量值
*/
	/* 
	** 页面切换的效果控制 
	*/
var Msize = $(".m-page").size(), 	//页面的数目
	page_n			= 1,			//初始页面位置
	initP			= null,			//初值控制值
	moveP			= null,			//每次获取到的值
	firstP			= null,			//第一次获取的值
	newM			= null,			//重新加载的浮层
	p_b				= null,			//方向控制值
	indexP			= null, 		//控制首页不能直接找转到最后一页
	move			= null,			//触摸能滑动页面
	start			= true, 		//控制动画开始
	startM			= null,			//开始移动
	position		= null,			//方向值
	DNmove			= false,		//其他操作不让页面切换
	mapS			= null,			//地图变量值
	canmove			= false,		//首页返回最后一页
	
	textNode		= [],			//文本对象
	winHeight       = $(window).height(),
	textInt			= 1;			//文本对象顺序
	

	

/* 
** 单页切换 各个元素fixed 控制body高度 
*/
	var v_h	= null;		//记录设备的高度
	
	function init_pageH(){
		var fn_h = function() {
			if(document.compatMode == "BackCompat")
				var Node = document.body;
			else
				var Node = document.documentElement;
			 return Math.max(Node.scrollHeight,Node.clientHeight);
		}
		var page_h = fn_h();
		var m_h = $(".m-page").height();
		page_h >= m_h ? v_h = page_h : v_h = m_h ;
		
		//设置各种模块页面的高度，扩展到整个屏幕高度
		$(".m-page").height(v_h); 	
		$(".p-index").height(v_h);
		
	};
	init_pageH();

	

/*
**模版切换页面的效果
*/
	//绑定事件
	function changeOpen(e){
		$(".m-page").on('mousedown touchstart',page_touchstart);
		$(".m-page").on('mousemove touchmove',page_touchmove);
		$(".m-page").on('mouseup touchend mouseout',page_touchend);

	};
	
	//取消绑定事件
	function changeClose(e){
		$(".m-page").off('mousedown touchstart');
		$(".m-page").off('mousemove touchmove');
		$(".m-page").off('mouseup touchend mouseout');

	};
	
	//开启事件绑定滑动
	changeOpen();
	
	//触摸（鼠标按下）开始函数
	function page_touchstart(e){
		if (e.type == "touchstart") {
			initP = window.event.touches[0].pageY;
		} else {
			initP = e.y || e.pageY;
			mousedown = true;
		}
		firstP = initP;	
	};
	
	//插件获取触摸的值
	function V_start(val){
		initP = val;
		mousedown = true;
		firstP = initP;		
	};
	
	//触摸移动（鼠标移动）开始函数
	function page_touchmove(e){
		e.preventDefault();
		e.stopPropagation();	
        var imgs = $(".m-img").length;

		//判断是否开始或者在移动中获取值
		if(start||startM){
			startM = true;
			if (e.type == "touchmove") {
				moveP = window.event.touches[0].pageY;
			} else { 
				if(mousedown) moveP = e.y || e.pageY;
			}
			page_n == 1 ? indexP = false : indexP = true ;	//true 为不是第一页 false为第一页
		}
		
		//设置一个页面开始移动
		if(moveP&&startM&&imgs>1){
			
			//判断方向并让一个页面出现开始移动
			if(!p_b){
				p_b = true;
				position = moveP - initP > 0 ? true : false;	//true 为向下滑动 false 为向上滑动
				if(position){
				//向下移动
					if(indexP){								
						newM = page_n - 1 ;
						$(".m-page").eq(newM-1).addClass("active").css("top",-v_h);
						move = true ;
					}else{
						if(canmove){
							move = true;
							newM = Msize;
							$(".m-page").eq(newM-1).addClass("active").css("top",-v_h);
						}
						else move = false;
					}
							
				}else{
				//向上移动
					if(page_n != Msize){
						if(!indexP) $('.audio_txt').addClass('close');
						newM = page_n + 1 ;
					}else{
						newM = 1 ;
					}
					$(".m-page").eq(newM-1).addClass("active").css("top",v_h);
					move = true ;
				} 
			}
			
			//根据移动设置页面的值
			if(!DNmove){
				//滑动带动页面滑动
				if(move){	
					
				
					//移动中设置页面的值（top）
					start = false;
					var topV = parseInt($(".m-page").eq(newM-1).css("top"));
					$(".m-page").eq(newM-1).css({'top':topV+moveP-initP});	
					
				    if(topV+moveP-initP>0){//向上
					   var bn1 = winHeight-(topV+moveP-initP);
					   var bn2 = ((winHeight-bn1/4)/winHeight);
                       $(".m-page").eq(newM-2).attr("style","-webkit-transform:translate(0px,-"+bn1/4+"px) scale("+bn2+")");
				    }else{//向下
					   var bn3 = winHeight+(topV+moveP-initP);
					   var bn4 = ((winHeight-bn3/4)/winHeight);
					   if(Msize!=newM){
                         $(".m-page").eq(newM).attr("style","-webkit-transform:translate(0px,"+bn3/4+"px) scale("+bn4+")");
					   }else{
						 $(".m-page").eq(0).attr("style","-webkit-transform:translate(0px,"+bn3/4+"px) scale("+bn4+")");  	
					   }  
				    }
					initP = moveP;
				}else{
					moveP = null;	
				}
			}else{
				console.log('2')
				moveP = null;	
			}
		}
	};

	//触摸结束（鼠标起来或者离开元素）开始函数
	function page_touchend(e){	
			
		//结束控制页面
		startM =null;
		p_b = false;
		
		
		//判断移动的方向
		var move_p;	
		position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100 ;
		if(move){
			//切画页面(移动成功)
			if( move_p && Math.abs(moveP) >5 ){	
				$(".m-page").eq(newM-1).animate({'top':0},300,"easeOutSine",function(){
					/*
					** 切换成功回调的函数
					*/
					success();
					$(".m-page").attr("style","");
				})
			//返回页面(移动失败)
			}else if (Math.abs(moveP) >=5){	//页面退回去
				position ? $(".m-page").eq(newM-1).animate({'top':-v_h},100,"easeOutSine") : $(".m-page").eq(newM-1).animate({'top':v_h},100,"easeOutSine");
				$(".m-page").attr("style","");
				$(".m-page").eq(newM-1).removeClass("active");
				start = true;
				$(".m-page").attr("style","");
			}
		}
		/* 初始化值 */
		initP		= null,			//初值控制值
		moveP		= null,			//每次获取到的值
		firstP		= null,			//第一次获取的值
		mousedown	= null;			//取消鼠标按下的控制值
	};
/*
** 切换成功的函数
*/
	function success(){
		/*
		** 切换成功回调的函数
		*/							
		//设置页面的出现
		$(".m-page").eq(page_n-1).removeClass("show active").addClass("hide");
		$(".m-page").eq(newM-1).removeClass("active hide").addClass("show");
		
		
		//重新设置页面移动的控制值
		page_n = newM;
		start = true;
		
		//判断是不是最后一页，出现提示文字
		if(page_n == Msize) {
			canmove = true;
			$('.u-arrow').hide();
		}else{
			$('.u-arrow').show();
		}
		
	}




/*
**设备旋转提示
*/
	$(function(){
		var bd = $(document.body);
		window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', _orientationchange, false);
		function _orientationchange() {
			scrollTo(0, 1);
			switch(window.orientation){
				case 0:		//横屏
					bd.addClass("landscape").removeClass("portrait");
					init_pageH();					
					break;
				case 180:	//横屏
					bd.addClass("landscape").removeClass("portrait");	
					init_pageH();
					break;
				case -90: 	//竖屏
					init_pageH();
					break;
				case 90: 	//竖屏
					init_pageH();
					bd.addClass("portrait").removeClass("landscape");
					break;
			}
		}
		$(window).on('load',_orientationchange);
	});




/*
** 页面加载初始化
*/
	var input_focus = false;
	function initPage(){
		//初始化一个页面
		$(".m-page").addClass("hide").eq(page_n-1).addClass("show").removeClass("hide");
		//PC端图片点击不产生拖拽
		$(document.body).find("img").on("mousedown",function(e){
			e.preventDefault();
		})	
		//调试图片的尺寸
		if(RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)) $('.m-page').css('height','101%');
	}(initPage());



