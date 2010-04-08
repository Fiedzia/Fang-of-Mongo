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



function render_value(value)
{

    if (value == null)
    {
        return '<div class="fom_ui_json_value_null>null</div>';
    }

    switch(value.constructor.name)
    {
        case("Number"):
        case("Boolean"):
        case("String"):
            return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">' + escape_html(JSON.stringify(value)) + '</div>';
        case("Array"):
        {
            resp = '<div class="fom_ui_json_value_array">';
            for(var i in value)
            {
                resp += render_value(value[i]);
            }               
            resp += '</div>';
            return resp; 
        }
        case("Object"):
        {
            if ('$date' in value) return '<div class="fom_ui_json_value_date">' + $.datepicker.formatDate('yy-mm-dd',  new Date(value['$date'])) + '</div>';
            else if ('$oid' in value) return '<div class="fom_ui_json_value_oid">ObjectId("' + value['$oid'] + '")</div>';
            
            resp = '<div class="fom_ui_json_value_dict">';
            for(var key in value)
            {
                resp += '<div class="fom_ui_json_key">' + escape_html(JSON.stringify(key)) + '</div>' + ' -&gt; ';
                resp += render_value(value[key]);
            }
            resp += '</div>';
            return resp;

        }
    };
    
}

function format_mongo_json_data(json_data_array)
/*
    Return nicely formatted mongo data
*/
{
    var resp = '<div class="fom_ui_json_data">';
    //return JSON.stringify(json_data_array, null, 4);
    for(var i in json_data_array)
    {
        resp += '<div class="fom_ui_json_container">';
        //resp += '<div class="fom_ui_json_toggle" onclick="$(this).next().next().toggle(); $(this).html($(this).next().next().is(\':visible\')?\'-\':\'+\');">+</div>';
        resp += '<div class="fom_ui_json_toggle">+</div>';
        resp += '<div class="fom_ui_json_value_oid">' + escape_html(JSON.stringify(json_data_array[i]['_id']['$oid'])) + '</div>';
        resp += '<div class="fom_ui_json_value_document">';
        
        for(var key in json_data_array[i])
        {
            resp += '<div class="fom_ui_json_key">' + escape_html(JSON.stringify(key)) + '</div>' + ' -&gt; ';
            resp += render_value(json_data_array[i][key]);
            resp += '<br/>';
        }
        resp += '</div>'; //document
        resp += '</div>'; //container
    }
    resp += '</div>'; //fom_ui_json_data
    return resp;
}