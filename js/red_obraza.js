var CanvasManager = function(options) {
    var it = this;

    this.opt = jQuery.extend({
        c_id: '#c',
        c_holder: '.drop',
        items_selector: '.images a img', // селектор для картинок которые будут кидаться на холст

        sendBackwards:'a.sendBackwards',
        bringForward:'a.bringForward',
        flipX:'a.flipX',
        flipY:'a.flipY',
        clone:'a.clone',
        remove:'a.remove',
        removeAll:'a.removeAll',

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
            fabric.Image.fromURL(img_src, function(img) { canvas.add(img.set({ left: left, top: top})).renderAll() });
        }
    });
    var canvas = new fabric.Canvas(this.opt.c_id.split('#')[1]); // основной холст
    h = new History(canvas); // история для холста

    var can_el; // текущий элемент холста
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
        $('.panel a').removeClass('inactive');
        can_el = e.memo.target;
    });
    canvas.observe('object:modified', function(e) {
        $(document).trigger('story:add', { type: 'object:modified', can_el: e.memo.target});
    })
    canvas.observe('selection:cleared', function(e) { $('.panel a').addClass('inactive') });
    canvas.observe('selection:created', function(e) {   });


    $(this.opt.sendBackwards).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.sendBackwards(can_el);
        return false; 
    });

    $(this.opt.bringForward).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.bringForward(can_el); 
        return false;
    });
    $(this.opt.flipY).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: can_el});
        can_el.get('flipY') ? can_el.set('flipY', false) : can_el.set('flipY', true); 
        canvas.renderAll(); return false;
    });
    $(this.opt.flipX).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: can_el});
        can_el.get('flipX') ? can_el.set('flipX', false) : can_el.set('flipX', true); 
        canvas.renderAll(); return false;
    });
    $(this.opt.clone).click(function() {
        if($(this).hasClass('inactive')) { return false };
        can_el.clone(function(img) {
            canvas.add(img.set({left: can_el.left + can_el.width, top:can_el.top}));
        });
        canvas.renderAll();
        return false;
    });
    $(this.opt.remove).click(function() {
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:removed', can_el:can_el});
        canvas.remove(can_el);
        if (canvas.isEmpty()) { $('.panel a').addClass('inactive') };
        return false;
    });
    $(this.opt.removeAll).click(function() {
        canvas.forEachObject(function(obj) { canvas.remove(obj) });
        $('.panel a').addClass('inactive');
        return false;
    });
    console.log('i am work');

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

$(document).ready(function(){
    new CanvasManager();
});



