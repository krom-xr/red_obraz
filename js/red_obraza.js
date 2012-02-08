$(document).ready(function(){
    var MAX_WIDTH = 350;
    var MIN_WIDTH = 20;

    var WIDTH = $('.drop').width();
    var HEIGHT = $('.drop').height();

    $('#c').attr('width', WIDTH);
    $('#c').attr('height', HEIGHT);
    
    $('images a img').css('position','absolute');
    $('images a img').css('z-index','1000');

    $('.images a img').draggable({ helper: 'clone', });

    $('#c').droppable({
        drop: function(e, ui) {
            var left = ui.offset.left - $(e.target).offset().left + $(ui.draggable).width()/2 ;
            var top =  ui.offset.top  - $(e.target).offset().top  + $(ui.draggable).height()/2 ;
            var img_src = ui.draggable.attr('src');
            fabric.Image.fromURL(img_src, function(img) { canvas.add(img.set({ left: left, top: top})).renderAll() });
        }
    });
    var canvas = new fabric.Canvas('c');

    var can_el;
    canvas.observe('object:scaling', function(e) { 
        if(e.memo.target.getWidth() > MAX_WIDTH) { e.memo.target.scaleToWidth(MAX_WIDTH) };
        if(e.memo.target.getWidth() < MIN_WIDTH) { e.memo.target.scaleToWidth(MIN_WIDTH) };
        //if(e.memo.target.left < 0) { e.memo.target.set({left: 100//e.memo.target.getWidth()
        //}) };
    });
    canvas.observe('object:moving', function(e) { 
        if(e.memo.target.left < e.memo.target.getWidth()/2)  { e.memo.target.set({left: e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top  < e.memo.target.getHeight()/2) { e.memo.target.set({top:  e.memo.target.getHeight()/2 }) };
        if(e.memo.target.left > WIDTH - e.memo.target.getWidth()/2)  { e.memo.target.set({left: WIDTH - e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top > HEIGHT - e.memo.target.getHeight()/2) { e.memo.target.set({top: HEIGHT - e.memo.target.getHeight()/2 }) };
    })
    canvas.observe('object:selected', function(e) {
        $('.panel a').removeClass('inactive');
        can_el = e.memo.target;
    });
    canvas.observe('selection:cleared', function(e) { $('.panel a').addClass('inactive') });
    canvas.observe('selection:created', function(e) {   });


    $('a.sendBackwards').click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.sendBackwards(can_el);
        return false; 
    });

    $('a.bringForward').click(function() { 
        if($(this).hasClass('inactive')) { return false };
        canvas.bringForward(can_el); 
        return false;
    });
    $('a.flipY').click(function() { 
        if($(this).hasClass('inactive')) { return false };
        can_el.get('flipY') ? can_el.set('flipY', false) : can_el.set('flipY', true); 
        canvas.renderAll(); return false;
    });
    $('a.flipX').click(function() { 
        if($(this).hasClass('inactive')) { return false };
        can_el.get('flipX') ? can_el.set('flipX', false) : can_el.set('flipX', true); 
        canvas.renderAll(); return false;
    });
    $('a.clone').click(function() {
        if($(this).hasClass('inactive')) { return false };
        can_el.clone(function(img) {
            canvas.add(img.set({left: can_el.left + can_el.width, top:can_el.top}));
        });
        canvas.renderAll();
        return false;
    });
    $('a.remove').click(function() {
        if($(this).hasClass('inactive')) { return false };
        canvas.remove(can_el);
        if (canvas.isEmpty()) { $('.panel a').addClass('inactive') };
        return false;
    })
    $('a.removeAll').click(function() {
        canvas.forEachObject(function(obj) { canvas.remove(obj) });
        $('.panel a').addClass('inactive');
        return false;
    });

    var _scale = 1;
    $('a.zoom_inc').click(function() {
        _scale += 0.1;
        canvas.forEachObject(function(obj) {
            obj.scale(_scale);
            canvas.renderAll();

        })
    })
    $('a.zoom_dec').click(function() {
        _scale -= 0.1;
        canvas.forEachObject(function(obj) {
            obj.scale(_scale);
            canvas.renderAll();

        })
    })
});
