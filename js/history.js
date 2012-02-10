/*
 * объект сохранения истории
 * */
var History = function(canvas, options) {
    var it = this;

    this.opt = jQuery.extend({
        back: '#back',
        forward: '#forward',
    }, options);

    this.setButtonsState();

    $(document).on('click', this.opt.back,    function() { it.backHistory();    return false });
    $(document).on('click', this.opt.forward, function() { it.forwardHistory(); return false });

    this.canvas = canvas;

    var _selected = {}
    $(document).on('story:add', function(e, data) {
        if(data.type == 'object:selected') { _selected = it.setState(data) };
        if(data.type == 'object:modified') {
            if (_selected.can_el != data.can_el) {
                console.log('History - объекты не равны', _selected.can_el, data.can_el);
            } else {
                History.back.push(_selected);
                History.forward = [];
                _selected = it.setState(data);
            }
            it.setButtonsState();
        }
    });
}

History.back = []; 
History.forward = [];

// Восстанавливает состояние объекта полученное из истории
History.prototype.restoreObjectState = function(obj) {
    if (obj) {
        obj.can_el.set({
            left: obj.left, top: obj.top,
            scaleX: obj.scaleX, scaleY: obj.scaleY,
            angle: obj.angle,
            flipX: obj.flipX, flipY: obj.flipY
        }).setCoords();
        this.canvas.renderAll();
    }
}
History.prototype.backHistory = function() {
    var back = History.back.pop();
    if (back) {
        History.forward.push(this.setState(back));
        this.restoreObjectState(back);
    }
    this.setButtonsState();
}
History.prototype.forwardHistory = function() {
    var forward = History.forward.pop();
    if (forward) {
        History.back.push(this.setState(forward));
        this.restoreObjectState(forward);
    }
    this.setButtonsState();
}

// запоминает состояние объекта
History.prototype.setState = function(data) {
    var state = {};
    state['can_el'] = data.can_el;
    state['left']   = data.can_el.getLeft();
    state['top']    = data.can_el.getTop();
    state['width']  = data.can_el.getWidth();
    state['height'] = data.can_el.getHeight();
    state['scaleX'] = data.can_el.get('scaleX');
    state['scaleY'] = data.can_el.get('scaleY');
    state['angle']  = data.can_el.getAngle();
    state['flipX']  = data.can_el.get('flipX')
    state['flipY']  = data.can_el.get('flipY')
    //state['']     =
    return state;
}

History.prototype.setButtonsState = function() {
    if (!History.back.length) {
        $(this.opt.back).css('opacity', '.5');
        $(this.opt.back).css('cursor', 'default');

    } else {
        $(this.opt.back).css('opacity', '1');
        $(this.opt.back).css('cursor', 'pointer');
    }
    if (!History.forward.length) {
        $(this.opt.forward).css('opacity', '.5');
        $(this.opt.forward).css('cursor', 'default');
    } else {
        $(this.opt.forward).css('opacity', '1');
        $(this.opt.forward).css('cursor', 'pointer');
    }
}

//h='';// it for debug
//$(document).ready(function(){
    //h = new History();
//});
