<?php
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
require_once("config.php");

?>

<html>
  <head>
    <meta charset="UTF-8"  />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>HidashHi - Getting started example</title>
    <link href="assets/bootstrap-min.css" rel="stylesheet" />
    <link href="assets/style.css" rel="stylesheet" />
    <script type="text/javascript" src="assets/jquery-min.js"></script>
    <script type="text/javascript" src="<?php echo $__HI_CDN_URL; ?>/js/api/1/hi.dev.js?v=1.06"></script>
    <!-- Javascript logic can be found in assets/example.js -->
    <script type="text/javascript" src="assets/example.js"></script>
    <script type="text/javascript">
    
      // Set HidashHi platform from config
      $hi.settings.urls.cdn = "<?php echo $__HI_CDN_URL; ?>";
      $hi.settings.urls.rest = "<?php echo $__HI_REST_URL; ?>";
      $hi.settings.urls.jsms = "<?php echo $__HI_IO_URL; ?>";
      $hi.settings.urls.auth = "<?php echo $__HI_AUTH_URL; ?>";
      // For now use the medium quality. On later stage HD quality can be explored (only recommended for high-end pcs).
      $hi.settings.forceMediumQuality = true;
    </script>
  </head>
  <body>
    <div class="container">
    <!-- Unsupported Browser section -->
      <div class="alert alert-danger" id="unsupportedBrowser">
        <h1>Sorry, you are using a browser we do not support.</h1>
        <h3>Please consider using any of the industry-standard browsers listed below here.</h3>
        <div class="row">
          <div class="col-sm-6 col-md-4">
            <a class="thumbnail" target="_new" href="https://www.google.com/intl/en/chrome/browser/">
              <img src="assets/chrome_128x128.png" alt="Google Chrome">
              <div class="caption text-center">
                <h3>Google Chrome</h3>
              </div>
            </a>
          </div>
          <div class="col-sm-6 col-md-4">
            <a class="thumbnail" target="_new" href="https://download.mozilla.org/">
              <img src="assets/firefox_128x128.png" alt="Firefox">
              <div class="caption text-center">
                <h3>Firefox</h3>
              </div>
            </a>
          </div>
          <div class="col-sm-6 col-md-4">
            <a class="thumbnail" target="_new" href="http://www.opera.com/download/get/">
              <img src="assets/opera_128x128.png" alt="Opera">
              <div class="caption text-center">
                <h3>Opera</h3>
              </div>
            </a>
          </div>
        </div>        
      </div>
      <!-- End Unsupported Browser section -->
      <!-- Inputs for required data to start the call -->
      <div id="inputSection">
        <!-- Information about backend tools -->
        <div class="alert">
          <ul>
            <li>
              Create an accesstoken in the <a target="_new" href="backend/accesstoken.php">backend/accesstoken.php</a> example.
            </li>
          </ul>
        </div>
        <!-- End Information about backend tools -->
        <form id="input-form">
          <div class="form-group">
            <label for="inputAccesstoken">HidashHi Accesstoken</label>
            <input type="text" id="inputAccesstoken" class="form-control" placeholder="Enter HidashHi accesstoken" value="<?php echo $_GET['accesstoken']; ?>" />
          </div>
          <div class="form-group">
            <label for="inputCallCode">Call code, enter to join or click <a id="generateCallCode">generate</a> to start a call.</label>
            <input type="text" id="inputCallCode" class="form-control" placeholder="Enter call code" value="<?php echo $_GET['callcode']; ?>" />
          </div>
          <input id="inputBtn" type="submit" value="Start call" class="btn btn-default">
        </form>
      </div>
      <!-- End Inputs for required data to start the call -->
      <!-- Call section -->
      <div id="callSection" style="display: none;">
        <div id="video-waiting">
          <h3>Waiting for partner to connect..</h3>
          <p>Share the following call-code: <b><span id="share-call-code"></span></b></p>
        </div>
        <div id="video-self-view"></div>
        <div id="video-remote-view"></div>
        <div id="video-tools">
          <input id="exitCallBtn" type="button" value="Exit" class="btn btn-danger">
        </div>
        <!-- Text chat messages -->
        <div id="video-chat">
          <div class="highlight">
            <div id="chat-message-container" class="container chat-container">
            <!-- Text messages come here -->
            </div>
            <div >
              <form id="chat-send-message">
                <input disabled id="chat-message-input" type="text" class="form-control" placeholder="Type to chat.." />
              </form>
            </div>
          </div>
        </div>
        <!-- End Text chat messages -->
      </div>
      <!-- End Call section -->
    </div>
  </body>
</html>