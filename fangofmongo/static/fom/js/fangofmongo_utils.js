/*
  Mongo convenctional helpers
*/

var ObjectId = function(s) {
    return {$oid: s};
};

/*
  Collection of fom utilities
*/

$.widget("ui.fom_utils", {
    _init: function() {
      // init code for mywidget
      // can use this.options
      this.active = false;

    },


    /*
    * add event handlers to dom resulted from call to format_mongo_json_data
    * params:
    *   node: dom node (class: fom_ui_json_data)
    *   options: dict of options
    */

    add_json_events:function (node, options)
    {
        if ('expand' in options && options['expand']){
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_value_document').show();
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').html('-');

        } else {
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_value_document').hide();
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').html('+');
        };
        
        $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').click(function()
            {
                $(this).next().next().toggle();
                $(this).html($(this).next().next().is(':visible')?'-':'+');
            }
        );
    },

    /*
    * format json value as html
    */
    render_json_value: function (value)
    {

        if (value == null)
        {
            return '<div class="fom_ui_json_value_null>null</div>';
        }

        switch(value.constructor.name)
        {
            case("Number"):
            case("Boolean"):
                return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">' + $('#fom_utils').fom_utils('escape_html', value+"") + '</div>';
            case("String"):
                return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">"' + $('#fom_utils').fom_utils('escape_html', value) + '"</div>';
            case("Array"):
            {
                resp = '<div class="fom_ui_json_value_array">[';
                for(var i in value)
                {
                    resp += this.render_json_value(value[i]);
                }               
                resp += ']</div>';
                return resp; 
            }
            case("Object"):
            {
                if ('$date' in value)
                    return '<div class="fom_ui_json_value_date">' + $.datepicker.formatDate('yy-mm-dd',  new Date(value['$date'])) + '</div>';
                    
                if ('$oid' in value)
                    return '<div class="fom_ui_json_value_oid">ObjectId("' + value['$oid'] + '")</div>';
                
                resp = '<div class="fom_ui_json_value_dict">{<br/>';
                for(var key in value)
                {
                    resp += '<div class="fom_ui_json_key">' + $('#fom_utils').fom_utils('escape_html', JSON.stringify(key)) + '</div>' + ' : ';
                    resp += this.render_json_value(value[key]) + '<br/>';
                }
                resp += '}</div><br/>';
                return resp;

            }
        };
        
    },


    format_mongo_json_data: function (json_data_array)
    /*
        Return json represented in html
    */
    {
        var resp = '<div class="fom_ui_json_data">';
        
        for(var i in json_data_array)
        {
            resp += '<div class="fom_ui_json_container">';

            resp += '<div class="fom_ui_json_toggle">+</div>';
            if(!('_id' in json_data_array[i]))
                resp += '<div class="fom_ui_json_value_missing">value missing</div>';
            else
                resp += '<div class="fom_ui_json_value_oid">' + (this.render_json_value(json_data_array[i]['_id'])) + '</div>';
            resp += '<div class="fom_ui_json_value_document">';
            
            for(var key in json_data_array[i])
            {
                resp += '<div class="fom_ui_json_key">' + $('#fom_utils').fom_utils('escape_html', JSON.stringify(key)) + '</div>' + ' : ';
                resp += this.render_json_value(json_data_array[i][key]);
                resp += '<br/>';
            }
            resp += '</div>'; //document
            resp += '</div>'; //container
        }
        resp += '</div>'; //fom_ui_json_data
        return resp;
    },

    /*
        Escape html characters
    */
    escape_html: function(html_text) 
    {
        return html_text.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    },
   
    //value: function(a) { return a; },
    //length: function ( ) { return this.listeners.length;  },
    active:  function ( ) { return this.active;  },


    destroy: function() {
        $.widget.prototype.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget
    }
 });



 $.extend($.ui.fom_utils, {
   getters: "value length",
   defaults: {
     active: false,
   }
 });
//end of fom_utils
