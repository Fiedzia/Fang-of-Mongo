/*
 * jQuery Format Plugin v1.0
 * http://www.asual.com/jquery/format/
 *
 * Copyright (c) 2009 Rostislav Hristov
 * Uses code by Matt Kruse
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-12-23 14:25:22 +0200 (Wed, 23 Dec 2009)
 */
(function ($) {

    $.format = (function () {
        
        var UNDEFINED = 'undefined',
            TRUE = true,
            FALSE = false,
            _locale = {
                date: {
                    format: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                    monthsFull: ['January','February','March','April','May','June','July','August','September','October','November','December'],
                    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    daysFull: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                    daysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                    timeFormat: 'h:mm tt',
                    shortDateFormat: 'M/d/yyyy',
                    longDateFormat: 'dddd, MMMM dd, yyyy'
                },
                number: {
                    format: '#,##0.0#',
                    groupingSeparator: ',',
                    decimalSeparator: '.'
                }
            };
       
        return {
            
            locale: function(value) {
                a = {a: 6};
                if (value) {
                    for (var p in value) {
                        for (var v in value[p]) {
                            _locale[p][v] = value[p][v];
                        }
                    }
                }
                return _locale;
            },
            
            date: function(value, format) {

                if (typeof value == 'string') {
                    
                    var getNumber = function (str, p, minlength, maxlength) {
                        for (var x = maxlength; x >= minlength; x--) {
                            var token = str.substring(p, p + x);
                            if (token.length >= minlength && (new RegExp(/^\d+$/)).test(token)) {
                                return token;
                            }
                        }
                        return null;
                    };
                    
                    if (typeof format == UNDEFINED)
                        format = _locale.date.format;
                            
                    var _strict = false,
                    	i = 0,
                    	pos = 0,
                    	c = '',
                    	token = '',
                    	x, 
                    	y,
	                    now = new Date(),
	                    year = now.getYear(),
	                    month = now.getMonth() + 1,
	                    date = 1,
	                    hh = now.getHours(),
	                    mm = now.getMinutes(),
	                    ss = now.getSeconds(),
	                    SSS = now.getMilliseconds(),
	                    ampm = '';
                    
                    while (i < format.length) {
                        token = '';
                        c = format.charAt(i);
                        while ((format.charAt(i) == c) && (i < format.length)) {
                            token += format.charAt(i++);
                        }
                        if (token.indexOf('MMMM') > - 1 && token.length > 4) {
                            token = 'MMMM';
                        }
                        if (token.indexOf('EEEE') > - 1 && token.length > 4) {
                            token = 'EEEE';
                        }
                        if (token == 'yyyy' || token == 'yy' || token == 'y') {
                            if (token == 'yyyy') { 
                                x = 4; 
                                y = 4;
                            }
                            if (token == 'yy') {
                                x = 2;
                                y = 2;
                            }
                            if (token == 'y') {
                                x = 2;
                                y = 4;
                            }
                            year = getNumber(value, pos, x, y);
                            if (year == null) {
                                return 0;
                            }
                            pos += year.length;
                            if (year.length == 2) {
                                year = parseInt(year);
                                if (year > 70) {
                                    year = 1900 + year;
                                } else {
                                    year = 2000 + year;
                                }
                            }
                        } else if (token == 'MMMM'){
                            month = 0;
                            for (var j = 0, monthName; monthName = _locale.date.monthsFull[j]; j++) {
                                if (value.substring(pos, pos + monthName.length).toLowerCase() == monthName.toLowerCase()) {
                                    month = j + 1;
                                    pos += monthName.length;
                                    break;
                                }
                            }
                            if ((month < 1) || (month > 12)){
                                return 0;
                            }
                        } else if (token == 'MMM'){
                            month = 0;
                            for (var j = 0, monthName; monthName = _locale.date.monthsShort[j]; j++) {
                                if (value.substring(pos, pos + monthName.length).toLowerCase() == monthName.toLowerCase()) {
                                    month = j + 1;
                                    pos += monthName.length;
                                    break;
                                }
                            }
                            if ((month < 1) || (month > 12)){
                                return 0;
                            }
                        } else if (token == 'EEEE'){
                            for (var j = 0, dayName; dayName = _locale.date.daysFull[j]; j++) {
                                if (value.substring(pos, pos + dayName.length).toLowerCase() == dayName.toLowerCase()) {
                                    pos += dayName.length;
                                    break;
                                }
                            }        
                        } else if (token == 'EEE'){
                            for (var j = 0, dayName; dayName = _locale.date.daysShort[j]; j++) {
                                if (value.substring(pos, pos + dayName.length).toLowerCase() == dayName.toLowerCase()) {
                                    pos += dayName.length;
                                    break;
                                }
                            }
                        } else if (token == 'MM' || token == 'M') {
                            month = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (month == null || (month < 1) || (month > 12)){
                                return 0;
                            }
                            pos += month.length;
                        } else if (token == 'dd' || token == 'd') {
                            date = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (date == null || (date < 1) || (date > 31)){
                                return 0;
                            }
                            pos += date.length;
                        } else if (token == 'hh' || token == 'h') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh == null || (hh < 1) || (hh > 12)) {
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'HH' || token == 'H') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if(hh == null || (hh < 0) || (hh > 23)){
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'KK' || token == 'K') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh == null || (hh < 0) || (hh > 11)){
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'kk' || token == 'k') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh == null || (hh < 1) || (hh > 24)){
                                return 0;
                            }
                            pos += hh.length;
                            hh--;
                        } else if (token == 'mm' || token == 'm') {
                            mm = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (mm == null || (mm < 0) || ( mm > 59)) {
                                return 0;
                            }
                            pos += mm.length;
                        } else if (token == 'ss' || token == 's') {
                            ss = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (ss == null || (ss < 0) || (ss > 59)){
                                return 0;
                            }
                            pos += ss.length;
                        } else if (token == 'SSS' || token == 'SS' || token == 'S') {
                            SSS = getNumber(value, pos, _strict ? token.length : 1, 3);
                            if (SSS == null || (SSS < 0) || (SSS > 999)){
                                return 0;
                            }
                            pos += SSS.length;
                        } else if (token == 'a') {
                            var ap = value.substring(pos, pos + 2).toLowerCase();
                            if (ap == 'am') {
                                ampm = 'AM';
                            } else if (ap == 'pm') {
                                ampm = 'PM';
                            } else {
                                return 0;
                            }
                            pos += 2;
                        } else {
                            if (token != value.substring(pos, pos + token.length)) {
                                return 0;
                            } else {
                                pos += token.length;
                            }
                        }
                    }
                    if (pos != value.length) {
                        return 0;
                    }
                    if (month == 2) {
                        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                            if (date > 29){ 
                                return 0;
                            }
                        } else {
                            if (date > 28) {
                                return 0; 
                            } 
                        }
                    }
                    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                        if (date > 30) {
                            return 0;
                        }
                    }
                    if (hh < 12 && ampm == 'PM') {
                        hh = hh - 0 + 12;
                    } else if (hh > 11 && ampm == 'AM') {
                        hh -= 12;
                    }
                    
                    return (new Date(year, month - 1, date, hh, mm, ss, SSS));                    
                    
                } else {
                    
                    var formatNumber = function (n, s) {
                        if (typeof s == 'undefined' || s == 2) {
                          return (n >= 0 && n < 10 ? '0' : '') + n;
                        } else {
                            if (n >= 0 && n < 10) {
                               return '00' + n; 
                            }
                            if (n >= 10 && n <100) {
                               return '0' + n;
                            }
                            return n;
                        }
                    }
                    
                    if (typeof format == UNDEFINED) {
                        format = _locale.date.format;
                    }
                    
                    var y = value.getYear();
                    if (y < 1000) {
                        y = String(y + 1900);
                    }
                    
                    var M = value.getMonth() + 1;
                    var d = value.getDate();
                    var E = value.getDay();
                    var H = value.getHours();
                    var m = value.getMinutes();
                    var s = value.getSeconds();
                    var S = value.getMilliseconds();
                    
                    var value = new Object();
                    value['y'] = y;
                    value['yyyy'] = y;
                    value['yy'] = String(y).substring(2, 4);
                    value['M'] = M;
                    value['MM'] = formatNumber(M);
                    value['MMM'] = _locale.date.monthsShort[M-1];
                    value['MMMM'] = _locale.date.monthsFull[M-1];
                    value['d'] = d;
                    value['dd'] = formatNumber(d);
                    value['EEE'] = _locale.date.daysShort[E];
                    value['EEEE'] = _locale.date.daysFull[E];
                    value['H'] = H;
                    value['HH'] = formatNumber(H);
                    
                    if (H == 0){
                        value['h'] = 12;
                    } else if (H > 12){
                        value['h'] = H - 12;
                    } else {
                        value['h'] = H;
                    }
                    
                    value['hh'] = formatNumber(value['h']);
                    value['k'] = H + 1;
                    value['kk'] = formatNumber(value['k']);
                    
                    if (H > 11){
                        value['K'] = H - 12;
                    } else {
                        value['K'] = H;
                    }
                    
                    value['KK'] = formatNumber(value['K']);
                    
                    if (H > 11) {
                        value['a'] = 'PM';
                    } else {
                        value['a'] = 'AM';
                    }
                    
                    value['m'] = m;
                    value['mm'] = formatNumber(m);
                    value['s'] = s;
                    value['ss'] = formatNumber(s);
                    value['S'] = S;
                    value['SS'] = formatNumber(S);
                    value['SSS'] = formatNumber(S, 3);
                
                    var i = 0;
                    var c = '';
                    var token = '';
                    var result = '';
                    var s = false;
                    
                    while (i < format.length) {
                        token = '';   
                        c = format.charAt(i);
                        if (c == '\'') {
                        	i++;
                        	if (format.charAt(i) == c) {
                        		result = result + c;
                        		i++;
                        	} else {
                        		s = !s;
                        	}
                        } else {
	                        while (format.charAt(i) == c) {
	                            token += format.charAt(i++);
	                        }
	                        if (token.indexOf('MMMM') > - 1 && token.length > 4) {
	                            token = 'MMMM';
	                        }
	                        if (token.indexOf('EEEE') > - 1 && token.length > 4) {
	                            token = 'EEEE';
	                        }
	                        if (value[token] != null && !s) {
	                            result = result + value[token];
	                        } else {
	                            result = result + token;
	                        }
                        }
                    }
                    return result;                    
                }
            },
            
            number: function(value, format) {
                
                if (typeof value == 'string') {
                    
                    var groupingSeparator = _locale.number.groupingSeparator,
                    	decimalSeparator = _locale.number.decimalSeparator,
                    	decimalIndex = value.indexOf(decimalSeparator),
                    	roundFactor = 1;
                
                    if (decimalIndex != -1) {
                        roundFactor = Math.pow(10, value.length - decimalIndex - 1);
                    }
                    
                    value = value.replace(new RegExp('[' + groupingSeparator + ']', 'g'), '');
                    value = value.replace(new RegExp('[' + decimalSeparator + ']'), '.');
                    
                    return (parseInt(value*roundFactor))/roundFactor;                    
                    
                } else {
                    
                    if (typeof format == UNDEFINED || format.length < 1) {
                        format = _locale.number.format;
                    }
                    
                    var integer = '',
                    	fraction = '',
                    	groupingSeparator = ',',
                    	groupingIndex = format.lastIndexOf(groupingSeparator),
                    	decimalSeparator = '.',
                    	decimalIndex = format.indexOf(decimalSeparator);
        
                    if (decimalIndex != -1) {
                        var fraction = _locale.number.decimalSeparator,
                        	minFraction = format.substr(decimalIndex + 1).replace(/#/g, '').length,
                        	maxFraction = format.substr(decimalIndex + 1).length;
                        if (maxFraction > 0) {
                            var powFraction = Math.pow(10, maxFraction),
                            	roundFactor = 1000,
                            	tempFraction = String(Math.round(parseInt(value * powFraction * roundFactor - 
                            			parseInt(value) * powFraction * roundFactor) / roundFactor)),
                            	parts = value.toString().split('.');
                            if (typeof parts[1] != UNDEFINED) {
                                for (var i = 0; i < parts[1].length; i++) {
                                    if (parts[1].substr(i, 1) == '0') {
                                        tempFraction = '0' + tempFraction;
                                    } else {
                                        break;
                                    }
                                }
                            }
                            for (var i = 0; i < (maxFraction - fraction.length); i++) {
                                tempFraction += '0';
                            }
                            var symbol, 
                            	formattedFraction = '';
                            for (var i = 0; i < tempFraction.length; i++) {
                                symbol = tempFraction.substr(i, 1);
                                if (i >= minFraction && symbol == '0') {
                                    break;
                                }
                                formattedFraction += symbol;
                            }
                            fraction += formattedFraction;
                        }
                        if (fraction == _locale.number.decimalSeparator) {
                            fraction = '';
                        }
                    }
                    
                    if (decimalIndex != 0) {
                        if (fraction != '') {
                            integer = String(Math.floor(value));            
                        } else {
                            integer = String(Math.round(value));
                        }
                        var grouping = _locale.number.groupingSeparator,
                        	groupingSize = 0;
                        if (groupingIndex != -1) {
                            if (decimalIndex != -1) {
                                groupingSize = decimalIndex - groupingIndex;
                            } else {
                                groupingSize = format.length - groupingIndex;
                            }
                            groupingSize--;
                        }
                        if (groupingSize > 0) {
                            var count = 0, 
                            	formattedInteger = '',
                            	i = integer.length;
                            while (i--) {
                                if (count != 0 && count % groupingSize == 0) {
                                    formattedInteger = grouping + formattedInteger;    
                                }
                                formattedInteger = integer.substr(i, 1) + formattedInteger;
                                count++;
                            }
                            integer = formattedInteger;
                        }
                        var maxInteger;
                        if (decimalIndex != -1) {
                            maxInteger = format.substr(0, decimalIndex).replace(new RegExp('#|' + grouping, 'g'), '').length;
                        } else {
                            maxInteger = format.replace(new RegExp('#|' + grouping, 'g'), '').length;                
                        }
                        var tempInteger = integer.length;
                        for (var i = tempInteger; i < maxInteger; i++) {
                            integer = '0' + integer;
                        }                
                    }
                    result = integer + fraction;
                    return result;                    
                }
            }
        };        
    })();
   
}(jQuery));