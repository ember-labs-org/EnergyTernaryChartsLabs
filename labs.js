/* Ember Labs overlay for "A Three-Way View of Energy History" (Labs fork only).
 *
 * Loaded after Daan's app.js. Changes two things without editing his code:
 *
 * 1. Series colours follow Rey's Labs chart palette (charts.md): the categorical colours in
 *    fixed order, assigned in the order series are selected. World is the white reference
 *    line. Orange (categorical 4) is skipped: it's reserved for warnings. Series beyond the
 *    fifth are drawn in slate grey; the legend and point labels still name each one.
 * 2. A smaller default selection (World plus four), within Rey's guidance of about four
 *    lines at once. Visitors can still add any region or country.
 *
 * How: app.js reads each series' colour from COUNTRY_CONFIG whenever it redraws. Its
 * redraw functions are globals, so wrapping them here recolours before every redraw.
 */
(function () {
    'use strict';

    var REFERENCE = 'World';
    var REFERENCE_COLOUR = '#FFFFFF';                 // --el-white
    var SERIES = ['#FFC400', '#37A6E6', '#13CE74', '#C4D9E9', '#FFF4A3'];
                 // --el-chart-cat-1, -2, -3, -5, -6 (cat-4 orange reserved for warnings)
    var OVERFLOW = '#626E88';                         // --el-slate: sixth series onwards
    var UNSELECTED = '#626E88';                       // swatch in the list when not on the chart

    var DEFAULT_SELECTION = ['World', 'United States', 'China', 'India', 'Europe'];

    if (typeof COUNTRY_CONFIG === 'undefined' || typeof selectedCountries === 'undefined') return;

    // Smaller default view. app.js draws for the first time once its data has loaded,
    // which is after this script runs, so the chart opens with this selection.
    selectedCountries = new Set(DEFAULT_SELECTION.filter(function (n) { return n in COUNTRY_CONFIG; }));

    function setColour(name, colour) {
        COUNTRY_CONFIG[name].color = colour;
        if (typeof REGIONS_CONFIG !== 'undefined' && REGIONS_CONFIG[name]) REGIONS_CONFIG[name].color = colour;
        if (typeof COUNTRIES_CONFIG !== 'undefined' && COUNTRIES_CONFIG[name]) COUNTRIES_CONFIG[name].color = colour;
    }

    // Colours in selection order (a Set keeps the order items were added).
    function assignColours() {
        Object.keys(COUNTRY_CONFIG).forEach(function (n) { setColour(n, UNSELECTED); });
        var i = 0;
        selectedCountries.forEach(function (n) {
            if (!(n in COUNTRY_CONFIG)) return;
            if (n === REFERENCE) { setColour(n, REFERENCE_COLOUR); return; }
            setColour(n, i < SERIES.length ? SERIES[i] : OVERFLOW);
            i++;
        });
    }

    ['renderList', 'updateChart', 'renderLegend'].forEach(function (fn) {
        var original = window[fn];
        if (typeof original !== 'function') return;
        window[fn] = function () {
            assignColours();
            return original.apply(this, arguments);
        };
    });

    assignColours();
})();
