// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { runKubectlCommand, mergeAndUpdateYaml } from "./kubeapply";
import { runCdCommand } from "./cdhere";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "kubeSafeApply" is now active!');

  let disposableApply = vscode.commands.registerCommand(
    "kubeApply.apply",
    (uri: vscode.Uri) => {
      runKubectlCommand(true, "apply", "-f", uri);
    }
  );

  let disposableDiff = vscode.commands.registerCommand(
    "kubeApply.diff",
    (uri: vscode.Uri) => {
      runKubectlCommand(false, "diff", "-f", uri);
    }
  );

  let disposableDelete = vscode.commands.registerCommand(
    "kubeApply.delete",
    (uri: vscode.Uri) => {
      runKubectlCommand(true, "delete", "-f", uri);
    }
  );

  let disposableApplyKustomize = vscode.commands.registerCommand(
    "kubeApply.apply-kustomize",
    (uri: vscode.Uri) => {
      runKubectlCommand(true, "apply", "-k", uri);
    }
  );

  let disposableDiffKustomize = vscode.commands.registerCommand(
    "kubeApply.diff-kustomize",
    (uri: vscode.Uri) => {
      runKubectlCommand(false, "diff", "-k", uri);
    }
  );

  let disposableMergeAndUpdateContainers = vscode.commands.registerCommand(
    "kubeApply.sync-container",
    (uri: vscode.Uri) => {
      mergeAndUpdateYaml(uri, { containerOnly: true });
    }
  );

  let disposableMergeAndUpdateAll = vscode.commands.registerCommand(
    "kubeApply.sync",
    (uri: vscode.Uri) => {
      mergeAndUpdateYaml(uri);
    }
  );

  let disposableCdDir = vscode.commands.registerCommand(
    "dir.cd",
    (uri: vscode.Uri) => {
      runCdCommand(uri);
    }
  );

  context.subscriptions.push(disposableApply);
  context.subscriptions.push(disposableDiff);
  context.subscriptions.push(disposableDelete);
  context.subscriptions.push(disposableApplyKustomize);
  context.subscriptions.push(disposableDiffKustomize);
  context.subscriptions.push(disposableMergeAndUpdateContainers);
  context.subscriptions.push(disposableMergeAndUpdateAll);
  context.subscriptions.push(disposableCdDir);
}

// This method is called when your extension is deactivated
export function deactivate() { }
