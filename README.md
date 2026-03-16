# Kubernetes Safe Apply

## Features

A simple and slim extention to operate yaml files via `kubectl`.
- right click and select the command to operate yaml or directory. 
- The prompt before `Apply` and `Delete` is implemented through `echo`. 

| Command | comment | keybindings |
| :--- | :--- | :--- |
| `K8S: Apply` | `sleep 5 && kubectl apply -f [DIR\|yaml]` |  |
| `K8S: Delete` | `sleep 5 && kubectl delete -f [yaml]` |  |
| `K8S: Diff` | `kubectl diff -f [DIR\|yaml]` | `ctrl+shift+alt+d / ctrl+shift+cmd+d` |
| `K8S: Apply kustomize` | `sleep 5 && kubectl apply -k [DIR]` |  |
| `K8S: Diff kustomize` | `sleep 5 && kubectl diff -k [DIR]` |  |
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
