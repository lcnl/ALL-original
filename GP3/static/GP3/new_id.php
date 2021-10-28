<?php

// Extract data from form
$subjectnr = $_POST['subjectnr'];

// create data directory if not already present
if(!is_dir(__DIR__ .'/static/GP3/data')){
    $res = mkdir(__DIR__ .'/static/GP3/data',0777);
}


// create recordings sub-directory if not already present
if(!is_dir('/static/GP3/data/recordings',0777)) {
    $res =  mkdir('/static/GP3/data/recordings',0777);
}


// create participant folder in recordings sub-directory if not already present
if(!is_dir('/static/GP3/data/recordings/'.$subjectnr,0777)) {
    $res =  mkdir('/static/GP3/data/recordings/'.$subjectnr,0777);
}
