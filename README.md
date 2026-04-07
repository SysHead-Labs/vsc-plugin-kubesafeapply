# Kubernetes Safe Apply

## Features

A simple and slim extention to operate yaml files via `kubectl`.
- right click and select the command to operate yaml or directory. 
- Before `Apply` and `Delete`, the extension shows a confirmation dialog with the current kubectl context and the exact command to be executed.
- After confirmation, `Apply` and `Delete` wait 5 seconds in VS Code with a cancellable countdown before sending the command to the terminal.

| Command | comment | keybindings |
| :--- | :--- | :--- |
| `K8S: Apply` | confirm context and command, then run `kubectl apply -f [DIR\|yaml]` after a 5 second countdown |  |
| `K8S: Delete` | confirm context and command, then run `kubectl delete -f [yaml]` after a 5 second countdown |  |
| `K8S: Diff` | `kubectl diff -f [DIR\|yaml]` | `ctrl+shift+alt+d / ctrl+shift+cmd+d` |
| `K8S: Apply kustomize` | confirm context and command, then run `kubectl apply -k [DIR]` after a 5 second countdown |  |
| `K8S: Diff kustomize` | `kubectl diff -k [DIR]` |  |
| `K8S: Sync Container` | kubeApply Sync Online container config | `ctrl+shift+alt+s / ctrl+shift+cmd+s` |
| `K8S: Sync` | kubeApply Sync All Online config adapt YAML |  |
| `DIR: cd` | cd to selected folder |  |

## Requirements

- a configured `kubectl`
- an active terminal in VSCode

This project is a fork of https://github.com/bagechashu/vsc-plugin-kubeapply
with additional functionality for Kubernetes context validation.

## Special Thanks List
- [shaimendel](https://github.com/shaimendel/vscode-plugin-cicd-github-actions)
- [bagechashu](https://github.com/bagechashu/vsc-plugin-kubeapply)
