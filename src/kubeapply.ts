import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { getResourcePath, ensureTerminalExists, selectTerminal } from "./utils";
import { mergeAndUpdateLocalResources, mergeAndUpdateLocalResourcesContainers } from "kubectl-sync2local";
import { KubeConfig } from "@kubernetes/client-node";

function quoteShellArg(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}

async function waitBeforeKubectl(command: string): Promise<boolean> {
    const totalSeconds = 5;
    let canceled = false;

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            cancellable: true,
            title: `${command.toUpperCase()} will execute in ${totalSeconds} seconds`,
        },
        async (progress, token) => {
            token.onCancellationRequested(() => {
                canceled = true;
            });

            progress.report({ message: "Cancel to abort." });

            for (let remaining = totalSeconds; remaining > 0; remaining--) {
                if (canceled) {
                    return;
                }

                progress.report({
                    increment: 100 / totalSeconds,
                    message: `${remaining}s remaining`,
                });

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    );

    return !canceled;
}

async function getKubectlContext(): Promise<string> {
    try {
        const stdout = await new Promise<string>((resolve, reject) => {
            execFile("kubectl", ["config", "current-context"], (error, output) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(output.trim());
            });
        });

        if (!stdout) {
            throw new Error("kubectl context is empty.");
        }

        return stdout;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Unable to determine current kubectl context: ${message}`);
    }
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

    let kubeCmd: string = `kubectl ${command} ${args} ${quotedResourcePath}`;

    const terminal = selectTerminal();

    // Double check before action.
    if (doubleCheck) {
        let currentContext = "";
        try {
            currentContext = await getKubectlContext();
        } catch (error) {
            vscode.window.showErrorMessage(error instanceof Error ? error.message : String(error));
            return;
        }

        const doubleCheck = await vscode.window.showInformationMessage(
            'Do you want to continue KubeApply Action?',
            {
                modal: true,
                detail: `Context: ${currentContext}\nCommand: ${kubeCmd}`,
            },
            'Yes',
            'No'
        );
        if (doubleCheck !== 'Yes') {
            vscode.window.showInformationMessage('KubeApply Action canceled.');
            return;
        }

        let shouldRun = false;
        try {
            shouldRun = await waitBeforeKubectl(command);
        } catch {
            return;
        }
        if (!shouldRun) {
            vscode.window.showInformationMessage('KubeApply Action canceled.');
            return;
        }
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
