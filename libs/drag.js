/* 
 * doubleCaptcha 1.0
 * created by zyh 
 * 2016.12.21
 * 拖动滑块(修改自tony@jentian.com) + 中文点击图片验证码
 * 
 */
(function($){
    $.fn.doubleCaptcha = function(options){
        var x, 
            drag = this, 
            isMove = false, 
            defaults = {
                clickCaptchaURL:"", 
                calllback: function (data) {// 校验成功回调

                }
            };
        var options = $.extend(defaults, options);

        
        var handler,
            drag_bg,
            text,
            maxWidth,
            clickCaptcha, //中文点击图片验证码
            btnRefresh,
            errorInfo;

        function init(){
            inithtml();

            handler = drag.find('.handler');
            drag_bg = drag.find('.drag_bg');
            text = drag.find('.drag_text span');
            clickCaptcha = drag.find('.clickCaptcha');
            errorInfo = drag.find('.errorInfo');
            btnRefresh = drag.find('.btn_refresh');

            maxWidth = drag.width() - handler.width();  //能滑动的最大间距
            
            clickCaptcha.hide();
            drag.addClass("unchecked");

            dragEvent();
        }
       
        function inithtml(){
                    //添加背景，文字，滑块
            var html = '<div class="drag_bg"></div>'+
                            '<div class="drag_text slidetounlock" onselectstart="return false;" unselectable="on">'+
                                '<span class="_text">拖动滑块验证</span>'+
                            '</div>'+
                        '<div class="handler handler_bg"></div>'+
                        '<div class="clickCaptcha">'+
                            '<div class="clickCaptcha-top">'+
                                '<span class="errorInfo">点击错误，请重新输入'+'</span>'+
                                '<span class="btn_refresh"></span>'+
                            '</div>'+
                            '<img  id="clickCaptchaCode" src="" alt="中文点击图片验证码" width="200" height="200">'+
                        '</div>';
            drag.append(html);         
        }

        function dragEvent(){
            //鼠标按下时候的x轴的位置
            handler.mousedown(function(e){
                isMove = true;
                x = e.pageX - parseInt(handler.css('left'), 10);
            });
            
            //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
            $(document).mousemove(function(e){
                var _x = e.pageX - x;
                if(isMove){
                    if(_x > 0 && _x <= maxWidth){
                        handler.css({'left': _x});
                        drag_bg.css({'width': _x});
                    }else if(_x >maxWidth){  //鼠标指针移动距离达到最大时清空事件
                        handler.css({'left': maxWidth});
                        drag_bg.css({'width': maxWidth});
                        drag.removeClass("unchecked");//消除滑动动画
                        dragOk();
                        dragEventUnbind();    

                        clickCaptchaInit();//调用中文图片二维码    
                        clickCaptchaEvent();

                    }

                }
            }).mouseup(function(e){
                isMove = false;
                var _x = e.pageX - x;
                if(_x < maxWidth){ //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                    handler.css({'left': 0});
                    drag_bg.css({'width': 0});
                }

            })            
        }

        
        //滑动验证成功
        function dragOk(){
            handler.removeClass('handler_bg').addClass('handler_ok_waring');   
            text.html("loading......");      
            text.addClass('drag_text2');
            clickCaptcha.slideDown();
        }

        function clickCaptchaOk(){
            handler.removeClass('handler_ok_waring').addClass('handler_ok_bg');
            text.html('验证通过');
            text.removeClass('drag_text2');
            drag.css({'color': '#fff'});
            clickCaptcha.slideUp();
        }
        function dragEventUnbind(){
            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
        }

        //图片点击验证码 
        function clickCaptchaInit(){
            $.ajax({
                type: "GET",
                url:options.clickCaptchaURL,
                dataType:"json",
                success:function(data){
                    clickCaptchaCode.src = data.result.data[0];//  传给他一个base64的图片格式  
                    text.html("请点击图中的 <i>\""+data.result.tags[0]+"\"</i> 字");     
                    console.log(data)
                },
                error:function(){
                    errorInfo.show();
                }
            })
        }

        function clickCaptchaEvent(){
            //点击图片二维码
            $(clickCaptchaCode).click(function(){
                //判断图片区域点击是否正确
                
                if(true){
                    clickCaptchaOk(); //验证成功
                    options.calllback();
                }else{
                    clickCaptchaInit();
                }
            });

            //刷新
            $(btnRefresh).click(function(){
                clickCaptchaInit();
            });


        }

        init();
    };
})(jQuery);


