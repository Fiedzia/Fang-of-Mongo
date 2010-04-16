/*
  Mongo convenctional helpers
*/

var ObjectId = function(s) {
    return {$oid: s};
};



function escape_html(html_text)
/*
    Escape html characters
*/
{
    return html_text.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
}



function add_json_events(node, options)
/*
 * add event handlers to dom resulted from call to format_mongo_json_data
 * params:
 *   node: dom node (class: fom_ui_json_data)
 *   options: dict of options
 */
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
}



function render_json_value(value)
/*
 * format json value as html
 */
{

    if (value == null)
    {
        return '<div class="fom_ui_json_value_null>null</div>';
    }

    switch(value.constructor.name)
    {
        case("Number"):
        case("Boolean"):
            return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">' + escape_html(value+"") + '</div>';
        case("String"):
            return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">"' + escape_html(value) + '"</div>';
        case("Array"):
        {
            resp = '<div class="fom_ui_json_value_array">[';
            for(var i in value)
            {
                resp += render_json_value(value[i]);
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
                resp += '<div class="fom_ui_json_key">' + escape_html(JSON.stringify(key)) + '</div>' + ' : ';
                resp += render_json_value(value[key]) + '<br/>';
            }
            resp += '}</div><br/>';
            return resp;

        }
    };
    
}

function format_mongo_json_data(json_data_array)
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
            resp += '<div class="fom_ui_json_value_oid">' + (render_json_value(json_data_array[i]['_id'])) + '</div>';
        resp += '<div class="fom_ui_json_value_document">';
        
        for(var key in json_data_array[i])
        {
            resp += '<div class="fom_ui_json_key">' + escape_html(JSON.stringify(key)) + '</div>' + ' : ';
            resp += render_json_value(json_data_array[i][key]);
            resp += '<br/>';
        }
        resp += '</div>'; //document
        resp += '</div>'; //container
    }
    resp += '</div>'; //fom_ui_json_data
    return resp;
}