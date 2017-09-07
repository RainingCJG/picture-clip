window.onload = function(e){
	//清除开始选中默认行为
	document.onselectstart = function(e){
		e= e || window.event;
		preventEventDefault(e);
	}
	
	//选中裁剪区域
	var selected = getClass("div","select");
	
	//拉伸方向
	var l_top = getClass("span","l-top"),
		t_center = getClass("span","t-center"),
		t_right = getClass("span","t-right"),
		r_center = getClass("span","r-center"),
		r_bottom = getClass("span","r-bottom"),
		b_center = getClass("span","b-center"),
		b_left = getClass("span","b-left"),
		l_center = getClass("span","l-center");
	
	//裁剪方向对象
	var type = {
		first:"l",
		last:"r"
	}
	
	//鼠标拖拽裁剪区域
	addEvent(selected,"mousedown",function(e){
		console.log(selected)
		e= e || window.event;
		drag(selected,e);
	});
	
    /*************鼠标拉伸裁剪区域************/	
    //左上角拉伸
	addEvent(l_top,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"n",last:"l"},selected,pre_mouse);
	});
	//上拉伸
	addEvent(t_center,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"n",last:null},selected,pre_mouse);
	});
	//右上角拉伸
	addEvent(t_right,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"n",last:"r"},selected,pre_mouse);
	});
	//右拉伸
	addEvent(r_center,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:null,last:"r"},selected,pre_mouse);
	});
	//右下角拉伸
	addEvent(r_bottom,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"s",last:"r"},selected,pre_mouse);
	});
	//下拉伸
	addEvent(b_center,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"s",last:null},selected,pre_mouse);
	});
	//左下角拉伸
	addEvent(b_left,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:"s",last:"l"},selected,pre_mouse);
	});
	//左拉伸
	addEvent(l_center,"mousedown",function(e){
		pre_mouse = e||window.event;
		moving({first:null,last:"l"},selected,pre_mouse);
	});
}

//裁剪区域位置移动
function moving(type,dom,pre_mouse){
	preventBubble(pre_mouse);  //阻止事件冒泡
	var pic_clip = document.getElementById("pic-clip"),
	    clipobj = getClass("img","img2"),
	    preview = getClass("img","img3");
	    
	var pre_offsetX = pre_mouse.pageX;
	var pre_offsetY = pre_mouse.pageY;
	
	var bottomH = dom.offsetHeight - 2; 
	var rightW = dom.offsetWidth - 2;
	var offsettop = dom.offsetTop,offsetleft = dom.offsetLeft;
	var pretop = 0,preleft = 0;
	
	//鼠标松开事件
	document.onmouseup = function(){
		document.onmousemove = null;
	};
	
	//鼠标移动事件
	document.onmousemove = function(e){
		e = e || window.event;	 
		var currentoffsetX = e.pageX - pre_offsetX;
		var currentoffsetY = e.pageY - pre_offsetY;
        pre_offsetY = e.pageY;
        pre_offsetX = e.pageX;
        if(type.first === null){  //只有左右方向
        	currentoffsetY = 0;
        }
        if(type.last === null){  //只有上下方向
        	currentoffsetX = 0;
        }
        
		if(type.first === "s"){  //向下拉伸
			if(currentoffsetY > pic_clip.offsetHeight - dom.offsetHeight - dom.offsetTop){
    			currentoffsetY = pic_clip.offsetHeight - dom.offsetHeight - dom.offsetTop;
    		}
		}else if(type.first === "n"){ //向上拉伸
			if(currentoffsetY > bottomH){
	    		currentoffsetY = bottomH;
	    	}
	    	
	    	if(currentoffsetY < -pretop){ 
	    		currentoffsetY = pretop;
	    	}
	    	
	    	currentoffsetY = -currentoffsetY;
	    	dom.style.top = offsettop - currentoffsetY + "px";
	    	offsettop += -currentoffsetY;
	    	pretop = offsettop;
		} 	
      
    	if(type.last === "r"){  //向右拉伸
    		if(currentoffsetX > pic_clip.offsetWidth - dom.offsetWidth - dom.offsetLeft){
    			currentoffsetX = pic_clip.offsetWidth - dom.offsetWidth - dom.offsetLeft;
    		}
    	}else if(type.last === "l"){  //向左拉伸
        	if(currentoffsetX > rightW){
        		currentoffsetX = rightW;
        	}
        	
        	if(currentoffsetX < -preleft){
        		currentoffsetX = preleft;
        	}
        	
        	currentoffsetX = -currentoffsetX;
        	dom.style.left = offsetleft - currentoffsetX + "px";
        	offsetleft += -currentoffsetX;
        	preleft = offsetleft;
    	}
    	
    	dom.style.width = rightW + currentoffsetX + "px";
        rightW = rightW + currentoffsetX; 
       
        dom.style.height = bottomH + currentoffsetY + "px";
        bottomH = bottomH + currentoffsetY; 
        
        picClip(dom,clipobj);
		picClip(dom,preview);
		preview.style.left = -dom.offsetLeft + "px";
        preview.style.top = -dom.offsetTop + "px";
	};
}

//鼠标拖拽函数
function drag(dom,current){
	var pic_clip = document.getElementById("pic-clip"),
		clipobj = getClass("img","img2"),
		preview = getClass("img","img3");
	var confirmX = current.pageX - pic_clip.offsetLeft - dom.offsetLeft;
	var confirmY = current.pageY - pic_clip.offsetTop - dom.offsetTop;

	
	document.onmouseup = function(){
		document.onmousemove = null;
	};
	
	document.onmousemove = function(e){
		e = e||window.event;
		var offsetX = e.pageX - pic_clip.offsetLeft - confirmX;
		var offsetY = e.pageY - pic_clip.offsetTop - confirmY;
		var maxX = pic_clip.offsetWidth - dom.offsetWidth;
		var maxY = pic_clip.offsetHeight - dom.offsetHeight;
		
		if(offsetX < 0){
			offsetX = 0;
		}else if(offsetX > maxX){
			offsetX = maxX;
		}
		
		if(offsetY < 0){
			offsetY = 0;
		}else if(offsetY > maxY){
			offsetY = maxY;
		}
		
		dom.style.left = offsetX + "px";
		dom.style.top = offsetY + "px";
		
		picClip(dom,clipobj);
        picClip(dom,preview);
        preview.style.left = -dom.offsetLeft + "px";
        preview.style.top = -dom.offsetTop + "px";
	}
}

//图片剪切函数
function picClip(dom,clipobj){
	var left = 0,right = 0, bottom = 0,top = 0;
	top = dom.offsetTop;
    bottom = dom.offsetHeight - 2 + top;
    left = dom.offsetLeft;
    right = dom.offsetWidth - 2 + left;
    clipobj.style.clip = "rect("+top+"px,"+right+"px,"+bottom+"px,"+left+"px)";
}

//添加事件监听
function addEvent(obj,type,handle){
	
	if(obj.addEventListener){
		obj.addEventListener(type,handle,false);
	}else if(obj.attachEvent){
		obj.attachEvent("on" + type,handle);
	}else{
		obj["on" + type] = handle;
	}
}

//删除事件(参数依次为对象、类型、函数)
function stopEvent(obj,type,handle){	
	
	if(obj.removeEventListener){//非ie兼容(dom2级)
		obj.removeEventListener(type,handle,false);
	}else if(obj.detachEvent){//ie兼容(dom2级)
		obj.detachEvent("on"+type,handle);
	}else{//低版本ie(dom0级)
		obj["on"+type] = null;
	}
}

//通过类名获取对象
function getClass(tagName,ClassName){
	if(document.getElementsByClassName) //支持这个函数
    {        
    	return document.getElementsByClassName(ClassName)[0];
    }else{
    	var obj = document.getElementsByTagName(tagName);
		for(var i=0; i < obj.length;i++){
			var reg = new RegExp(ClassName);
			if(reg.test(obj[i].className)){
				return obj[i];
			}
		}
		return undefined;
		
    }
};

//阻止事件冒泡(参数为事件)
function preventBubble(event){
	if(event.stopPropagation){//非ie
		event.stopPropagation();
	}else{//ie
		event.cancelBubble = true;
	}
}

//阻止事件默认行为(参数为事件)
function preventEventDefault(event){
	if(event.preventDefault){//非ie
		event.preventDefault();
	}else if(event.returnValue){//ie
		event.returnValue = false;
	}
}
