<?php

/**
 * Tutorial.create API
 *
 * @param array $params
 * @return array API result descriptor
 * @throws API_Exception
 */
function civicrm_api3_tutorial_create($params) {
  // ID is required because that determines the filename.
  // Whether this api adds or updates depends on whether the file exists.
  if (empty($params['id'])) {
    throw new API_Exception("Mandatory key(s) missing from params array: id", "mandatory_missing", array("fields" => ['id']));
  }
  $tutorial = $params;
  unset($tutorial['version']);
  $filePath = Civi::paths()->getPath('[civicrm.files]/crm-tutorials/' . $tutorial['id'] . '.json');
  // Update file if exists
  foreach (_civitutorial_get_files() as $path => $file) {
    if ($tutorial['id'] == $file['id'] && $path == $filePath) {
      $tutorial += $file;
    }
  }
  file_put_contents($filePath, json_encode($tutorial));
  return civicrm_api3_create_success($tutorial, $params, 'Tutorial', 'create');
}

/**
 * Tutorial.delete API
 *
 * @param array $params
 * @return array API result descriptor
 * @throws API_Exception
 */
function civicrm_api3_tutorial_delete($params) {
  $filePath = Civi::paths()->getPath('[civicrm.files]/crm-tutorials/' . $params['id'] . '.json');
  unlink($filePath);
  return civicrm_api3_create_success();
}

/**
 * Tutorial.get API
 *
 * @param array $params
 * @return array API result descriptor
 * @throws API_Exception
 */
function civicrm_api3_tutorial_get($params) {
  $files = _civitutorial_get_files();
  return _civicrm_api3_basic_array_get('Tutorial', $params, $files, 'id', ['id', 'url', 'groups']);
}
