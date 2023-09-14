/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'fa-search': '&#xf002;',
            'close': '&#xf00d;',
            'chain': '&#xf0c1;',
            'external-link': '&#xf08e;',
            'list-ul': '&#xf0ca;',
            'fa-calendar': '&#xf073;',
            'arrow-left': '&#xf060;',
            'arrow-right': '&#xf061;',
            'arrow-up': '&#xf062;',
            'arrow-down': '&#xf063;',
            'chevron-up': '&#xf077;',
            'chevron-down': '&#xf078;',
            'chevron-left': '&#xf053;',
            'chevron-right': '&#xf054;',
            'linkedin-square': '&#xf08c;',
            'facebook': '&#xf09a;',
            'linkedin': '&#xf0e1;',
            'youtube': '&#xf16a;',
            'instagram': '&#xf16d;',
            'tumblr': '&#xf173;',
            'apple': '&#xf179;',
            'trash': '&#xf1f8;',
            'trash-o': '&#xf014;',
            'fa-shopping-cart': '&#xf07a;',
            'skyscraper': '&#xe94e;',
            'office-building': '&#xe95b;',
            'hotel': '&#xe958;',
            'house-alt4': '&#xe906;',
            'house4': '&#xe906;',
            'house-alt3': '&#xe959;',
            'house3': '&#xe959;',
            'house-alt2': '&#xe907;',
            'house2': '&#xe907;',
            'house-alt1': '&#xe952;',
            'house1': '&#xe952;',
            'house': '&#xe9c9;',
            'loan': '&#xe95a;',
            'buy': '&#xe94f;',
            'sale': '&#xe95e;',
            'rent': '&#xe95d;',
            'growth': '&#xe919;',
            'certification': '&#xe950;',
            'check-list': '&#xe951;',
            'exchange-keys': '&#xe953;',
            'exchange-house': '&#xe954;',
            'for-sale': '&#xe955;',
            'mortgage': '&#xe91a;',
            'property': '&#xe95c;',
            'podium': '&#xe960;',
            'ticket': '&#xe961;',
            'dumbell': '&#xe962;',
            'sport': '&#xe963;',
            'football': '&#xe964;',
            'cup': '&#xe970;',
            'trophy': '&#xe965;',
            'yoga': '&#xe966;',
            'badge': '&#xe967;',
            'contacts': '&#xe969;',
            'for-rent': '&#xe96a;',
            'party-hat': '&#xe96b;',
            'partyhat': '&#xe96b;',
            'paint-palette': '&#xe96c;',
            'boss': '&#xe96d;',
            'whistle': '&#xe96e;',
            'mortarboard': '&#xe96f;',
            'puzzle': '&#xe971;',
            'certificate': '&#xe972;',
            'theater': '&#xe973;',
            'paintbrush': '&#xe974;',
            'microscope': '&#xe975;',
            'greenhouse': '&#xe976;',
            'gardening': '&#xe977;',
            'baseball': '&#xe978;',
            'pilates-ball': '&#xe900;',
            'stars': '&#xe901;',
            'tennis': '&#xe902;',
            'lotus-flower': '&#xe908;',
            'lotus': '&#xe908;',
            'family': '&#xe909;',
            'offer': '&#xe90b;',
            'aquatics': '&#xe90a;',
            'swimming': '&#xe90c;',
            'swimming-pool': '&#xe915;',
            'pool': '&#xe915;',
            'university': '&#xe90d;',
            'lifeguard-chair': '&#xe90e;',
            'sneakers': '&#xe90f;',
            'team': '&#xe910;',
            'strength-training': '&#xe911;',
            'lifebuoy': '&#xe912;',
            'star-of-david': '&#xe913;',
            'exercise': '&#xe914;',
            'confetti': '&#xe916;',
            'fitness': '&#xe917;',
            'balloons': '&#xe918;',
            'basketball-hoop': '&#xe91b;',
            'in-person': '&#xe91c;',
            'baby-boy': '&#xe91d;',
            'map-marked': '&#xe91e;',
            'abc-block': '&#xe91f;',
            'ruler': '&#xe920;',
            'brother': '&#xe921;',
            'children': '&#xe922;',
            'grandfather': '&#xe923;',
            'microphone': '&#xe924;',
            'color-palette': '&#xe925;',
            'snowflake': '&#xe926;',
            'sun': '&#xe927;',
            'autumn': '&#xe928;',
            'flowers': '&#xe930;',
            'butterfly': '&#xe904;',
            '24-hours-support': '&#xe9a1;',
            'headphone': '&#xe98f;',
            'settings': '&#xe9c6;',
            'tools': '&#xe991;',
            'support': '&#xe9a2;',
            'like': '&#xe9bc;',
            'promotion': '&#xe98c;',
            'telephone': '&#xe9ba;',
            'shield': '&#xe9bd;',
            'alert': '&#xe9b3;',
            'question': '&#xe9b2;',
            'bubble-chat': '&#xe99f;',
            'speech-bubble': '&#xe994;',
            'faqs': '&#xe9a0;',
            'chat': '&#xe9bb;',
            'conversation': '&#xe982;',
            'meeting': '&#xe93a;',
            'round-table': '&#xe98d;',
            'collaboration': '&#xe945;',
            'business-meeting': '&#xe97e;',
            'employee': '&#xe93c;',
            'deal': '&#xe93d;',
            'handshake': '&#xe938;',
            'membership': '&#xe93b;',
            'analysis': '&#xe934;',
            'clipboard': '&#xe92d;',
            'market-growth': '&#xe989;',
            'proofreading': '&#xe933;',
            'presentation': '&#xe93f;',
            'fluctuation': '&#xe984;',
            'goal': '&#xe943;',
            'analytics': '&#xe942;',
            'chart': '&#xe9a5;',
            'analyze': '&#xe946;',
            'report': '&#xe9a7;',
            'stats': '&#xe940;',
            'archive': '&#xe94b;',
            'idea': '&#xe94d;',
            'arrows': '&#xe947;',
            'coins': '&#xe939;',
            'contract': '&#xe9c3;',
            'document': '&#xe932;',
            'file': '&#xe931;',
            'newspaper': '&#xe98a;',
            'branding': '&#xe985;',
            'degree': '&#xe9a4;',
            'letter': '&#xe9c5;',
            'briefcase': '&#xe97d;',
            'cale': '&#xe92c;',
            'clock': '&#xe999;',
            'upload': '&#xe995;',
            'download': '&#xe996;',
            'coronavirus': '&#xe981;',
            'donation': '&#xe97f;',
            'favorite': '&#xe9a8;',
            'green-energy': '&#xe980;',
            'hand': '&#xe9a3;',
            'heart': '&#xe9c0;',
            'heart-hand': '&#xe98b;',
            'house-key': '&#xe92f;',
            'housekey': '&#xe92f;',
            'inauguration': '&#xe98e;',
            'lock': '&#xe99c;',
            'laptop': '&#xe99b;',
            'monitor': '&#xe94a;',
            'social-media': '&#xe9bf;',
            'media': '&#xe9c7;',
            'map': '&#xe998;',
            'network': '&#xe9c2;',
            'camera': '&#xe99a;',
            'map-marker': '&#xe9b8;',
            'image': '&#xe9b0;',
            'relocation': '&#xe903;',
            'search': '&#xe92e;',
            'send-mail': '&#xe9b9;',
            'tshirt': '&#xe92b;',
            'store': '&#xe99d;',
            'box': '&#xe986;',
            'delete': '&#xe979;',
            'shopping-card': '&#xe9c4;',
            'shopping-basket': '&#xe9be;',
            'shipped': '&#xe987;',
            'sketch': '&#xe983;',
            'sustainability': '&#xe937;',
            'travel': '&#xe948;',
            'tv-screen': '&#xe988;',
            'podcast': '&#xe997;',
            'video-camera': '&#xe9c8;',
            'clapperboard': '&#xe992;',
            'video': '&#xe993;',
            'smartphone': '&#xe936;',
            'website': '&#xe935;',
            'world-grid': '&#xe9b6;',
            'worldwide': '&#xe944;',
            'star-alt': '&#xe9c1;',
            'menu': '&#xe9b7;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/af-icon/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
