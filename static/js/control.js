function $(selector){
    return new Pointer(selector);
}

class Pointer{
    constructor(selector){
        this.node = document.querySelector(selector);
    }

    get html(){
        if(this.node.innerHTML)
            return this.node.innerHTML;
        else
            return '';
    }

    html(value){
        this.node.innerHTML = value;
    }

    attribute(key, value){
        this.node.setAttribute(key, value);
    }

    event(type, method, parameter = null){
        this.node.addEventListener(type, method);
        this.node.parameter = parameter;
    }

}

function setOption(option){
    if(option == 0){
        $('#option-part').attribute('class', 'choose');
        $('#option-all').attribute('class', 'not-choose');
        $('#option-all').event('click', function(){
            setOption(1);
        })

        // display something
    }

    if(option == 1){
        $('#option-all').attribute('class', 'choose');
        $('#option-part').attribute('class', 'not-choose');
        $('#option-part').event('click', function(){
            setOption(0);
        })

        // display something
    }
}


window.onload = function(){
    setOption(0);
}