# Stack and surface detection

Detect from concrete files; do not infer from repository age, buzzwords, or a single import. Multiple matches mean multiple surfaces. Prefer the file nearest the UI being changed.

| Signal | Likely platform/surface | Route by skill name |
|---|---|---|
| `package.json` dependencies: `react`, `next`, `@vitejs/plugin-react` | React/Next web | `pixelcraft-web` |
| `package.json`: `vue`, `nuxt` | Vue/Nuxt | `pixelcraft-web` |
| `package.json`: `svelte`, `@sveltejs/kit` | Svelte/SvelteKit | `pixelcraft-web` |
| `package.json`: `@angular/core` | Angular | `pixelcraft-web` |
| `package.json`: `astro`, `qwik`, `solid-js`, `lit`, `htmx.org`, `alpinejs` | respective web stack | `pixelcraft-web` |
| `Gemfile` + Rails views, `composer.json` + Blade/Twig, Django templates, Phoenix `.heex`, `.razor`, templ files | server-rendered web | `pixelcraft-web` |
| `pubspec.yaml` | Flutter/Dart | `pixelcraft-mobile` unless desktop target dominates |
| `Package.swift`, `*.xcodeproj`, `*.xcworkspace`, SwiftUI imports | iOS/macOS SwiftUI/UIKit/AppKit | `pixelcraft-mobile` or `pixelcraft-desktop` by target |
| `build.gradle`, `build.gradle.kts` with Compose dependencies | Android/Jetpack Compose | `pixelcraft-mobile` |
| `android/` + `ios/` + React Native config or `app.json` Expo | React Native/Expo | `pixelcraft-mobile` |
| `.csproj` with MAUI/WinUI/WPF/Avalonia references | .NET UI | `pixelcraft-mobile` or `pixelcraft-desktop` |
| `requirements.txt`/`pyproject.toml`: `streamlit` | Streamlit | `pixelcraft-python-ui` |
| same with `gradio` | Gradio | `pixelcraft-python-ui` |
| same with `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `flet`, `kivy` | matching Python UI | `pixelcraft-python-ui` |
| `Cargo.toml`: `ratatui`, `crossterm` | Rust TUI | `pixelcraft-tui` |
| `Cargo.toml`: `egui`, `slint`, `dioxus` | Rust GUI/desktop | `pixelcraft-desktop` |
| `Cargo.toml` + `tauri` or `src-tauri/tauri.conf.json` | Tauri desktop | `pixelcraft-desktop` |
| `go.mod`: `bubbletea`, `lipgloss`, `tcell`, `tview` | Go TUI | `pixelcraft-tui` |
| Python `textual`/`rich` dependencies | Python TUI | `pixelcraft-tui` |
| Node `ink` dependency | terminal React/Ink | `pixelcraft-tui` |
| `.mjml`, `mjml` dependency, React Email package, table-heavy email templates | email | `pixelcraft-email` |
| `ProjectSettings/`, `*.unity`, Unity UI Toolkit/USS/UXML | Unity UI | `pixelcraft-game-ui` |
| `project.godot`, `.tscn`, `.gd` | Godot UI | `pixelcraft-game-ui` |
| `.uproject`, Unreal UMG assets | Unreal UI | `pixelcraft-game-ui` |
| Qt `.pro`, `CMakeLists.txt` Qt modules, PySide/PyQt imports, `.qml` | Qt/QML desktop | `pixelcraft-desktop` |
| Electron main/preload config | Electron desktop | `pixelcraft-desktop` |

## Existing system inventory

Before designing, inspect for:

- design token files (`tokens.json`, `.tokens`, `theme.*`, Tailwind config/CSS variables, Swift assets, Compose theme, Flutter theme);
- component libraries, lint rules, screenshots/stories, localization catalogs, accessibility tests;
- brand assets and their license/provenance;
- density and mode conventions already used by the product;
- routing/navigation structure rather than only leaf components.

Record whether the system is authoritative, partial, inconsistent, or absent. Existing tokens outrank Pixelcraft-generated taste.

## Input/render surface

Also classify input modality (touch, mouse/keyboard, controller, remote, terminal keyboard, screen reader, watch/voice), viewport/window constraints, network context, and rendering surface (DOM/canvas/native/skia/terminal cells/email client/game engine). These facts determine which floor checks and platform idioms apply.
