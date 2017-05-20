Ext.define('ArrivalKillCalculator', {

    config: {
        bucketBy: ''
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    prepareChartData: function(store) {
        var arrivalData = this._groupData(store.getRange(), 'CreationDate'),
            closedDefects = _.filter(store.getRange(), function(record) { return !!record.get('ClosedDate'); }),
            killData = this._groupData(closedDefects, 'ClosedDate'),
            categories = _.keys(arrivalData),
            arrivalSeries = { name: 'Arrival', type: 'column', data: [] },
            killSeries = { name: 'Kill', type: 'column', data: [] };

        _.each(categories, function(category) {
            var arrivalGroup = arrivalData[category] || [],
                killGroup = killData[category] || [];
            arrivalSeries.data.push(arrivalGroup.length);
            killSeries.data.push(killGroup.length);
        }, this);

        return {
            categories: categories,
            series: [arrivalSeries, killSeries]
        };
    },

    _groupData: function(records, field) {
        return _.groupBy(records, function(record) {
            if (this.bucketBy === 'week') {
                return moment(record.get(field)).startOf('week').format('MMM D');
            } else if (this.bucketBy === 'month') {
                return moment(record.get(field)).startOf('month').format('MMM \'YY');
            }
        }, this);
    }
});
