
function interface_select(){

    $('#check').hide();
    $('#cancel').show();
    $('#transfer').show();
    $('#restart').show();

    $('#content').html($('#content').text())
    $('#content').attr('contenteditable', 'False');

    $('#cancel').click(interface_initial);
    $('#restart').click(function(){
        $('#content').html('');
        interface_initial();
    });
    $('#transfer').click(sumbit_article);
    $('body').mouseup(select_article);
    // document.addEventListener('selectionchange', select_article);
    
}

function check_mark(str){
    return str.includes('<mark>') && str.includes('</mark>');
}

function sumbit_article(){

    $('#flash-div').show();

    if(!check_mark($('#content').html())){
        $('#flash').text('尚未選擇句子');
        $('#flash').addClass('danger');
        $('#flash-div').fadeOut(3000);
        return;
    }

    $('#flash').text('轉換句子中，請稍後');
    $('#flash').addClass('success');

    $('#btn-div').hide();
    $('#content').off('mouseup');

    const tid = setInterval(animate_waiting, 400);

    const api_url = "/api";
    var sentences = $('div#content').html();

    var _list = sentences.split('mark>');

    for(const i of _list){
        if(i.endsWith('</'))
            sentences = i.replaceAll('</','');
    }

    $.ajax({
        url: api_url,
        type: 'post',
        async: true,
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({'sentence': sentences.trim()}),
        datatype: 'json',
        success: function(response){

            clearInterval(tid);
            $('#flash').text('轉換完成');
            $('#flash-div').fadeOut(3000);

            $('#container').slideDown("slow");

            var count_i = 0, count_j = 0;

            $('div#content').html($('#content').text());

            for(var i in response){

                count_j = 0;
                $('#container').append('<li id="sentence-' + count_i.toString() + '"><span id="option-' + count_i.toString() + '">' + i + '</span><hr>');

                for(var j of response[i]){
                    $('#container').append('<div class="list list-' + count_i.toString() + '"><input id="select-'  + count_i.toString() + '-' + count_j.toString() + '" type="radio" name="select-' + + count_i.toString() + '" value="select-' + + count_i.toString() + '-' + count_j.toString() + '"><label for="select-'  + count_i.toString() + '-' + count_j.toString() + '">' + j + '</label></div>');
                    count_j ++;
                }

                var _txt = '<div class="button-div"><button class="btn-replace" id="sumbit-' + count_i.toString() + '">取代</button>';
                _txt += '<button class="btn-origin" id="cancel-' + count_i.toString() + '">使用原句</button></div></div></li>';

                $('#container').append(_txt)
                $('#option-' + count_i.toString()).click({num: count_i}, function(event){
                    var num = event.data.num;
                    var text = $('div#content').text();
                    const subString = $('#option-'+num.toString()).text();
                    text = text.replaceAll(subString, '<mark>' + subString + '</mark>')
                    $('div#content').html(text);
                })

                $('#sumbit-' + count_i.toString()).click({num: count_i, str: i},function(event){

                    var num = event.data.num;
                    var str = event.data.str;

                    var iz_checked = false;
                    console.log(iz_checked);
                    $('input[name="select-' + num.toString() +'"]').each(function(){
                        iz_checked = iz_checked || $(this).is(':checked');
                        console.log(iz_checked)
                    });
                    if ( ! iz_checked ){
                        alert('未選取任何句子')
                        return;
                    }

                    const selected = $('input[name="select-' + num.toString() +'"]').val();
                    var replace_num = parseInt(selected.split('-').pop());
                    var text = $('div#content').text();
                    const subString = str;
                    text = text.replaceAll(subString, response[str][replace_num]);
                    $('div#content').html(text);

                    $(this).parent().remove();

                    var list = $('.list-' + num.toString());
                    var length = list.length
                    for(var i=0 ; i< length ; i++)
                        list[i].remove();

                    $('#sentence-'+num.toString()).remove();

                    $('div#content').html($('#content').text());

                    if($('#container').text().replaceAll('\n','').replaceAll(' ', '').length == 0){
                        $('#content').mouseup(select_article);
                        $('#btn-div').show();
                    }
                        
                })

                $('#cancel-' + count_i.toString()).click({num: count_i}, function(event){

                    var num = event.data.num;

                    $(this).parent().remove();

                    var list = $('.list-' + num.toString());
                    var length = list.length
                    for(var i=0 ; i< length ; i++)
                        list[i].remove();

                    $('#sentence-'+num.toString()).remove();

                    $('div#content').html($('#content').text());

                    if($('#container').text().replaceAll('\n','').replaceAll(' ', '').length == 0){
                        $('#content').mouseup(select_article);
                        $('#btn-div').show();
                    }
                        
                })

                count_i ++;
            }

            if($('#container').text().replaceAll('\n','').replaceAll(' ', '').length == 0){
                $('#content').mouseup(select_article);
                $('#btn-div').show();
            }
            
            
        },
        error: function(error){
            alert('發生錯誤，請盡快與我們聯繫');
        },
        complete: function(){
        }
    })


}

function animate_waiting(){

    console.log($('#flash').text());

    if($('#flash').text() === '轉換句子中，請稍後')
        $('#flash').text('轉換句子中，請稍後 •');
    else if($('#flash').text() === '轉換句子中，請稍後 •')
        $('#flash').text('轉換句子中，請稍後 • •');
    else if($('#flash').text() === '轉換句子中，請稍後 • •')
        $('#flash').text('轉換句子中，請稍後 • • •');
    else if($('#flash').text() === '轉換句子中，請稍後 • • •')
        $('#flash').text('轉換句子中，請稍後');

}



function select_article(){

    const selection = document.getSelection();

    if(selection.type != "Range")
        return;

    const subString = selection.toString();

    if(!$('#content').text().includes(subString))
        return;
    
    var text = $('div#content').text();
    text = text.replaceAll(subString, '<mark>' + subString + '</mark>')

    $('div#content').html(text);
    
}

function clear_mark(){
    var text = $('#content').html()

    text = text.replaceAll('<mark>', '');
    text = text.replaceAll('</mark>', '');
    $('#content').html(text);
}

function interface_initial(){

    $('#check').show();
    $('#cancel').hide();
    $('#transfer').hide();
    $('#restart').hide();
    $('#flash-div').hide();
    $('#container').hide();

    $('#check').unbind();
    $('#cancel').unbind();
    $('#transfer').unbind();
    $('#restart').unbind();
    
    $('#check').click(interface_select);
    $('#content').attr('contenteditable', 'True');

    var text = $('#content').html()

    text = text.replaceAll('<mark>', '');
    text = text.replaceAll('</mark>', '');
    $('#content').html(text);

    clear_mark();

    $('#content').on('paste',function(e){
        var paste_text = e.originalEvent.clipboardData.getData('text')
        e.preventDefault()
        $(this).html(paste_text)
    })

    
    
}

function btn_disable(selector, bool){

    if(bool){
        $(selector).attr('disable', true);
        $(selector).addClass('disable');
    }
    else{
        $(selector).attr('disable', false);
        $(selector).removeClass('disable');
    }

}


window.onload = function(){
    interface_initial();
}