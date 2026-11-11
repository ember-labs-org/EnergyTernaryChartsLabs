/* Ember Labs event tracking for "A Three-Way View of Energy History" (Labs fork only).
 *
 * Uses Umami (cookieless, no personal data), loaded in index.html. This file watches the
 * page and reports the events below; it doesn't touch Daan's code. If Umami is blocked or
 * missing, nothing happens and the tool works as normal. Every event carries
 * tool: 'energy-ternary-chart'. Event names follow the draft Labs vocabulary.
 *
 * Only real visitor actions count: the speed buttons restart playback by "clicking" Play
 * in code, and those script-made clicks are ignored.
 *
 * Events
 *   setting_changed   {setting, value}  energy_type (final, useful), trail (annual, 5_year),
 *                                        speed (1, 2, 5)
 *   option_toggled    {option, on}      a region or country added to or removed from the
 *                                        chart; option 'all' for Select all
 *   animation_played / animation_paused {}
 *   slider_set        {control, value}  control 'year'; on release
 *   point_inspected   {series}          hovering a series' current point (once per series
 *                                        per 5 s)
 */
(function () {
    'use strict';

    var TOOL = 'energy-ternary-chart';

    function track(name, data) {
        try {
            if (!window.umami || typeof window.umami.track !== 'function') return;
            var payload = { tool: TOOL };
            if (data) Object.keys(data).forEach(function (k) {
                if (data[k] !== undefined && data[k] !== null && data[k] !== '') payload[k] = data[k];
            });
            window.umami.track(name, payload);
        } catch (e) { /* never let tracking break the tool */ }
    }
    window.labsTrack = track;

    // (__labsTrackUntrusted exists only so automated tests can simulate clicks.)
    function byVisitor(e) { return e.isTrusted !== false || window.__labsTrackUntrusted === true; }
    function text(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

    document.addEventListener('click', function (e) {
        if (!byVisitor(e)) return;
        var t = e.target;
        if (!t || !t.closest) return;
        var el;

        if (t.closest('#btn-final')) return track('setting_changed', { setting: 'energy_type', value: 'final' });
        if (t.closest('#btn-useful')) return track('setting_changed', { setting: 'energy_type', value: 'useful' });
        if (t.closest('#btn-annual')) return track('setting_changed', { setting: 'trail', value: 'annual' });
        if (t.closest('#btn-smooth')) return track('setting_changed', { setting: 'trail', value: '5_year' });
        if ((el = t.closest('.speed-btn'))) return track('setting_changed', { setting: 'speed', value: parseFloat(text(el)) || undefined });

        if (t.closest('#play-pause-btn')) {
            // Runs before app.js flips its state, so the current state says which was pressed.
            var playing = (typeof isPlaying !== 'undefined') ? isPlaying : false;
            return track(playing ? 'animation_paused' : 'animation_played');
        }

        if (t.closest('.select-all-btn')) {
            setTimeout(function () {
                var all = (typeof selectedCountries !== 'undefined' && typeof COUNTRY_CONFIG !== 'undefined')
                    ? selectedCountries.size === Object.keys(COUNTRY_CONFIG).length : undefined;
                track('option_toggled', { option: 'all', on: all });
            }, 0);
            return;
        }

        if ((el = t.closest('.region-item'))) {
            var name = text(el.querySelector('span'));
            setTimeout(function () {
                var on = (typeof selectedCountries !== 'undefined') ? selectedCountries.has(name) : undefined;
                track('option_toggled', { option: name, on: on });
            }, 0);
        }
    }, true);

    document.addEventListener('change', function (e) {
        if (!byVisitor(e)) return;
        if (e.target && e.target.id === 'year-slider') {
            track('slider_set', { control: 'year', value: Number(e.target.value) });
        }
    }, true);

    // Hovering a series' current point opens its tooltip: count it once per series per 5 s.
    var lastHover = {};
    document.addEventListener('mouseover', function (e) {
        if (!byVisitor(e)) return;
        var pt = e.target && e.target.closest ? e.target.closest('.country-point') : null;
        if (!pt) return;
        var d = pt.__data__;
        var series = d && d.country;
        var now = Date.now();
        if (!series || (lastHover[series] && now - lastHover[series] < 5000)) return;
        lastHover[series] = now;
        track('point_inspected', { series: series });
    }, true);
})();
