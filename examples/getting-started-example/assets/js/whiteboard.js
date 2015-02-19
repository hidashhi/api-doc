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
 * @class $hi.whiteboards
 * Whiteboard - class responsible for drawing above participant's face
 */
var $hi = $hi || {};
(function (){
    // Previous mouse position, screen coordinates
    var prevX = 0;
    var prevY = 0;

    // Canvas size in pixels
    var CANVAS_WIDTH = screen.width;
    var CANVAS_HEIGHT = screen.height;

    // Lis of call participants
    var participants = [];
    var contexts = []; // canvas contexts, participant id as an index

    // Draw message encoder/decoder (draw coordinates to/from string format)
    var MessageEncoder = {
        /**
         * Encode draw coordinates into the string message to be sent over
         * the data chanel
         * @param target_participant_id - participant on who's face the drawing
         *        is being performed
         * @param x1, y1, x2, y2 - drawing coordinates (float in range 0..1)
         * @return message in string format
         */
        encode: function(target_participant_id, x1, y1, x2, y2) {
            return JSON.stringify([target_participant_id, x1, y1, x2, y2]);
        },

        /**
         * Decode string message received throught the data channel into
         * drawing coordinates
         * @param message_string
         * @return object with the following fields:
         *      - target_participant_id - id of participant on who's face
         *        the drawing was performed
         *      - x1, y1, x2, y2 - coordinates (float in 0..1 range)
         */
        decode: function(message_string) {
            var parts = JSON.parse(message_string);
            // TODO check for wrongly formatted message
            return {
                target_participant_id: parts[0],
                x1: parts[1],
                y1: parts[2],
                x2: parts[3],
                y2: parts[4]
            };
        }
    };

    /**
     * Create DOM canvas element and append to the $div as a child
     * @param $div - canvas parent, jquery object
     * @return new canvas DOM object
     */
    var createCanvas = function($div) {
        var canvas = document.createElement('canvas');
        canvas.className = "whiteboard";
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        $div.append(canvas);
        return canvas;
    };

    /**
     * Draw a line on the canvas context
     * @param ctx - canvas context
     * @param screenX1, screenY1, screenX2, screenY2 - line begin and end
     *        points, screen coordinates
     * @param color - line color
     * @note if begin coordinates are equal to the end coordinates,
     * the dot is drawn.
     */
    var draw = function(ctx, screenX1, screenY1, screenX2, screenY2, color){
        var div = ctx.canvas.parentElement;
        var divWidth = div.clientWidth;
        var divHeight = div.clientHeight;

        // Since the canvas size in pixels is not equal to the div size,
        // we need to convert screen coordinates to the pixel coordinates
        // on the canvas.
        var x1 = screenX1/divWidth*CANVAS_WIDTH;
        var y1 = screenY1/divHeight*CANVAS_HEIGHT;
        var x2 = screenX2/divWidth*CANVAS_WIDTH;
        var y2 = screenY2/divHeight*CANVAS_HEIGHT;

        // Do actual drawing
        ctx.beginPath();
        ctx.strokeStyle = color;
        if (y1 != y2 || x1 != x2) {
            // Draw a line if begin coordinates are not equal to the end
            // coordinates
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.lineJoin = "round";
        } else {
            // Draw a dot if begin coordinates are equal to the end coordinates
            ctx.lineWidth = 4;
            ctx.arc(x1, y1, 2, 0, 2 * Math.PI, true);
        }
        ctx.stroke();
        ctx.closePath();
    };

    /**
     * Broadcast a message about the drawn line to all participants
     * @param canvas - canvas where the line has been drawn
     * @param target_participant_id - id of participant on who's canvas the
     *        line has been drawn
     * @param prevX, prevY, currX, currY - line begin and end points, screen
     *        coordinates.
     */
    var broadcast = function(canvas, target_participant_id, prevX, prevY, currX, currY) {
        var div = canvas.parentElement;
        var divWidth = div.clientWidth;
        var divHeight = div.clientHeight;

        // Relative coordinates are sent. Each coordinate is a floating-point
        // number in range of 0..1, where 0 is left/top, 1 is right/bottom.
        var x1 = prevX/divWidth;
        var y1 = prevY/divHeight;
        var x2 = currX/divWidth;
        var y2 = currY/divHeight;

        if (div.id == 'video-self-view') { // TODO avoid this hack
            // Mirror coordinates for my view since my view is mirrored.
            x1 = 1 - x1;
            x2 = 1 - x2;
        }

        // Stringify the message
        var msg = MessageEncoder.encode(target_participant_id, x1, y1, x2, y2);
        for (var id in participants) {
            // Send message to each participant througth the data channel
            participants[id].sendDataChannelMessage(msg);
        }
    };

    /**
     * Handles mouse down / touch event
     * @param canvas - canvas
     * @param context - canvas context
     * @param participant_id - id of participant on who's face we are drawing
     * @param x, y - mouse down screen coordinates
     */
    var onmousedown = function(canvas, context, participant_id, x, y) {
        var rect = canvas.getBoundingClientRect();
        var currX = x - rect.left;
        var currY = y - rect.top;
        // Set previous coordinates equal to the current
        prevX = currX;
        prevY = currY;

        // Draw a dot
        draw(context, prevX, prevY, currX, currY, $hi.colorManager.getMyColor());
        // Send the event to all participants
        broadcast(canvas, participant_id, currX, currY, currX, currY);
    };

    /**
     * Handles mouse move / touch move
     * @param canvas - canvas
     * @param context - canvas context
     * @param participant_id - id of participant on who's face we are drawing
     * @param x, y - mouse down screen coordinates
     * @param mouseDown - flag indicating if mouse button was pressed during
     *                    the event
     */
    var onmousemove = function(canvas, context, participant_id, x, y, mouseDown) {
        var rect = canvas.getBoundingClientRect();
        var currX = x - rect.left;
        var currY = y - rect.top;
        if (mouseDown) {
            draw(context, prevX, prevY, currX, currY,
                 $hi.colorManager.getMyColor());
            broadcast(canvas, participant_id, prevX, prevY, currX, currY);
        }
        prevX = currX;
        prevY = currY;
    };

    /**
     * Create the whiteboard and initialize it
     * @param div_id - id of the parent div for the whiteboard
     * @param participant - participant object on who's face we are creating
     *                      a whiteboard
     */
    var create = function(div_id, participant) {
        var participant_id = participant.id;
        if (typeof participants[participant_id] != 'undefined') {
            // participant is already there
            return;
        }

        // Remember participant in the global list
        participants[participant_id] = participant;

        // Create a canvas DOM object
        var canvas = createCanvas($('#' + div_id));
        var context = canvas.getContext("2d");
        contexts[participant_id] = context;

        // Setup mouse/touch event handlers
        var mouseDown = false;
        $(canvas).bind('mousedown', function(){
            mouseDown = true;
            onmousedown(canvas, context, participant_id,
                        event.clientX, event.clientY);
        });
        $(canvas).bind('touchstart', function(){
            mouseDown = true;
            onmousedown(canvas, context, participant_id,
                        event.changedTouches[0].clientX,
                        event.changedTouches[0].clientY);
        })
        .bind('mousemove', function(event){
            onmousemove(canvas, context, participant_id,
                        event.clientX, event.clientY, mouseDown);
        })
        .bind('touchmove', function(event){
            var orig = event.originalEvent;
            if (mouseDown) {
                onmousemove(canvas, context, participant_id,
                            orig.changedTouches[0].clientX,
                            orig.changedTouches[0].clientY,
                            mouseDown);
            } else {
                onmousedown(canvas, context, participant_id,
                        orig.changedTouches[0].clientX,
                        orig.changedTouches[0].clientY);
            }
        });
        $(canvas).bind('mouseup mouseup touchend', function(){
            mouseDown = false;
        });

        // Setup data receiving events
        participant.on('data:message', function(message) {
            var msg = MessageEncoder.decode(message.data);
            var target_context = contexts[msg.target_participant_id];
            var target_canvas = target_context.canvas;
            var div = target_canvas.parentElement;
            var divWidth = div.clientWidth;
            var divHeight = div.clientHeight;

            if (div.id == 'video-self-view') {
                // Mirror coordinates for my view
                msg.x1 = 1 - msg.x1;
                msg.x2 = 1 - msg.x2;
            }

            // Since coordinates are in 0..1 range, we need to transform
            // them to the screen coordinates related to the canvas
            var x1 = msg.x1*divWidth;
            var y1 = msg.y1*divHeight;
            var x2 = msg.x2*divWidth;
            var y2 = msg.y2*divHeight;

            // Get the color assigned to the participant who send the message
            var color = $hi.colorManager.getColor(participant_id);

            // Do the drawing
            draw(target_context, x1, y1, x2, y2, color);
        });
    };

    /**
     * Remove the whiteboard
     * @param participant_id it of participant, who's whiteboard to remove
     * @note doesn't remove DOM objects, just clears internal structures.
     */
    var remove = function(participant_id){
        delete participants[participant_id];
        delete contexts[participant_id];
    };

    $hi.whiteboards = {
        'create': create,
        'remove': remove
    };
})();