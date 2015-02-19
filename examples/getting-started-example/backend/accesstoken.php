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
require_once("hidashhi_rest_api.php");

if (@$_GET['identifier']) {
  $rest = new HidashHiRestApi($__HI_API_KEY, $__HI_REST_URL);

  try {
    $result = $rest->retrieveAccessToken($_GET['identifier']);
  } catch (Exception $e) {
    echo "Exception occured: <pre>";
    print_r($e);
    echo "</pre>";
  }

  echo "Accesstoken REST API result (copy/paste the 'token'): <pre>";
  print_r($result);
  echo "</pre>";
} else {
  ?>
    <html>
      <head>
        <link href="../assets/css/bootstrap-min.css" rel="stylesheet" />
      </head>
      <body>
        <div class="container">
          <p class="pull-right"><a href="https://github.com/hidashhi/api-doc/tree/master/examples/getting-started-example"
                                   target="_blank">source code</a></p>

          <h1>HidashHi Getting Started example: backend</h1>

          <form method="GET">
            <div class="form-group">
              <label for="inputIdentifier">Enter identifier (e.g. userABCDEF1234@user.somedomain.com)</label>
              <input type="text" name="identifier" id="inputIdentifier" class="form-control" placeholder="Identifier"/>
            </div>
            <input type="submit" value="Create accesstoken" class="btn btn-default">
          </form>
        </div>
      </body>
    </html>
  <?php
}

?>