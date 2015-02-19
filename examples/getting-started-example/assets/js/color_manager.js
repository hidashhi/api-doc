/**
 * Hidashhi - Basic integration example.
 *
 * For documentation and more examples see: http://github.com/hidashhi
 *
 *
 * (c) 2014 Hidashhi
 * THIS WORK ‘AS-IS’ WE PROVIDE.
 * NO WARRANTY EXPRESS OR IMPLIED.
 * WE’VE DONE OUR BEST, TO DEBUG AND TEST.
 * LIABILITY FOR DAMAGES DENIED.
 *
 * PERMISSION IS GRANTED HEREBY, TO COPY, SHARE, AND MODIFY.
 * USE AS IS FIT, FREE OR FOR PROFIT.
 * THESE RIGHTS, ON THIS NOTICE, RELY.
 */

/**
 * @class $hi.colorManager
 * Color manager - keeps colors assigned to each participant
 */
var $hi = $hi || {};
(function (){

    // List of the colors which can be assigned to the participants
    var colors = ["#FF0010", "#0075DC", "#993F00", "#4C005C", "#2BCE48",
        "#FFCC99", "#94FFB5", "#8F7C00", "#9DCC00", "#C20088", "#003380",
        "#FFA405", "#FFA8BB", "#005C31", "#0075DC"];

    // Dictionary of colors actually assigned to the participants,
    // participant_id is the key.
    var participant_color = [];

    /**
     * Get a color assigned to the participant
     * @param participant_id - participant id
     * @return string, color in web format, e.g. "#0075DC"
     */
    var getColor = function(participant_id) {
        if (typeof participant_color[participant_id] == 'undefined') {
            participant_color[participant_id] = colors.pop();
        }
        return participant_color[participant_id];
    };

    /**
     * Get a color assigned to the me
     * @return string, color in web format, e.g. "#FF0010"
     */
    var getMyColor = function() {
        return colors[0];
    };

    $hi.colorManager = {
        'getColor': getColor,
        'getMyColor': getMyColor
    };
})();