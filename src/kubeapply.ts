import * as vscode from "vscode";
import { getResourcePath, ensureTerminalExists, selectTerminal } from "./utils";
import { mergeAndUpdateLocalResources, mergeAndUpdateLocalResourcesContainers } from "kubectl-sync2local";
import { KubeConfig } from "@kubernetes/client-node";

function quoteShellArg(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}

// Run kubectl command in terminal.
export async function runKubectlCommand(
    doubleCheck: boolean | true,
    command: string,
    args: string,
    uri: vscode.Uri | undefined
) {
    const resourcePath = getResourcePath(uri);
    const quotedResourcePath = resourcePath ? quoteShellArg(resourcePath) : "";

    if (!ensureTerminalExists()) {
        return;
    }

    let sp: string = ` && \\\n`;
    let infoEcho: string = `echo -e "\n \\033[42m[ ${command.toUpperCase()} ]`;
    let warnEcho: string = `echo -e "\n \\033[41m[ ${command.toUpperCase()} ]`;
    let endEcho: string = `\\033[0m will execute after 5s, \\033[;36;4m[Ctrl+c]\\033[0m to cancel"`;
    let wait5Min: string = `for i in $(seq 5); do  echo "." && sleep 1 ; done`;
    let kubeCmd: string = `kubectl ${command} ${args} ${quotedResourcePath}`;

    const terminal = selectTerminal();

    // Double check before action.
    if (doubleCheck) {
        const doubleCheck = await vscode.window.showInformationMessage('Do you want to continue KubeApply Action?', 'Yes', 'No');
        if (doubleCheck !== 'Yes') {
            vscode.window.showInformationMessage('KubeApply Action canceled.');
            return;
        }
        // Wait before exec command.
        kubeCmd = `${wait5Min} ${sp} ${kubeCmd}`;
    }

    // Add Tips before exec command.
    if (command === "delete") {
        kubeCmd = `${warnEcho}${endEcho} ${sp} ${kubeCmd}`;
    } else if (command === "apply") {
        kubeCmd = `${infoEcho}${endEcho} ${sp} ${kubeCmd}`;
    }

    terminal.sendText(`${kubeCmd}`);

}

// Merge online resource config to local Yaml
// Default Merge all of the resource in Yaml.
export async function mergeAndUpdateYaml(
    uri: vscode.Uri | undefined,
    { containerOnly = false }: { containerOnly?: boolean } = {}
) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const resourcePath = getResourcePath(uri);
        const localPath: string = resourcePath ?? "";

        if (containerOnly) {
            await mergeAndUpdateLocalResourcesContainers(kc, localPath);
        } else {
            await mergeAndUpdateLocalResources(kc, localPath);
        }
        vscode.window.showInformationMessage(`kubeApply Sync resources ${resourcePath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`kubeApply Sync Error: ${error}`);
    }
}
