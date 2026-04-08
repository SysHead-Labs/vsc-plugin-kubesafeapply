import * as vscode from "vscode";
import { ensureTerminalExists, requireResourcePath, selectTerminal } from "./utils";

function quoteShellArg(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}

// cd to selected directory in terminal.
export async function runCdCommand(
    uri: vscode.Uri | undefined
) {
    try {
        const resourcePath = requireResourcePath(uri, "directory", "CD");
        if (!resourcePath) {
            return;
        }

        if (!ensureTerminalExists()) {
            return;
        }

        const terminal = selectTerminal();
        if (!terminal) {
            return;
        }

        const cdCmd = `cd ${quoteShellArg(resourcePath)}`;
        terminal.sendText(cdCmd);
    } catch (error) {
        vscode.window.showErrorMessage(`CD Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}
