define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        template = require('hgn!main/templates/jira.issue_item');

    function toDate(ticks) {
        
        //ticks are in nanotime; convert to microtime
        var ticksToMicrotime = ticks / 10000;
        
        //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
        var epochMicrotimeDiff = 2208988800000;
        
        //new date is ticks, converted to microtime, minus difference from epoch microtime
        var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
        
        return tickDate;
    }
    
    function printDate(datetime, format) {
        var format = format,
            dateStr = format.replace('YYYY', padStr(datetime.getFullYear()))
                .replace('YY', ('' + datetime.getFullYear()).substr(2))
                .replace('MM', padStr(1 + datetime.getMonth()))
                .replace('M', 1 + datetime.getMonth())
                .replace('DD', padStr(datetime.getDate()))
                .replace('hh', padStr(datetime.getHours()))
                .replace('mm', padStr(datetime.getMinutes()))
                .replace('ss', padStr(datetime.getSeconds()));
            
        return dateStr;
    }

    function padStr(i) {
        return (i < 10) ? '0' + i : '' + i;
    }
                        
    return BB.View.extend({
        tagName: 'tr',
        initialize: function () {
        },
        appendTo: function ($el) {
            $el.append(this.$el);
            
            return this;
        },
        render: function () {
            var data = _.extend(this.model.toJSON(), {
                    updated: function () {
                        return function () {
                            var date = new Date(this.fields.updated);
                            return printDate(date, 'YYYY-MM-DD hh:mm:ss');
                        }
                    }
                }),
                html = template(data);

            this.$el.html(html);

            return this;
        }
    });
});
