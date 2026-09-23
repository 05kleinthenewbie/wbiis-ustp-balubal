<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'light') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script>
            (function() {
                const appearance = '{{ $appearance ?? "light" }}';
                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        <style>
            html { background-color: oklch(1 0 0); }
            html.dark { background-color: oklch(0.145 0 0); }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @php
            $manifestPath = public_path('build/manifest.json');
            $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
            $cssFile = $manifest['resources/css/app.css']['file'] ?? 'assets/app.css';
            $appJsFile = $manifest['resources/js/app.tsx']['file'] ?? 'assets/app.js';
            $pageKey = "resources/js/pages/{$page['component']}.tsx";
            $pageJsFile = $manifest[$pageKey]['file'] ?? null;
            $fontsCssFile = $manifest['_fonts-HDTwTRsm.css']['file'] ?? null;
        @endphp
        <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}">
        @if($fontsCssFile)
            <link rel="stylesheet" href="{{ asset('build/' . $fontsCssFile) }}">
        @endif
        <script type="module" src="{{ asset('build/' . $appJsFile) }}"></script>
        @if($pageJsFile)
            <script type="module" src="{{ asset('build/' . $pageJsFile) }}"></script>
        @endif

        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
