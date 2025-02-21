var order = 0;
    var wid=30;
    var cancel_arr = [];
    $(document).ready(function(){
        //초기 화면 출력
        var line = 20;
        var spots = (line+2)*(line+2);
        for(i=0;i<line;i++){
            $(".omok__ground").append("<span class='omok__line type-colmn' style='left:"+(wid*(i+1))+"px'></span><span class='omok__line type-row' style='top:"+(wid*(i+1))+"px'></span>");
        }
        var num=0;
        var left=0;
        for(j=0;j<spots;j++){
            if(Math.floor(j%22) == 0){
                num++;
                left=0;
            }
            if(j <= (22*num)){
                left++;
                $(".omok__ground").append("<span class='omok__stone' style='left:"+((left-1)*wid)+"px;top:"+((num-1)*wid)+"px;' id='"+j+"'>"+j+"</span>");
            }
        }
    });
    //게임실행
    $(document).on("click",".omok__stone",function(){
        if($(this).hasClass("type-blk") || $(this).hasClass("type-wht")){
        }else{
            order++;
            if(order%2){//짝수면 흑돌
                $(this).addClass("type-blk");
                var su_blk = Number($(this).text());
                check_v(this,"blk");//승리체커
                $(".omok__order").html("백돌차례");
            }else{//홀수면 백돌
                $(this).addClass("type-wht");
                var su_wht = Number($(this).text());
                check_v(this,"wht");//승리체커
                $(".omok__order").html("흑돌차례");
            }
        }
    });
    //승패계산
    function check_v(this_ele,which){
        var say;
        if(which == "blk"){
            which = "type-blk";
            say = "흑돌승리";
        }else{
            which = "type-wht";
            say = "백돌승리";
        }
        var this_idx = Number($(this_ele).attr("id"));

        cancel_arr.push(this_idx);//취소버튼 실행을 위한 idx 저장
        var victory_num = 0;
        var num_arr = [21,22,23,1];
        for(k=0;k<num_arr.length;k++){
            victory_num = 0;
            for(i=-1;i>-5;i--){
                var idx = this_idx+ i*(num_arr[k]);
                if($(".omok__stone").eq(idx).hasClass(which)){
                    victory_num++;
                    victory(victory_num,say);
                }else{break;}
            }
            for(j=1;j<5;j++){
                var idx = this_idx + j*(num_arr[k]);
                if($(".omok__stone").eq(idx).hasClass(which)){
                    victory_num++;
                    victory(victory_num,say);
                }else{break;}
            }
        }
    }
    function victory(victory_num,say){
        if(victory_num == 4){
            $(".omok__mak").addClass("type-end").append("<p>"+say+"<p><button class='omok__reset'>재시작</button>");
        }
    }
    //재시작
    $(document).on("click",".omok__reset",function(){
        $(".omok").find(".type-blk").each(function(){
            $(this).removeClass("type-blk");
        });
        $(".omok").find(".type-wht").each(function(){
            $(this).removeClass("type-wht");
        });
        order = 0;
        cancel_arr = [];
        $(".omok__mak").removeClass("type-end").html("");
        $(".omok__order").text("흑돌차례");
    })
    //취소
    $(".omok__cancel").click(function(){
        var last_idx = cancel_arr.pop();
        var who = $(".omok__stone").eq(last_idx);
        if($(who).hasClass("type-blk")){
            $(who).removeClass("type-blk");
            $(".omok__order").text("흑돌차례");
            order = 0;
        }else{
            $(who).removeClass("type-wht");
            $(".omok__order").text("백돌차례");
            order = 1;
        }
    });