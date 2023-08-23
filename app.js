const vscode = require('vscode');

// do module.exports = { test } to export the function

module.exports = { matchNames };

function matchNames() {
    var doc = vscode.window.activeTextEditor.document;

    // check if it's a cs file
    if (doc.languageId !== "csharp") {
        vscode.window.showInformationMessage("This is not a C# file");
        return;
    }
    // check if it's a monobehaviour
    if (!doc.getText().includes("MonoBehaviour")) {
        vscode.window.showInformationMessage("This is not a MonoBehaviour");
        return;
    }

    // check if it only has one monoBehaviour class
    var monoBehaviourCount = 0;
    var monoBehaviourName = "";
    var monoBehaviourLine = 0;
    for (var i = 0; i < doc.lineCount; i++) {
        var line = doc.lineAt(i);
        if (line.text.includes("MonoBehaviour")) {
            monoBehaviourCount++;
            monoBehaviourName = line.text.split(" ")[2];
            monoBehaviourLine = i;
        }
    }
    if (monoBehaviourCount !== 1) {
        vscode.window.showInformationMessage("This file has more than one MonoBehaviour");
        return;
    }

    vscode.window.showInformationMessage(`This is a MonoBehaviour named ${monoBehaviourName} at line ${monoBehaviourLine}`);

    // vscode.window.showInformationMessage(This is a MonoBehaviour named ${monoBehaviourName} at line {monoBehaviourLine}");

    // vscode.window.showInformationMessage(vscode.window.activeTextEditor.document.fileName);
}
