import * as vscode from "vscode";
import { statSync } from "node:fs";

type ResourceKind = "file" | "directory" | "fileOrDirectory";

export function getResourcePath(
    uri: vscode.Uri | undefined
): string | undefined {
    if (uri === undefined && vscode.window.activeTextEditor === undefined) {
        return;
    }

    let resourcePath = "";
    if (uri !== undefined) {
        resourcePath = uri.fsPath;
    } else if (vscode.window.activeTextEditor !== undefined) {
        resourcePath = vscode.window.activeTextEditor.document.uri.fsPath;
    }

    return resourcePath;
}

export function requireResourcePath(
    uri: vscode.Uri | undefined,
    kind: ResourceKind,
    actionLabel: string
): string | undefined {
    const resourcePath = getResourcePath(uri);
    if (!resourcePath) {
        vscode.window.showErrorMessage(`${actionLabel} requires a selected file or folder.`);
        return;
    }

    let stats;
    try {
        stats = statSync(resourcePath);
    } catch {
        vscode.window.showErrorMessage(`${actionLabel} could not access the selected path.`);
        return;
    }

    if (kind === "file" && !stats.isFile()) {
        vscode.window.showErrorMessage(`${actionLabel} requires a file.`);
        return;
    }

    if (kind === "directory" && !stats.isDirectory()) {
        vscode.window.showErrorMessage(`${actionLabel} requires a folder.`);
        return;
    }

    if (kind === "fileOrDirectory" && !stats.isFile() && !stats.isDirectory()) {
        vscode.window.showErrorMessage(`${actionLabel} requires a file or folder.`);
        return;
    }

    return resourcePath;
}

export function ensureTerminalExists(): boolean {
    if ((<any>vscode.window).terminals.length === 0) {
        vscode.window.showErrorMessage("No active terminals. Press [ctrl] + [shift] + [`] to open one");
        return false;
    }
    return true;
}

export function selectTerminal(): vscode.Terminal | undefined {
    const terminal = <vscode.Terminal | undefined>(<any>vscode.window.activeTerminal);
    if (!terminal) {
        vscode.window.showErrorMessage("No active terminal selected.");
        return;
    }

    return terminal;
}
