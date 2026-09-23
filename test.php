<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo '<h2>PHP Test</h2>';
echo 'PHP Version: '.phpversion().'<br>';

// Check if .env exists
$envFile = __DIR__.'/.env';
echo 'File .env: '.(file_exists($envFile) ? 'EXISTS' : 'MISSING').'<br>';

// Check key directories
echo 'Dir app/: '.(is_dir(__DIR__.'/app') ? 'EXISTS' : 'MISSING').'<br>';
echo 'Dir vendor/: '.(is_dir(__DIR__.'/vendor') ? 'EXISTS' : 'MISSING').'<br>';
echo 'Dir bootstrap/: '.(is_dir(__DIR__.'/bootstrap') ? 'EXISTS' : 'MISSING').'<br>';
echo 'Dir storage/: '.(is_dir(__DIR__.'/storage') ? 'EXISTS' : 'MISSING').'<br>';
echo 'Dir public/build/: '.(is_dir(__DIR__.'/public/build') ? 'EXISTS' : 'MISSING').'<br>';
echo 'File public/build/manifest.json: '.(file_exists(__DIR__.'/public/build/manifest.json') ? 'EXISTS' : 'MISSING').'<br>';

// Check writable
echo 'Dir storage/ writable: '.(is_writable(__DIR__.'/storage') ? 'YES' : 'NO').'<br>';
echo 'Dir bootstrap/cache/ writable: '.(is_writable(__DIR__.'/bootstrap/cache') ? 'YES' : 'NO').'<br>';
