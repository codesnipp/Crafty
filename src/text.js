/**@
 * #Text
 * @category Graphics
 * @trigger Change - when the text is changed
 * @requires Canvas or DOM
 * Component to make a text entity.
 *
 * By default, text will have the style "10px sans-serif".
 *
 * Note 1: An entity with the text component is just text! If you want to write text
 * inside an image, you need one entity for the text and another entity for the image.
 * More tips for writing text inside an image: (1) Use the z-index (from 2D component)
 * to ensure that the text is on top of the image, not the other way around; (2)
 * use .attach() (from 2D component) to glue the text to the image so they move and
 * rotate together.
 *
 * Note 2: For DOM (but not canvas) text entities, various font settings (like
 * text-decoration and text-align) can be set using `.css()` (see DOM component). But
 * you cannot use `.css()` to set the properties which are controlled by `.textFont()`
 * or `.textColor()` -- the settings will be ignored.
 */
Crafty.c("Text", {
    _text: "",
    defaultSize: "10px",
    defaultFamily: "sans-serif",
    ready: true,

    init: function () {
        this.requires("2D");
        this._textFont = {
            "type": "",
            "weight": "",
            "size": "",
            "family": ""
        };

        this.bind("Draw", function (e) {
            var font = this._textFont["type"] + ' ' + this._textFont["weight"] + ' ' + (this._textFont["size"] || this.defaultSize) + ' ' + (this._textFont["family"] || this.defaultFamily);

            if (e.type === "DOM") {
                var el = this._element,
                    style = el.style;

                style.color = this._textColor;
                style.font = font;
                el.innerHTML = this._text;
            } else if (e.type === "canvas") {
                var context = e.ctx,
                    metrics = null;

                context.save();

                context.fillStyle = this._textColor || "rgb(0,0,0)";
                context.font = font;

                context.translate(this.x, this.y + this.h);
                context.fillText(this._text, 0, 0);

                metrics = context.measureText(this._text);
                this._w = metrics.width;

                context.restore();
            }
        });
    },

    /**@
     * #.text
     * @comp Text
     * @sign public this .text(String text)
     * @sign public this .text(Function textgenerator)
     * @param text - String of text that will be inserted into the DOM or Canvas element.
     *
     * This method will update the text inside the entity.
     *
     * If you need to reference attributes on the entity itself you can pass a function instead of a string.
     *
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
     *
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 })
     *     .text(function () { return "My position is " + this._x });
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 })
     *     .text(function () { return "My position is " + this._x });
     * ~~~
     */
    text: function (text) {
        if (!(typeof text !== "undefined" && text !== null)) return this._text;
        if (typeof (text) == "function")
            this._text = text.call(this);
        else
            this._text = text;
        this.trigger("Change");
        return this;
    },

    /**@
     * #.textColor
     * @comp Text
     * @sign public this .textColor(String color, Number strength)
     * @param color - The color in hexadecimal
     * @param strength - Level of opacity
     *
     * Modify the text color and level of opacity.
     *
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!")
     *   .textColor('#FF0000');
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text('Look at me!!')
     *   .textColor('#FF0000', 0.6);
     * ~~~
     * @see Crafty.toRGB
     */
    textColor: function (color, strength) {
        this._strength = strength;
        this._textColor = Crafty.toRGB(color, this._strength);
        this.trigger("Change");
        return this;
    },

    /**@
     * #.textFont
     * @comp Text
     * @triggers Change
     * @sign public this .textFont(String key, * value)
     * @param key - Property of the entity to modify
     * @param value - Value to set the property to
     *
     * @sign public this .textFont(Object map)
     * @param map - Object where the key is the property to modify and the value as the property value
     *
     * Use this method to set font property of the text entity.
     *
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").textFont({ type: 'italic', family: 'Arial' });
     * Crafty.e("2D, Canvas, Text").textFont({ size: '20px', weight: 'bold' });
     *
     * Crafty.e("2D, Canvas, Text").textFont("type", "italic");
     * Crafty.e("2D, Canvas, Text").textFont("type"); // italic
     * ~~~
     */
    textFont: function (key, value) {
        if (arguments.length === 1) {
            //if just the key, return the value
            if (typeof key === "string") {
                return this._textFont[key];
            }

            if (typeof key === "object") {
                for (propertyKey in key) {
                    this._textFont[propertyKey] = key[propertyKey];
                }
            }
        } else {
            this._textFont[key] = value;
        }

        this.trigger("Change");
        return this;
    },
    /**@
     * #.unselectable
     * @comp Text
     * @triggers Change
     * @sign public this .unselectable()
     *
     * This method sets the text so that it cannot be selected (highlighted) by dragging.
     * (Canvas text can never be highlighted, so this only matters for DOM text.)
     * Works by changing the css property "user-select" and its variants.
     *
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").text('This text cannot be highlighted!').unselectable();
     * ~~~
     */
    unselectable: function () {
        // http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting
        if (this.has("DOM")) {
            this.css({
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            });
            this.trigger("Change");
        }
        return this;
    }

});