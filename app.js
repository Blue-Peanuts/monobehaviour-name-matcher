const vscode = require('vscode');

// do module.exports = { test } to export the function

module.exports = { matchNamesCurrent };

function matchNamesCurrent() {
    var doc = vscode.window.activeTextEditor.document;
    matchName(doc);
}

function matchName(doc)
{
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

    // check if it's abstract at same line as MonoBehaviour
    if (doc.lineAt(monoBehaviourLine).text.includes("abstract")) {
        vscode.window.showInformationMessage("This MonoBehaviour is abstract");
        return;
    }

    // get file name
    var fileName = doc.fileName.split("\\").pop().split(".")[0];
    // works since pop returns the popped element

    // check if file name matches
    if (fileName === monoBehaviourName) {
        vscode.window.showInformationMessage("This MonoBehaviour is named correctly");
        return;
    }

    // check if file name is not pascal case or contains non letters
    if (!(/^[a-zA-Z]+$/.test(fileName))) {
        vscode.window.showInformationMessage("This file name is not pascal case");
        return;
    }

    vscode.window.showInformationMessage(`${monoBehaviourName} will be changed to ${fileName}`);

    // get string at line
    var line = doc.lineAt(monoBehaviourLine).text;
    // replace class name with file name
    var newLine = line.replace(monoBehaviourName, fileName);
    // workspace edit
    var workspaceEdit = new vscode.WorkspaceEdit();
    // replace line
    workspaceEdit.replace(doc.uri, new vscode.Range(monoBehaviourLine, 0, monoBehaviourLine, line.length), newLine);
    // apply edit
    vscode.workspace.applyEdit(workspaceEdit);
    // save file
    doc.save();
}
