var History = function(canvas) {
    var it = this;

    $('#back').click(function() {
        $(document).trigger('story:back');
        return false;
    })
    $('#forward').click(function() {
        $(document).trigger('story:forward');
        return false;
    })

    this.canvas = canvas;
    var _selected = {}
    $(document).on('story:add', function(e, data) {
        var set_selected = function() {
            _selected = {};
            _selected['can_el'] = data.can_el;
            _selected['left']   = data.can_el.getLeft();
            _selected['top']    = data.can_el.getTop();
            _selected['width']  = data.can_el.getWidth();
            _selected['height'] = data.can_el.getHeight();
            _selected['scaleX'] = data.can_el.get('scaleX');
            _selected['scaleY'] = data.can_el.get('scaleY');
            _selected['angle']  = data.can_el.getAngle();
            _selected['flipX']  = data.can_el.get('flipX')
            _selected['flipY']  = data.can_el.get('flipY')
            //_selected['']     =
        }
        if(data.type == 'object:selected') {
            set_selected()
        }
        if(data.type == 'object:modified') {
            if (_selected.can_el != data.can_el) {
                console.log('History - объекты не равны', _selected.can_el, data.can_el);
            } else {
                History.back.push(_selected);
                set_selected(data);
            }
        }
    });

    $(document).on('story:back', function(e, data) {
        it.backHistory();
    });
    $(document).on('story:forward', function(e, data) {
        it.forwardHistory();
    });
}
History.back = [];
History.forward = [];

History.prototype.restoreObjectState = function(obj) {
    if (obj) {
        console.log(obj);
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
    this.restoreObjectState(back);
    History.forward.push(back)
}
History.prototype.forwardHistory = function() {
    var forward = History.forward.pop();
    this.restoreObjectState(forward);
    History.back.push(forward);
}

//h='';// it for debug
//$(document).ready(function(){
    //h = new History();
//});
