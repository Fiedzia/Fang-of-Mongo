function escape_html(html_text)
/*
    Escape html characters
*/
{
    return html_text.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
}
