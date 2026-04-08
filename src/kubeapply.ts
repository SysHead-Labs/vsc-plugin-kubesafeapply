import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { ensureTerminalExists, requireResourcePath, selectTerminal } from "./utils";
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
    try {
        const resourceKind = args === "-k" ? "directory" : "fileOrDirectory";
        const actionLabel = args === "-k" ? "Kustomize action" : "Kubectl action";
        const resourcePath = requireResourcePath(uri, resourceKind, actionLabel);
        if (!resourcePath) {
            return;
        }

        const quotedResourcePath = quoteShellArg(resourcePath);

        if (!ensureTerminalExists()) {
            return;
        }

        const terminal = selectTerminal();
        if (!terminal) {
            return;
        }

        const kubeCmd = `kubectl ${command} ${args} ${quotedResourcePath}`;

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

            const shouldRun = await waitBeforeKubectl(command);
            if (!shouldRun) {
                vscode.window.showInformationMessage('KubeApply Action canceled.');
                return;
            }
        }

        terminal.sendText(kubeCmd);
    } catch (error) {
        vscode.window.showErrorMessage(`KubeApply Error: ${error instanceof Error ? error.message : String(error)}`);
    }
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

        const resourcePath = requireResourcePath(uri, "file", "Sync");
        if (!resourcePath) {
            return;
        }

        if (containerOnly) {
            await mergeAndUpdateLocalResourcesContainers(kc, resourcePath);
        } else {
            await mergeAndUpdateLocalResources(kc, resourcePath);
        }
        vscode.window.showInformationMessage(`kubeApply Sync resources ${resourcePath}`);
    } catch (error) {
        vscode.window.showErrorMessage(`kubeApply Sync Error: ${error}`);
    }
}
