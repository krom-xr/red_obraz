var CanvasManager = function(options) {
    var it = this;

    this.opt = jQuery.extend({
        c_id: '#c',
        c_holder: '.drop',
        items_selector: '.images a img', // селектор для картинок которые будут кидаться на холст

        sendBackwards: 'a.sendBackwards',
        bringForward:  'a.bringForward',
        flipX:         'a.flipX',
        flipY:         'a.flipY',
        clone:         'a.clone',
        remove:        'a.remove',
        removeAll:     'a.removeAll',

        MAX_WIDTH: 350,
        MIN_WIDTH: 20,
    }, options);

    var WIDTH = $(this.opt.c_holder).width();
    var HEIGHT = $(this.opt.c_holder).height();

    $(this.opt.c_id).attr('width', WIDTH);
    $(this.opt.c_id).attr('height', HEIGHT);
    
    $(it.opt.items_selector).draggable({ helper: 'clone', });


    $(this.opt.c_id).droppable({
        drop: function(e, ui) {
            var left = ui.offset.left - $(e.target).offset().left + $(ui.draggable).width()/2 ;
            var top =  ui.offset.top  - $(e.target).offset().top  + $(ui.draggable).height()/2 ;
            var img_src = ui.draggable.attr('src');
            fabric.Image.fromURL(img_src, function(img) { 
                canvas.add(img.set({ left: left, top: top})).renderAll() 
                $(document).trigger('story:add', { type: 'object:added', can_el: img});
            });
        }
    });
    var canvas = new fabric.Canvas(this.opt.c_id.split('#')[1]); // основной холст
    h = new History(canvas); // история для холста

    this.can_el; // текущий элемент холста
    canvas.observe('object:scaling', function(e) { 
        if(e.memo.target.getWidth() > it.opt.MAX_WIDTH) { e.memo.target.scaleToWidth(it.opt.MAX_WIDTH) };
        if(e.memo.target.getWidth() < it.opt.MIN_WIDTH) { e.memo.target.scaleToWidth(it.opt.MIN_WIDTH) };
    });
    canvas.observe('object:moving', function(e) { 
        if(e.memo.target.left < e.memo.target.getWidth()/2)  { e.memo.target.set({left: e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top  < e.memo.target.getHeight()/2) { e.memo.target.set({top:  e.memo.target.getHeight()/2 }) };
        if(e.memo.target.left > WIDTH - e.memo.target.getWidth()/2)  { e.memo.target.set({left: WIDTH - e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top > HEIGHT - e.memo.target.getHeight()/2) { e.memo.target.set({top: HEIGHT - e.memo.target.getHeight()/2 }) };
    })
    canvas.observe('object:selected', function(e) {
        $(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
        it.buttonStatus('selected');
        it.can_el = e.memo.target;
    });
    canvas.observe('object:modified', function(e) {
        $(document).trigger('story:add', { type: 'object:modified', can_el: e.memo.target});
    })
    canvas.observe('selection:cleared', function(e) { 
        it.buttonStatus('cleared') 
    });
    canvas.observe('selection:created', function(e) {   
        $(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
    });


    $(this.opt.sendBackwards).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.sendBackwards(it.can_el);
        return false; 
    });

    $(this.opt.bringForward).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.bringForward(it.can_el); 
        return false;
    });
    $(this.opt.flipY).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipY') ? it.can_el.set('flipY', false) : it.can_el.set('flipY', true); 
        canvas.renderAll(); return false;
    });
    $(this.opt.flipX).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipX') ? it.can_el.set('flipX', false) : it.can_el.set('flipX', true); 
        canvas.renderAll(); return false;
    });
    $(this.opt.clone).click(function() {
        if($(this).hasClass('inactive')) { return false };
        it.can_el.clone(function(img) {
            canvas.add(img.set({left: it.can_el.left + it.can_el.width, top: it.can_el.top}));
        });
        canvas.renderAll();
        return false;
    });
    $(this.opt.remove).click(function() {
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:removed', can_el: it.can_el});
        canvas.remove(it.can_el);
        it.buttonStatus('removed');
        //if (canvas.isEmpty()) { $('.panel a').addClass('inactive') };
        return false;
    });
    $(this.opt.removeAll).click(function() {
        canvas.forEachObject(function(obj) { canvas.remove(obj) }).deactivateAll().renderAll();

        $(document).trigger('story:add', {type: 'clearAll'});
        it.buttonStatus('removed');
        return false;
    });


    //var _scale = 1;
    //$('a.zoom_inc').click(function() {
        //_scale += 0.1;
        //canvas.forEachObject(function(obj) {
            //obj.scale(_scale);
            //canvas.renderAll();

        //})
    //})
    //$('a.zoom_dec').click(function() {
        //_scale -= 0.1;
        //canvas.forEachObject(function(obj) {
            //obj.scale(_scale);
            //canvas.renderAll();

        //})
    //})
};
CanvasManager.prototype.buttonStatus = function(type) {
    if (type == 'cleared' || type == 'removed') {
        $(this.opt.sendBackwards).addClass('inactive');
        $(this.opt.bringForward) .addClass('inactive');
        $(this.opt.flipX)        .addClass('inactive');
        $(this.opt.flipY)        .addClass('inactive');
        $(this.opt.clone)        .addClass('inactive');
        $(this.opt.remove)       .addClass('inactive');
        $(this.opt.removeAll)    .addClass('inactive');
    } else if(type == 'selected') {
        $(this.opt.sendBackwards).removeClass('inactive');
        $(this.opt.bringForward) .removeClass('inactive');
        $(this.opt.flipX)        .removeClass('inactive');
        $(this.opt.flipY)        .removeClass('inactive');
        $(this.opt.clone)        .removeClass('inactive');
        $(this.opt.remove)       .removeClass('inactive');
        $(this.opt.removeAll)    .removeClass('inactive');
    };
}

var c;
$(document).ready(function(){
    c = new CanvasManager();
});



