/*  
 *  не забудь запустить python -m CGIHTTPServer 
 *  8000 порт
 */

var Collages = function(opt) {
    var it = this;

    this.jQversion = "1.7.1";
    this.jQuery = false;
    this.HOST = 'http://localhost:1234/';
    this.id = opt.id;


    // список загружаемых скриптов. Загружается c последнего до первого 
    this.js_required = [
        {name: "CanvasManager", url: this.HOST + "js/red_obraza.js"},
        {name: "colorpicker",   url: this.HOST + "js/iColorPicker.js"},
        {name: "history",       url: this.HOST + "js/history.js"},
        {name: "fabric",        url: this.HOST + "js/fabric.js"},
        {name: "jquery-ui",     url: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"},
        {name: "jquery" + this.jQversion, url: this.HOST + "js/jquery.js"},
    ];

    

    // Если сайт не использует jquery добавляем его в список загружаемых скриптов
    //if (!window.$ || window.$().jquery < this.jQversion) { this.js_required.push({name: "jquery" + this.jQversion, url: this.HOST + "js/jquery.js"}) }
    //else { this.jQuery = jQuery };
    this.jsLoader();
}
Collages.prototype.htmlLoader = function() {
    var it = this;
    jQuery.ajax({
        // здесь потом должен быть путь до шаблонов,
        // которые должны отдаваться в jsonp - {html: ...}
        url: it.HOST + 'cgi-bin/script.py', 
        dataType: 'jsonp',
        complete: function(data) {},
        success: function(json) { 
            jQuery('#' + it.id).append(json.html);
            new CanvasManager({HOST: it.HOST});

        },
        error: function(data) {},
        jsonpCallback: 'jsonP',
    });
}
Collages.prototype.jsLoader = function() {
    var it = this;
    var script_load = it.js_required.pop();
    // прекращаем рекурсию когда массив закончился
    if (!script_load) { it.htmlLoader(); return false };
    // если уже имеется jquery нужной версии, то пропускаем итерацию
    if (script_load.name == "jquery" + it.jQversion) {
        if (window.$ && window.$().jquery >= this.jQversion) { this.jsLoader(); return false };
    }
    // если уже имеется jqueryui то пропускаем итерацию
    if (script_load.name == "jqueryui") { if (jQuery.ui) { this.jsLoader(); return false } };

    var script = document.createElement("script");
    script.src = script_load.url + "?" + Math.random(); //TODO потом убрать Math.random
    document.getElementById(it.id).appendChild(script);
    script.onload = function() {
        //console.log(script_load.name, " - loaded");
        if (script_load.name == "jquery" + it.jQversion) { it.jQuery = jQuery; jQuery.noConflict() };
        it.jsLoader();
    }
}
