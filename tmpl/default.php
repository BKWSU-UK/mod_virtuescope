<?php
defined ( '_JEXEC' ) or die ( 'Restricted access' );

use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
//JHtml::_('jquery.framework');
//JHtml::_('jquery.ui');

$app = Factory::getApplication();
$lang = $app->getLanguage()->getTag();
$lang = str_replace('-', '_',$lang);
$doc = $app->getDocument();
$doc->addCustomTag('<meta property="og:image" content="' . Uri::base(true) . '/media/mod_virtuescope/images/wheels/' . $lang . '.png" />');
$style = '#example {
	border-color:#' . $bordercolor . ';
	}';
$doc->addStyleDeclaration('#rotation, #stopIt, #yearPlanRestart ,#yearPlanPdf, #yearPlanMail, #virtuescopeContent, #virtuescopePredictions, #spinner, #advanced { display: none }');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/lib/jquery.json.min.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/lib/jquery.cookie.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/jquery-dataTables-1.10.1/js/jquery.dataTables-1.10.1.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/jquery-ui-1.12.1.custom/jquery-ui.min.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/compression/lz-string-1.4.4.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/lib/handlebars-v4.0.5.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/lib/canvas_wrapper.js');
$doc->addScript(Uri::base( true ) . '/media/mod_virtuescope/js/loader_support.js');
$doc->addStyleSheet(JURI::base( true ).'/media/mod_virtuescope/js/jquery-ui-1.12.1.custom/jquery-ui.min.css');
$doc->addStyleSheet(JURI::base( true ).'/media/mod_virtuescope/js/jquery-ui-1.12.1.custom/jquery-ui.theme.min.css');
$doc->addScriptDeclaration('
  jQuery(document).ready(function(){
    var source = jQuery.ajax("' . Uri::base( true ) . '/media/mod_virtuescope/js/vs-template.tpl").done(function(data) {
        jQuery("#vs-container").html(Handlebars.compile(data)({}));
        var jsFolder = "' . Uri::base( true ) . '/media/mod_virtuescope/js/";
        loaderSupport.loadFile(jsFolder + "global.js");
        loaderSupport.checkReadyOther("global", function () {
            global.urls.context = "' . Uri::base( true ) . '/";
        });
        loaderSupport.loadFile(jsFolder + "util.js");
        loaderSupport.checkReadyOther("util", function () {
            //var targetScript = util.readParam("lang");
            //targetScript = targetScript === "" ? "en_GB" : targetScript;
            loaderSupport.loadFile(jsFolder + "' . $lang . '.js");
            loaderSupport.loadFile(jsFolder + "plans.js");
            loaderSupport.loadFile(jsFolder + "hist.js");
            loaderSupport.loadFile(jsFolder + "anim.js");
            loaderSupport.loadFile(jsFolder + "cookie_loader.js");
            loaderSupport.checkReadyOther("getGlobalLocale", function () {
                loaderSupport.loadFile(jsFolder + "init.js");
            });
        });
    });
  });
');
if (isset($containerClass))
    echo '<div id="vs-container" class="' . $containerClass . '">Loading Virtuescope</div>';
else
    echo '<div id="vs-container">Loading Virtuescope</div>';