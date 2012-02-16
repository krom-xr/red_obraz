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
        backgrounds:   'a.backgrounds',

        save_form:      '#save_form',

        json: false, 

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
                var extend = fabric.util.object.extend;
                img.bgrs = ui.draggable.data('bgrs');
                img.toObject = function() {
                    return extend(this.callSuper('toObject'), {
                        src: this._originalImage.src || this._originalImage._src,
                        filters: this.filters.concat(),
                        bgrs: this.bgrs,
                    });
                };
                it.canvas.add(img.set({ left: left, top: top})).renderAll() 
                $(document).trigger('story:add', { type: 'object:added', can_el: img});
            });
        }
    });
    this.canvas = new fabric.Canvas(this.opt.c_id.split('#')[1]); // основной холст
    h = new History(it.canvas); // история для холста
    if (this.opt.json) { this.loadFromJSON(this.opt.json) };



    this.can_el; // текущий элемент холста
    this.canvas.observe('object:scaling', function(e) { 
        if(e.memo.target.getWidth() > it.opt.MAX_WIDTH) { e.memo.target.scaleToWidth(it.opt.MAX_WIDTH) };
        if(e.memo.target.getWidth() < it.opt.MIN_WIDTH) { e.memo.target.scaleToWidth(it.opt.MIN_WIDTH) };
    });
    this.canvas.observe('object:moving', function(e) { 
        if(e.memo.target.left < e.memo.target.getWidth()/2)  { e.memo.target.set({left: e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top  < e.memo.target.getHeight()/2) { e.memo.target.set({top:  e.memo.target.getHeight()/2 }) };
        if(e.memo.target.left > WIDTH - e.memo.target.getWidth()/2)  { e.memo.target.set({left: WIDTH - e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top > HEIGHT - e.memo.target.getHeight()/2) { e.memo.target.set({top: HEIGHT - e.memo.target.getHeight()/2 }) };
    })
    this.canvas.observe('object:selected', function(e) {
        $(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
        it.can_el = e.memo.target;
        it.buttonStatus('selected');
    });
    this.canvas.observe('object:modified', function(e) {
        $(document).trigger('story:add', { type: 'object:modified', can_el: e.memo.target});
    })
    this.canvas.observe('selection:cleared', function(e) { 
        it.buttonStatus('cleared') 
    });
    this.canvas.observe('selection:created', function(e) {   
        $(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
    });


    $(this.opt.sendBackwards).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        it.canvas.sendBackwards(it.can_el);
        return false; 
    });

    $(this.opt.bringForward).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        it.canvas.bringForward(it.can_el); 
        return false;
    });
    $(this.opt.flipY).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipY') ? it.can_el.set('flipY', false) : it.can_el.set('flipY', true); 
        it.canvas.renderAll(); return false;
    });
    $(this.opt.flipX).click(function() { 
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipX') ? it.can_el.set('flipX', false) : it.can_el.set('flipX', true); 
        it.canvas.renderAll(); return false;
    });
    $(this.opt.clone).click(function() {
        if($(this).hasClass('inactive')) { return false };
        it.can_el.clone(function(img) {
            it.canvas.add(img.set({left: it.can_el.left + it.can_el.width, top: it.can_el.top}));
        });
        it.canvas.renderAll();
        return false;
    });
    $(this.opt.remove).click(function() {
        if($(this).hasClass('inactive')) { return false };
        $(document).trigger('story:add', {type: 'object:removed', can_el: it.can_el});
        it.canvas.remove(it.can_el);
        it.buttonStatus('removed');
        //if (canvas.isEmpty()) { $('.panel a').addClass('inactive') };
        return false;
    });
    $(this.opt.removeAll).click(function() {
        it.canvas.forEachObject(function(obj) { it.canvas.remove(obj) }).deactivateAll().renderAll();

        $(document).trigger('story:add', {type: 'clearAll'});
        it.buttonStatus('removed');
        return false;
    });
    //TODO тут будет смена бэкграундов
    //$(this.opt.backgrounds).click(function() { return false });
    $(this.opt.backgrounds).hover(function() {
        if ($(this).hasClass('inactive')) { return false };
        if (!it.can_el.bgrs) { return false };
        var ul = $(this).find('ul');
        if (!ul.length) { var ul = $('<ul></ul>'); $(this).append(ul) };
        ul.html('').show();
        $.each(it.can_el.bgrs.split(','), function(i, bgr) {
            ul.append($("<li><img src=" + bgr + " width=20 height=20 /></li>"));
        });
        return false;
    }, function() { $(this).find('ul').hide() });

    // здесь устанавливается новый бэкграунд для объекта
    $(document).on('click', this.opt.backgrounds + ' img', function() {
        $(this).parents('ul').hide();
        var img = new Image();
        img.src = $(this).attr('src');
        it.can_el.setElement(img).setCoords(); 
        it.canvas.renderAll();
        return false;
    });


    //TODO тут надо потом доделать сохранения
    $(this.opt.save_form).submit(function() {
        console.log(JSON.stringify(it.canvas.toJSON()));
        console.log($(this).serialize());
        //$(this).submit();
        $.post('http://yandex.ru', {json: it.canvas.toJSON()});
        return false;
    })


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
CanvasManager.prototype.loadFromJSON = function(json) {
    if (!(typeof json === 'string')) { json = JSON.stringify(json) };
    this.canvas.loadFromJSON(json).renderAll();
}
CanvasManager.prototype.buttonStatus = function(type) {
    if (type == 'cleared' || type == 'removed') {
        $(this.opt.sendBackwards).addClass('inactive');
        $(this.opt.bringForward) .addClass('inactive');
        $(this.opt.flipX)        .addClass('inactive');
        $(this.opt.flipY)        .addClass('inactive');
        $(this.opt.clone)        .addClass('inactive');
        $(this.opt.remove)       .addClass('inactive');
        $(this.opt.removeAll)    .addClass('inactive');
        $(this.opt.backgrounds)  .addClass('inactive');
    } else if(type == 'selected') {
        $(this.opt.sendBackwards).removeClass('inactive');
        $(this.opt.bringForward) .removeClass('inactive');
        $(this.opt.flipX)        .removeClass('inactive');
        $(this.opt.flipY)        .removeClass('inactive');
        $(this.opt.clone)        .removeClass('inactive');
        $(this.opt.remove)       .removeClass('inactive');
        $(this.opt.removeAll)    .removeClass('inactive');
        if (this.can_el.bgrs) { $(this.opt.backgrounds)  .removeClass('inactive') };
    };
}

var c ;
$(document).ready(function(){
    c = new CanvasManager({
        json:'{"objects":[{"type":"image","left":436,"top":213,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/9.png","filters":[]},{"type":"image","left":262,"top":250,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/7.png","filters":[]},{"type":"image","left":622,"top":148,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true, "bgrs": "testing","src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/9.png","filters":[]}],"background":"rgba(0, 0, 0, 0)"}'
    });
});



