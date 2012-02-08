/* Fabric.js Copyright 2008-2011, Bitsonnet (Juriy Zaytsev, Maxim Chernyak) */
var fabric = fabric || {
    version: "0.7.11"
};
if (typeof exports != "undefined") {
    exports.fabric = fabric
}
if (typeof document != "undefined" && typeof window != "undefined") {
    fabric.document = document;
    fabric.window = window
} else {
    fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>");
    fabric.window = fabric.document.createWindow()
}
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;
if (!this.JSON) {
    this.JSON = {}
}(function () {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
        case "string":
            return quote(value);
        case "number":
            return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
            return String(value);
        case "object":
            if (!value) {
                return "null"
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null"
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === "string") {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v)
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v)
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 */
var Cufon = (function () {
    var k = function () {
            return k.replace.apply(null, arguments)
        };
    var u = k.DOM = {
        ready: (function () {
            var z = false,
                B = {
                    loaded: 1,
                    complete: 1
                };
            var y = [],
                A = function () {
                    if (z) {
                        return
                    }
                    z = true;
                    for (var C; C = y.shift(); C()) {}
                };
            if (fabric.document.addEventListener) {
                fabric.document.addEventListener("DOMContentLoaded", A, false);
                fabric.window.addEventListener("pageshow", A, false)
            }
            if (!fabric.window.opera && fabric.document.readyState) {
                (function () {
                    B[fabric.document.readyState] ? A() : setTimeout(arguments.callee, 10)
                })()
            }
            if (fabric.document.readyState && fabric.document.createStyleSheet) {
                (function () {
                    try {
                        fabric.document.body.doScroll("left");
                        A()
                    } catch (C) {
                        setTimeout(arguments.callee, 1)
                    }
                })()
            }
            o(fabric.window, "load", A);
            return function (C) {
                if (!arguments.length) {
                    A()
                } else {
                    z ? C() : y.push(C)
                }
            }
        })()
    };
    var l = k.CSS = {
        Size: function (z, y) {
            this.value = parseFloat(z);
            this.unit = String(z).match(/[a-z%]*$/)[0] || "px";
            this.convert = function (A) {
                return A / y * this.value
            };
            this.convertFrom = function (A) {
                return A / this.value * y
            };
            this.toString = function () {
                return this.value + this.unit
            }
        },
        getStyle: function (y) {
            return new a(y.style)
        },
        quotedList: i(function (B) {
            var A = [],
                z = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,
                y;
            while (y = z.exec(B)) {
                A.push(y[3] || y[1])
            }
            return A
        }),
        ready: (function () {
            var A = false;
            var z = [],
                B = function () {
                    A = true;
                    for (var D; D = z.shift(); D()) {}
                };
            var y = Object.prototype.propertyIsEnumerable ? f("style") : {
                length: 0
            };
            var C = f("link");
            u.ready(function () {
                var G = 0,
                    F;
                for (var E = 0, D = C.length; F = C[E], E < D; ++E) {
                    if (!F.disabled && F.rel.toLowerCase() == "stylesheet") {
                        ++G
                    }
                }
                if (fabric.document.styleSheets.length >= y.length + G) {
                    B()
                } else {
                    setTimeout(arguments.callee, 10)
                }
            });
            return function (D) {
                if (A) {
                    D()
                } else {
                    z.push(D)
                }
            }
        })(),
        supports: function (A, z) {
            var y = fabric.document.createElement("span").style;
            if (y[A] === undefined) {
                return false
            }
            y[A] = z;
            return y[A] === z
        },
        textAlign: function (B, A, y, z) {
            if (A.get("textAlign") == "right") {
                if (y > 0) {
                    B = " " + B
                }
            } else {
                if (y < z - 1) {
                    B += " "
                }
            }
            return B
        },
        textDecoration: function (D, C) {
            if (!C) {
                C = this.getStyle(D)
            }
            var z = {
                underline: null,
                overline: null,
                "line-through": null
            };
            for (var y = D; y.parentNode && y.parentNode.nodeType == 1;) {
                var B = true;
                for (var A in z) {
                    if (z[A]) {
                        continue
                    }
                    if (C.get("textDecoration").indexOf(A) != -1) {
                        z[A] = C.get("color")
                    }
                    B = false
                }
                if (B) {
                    break
                }
                C = this.getStyle(y = y.parentNode)
            }
            return z
        },
        textShadow: i(function (C) {
            if (C == "none") {
                return null
            }
            var B = [],
                D = {},
                y, z = 0;
            var A = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
            while (y = A.exec(C)) {
                if (y[0] == ",") {
                    B.push(D);
                    D = {}, z = 0
                } else {
                    if (y[1]) {
                        D.color = y[1]
                    } else {
                        D[["offX", "offY", "blur"][z++]] = y[2]
                    }
                }
            }
            B.push(D);
            return B
        }),
        color: i(function (z) {
            var y = {};
            y.color = z.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function (B, A, C) {
                y.opacity = parseFloat(C);
                return "rgb(" + A + ")"
            });
            return y
        }),
        textTransform: function (z, y) {
            return z[{
                uppercase: "toUpperCase",
                lowercase: "toLowerCase"
            }[y.get("textTransform")] || "toString"]()
        }
    };

    function q(z) {
        var y = this.face = z.face;
        this.glyphs = z.glyphs;
        this.w = z.w;
        this.baseSize = parseInt(y["units-per-em"], 10);
        this.family = y["font-family"].toLowerCase();
        this.weight = y["font-weight"];
        this.style = y["font-style"] || "normal";
        this.viewBox = (function () {
            var B = y.bbox.split(/\s+/);
            var A = {
                minX: parseInt(B[0], 10),
                minY: parseInt(B[1], 10),
                maxX: parseInt(B[2], 10),
                maxY: parseInt(B[3], 10)
            };
            A.width = A.maxX - A.minX, A.height = A.maxY - A.minY;
            A.toString = function () {
                return [this.minX, this.minY, this.width, this.height].join(" ")
            };
            return A
        })();
        this.ascent = -parseInt(y.ascent, 10);
        this.descent = -parseInt(y.descent, 10);
        this.height = -this.ascent + this.descent
    }
    function e() {
        var z = {},
            y = {
                oblique: "italic",
                italic: "oblique"
            };
        this.add = function (A) {
            (z[A.style] || (z[A.style] = {}))[A.weight] = A
        };
        this.get = function (E, F) {
            var D = z[E] || z[y[E]] || z.normal || z.italic || z.oblique;
            if (!D) {
                return null
            }
            F = {
                normal: 400,
                bold: 700
            }[F] || parseInt(F, 10);
            if (D[F]) {
                return D[F]
            }
            var B = {
                1: 1,
                99: 0
            }[F % 100],
                H = [],
                C, A;
            if (B === undefined) {
                B = F > 400
            }
            if (F == 500) {
                F = 400
            }
            for (var G in D) {
                G = parseInt(G, 10);
                if (!C || G < C) {
                    C = G
                }
                if (!A || G > A) {
                    A = G
                }
                H.push(G)
            }
            if (F < C) {
                F = C
            }
            if (F > A) {
                F = A
            }
            H.sort(function (J, I) {
                return (B ? (J > F && I > F) ? J < I : J > I : (J < F && I < F) ? J > I : J < I) ? -1 : 1
            });
            return D[H[0]]
        }
    }
    function p() {
        function A(C, D) {
            if (C.contains) {
                return C.contains(D)
            }
            return C.compareDocumentPosition(D) & 16
        }
        function y(D) {
            var C = D.relatedTarget;
            if (!C || A(this, C)) {
                return
            }
            z(this)
        }
        function B(C) {
            z(this)
        }
        function z(C) {
            setTimeout(function () {
                k.replace(C, d.get(C).options, true)
            }, 10)
        }
        this.attach = function (C) {
            if (C.onmouseenter === undefined) {
                o(C, "mouseover", y);
                o(C, "mouseout", y)
            } else {
                o(C, "mouseenter", B);
                o(C, "mouseleave", B)
            }
        }
    }
    function x() {
        var A = {},
            y = 0;

        function z(B) {
            return B.cufid || (B.cufid = ++y)
        }
        this.get = function (B) {
            var C = z(B);
            return A[C] || (A[C] = {})
        }
    }
    function a(y) {
        var A = {},
            z = {};
        this.get = function (B) {
            return A[B] != undefined ? A[B] : y[B]
        };
        this.getSize = function (C, B) {
            return z[C] || (z[C] = new l.Size(this.get(C), B))
        };
        this.extend = function (B) {
            for (var C in B) {
                A[C] = B[C]
            }
            return this
        }
    }
    function o(z, y, A) {
        if (z.addEventListener) {
            z.addEventListener(y, A, false)
        } else {
            if (z.attachEvent) {
                z.attachEvent("on" + y, function () {
                    return A.call(z, fabric.window.event)
                })
            }
        }
    }
    function r(z, y) {
        var A = d.get(z);
        if (A.options) {
            return z
        }
        if (y.hover && y.hoverables[z.nodeName.toLowerCase()]) {
            b.attach(z)
        }
        A.options = y;
        return z
    }
    function i(y) {
        var z = {};
        return function (A) {
            if (!z.hasOwnProperty(A)) {
                z[A] = y.apply(null, arguments)
            }
            return z[A]
        }
    }
    function c(D, C) {
        if (!C) {
            C = l.getStyle(D)
        }
        var z = l.quotedList(C.get("fontFamily").toLowerCase()),
            B;
        for (var A = 0, y = z.length; A < y; ++A) {
            B = z[A];
            if (h[B]) {
                return h[B].get(C.get("fontStyle"), C.get("fontWeight"))
            }
        }
        return null
    }
    function f(y) {
        return fabric.document.getElementsByTagName(y)
    }
    function g() {
        var y = {},
            B;
        for (var A = 0, z = arguments.length; A < z; ++A) {
            for (B in arguments[A]) {
                y[B] = arguments[A][B]
            }
        }
        return y
    }
    function m(B, J, z, K, C, A) {
        var I = K.separate;
        if (I == "none") {
            return w[K.engine].apply(null, arguments)
        }
        var H = fabric.document.createDocumentFragment(),
            E;
        var F = J.split(n[I]),
            y = (I == "words");
        if (y && s) {
            if (/^\s/.test(J)) {
                F.unshift("")
            }
            if (/\s$/.test(J)) {
                F.push("")
            }
        }
        for (var G = 0, D = F.length; G < D; ++G) {
            E = w[K.engine](B, y ? l.textAlign(F[G], z, G, D) : F[G], z, K, C, A, G < D - 1);
            if (E) {
                H.appendChild(E)
            }
        }
        return H
    }
    function j(z, G) {
        var A, y, D, F;
        for (var B = r(z, G).firstChild; B; B = D) {
            D = B.nextSibling;
            F = false;
            if (B.nodeType == 1) {
                if (!B.firstChild) {
                    continue
                }
                if (!/cufon/.test(B.className)) {
                    arguments.callee(B, G);
                    continue
                } else {
                    F = true
                }
            }
            if (!y) {
                y = l.getStyle(z).extend(G)
            }
            if (!A) {
                A = c(z, y)
            }
            if (!A) {
                continue
            }
            if (F) {
                w[G.engine](A, null, y, G, B, z);
                continue
            }
            var E = B.data;
            if (E === "") {
                continue
            }
            var C = m(A, E, y, G, B, z);
            if (C) {
                B.parentNode.replaceChild(C, B)
            } else {
                B.parentNode.removeChild(B)
            }
        }
    }
    var s = " ".split(/\s+/).length == 0;
    var d = new x();
    var b = new p();
    var v = [];
    var w = {},
        h = {},
        t = {
            engine: null,
            hover: false,
            hoverables: {
                a: true
            },
            printable: true,
            selector: (fabric.window.Sizzle || (fabric.window.jQuery &&
            function (y) {
                return jQuery(y)
            }) || (fabric.window.dojo && dojo.query) || (fabric.window.$$ &&
            function (y) {
                return $$(y)
            }) || (fabric.window.$ &&
            function (y) {
                return $(y)
            }) || (fabric.document.querySelectorAll &&
            function (y) {
                return fabric.document.querySelectorAll(y)
            }) || f),
            separate: "words",
            textShadow: "none"
        };
    var n = {
        words: /\s+/,
        characters: ""
    };
    k.now = function () {
        u.ready();
        return k
    };
    k.refresh = function () {
        var A = v.splice(0, v.length);
        for (var z = 0, y = A.length; z < y; ++z) {
            k.replace.apply(null, A[z])
        }
        return k
    };
    k.registerEngine = function (z, y) {
        if (!y) {
            return k
        }
        w[z] = y;
        return k.set("engine", z)
    };
    k.registerFont = function (A) {
        var y = new q(A),
            z = y.family;
        if (!h[z]) {
            h[z] = new e()
        }
        h[z].add(y);
        return k.set("fontFamily", '"' + z + '"')
    };
    k.replace = function (A, z, y) {
        z = g(t, z);
        if (!z.engine) {
            return k
        }
        if (typeof z.textShadow == "string" && z.textShadow) {
            z.textShadow = l.textShadow(z.textShadow)
        }
        if (!y) {
            v.push(arguments)
        }
        if (A.nodeType || typeof A == "string") {
            A = [A]
        }
        l.ready(function () {
            for (var C = 0, B = A.length; C < B; ++C) {
                var D = A[C];
                if (typeof D == "string") {
                    k.replace(z.selector(D), z, true)
                } else {
                    j(D, z)
                }
            }
        });
        return k
    };
    k.replaceElement = function (z, y) {
        y = g(t, y);
        if (typeof y.textShadow == "string" && y.textShadow) {
            y.textShadow = l.textShadow(y.textShadow)
        }
        return j(z, y)
    };
    k.engines = w;
    k.fonts = h;
    k.getOptions = function () {
        return g(t)
    };
    k.set = function (y, z) {
        t[y] = z;
        return k
    };
    return k
})();
Cufon.registerEngine("canvas", (function () {
    var b = fabric.document.createElement("canvas");
    if (!b || !b.getContext || !b.getContext.apply) {
        return
    }
    b = null;
    var a = Cufon.CSS.supports("display", "inline-block");
    var e = !a && (fabric.document.compatMode == "BackCompat" || /frameset|transitional/i.test(fabric.document.doctype.publicId));
    var f = fabric.document.createElement("style");
    f.type = "text/css";
    f.appendChild(fabric.document.createTextNode(".cufon-canvas{text-indent:0}@media screen,projection{.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle" + (e ? "" : ";font-size:1px;line-height:1px") + "}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden}" + (a ? ".cufon-canvas canvas{position:relative}" : ".cufon-canvas canvas{position:absolute}") + "}@media print{.cufon-canvas{padding:0 !important}.cufon-canvas canvas{display:none}.cufon-canvas .cufon-alt{display:inline}}"));
    fabric.document.getElementsByTagName("head")[0].appendChild(f);

    function d(p, h) {
        var n = 0,
            m = 0;
        var g = [],
            o = /([mrvxe])([^a-z]*)/g,
            k;
        generate: for (var j = 0; k = o.exec(p); ++j) {
            var l = k[2].split(",");
            switch (k[1]) {
            case "v":
                g[j] = {
                    m: "bezierCurveTo",
                    a: [n + ~~l[0], m + ~~l[1], n + ~~l[2], m + ~~l[3], n += ~~l[4], m += ~~l[5]]
                };
                break;
            case "r":
                g[j] = {
                    m: "lineTo",
                    a: [n += ~~l[0], m += ~~l[1]]
                };
                break;
            case "m":
                g[j] = {
                    m: "moveTo",
                    a: [n = ~~l[0], m = ~~l[1]]
                };
                break;
            case "x":
                g[j] = {
                    m: "closePath"
                };
                break;
            case "e":
                break generate
            }
            h[g[j].m].apply(h, g[j].a)
        }
        return g
    }
    function c(m, k) {
        for (var j = 0, h = m.length; j < h; ++j) {
            var g = m[j];
            k[g.m].apply(k, g.a)
        }
    }
    return function (ab, E, W, A, J, ac) {
        var n = (E === null);
        var H = ab.viewBox;
        var o = W.getSize("fontSize", ab.baseSize);
        var U = W.get("letterSpacing");
        U = (U == "normal") ? 0 : o.convertFrom(parseInt(U, 10));
        var I = 0,
            V = 0,
            T = 0,
            C = 0;
        var G = A.textShadow,
            R = [];
        Cufon.textOptions.shadowOffsets = [];
        Cufon.textOptions.shadows = null;
        if (G) {
            Cufon.textOptions.shadows = G;
            for (var aa = 0, X = G.length; aa < X; ++aa) {
                var N = G[aa];
                var Q = o.convertFrom(parseFloat(N.offX));
                var P = o.convertFrom(parseFloat(N.offY));
                R[aa] = [Q, P];
                if (P < I) {
                    I = P
                }
                if (Q > V) {
                    V = Q
                }
                if (P > T) {
                    T = P
                }
                if (Q < C) {
                    C = Q
                }
            }
        }
        var ag = Cufon.CSS.textTransform(n ? J.alt : E, W).split("");
        var h = 0,
            D = null;
        var z = 0,
            M = 1,
            L = [];
        for (var aa = 0, X = ag.length; aa < X; ++aa) {
            if (ag[aa] === "\n") {
                M++;
                if (h > z) {
                    z = h
                }
                L.push(h);
                h = 0;
                continue
            }
            var B = ab.glyphs[ag[aa]] || ab.missingGlyph;
            if (!B) {
                continue
            }
            h += D = Number(B.w || ab.w) + U
        }
        L.push(h);
        h = Math.max(z, h);
        var m = [];
        for (var aa = L.length; aa--;) {
            m[aa] = h - L[aa]
        }
        if (D === null) {
            return null
        }
        V += (H.width - D);
        C += H.minX;
        var v, p;
        if (n) {
            v = J;
            p = J.firstChild
        } else {
            v = fabric.document.createElement("span");
            v.className = "cufon cufon-canvas";
            v.alt = E;
            p = fabric.document.createElement("canvas");
            v.appendChild(p);
            if (A.printable) {
                var Y = fabric.document.createElement("span");
                Y.className = "cufon-alt";
                Y.appendChild(fabric.document.createTextNode(E));
                v.appendChild(Y)
            }
        }
        var ah = v.style;
        var O = p.style || {};
        var k = o.convert(H.height - I + T);
        var af = Math.ceil(k);
        var S = af / k;
        p.width = Math.ceil(o.convert(h + V - C) * S);
        p.height = af;
        I += H.minY;
        O.top = Math.round(o.convert(I - ab.ascent)) + "px";
        O.left = Math.round(o.convert(C)) + "px";
        var j = Math.ceil(o.convert(h * S));
        var t = j + "px";
        var s = o.convert(ab.height);
        var F = (A.lineHeight - 1) * o.convert(-ab.ascent / 5) * (M - 1);
        Cufon.textOptions.width = j;
        Cufon.textOptions.height = (s * M) + F;
        Cufon.textOptions.lines = M;
        Cufon.textOptions.totalLineHeight = F;
        if (a) {
            ah.width = t;
            ah.height = s + "px"
        } else {
            ah.paddingLeft = t;
            ah.paddingBottom = (s - 1) + "px"
        }
        var ad = Cufon.textOptions.context || p.getContext("2d"),
            K = af / H.height;
        Cufon.textOptions.fontAscent = ab.ascent * K;
        Cufon.textOptions.boundaries = null;
        for (var w = Cufon.textOptions.shadowOffsets, aa = R.length; aa--;) {
            w[aa] = [R[aa][0] * K, R[aa][1] * K]
        }
        ad.save();
        ad.scale(K, K);
        ad.translate(-C - ((1 / K * p.width) / 2) + (Cufon.fonts[ab.family].offsetLeft || 0), -I - (Cufon.textOptions.height / K) / 2);
        ad.lineWidth = ab.face["underline-thickness"];
        ad.save();

        function q(i, g) {
            ad.strokeStyle = g;
            ad.beginPath();
            ad.moveTo(0, i);
            ad.lineTo(h, i);
            ad.stroke()
        }
        var r = Cufon.getTextDecoration(A),
            u = A.fontStyle === "italic";

        function ae() {
            ad.save();
            ad.fillStyle = A.backgroundColor;
            var ai = 0,
                am = 0,
                x = [{
                    left: 0
                }];
            if (A.textAlign === "right") {
                ad.translate(m[am], 0);
                x[0].left = m[am] * K
            } else {
                if (A.textAlign === "center") {
                    ad.translate(m[am] / 2, 0);
                    x[0].left = m[am] / 2 * K
                }
            }
            for (var ak = 0, aj = ag.length; ak < aj; ++ak) {
                if (ag[ak] === "\n") {
                    am++;
                    var al = -ab.ascent - ((ab.ascent / 5) * A.lineHeight);
                    var g = x[x.length - 1];
                    var y = {
                        left: 0
                    };
                    g.width = ai * K;
                    g.height = (-ab.ascent + ab.descent) * K;
                    if (A.textAlign === "right") {
                        ad.translate(-h, al);
                        ad.translate(m[am], 0);
                        y.left = m[am] * K
                    } else {
                        if (A.textAlign === "center") {
                            ad.translate(-ai - (m[am - 1] / 2), al);
                            ad.translate(m[am] / 2, 0);
                            y.left = m[am] / 2 * K
                        } else {
                            ad.translate(-ai, al)
                        }
                    }
                    x.push(y);
                    ai = 0;
                    continue
                }
                var ao = ab.glyphs[ag[ak]] || ab.missingGlyph;
                if (!ao) {
                    continue
                }
                var an = Number(ao.w || ab.w) + U;
                if (A.backgroundColor) {
                    ad.save();
                    ad.translate(0, ab.ascent);
                    ad.fillRect(0, 0, an + 10, -ab.ascent + ab.descent);
                    ad.restore()
                }
                ad.translate(an, 0);
                ai += an;
                if (ak == aj - 1) {
                    x[x.length - 1].width = ai * K;
                    x[x.length - 1].height = (-ab.ascent + ab.descent) * K
                }
            }
            ad.restore();
            Cufon.textOptions.boundaries = x
        }
        function Z(y) {
            ad.fillStyle = y || Cufon.textOptions.color || W.get("color");
            var al = 0,
                am = 0;
            if (A.textAlign === "right") {
                ad.translate(m[am], 0)
            } else {
                if (A.textAlign === "center") {
                    ad.translate(m[am] / 2, 0)
                }
            }
            for (var aj = 0, x = ag.length; aj < x; ++aj) {
                if (ag[aj] === "\n") {
                    am++;
                    var ai = -ab.ascent - ((ab.ascent / 5) * A.lineHeight);
                    if (A.textAlign === "right") {
                        ad.translate(-h, ai);
                        ad.translate(m[am], 0)
                    } else {
                        if (A.textAlign === "center") {
                            ad.translate(-al - (m[am - 1] / 2), ai);
                            ad.translate(m[am] / 2, 0)
                        } else {
                            ad.translate(-al, ai)
                        }
                    }
                    al = 0;
                    continue
                }
                var ak = ab.glyphs[ag[aj]] || ab.missingGlyph;
                if (!ak) {
                    continue
                }
                var g = Number(ak.w || ab.w) + U;
                if (r) {
                    ad.save();
                    ad.strokeStyle = ad.fillStyle;
                    ad.lineWidth += ad.lineWidth;
                    ad.beginPath();
                    if (r.underline) {
                        ad.moveTo(0, -ab.face["underline-position"] + 0.5);
                        ad.lineTo(g, -ab.face["underline-position"] + 0.5)
                    }
                    if (r.overline) {
                        ad.moveTo(0, ab.ascent + 0.5);
                        ad.lineTo(g, ab.ascent + 0.5)
                    }
                    if (r["line-through"]) {
                        ad.moveTo(0, -ab.descent + 0.5);
                        ad.lineTo(g, -ab.descent + 0.5)
                    }
                    ad.stroke();
                    ad.restore()
                }
                if (u) {
                    ad.save();
                    ad.transform(1, 0, -0.25, 1, 0, 0)
                }
                ad.beginPath();
                if (ak.d) {
                    if (ak.code) {
                        c(ak.code, ad)
                    } else {
                        ak.code = d("m" + ak.d, ad)
                    }
                }
                ad.fill();
                if (A.strokeStyle) {
                    ad.closePath();
                    ad.save();
                    ad.lineWidth = A.strokeWidth;
                    ad.strokeStyle = A.strokeStyle;
                    ad.stroke();
                    ad.restore()
                }
                if (u) {
                    ad.restore()
                }
                ad.translate(g, 0);
                al += g
            }
        }
        if (G) {
            for (var aa = 0, X = G.length; aa < X; ++aa) {
                var N = G[aa];
                ad.save();
                ad.translate.apply(ad, R[aa]);
                Z(N.color);
                ad.restore()
            }
        }
        ad.save();
        ae();
        Z();
        ad.restore();
        ad.restore();
        ad.restore();
        return v
    }
})());
Cufon.registerEngine("vml", (function () {
    if (!fabric.document.namespaces) {
        return
    }
    var d = fabric.document.createElement("canvas");
    if (d && d.getContext && d.getContext.apply) {
        return
    }
    if (fabric.document.namespaces.cvml == null) {
        fabric.document.namespaces.add("cvml", "urn:schemas-microsoft-com:vml")
    }
    var b = fabric.document.createElement("cvml:shape");
    b.style.behavior = "url(#default#VML)";
    if (!b.coordsize) {
        return
    }
    b = null;
    fabric.document.write('<style type="text/css">.cufon-vml-canvas{text-indent:0}@media screen{cvml\\:shape,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute}.cufon-vml-canvas{position:absolute;text-align:left}.cufon-vml{display:inline-block;position:relative;vertical-align:middle}.cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px}a .cufon-vml{cursor:pointer}}@media print{.cufon-vml *{display:none}.cufon-vml .cufon-alt{display:inline}}</style>');

    function c(e, f) {
        return a(e, /(?:em|ex|%)$/i.test(f) ? "1em" : f)
    }
    function a(h, i) {
        if (/px$/i.test(i)) {
            return parseFloat(i)
        }
        var g = h.style.left,
            f = h.runtimeStyle.left;
        h.runtimeStyle.left = h.currentStyle.left;
        h.style.left = i;
        var e = h.style.pixelLeft;
        h.style.left = g;
        h.runtimeStyle.left = f;
        return e
    }
    return function (T, z, O, w, D, U, M) {
        var h = (z === null);
        if (h) {
            z = D.alt
        }
        var B = T.viewBox;
        var j = O.computedFontSize || (O.computedFontSize = new Cufon.CSS.Size(c(U, O.get("fontSize")) + "px", T.baseSize));
        var L = O.computedLSpacing;
        if (L == undefined) {
            L = O.get("letterSpacing");
            O.computedLSpacing = L = (L == "normal") ? 0 : ~~j.convertFrom(a(U, L))
        }
        var t, m;
        if (h) {
            t = D;
            m = D.firstChild
        } else {
            t = fabric.document.createElement("span");
            t.className = "cufon cufon-vml";
            t.alt = z;
            m = fabric.document.createElement("span");
            m.className = "cufon-vml-canvas";
            t.appendChild(m);
            if (w.printable) {
                var R = fabric.document.createElement("span");
                R.className = "cufon-alt";
                R.appendChild(fabric.document.createTextNode(z));
                t.appendChild(R)
            }
            if (!M) {
                t.appendChild(fabric.document.createElement("cvml:shape"))
            }
        }
        var Z = t.style;
        var G = m.style;
        var f = j.convert(B.height),
            W = Math.ceil(f);
        var K = W / f;
        var J = B.minX,
            I = B.minY;
        G.height = W;
        G.top = Math.round(j.convert(I - T.ascent));
        G.left = Math.round(j.convert(J));
        Z.height = j.convert(T.height) + "px";
        var p = Cufon.getTextDecoration(w);
        var y = O.get("color");
        var X = Cufon.CSS.textTransform(z, O).split("");
        var e = 0,
            H = 0,
            q = null;
        var x, r, A = w.textShadow;
        for (var S = 0, Q = 0, P = X.length; S < P; ++S) {
            x = T.glyphs[X[S]] || T.missingGlyph;
            if (x) {
                e += q = ~~ (x.w || T.w) + L
            }
        }
        if (q === null) {
            return null
        }
        var s = -J + e + (B.width - q);
        var Y = j.convert(s * K),
            N = Math.round(Y);
        var F = s + "," + B.height,
            g;
        var C = "r" + F + "nsnf";
        for (S = 0; S < P; ++S) {
            x = T.glyphs[X[S]] || T.missingGlyph;
            if (!x) {
                continue
            }
            if (h) {
                r = m.childNodes[Q];
                if (r.firstChild) {
                    r.removeChild(r.firstChild)
                }
            } else {
                r = fabric.document.createElement("cvml:shape");
                m.appendChild(r)
            }
            r.stroked = "f";
            r.coordsize = F;
            r.coordorigin = g = (J - H) + "," + I;
            r.path = (x.d ? "m" + x.d + "xe" : "") + "m" + g + C;
            r.fillcolor = y;
            var V = r.style;
            V.width = N;
            V.height = W;
            if (A) {
                var o = A[0],
                    n = A[1];
                var v = Cufon.CSS.color(o.color),
                    u;
                var E = fabric.document.createElement("cvml:shadow");
                E.on = "t";
                E.color = v.color;
                E.offset = o.offX + "," + o.offY;
                if (n) {
                    u = Cufon.CSS.color(n.color);
                    E.type = "double";
                    E.color2 = u.color;
                    E.offset2 = n.offX + "," + n.offY
                }
                E.opacity = v.opacity || (u && u.opacity) || 1;
                r.appendChild(E)
            }
            H += ~~ (x.w || T.w) + L;
            ++Q
        }
        Z.width = Math.max(Math.ceil(j.convert(e * K)), 0);
        return t
    }
})());
Cufon.getTextDecoration = function (a) {
    return {
        underline: a.textDecoration === "underline",
        overline: a.textDecoration === "overline",
        "line-through": a.textDecoration === "line-through"
    }
};
if (typeof exports != "undefined") {
    exports.Cufon = Cufon
}
fabric.log = function () {};
fabric.warn = function () {};
if (typeof console !== "undefined") {
    if (typeof console.log !== "undefined" && console.log.apply) {
        fabric.log = function () {
            return console.log.apply(console, arguments)
        }
    }
    if (typeof console.warn !== "undefined" && console.warn.apply) {
        fabric.warn = function () {
            return console.warn.apply(console, arguments)
        }
    }
}
fabric.Observable = {
    observe: function (a, b) {
        if (!this.__eventListeners) {
            this.__eventListeners = {}
        }
        if (arguments.length === 1) {
            for (var c in a) {
                this.observe(c, a[c])
            }
        } else {
            if (!this.__eventListeners[a]) {
                this.__eventListeners[a] = []
            }
            this.__eventListeners[a].push(b)
        }
    },
    stopObserving: function (a, b) {
        if (!this.__eventListeners) {
            this.__eventListeners = {}
        }
        if (this.__eventListeners[a]) {
            fabric.util.removeFromArray(this.__eventListeners[a], b)
        }
    },
    fire: function (d, c) {
        if (!this.__eventListeners) {
            this.__eventListeners = {}
        }
        var b = this.__eventListeners[d];
        if (!b) {
            return
        }
        for (var e = 0, a = b.length; e < a; e++) {
            b[e]({
                memo: c
            })
        }
    }
};
(function () {
    fabric.util = {};

    function g(l, k) {
        var j = l.indexOf(k);
        if (j !== -1) {
            l.splice(j, 1)
        }
        return l
    }
    function e(k, j) {
        return Math.floor(Math.random() * (j - k + 1)) + k
    }
    var f = Math.PI / 180;

    function b(j) {
        return j * f
    }
    function d(k, j) {
        return parseFloat(Number(k).toFixed(j))
    }
    function i() {
        return false
    }
    function c(u) {
        u || (u = {});
        var k = +new Date(),
            m = u.duration || 500,
            t = k + m,
            l, s, p = u.onChange ||
        function () {}, n = u.abort ||
        function () {
            return false
        }, q = u.easing ||
        function (v) {
            return (-Math.cos(v * Math.PI) / 2) + 0.5
        }, j = "startValue" in u ? u.startValue : 0, r = "endValue" in u ? u.endValue : 100;
        u.onStart && u.onStart();
        (function o() {
            l = +new Date();
            s = l > t ? 1 : (l - k) / m;
            p(j + (r - j) * q(s));
            if (l > t || n()) {
                u.onComplete && u.onComplete();
                return
            }
            h(o)
        })()
    }
    var h = (function () {
        return fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame ||
        function (k, j) {
            fabric.window.setTimeout(k, 1000 / 60)
        }
    })();

    function a(k, m, l) {
        if (k) {
            var j = new Image();
            j.onload = function () {
                m && m.call(l, j);
                j = j.onload = null
            };
            j.src = k
        }
    }
    fabric.util.removeFromArray = g;
    fabric.util.degreesToRadians = b;
    fabric.util.toFixed = d;
    fabric.util.getRandomInt = e;
    fabric.util.falseFunction = i;
    fabric.util.animate = c;
    fabric.util.requestAnimFrame = h;
    fabric.util.loadImage = a
})();
(function () {
    var d = Array.prototype.slice;
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (g) {
            if (this === void 0 || this === null) {
                throw new TypeError()
            }
            var h = Object(this),
                e = h.length >>> 0;
            if (e === 0) {
                return -1
            }
            var i = 0;
            if (arguments.length > 0) {
                i = Number(arguments[1]);
                if (i !== i) {
                    i = 0
                } else {
                    if (i !== 0 && i !== (1 / 0) && i !== -(1 / 0)) {
                        i = (i > 0 || -1) * Math.floor(Math.abs(i))
                    }
                }
            }
            if (i >= e) {
                return -1
            }
            var f = i >= 0 ? i : Math.max(e - Math.abs(i), 0);
            for (; f < e; f++) {
                if (f in h && h[f] === g) {
                    return f
                }
            }
            return -1
        }
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (h, g) {
            for (var f = 0, e = this.length >>> 0; f < e; f++) {
                if (f in this) {
                    h.call(g, this[f], f, this)
                }
            }
        }
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (j, h) {
            var f = [];
            for (var g = 0, e = this.length >>> 0; g < e; g++) {
                if (g in this) {
                    f[g] = j.call(h, this[g], g, this)
                }
            }
            return f
        }
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function (h, g) {
            for (var f = 0, e = this.length >>> 0; f < e; f++) {
                if (f in this && !h.call(g, this[f], f, this)) {
                    return false
                }
            }
            return true
        }
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function (h, g) {
            for (var f = 0, e = this.length >>> 0; f < e; f++) {
                if (f in this && h.call(g, this[f], f, this)) {
                    return true
                }
            }
            return false
        }
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (j, h) {
            var f = [],
                k;
            for (var g = 0, e = this.length >>> 0; g < e; g++) {
                if (g in this) {
                    k = this[g];
                    if (j.call(h, k, g, this)) {
                        f.push(k)
                    }
                }
            }
            return f
        }
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (g) {
            var e = this.length >>> 0,
                f = 0,
                h;
            if (arguments.length > 1) {
                h = arguments[1]
            } else {
                do {
                    if (f in this) {
                        h = this[f++];
                        break
                    }
                    if (++f >= e) {
                        throw new TypeError()
                    }
                } while (true)
            }
            for (; f < e; f++) {
                if (f in this) {
                    h = g.call(null, h, this[f], f, this)
                }
            }
            return h
        }
    }
    function b(k, j) {
        var g = d.call(arguments, 2),
            f = [];
        for (var h = 0, e = k.length; h < e; h++) {
            f[h] = g.length ? k[h][j].apply(k[h], g) : k[h][j].call(k[h])
        }
        return f
    }
    function a(h, g) {
        if (!h || h.length === 0) {
            return undefined
        }
        var f = h.length - 1,
            e = g ? h[f][g] : h[f];
        if (g) {
            while (f--) {
                if (h[f][g] >= e) {
                    e = h[f][g]
                }
            }
        } else {
            while (f--) {
                if (h[f] >= e) {
                    e = h[f]
                }
            }
        }
        return e
    }
    function c(h, g) {
        if (!h || h.length === 0) {
            return undefined
        }
        var f = h.length - 1,
            e = g ? h[f][g] : h[f];
        if (g) {
            while (f--) {
                if (h[f][g] < e) {
                    e = h[f][g]
                }
            }
        } else {
            while (f--) {
                if (h[f] < e) {
                    e = h[f]
                }
            }
        }
        return e
    }
    fabric.util.array = {
        invoke: b,
        min: c,
        max: a
    }
})();
(function () {
    function b(c, e) {
        for (var d in e) {
            c[d] = e[d]
        }
        return c
    }
    function a(c) {
        return b({}, c)
    }
    fabric.util.object = {
        extend: b,
        clone: a
    }
})();
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
    }
}
function camelize(a) {
    return a.replace(/-+(.)?/g, function (b, c) {
        return c ? c.toUpperCase() : ""
    })
}
function capitalize(a) {
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
}
fabric.util.string = {
    camelize: camelize,
    capitalize: capitalize
};
(function () {
    var c = Array.prototype.slice,
        a = Function.prototype.apply,
        b = function () {};
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (d) {
            var g = this,
                e = c.call(arguments, 1),
                f;
            if (e.length) {
                f = function () {
                    return a.call(g, this instanceof b ? this : d, e.concat(c.call(arguments)))
                }
            } else {
                f = function () {
                    return a.call(g, this instanceof b ? this : d, arguments)
                }
            }
            b.prototype = this.prototype;
            f.prototype = new b;
            return f
        }
    }
})();
(function () {
    var f = Array.prototype.slice,
        e = function () {};
    var c = (function () {
        for (var g in {
            toString: 1
        }) {
            if (g === "toString") {
                return false
            }
        }
        return true
    })();
    var b;
    if (c) {
        b = function (g, i) {
            if (i.toString !== Object.prototype.toString) {
                g.prototype.toString = i.toString
            }
            if (i.valueOf !== Object.prototype.valueOf) {
                g.prototype.valueOf = i.valueOf
            }
            for (var h in i) {
                g.prototype[h] = i[h]
            }
        }
    } else {
        b = function (g, i) {
            for (var h in i) {
                g.prototype[h] = i[h]
            }
        }
    }
    function a() {}
    function d() {
        var k = null,
            j = f.call(arguments, 0);
        if (typeof j[0] === "function") {
            k = j.shift()
        }
        function g() {
            this.initialize.apply(this, arguments)
        }
        g.superclass = k;
        g.subclasses = [];
        if (k) {
            a.prototype = k.prototype;
            g.prototype = new a;
            k.subclasses.push(g)
        }
        for (var h = 0, l = j.length; h < l; h++) {
            b(g, j[h])
        }
        if (!g.prototype.initialize) {
            g.prototype.initialize = e
        }
        g.prototype.constructor = g;
        return g
    }
    fabric.util.createClass = d
})();
(function (d) {
    function h(s) {
        var w = Array.prototype.slice.call(arguments, 1),
            v, u, r = w.length;
        for (u = 0; u < r; u++) {
            v = typeof s[w[u]];
            if (!(/^(?:function|object|unknown)$/).test(v)) {
                return false
            }
        }
        return true
    }
    var e = (function () {
        if (typeof fabric.document.documentElement.uniqueID !== "undefined") {
            return function (s) {
                return s.uniqueID
            }
        }
        var r = 0;
        return function (s) {
            return s.__uniqueID || (s.__uniqueID = "uniqueID__" + r++)
        }
    })();
    var f, c;
    (function () {
        var r = {};
        f = function (s) {
            return r[s]
        };
        c = function (t, s) {
            r[t] = s
        }
    })();

    function i(r, s) {
        return {
            handler: s,
            wrappedHandler: l(r, s)
        }
    }
    function l(r, s) {
        return function (t) {
            s.call(f(r), t || fabric.window.event)
        }
    }
    function j(s, r) {
        return function (w) {
            if (g[s] && g[s][r]) {
                var u = g[s][r];
                for (var v = 0, t = u.length; v < t; v++) {
                    u[v].call(this, w || fabric.window.event)
                }
            }
        }
    }
    var o = (h(fabric.document.documentElement, "addEventListener", "removeEventListener") && h(fabric.window, "addEventListener", "removeEventListener")),
        m = (h(fabric.document.documentElement, "attachEvent", "detachEvent") && h(fabric.window, "attachEvent", "detachEvent")),
        n = {},
        g = {},
        b, k;
    if (o) {
        b = function (s, r, t) {
            s.addEventListener(r, t, false)
        };
        k = function (s, r, t) {
            s.removeEventListener(r, t, false)
        }
    } else {
        if (m) {
            b = function (t, r, u) {
                var s = e(t);
                c(s, t);
                if (!n[s]) {
                    n[s] = {}
                }
                if (!n[s][r]) {
                    n[s][r] = []
                }
                var v = i(s, u);
                n[s][r].push(v);
                t.attachEvent("on" + r, v.wrappedHandler)
            };
            k = function (v, s, w) {
                var u = e(v),
                    x;
                if (n[u] && n[u][s]) {
                    for (var t = 0, r = n[u][s].length; t < r; t++) {
                        x = n[u][s][t];
                        if (x && x.handler === w) {
                            v.detachEvent("on" + s, x.wrappedHandler);
                            n[u][s][t] = null
                        }
                    }
                }
            }
        } else {
            b = function (t, r, u) {
                var s = e(t);
                if (!g[s]) {
                    g[s] = {}
                }
                if (!g[s][r]) {
                    g[s][r] = [];
                    var v = t["on" + r];
                    if (v) {
                        g[s][r].push(v)
                    }
                    t["on" + r] = j(s, r)
                }
                g[s][r].push(u)
            };
            k = function (w, t, x) {
                var v = e(w);
                if (g[v] && g[v][t]) {
                    var s = g[v][t];
                    for (var u = 0, r = s.length; u < r; u++) {
                        if (s[u] === x) {
                            s.splice(u, 1)
                        }
                    }
                }
            }
        }
    }
    fabric.util.addListener = b;
    fabric.util.removeListener = k;

    function q(r) {
        return {
            x: a(r),
            y: p(r)
        }
    }
    function a(t) {
        var s = fabric.document.documentElement,
            r = fabric.document.body || {
                scrollLeft: 0
            };
        return t.pageX || ((typeof t.clientX != "unknown" ? t.clientX : 0) + (s.scrollLeft || r.scrollLeft) - (s.clientLeft || 0))
    }
    function p(t) {
        var s = fabric.document.documentElement,
            r = fabric.document.body || {
                scrollTop: 0
            };
        return t.pageY || ((typeof t.clientY != "unknown" ? t.clientY : 0) + (s.scrollTop || r.scrollTop) - (s.clientTop || 0))
    }
    if (fabric.isTouchSupported) {
        a = function (r) {
            return r.touches && r.touches[0].pageX
        };
        p = function (r) {
            return r.touches && r.touches[0].pageY
        }
    }
    fabric.util.getPointer = q;
    fabric.util.object.extend(fabric.util, fabric.Observable)
})(this);
(function () {
    function e(j, l) {
        var n = j.style,
            i;
        if (typeof l === "string") {
            j.style.cssText += ";" + l;
            return l.indexOf("opacity") > -1 ? c(j, l.match(/opacity:\s*(\d?\.?\d*)/)[1]) : j
        }
        for (var m in l) {
            if (m === "opacity") {
                c(j, l[m])
            } else {
                var k = (m === "float" || m === "cssFloat") ? (typeof n.styleFloat === "undefined" ? "cssFloat" : "styleFloat") : m;
                n[k] = l[m]
            }
        }
        return j
    }
    var h = fabric.document.createElement("div"),
        g = typeof h.style.opacity === "string",
        b = typeof h.style.filter === "string",
        a = fabric.document.defaultView,
        f = a && typeof a.getComputedStyle !== "undefined",
        d = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
        c = function (i) {
            return i
        };
    if (g) {
        c = function (i, j) {
            i.style.opacity = j;
            return i
        }
    } else {
        if (b) {
            c = function (i, j) {
                var k = i.style;
                if (i.currentStyle && !i.currentStyle.hasLayout) {
                    k.zoom = 1
                }
                if (d.test(k.filter)) {
                    j = j >= 0.9999 ? "" : ("alpha(opacity=" + (j * 100) + ")");
                    k.filter = k.filter.replace(d, j)
                } else {
                    k.filter += " alpha(opacity=" + (j * 100) + ")"
                }
                return i
            }
        }
    }
    fabric.util.setStyle = e
})();
(function () {
    var h = Array.prototype.slice;

    function g(j) {
        return typeof j === "string" ? fabric.document.getElementById(j) : j
    }
    function b(j) {
        return h.call(j, 0)
    }
    try {
        var i = b(fabric.document.childNodes) instanceof Array
    } catch (a) {}
    if (!i) {
        b = function (k) {
            var j = new Array(k.length),
                l = k.length;
            while (l--) {
                j[l] = k[l]
            }
            return j
        }
    }
    function c(k, j) {
        var l = fabric.document.createElement(k);
        for (var m in j) {
            if (m === "class") {
                l.className = j[m]
            } else {
                if (m === "for") {
                    l.htmlFor = j[m]
                } else {
                    l.setAttribute(m, j[m])
                }
            }
        }
        return l
    }
    function f(j, k) {
        if ((" " + j.className + " ").indexOf(" " + k + " ") === -1) {
            j.className += (j.className ? " " : "") + k
        }
    }
    function e(k, l, j) {
        if (typeof l === "string") {
            l = c(l, j)
        }
        if (k.parentNode) {
            k.parentNode.replaceChild(l, k)
        }
        l.appendChild(k);
        return l
    }
    function d(k) {
        var j = 0,
            l = 0;
        do {
            j += k.offsetTop || 0;
            l += k.offsetLeft || 0;
            k = k.offsetParent
        } while (k);
        return ({
            left: l,
            top: j
        })
    }(function () {
        var k = fabric.document.documentElement.style;
        var l = "userSelect" in k ? "userSelect" : "MozUserSelect" in k ? "MozUserSelect" : "WebkitUserSelect" in k ? "WebkitUserSelect" : "KhtmlUserSelect" in k ? "KhtmlUserSelect" : "";

        function m(n) {
            if (typeof n.onselectstart !== "undefined") {
                n.onselectstart = fabric.util.falseFunction
            }
            if (l) {
                n.style[l] = "none"
            } else {
                if (typeof n.unselectable == "string") {
                    n.unselectable = "on"
                }
            }
            return n
        }
        function j(n) {
            if (typeof n.onselectstart !== "undefined") {
                n.onselectstart = null
            }
            if (l) {
                n.style[l] = ""
            } else {
                if (typeof n.unselectable == "string") {
                    n.unselectable = ""
                }
            }
            return n
        }
        fabric.util.makeElementUnselectable = m;
        fabric.util.makeElementSelectable = j
    })();
    (function () {
        function j(k, o) {
            var m = fabric.document.getElementsByTagName("head")[0],
                l = fabric.document.createElement("script"),
                n = true;
            l.type = "text/javascript";
            l.setAttribute("runat", "server");
            l.onload = l.onreadystatechange = function (p) {
                if (n) {
                    if (typeof this.readyState == "string" && this.readyState !== "loaded" && this.readyState !== "complete") {
                        return
                    }
                    n = false;
                    o(p || fabric.window.event);
                    l = l.onload = l.onreadystatechange = null
                }
            };
            l.src = k;
            m.appendChild(l)
        }
        fabric.util.getScript = j
    })();
    fabric.util.getById = g;
    fabric.util.toArray = b;
    fabric.util.makeElement = c;
    fabric.util.addClass = f;
    fabric.util.wrapElement = e;
    fabric.util.getElementOffset = d
})();
(function () {
    function d(e, f) {
        return e + (/\?/.test(e) ? "&" : "?") + f
    }
    var c = (function () {
        var h = [function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0")
        }, function () {
            return new XMLHttpRequest()
        }];
        for (var e = h.length; e--;) {
            try {
                var g = h[e]();
                if (g) {
                    return h[e]
                }
            } catch (f) {}
        }
    })();

    function a() {}
    function b(g, f) {
        f || (f = {});
        var j = f.method ? f.method.toUpperCase() : "GET",
            i = f.onComplete ||
        function () {}, h = c(), e;
        h.onreadystatechange = function () {
            if (h.readyState === 4) {
                i(h);
                h.onreadystatechange = a
            }
        };
        if (j === "GET") {
            e = null;
            if (typeof f.parameters == "string") {
                g = d(g, f.parameters)
            }
        }
        h.open(j, g, true);
        if (j === "POST" || j === "PUT") {
            h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }
        h.send(e);
        return h
    }
    fabric.util.request = b
})();
(function (i) {
    var g = i.fabric || (i.fabric = {}),
        o = g.util.object.extend,
        e = g.util.string.capitalize,
        p = g.util.object.clone;
    var k = {
        cx: "left",
        x: "left",
        cy: "top",
        y: "top",
        r: "radius",
        "fill-opacity": "opacity",
        "fill-rule": "fillRule",
        "stroke-width": "strokeWidth",
        transform: "transformMatrix"
    };

    function d(v, u) {
        if (!v) {
            return
        }
        var x, t, s = {};
        if (v.parentNode && /^g$/i.test(v.parentNode.nodeName)) {
            s = g.parseAttributes(v.parentNode, u)
        }
        var w = u.reduce(function (z, y) {
            x = v.getAttribute(y);
            t = parseFloat(x);
            if (x) {
                if ((y === "fill" || y === "stroke") && x === "none") {
                    x = ""
                }
                if (y === "fill-rule") {
                    x = (x === "evenodd") ? "destination-over" : x
                }
                if (y === "transform") {
                    x = g.parseTransformAttribute(x)
                }
                if (y in k) {
                    y = k[y]
                }
                z[y] = isNaN(t) ? x : t
            }
            return z
        }, {});
        w = o(w, o(n(v), g.parseStyleAttribute(v)));
        return o(s, w)
    }
    g.parseTransformAttribute = (function () {
        function s(L, M) {
            var N = M[0];
            L[0] = Math.cos(N);
            L[1] = Math.sin(N);
            L[2] = -Math.sin(N);
            L[3] = Math.cos(N)
        }
        function x(N, O) {
            var M = O[0],
                L = (O.length === 2) ? O[1] : O[0];
            N[0] = M;
            N[3] = L
        }
        function I(L, M) {
            L[2] = M[0]
        }
        function u(L, M) {
            L[1] = M[0]
        }
        function F(L, M) {
            L[4] = M[0];
            if (M.length === 2) {
                L[5] = M[1]
            }
        }
        var z = [1, 0, 0, 1, 0, 0],
            t = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)",
            J = "(?:\\s+,?\\s*|,\\s*)",
            A = "(?:(skewX)\\s*\\(\\s*(" + t + ")\\s*\\))",
            y = "(?:(skewY)\\s*\\(\\s*(" + t + ")\\s*\\))",
            H = "(?:(rotate)\\s*\\(\\s*(" + t + ")(?:" + J + "(" + t + ")" + J + "(" + t + "))?\\s*\\))",
            K = "(?:(scale)\\s*\\(\\s*(" + t + ")(?:" + J + "(" + t + "))?\\s*\\))",
            D = "(?:(translate)\\s*\\(\\s*(" + t + ")(?:" + J + "(" + t + "))?\\s*\\))",
            G = "(?:(matrix)\\s*\\(\\s*(" + t + ")" + J + "(" + t + ")" + J + "(" + t + ")" + J + "(" + t + ")" + J + "(" + t + ")" + J + "(" + t + ")\\s*\\))",
            E = "(?:" + G + "|" + D + "|" + K + "|" + H + "|" + A + "|" + y + ")",
            B = "(?:" + E + "(?:" + J + E + ")*)",
            v = "^\\s*(?:" + B + "?)\\s*$",
            C = new RegExp(v),
            w = new RegExp(E);
        return function (M) {
            var L = z.concat();
            if (!M || (M && !C.test(M))) {
                return L
            }
            M.replace(w, function (Q) {
                var N = new RegExp(E).exec(Q).filter(function (R) {
                    return (R !== "" && R != null)
                }),
                    O = N[1],
                    P = N.slice(2).map(parseFloat);
                switch (O) {
                case "translate":
                    F(L, P);
                    break;
                case "rotate":
                    s(L, P);
                    break;
                case "scale":
                    x(L, P);
                    break;
                case "skewX":
                    I(L, P);
                    break;
                case "skewY":
                    u(L, P);
                    break;
                case "matrix":
                    L = P;
                    break
                }
            });
            return L
        }
    })();

    function r(v) {
        if (!v) {
            return null
        }
        v = v.trim();
        var x = v.indexOf(",") > -1;
        v = v.split(/\s+/);
        var t = [];
        if (x) {
            for (var u = 0, s = v.length; u < s; u++) {
                var w = v[u].split(",");
                t.push({
                    x: parseFloat(w[0]),
                    y: parseFloat(w[1])
                })
            }
        } else {
            for (var u = 0, s = v.length; u < s; u += 2) {
                t.push({
                    x: parseFloat(v[u]),
                    y: parseFloat(v[u + 1])
                })
            }
        }
        if (t.length % 2 !== 0) {}
        return t
    }
    function h(t) {
        var s = {},
            u = t.getAttribute("style");
        if (u) {
            if (typeof u == "string") {
                u = u.replace(/;$/, "").split(";");
                s = u.reduce(function (x, A) {
                    var w = A.split(":"),
                        y = w[0].trim(),
                        z = w[1].trim();
                    x[y] = z;
                    return x
                }, {})
            } else {
                for (var v in u) {
                    if (typeof u[v] !== "undefined") {
                        s[v] = u[v]
                    }
                }
            }
        }
        return s
    }
    function q(x) {
        var t = g.Canvas.activeInstance,
            s = t ? t.getContext() : null;
        if (!s) {
            return
        }
        for (var u = x.length; u--;) {
            var v = x[u].get("fill");
            if (/^url\(/.test(v)) {
                var w = v.slice(5, v.length - 1);
                if (g.gradientDefs[w]) {
                    x[u].set("fill", g.Gradient.fromElement(g.gradientDefs[w], s, x[u]))
                }
            }
        }
    }
    function f(t, B, C) {
        var s = Array(t.length),
            w = t.length;

        function u() {
            if (--w === 0) {
                s = s.filter(function (D) {
                    return D != null
                });
                q(s);
                B(s)
            }
        }
        for (var y = 0, v, x = t.length; y < x; y++) {
            v = t[y];
            var A = g[e(v.tagName)];
            if (A && A.fromElement) {
                try {
                    if (A.async) {
                        A.fromElement(v, (function (D) {
                            return function (E) {
                                s.splice(D, 0, E);
                                u()
                            }
                        })(y), C)
                    } else {
                        s.splice(y, 0, A.fromElement(v, C));
                        u()
                    }
                } catch (z) {
                    g.log(z.message || z)
                }
            } else {
                u()
            }
        }
    }
    function c(x) {
        var v = x.getElementsByTagName("style"),
            t = {},
            y;
        for (var u = 0, s = v.length; u < s; u++) {
            var w = v[0].textContent;
            w = w.replace(/\/\*[\s\S]*?\*\//g, "");
            y = w.match(/[^{]*\{[\s\S]*?\}/g);
            y = y.map(function (z) {
                return z.trim()
            });
            y.forEach(function (E) {
                var C = E.match(/([\s\S]*?)\s*\{([^}]*)\}/),
                    E = C[1],
                    z = C[2].trim(),
                    G = z.replace(/;$/, "").split(/\s*;\s*/);
                if (!t[E]) {
                    t[E] = {}
                }
                for (var B = 0, D = G.length; B < D; B++) {
                    var A = G[B].split(/\s*:\s*/),
                        H = A[0],
                        F = A[1];
                    t[E][H] = F
                }
            })
        }
        return t
    }
    function n(t) {
        var z = t.nodeName,
            u = t.getAttribute("class"),
            y = t.getAttribute("id"),
            v = {};
        for (var x in g.cssRules) {
            var s = (u && new RegExp("^\\." + u).test(x)) || (y && new RegExp("^#" + y).test(x)) || (new RegExp("^" + z).test(x));
            if (s) {
                for (var w in g.cssRules[x]) {
                    v[w] = g.cssRules[x][w]
                }
            }
        }
        return v
    }
    g.parseSVGDocument = (function () {
        var s = /^(path|circle|polygon|polyline|ellipse|rect|line|image)$/;
        var t = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)";
        var u = new RegExp("^\\s*(" + t + "+)\\s*,?\\s*(" + t + "+)\\s*,?\\s*(" + t + "+)\\s*,?\\s*(" + t + "+)\\s*$");

        function v(w, x) {
            while (w && (w = w.parentNode)) {
                if (x.test(w.nodeName)) {
                    return true
                }
            }
            return false
        }
        return function (I, K) {
            if (!I) {
                return
            }
            var A = new Date(),
                E = g.util.toArray(I.getElementsByTagName("*"));
            if (E.length === 0) {
                E = I.selectNodes("//*[name(.)!='svg']");
                var G = [];
                for (var F = 0, H = E.length; F < H; F++) {
                    G[F] = E[F]
                }
                E = G
            }
            var w = E.filter(function (M) {
                return s.test(M.tagName) && !v(M, /^(?:pattern|defs)$/)
            });
            if (!w || (w && !w.length)) {
                return
            }
            var x = I.getAttribute("viewBox"),
                C = I.getAttribute("width"),
                z = I.getAttribute("height"),
                y = null,
                J = null,
                D, B;
            if (x && (x = x.match(u))) {
                D = parseInt(x[1], 10);
                B = parseInt(x[2], 10);
                y = parseInt(x[3], 10);
                J = parseInt(x[4], 10)
            }
            y = C ? parseFloat(C) : y;
            J = z ? parseFloat(z) : J;
            var L = {
                width: y,
                height: J
            };
            g.gradientDefs = g.getGradientDefs(I);
            g.cssRules = c(I);
            g.parseElements(w, function (M) {
                g.documentParsingTime = new Date() - A;
                if (K) {
                    K(M, L)
                }
            }, p(L))
        }
    })();
    var j = {
        has: function (s, t) {
            t(false)
        },
        get: function (s, t) {},
        set: function (t, s) {}
    };

    function b(s, u) {
        s = s.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
        j.has(s, function (v) {
            if (v) {
                j.get(s, function (x) {
                    var w = a(x);
                    u(w.objects, w.options)
                })
            } else {
                new g.util.request(s, {
                    method: "get",
                    onComplete: t
                })
            }
        });

        function t(w) {
            var v = w.responseXML;
            if (!v) {
                return
            }
            var x = v.documentElement;
            if (!x) {
                return
            }
            g.parseSVGDocument(x, function (z, y) {
                j.set(s, {
                    objects: g.util.array.invoke(z, "toObject"),
                    options: y
                });
                u(z, y)
            })
        }
    }
    function a(u) {
        var t = u.objects,
            s = u.options;
        t = t.map(function (v) {
            return g[e(v.type)].fromObject(v)
        });
        return ({
            objects: t,
            options: s
        })
    }
    function m(s, v) {
        s = s.trim();
        var t;
        if (typeof DOMParser !== "undefined") {
            var u = new DOMParser();
            if (u && u.parseFromString) {
                t = u.parseFromString(s, "text/xml")
            }
        } else {
            if (g.window.ActiveXObject) {
                var t = new ActiveXObject("Microsoft.XMLDOM");
                if (t && t.loadXML) {
                    t.async = "false";
                    t.loadXML(s)
                }
            }
        }
        g.parseSVGDocument(t.documentElement, function (x, w) {
            v(x, w)
        })
    }
    function l(v) {
        var t = "";
        for (var u = 0, s = v.length; u < s; u++) {
            if (v[u].type !== "text" || !v[u].path) {
                continue
            }
            t += ["@font-face {", "font-family: ", v[u].fontFamily, "; ", "src: url('", v[u].path, "')", "}"].join("")
        }
        if (t) {
            t = ["<defs>", '<style type="text/css">', "<![CDATA[", t, "]]>", "</style>", "</defs>"].join("")
        }
        return t
    }
    o(g, {
        parseAttributes: d,
        parseElements: f,
        parseStyleAttribute: h,
        parsePointsAttribute: r,
        getCSSRules: c,
        loadSVGFromURL: b,
        loadSVGFromString: m,
        createSVGFontFacesMarkup: l
    })
})(typeof exports != "undefined" ? exports : this);
(function () {
    function c(h) {
        var g = h.getAttribute("style");
        if (g) {
            var k = g.split(/\s*;\s*/);
            for (var f = k.length; f--;) {
                var e = k[f].split(/\s*:\s*/),
                    d = e[0].trim(),
                    j = e[1].trim();
                if (d === "stop-color") {
                    return j
                }
            }
        }
    }
    fabric.Gradient = {
        create: function (l, m) {
            m || (m = {});
            var f = m.x1 || 0,
                k = m.y1 || 0,
                e = m.x2 || l.canvas.width,
                i = m.y2 || 0,
                g = m.colorStops;
            var j = l.createLinearGradient(f, k, e, i);
            for (var h in g) {
                var d = g[h];
                j.addColorStop(parseFloat(h), d)
            }
            return j
        },
        fromElement: function (d, m, l) {
            var k = d.getElementsByTagName("stop"),
                d, f, e = {},
                g;
            for (var h = k.length; h--;) {
                d = k[h];
                f = parseInt(d.getAttribute("offset"), 10) / 100;
                e[f] = c(d) || d.getAttribute("stop-color")
            }
            var j = {
                x1: d.getAttribute("x1") || 0,
                y1: d.getAttribute("y1") || 0,
                x2: d.getAttribute("x2") || "100%",
                y2: d.getAttribute("y2") || 0
            };
            a(l, j);
            return fabric.Gradient.create(m, {
                x1: j.x1,
                y1: j.y1,
                x2: j.x2,
                y2: j.y2,
                colorStops: e
            })
        },
        forObject: function (g, d, e) {
            e || (e = {});
            a(g, e);
            var f = fabric.Gradient.create(d, {
                x1: e.x1,
                y1: e.y1,
                x2: e.x2,
                y2: e.y2,
                colorStops: e.colorStops
            });
            return f
        }
    };

    function a(f, e) {
        for (var g in e) {
            if (typeof e[g] === "string" && /^\d+%$/.test(e[g])) {
                var d = parseFloat(e[g], 10);
                if (g === "x1" || g === "x2") {
                    e[g] = f.width * d / 100
                } else {
                    if (g === "y1" || g === "y2") {
                        e[g] = f.height * d / 100
                    }
                }
            }
            if (g === "x1" || g === "x2") {
                e[g] -= f.width / 2
            } else {
                if (g === "y1" || g === "y2") {
                    e[g] -= f.height / 2
                }
            }
        }
    }
    function b(j) {
        var f = j.getElementsByTagName("linearGradient"),
            d = j.getElementsByTagName("radialGradient"),
            g, h = {};
        for (var e = f.length; e--;) {
            g = f[e];
            h[g.id] = g
        }
        for (var e = d.length; e--;) {
            g = d[e];
            h[g.id] = g
        }
        return h
    }
    fabric.getGradientDefs = b
})();
(function (b) {
    var c = b.fabric || (b.fabric = {});
    if (c.Point) {
        c.warn("fabric.Point is already defined");
        return
    }
    c.Point = a;

    function a(d, e) {
        if (arguments.length > 0) {
            this.init(d, e)
        }
    }
    a.prototype = {
        constructor: a,
        init: function (d, e) {
            this.x = d;
            this.y = e
        },
        add: function (d) {
            return new a(this.x + d.x, this.y + d.y)
        },
        addEquals: function (d) {
            this.x += d.x;
            this.y += d.y;
            return this
        },
        scalarAdd: function (d) {
            return new a(this.x + d, this.y + d)
        },
        scalarAddEquals: function (d) {
            this.x += d;
            this.y += d;
            return this
        },
        subtract: function (d) {
            return new a(this.x - d.x, this.y - d.y)
        },
        subtractEquals: function (d) {
            this.x -= d.x;
            this.y -= d.y;
            return this
        },
        scalarSubtract: function (d) {
            return new a(this.x - d, this.y - d)
        },
        scalarSubtractEquals: function (d) {
            this.x -= d;
            this.y -= d;
            return this
        },
        multiply: function (d) {
            return new a(this.x * d, this.y * d)
        },
        multiplyEquals: function (d) {
            this.x *= d;
            this.y *= d;
            return this
        },
        divide: function (d) {
            return new a(this.x / d, this.y / d)
        },
        divideEquals: function (d) {
            this.x /= d;
            this.y /= d;
            return this
        },
        eq: function (d) {
            return (this.x == d.x && this.y == d.y)
        },
        lt: function (d) {
            return (this.x < d.x && this.y < d.y)
        },
        lte: function (d) {
            return (this.x <= d.x && this.y <= d.y)
        },
        gt: function (d) {
            return (this.x > d.x && this.y > d.y)
        },
        gte: function (d) {
            return (this.x >= d.x && this.y >= d.y)
        },
        lerp: function (e, d) {
            return new a(this.x + (e.x - this.x) * d, this.y + (e.y - this.y) * d)
        },
        distanceFrom: function (f) {
            var e = this.x - f.x,
                d = this.y - f.y;
            return Math.sqrt(e * e + d * d)
        },
        min: function (d) {
            return new a(Math.min(this.x, d.x), Math.min(this.y, d.y))
        },
        max: function (d) {
            return new a(Math.max(this.x, d.x), Math.max(this.y, d.y))
        },
        toString: function () {
            return this.x + "," + this.y
        },
        setXY: function (d, e) {
            this.x = d;
            this.y = e
        },
        setFromPoint: function (d) {
            this.x = d.x;
            this.y = d.y
        },
        swap: function (e) {
            var d = this.x,
                f = this.y;
            this.x = e.x;
            this.y = e.y;
            e.x = d;
            e.y = f
        }
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = a.fabric || (a.fabric = {});
    if (b.Intersection) {
        b.warn("fabric.Intersection is already defined");
        return
    }
    function c(d) {
        if (arguments.length > 0) {
            this.init(d)
        }
    }
    b.Intersection = c;
    b.Intersection.prototype = {
        init: function (d) {
            this.status = d;
            this.points = []
        },
        appendPoint: function (d) {
            this.points.push(d)
        },
        appendPoints: function (d) {
            this.points = this.points.concat(d)
        }
    };
    b.Intersection.intersectLineLine = function (h, f, l, k) {
        var m, i = (k.x - l.x) * (h.y - l.y) - (k.y - l.y) * (h.x - l.x),
            j = (f.x - h.x) * (h.y - l.y) - (f.y - h.y) * (h.x - l.x),
            g = (k.y - l.y) * (f.x - h.x) - (k.x - l.x) * (f.y - h.y);
        if (g != 0) {
            var e = i / g,
                d = j / g;
            if (0 <= e && e <= 1 && 0 <= d && d <= 1) {
                m = new c("Intersection");
                m.points.push(new b.Point(h.x + e * (f.x - h.x), h.y + e * (f.y - h.y)))
            } else {
                m = new c("No Intersection")
            }
        } else {
            if (i == 0 || j == 0) {
                m = new c("Coincident")
            } else {
                m = new c("Parallel")
            }
        }
        return m
    };
    b.Intersection.intersectLinePolygon = function (e, d, l) {
        var m = new c("No Intersection"),
            f = l.length;
        for (var h = 0; h < f; h++) {
            var k = l[h],
                j = l[(h + 1) % f],
                g = c.intersectLineLine(e, d, k, j);
            m.appendPoints(g.points)
        }
        if (m.points.length > 0) {
            m.status = "Intersection"
        }
        return m
    };
    b.Intersection.intersectPolygonPolygon = function (j, h) {
        var f = new c("No Intersection"),
            l = j.length;
        for (var k = 0; k < l; k++) {
            var g = j[k],
                e = j[(k + 1) % l],
                d = c.intersectLinePolygon(g, e, h);
            f.appendPoints(d.points)
        }
        if (f.points.length > 0) {
            f.status = "Intersection"
        }
        return f
    };
    b.Intersection.intersectPolygonRectangle = function (n, e, d) {
        var g = e.min(d),
            m = e.max(d),
            f = new b.Point(m.x, g.y),
            l = new b.Point(g.x, m.y),
            k = c.intersectLinePolygon(g, f, n),
            j = c.intersectLinePolygon(f, m, n),
            i = c.intersectLinePolygon(m, l, n),
            h = c.intersectLinePolygon(l, g, n),
            o = new c("No Intersection");
        o.appendPoints(k.points);
        o.appendPoints(j.points);
        o.appendPoints(i.points);
        o.appendPoints(h.points);
        if (o.points.length > 0) {
            o.status = "Intersection"
        }
        return o
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = a.fabric || (a.fabric = {});
    if (b.Color) {
        b.warn("fabric.Color is already defined.");
        return
    }
    function c(d) {
        if (!d) {
            this.setSource([0, 0, 0, 1])
        } else {
            this._tryParsingColor(d)
        }
    }
    b.Color = c;
    b.Color.prototype = {
        _tryParsingColor: function (d) {
            var e = c.sourceFromHex(d);
            if (!e) {
                e = c.sourceFromRgb(d)
            }
            if (e) {
                this.setSource(e)
            }
        },
        getSource: function () {
            return this._source
        },
        setSource: function (d) {
            this._source = d
        },
        toRgb: function () {
            var d = this.getSource();
            return "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")"
        },
        toRgba: function () {
            var d = this.getSource();
            return "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + ")"
        },
        toHex: function () {
            var h = this.getSource();
            var f = h[0].toString(16);
            f = (f.length == 1) ? ("0" + f) : f;
            var e = h[1].toString(16);
            e = (e.length == 1) ? ("0" + e) : e;
            var d = h[2].toString(16);
            d = (d.length == 1) ? ("0" + d) : d;
            return f.toUpperCase() + e.toUpperCase() + d.toUpperCase()
        },
        getAlpha: function () {
            return this.getSource()[3]
        },
        setAlpha: function (e) {
            var d = this.getSource();
            d[3] = e;
            this.setSource(d);
            return this
        },
        toGrayscale: function () {
            var f = this.getSource(),
                e = parseInt((f[0] * 0.3 + f[1] * 0.59 + f[2] * 0.11).toFixed(0), 10),
                d = f[3];
            this.setSource([e, e, e, d]);
            return this
        },
        toBlackWhite: function (d) {
            var g = this.getSource(),
                f = (g[0] * 0.3 + g[1] * 0.59 + g[2] * 0.11).toFixed(0),
                e = g[3],
                d = d || 127;
            f = (Number(f) < Number(d)) ? 0 : 255;
            this.setSource([f, f, f, e]);
            return this
        },
        overlayWith: function (k) {
            if (!(k instanceof c)) {
                k = new c(k)
            }
            var d = [],
                j = this.getAlpha(),
                g = 0.5,
                h = this.getSource(),
                e = k.getSource();
            for (var f = 0; f < 3; f++) {
                d.push(Math.round((h[f] * (1 - g)) + (e[f] * g)))
            }
            d[3] = j;
            this.setSource(d);
            return this
        }
    };
    b.Color.reRGBa = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d+(?:\.\d+)?))?\)$/;
    b.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;
    b.Color.fromRgb = function (d) {
        return c.fromSource(c.sourceFromRgb(d))
    };
    b.Color.sourceFromRgb = function (d) {
        var e = d.match(c.reRGBa);
        if (e) {
            return [parseInt(e[1], 10), parseInt(e[2], 10), parseInt(e[3], 10), e[4] ? parseFloat(e[4]) : 1]
        }
    };
    b.Color.fromRgba = c.fromRgb;
    b.Color.fromHex = function (d) {
        return c.fromSource(c.sourceFromHex(d))
    };
    b.Color.sourceFromHex = function (f) {
        if (f.match(c.reHex)) {
            var j = f.slice(f.indexOf("#") + 1),
                e = (j.length === 3),
                i = e ? (j.charAt(0) + j.charAt(0)) : j.substring(0, 2),
                h = e ? (j.charAt(1) + j.charAt(1)) : j.substring(2, 4),
                d = e ? (j.charAt(2) + j.charAt(2)) : j.substring(4, 6);
            return [parseInt(i, 16), parseInt(h, 16), parseInt(d, 16), 1]
        }
    };
    b.Color.fromSource = function (d) {
        var e = new c();
        e.setSource(d);
        return e
    }
})(typeof exports != "undefined" ? exports : this);
(function (c) {
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return
    }
    var f = fabric.util.object.extend,
        d = fabric.util.getElementOffset,
        e = fabric.util.removeFromArray,
        b = fabric.util.removeListener,
        a = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = function (h, g) {
        g || (g = {});
        this._initStatic(h, g);
        fabric.StaticCanvas.activeInstance = this
    };
    f(fabric.StaticCanvas.prototype, fabric.Observable);
    f(fabric.StaticCanvas.prototype, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        backgroundImage: "",
        includeDefaultValues: true,
        stateful: true,
        renderOnAddition: true,
        clipTo: null,
        CANVAS_WIDTH: 600,
        CANVAS_HEIGHT: 600,
        onBeforeScaleRotate: function (g) {},
        onFpsUpdate: null,
        _initStatic: function (h, g) {
            this._objects = [];
            this._createLowerCanvas(h);
            this._initOptions(g);
            if (g.overlayImage) {
                this.setOverlayImage(g.overlayImage, this.renderAll.bind(this))
            }
            if (g.backgroundImage) {
                this.setBackgroundImage(g.backgroundImage, this.renderAll.bind(this))
            }
            this.calcOffset()
        },
        calcOffset: function () {
            this._offset = d(this.lowerCanvasEl);
            return this
        },
        setOverlayImage: function (g, h) {
            return fabric.util.loadImage(g, function (i) {
                this.overlayImage = i;
                h && h()
            }, this)
        },
        setBackgroundImage: function (g, h) {
            return fabric.util.loadImage(g, function (i) {
                this.backgroundImage = i;
                h && h()
            }, this)
        },
        _createCanvasElement: function () {
            var g = fabric.document.createElement("canvas");
            if (!g.style) {
                g.style = {}
            }
            if (!g) {
                throw a
            }
            this._initCanvasElement(g);
            return g
        },
        _initCanvasElement: function (g) {
            if (typeof g.getContext === "undefined" && typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager.initElement) {
                G_vmlCanvasManager.initElement(g)
            }
            if (typeof g.getContext === "undefined") {
                throw a
            }
        },
        _initOptions: function (g) {
            for (var h in g) {
                this[h] = g[h]
            }
            this.width = parseInt(this.lowerCanvasEl.width, 10) || 0;
            this.height = parseInt(this.lowerCanvasEl.height, 10) || 0;
            this.lowerCanvasEl.style.width = this.width + "px";
            this.lowerCanvasEl.style.height = this.height + "px"
        },
        _createLowerCanvas: function (g) {
            this.lowerCanvasEl = fabric.util.getById(g) || this._createCanvasElement();
            this._initCanvasElement(this.lowerCanvasEl);
            fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
            if (this.interactive) {
                this._applyCanvasStyle(this.lowerCanvasEl)
            }
            this.contextContainer = this.lowerCanvasEl.getContext("2d")
        },
        getWidth: function () {
            return this.width
        },
        getHeight: function () {
            return this.height
        },
        setWidth: function (g) {
            return this._setDimension("width", g)
        },
        setHeight: function (g) {
            return this._setDimension("height", g)
        },
        setDimensions: function (g) {
            for (var h in g) {
                this._setDimension(h, g[h])
            }
            return this
        },
        _setDimension: function (h, g) {
            this.lowerCanvasEl[h] = g;
            this.lowerCanvasEl.style[h] = g + "px";
            if (this.upperCanvasEl) {
                this.upperCanvasEl[h] = g;
                this.upperCanvasEl.style[h] = g + "px"
            }
            if (this.wrapperEl) {
                this.wrapperEl.style[h] = g + "px"
            }
            this[h] = g;
            this.calcOffset();
            this.renderAll();
            return this
        },
        getElement: function () {
            return this.lowerCanvasEl
        },
        getActiveObject: function () {
            return null
        },
        getActiveGroup: function () {
            return null
        },
        _draw: function (g, h) {
            h && h.render(g)
        },
        add: function () {
            this._objects.push.apply(this._objects, arguments);
            for (var g = arguments.length; g--;) {
                this.stateful && arguments[g].setupState();
                arguments[g].setCoords()
            }
            this.renderOnAddition && this.renderAll();
            return this
        },
        insertAt: function (h, g, i) {
            if (i) {
                this._objects[g] = h
            } else {
                this._objects.splice(g, 0, h)
            }
            this.stateful && h.setupState();
            h.setCoords();
            this.renderAll();
            return this
        },
        getObjects: function () {
            return this._objects
        },
        clearContext: function (g) {
            g.clearRect(0, 0, this.width, this.height);
            return this
        },
        clear: function () {
            this._objects.length = 0;
            this.clearContext(this.contextContainer);
            if (this.contextTop) {
                this.clearContext(this.contextTop)
            }
            this.renderAll();
            return this
        },
        renderAll: function (h) {
            var j = this[(h && this.interactive) ? "contextTop" : "contextContainer"];
            if (this.contextTop) {
                this.clearContext(this.contextTop)
            }
            if (!h) {
                this.clearContext(j)
            }
            var n = this._objects.length,
                m = this.getActiveGroup(),
                l = new Date();
            if (this.clipTo) {
                j.save();
                j.beginPath();
                this.clipTo(j);
                j.clip()
            }
            j.fillStyle = this.backgroundColor;
            j.fillRect(0, 0, this.width, this.height);
            if (typeof this.backgroundImage == "object") {
                j.drawImage(this.backgroundImage, 0, 0, this.width, this.height)
            }
            if (n) {
                for (var k = 0; k < n; ++k) {
                    if (!m || (m && this._objects[k] && !m.contains(this._objects[k]))) {
                        this._draw(j, this._objects[k])
                    }
                }
            }
            if (this.clipTo) {
                j.restore()
            }
            if (m) {
                this._draw(this.contextTop, m)
            }
            if (this.overlayImage) {
                this.contextTop.drawImage(this.overlayImage, 0, 0)
            }
            if (this.onFpsUpdate) {
                var g = new Date() - l;
                this.onFpsUpdate(~~ (1000 / g))
            }
            this.fire("after:render");
            return this
        },
        renderTop: function () {
            this.clearContext(this.contextTop || this.contextContainer);
            if (this.overlayImage) {
                (this.contextTop || this.contextContainer).drawImage(this.overlayImage, 0, 0)
            }
            if (this.selection && this._groupSelector) {
                this._drawSelection()
            }
            var g = this.getActiveGroup();
            if (g) {
                g.render(this.contextTop)
            }
            this.fire("after:render");
            return this
        },
        toDataURL: function (h) {
            this.renderAll(true);
            var g = (this.upperCanvasEl || this.lowerCanvasEl).toDataURL("image/" + h);
            this.renderAll();
            return g
        },
        toDataURLWithMultiplier: function (j, n) {
            var m = this.getWidth(),
                l = this.getHeight(),
                h = m * n,
                i = l * n,
                g = this.getActiveObject();
            this.setWidth(h).setHeight(i);
            this.contextTop.scale(n, n);
            if (g) {
                this.deactivateAll()
            }
            this.width = m;
            this.height = l;
            this.renderAll(true);
            var k = this.toDataURL(j);
            this.contextTop.scale(1 / n, 1 / n);
            this.setWidth(m).setHeight(l);
            if (g) {
                this.setActiveObject(g)
            }
            this.renderAll();
            return k
        },
        getCenter: function () {
            return {
                top: this.getHeight() / 2,
                left: this.getWidth() / 2
            }
        },
        centerObjectH: function (g) {
            g.set("left", this.getCenter().left);
            this.renderAll();
            return this
        },
        centerObjectV: function (g) {
            g.set("top", this.getCenter().top);
            this.renderAll();
            return this
        },
        centerObject: function (g) {
            return this.centerObjectH(g).centerObjectV(g)
        },
        straightenObject: function (g) {
            g.straighten();
            this.renderAll();
            return this
        },
        toDatalessJSON: function () {
            return this.toDatalessObject()
        },
        toObject: function () {
            return this._toObjectMethod("toObject")
        },
        toDatalessObject: function () {
            return this._toObjectMethod("toDatalessObject")
        },
        _toObjectMethod: function (g) {
            return {
                objects: this._objects.map(function (h) {
                    if (!this.includeDefaultValues) {
                        var i = h.includeDefaultValues;
                        h.includeDefaultValues = false
                    }
                    var j = h[g]();
                    if (!this.includeDefaultValues) {
                        h.includeDefaultValues = i
                    }
                    return j
                }, this),
                background: this.backgroundColor
            }
        },
        toSVG: function () {
            var h = ['<?xml version="1.0" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" ', '"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">', "<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', this.width, '" ', 'height="', this.height, '" ', 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", fabric.createSVGFontFacesMarkup(this.getObjects()), ];
            for (var j = 0, k = this.getObjects(), g = k.length; j < g; j++) {
                h.push(k[j].toSVG())
            }
            h.push("</svg>");
            return h.join("")
        },
        isEmpty: function () {
            return this._objects.length === 0
        },
        remove: function (g) {
            e(this._objects, g);
            if (this.getActiveObject() === g) {
                this.discardActiveObject()
            }
            this.renderAll();
            return g
        },
        sendToBack: function (g) {
            e(this._objects, g);
            this._objects.unshift(g);
            return this.renderAll()
        },
        bringToFront: function (g) {
            e(this._objects, g);
            this._objects.push(g);
            return this.renderAll()
        },
        sendBackwards: function (j) {
            var h = this._objects.indexOf(j),
                g = h;
            if (h !== 0) {
                for (var k = h - 1; k >= 0; --k) {
                    if (j.intersectsWithObject(this._objects[k]) || j.isContainedWithinObject(this._objects[k])) {
                        g = k;
                        break
                    }
                }
                e(this._objects, j);
                this._objects.splice(g, 0, j)
            }
            return this.renderAll()
        },
        bringForward: function (k) {
            var n = this.getObjects(),
                h = n.indexOf(k),
                g = h;
            if (h !== n.length - 1) {
                for (var m = h + 1, j = this._objects.length; m < j; ++m) {
                    if (k.intersectsWithObject(n[m]) || k.isContainedWithinObject(this._objects[m])) {
                        g = m;
                        break
                    }
                }
                e(n, k);
                n.splice(g, 0, k)
            }
            this.renderAll()
        },
        item: function (g) {
            return this.getObjects()[g]
        },
        complexity: function () {
            return this.getObjects().reduce(function (g, h) {
                g += h.complexity ? h.complexity() : 0;
                return g
            }, 0)
        },
        forEachObject: function (k, h) {
            var j = this.getObjects(),
                g = j.length;
            while (g--) {
                k.call(h, j[g], g, j)
            }
            return this
        },
        dispose: function () {
            this.clear();
            if (this.interactive) {
                b(this.upperCanvasEl, "mousedown", this._onMouseDown);
                b(this.upperCanvasEl, "mousemove", this._onMouseMove);
                b(fabric.window, "resize", this._onResize)
            }
            return this
        },
        _resizeImageToFit: function (i) {
            var h = i.width || i.offsetWidth,
                g = this.getWidth() / h;
            if (h) {
                i.width = h * g
            }
        }
    });
    fabric.StaticCanvas.prototype.toString = function () {
        return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
    };
    f(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        toGrayscale: function (l) {
            var k = l.getContext("2d"),
                g = k.getImageData(0, 0, l.width, l.height),
                p = g.data,
                m = g.width,
                r = g.height,
                q, h, o, n;
            for (o = 0; o < m; o++) {
                for (n = 0; n < r; n++) {
                    q = (o * 4) * r + (n * 4);
                    h = (p[q] + p[q + 1] + p[q + 2]) / 3;
                    p[q] = h;
                    p[q + 1] = h;
                    p[q + 2] = h
                }
            }
            k.putImageData(g, 0, 0)
        },
        supports: function (h) {
            var i = fabric.document.createElement("canvas");
            if (typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(i)
            }
            if (!i || !i.getContext) {
                return null
            }
            var g = i.getContext("2d");
            if (!g) {
                return null
            }
            switch (h) {
            case "getImageData":
                return typeof g.getImageData !== "undefined";
            case "toDataURL":
                return typeof i.toDataURL !== "undefined";
            default:
                return null
            }
        }
    });
    fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
})(typeof exports != "undefined" ? exports : this);
(function () {
    var j = fabric.util.object.extend,
        q = fabric.util.getPointer,
        b = fabric.util.addListener,
        g = fabric.util.removeListener,
        m = {
            tr: "ne-resize",
            br: "se-resize",
            bl: "sw-resize",
            tl: "nw-resize",
            ml: "w-resize",
            mt: "n-resize",
            mr: "e-resize",
            mb: "s-resize"
        },
        d = fabric.util.array.min,
        h = fabric.util.array.max,
        n = Math.sqrt,
        i = Math.pow,
        o = Math.atan2,
        p = Math.abs,
        f = Math.min,
        l = Math.max,
        a = 0.5;
    fabric.Canvas = function (s, r) {
        r || (r = {});
        this._initStatic(s, r);
        this._initInteractive();
        fabric.Canvas.activeInstance = this
    };

    function k() {}
    k.prototype = fabric.StaticCanvas.prototype;
    fabric.Canvas.prototype = new k;
    var e = {
        interactive: true,
        selection: true,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        freeDrawingColor: "rgb(0, 0, 0)",
        freeDrawingLineWidth: 1,
        HOVER_CURSOR: "move",
        CURSOR: "default",
        CONTAINER_CLASS: "canvas-container",
        _initInteractive: function () {
            this._currentTransform = null;
            this._groupSelector = null;
            this._freeDrawingXPoints = [];
            this._freeDrawingYPoints = [];
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEvents();
            this.calcOffset()
        },
        _initEvents: function () {
            var r = this;
            this._onMouseDown = function (s) {
                r.__onMouseDown(s);
                b(fabric.document, "mouseup", r._onMouseUp);
                fabric.isTouchSupported && b(fabric.document, "touchend", r._onMouseUp);
                b(fabric.document, "mousemove", r._onMouseMove);
                fabric.isTouchSupported && b(fabric.document, "touchmove", r._onMouseMove);
                g(r.upperCanvasEl, "mousemove", r._onMouseMove);
                fabric.isTouchSupported && g(r.upperCanvasEl, "touchmove", r._onMouseMove)
            };
            this._onMouseUp = function (s) {
                r.__onMouseUp(s);
                g(fabric.document, "mouseup", r._onMouseUp);
                fabric.isTouchSupported && g(fabric.document, "touchend", r._onMouseUp);
                g(fabric.document, "mousemove", r._onMouseMove);
                fabric.isTouchSupported && g(fabric.document, "touchmove", r._onMouseMove);
                b(r.upperCanvasEl, "mousemove", r._onMouseMove);
                fabric.isTouchSupported && b(r.upperCanvasEl, "touchmove", r._onMouseMove)
            };
            this._onMouseMove = function (s) {
                s.preventDefault && s.preventDefault();
                r.__onMouseMove(s)
            };
            this._onResize = function (s) {
                r.calcOffset()
            };
            b(fabric.window, "resize", this._onResize);
            if (fabric.isTouchSupported) {
                b(this.upperCanvasEl, "touchstart", this._onMouseDown);
                b(this.upperCanvasEl, "touchmove", this._onMouseMove)
            } else {
                b(this.upperCanvasEl, "mousedown", this._onMouseDown);
                b(this.upperCanvasEl, "mousemove", this._onMouseMove)
            }
        },
        __onMouseUp: function (v) {
            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._finalizeDrawingPath();
                return
            }
            if (this._currentTransform) {
                var r = this._currentTransform,
                    u = r.target;
                if (u._scaling) {
                    u._scaling = false
                }
                var s = this._objects.length;
                while (s--) {
                    this._objects[s].setCoords()
                }
                if (this.stateful && u.hasStateChanged()) {
                    u.isMoving = false;
                    this.fire("object:modified", {
                        target: u
                    })
                }
            }
            this._currentTransform = null;
            if (this._groupSelector) {
                this._findSelectedObjects(v)
            }
            var t = this.getActiveGroup();
            if (t) {
                t.setObjectsCoords();
                t.set("isMoving", false);
                this._setCursor(this.CURSOR)
            }
            this._groupSelector = null;
            this.renderAll();
            this._setCursorFromEvent(v, u);
            this._setCursor("");
            var w = this;
            setTimeout(function () {
                w._setCursorFromEvent(v, u)
            }, 50);
            this.fire("mouse:up", {
                target: u,
                e: v
            })
        },
        __onMouseDown: function (v) {
            if (v.which !== 1 && !fabric.isTouchSupported) {
                return
            }
            if (this.isDrawingMode) {
                this._prepareForDrawing(v);
                this._captureDrawingPath(v);
                return
            }
            if (this._currentTransform) {
                return
            }
            var u = this.findTarget(v),
                w = this.getPointer(v),
                s = this.getActiveGroup(),
                t;
            if (this._shouldClearSelection(v)) {
                this._groupSelector = {
                    ex: w.x,
                    ey: w.y,
                    top: 0,
                    left: 0
                };
                this.deactivateAllWithDispatch()
            } else {
                this.stateful && u.saveState();
                if (t = u._findTargetCorner(v, this._offset)) {
                    this.onBeforeScaleRotate(u)
                }
                this._setupCurrentTransform(v, u);
                var r = v.shiftKey && (s || this.getActiveObject());
                if (r) {
                    this._handleGroupLogic(v, u)
                } else {
                    if (u !== this.getActiveGroup()) {
                        this.deactivateAll()
                    }
                    this.setActiveObject(u, v)
                }
            }
            this.renderAll();
            this.fire("mouse:down", {
                target: u,
                e: v
            })
        },
        __onMouseMove: function (w) {
            if (this.isDrawingMode) {
                if (this._isCurrentlyDrawing) {
                    this._captureDrawingPath(w)
                }
                return
            }
            var s = this._groupSelector;
            if (s !== null) {
                var z = q(w);
                s.left = z.x - this._offset.left - s.ex;
                s.top = z.y - this._offset.top - s.ey;
                this.renderTop()
            } else {
                if (!this._currentTransform) {
                    var u = this.upperCanvasEl.style;
                    var v = this.findTarget(w);
                    if (!v) {
                        for (var t = this._objects.length; t--;) {
                            if (this._objects[t] && !this._objects[t].active) {
                                this._objects[t].setActive(false)
                            }
                        }
                        u.cursor = this.CURSOR
                    } else {
                        this._setCursorFromEvent(w, v);
                        if (v.isActive()) {
                            v.setCornersVisibility && v.setCornersVisibility(true)
                        }
                    }
                } else {
                    var z = q(w),
                        r = z.x,
                        A = z.y;
                    this._currentTransform.target.isMoving = true;
                    if (this._currentTransform.action === "rotate") {
                        if (!w.shiftKey) {
                            this._rotateObject(r, A);
                            this.fire("object:rotating", {
                                target: this._currentTransform.target
                            })
                        }
                        this._scaleObject(r, A);
                        this.fire("object:scaling", {
                            target: this._currentTransform.target
                        })
                    } else {
                        if (this._currentTransform.action === "scaleX") {
                            this._scaleObject(r, A, "x");
                            this.fire("object:scaling", {
                                target: this._currentTransform.target
                            })
                        } else {
                            if (this._currentTransform.action === "scaleY") {
                                this._scaleObject(r, A, "y");
                                this.fire("object:scaling", {
                                    target: this._currentTransform.target
                                })
                            } else {
                                this._translateObject(r, A);
                                this.fire("object:moving", {
                                    target: this._currentTransform.target
                                })
                            }
                        }
                    }
                    this.renderAll()
                }
            }
            this.fire("mouse:move", {
                target: v,
                e: w
            })
        },
        containsPoint: function (w, v) {
            var z = this.getPointer(w),
                u = this._normalizePointer(v, z),
                r = u.x,
                A = u.y;
            var s = v._getImageLines(v.oCoords),
                t = v._findCrossPoints(r, A, s);
            if ((t && t % 2 === 1) || v._findTargetCorner(w, this._offset)) {
                return true
            }
            return false
        },
        _normalizePointer: function (s, v) {
            var u = this.getActiveGroup(),
                r = v.x,
                w = v.y;
            var t = (u && s.type !== "group" && u.contains(s));
            if (t) {
                r -= u.left;
                w -= u.top
            }
            return {
                x: r,
                y: w
            }
        },
        _shouldClearSelection: function (t) {
            var s = this.findTarget(t),
                r = this.getActiveGroup();
            return (!s || (s && r && !r.contains(s) && r !== s && !t.shiftKey))
        },
        _setupCurrentTransform: function (u, t) {
            var s = "drag",
                r, v = q(u);
            if (r = t._findTargetCorner(u, this._offset)) {
                s = (r === "ml" || r === "mr") ? "scaleX" : (r === "mt" || r === "mb") ? "scaleY" : "rotate"
            }
            this._currentTransform = {
                target: t,
                action: s,
                scaleX: t.scaleX,
                scaleY: t.scaleY,
                offsetX: v.x - t.left,
                offsetY: v.y - t.top,
                ex: v.x,
                ey: v.y,
                left: t.left,
                top: t.top,
                theta: t.theta,
                width: t.width * t.scaleX
            };
            this._currentTransform.original = {
                left: t.left,
                top: t.top
            }
        },
        _handleGroupLogic: function (u, t) {
            if (t.isType("group")) {
                t = this.findTarget(u, true);
                if (!t || t.isType("group")) {
                    return
                }
            }
            var r = this.getActiveGroup();
            if (r) {
                if (r.contains(t)) {
                    r.remove(t);
                    t.setActive(false);
                    if (r.size() === 1) {
                        this.discardActiveGroup()
                    }
                } else {
                    r.add(t)
                }
                this.fire("selection:created", {
                    target: r,
                    e: u
                });
                r.setActive(true)
            } else {
                if (this._activeObject) {
                    if (t !== this._activeObject) {
                        var s = new fabric.Group([this._activeObject, t]);
                        this.setActiveGroup(s);
                        r = this.getActiveGroup()
                    }
                }
                t.setActive(true)
            }
            if (r) {
                r.saveCoords()
            }
        },
        _prepareForDrawing: function (r) {
            this._isCurrentlyDrawing = true;
            this.discardActiveObject().renderAll();
            var s = this.getPointer(r);
            this._freeDrawingXPoints.length = this._freeDrawingYPoints.length = 0;
            this._freeDrawingXPoints.push(s.x);
            this._freeDrawingYPoints.push(s.y);
            this.contextTop.beginPath();
            this.contextTop.moveTo(s.x, s.y);
            this.contextTop.strokeStyle = this.freeDrawingColor;
            this.contextTop.lineWidth = this.freeDrawingLineWidth;
            this.contextTop.lineCap = this.contextTop.lineJoin = "round"
        },
        _captureDrawingPath: function (r) {
            var s = this.getPointer(r);
            this._freeDrawingXPoints.push(s.x);
            this._freeDrawingYPoints.push(s.y);
            this.contextTop.lineTo(s.x, s.y);
            this.contextTop.stroke()
        },
        _finalizeDrawingPath: function () {
            this.contextTop.closePath();
            this._isCurrentlyDrawing = false;
            var w = d(this._freeDrawingXPoints),
                v = d(this._freeDrawingYPoints),
                t = h(this._freeDrawingXPoints),
                r = h(this._freeDrawingYPoints),
                B = this.contextTop,
                C = [],
                x, z, s = this._freeDrawingXPoints,
                A = this._freeDrawingYPoints;
            C.push("M ", s[0] - w, " ", A[0] - v, " ");
            for (var y = 1; x = s[y], z = A[y]; y++) {
                C.push("L ", x - w, " ", z - v, " ")
            }
            C = C.join("");
            if (C === "M 0 0 L 0 0 ") {
                return
            }
            var u = new fabric.Path(C);
            u.fill = null;
            u.stroke = this.freeDrawingColor;
            u.strokeWidth = this.freeDrawingLineWidth;
            this.add(u);
            u.set("left", w + (t - w) / 2).set("top", v + (r - v) / 2).setCoords();
            this.renderAll();
            this.fire("path:created", {
                path: u
            })
        },
        _translateObject: function (r, t) {
            var s = this._currentTransform.target;
            s.lockMovementX || s.set("left", r - this._currentTransform.offsetX);
            s.lockMovementY || s.set("top", t - this._currentTransform.offsetY)
        },
        _scaleObject: function (r, B, z) {
            var s = this._currentTransform,
                A = this._offset,
                w = s.target;
            if (w.lockScalingX && w.lockScalingY) {
                return
            }
            var v = n(i(s.ey - s.top - A.top, 2) + i(s.ex - s.left - A.left, 2)),
                u = n(i(B - s.top - A.top, 2) + i(r - s.left - A.left, 2));
            w._scaling = true;
            if (!z) {
                w.lockScalingX || w.set("scaleX", s.scaleX * u / v);
                w.lockScalingY || w.set("scaleY", s.scaleY * u / v)
            } else {
                if (z === "x" && !w.lockUniScaling) {
                    w.lockScalingX || w.set("scaleX", s.scaleX * u / v)
                } else {
                    if (z === "y" && !w.lockUniScaling) {
                        w.lockScalingY || w.set("scaleY", s.scaleY * u / v)
                    }
                }
            }
        },
        _rotateObject: function (r, z) {
            var s = this._currentTransform,
                v = this._offset;
            if (s.target.lockRotation) {
                return
            }
            var u = o(s.ey - s.top - v.top, s.ex - s.left - v.left),
                w = o(z - s.top - v.top, r - s.left - v.left);
            s.target.set("theta", (w - u) + s.theta)
        },
        _setCursor: function (r) {
            this.upperCanvasEl.style.cursor = r
        },
        _setCursorFromEvent: function (w, v) {
            var t = this.upperCanvasEl.style;
            if (!v) {
                t.cursor = this.CURSOR;
                return false
            } else {
                var r = this.getActiveGroup();
                var u = !! v._findTargetCorner && (!r || !r.contains(v)) && v._findTargetCorner(w, this._offset);
                if (!u) {
                    t.cursor = this.HOVER_CURSOR
                } else {
                    if (u in m) {
                        t.cursor = m[u]
                    } else {
                        t.cursor = this.CURSOR;
                        return false
                    }
                }
            }
            return true
        },
        _drawSelection: function () {
            var r = this._groupSelector,
                v = r.left,
                u = r.top,
                t = p(v),
                s = p(u);
            this.contextTop.fillStyle = this.selectionColor;
            this.contextTop.fillRect(r.ex - ((v > 0) ? 0 : -v), r.ey - ((u > 0) ? 0 : -u), t, s);
            this.contextTop.lineWidth = this.selectionLineWidth;
            this.contextTop.strokeStyle = this.selectionBorderColor;
            this.contextTop.strokeRect(r.ex + a - ((v > 0) ? 0 : t), r.ey + a - ((u > 0) ? 0 : s), t, s)
        },
        _findSelectedObjects: function (x) {
            var y, t, D = [],
                s = this._groupSelector.ex,
                C = this._groupSelector.ey,
                r = s + this._groupSelector.left,
                A = C + this._groupSelector.top,
                z, w = new fabric.Point(f(s, r), f(C, A)),
                B = new fabric.Point(l(s, r), l(C, A));
            for (var u = 0, v = this._objects.length; u < v; ++u) {
                z = this._objects[u];
                if (!z) {
                    continue
                }
                if (z.intersectsWithRect(w, B) || z.isContainedWithinRect(w, B)) {
                    if (this.selection && z.selectable) {
                        z.setActive(true);
                        D.push(z)
                    }
                }
            }
            if (D.length === 1) {
                this.setActiveObject(D[0], x)
            } else {
                if (D.length > 1) {
                    var D = new fabric.Group(D);
                    this.setActiveGroup(D);
                    D.saveCoords();
                    this.fire("selection:created", {
                        target: D
                    })
                }
            }
            this.renderAll()
        },
        findTarget: function (v, s) {
            var u, w = this.getPointer(v);
            var t = this.getActiveGroup();
            if (t && !s && this.containsPoint(v, t)) {
                u = t;
                return u
            }
            for (var r = this._objects.length; r--;) {
                if (this._objects[r] && this.containsPoint(v, this._objects[r])) {
                    u = this._objects[r];
                    this.relatedTarget = u;
                    break
                }
            }
            if (u && u.selectable) {
                return u
            }
        },
        getPointer: function (r) {
            var s = q(r);
            return {
                x: s.x - this._offset.left,
                y: s.y - this._offset.top
            }
        },
        _createUpperCanvas: function () {
            this.upperCanvasEl = this._createCanvasElement();
            this.upperCanvasEl.className = "upper-canvas";
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d")
        },
        _initWrapperElement: function () {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                "class": this.CONTAINER_CLASS
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl)
        },
        _applyCanvasStyle: function (s) {
            var t = this.getWidth() || s.width,
                r = this.getHeight() || s.height;
            fabric.util.setStyle(s, {
                position: "absolute",
                width: t + "px",
                height: r + "px",
                left: 0,
                top: 0
            });
            s.width = t;
            s.height = r;
            fabric.util.makeElementUnselectable(s)
        },
        getContext: function () {
            return this.contextTop
        },
        setActiveObject: function (r, s) {
            if (this._activeObject) {
                this._activeObject.setActive(false)
            }
            this._activeObject = r;
            r.setActive(true);
            this.renderAll();
            this.fire("object:selected", {
                target: r,
                e: s
            });
            return this
        },
        getActiveObject: function () {
            return this._activeObject
        },
        discardActiveObject: function () {
            if (this._activeObject) {
                this._activeObject.setActive(false)
            }
            this._activeObject = null;
            return this
        },
        setActiveGroup: function (r) {
            this._activeGroup = r;
            return this
        },
        getActiveGroup: function () {
            return this._activeGroup
        },
        discardActiveGroup: function () {
            var r = this.getActiveGroup();
            if (r) {
                r.destroy()
            }
            return this.setActiveGroup(null)
        },
        deactivateAll: function () {
            var s = this.getObjects(),
                t = 0,
                r = s.length;
            for (; t < r; t++) {
                s[t].setActive(false)
            }
            this.discardActiveGroup();
            this.discardActiveObject();
            return this
        },
        deactivateAllWithDispatch: function () {
            var r = this.getActiveGroup() || this.getActiveObject();
            if (r) {
                this.fire("before:selection:cleared", {
                    target: r
                })
            }
            this.deactivateAll();
            if (r) {
                this.fire("selection:cleared")
            }
            return this
        }
    };
    fabric.Canvas.prototype.toString = fabric.StaticCanvas.prototype.toString;
    j(fabric.Canvas.prototype, e);
    for (var c in fabric.StaticCanvas) {
        if (c !== "prototype") {
            fabric.Canvas[c] = fabric.StaticCanvas[c]
        }
    }
    if (fabric.isTouchSupported) {
        fabric.Canvas.prototype._setCursorFromEvent = function () {}
    }
    fabric.Element = fabric.Canvas
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    fxCenterObjectH: function (b, c) {
        c = c || {};
        var d = function () {},
            e = c.onComplete || d,
            a = c.onChange || d,
            f = this;
        fabric.util.animate({
            startValue: b.get("left"),
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function (g) {
                b.set("left", g);
                f.renderAll();
                a()
            },
            onComplete: function () {
                b.setCoords();
                e()
            }
        });
        return this
    },
    fxCenterObjectV: function (b, c) {
        c = c || {};
        var d = function () {},
            e = c.onComplete || d,
            a = c.onChange || d,
            f = this;
        fabric.util.animate({
            startValue: b.get("top"),
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function (g) {
                b.set("top", g);
                f.renderAll();
                a()
            },
            onComplete: function () {
                b.setCoords();
                e()
            }
        });
        return this
    },
    fxStraightenObject: function (a) {
        a.fxStraighten({
            onChange: this.renderAll.bind(this)
        });
        return this
    },
    fxRemove: function (a, c) {
        var b = this;
        a.fxRemove({
            onChange: this.renderAll.bind(this),
            onComplete: function () {
                b.remove(a);
                if (typeof c === "function") {
                    c()
                }
            }
        });
        return this
    }
});
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function (a, c) {
        if (!a) {
            return
        }
        var b = (typeof a === "string") ? JSON.parse(a) : a;
        if (!b || (b && !b.objects)) {
            return
        }
        this.clear();
        this.backgroundColor = b.background;
        this._enlivenDatalessObjects(b.objects, c)
    },
    _enlivenDatalessObjects: function (b, h) {
        function g(i, e) {
            f.insertAt(i, e, true);
            i.setCoords();
            if (++d === a) {
                h && h()
            }
        }
        var f = this,
            d = 0,
            a = b.length;
        if (a === 0 && h) {
            h()
        }
        try {
            b.forEach(function (n, l) {
                var i = n.paths ? "paths" : "path";
                var m = n[i];
                delete n[i];
                if (typeof m !== "string") {
                    switch (n.type) {
                    case "image":
                    case "text":
                        fabric[fabric.util.string.capitalize(n.type)].fromObject(n, function (p) {
                            g(p, l)
                        });
                        break;
                    default:
                        var e = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(n.type))];
                        if (e && e.fromObject) {
                            if (m) {
                                n[i] = m
                            }
                            g(e.fromObject(n), l)
                        }
                        break
                    }
                } else {
                    if (n.type === "image") {
                        fabric.util.loadImage(m, function (p) {
                            var o = new fabric.Image(p);
                            o.setSourcePath(m);
                            fabric.util.object.extend(o, n);
                            o.setAngle(n.angle);
                            g(o, l)
                        })
                    } else {
                        if (n.type === "text") {
                            n.path = m;
                            var k = fabric.Text.fromObject(n);
                            var j = function () {
                                    if (Object.prototype.toString.call(fabric.window.opera) === "[object Opera]") {
                                        setTimeout(function () {
                                            g(k, l)
                                        }, 500)
                                    } else {
                                        g(k, l)
                                    }
                                };
                            fabric.util.getScript(m, j)
                        } else {
                            fabric.loadSVGFromURL(m, function (q, p) {
                                if (q.length > 1) {
                                    var o = new fabric.PathGroup(q, n)
                                } else {
                                    var o = q[0]
                                }
                                o.setSourcePath(m);
                                if (!(o instanceof fabric.PathGroup)) {
                                    fabric.util.object.extend(o, n);
                                    if (typeof n.angle !== "undefined") {
                                        o.setAngle(n.angle)
                                    }
                                }
                                g(o, l)
                            })
                        }
                    }
                }
            }, this)
        } catch (c) {
            fabric.log(c.message)
        }
    },
    loadFromJSON: function (a, d) {
        if (!a) {
            return
        }
        var b = JSON.parse(a);
        if (!b || (b && !b.objects)) {
            return
        }
        this.clear();
        var c = this;
        this._enlivenObjects(b.objects, function () {
            c.backgroundColor = b.background;
            if (d) {
                d()
            }
        });
        return this
    },
    _enlivenObjects: function (b, e) {
        var c = 0,
            a = b.filter(function (f) {
                return f.type === "image"
            }).length;
        var d = this;
        b.forEach(function (h, g) {
            if (!h.type) {
                return
            }
            switch (h.type) {
            case "image":
            case "font":
                fabric[fabric.util.string.capitalize(h.type)].fromObject(h, function (i) {
                    d.insertAt(i, g, true);
                    if (++c === a) {
                        if (e) {
                            e()
                        }
                    }
                });
                break;
            default:
                var f = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(h.type))];
                if (f && f.fromObject) {
                    d.insertAt(f.fromObject(h), g, true)
                }
                break
            }
        });
        if (a === 0 && e) {
            e()
        }
    },
    _toDataURL: function (a, b) {
        this.clone(function (c) {
            b(c.toDataURL(a))
        })
    },
    _toDataURLWithMultiplier: function (a, c, b) {
        this.clone(function (d) {
            b(d.toDataURLWithMultiplier(a, c))
        })
    },
    clone: function (c) {
        var a = fabric.document.createElement("canvas");
        a.width = this.getWidth();
        a.height = this.getHeight();
        var b = this.__clone || (this.__clone = new fabric.Canvas(a));
        b.clipTo = this.clipTo;
        return b.loadFromJSON(JSON.stringify(this.toJSON()), function () {
            if (c) {
                c(b)
            }
        })
    }
});
(function (a) {
    var d = a.fabric || (a.fabric = {}),
        l = d.util.object.extend,
        m = d.util.object.clone,
        c = d.util.toFixed,
        k = d.util.string.capitalize,
        p = d.util.getPointer,
        b = d.util.degreesToRadians,
        o = Array.prototype.slice;
    if (d.Object) {
        return
    }
    d.Object = d.util.createClass({
        type: "object",
        includeDefaultValues: true,
        NUM_FRACTION_DIGITS: 2,
        FX_DURATION: 500,
        MIN_SCALE_LIMIT: 0.1,
        stateProperties: ("top left width height scaleX scaleY flipX flipY theta angle opacity cornersize fill overlayFill stroke strokeWidth fillRule borderScaleFactor transformMatrix selectable").split(" "),
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        theta: 0,
        opacity: 1,
        angle: 0,
        cornersize: 12,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        cornerColor: "rgba(102,153,255,0.5)",
        fill: "rgb(0,0,0)",
        fillRule: "source-over",
        overlayFill: null,
        stroke: null,
        strokeWidth: 1,
        borderOpacityWhenMoving: 0.4,
        borderScaleFactor: 1,
        transformMatrix: null,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        callSuper: function (i) {
            var q = this.constructor.superclass.prototype[i];
            return (arguments.length > 1) ? q.apply(this, o.call(arguments, 1)) : q.call(this)
        },
        initialize: function (i) {
            i && this.setOptions(i)
        },
        setOptions: function (q) {
            var r = this.stateProperties.length,
                s;
            while (r--) {
                s = this.stateProperties[r];
                if (s in q) {
                    this.set(s, q[s])
                }
            }
        },
        transform: function (i) {
            i.globalAlpha = this.opacity;
            i.translate(this.left, this.top);
            i.rotate(this.theta);
            i.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1))
        },
        toObject: function () {
            var i = {
                type: this.type,
                left: c(this.left, this.NUM_FRACTION_DIGITS),
                top: c(this.top, this.NUM_FRACTION_DIGITS),
                width: c(this.width, this.NUM_FRACTION_DIGITS),
                height: c(this.height, this.NUM_FRACTION_DIGITS),
                fill: this.fill,
                overlayFill: this.overlayFill,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                scaleX: c(this.scaleX, this.NUM_FRACTION_DIGITS),
                scaleY: c(this.scaleY, this.NUM_FRACTION_DIGITS),
                angle: c(this.getAngle(), this.NUM_FRACTION_DIGITS),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: c(this.opacity, this.NUM_FRACTION_DIGITS),
                selectable: this.selectable
            };
            if (!this.includeDefaultValues) {
                i = this._removeDefaultValues(i)
            }
            return i
        },
        toDatalessObject: function () {
            return this.toObject()
        },
        getSvgStyles: function () {
            return ["stroke: ", (this.stroke ? this.stroke : "none"), "; ", "stroke-width: ", (this.strokeWidth ? this.strokeWidth : "0"), "; ", "fill: ", (this.fill ? this.fill : "none"), "; ", "opacity: ", (this.opacity ? this.opacity : "1"), ";", ].join("")
        },
        getSvgTransform: function () {
            var i = this.getAngle();
            return ["translate(", this.left, " ", this.top, ")", i !== 0 ? (" rotate(" + i + ")") : "", (this.scaleX === 1 && this.scaleY === 1) ? "" : (" scale(" + c(this.scaleX, "2") + " " + c(this.scaleY, "2") + ")")].join("")
        },
        _removeDefaultValues: function (q) {
            var i = d.Object.prototype.options;
            if (i) {
                this.stateProperties.forEach(function (r) {
                    if (q[r] === i[r]) {
                        delete q[r]
                    }
                })
            }
            return q
        },
        isActive: function () {
            return !!this.active
        },
        setActive: function (i) {
            this.active = !! i;
            return this
        },
        toString: function () {
            return "#<fabric." + k(this.type) + ">"
        },
        set: function (q, i) {
            var s = (q === "scaleX" || q === "scaleY") && i < this.MIN_SCALE_LIMIT;
            if (s) {
                i = this.MIN_SCALE_LIMIT
            }
            if (typeof q == "object") {
                for (var r in q) {
                    this.set(r, q[r])
                }
            } else {
                if (q === "angle") {
                    this.setAngle(i)
                } else {
                    this[q] = i
                }
            }
            return this
        },
        toggle: function (q) {
            var i = this.get(q);
            if (typeof i === "boolean") {
                this.set(q, !i)
            }
            return this
        },
        setSourcePath: function (i) {
            this.sourcePath = i;
            return this
        },
        get: function (i) {
            return (i === "angle") ? this.getAngle() : this[i]
        },
        render: function (q, r) {
            if (this.width === 0 || this.height === 0) {
                return
            }
            q.save();
            var i = this.transformMatrix;
            if (i) {
                q.setTransform(i[0], i[1], i[2], i[3], i[4], i[5])
            }
            if (!r) {
                this.transform(q)
            }
            if (this.stroke) {
                q.lineWidth = this.strokeWidth;
                q.strokeStyle = this.stroke
            }
            if (this.overlayFill) {
                q.fillStyle = this.overlayFill
            } else {
                if (this.fill) {
                    q.fillStyle = this.fill
                }
            }
            if (this.group) {}
            this._render(q, r);
            if (this.active && !r) {
                this.drawBorders(q);
                this.hideCorners || this.drawCorners(q)
            }
            q.restore()
        },
        getWidth: function () {
            return this.width * this.scaleX
        },
        getHeight: function () {
            return this.height * this.scaleY
        },
        scale: function (i) {
            this.scaleX = i;
            this.scaleY = i;
            return this
        },
        scaleToWidth: function (i) {
            return this.scale(i / this.width)
        },
        scaleToHeight: function (i) {
            return this.scale(i / this.height)
        },
        setOpacity: function (i) {
            this.set("opacity", i);
            return this
        },
        getAngle: function () {
            return this.theta * 180 / Math.PI
        },
        setAngle: function (i) {
            this.theta = i / 180 * Math.PI;
            this.angle = i;
            return this
        },
        setCoords: function () {
            this.currentWidth = this.width * this.scaleX;
            this.currentHeight = this.height * this.scaleY;
            this._hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
            this._angle = Math.atan(this.currentHeight / this.currentWidth);
            var v = Math.cos(this._angle + this.theta) * this._hypotenuse,
                u = Math.sin(this._angle + this.theta) * this._hypotenuse,
                r = this.theta,
                y = Math.sin(r),
                w = Math.cos(r);
            var B = {
                x: this.left - v,
                y: this.top - u
            };
            var x = {
                x: B.x + (this.currentWidth * w),
                y: B.y + (this.currentWidth * y)
            };
            var A = {
                x: x.x - (this.currentHeight * y),
                y: x.y + (this.currentHeight * w)
            };
            var s = {
                x: B.x - (this.currentHeight * y),
                y: B.y + (this.currentHeight * w)
            };
            var t = {
                x: B.x - (this.currentHeight / 2 * y),
                y: B.y + (this.currentHeight / 2 * w)
            };
            var i = {
                x: B.x + (this.currentWidth / 2 * w),
                y: B.y + (this.currentWidth / 2 * y)
            };
            var q = {
                x: x.x - (this.currentHeight / 2 * y),
                y: x.y + (this.currentHeight / 2 * w)
            };
            var z = {
                x: s.x + (this.currentWidth / 2 * w),
                y: s.y + (this.currentWidth / 2 * y)
            };
            this.oCoords = {
                tl: B,
                tr: x,
                br: A,
                bl: s,
                ml: t,
                mt: i,
                mr: q,
                mb: z
            };
            this._setCornerCoords();
            return this
        },
        drawBorders: function (q) {
            if (!this.hasBorders) {
                return
            }
            var v = this.padding,
                s = v * 2;
            q.save();
            q.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            q.strokeStyle = this.borderColor;
            var t = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
                r = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);
            q.lineWidth = 1 / this.borderScaleFactor;
            q.scale(t, r);
            var i = this.getWidth(),
                u = this.getHeight();
            q.strokeRect(~~ (-(i / 2) - v) + 0.5, ~~ (-(u / 2) - v) + 0.5, ~~ (i + s), ~~ (u + s));
            q.restore();
            return this
        },
        drawCorners: function (B) {
            if (!this.hasControls) {
                return
            }
            var D = this.cornersize,
                y = D / 2,
                x = this.padding,
                r = -(this.width / 2),
                w = -(this.height / 2),
                C, A, q = D / this.scaleX,
                i = D / this.scaleY,
                s = (x + y) / this.scaleY,
                t = (x + y) / this.scaleX,
                v = (x + y - D) / this.scaleX,
                u = (x + y - D) / this.scaleY,
                z = this.height;
            B.save();
            B.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            B.fillStyle = this.cornerColor;
            C = r - t;
            A = w - s;
            B.fillRect(C, A, q, i);
            C = r + this.width - t;
            A = w - s;
            B.fillRect(C, A, q, i);
            C = r - t;
            A = w + z + u;
            B.fillRect(C, A, q, i);
            C = r + this.width + v;
            A = w + z + u;
            B.fillRect(C, A, q, i);
            C = r + this.width / 2 - t;
            A = w - s;
            B.fillRect(C, A, q, i);
            C = r + this.width / 2 - t;
            A = w + z + u;
            B.fillRect(C, A, q, i);
            C = r + this.width + v;
            A = w + z / 2 - s;
            B.fillRect(C, A, q, i);
            C = r - t;
            A = w + z / 2 - s;
            B.fillRect(C, A, q, i);
            B.restore();
            return this
        },
        clone: function (i) {
            if (this.constructor.fromObject) {
                return this.constructor.fromObject(this.toObject(), i)
            }
            return new d.Object(this.toObject())
        },
        cloneAsImage: function (s) {
            if (d.Image) {
                var q = new Image();
                q.onload = function () {
                    if (s) {
                        s(new d.Image(q), r)
                    }
                    q = q.onload = null
                };
                var r = {
                    angle: this.get("angle"),
                    flipX: this.get("flipX"),
                    flipY: this.get("flipY")
                };
                this.set("angle", 0).set("flipX", false).set("flipY", false);
                this.toDataURL(function (i) {
                    q.src = i
                })
            }
            return this
        },
        toDataURL: function (s) {
            var q = d.document.createElement("canvas");
            q.width = this.getWidth();
            q.height = this.getHeight();
            d.util.wrapElement(q, "div");
            var i = new d.Canvas(q);
            i.backgroundColor = "transparent";
            i.renderAll();
            if (this.constructor.async) {
                this.clone(r)
            } else {
                r(this.clone())
            }
            function r(u) {
                u.left = q.width / 2;
                u.top = q.height / 2;
                u.setActive(false);
                i.add(u);
                var t = i.toDataURL("png");
                i.dispose();
                i = u = null;
                s && s(t)
            }
        },
        hasStateChanged: function () {
            return this.stateProperties.some(function (i) {
                return this[i] !== this.originalState[i]
            }, this)
        },
        saveState: function () {
            this.stateProperties.forEach(function (i) {
                this.originalState[i] = this.get(i)
            }, this);
            return this
        },
        setupState: function () {
            this.originalState = {};
            this.saveState()
        },
        intersectsWithRect: function (r, t) {
            var w = this.oCoords,
                i = new d.Point(w.tl.x, w.tl.y),
                s = new d.Point(w.tr.x, w.tr.y),
                v = new d.Point(w.bl.x, w.bl.y),
                q = new d.Point(w.br.x, w.br.y);
            var u = d.Intersection.intersectPolygonRectangle([i, s, q, v], r, t);
            return (u.status === "Intersection")
        },
        intersectsWithObject: function (i) {
            function q(u) {
                return {
                    tl: new d.Point(u.tl.x, u.tl.y),
                    tr: new d.Point(u.tr.x, u.tr.y),
                    bl: new d.Point(u.bl.x, u.bl.y),
                    br: new d.Point(u.br.x, u.br.y)
                }
            }
            var r = q(this.oCoords),
                t = q(i.oCoords);
            var s = d.Intersection.intersectPolygonPolygon([r.tl, r.tr, r.br, r.bl], [t.tl, t.tr, t.br, t.bl]);
            return (s.status === "Intersection")
        },
        isContainedWithinObject: function (i) {
            return this.isContainedWithinRect(i.oCoords.tl, i.oCoords.br)
        },
        isContainedWithinRect: function (r, t) {
            var v = this.oCoords,
                i = new d.Point(v.tl.x, v.tl.y),
                s = new d.Point(v.tr.x, v.tr.y),
                u = new d.Point(v.bl.x, v.bl.y),
                q = new d.Point(v.br.x, v.br.y);
            return i.x > r.x && s.x < t.x && i.y > r.y && u.y < t.y
        },
        isType: function (i) {
            return this.type === i
        },
        _findTargetCorner: function (v, x) {
            if (!this.hasControls) {
                return false
            }
            var w = p(v),
                u = w.x - x.left,
                r = w.y - x.top,
                t, q;
            for (var s in this.oCoords) {
                q = this._getImageLines(this.oCoords[s].corner, s);
                t = this._findCrossPoints(u, r, q);
                if (t % 2 == 1 && t != 0) {
                    this.__corner = s;
                    return s
                }
            }
            return false
        },
        _findCrossPoints: function (w, v, i) {
            var z, y, r, q, x, u, t = 0,
                s;
            for (var A in i) {
                s = i[A];
                if ((s.o.y < v) && (s.d.y < v)) {
                    continue
                }
                if ((s.o.y >= v) && (s.d.y >= v)) {
                    continue
                }
                if ((s.o.x == s.d.x) && (s.o.x >= w)) {
                    x = s.o.x;
                    u = v
                } else {
                    z = 0;
                    y = (s.d.y - s.o.y) / (s.d.x - s.o.x);
                    r = v - z * w;
                    q = s.o.y - y * s.o.x;
                    x = -(r - q) / (z - y);
                    u = r + z * x
                }
                if (x >= w) {
                    t += 1
                }
                if (t == 2) {
                    break
                }
            }
            return t
        },
        _getImageLines: function (r, q) {
            return {
                topline: {
                    o: r.tl,
                    d: r.tr
                },
                rightline: {
                    o: r.tr,
                    d: r.br
                },
                bottomline: {
                    o: r.br,
                    d: r.bl
                },
                leftline: {
                    o: r.bl,
                    d: r.tl
                }
            }
        },
        _setCornerCoords: function () {
            var t = this.oCoords,
                q = b(45 - this.getAngle()),
                s = Math.sqrt(2 * Math.pow(this.cornersize, 2)) / 2,
                i = s * Math.cos(q),
                r = s * Math.sin(q);
            t.tl.corner = {
                tl: {
                    x: t.tl.x - r,
                    y: t.tl.y - i
                },
                tr: {
                    x: t.tl.x + i,
                    y: t.tl.y - r
                },
                bl: {
                    x: t.tl.x - i,
                    y: t.tl.y + r
                },
                br: {
                    x: t.tl.x + r,
                    y: t.tl.y + i
                }
            };
            t.tr.corner = {
                tl: {
                    x: t.tr.x - r,
                    y: t.tr.y - i
                },
                tr: {
                    x: t.tr.x + i,
                    y: t.tr.y - r
                },
                br: {
                    x: t.tr.x + r,
                    y: t.tr.y + i
                },
                bl: {
                    x: t.tr.x - i,
                    y: t.tr.y + r
                }
            };
            t.bl.corner = {
                tl: {
                    x: t.bl.x - r,
                    y: t.bl.y - i
                },
                bl: {
                    x: t.bl.x - i,
                    y: t.bl.y + r
                },
                br: {
                    x: t.bl.x + r,
                    y: t.bl.y + i
                },
                tr: {
                    x: t.bl.x + i,
                    y: t.bl.y - r
                }
            };
            t.br.corner = {
                tr: {
                    x: t.br.x + i,
                    y: t.br.y - r
                },
                bl: {
                    x: t.br.x - i,
                    y: t.br.y + r
                },
                br: {
                    x: t.br.x + r,
                    y: t.br.y + i
                },
                tl: {
                    x: t.br.x - r,
                    y: t.br.y - i
                }
            };
            t.ml.corner = {
                tl: {
                    x: t.ml.x - r,
                    y: t.ml.y - i
                },
                tr: {
                    x: t.ml.x + i,
                    y: t.ml.y - r
                },
                bl: {
                    x: t.ml.x - i,
                    y: t.ml.y + r
                },
                br: {
                    x: t.ml.x + r,
                    y: t.ml.y + i
                }
            };
            t.mt.corner = {
                tl: {
                    x: t.mt.x - r,
                    y: t.mt.y - i
                },
                tr: {
                    x: t.mt.x + i,
                    y: t.mt.y - r
                },
                bl: {
                    x: t.mt.x - i,
                    y: t.mt.y + r
                },
                br: {
                    x: t.mt.x + r,
                    y: t.mt.y + i
                }
            };
            t.mr.corner = {
                tl: {
                    x: t.mr.x - r,
                    y: t.mr.y - i
                },
                tr: {
                    x: t.mr.x + i,
                    y: t.mr.y - r
                },
                bl: {
                    x: t.mr.x - i,
                    y: t.mr.y + r
                },
                br: {
                    x: t.mr.x + r,
                    y: t.mr.y + i
                }
            };
            t.mb.corner = {
                tl: {
                    x: t.mb.x - r,
                    y: t.mb.y - i
                },
                tr: {
                    x: t.mb.x + i,
                    y: t.mb.y - r
                },
                bl: {
                    x: t.mb.x - i,
                    y: t.mb.y + r
                },
                br: {
                    x: t.mb.x + r,
                    y: t.mb.y + i
                }
            }
        },
        toGrayscale: function () {
            var i = this.get("fill");
            if (i) {
                this.set("overlayFill", new d.Color(i).toGrayscale().toRgb())
            }
            return this
        },
        complexity: function () {
            return 0
        },
        straighten: function () {
            var i = this._getAngleValueForStraighten();
            this.setAngle(i);
            return this
        },
        fxStraighten: function (q) {
            q = q || {};
            var r = function () {},
                s = q.onComplete || r,
                i = q.onChange || r,
                t = this;
            d.util.animate({
                startValue: this.get("angle"),
                endValue: this._getAngleValueForStraighten(),
                duration: this.FX_DURATION,
                onChange: function (u) {
                    t.setAngle(u);
                    i()
                },
                onComplete: function () {
                    t.setCoords();
                    s()
                },
                onStart: function () {
                    t.setActive(false)
                }
            });
            return this
        },
        fxRemove: function (q) {
            q || (q = {});
            var r = function () {},
                s = q.onComplete || r,
                i = q.onChange || r,
                t = this;
            d.util.animate({
                startValue: this.get("opacity"),
                endValue: 0,
                duration: this.FX_DURATION,
                onChange: function (u) {
                    t.set("opacity", u);
                    i()
                },
                onComplete: s,
                onStart: function () {
                    t.setActive(false)
                }
            });
            return this
        },
        _getAngleValueForStraighten: function () {
            var i = this.get("angle");
            if (i > -225 && i <= -135) {
                return -180
            } else {
                if (i > -135 && i <= -45) {
                    return -90
                } else {
                    if (i > -45 && i <= 45) {
                        return 0
                    } else {
                        if (i > 45 && i <= 135) {
                            return 90
                        } else {
                            if (i > 135 && i <= 225) {
                                return 180
                            } else {
                                if (i > 225 && i <= 315) {
                                    return 270
                                } else {
                                    if (i > 315) {
                                        return 360
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return 0
        },
        toJSON: function () {
            return this.toObject()
        },
        setGradientFill: function (i, q) {
            this.set("fill", d.Gradient.forObject(this, i, q))
        },
        animate: function (q, s, i) {
            var r = this;
            if (!("from" in i)) {
                i.from = this.get(q)
            }
            if (/[+-]/.test(s.charAt(0))) {
                s = this.get(q) + parseFloat(s)
            }
            d.util.animate({
                startValue: i.from,
                endValue: s,
                duration: i.duration,
                onChange: function (t) {
                    r.set(q, t);
                    i.onChange && i.onChange()
                },
                onComplete: function () {
                    r.setCoords();
                    i.onComplete && i.onComplete()
                }
            })
        }
    });
    d.Object.prototype.rotate = d.Object.prototype.setAngle;
    var j = d.Object.prototype;
    for (var g = j.stateProperties.length; g--;) {
        var h = j.stateProperties[g],
            e = h.charAt(0).toUpperCase() + h.slice(1),
            f = "set" + e,
            n = "get" + e;
        if (!j[n]) {
            j[n] = (function (i) {
                return new Function('return this.get("' + i + '")')
            })(h)
        }
        if (!j[f]) {
            j[f] = (function (i) {
                return new Function("value", 'return this.set("' + i + '", value)')
            })(h)
        }
    }
})(typeof exports != "undefined" ? exports : this);
(function (b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        d = c.Object.prototype.set,
        a = {
            x1: 1,
            x2: 1,
            y1: 1,
            y2: 1
        };
    if (c.Line) {
        c.warn("fabric.Line is already defined");
        return
    }
    c.Line = c.util.createClass(c.Object, {
        type: "line",
        initialize: function (g, f) {
            if (!g) {
                g = [0, 0, 0, 0]
            }
            this.callSuper("initialize", f);
            this.set("x1", g[0]);
            this.set("y1", g[1]);
            this.set("x2", g[2]);
            this.set("y2", g[3]);
            this._setWidthHeight()
        },
        _setWidthHeight: function () {
            this.set("width", (this.x2 - this.x1) || 1);
            this.set("height", (this.y2 - this.y1) || 1);
            this.set("left", this.x1 + this.width / 2);
            this.set("top", this.y1 + this.height / 2)
        },
        set: function (f, g) {
            d.call(this, f, g);
            if (f in a) {
                this._setWidthHeight()
            }
            return this
        },
        _render: function (f) {
            f.beginPath();
            f.moveTo(this.width === 1 ? 0 : (-this.width / 2), this.height === 1 ? 0 : (-this.height / 2));
            f.lineTo(this.width === 1 ? 0 : (this.width / 2), this.height === 1 ? 0 : (this.height / 2));
            f.lineWidth = this.strokeWidth;
            var g = f.strokeStyle;
            f.strokeStyle = f.fillStyle;
            f.stroke();
            f.strokeStyle = g
        },
        complexity: function () {
            return 1
        },
        toObject: function () {
            return e(this.callSuper("toObject"), {
                x1: this.get("x1"),
                y1: this.get("y1"),
                x2: this.get("x2"),
                y2: this.get("y2")
            })
        },
        toSVG: function () {
            return ["<line ", 'x1="', this.get("x1"), '" ', 'y1="', this.get("y1"), '" ', 'x2="', this.get("x2"), '" ', 'y2="', this.get("y2"), '" ', 'style="', this.getSvgStyles(), '" ', "/>"].join("")
        }
    });
    c.Line.ATTRIBUTE_NAMES = "x1 y1 x2 y2 stroke stroke-width transform".split(" ");
    c.Line.fromElement = function (g, f) {
        var i = c.parseAttributes(g, c.Line.ATTRIBUTE_NAMES);
        var h = [i.x1 || 0, i.y1 || 0, i.x2 || 0, i.y2 || 0];
        return new c.Line(h, e(i, f))
    };
    c.Line.fromObject = function (f) {
        var g = [f.x1, f.y1, f.x2, f.y2];
        return new c.Line(g, f)
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = a.fabric || (a.fabric = {}),
        d = Math.PI * 2,
        e = b.util.object.extend;
    if (b.Circle) {
        b.warn("fabric.Circle is already defined.");
        return
    }
    b.Circle = b.util.createClass(b.Object, {
        type: "circle",
        initialize: function (f) {
            f = f || {};
            this.set("radius", f.radius || 0);
            this.callSuper("initialize", f);
            var g = this.get("radius") * 2 * this.get("scaleX");
            this.set("width", g).set("height", g)
        },
        toObject: function () {
            return e(this.callSuper("toObject"), {
                radius: this.get("radius")
            })
        },
        toSVG: function () {
            return ('<circle cx="0" cy="0" r="' + this.radius + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />')
        },
        _render: function (f, g) {
            f.beginPath();
            f.globalAlpha *= this.opacity;
            f.arc(g ? this.left : 0, g ? this.top : 0, this.radius, 0, d, false);
            f.closePath();
            if (this.fill) {
                f.fill()
            }
            if (this.stroke) {
                f.stroke()
            }
        },
        getRadiusX: function () {
            return this.get("radius") * this.get("scaleX")
        },
        getRadiusY: function () {
            return this.get("radius") * this.get("scaleY")
        },
        complexity: function () {
            return 1
        }
    });
    b.Circle.ATTRIBUTE_NAMES = "cx cy r fill fill-opacity opacity stroke stroke-width transform".split(" ");
    b.Circle.fromElement = function (g, f) {
        f || (f = {});
        var h = b.parseAttributes(g, b.Circle.ATTRIBUTE_NAMES);
        if (!c(h)) {
            throw Error("value of `r` attribute is required and can not be negative")
        }
        if ("left" in h) {
            h.left -= (f.width / 2) || 0
        }
        if ("top" in h) {
            h.top -= (f.height / 2) || 0
        }
        return new b.Circle(e(h, f))
    };

    function c(f) {
        return (("radius" in f) && (f.radius > 0))
    }
    b.Circle.fromObject = function (f) {
        return new b.Circle(f)
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = a.fabric || (a.fabric = {});
    if (b.Triangle) {
        b.warn("fabric.Triangle is already defined");
        return
    }
    b.Triangle = b.util.createClass(b.Object, {
        type: "triangle",
        initialize: function (c) {
            c = c || {};
            this.callSuper("initialize", c);
            this.set("width", c.width || 100).set("height", c.height || 100)
        },
        _render: function (c) {
            var d = this.width / 2,
                e = this.height / 2;
            c.beginPath();
            c.moveTo(-d, e);
            c.lineTo(0, -e);
            c.lineTo(d, e);
            c.closePath();
            if (this.fill) {
                c.fill()
            }
            if (this.stroke) {
                c.stroke()
            }
        },
        complexity: function () {
            return 1
        },
        toSVG: function () {
            var c = this.width / 2,
                d = this.height / 2;
            var e = [-c + " " + d, "0 " + -d, c + " " + d].join(",");
            return '<polygon points="' + e + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />'
        }
    });
    b.Triangle.fromObject = function (c) {
        return new b.Triangle(c)
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = a.fabric || (a.fabric = {}),
        c = Math.PI * 2,
        d = b.util.object.extend;
    if (b.Ellipse) {
        b.warn("fabric.Ellipse is already defined.");
        return
    }
    b.Ellipse = b.util.createClass(b.Object, {
        type: "ellipse",
        initialize: function (e) {
            e = e || {};
            this.callSuper("initialize", e);
            this.set("rx", e.rx || 0);
            this.set("ry", e.ry || 0);
            this.set("width", this.get("rx") * 2);
            this.set("height", this.get("ry") * 2)
        },
        toObject: function () {
            return d(this.callSuper("toObject"), {
                rx: this.get("rx"),
                ry: this.get("ry")
            })
        },
        toSVG: function () {
            return ["<ellipse ", 'rx="', this.get("rx"), '" ', 'ry="', this.get("ry"), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
        },
        render: function (e, f) {
            if (this.rx === 0 || this.ry === 0) {
                return
            }
            return this.callSuper("render", e, f)
        },
        _render: function (e, f) {
            e.beginPath();
            e.save();
            e.globalAlpha *= this.opacity;
            e.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            e.arc(f ? this.left : 0, f ? this.top : 0, this.rx, 0, c, false);
            if (this.stroke) {
                e.stroke()
            }
            if (this.fill) {
                e.fill()
            }
            e.restore()
        },
        complexity: function () {
            return 1
        }
    });
    b.Ellipse.ATTRIBUTE_NAMES = "cx cy rx ry fill fill-opacity opacity stroke stroke-width transform".split(" ");
    b.Ellipse.fromElement = function (f, e) {
        e || (e = {});
        var g = b.parseAttributes(f, b.Ellipse.ATTRIBUTE_NAMES);
        if ("left" in g) {
            g.left -= (e.width / 2) || 0
        }
        if ("top" in g) {
            g.top -= (e.height / 2) || 0
        }
        return new b.Ellipse(d(g, e))
    };
    b.Ellipse.fromObject = function (e) {
        return new b.Ellipse(e)
    }
})(typeof exports != "undefined" ? exports : this);
(function (b) {
    var c = b.fabric || (b.fabric = {});
    if (c.Rect) {
        console.warn("fabric.Rect is already defined");
        return
    }
    c.Rect = c.util.createClass(c.Object, {
        type: "rect",
        options: {
            rx: 0,
            ry: 0
        },
        initialize: function (d) {
            this._initStateProperties();
            this.callSuper("initialize", d);
            this._initRxRy()
        },
        _initStateProperties: function () {
            this.stateProperties = this.stateProperties.concat(["rx", "ry"])
        },
        _initRxRy: function () {
            if (this.rx && !this.ry) {
                this.ry = this.rx
            } else {
                if (this.ry && !this.rx) {
                    this.rx = this.ry
                }
            }
        },
        _render: function (f) {
            var j = this.rx || 0,
                i = this.ry || 0,
                d = -this.width / 2,
                k = -this.height / 2,
                e = this.width,
                g = this.height;
            f.beginPath();
            f.globalAlpha *= this.opacity;
            if (this.group) {
                f.translate(this.x || 0, this.y || 0)
            }
            f.moveTo(d + j, k);
            f.lineTo(d + e - j, k);
            f.bezierCurveTo(d + e, k, d + e, k + i, d + e, k + i);
            f.lineTo(d + e, k + g - i);
            f.bezierCurveTo(d + e, k + g, d + e - j, k + g, d + e - j, k + g);
            f.lineTo(d + j, k + g);
            f.bezierCurveTo(d, k + g, d, k + g - i, d, k + g - i);
            f.lineTo(d, k + i);
            f.bezierCurveTo(d, k, d + j, k, d + j, k);
            f.closePath();
            if (this.fill) {
                f.fill()
            }
            if (this.stroke) {
                f.stroke()
            }
        },
        _normalizeLeftTopProperties: function (d) {
            if (d.left) {
                this.set("left", d.left + this.getWidth() / 2)
            }
            this.set("x", d.left || 0);
            if (d.top) {
                this.set("top", d.top + this.getHeight() / 2)
            }
            this.set("y", d.top || 0);
            return this
        },
        complexity: function () {
            return 1
        },
        toSVG: function () {
            return '<rect x="' + (-1 * this.width / 2) + '" y="' + (-1 * this.height / 2) + '" width="' + this.width + '" height="' + this.height + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />'
        }
    });
    c.Rect.ATTRIBUTE_NAMES = "x y width height rx ry fill fill-opacity opacity stroke stroke-width transform".split(" ");

    function a(d) {
        d.left = d.left || 0;
        d.top = d.top || 0;
        return d
    }
    c.Rect.fromElement = function (e, d) {
        if (!e) {
            return null
        }
        var g = c.parseAttributes(e, c.Rect.ATTRIBUTE_NAMES);
        g = a(g);
        var f = new c.Rect(c.util.object.extend((d ? c.util.object.clone(d) : {}), g));
        f._normalizeLeftTopProperties(g);
        return f
    };
    c.Rect.fromObject = function (d) {
        return new c.Rect(d)
    }
})(typeof exports != "undefined" ? exports : this);
(function (b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.util.toFixed;
    if (c.Polyline) {
        c.warn("fabric.Polyline is already defined");
        return
    }
    c.Polyline = c.util.createClass(c.Object, {
        type: "polyline",
        initialize: function (e, d) {
            d = d || {};
            this.set("points", e);
            this.callSuper("initialize", d);
            this._calcDimensions()
        },
        _calcDimensions: function () {
            return c.Polygon.prototype._calcDimensions.call(this)
        },
        toObject: function () {
            return c.Polygon.prototype.toObject.call(this)
        },
        toSVG: function () {
            var f = [];
            for (var e = 0, d = this.points.length; e < d; e++) {
                f.push(a(this.points[e].x, 2), ",", a(this.points[e].y, 2), " ")
            }
            return ["<polyline ", 'points="', f.join(""), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
        },
        _render: function (f) {
            var e;
            f.beginPath();
            for (var g = 0, d = this.points.length; g < d; g++) {
                e = this.points[g];
                f.lineTo(e.x, e.y)
            }
            if (this.fill) {
                f.fill()
            }
            if (this.stroke) {
                f.stroke()
            }
        },
        complexity: function () {
            return this.get("points").length
        }
    });
    c.Polyline.ATTRIBUTE_NAMES = "fill fill-opacity opacity stroke stroke-width transform".split(" ");
    c.Polyline.fromElement = function (g, e) {
        if (!g) {
            return null
        }
        e || (e = {});
        var h = c.parsePointsAttribute(g.getAttribute("points")),
            j = c.parseAttributes(g, c.Polyline.ATTRIBUTE_NAMES);
        for (var f = 0, d = h.length; f < d; f++) {
            h[f].x -= (e.width / 2) || 0;
            h[f].y -= (e.height / 2) || 0
        }
        return new c.Polyline(h, c.util.object.extend(j, e))
    };
    c.Polyline.fromObject = function (d) {
        var e = d.points;
        return new c.Polyline(e, d)
    }
})(typeof exports != "undefined" ? exports : this);
(function (f) {
    var g = f.fabric || (f.fabric = {}),
        h = g.util.object.extend,
        e = g.util.array.min,
        b = g.util.array.max,
        a = g.util.toFixed;
    if (g.Polygon) {
        g.warn("fabric.Polygon is already defined");
        return
    }
    function d(i) {
        return i.x
    }
    function c(i) {
        return i.y
    }
    g.Polygon = g.util.createClass(g.Object, {
        type: "polygon",
        initialize: function (j, i) {
            i = i || {};
            this.points = j;
            this.callSuper("initialize", i);
            this._calcDimensions()
        },
        _calcDimensions: function () {
            var j = this.points,
                i = e(j, "x"),
                m = e(j, "y"),
                l = b(j, "x"),
                k = b(j, "y");
            this.width = l - i;
            this.height = k - m;
            this.minX = i;
            this.minY = m
        },
        toObject: function () {
            return h(this.callSuper("toObject"), {
                points: this.points.concat()
            })
        },
        toSVG: function () {
            var l = [];
            for (var k = 0, j = this.points.length; k < j; k++) {
                l.push(a(this.points[k].x, 2), ",", a(this.points[k].y, 2), " ")
            }
            return ["<polygon ", 'points="', l.join(""), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
        },
        _render: function (l) {
            var k;
            l.beginPath();
            for (var m = 0, j = this.points.length; m < j; m++) {
                k = this.points[m];
                l.lineTo(k.x, k.y)
            }
            if (this.fill) {
                l.fill()
            }
            if (this.stroke) {
                l.closePath();
                l.stroke()
            }
        },
        complexity: function () {
            return this.points.length
        }
    });
    g.Polygon.ATTRIBUTE_NAMES = "fill fill-opacity opacity stroke stroke-width transform".split(" ");
    g.Polygon.fromElement = function (m, k) {
        if (!m) {
            return null
        }
        k || (k = {});
        var n = g.parsePointsAttribute(m.getAttribute("points")),
            o = g.parseAttributes(m, g.Polygon.ATTRIBUTE_NAMES);
        for (var l = 0, j = n.length; l < j; l++) {
            n[l].x -= (k.width / 2) || 0;
            n[l].y -= (k.height / 2) || 0
        }
        return new g.Polygon(n, h(o, k))
    };
    g.Polygon.fromObject = function (i) {
        return new g.Polygon(i.points, i)
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var l = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
    };

    function k(F, B, z, A) {
        var s = A[0];
        var q = A[1];
        var t = A[2];
        var D = A[3];
        var E = A[4];
        var w = A[5];
        var v = A[6];
        var r = i(w, v, s, q, D, E, t, B, z);
        for (var u = 0; u < r.length; u++) {
            var C = f.apply(this, r[u]);
            F.bezierCurveTo.apply(F, C)
        }
    }
    var b = {},
        p = {},
        o = Array.prototype.join,
        j;

    function i(T, S, O, N, J, P, G, M, L) {
        j = o.call(arguments);
        if (b[j]) {
            return b[j]
        }
        var r = G * (Math.PI / 180);
        var W = Math.sin(r);
        var aa = Math.cos(r);
        O = Math.abs(O);
        N = Math.abs(N);
        var A = aa * (M - T) * 0.5 + W * (L - S) * 0.5;
        var z = aa * (L - S) * 0.5 - W * (M - T) * 0.5;
        var E = (A * A) / (O * O) + (z * z) / (N * N);
        if (E > 1) {
            E = Math.sqrt(E);
            O *= E;
            N *= E
        }
        var R = aa / O;
        var Q = W / O;
        var D = (-W) / N;
        var C = (aa) / N;
        var H = R * M + Q * L;
        var q = D * M + C * L;
        var F = R * T + Q * S;
        var ab = D * T + C * S;
        var Z = (F - H) * (F - H) + (ab - q) * (ab - q);
        var U = 1 / Z - 0.25;
        if (U < 0) {
            U = 0
        }
        var w = Math.sqrt(U);
        if (P == J) {
            w = -w
        }
        var V = 0.5 * (H + F) - w * (ab - q);
        var K = 0.5 * (q + ab) + w * (F - H);
        var v = Math.atan2(q - K, H - V);
        var u = Math.atan2(ab - K, F - V);
        var Y = u - v;
        if (Y < 0 && P == 1) {
            Y += 2 * Math.PI
        } else {
            if (Y > 0 && P == 0) {
                Y -= 2 * Math.PI
            }
        }
        var B = Math.ceil(Math.abs(Y / (Math.PI * 0.5 + 0.001)));
        var I = [];
        for (var X = 0; X < B; X++) {
            var t = v + X * Y / B;
            var s = v + (X + 1) * Y / B;
            I[X] = [V, K, t, s, O, N, W, aa]
        }
        return (b[j] = I)
    }
    function f(w, s, E, C, y, x, u, D) {
        j = o.call(arguments);
        if (p[j]) {
            return p[j]
        }
        var K = D * y;
        var J = -u * x;
        var A = u * y;
        var z = D * x;
        var F = 0.5 * (C - E);
        var B = (8 / 3) * Math.sin(F * 0.5) * Math.sin(F * 0.5) / Math.sin(F);
        var I = w + Math.cos(E) - B * Math.sin(E);
        var v = s + Math.sin(E) + B * Math.cos(E);
        var G = w + Math.cos(C);
        var q = s + Math.sin(C);
        var H = G + B * Math.sin(C);
        var r = q - B * Math.cos(C);
        return (p[j] = [K * I + J * v, A * I + z * v, K * H + J * r, A * H + z * r, K * G + J * q, A * G + z * q])
    }
    "use strict";
    var d = a.fabric || (a.fabric = {}),
        e = d.util.array.min,
        h = d.util.array.max,
        g = d.util.object.extend,
        c = Object.prototype.toString;
    if (d.Path) {
        d.warn("fabric.Path is already defined");
        return
    }
    if (!d.Object) {
        d.warn("fabric.Path requires fabric.Object");
        return
    }
    function n(q) {
        if (q[0] === "H") {
            return q[1]
        }
        return q[q.length - 2]
    }
    function m(q) {
        if (q[0] === "V") {
            return q[1]
        }
        return q[q.length - 1]
    }
    d.Path = d.util.createClass(d.Object, {
        type: "path",
        initialize: function (s, r) {
            r = r || {};
            this.setOptions(r);
            if (!s) {
                throw Error("`path` argument is required")
            }
            var q = c.call(s) === "[object Array]";
            this.path = q ? s : s.match && s.match(/[a-zA-Z][^a-zA-Z]*/g);
            if (!this.path) {
                return
            }
            if (!q) {
                this._initializeFromArray(r)
            }
            if (r.sourcePath) {
                this.setSourcePath(r.sourcePath)
            }
        },
        _initializeFromArray: function (r) {
            var q = "width" in r,
                s = "height" in r;
            this.path = this._parsePath();
            if (!q || !s) {
                g(this, this._parseDimensions());
                if (q) {
                    this.width = r.width
                }
                if (s) {
                    this.height = r.height
                }
            }
        },
        _render: function (D) {
            var z, B = 0,
                A = 0,
                q = 0,
                E = 0,
                v, u, r = -(this.width / 2),
                C = -(this.height / 2);
            for (var s = 0, w = this.path.length; s < w; ++s) {
                z = this.path[s];
                switch (z[0]) {
                case "l":
                    B += z[1];
                    A += z[2];
                    D.lineTo(B + r, A + C);
                    break;
                case "L":
                    B = z[1];
                    A = z[2];
                    D.lineTo(B + r, A + C);
                    break;
                case "h":
                    B += z[1];
                    D.lineTo(B + r, A + C);
                    break;
                case "H":
                    B = z[1];
                    D.lineTo(B + r, A + C);
                    break;
                case "v":
                    A += z[1];
                    D.lineTo(B + r, A + C);
                    break;
                case "V":
                    A = z[1];
                    D.lineTo(B + r, A + C);
                    break;
                case "m":
                    B += z[1];
                    A += z[2];
                    D.moveTo(B + r, A + C);
                    break;
                case "M":
                    B = z[1];
                    A = z[2];
                    D.moveTo(B + r, A + C);
                    break;
                case "c":
                    v = B + z[5];
                    u = A + z[6];
                    q = B + z[3];
                    E = A + z[4];
                    D.bezierCurveTo(B + z[1] + r, A + z[2] + C, q + r, E + C, v + r, u + C);
                    B = v;
                    A = u;
                    break;
                case "C":
                    B = z[5];
                    A = z[6];
                    q = z[3];
                    E = z[4];
                    D.bezierCurveTo(z[1] + r, z[2] + C, q + r, E + C, B + r, A + C);
                    break;
                case "s":
                    v = B + z[3];
                    u = A + z[4];
                    q = 2 * B - q;
                    E = 2 * A - E;
                    D.bezierCurveTo(q + r, E + C, B + z[1] + r, A + z[2] + C, v + r, u + C);
                    B = v;
                    A = u;
                    break;
                case "S":
                    v = z[3];
                    u = z[4];
                    q = 2 * B - q;
                    E = 2 * A - E;
                    D.bezierCurveTo(q + r, E + C, z[1] + r, z[2] + C, v + r, u + C);
                    B = v;
                    A = u;
                    break;
                case "q":
                    B += z[3];
                    A += z[4];
                    D.quadraticCurveTo(z[1] + r, z[2] + C, B + r, A + C);
                    break;
                case "Q":
                    B = z[3];
                    A = z[4];
                    q = z[1];
                    E = z[2];
                    D.quadraticCurveTo(q + r, E + C, B + r, A + C);
                    break;
                case "T":
                    v = B;
                    u = A;
                    B = z[1];
                    A = z[2];
                    q = -q + 2 * v;
                    E = -E + 2 * u;
                    D.quadraticCurveTo(q + r, E + C, B + r, A + C);
                    break;
                case "a":
                    k(D, B + r, A + C, [z[1], z[2], z[3], z[4], z[5], z[6] + B + r, z[7] + A + C]);
                    B += z[6];
                    A += z[7];
                    break;
                case "A":
                    k(D, B + r, A + C, [z[1], z[2], z[3], z[4], z[5], z[6] + r, z[7] + C]);
                    B = z[6];
                    A = z[7];
                    break;
                case "z":
                case "Z":
                    D.closePath();
                    break
                }
            }
        },
        render: function (r, s) {
            r.save();
            var q = this.transformMatrix;
            if (q) {
                r.transform(q[0], q[1], q[2], q[3], q[4], q[5])
            }
            if (!s) {
                this.transform(r)
            }
            if (this.overlayFill) {
                r.fillStyle = this.overlayFill
            } else {
                if (this.fill) {
                    r.fillStyle = this.fill
                }
            }
            if (this.stroke) {
                r.strokeStyle = this.stroke
            }
            r.beginPath();
            this._render(r);
            if (this.fill) {
                r.fill()
            }
            if (this.stroke) {
                r.strokeStyle = this.stroke;
                r.lineWidth = this.strokeWidth;
                r.lineCap = r.lineJoin = "round";
                r.stroke()
            }
            if (!s && this.active) {
                this.drawBorders(r);
                this.hideCorners || this.drawCorners(r)
            }
            r.restore()
        },
        toString: function () {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
        },
        toObject: function () {
            var q = g(this.callSuper("toObject"), {
                path: this.path
            });
            if (this.sourcePath) {
                q.sourcePath = this.sourcePath
            }
            if (this.transformMatrix) {
                q.transformMatrix = this.transformMatrix
            }
            return q
        },
        toDatalessObject: function () {
            var q = this.toObject();
            if (this.sourcePath) {
                q.path = this.sourcePath
            }
            delete q.sourcePath;
            return q
        },
        toSVG: function () {
            var t = [];
            for (var r = 0, q = this.path.length; r < q; r++) {
                t.push(this.path[r].join(" "))
            }
            var s = t.join(" ");
            return ['<g transform="', this.getSvgTransform(), '">', "<path ", 'width="', this.width, '" height="', this.height, '" ', 'd="', s, '" ', 'style="', this.getSvgStyles(), '" ', 'transform="translate(', (-this.width / 2), " ", (-this.height / 2), ')" />', "</g>"].join("")
        },
        complexity: function () {
            return this.path.length
        },
        _parsePath: function () {
            var C = [],
                z, v, y;
            for (var u = 0, t, q, w = this.path.length; u < w; u++) {
                z = this.path[u];
                v = z.slice(1).trim().replace(/(\d)-/g, "$1###-").split(/\s|,|###/);
                q = [z.charAt(0)];
                for (var t = 0, A = v.length; t < A; t++) {
                    y = parseFloat(v[t]);
                    if (!isNaN(y)) {
                        q.push(y)
                    }
                }
                var s = q[0].toLowerCase(),
                    B = l[s];
                if (q.length - 1 > B) {
                    for (var r = 1, x = q.length; r < x; r += B) {
                        C.push([s].concat(q.slice(r, r + B)))
                    }
                } else {
                    C.push(q)
                }
            }
            return C
        },
        _parseDimensions: function () {
            var z = [],
                v = [],
                A, w, B = false,
                D, C;
            this.path.forEach(function (y, x) {
                if (y[0] !== "H") {
                    A = (x === 0) ? n(y) : n(this.path[x - 1])
                }
                if (y[0] !== "V") {
                    w = (x === 0) ? m(y) : m(this.path[x - 1])
                }
                if (y[0] === y[0].toLowerCase()) {
                    B = true
                }
                D = B ? A + n(y) : y[0] === "V" ? A : n(y);
                C = B ? w + m(y) : y[0] === "H" ? w : m(y);
                var E = parseInt(D, 10);
                if (!isNaN(E)) {
                    z.push(E)
                }
                E = parseInt(C, 10);
                if (!isNaN(E)) {
                    v.push(E)
                }
            }, this);
            var s = e(z),
                r = e(v),
                u = 0,
                t = 0;
            var q = {
                top: r - t,
                left: s - u,
                bottom: h(v) - t,
                right: h(z) - u
            };
            q.width = q.right - q.left;
            q.height = q.bottom - q.top;
            return q
        }
    });
    d.Path.fromObject = function (q) {
        return new d.Path(q.path, q)
    };
    d.Path.ATTRIBUTE_NAMES = "d fill fill-opacity opacity fill-rule stroke stroke-width transform".split(" ");
    d.Path.fromElement = function (r, q) {
        var s = d.parseAttributes(r, d.Path.ATTRIBUTE_NAMES);
        return new d.Path(s.d, g(s, q))
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var d = a.fabric || (a.fabric = {}),
        h = d.util.object.extend,
        f = d.util.array.invoke,
        i = d.Object.prototype.set,
        e = d.Object.prototype.toObject,
        b = d.util.string.camelize,
        g = d.util.string.capitalize;
    if (d.PathGroup) {
        d.warn("fabric.PathGroup is already defined");
        return
    }
    d.PathGroup = d.util.createClass(d.Path, {
        type: "path-group",
        forceFillOverwrite: false,
        initialize: function (l, j) {
            j = j || {};
            this.paths = l || [];
            for (var k = this.paths.length; k--;) {
                this.paths[k].group = this
            }
            this.setOptions(j);
            this.setCoords();
            if (j.sourcePath) {
                this.setSourcePath(j.sourcePath)
            }
        },
        render: function (n) {
            if (this.stub) {
                n.save();
                this.transform(n);
                this.stub.render(n, false);
                if (this.active) {
                    this.drawBorders(n);
                    this.drawCorners(n)
                }
                n.restore()
            } else {
                n.save();
                var j = this.transformMatrix;
                if (j) {
                    n.transform(j[0], j[1], j[2], j[3], j[4], j[5])
                }
                this.transform(n);
                for (var o = 0, k = this.paths.length; o < k; ++o) {
                    this.paths[o].render(n, true)
                }
                if (this.active) {
                    this.drawBorders(n);
                    this.hideCorners || this.drawCorners(n)
                }
                n.restore()
            }
        },
        set: function (l, k) {
            if ((l === "fill" || l === "overlayFill") && this.isSameColor()) {
                this[l] = k;
                var j = this.paths.length;
                while (j--) {
                    this.paths[j].set(l, k)
                }
            } else {
                i.call(this, l, k)
            }
            return this
        },
        toObject: function () {
            return h(e.call(this), {
                paths: f(this.getObjects(), "clone"),
                sourcePath: this.sourcePath
            })
        },
        toDatalessObject: function () {
            var j = this.toObject();
            if (this.sourcePath) {
                j.paths = this.sourcePath
            }
            return j
        },
        toSVG: function () {
            var m = this.getObjects();
            var k = ["<g ", 'width="', this.width, '" ', 'height="', this.height, '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', ">"];
            for (var l = 0, j = m.length; l < j; l++) {
                k.push(m[l].toSVG())
            }
            k.push("</g>");
            return k.join("")
        },
        toString: function () {
            return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
        },
        isSameColor: function () {
            var j = this.getObjects()[0].get("fill");
            return this.getObjects().every(function (k) {
                return k.get("fill") === j
            })
        },
        complexity: function () {
            return this.paths.reduce(function (j, k) {
                return j + ((k && k.complexity) ? k.complexity() : 0)
            }, 0)
        },
        toGrayscale: function () {
            var j = this.paths.length;
            while (j--) {
                this.paths[j].toGrayscale()
            }
            return this
        },
        getObjects: function () {
            return this.paths
        }
    });

    function c(m) {
        for (var l = 0, j = m.length; l < j; l++) {
            if (!(m[l] instanceof d.Object)) {
                var k = b(g(m[l].type));
                m[l] = d[k].fromObject(m[l])
            }
        }
        return m
    }
    d.PathGroup.fromObject = function (j) {
        var k = c(j.paths);
        return new d.PathGroup(k, j)
    }
})(typeof exports != "undefined" ? exports : this);
(function (d) {
    var e = d.fabric || (d.fabric = {}),
        g = e.util.object.extend,
        c = e.util.array.min,
        a = e.util.array.max,
        b = e.util.array.invoke,
        f = e.util.removeFromArray;
    if (e.Group) {
        return
    }
    e.Group = e.util.createClass(e.Object, {
        type: "group",
        initialize: function (i, h) {
            this.objects = i || [];
            this.originalState = {};
            this.callSuper("initialize");
            this._calcBounds();
            this._updateObjectsCoords();
            if (h) {
                g(this, h)
            }
            this._setOpacityIfSame();
            this.setCoords(true);
            this.saveCoords();
            this.activateAllObjects()
        },
        _updateObjectsCoords: function () {
            var i = this.left,
                h = this.top;
            this.forEachObject(function (j) {
                var k = j.get("left"),
                    l = j.get("top");
                j.set("originalLeft", k);
                j.set("originalTop", l);
                j.set("left", k - i);
                j.set("top", l - h);
                j.setCoords();
                j.hideCorners = true
            }, this)
        },
        toString: function () {
            return "#<fabric.Group: (" + this.complexity() + ")>"
        },
        getObjects: function () {
            return this.objects
        },
        add: function (h) {
            this._restoreObjectsState();
            this.objects.push(h);
            h.setActive(true);
            this._calcBounds();
            this._updateObjectsCoords();
            return this
        },
        remove: function (h) {
            this._restoreObjectsState();
            f(this.objects, h);
            h.setActive(false);
            this._calcBounds();
            this._updateObjectsCoords();
            return this
        },
        size: function () {
            return this.getObjects().length
        },
        set: function (h, k) {
            if (typeof k == "function") {
                this.set(h, k(this[h]))
            } else {
                if (h === "fill" || h === "opacity") {
                    var j = this.objects.length;
                    this[h] = k;
                    while (j--) {
                        this.objects[j].set(h, k)
                    }
                } else {
                    this[h] = k
                }
            }
            return this
        },
        contains: function (h) {
            return this.objects.indexOf(h) > -1
        },
        toObject: function () {
            return g(this.callSuper("toObject"), {
                objects: b(this.objects, "clone")
            })
        },
        render: function (j) {
            j.save();
            this.transform(j);
            var n = Math.max(this.scaleX, this.scaleY);
            for (var l = 0, h = this.objects.length, k; k = this.objects[l]; l++) {
                var m = k.borderScaleFactor;
                k.borderScaleFactor = n;
                k.render(j);
                k.borderScaleFactor = m
            }
            this.hideBorders || this.drawBorders(j);
            this.hideCorners || this.drawCorners(j);
            j.restore();
            this.setCoords()
        },
        item: function (h) {
            return this.getObjects()[h]
        },
        complexity: function () {
            return this.getObjects().reduce(function (i, h) {
                i += (typeof h.complexity == "function") ? h.complexity() : 0;
                return i
            }, 0)
        },
        _restoreObjectsState: function () {
            this.objects.forEach(this._restoreObjectState, this);
            return this
        },
        _restoreObjectState: function (j) {
            var l = this.get("left"),
                m = this.get("top"),
                h = this.getAngle() * (Math.PI / 180),
                k = j.get("originalLeft"),
                n = j.get("originalTop"),
                i = Math.cos(h) * j.get("top") + Math.sin(h) * j.get("left"),
                o = -Math.sin(h) * j.get("top") + Math.cos(h) * j.get("left");
            j.setAngle(j.getAngle() + this.getAngle());
            j.set("left", l + o * this.get("scaleX"));
            j.set("top", m + i * this.get("scaleY"));
            j.set("scaleX", j.get("scaleX") * this.get("scaleX"));
            j.set("scaleY", j.get("scaleY") * this.get("scaleY"));
            j.setCoords();
            j.hideCorners = false;
            j.setActive(false);
            j.setCoords();
            return this
        },
        destroy: function () {
            return this._restoreObjectsState()
        },
        saveCoords: function () {
            this._originalLeft = this.get("left");
            this._originalTop = this.get("top");
            return this
        },
        hasMoved: function () {
            return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
        },
        setObjectsCoords: function () {
            this.forEachObject(function (h) {
                h.setCoords()
            });
            return this
        },
        activateAllObjects: function () {
            return this.setActive(true)
        },
        setActive: function (h) {
            this.forEachObject(function (i) {
                i.setActive(h)
            });
            return this
        },
        forEachObject: e.StaticCanvas.prototype.forEachObject,
        _setOpacityIfSame: function () {
            var j = this.getObjects(),
                i = j[0] ? j[0].get("opacity") : 1;
            var h = j.every(function (k) {
                return k.get("opacity") === i
            });
            if (h) {
                this.opacity = i
            }
        },
        _calcBounds: function () {
            var s = [],
                q = [],
                p, n, k, h, m, l, u, r = 0,
                t = this.objects.length;
            for (; r < t; ++r) {
                m = this.objects[r];
                m.setCoords();
                for (var j in m.oCoords) {
                    s.push(m.oCoords[j].x);
                    q.push(m.oCoords[j].y)
                }
            }
            p = c(s);
            k = a(s);
            n = c(q);
            h = a(q);
            l = (k - p) || 0;
            u = (h - n) || 0;
            this.width = l;
            this.height = u;
            this.left = (p + l / 2) || 0;
            this.top = (n + u / 2) || 0
        },
        containsPoint: function (i) {
            var l = this.get("width") / 2,
                h = this.get("height") / 2,
                k = this.get("left"),
                j = this.get("top");
            return k - l < i.x && k + l > i.x && j - h < i.y && j + h > i.y
        },
        toGrayscale: function () {
            var h = this.objects.length;
            while (h--) {
                this.objects[h].toGrayscale()
            }
        }
    });
    e.Group.fromObject = function (h) {
        return new e.Group(h.objects, h)
    }
})(typeof exports != "undefined" ? exports : this);
(function (a) {
    var b = fabric.util.object.extend;
    if (!a.fabric) {
        a.fabric = {}
    }
    if (a.fabric.Image) {
        fabric.warn("fabric.Image is already defined.");
        return
    }
    if (!fabric.Object) {
        fabric.warn("fabric.Object is required for fabric.Image initialization");
        return
    }
    fabric.Image = fabric.util.createClass(fabric.Object, {
        maxwidth: null,
        maxheight: null,
        active: false,
        bordervisibility: false,
        cornervisibility: false,
        type: "image",
        filters: [],
        initialize: function (d, c) {
            c || (c = {});
            this.callSuper("initialize", c);
            this._initElement(d);
            this._originalImage = this.getElement();
            this._initConfig(c);
            if (c.filters) {
                this.filters = c.filters;
                this.applyFilters()
            }
        },
        getElement: function () {
            return this._element
        },
        setElement: function (c) {
            this._element = c;
            this._initConfig();
            return this
        },
        getNormalizedSize: function (d, c, e) {
            if (e && c && (d.width > d.height && (d.width / d.height) < (c / e))) {
                normalizedWidth = ~~ ((d.width * e) / d.height);
                normalizedHeight = e
            } else {
                if (e && ((d.height == d.width) || (d.height > d.width) || (d.height > e))) {
                    normalizedWidth = ~~ ((d.width * e) / d.height);
                    normalizedHeight = e
                } else {
                    if (c && (c < d.width)) {
                        normalizedHeight = ~~ ((d.height * c) / d.width);
                        normalizedWidth = c
                    } else {
                        normalizedWidth = d.width;
                        normalizedHeight = d.height
                    }
                }
            }
            return {
                width: normalizedWidth,
                height: normalizedHeight
            }
        },
        getOriginalSize: function () {
            var c = this.getElement();
            return {
                width: c.width,
                height: c.height
            }
        },
        setBorderVisibility: function (c) {
            this._resetWidthHeight();
            this._adjustWidthHeightToBorders(showBorder);
            this.setCoords()
        },
        setCornersVisibility: function (c) {
            this.cornervisibility = !! c
        },
        render: function (c, d) {
            c.save();
            if (!d) {
                this.transform(c)
            }
            this._render(c);
            if (this.active && !d) {
                this.drawBorders(c);
                this.hideCorners || this.drawCorners(c)
            }
            c.restore()
        },
        toObject: function () {
            return b(this.callSuper("toObject"), {
                src: this._originalImage.src,
                filters: this.filters.concat()
            })
        },
        toSVG: function () {
            return '<g transform="' + this.getSvgTransform() + '"><image xlink:href="' + this.getSrc() + '" style="' + this.getSvgStyles() + '" transform="translate(' + (-this.width / 2) + " " + (-this.height / 2) + ')" width="' + this.width + '" height="' + this.height + '"/></g>'
        },
        getSrc: function () {
            return this.getElement().src
        },
        toString: function () {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
        },
        clone: function (c) {
            this.constructor.fromObject(this.toObject(), c)
        },
        applyFilters: function (i) {
            if (this.filters.length === 0) {
                this.setElement(this._originalImage);
                i && i();
                return
            }
            var c = typeof Buffer !== "undefined" && typeof window === "undefined",
                g = this._originalImage,
                e = fabric.document.createElement("canvas"),
                f = c ? new(require("canvas").Image) : fabric.document.createElement("img"),
                h = this;
            e.width = g.width;
            e.height = g.height;
            e.getContext("2d").drawImage(g, 0, 0);
            this.filters.forEach(function (j) {
                j && j.applyTo(e)
            });
            f.onload = function () {
                h.setElement(f);
                i && i();
                f.onload = e = g = null
            };
            f.width = g.width;
            f.height = g.height;
            if (c) {
                var d = e.toDataURL("image/png").replace(/data:image\/png;base64,/, "");
                f.src = new Buffer(d, "base64");
                h.setElement(f);
                i && i()
            } else {
                f.src = e.toDataURL("image/png")
            }
            return this
        },
        _render: function (d) {
            var c = this.getOriginalSize();
            d.drawImage(this.getElement(), -c.width / 2, -c.height / 2, c.width, c.height)
        },
        _adjustWidthHeightToBorders: function (c) {
            if (c) {
                this.currentBorder = this.borderwidth;
                this.width += (2 * this.currentBorder);
                this.height += (2 * this.currentBorder)
            } else {
                this.currentBorder = 0
            }
        },
        _resetWidthHeight: function () {
            var c = this.getElement();
            this.set("width", c.width);
            this.set("height", c.height)
        },
        _initElement: function (c) {
            this.setElement(fabric.util.getById(c));
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
        },
        _initConfig: function (c) {
            this.setOptions(c || {});
            this._setBorder();
            this._setWidthHeight()
        },
        _initFilters: function (c) {
            if (c.filters && c.filters.length) {
                this.filters = c.filters.map(function (d) {
                    return fabric.Image.filters[d.type].fromObject(d)
                })
            }
        },
        _setBorder: function () {
            if (this.bordervisibility) {
                this.currentBorder = this.borderwidth
            } else {
                this.currentBorder = 0
            }
        },
        _setWidthHeight: function () {
            var c = 2 * this.currentBorder;
            this.width = (this.getElement().width || 0) + c;
            this.height = (this.getElement().height || 0) + c
        },
        complexity: function () {
            return 1
        }
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.fromObject = function (d, f) {
        var c = fabric.document.createElement("img"),
            e = d.src;
        if (d.width) {
            c.width = d.width
        }
        if (d.height) {
            c.height = d.height
        }
        c.onload = function () {
            fabric.Image.prototype._initFilters.call(d, d);
            var g = new fabric.Image(c, d);
            f && f(g);
            c = c.onload = null
        };
        c.src = e
    };
    fabric.Image.fromURL = function (d, f, e) {
        var c = fabric.document.createElement("img");
        c.onload = function () {
            if (f) {
                f(new fabric.Image(c, e))
            }
            c = c.onload = null
        };
        c.src = d
    };
    fabric.Image.ATTRIBUTE_NAMES = "x y width height fill fill-opacity opacity stroke stroke-width transform xlink:href".split(" ");
    fabric.Image.fromElement = function (d, f, c) {
        c || (c = {});
        var e = fabric.parseAttributes(d, fabric.Image.ATTRIBUTE_NAMES);
        fabric.Image.fromURL(e["xlink:href"], f, b(e, c))
    };
    fabric.Image.async = true
})(typeof exports != "undefined" ? exports : this);
fabric.Image.filters = {};
fabric.Image.filters.Grayscale = fabric.util.createClass({
    type: "Grayscale",
    applyTo: function (d) {
        var c = d.getContext("2d"),
            a = c.getImageData(0, 0, d.width, d.height),
            h = a.data,
            e = a.width,
            l = a.height,
            k, b, g, f;
        for (g = 0; g < e; g++) {
            for (f = 0; f < l; f++) {
                k = (g * 4) * l + (f * 4);
                b = (h[k] + h[k + 1] + h[k + 2]) / 3;
                h[k] = b;
                h[k + 1] = b;
                h[k + 2] = b
            }
        }
        c.putImageData(a, 0, 0)
    },
    toJSON: function () {
        return {
            type: this.type
        }
    }
});
fabric.Image.filters.Grayscale.fromObject = function () {
    return new fabric.Image.filters.Grayscale()
};
fabric.Image.filters.RemoveWhite = fabric.util.createClass({
    type: "RemoveWhite",
    initialize: function (a) {
        a || (a = {});
        this.threshold = a.threshold || 30;
        this.distance = a.distance || 20
    },
    applyTo: function (f) {
        var e = f.getContext("2d"),
            c = e.getImageData(0, 0, f.width, f.height),
            k = c.data,
            l = this.threshold,
            d = this.distance,
            h = 255 - l,
            p = Math.abs,
            a, m, o;
        for (var j = 0, n = k.length; j < n; j += 4) {
            a = k[j];
            m = k[j + 1];
            o = k[j + 2];
            if (a > h && m > h && o > h && p(a - m) < d && p(a - o) < d && p(m - o) < d) {
                k[j + 3] = 1
            }
        }
        e.putImageData(c, 0, 0)
    },
    toJSON: function () {
        return {
            type: this.type,
            threshold: this.threshold,
            distance: this.distance
        }
    }
});
fabric.Image.filters.RemoveWhite.fromObject = function (a) {
    return new fabric.Image.filters.RemoveWhite(a)
};
fabric.Image.filters.Invert = fabric.util.createClass({
    type: "Invert",
    applyTo: function (d) {
        var c = d.getContext("2d"),
            f = c.getImageData(0, 0, d.width, d.height),
            e = f.data,
            a = e.length,
            b;
        for (b = 0; b < a; b += 4) {
            e[b] = 255 - e[b];
            e[b + 1] = 255 - e[b + 1];
            e[b + 2] = 255 - e[b + 2]
        }
        c.putImageData(f, 0, 0)
    },
    toJSON: function () {
        return {
            type: this.type
        }
    }
});
fabric.Image.filters.Invert.fromObject = function () {
    return new fabric.Image.filters.Invert()
};
(function (a) {
    var b = a.fabric || (a.fabric = {}),
        d = b.util.object.extend,
        c = b.util.object.clone;
    if (b.Text) {
        b.warn("fabric.Text is already defined");
        return
    }
    if (!b.Object) {
        b.warn("fabric.Text requires fabric.Object");
        return
    }
    b.Text = b.util.createClass(b.Object, {
        fontSize: 40,
        fontWeight: 100,
        fontFamily: "Times_New_Roman",
        textDecoration: "",
        textShadow: null,
        textAlign: "left",
        fontStyle: "",
        lineHeight: 1.6,
        strokeStyle: "",
        strokeWidth: 1,
        backgroundColor: "",
        path: null,
        type: "text",
        initialize: function (f, e) {
            this._initStateProperties();
            this.text = f;
            this.setOptions(e);
            this.theta = this.angle * Math.PI / 180;
            this.width = this.getWidth();
            this.setCoords()
        },
        _initStateProperties: function () {
            this.stateProperties = this.stateProperties.concat();
            this.stateProperties.push("fontFamily", "fontWeight", "fontSize", "path", "text", "textDecoration", "textShadow", "textAlign", "fontStyle", "lineHeight", "strokeStyle", "strokeWidth", "backgroundColor");
            b.util.removeFromArray(this.stateProperties, "width")
        },
        toString: function () {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
        },
        _render: function (e) {
            var g = Cufon.textOptions || (Cufon.textOptions = {});
            g.left = this.left;
            g.top = this.top;
            g.context = e;
            g.color = this.fill;
            var f = this._initDummyElement();
            this.transform(e);
            Cufon.replaceElement(f, {
                separate: "none",
                fontFamily: this.fontFamily,
                fontWeight: this.fontWeight,
                textDecoration: this.textDecoration,
                textShadow: this.textShadow,
                textAlign: this.textAlign,
                fontStyle: this.fontStyle,
                lineHeight: this.lineHeight,
                strokeStyle: this.strokeStyle,
                strokeWidth: this.strokeWidth,
                backgroundColor: this.backgroundColor
            });
            this.width = g.width;
            this.height = g.height;
            this._totalLineHeight = g.totalLineHeight;
            this._fontAscent = g.fontAscent;
            this._boundaries = g.boundaries;
            this._shadowOffsets = g.shadowOffsets;
            this._shadows = g.shadows || [];
            this.setCoords()
        },
        _initDummyElement: function () {
            var f = b.document.createElement("div"),
                e = b.document.createElement("div");
            e.appendChild(f);
            f.innerHTML = this.text;
            f.style.fontSize = this.fontSize + "px";
            f.style.letterSpacing = "normal";
            return f
        },
        render: function (e, f) {
            e.save();
            this._render(e);
            if (!f && this.active) {
                this.drawBorders(e);
                this.hideCorners || this.drawCorners(e)
            }
            e.restore()
        },
        toObject: function () {
            return d(this.callSuper("toObject"), {
                text: this.text,
                fontSize: this.fontSize,
                fontWeight: this.fontWeight,
                fontFamily: this.fontFamily,
                fontStyle: this.fontStyle,
                lineHeight: this.lineHeight,
                textDecoration: this.textDecoration,
                textShadow: this.textShadow,
                textAlign: this.textAlign,
                path: this.path,
                strokeStyle: this.strokeStyle,
                strokeWidth: this.strokeWidth,
                backgroundColor: this.backgroundColor
            })
        },
        toSVG: function () {
            var h = this.text.split("\n"),
                i = -this._fontAscent - ((this._fontAscent / 5) * this.lineHeight),
                f = -(this.width / 2),
                e = (this.height / 2) - (h.length * this.fontSize) - this._totalLineHeight,
                g = this._getSVGTextAndBg(i, f, h),
                j = this._getSVGShadows(i, h);
            return ['<g transform="', this.getSvgTransform(), '">', g.textBgRects.join(""), "<text ", (this.fontFamily ? "font-family=\"'" + this.fontFamily + "'\" " : ""), (this.fontSize ? 'font-size="' + this.fontSize + '" ' : ""), (this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : ""), (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : ""), (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : ""), 'style="', this.getSvgStyles(), '" ', 'transform="translate(', f, " ", e, ')">', j.join(""), g.textSpans.join(""), "</text>", "</g>"].join("")
        },
        _getSVGShadows: function (l, k) {
            var n = [];
            for (var f = 0, e = this._shadows.length; f < e; f++) {
                for (var h = 0, g = k.length; h < g; h++) {
                    var m = (this._boundaries && this._boundaries[h]) ? this._boundaries[h].left : 0;
                    n.push('<tspan x="', m + this._shadowOffsets[f][0], (h === 0 ? '" y' : '" dy'), '="', l + (h === 0 ? this._shadowOffsets[f][1] : 0), '" fill="', this._shadows[f].color, '">', k[h], "</tspan>")
                }
            }
            return n
        },
        _getSVGTextAndBg: function (k, f, h) {
            var m = [],
                j = [];
            for (var g = 0, e = h.length; g < e; g++) {
                var l = (this._boundaries && this._boundaries[g]) ? this._boundaries[g].left : 0;
                m.push('<tspan x="', l, '" ', (g === 0 ? "y" : "dy"), '="', k, '">', h[g], "</tspan>");
                if (!this.backgroundColor) {
                    continue
                }
                j.push('<rect fill="', this.backgroundColor, '" x="', f + this._boundaries[g].left, '" y="', (k * g) - this.height / 2 + (this.lineHeight * 2.6), '" width="', this._boundaries[g].width, '" height="', this._boundaries[g].height, '"></rect>')
            }
            return {
                textSpans: m,
                textBgRects: j
            }
        },
        setColor: function (e) {
            this.set("fill", e);
            return this
        },
        setFontsize: function (e) {
            this.set("fontSize", e);
            this.setCoords();
            return this
        },
        getText: function () {
            return this.text
        },
        setText: function (e) {
            this.set("text", e);
            this.setCoords();
            return this
        },
        set: function (e, f) {
            if (typeof e == "object") {
                for (var g in e) {
                    this.set(g, e[g])
                }
            } else {
                this[e] = f;
                if (e === "fontFamily" && this.path) {
                    this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, "$1" + f + "$3")
                }
            }
            return this
        }
    });
    b.Text.fromObject = function (e) {
        return new b.Text(e.text, c(e))
    };
    b.Text.fromElement = function (e) {}
})(typeof exports != "undefined" ? exports : this);
(function () {
    if (typeof document != "undefined" && typeof window != "undefined") {
        return
    }
    var XML = require("o3-xml"),
        URL = require("url"),
        HTTP = require("http"),
        Canvas = require("canvas"),
        Image = require("canvas").Image;

    function request(url, encoding, callback) {
        var oURL = URL.parse(url),
            client = HTTP.createClient(80, oURL.hostname),
            request = client.request("GET", oURL.pathname, {
                host: oURL.hostname
            });
        client.addListener("error", function (err) {
            if (err.errno === process.ECONNREFUSED) {
                fabric.log("ECONNREFUSED: connection refused to " + client.host + ":" + client.port)
            } else {
                fabric.log(err.message)
            }
        });
        request.end();
        request.on("response", function (response) {
            var body = "";
            if (encoding) {
                response.setEncoding(encoding)
            }
            response.on("end", function () {
                callback(body)
            });
            response.on("data", function (chunk) {
                if (response.statusCode == 200) {
                    body += chunk
                }
            })
        })
    }
    fabric.util.loadImage = function (url, callback) {
        request(url, "binary", function (body) {
            var img = new Image();
            img.src = new Buffer(body, "binary");
            callback(img)
        })
    };
    fabric.loadSVGFromURL = function (url, callback) {
        url = url.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
        request(url, "", function (body) {
            var doc = XML.parseFromString(body);
            fabric.parseSVGDocument(doc.documentElement, function (results, options) {
                callback(results, options)
            })
        })
    };
    fabric.util.getScript = function (url, callback) {
        request(url, "", function (body) {
            eval(body);
            callback && callback()
        })
    };
    fabric.Image.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            var oImg = new fabric.Image(img);
            oImg._initConfig(object);
            oImg._initFilters(object);
            callback(oImg)
        })
    };
    fabric.createCanvasForNode = function (width, height) {
        var canvasEl = fabric.document.createElement("canvas"),
            nodeCanvas = new Canvas(width || 600, height || 600);
        canvasEl.style = {};
        canvasEl.width = nodeCanvas.width;
        canvasEl.height = nodeCanvas.height;
        var canvas = fabric.Canvas || fabric.StaticCanvas;
        var fabricCanvas = new canvas(canvasEl);
        fabricCanvas.contextContainer = nodeCanvas.getContext("2d");
        fabricCanvas.nodeCanvas = nodeCanvas;
        return fabricCanvas
    };
    fabric.StaticCanvas.prototype.createPNGStream = function () {
        return this.nodeCanvas.createPNGStream()
    };
    if (fabric.Canvas) {
        fabric.Canvas.prototype.createPNGStream
    }
    var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
    fabric.StaticCanvas.prototype.setWidth = function (width) {
        origSetWidth.call(this);
        this.nodeCanvas.width = width;
        return this
    };
    if (fabric.Canvas) {
        fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth
    }
    var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
    fabric.StaticCanvas.prototype.setHeight = function (height) {
        origSetHeight.call(this);
        this.nodeCanvas.height = height;
        return this
    };
    if (fabric.Canvas) {
        fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight
    }
})();
