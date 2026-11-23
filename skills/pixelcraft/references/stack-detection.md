# Stack and surface detection

Detect from concrete files; do not infer from repository age, buzzwords, or one copied import. Multiple matches mean multiple surfaces. Prefer the file nearest the UI being changed. The reference names below live inside the named platform skill; never construct cross-skill relative paths.

## Web signals

| Signal | Platform skill → framework reference |
|---|---|
| plain `.html`/`.css` or no framework dependency | `pixelcraft-web` → `html-css` |
| `react`, `next`, `@vitejs/plugin-react` | `pixelcraft-web` → `react-next` |
| `vue`, `nuxt`, `vite.config` Vue plugin | `pixelcraft-web` → `vue-nuxt` |
| `svelte`, `@sveltejs/kit`, `.svelte` | `pixelcraft-web` → `svelte` |
| `solid-js`, SolidStart config | `pixelcraft-web` → `solid` |
| `@angular/core`, `angular.json` | `pixelcraft-web` → `angular` |
| `astro`, `.astro` | `pixelcraft-web` → `astro` |
| `@builder.io/qwik`, Qwik City config | `pixelcraft-web` → `qwik` |
| `htmx.org`, `alpinejs`, `hx-*` fragments/`x-data` | `pixelcraft-web` → `htmx-alpine` |
| `lit`, custom elements/`.ce`/`shadowRoot` UI | `pixelcraft-web` → `lit-web-components` |
| `tailwindcss`, `@import "tailwindcss"`, Tailwind classes/config | `pixelcraft-web` → `tailwind` |
| Rails views/Hotwire (`Gemfile`, Turbo/Stimulus) | `pixelcraft-web` → `server-rendered` |
| Laravel Blade/Livewire (`composer.json`, `.blade.php`) | `pixelcraft-web` → `server-rendered` |
| Django/Jinja/templates (`manage.py`, template dirs) | `pixelcraft-web` → `server-rendered` |
| Phoenix/LiveView (`mix.exs`, `.heex`) | `pixelcraft-web` → `server-rendered` |
| Blazor (`.razor`, `.csproj`) | `pixelcraft-web` → `server-rendered` |
| Go templ/html template (`.templ`, `.tmpl`, handler templates) | `pixelcraft-web` → `server-rendered` |

## Mobile signals

| Signal | Platform skill → framework reference |
|---|---|
| SwiftUI imports/types, `Package.swift`, Xcode project | `pixelcraft-mobile` → `swiftui` |
| UIKit imports/view controllers/storyboards | `pixelcraft-mobile` → `uikit` |
| `build.gradle(.kts)` Compose dependencies, `@Composable` | `pixelcraft-mobile` → `jetpack-compose` |
| `pubspec.yaml`, Flutter imports | `pixelcraft-mobile` → `flutter` |
| React Native/Expo config, `app.json`, RN dependencies | `pixelcraft-mobile` → `react-native-expo` |
| Kotlin Multiplatform/Compose Multiplatform source sets | `pixelcraft-mobile` → `kotlin-multiplatform` |
| Ionic/Capacitor config/dependencies | `pixelcraft-mobile` → `ionic-capacitor` |
| MAUI `.csproj`/XAML/AppShell references | `pixelcraft-mobile` → `dotnet-maui` |

## Python UI signals

| Signal | Platform skill → framework reference |
|---|---|
| `streamlit` import/dependency or `.streamlit/config.toml` | `pixelcraft-python-ui` → `streamlit` |
| `gradio`/`gr.Blocks`/`gr.Interface` | `pixelcraft-python-ui` → `gradio` |
| `reflex`/`rx.App` | `pixelcraft-python-ui` → `reflex` |
| `nicegui`/`from nicegui import ui` | `pixelcraft-python-ui` → `nicegui` |
| `dash`/Dash layout callbacks | `pixelcraft-python-ui` → `dash` |
| `panel`/`import panel as pn` | `pixelcraft-python-ui` → `panel` |
| Shiny for Python (`shiny` UI/server/reactive) | `pixelcraft-python-ui` → `shiny` |
| `flet` controls/page | `pixelcraft-python-ui` → `flet` |
| `kivy`/KV language/App classes | `pixelcraft-python-ui` → `kivy` |
| `ipywidgets`/notebook widget traits | `pixelcraft-python-ui` → `jupyter-widgets` |

## Desktop signals

| Signal | Platform skill → framework reference |
|---|---|
| `src-tauri/tauri.conf.json` or Tauri dependency | `pixelcraft-desktop` → `tauri` |
| Electron main/preload/package configuration | `pixelcraft-desktop` → `electron` |
| Qt `.pro`/CMake Qt modules/PySide/PyQt/`.qml` | `pixelcraft-desktop` → `qt-pyside-qml` |
| WinUI/WPF `.csproj`/XAML/WindowsAppSDK references | `pixelcraft-desktop` → `winui-wpf` |
| AppKit/Cocoa imports/macOS target | `pixelcraft-desktop` → `appkit` |
| GTK/libadwaita build definitions/imports/blueprints | `pixelcraft-desktop` → `gtk` |
| Avalonia `.csproj`/XAML references | `pixelcraft-desktop` → `avalonia` |
| `egui`, `slint`, `dioxus`, `iced` in Rust dependencies | `pixelcraft-desktop` → `rust-gui` |

## TUI signals

| Signal | Platform skill → framework reference |
|---|---|
| `textual` dependency/import | `pixelcraft-tui` → `textual` |
| `rich` dependency/import without full Textual app | `pixelcraft-tui` → `rich` |
| `ink` dependency/import | `pixelcraft-tui` → `ink` |
| Go `bubbletea`/`lipgloss` imports | `pixelcraft-tui` → `bubbletea-lipgloss` |
| Rust `ratatui`/`crossterm` dependencies | `pixelcraft-tui` → `ratatui` |

## Email signals

| Signal | Platform skill → framework reference |
|---|---|
| table-heavy HTML email/inline CSS templates | `pixelcraft-email` → `html-tables` |
| `.mjml` files or `mjml` dependency | `pixelcraft-email` → `mjml` |
| `@react-email`/`react-email` dependencies/templates | `pixelcraft-email` → `react-email` |
| Outlook/Gmail/Apple Mail/client/dark/plaintext concerns | `pixelcraft-email` → `client-quirks` |

## Game UI signals

| Signal | Platform skill → framework reference |
|---|---|
| `ProjectSettings/`, `.unity`, UXML/USS/UI Builder assets | `pixelcraft-game-ui` → `unity-ui-toolkit` |
| `project.godot`, `.tscn`, `.gd`, Control/Theme resources | `pixelcraft-game-ui` → `godot` |
| `.uproject`, UMG/Slate/CommonUI assets or references | `pixelcraft-game-ui` → `unreal-umg` |
| HUD/controller/safe-area/certification/accessibility question | `pixelcraft-game-ui` → `hud-principles` |

## Existing system inventory

Before designing, inspect design token files (`tokens.json`, `.tokens`, theme objects, Tailwind CSS/theme, asset catalogs, resource dictionaries, Qt/QSS, Godot themes, UMG styles), component libraries, lint/test/screenshot fixtures, localization catalogs, brand assets/licenses, density conventions, and navigation structure. Record whether the system is authoritative, partial, inconsistent, or absent. Existing tokens outrank Pixelcraft-generated taste.

## Input/render surface

Classify input modality (touch, mouse/keyboard, controller, remote, terminal keyboard, screen reader, voice), viewport/window constraints, network context, platform/version, and rendering surface (DOM/canvas/native/skia/terminal cells/email client/game engine). These facts determine which floor checks and platform idioms apply.
