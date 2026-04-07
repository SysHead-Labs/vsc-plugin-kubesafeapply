# Change Log

All notable changes to the "kubeapply" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [2.0.1] - 2026-04-07
- Bump extension version to 2.0.1.
- Override transitive `lodash` to address the advisory reported by `npm audit`.

## [2.0.0] - 2026-04-07
- Rename the extension to `Kubernetes Safe Apply` and update the publisher to `Syshead`.
- Update the VS Code compatibility floor to `^1.100.0`.
- Replace the old packaging flow with an `esbuild` bundle plus TypeScript type checking.
- Update `.vscode` launch configuration to match the bundled `dist/**` output.
- Fix kubectl command path handling for files and folders that contain spaces.
- Remove stale sample test, lint, and webpack scaffolding files.
- Update dependency constraints for `@kubernetes/client-node` and keep the resolved version pinned via `overrides`.

## [1.0.3] - 2024-02-21
- Add command to cd to the selected folder.

## [1.0.2] - 2023-09-28
- Add double check before apply and delete manifest file.

## [1.0.1] - 2023-08-10
- Change default keybinding.

## [1.0.0] - 2023-08-03
- Use Webpack to bundle src code.
- Update devDependencies (typescript 3.8.3 --> 5.1.3; vscode 1.43.0 --> 1.80.0)
- Add Funtion: Sync Online resource config to Local YAML.
