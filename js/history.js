/*
 * объект сохранения истории
 * events
 * object:modified
 * object:selected
 * */
var History = function(canvas, options) {
    var it = this;

    this.opt = jQuery.extend({
        back: '#back', //кнопка вперед
        forward: '#forward', //кнопка назад
    }, options);

    this.setButtonsState();

    $(this.opt.back).on('click',    function() { it.backHistory();    return false });
    $(this.opt.forward).on('click', function() { it.forwardHistory(); return false });

    this.canvas = canvas;

    var _selected = {}
    $(document).on('story:add', function(e, data) {
        // data.type can be object:selected, object:modified, object:removed, object:added
        if(data.type == 'object:selected') { _selected = it.setState(data.can_el) };
        if(data.type == 'object:modified') {
            if (_selected.can_el != data.can_el) {
                //console.log('History - объекты не равны', _selected.can_el, data.can_el);
            };
                History.forward = [];
                History.back.push(_selected);
                _selected = it.setState(data.can_el);
        }
        if (data.type == 'object:removed') {
            History.forward = [];
            History.back.push(it.setState(data.can_el, 'removed'));
        };
        if (data.type == 'object:added') {
            History.forward = [];
            History.back.push(it.setState(data.can_el, 'restored'))
        };
        if (data.type == 'clearAll') { History.forward = []; History.back = [] };
        it.setButtonsState();
    });
}

History.back = []; 
History.forward = [];

// Восстанавливает состояние объекта полученное из истории
History.prototype.restoreObjectState = function(state) {
    var it = this;
    // здесь следует понимать, что раз был удален - значит надо восстановить,
    // раз был восстановлен - значит надо удалить
    
    // TODO тут код переписать
    if (state.can_el instanceof Array) {
        this.canvas.deactivateAll().renderAll();
        $.each(state.can_el, function(i, obj_el) { it.restoreObjectState(obj_el) });
    } else {
        if (state.type == 'removed') { 
            this.canvas.add(state.can_el);
        } else if (state.type == 'restored') {
            this.canvas.remove(state.can_el);
        } else {
            state.can_el.setAngle(state.json.angle);
            state.can_el.scaleX = state.json.scaleX;
            state.can_el.scaleY = state.json.scaleY;
            state.can_el.flipX  = state.json.flipX;
            state.can_el.flipY  = state.json.flipY;
            state.can_el.left   = state.json.left;
            state.can_el.top    = state.json.top;
            state.can_el.setCoords();
        }
    }
    this.canvas.renderAll();
    //obj.can_el.scale(0.5);
    //this.canvas.renderAll();
        //obj.can_el.scaleY = obj.scaleY;
}

History.prototype.backHistory = function() {
    var back = History.back.pop();
    if (back) {
        var type;
        if(back.type == 'removed')  { type = 'restored' };
        if(back.type == 'restored') { type = 'removed' };
        if (back.can_el instanceof Array) { this.canvas.deactivateAll().renderAll() };
        History.forward.push(this.setState(back.can_el, type));
        this.restoreObjectState(back);
    }
    this.setButtonsState();
}

History.prototype.forwardHistory = function() {
    var forward = History.forward.pop();
    if (forward) {
        var type;
        if(forward.type == 'removed')  { type = 'restored' };
        if(forward.type == 'restored') { type = 'removed' };
        History.back.push(this.setState(forward.can_el, type));
        this.restoreObjectState(forward);
    }
    this.setButtonsState();
}

// запоминает состояние объекта
History.prototype.setState = function(can_el, type, group_el) {
    var it = this;
    var state = {'objects': []};

    if (can_el instanceof Array) {
        console.log('array');
        state['can_el'] = Array();
        $.each(can_el, function(i, val) { state['can_el'].push(it.setState(val.can_el, type)) }); 
    } else if (can_el.type == 'group') {
        state['can_el'] = Array();
        $.each(can_el.objects, function(i, val) { 
            state['can_el'].push(it.setState(val, type, can_el.toJSON()));
        });
    } else {
        state['can_el']  = can_el;
        state['type']    = type || 'modified';
        //console.log('bef error', can_el);
        state['json']    = can_el.toJSON();

        if (group_el) {
            console.log(group_el);

            var groupLeft   = group_el.left;
            var groupTop    = group_el.top;
            var groupAngle  = group_el.angle * (Math.PI / 180);
            var objectLeft  = can_el.get('originalLeft');
            var objectTop   = can_el.get('originalTop');
            var rotatedTop  =  Math.cos(groupAngle) * can_el.get('top') + Math.sin(groupAngle) * can_el.get('left');
            var rotatedLeft = -Math.sin(groupAngle) * can_el.get('top') + Math.cos(groupAngle) * can_el.get('left');

            state.json.angle  = can_el.getAngle() + group_el.angle;
            state.json.left   = groupLeft + rotatedLeft * group_el.scaleX;
            state.json.top    = groupTop + rotatedTop * group_el.scaleY;
            state.json.scaleX = can_el.get('scaleX') * group_el.scaleX;
            state.json.scaleY = can_el.get('scaleY') * group_el.scaleY;
            //console.log(state);
        };
    };
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
