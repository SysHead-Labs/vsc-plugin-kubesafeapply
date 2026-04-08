# Kubernetes Safe Apply

## Features

A simple and slim extention to operate yaml files via `kubectl`.
- right click and select the command to operate yaml or directory. 
- Before `Apply` and `Delete`, the extension shows a confirmation dialog with the current kubectl context and the exact command to be executed.
- After confirmation, `Apply` and `Delete` wait 5 seconds in VS Code with a cancellable countdown before sending the command to the terminal.
- Kustomize actions require a folder, sync actions require a YAML file, and `cd` requires a folder.
- Terminal-based actions stop early with a clear error if there is no active terminal.

| Command | comment | keybindings |
| :--- | :--- | :--- |
| `K8S: Apply` | confirm context and command, then run `kubectl apply -f [DIR\|yaml]` after a 5 second countdown |  |
| `K8S: Delete` | confirm context and command, then run `kubectl delete -f [yaml]` after a 5 second countdown |  |
| `K8S: Diff` | `kubectl diff -f [DIR\|yaml]` | `ctrl+shift+alt+d / ctrl+shift+cmd+d` |
| `K8S: Apply kustomize` | confirm context and command, then run `kubectl apply -k [DIR]` after a 5 second countdown |  |
| `K8S: Diff kustomize` | `kubectl diff -k [DIR]` |  |
| `K8S: Sync Container` | update only the container section in the selected local YAML from the live Kubernetes resource | `ctrl+shift+alt+s / ctrl+shift+cmd+s` |
| `K8S: Sync` | update the selected local YAML from the live Kubernetes resource |  |
| `DIR: cd` | cd to selected folder |  |

## Requirements

- a configured `kubectl`
- an active terminal in VSCode
- a valid selected file or folder for the chosen action

This project is a fork of https://github.com/bagechashu/vsc-plugin-kubeapply
with additional functionality for Kubernetes context validation.

## Special Thanks List
- [shaimendel](https://github.com/shaimendel/vscode-plugin-cicd-github-actions)
- [bagechashu](https://github.com/bagechashu/vsc-plugin-kubeapply)
