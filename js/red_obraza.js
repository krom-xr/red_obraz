//var imageSearch;
//google.load("search", "1", {"nocss": true});
//google.setOnLoadCallback(function() {
    //imageSearch = new google.search.ImageSearch();
    //imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_MEDIUM);

    //imageSearch.setSearchCompleteCallback(this, function(data, data2) {
    //}, [imageSearch]);
//});

//function searchComplete(data, data2, data3) {
//}
//function OnLoad() {
  //// Our ImageSearch instance.
  //var imageSearch = new google.search.ImageSearch();

  //// Restrict to extra large images only
  //imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
                             //google.search.ImageSearch.IMAGESIZE_MEDIUM);

  //// Here we set a callback so that anytime a search is executed, it will call
  //// the searchComplete function and pass it our ImageSearch searcher.
  //// When a search completes, our ImageSearch object is automatically
  //// populated with the results.
  //imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch]);

  //// Find me a beautiful car.
  //imageSearch.execute("Subaru STI");
//}


var CanvasManager = function(options) {
    var it = this;

    this.opt = jQuery.extend({
        HOST: '',
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

        text_form: {
            id:            '#custom_text',
            font_selector: '#custom_text .font_selector',
            current_font:  '#custom_text .font_selector .current_font',
            fonts:         '#custom_text .font_selector ul',
            font:          '#custom_text .font_selector li',

            text:          '#custom_text textarea',

            align:         '#custom_text .align',
            text_style:    '#custom_text .text_style',

            textcolor:     '#custom_text #textcolor',
            textbgr:       '#custom_text #textbgr',
            default_text:  'введите текст...',
        },      
        add_text:      '#add_text',

        json: false, 

        MAX_SCALE: 5,// TODO возможно лучше вместо MAX_WIDTH - использовать MAX_SCALE

        MAX_WIDTH: 550,
        MIN_WIDTH: 20,
    }, options);

    var WIDTH = jQuery(this.opt.c_holder).width();
    var HEIGHT = jQuery(this.opt.c_holder).height();

    this.HOST = this.opt.HOST;

    //WIDTH = 4000;
    jQuery(this.opt.c_id).attr('width', WIDTH);
    jQuery(this.opt.c_id).attr('height', HEIGHT);
    
    jQuery(it.opt.items_selector).draggable({ helper: 'clone', });

    this.fontsLoaded = [];

    jQuery(this.opt.c_id).droppable({
        drop: function(e, ui) {
            var left = ui.offset.left - jQuery(e.target).offset().left + jQuery(ui.draggable).width()/2 ;
            var top =  ui.offset.top  - jQuery(e.target).offset().top  + jQuery(ui.draggable).height()/2 ;
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
                it.canvas.add(img.set({ left: left, top: top}).setActive(true)).renderAll() 
                jQuery(document).trigger('story:add', { type: 'object:added', can_el: img});
            });
        }
    });
    this.canvas = new fabric.Canvas(this.opt.c_id.split('#')[1]); // основной холст
    new History(it.canvas, {}); // история для холста
    if (this.opt.json) { this.loadFromJSON(this.opt.json) };



    this.can_el; // текущий элемент холста
    this.canvas.observe('mouse:down', function(e) { if (!e.memo.target) { it.buttonStatus('cleared') } });

    //не даем вылезти за пределы холста
    this.canvas.observe('object:moving', function(e) { 
        if(e.memo.target.left < e.memo.target.getWidth()/2)  { e.memo.target.set({left: e.memo.target.getWidth()/2 }) };
        if(e.memo.target.top  < e.memo.target.getHeight()/2) { e.memo.target.set({top:  e.memo.target.getHeight()/2 }) };
        var right_limit = WIDTH - e.memo.target.getWidth()/2;
        var bottom_limit = HEIGHT - e.memo.target.getHeight()/2;
        if(e.memo.target.left > (right_limit + right_limit   * it.zoom)) { e.memo.target.set({left: right_limit  + right_limit  * it.zoom }) };
        if(e.memo.target.top >  (bottom_limit + bottom_limit * it.zoom)) { e.memo.target.set({top:  bottom_limit + bottom_limit * it.zoom }) };
    })
    this.canvas.observe('object:selected', function(e) {
        jQuery(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
        it.can_el = e.memo.target;
        it.buttonStatus('selected');
        //it.textSelected(); 
    });
    this.canvas.observe('object:modified', function(e) {
        var can_el = e.memo.target;
        jQuery(document).trigger('story:add', { type: 'object:modified', can_el: can_el });
        if (!it.zoom) { return false };
        can_el.orig.scaleX = can_el.orig.scaleY = can_el.orig.scaleX * (can_el.scaleX / can_el.originalState.scaleX);
        can_el.orig.left   = can_el.orig.left * (can_el.left / can_el.originalState.left);
        can_el.orig.top    = can_el.orig.top  * (can_el.top  / can_el.originalState.top );
    })
    this.canvas.observe('object:scaling', function(e) {
        if(e.memo.target.getWidth() > (it.opt.MAX_WIDTH + it.opt.MAX_WIDTH * it.zoom)) { e.memo.target.scaleToWidth(it.opt.MAX_WIDTH + it.opt.MAX_WIDTH * it.zoom) };
        if(e.memo.target.getWidth() < (it.opt.MIN_WIDTH + it.opt.MIN_WIDTH * it.zoom)) { e.memo.target.scaleToWidth(it.opt.MIN_WIDTH + it.opt.MIN_WIDTH * it.zoom) };

        // пропорциональное масштабирование
        if (e.memo.target.scaleX == e.memo.target.scaleY) { return false };
        it.canvas._currentTransform.action == 'scaleX' ? e.memo.target.scaleY = e.memo.target.scaleX : e.memo.target.scaleX = e.memo.target.scaleY;
    })
    this.canvas.observe('selection:cleared', function(e) { 
        it.buttonStatus('cleared');
    });
    this.canvas.observe('selection:created', function(e) {   
        jQuery(document).trigger('story:add', { type: 'object:selected', can_el: e.memo.target});
    });


    jQuery(this.opt.sendBackwards).click(function() { 
        if(jQuery(this).hasClass('inactive')) { return false };
        it.canvas.sendBackwards(it.can_el);
        return false; 
    });

    jQuery(this.opt.bringForward).click(function() { 
        if(jQuery(this).hasClass('inactive')) { return false };
        it.canvas.bringForward(it.can_el); 
        return false;
    });
    jQuery(this.opt.flipY).click(function() { 
        if(jQuery(this).hasClass('inactive')) { return false };
        jQuery(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipY') ? it.can_el.set('flipY', false) : it.can_el.set('flipY', true); 
        it.canvas.renderAll(); return false;
    });
    jQuery(this.opt.flipX).click(function() { 
        if(jQuery(this).hasClass('inactive')) { return false };
        jQuery(document).trigger('story:add', {type: 'object:modified', can_el: it.can_el});
        it.can_el.get('flipX') ? it.can_el.set('flipX', false) : it.can_el.set('flipX', true); 
        it.canvas.renderAll(); return false;
    });
    jQuery(this.opt.clone).click(function() {
        if(jQuery(this).hasClass('inactive')) { return false };
        it.can_el.clone(function(img) {
            it.canvas.add(img.set({left: it.can_el.left + it.can_el.width, top: it.can_el.top}));
        });
        it.canvas.renderAll();
        return false;
    });
    jQuery(this.opt.remove).click(function() {
        if(jQuery(this).hasClass('inactive')) { return false };
        jQuery(document).trigger('story:add', {type: 'object:removed', can_el: it.can_el});
        it.canvas.remove(it.can_el);
        it.buttonStatus('removed');
        //if (canvas.isEmpty()) { jQuery('.panel a').addClass('inactive') };
        return false;
    });
    jQuery(this.opt.removeAll).click(function() {
        it.canvas.forEachObject(function(obj) { it.canvas.remove(obj) }).deactivateAll().renderAll();

        jQuery(document).trigger('story:add', {type: 'clearAll'});
        it.buttonStatus('removed');
        return false;
    });
    //TODO тут будет смена бэкграундов
    //jQuery(this.opt.backgrounds).click(function() { return false });
    jQuery(this.opt.backgrounds).hover(function() {
        if (jQuery(this).hasClass('inactive')) { return false };
        if (!it.can_el.bgrs) { return false };
        var ul = jQuery(this).find('ul');
        if (!ul.length) { var ul = jQuery('<ul></ul>'); jQuery(this).append(ul) };
        ul.html('').show();
        jQuery.each(it.can_el.bgrs.split(','), function(i, bgr) {
            ul.append(jQuery("<li><img src=" + bgr + " width=20 height=20 /></li>"));
        });
        return false;
    }, function() { jQuery(this).find('ul').hide() });

    // здесь устанавливается новый бэкграунд для объекта
    jQuery(document).on('click', this.opt.backgrounds + ' img', function() {
        jQuery(this).parents('ul').hide();
        var img = new Image();
        img.src = jQuery(this).attr('src');
        it.can_el.setElement(img).setCoords(); 
        it.canvas.renderAll();
        return false;
    });


    //TODO тут надо потом доделать сохранения
    jQuery(this.opt.save_form).submit(function() {
        jQuery.post('http://yandex.ru', {json: it.canvas.toJSON()});
        return false;
    })

    

    jQuery(this.opt.text_form.id).draggable();

    // выбор шрифта
    jQuery(this.opt.text_form.current_font).click(function() { jQuery(this).parent().find('ul').toggle() });
    jQuery(this.opt.text_form.font).click(function() {
        jQuery(it.opt.text_form.current_font).html(jQuery(this).html());
        jQuery(it.opt.text_form.current_font).attr('data-font', jQuery(this).attr('class'));
        jQuery(it.opt.text_form.fonts).hide();
        var font = jQuery(this).attr('class');
        it.loadFont(jQuery(this).attr('class'), function() {
            if (!it.can_el) { return false };
            if (it.can_el.type == 'text') { 
                it.can_el.fontFamily = font; 
                it.canvas.renderAll();
            };
        });
    });

    //добавление текста
    jQuery(this.opt.add_text).click(function() {
        var font = jQuery(it.opt.text_form.current_font).attr('data-font');
        if (font) {
            it.canvas.deactivateAll();
            jQuery(it.opt.text_form.id).removeClass('inactive');
            it.loadFont(font, function() {
                jQuery(it.opt.text_form.text).val(it.opt.text_form.default_text);
                it.can_el = new fabric.Text(it.opt.text_form.default_text, {
                    fontFamily: font,
                    left: it.canvas.width/2, 
                    top: it.canvas.height/2,
                    fill: '#000000',
                    textAlign: 'left',
                })
                jQuery(document).trigger('story:add', { type: 'object:added', can_el: it.can_el});
                it.canvas.add(it.can_el);
                it.can_el.setActive(true);
                it.canvas.renderAll();
            });
        };
    });

    //изменение текста при наборе
    jQuery(this.opt.text_form.text).keyup(function() {
        if (!it.can_el) { return false };
        if (it.can_el.type != 'text') { return false };
        it.can_el.text = jQuery(this).val();
        it.canvas.renderAll();
    });

    //изменение выравнивания текста
    jQuery(this.opt.text_form.align).click(function() {
        it.can_el.textAlign = jQuery(this).attr('data-align');
        it.canvas.renderAll();
        var jQuerythis = this;
        jQuery(it.opt.text_form.align).each(function() { Boolean(this == jQuerythis) ? jQuery(this).addClass('active') : jQuery(this).removeClass('active') });
    })

    // изменение стиля текста ( курсив, подчеркивание, тень и т.д.)
    jQuery(this.opt.text_form.text_style).click(function() {
        var jQuerythis = this;
        var text_style = it.opt.text_form.text_style;
        var active = jQuery(this).toggleClass('active').hasClass('active');
        if (jQuery(this).hasClass('fontStyle')) { it.can_el.fontStyle = active ? 'italic' : '' } 
        if (jQuery(this).hasClass('textDecoration')) {
            it.can_el.textDecoration = active ? jQuery(this).attr('data-style') : false;
            jQuery(this).hasClass('underline') ? jQuery(text_style + '.through').removeClass('active') : jQuery(text_style + '.underline').removeClass('active');
        };
        jQuery(this).hasClass('shadow') ? ( it.can_el.textShadow = active ? "2 2 2" : false ) : false;
        if (jQuery(this).hasClass('casechange')) {
            it.can_el.text = jQuery(this).hasClass('uppercase') ? it.can_el.text.toUpperCase() : it.can_el.text.toLowerCase();
            jQuery(this).removeClass('active');
        };
        it.canvas.renderAll();
    });

    //цвет для текста и фона
    jQuery(this.opt.text_form.textcolor).change(function() { it.can_el.fill = jQuery(this).val();            it.canvas.renderAll(); });
    jQuery(this.opt.text_form.textbgr)  .change(function() { it.can_el.backgroundColor = jQuery(this).val(); it.canvas.renderAll(); });


    this.zoom = 0;
    jQuery('#zoom').change(function() {
        it.zoom = jQuery(this).val()/100;
        it.canvas.forEachObject(function(can_el) {
            if (!can_el.orig) { can_el.orig = can_el.toObject() };
            can_el.scaleX = can_el.orig.scaleX + can_el.orig.scaleX * it.zoom; 
            can_el.scaleY = can_el.orig.scaleY + can_el.orig.scaleY * it.zoom; 
            can_el.left   =  can_el.orig.left  + can_el.orig.left * it.zoom;
            can_el.top    =  can_el.orig.top   + can_el.orig.top  * it.zoom;
            can_el.setCoords();
            if (!it.zoom) { can_el.orig = false };
        })
        it.canvas.renderAll();
    });
};

// загружает шрифты, если они еще не загружены
CanvasManager.fontsLoaded = [];
CanvasManager.prototype.loadFont = function(font, callback) {
    if (jQuery.inArray(font, CanvasManager.fontsLoaded) == -1) {
        var script = document.createElement("script");
        script.src = this.HOST + "js/fonts/" + font + ".font.js"; 
        document.getElementById('red_content').appendChild(script);//TODO заменить body
        script.onload = function() { callback() };
        CanvasManager.fontsLoaded.push(font);
        return false;
    } 
    callback();
}

CanvasManager.prototype.loadFromJSON = function(json) {
    if (!(typeof json === 'string')) { json = JSON.stringify(json) };
    this.canvas.loadFromJSON(json).renderAll();
}

CanvasManager.prototype.buttonStatus = function(type) {
    if (type == 'cleared' || type == 'removed') {
        jQuery(this.opt.sendBackwards).addClass('inactive');
        jQuery(this.opt.bringForward) .addClass('inactive');
        jQuery(this.opt.flipX)        .addClass('inactive');
        jQuery(this.opt.flipY)        .addClass('inactive');
        jQuery(this.opt.clone)        .addClass('inactive');
        jQuery(this.opt.remove)       .addClass('inactive');
        jQuery(this.opt.removeAll)    .addClass('inactive');
        jQuery(this.opt.backgrounds)  .addClass('inactive');
        jQuery(this.opt.text_form.id) .addClass('inactive');
    } else if(type == 'selected') {
        jQuery(this.opt.sendBackwards).removeClass('inactive');
        jQuery(this.opt.bringForward) .removeClass('inactive');
        jQuery(this.opt.flipX)        .removeClass('inactive');
        jQuery(this.opt.flipY)        .removeClass('inactive');
        jQuery(this.opt.clone)        .removeClass('inactive');
        jQuery(this.opt.remove)       .removeClass('inactive');
        jQuery(this.opt.removeAll)    .removeClass('inactive');
        this.can_el.bgrs ? jQuery(this.opt.backgrounds).removeClass('inactive') : jQuery(this.opt.backgrounds).addClass('inactive');
        if (this.can_el.type == 'text') { 
            jQuery(this.opt.text_form.id).removeClass('inactive');
        } else {
            jQuery(this.opt.text_form.id).addClass('inactive');
        }
    };
}

//var c ;
//jQuery(document).ready(function(){

    ////c = new CanvasManager({
        ////json:'{"objects":[{"type":"image","left":436,"top":213,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/9.png","filters":[]},{"type":"image","left":262,"top":250,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/7.png","filters":[]},{"type":"image","left":622,"top":148,"width":94,"height":94,"fill":"rgb(0,0,0)","overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true, "bgrs": "testing","src":"file:///home/mn/Dropbox/www/dressed/maketer/red_obraz/images/9.png","filters":[]}],"background":"rgba(0, 0, 0, 0)"}'
    ////});

//});



