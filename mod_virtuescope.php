<?php
    // no direct access
    defined('_JEXEC') or die('Restricted access');

    use Joomla\CMS\Helper\ModuleHelper;

    $containerClass = $params->get('moduleclass_sfx');

    require ModuleHelper::getLayoutPath('mod_virtuescope', $params->get('layout', 'default'));