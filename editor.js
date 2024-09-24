//Codeonline.gr||A website made by Harris Sagiris
// Load Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: '// Start coding...',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
    });
});

// Language selection
document.getElementById('language-select').addEventListener('change', function () {
    const language = this.value;
    monaco.editor.setModelLanguage(window.editor.getModel(), language);
});

// Save code locally with custom file name
function saveLocal() {
    const code = window.editor.getValue();
    const language = document.getElementById('language-select').value;

//file extension on lang:
    let fileExtension;
    switch (language) {
        case 'javascript': fileExtension = 'js'; break;
        case 'html': fileExtension = 'html'; break;
        case 'css': fileExtension = 'css'; break;
        case 'python': fileExtension = 'py'; break;
        case 'java': fileExtension = 'java'; break;
        case 'cpp': fileExtension = 'cpp'; break;
        case 'csharp': fileExtension = 'cs'; break;
        case 'ruby': fileExtension = 'rb'; break;
        case 'php': fileExtension = 'php'; break;
        case 'typescript': fileExtension = 'ts'; break;
        case 'go': fileExtension = 'go'; break;
        case 'swift': fileExtension = 'swift'; break;
        default: fileExtension = 'txt';
    }

    // Default file name
    let fileName = document.getElementById('file-name').value;
    if (!fileName) {
        fileName = `test.${fileExtension}`; // Default to 'test.<extension>'
    } else if (!fileName.endsWith(`.${fileExtension}`)) {
        fileName += `.${fileExtension}`; // Append the extension if not present
    }
    
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.click();
    closeSaveModal();
}

// Share code via a unique link
async function shareCode() {
    const code = window.editor.getValue();
    const sharedCodeRef = firebase.firestore().collection('sharedCode');
    
    const docRef = await sharedCodeRef.add({
        code: code,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    const shareUrl = `${window.location.origin}/shared/${docRef.id}`;
    prompt('Share this URL with others:', shareUrl);
}

// Load shared code from the unique URL
async function loadSharedCode(id) {
    const docRef = firebase.firestore().collection('sharedCode').doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
        window.editor.setValue(doc.data().code);
    } else {
        alert('No code found for this link.');
    }
}

// Check if URL has a shared code ID and load it
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeId = urlParams.get('id');
    if (codeId) {
        loadSharedCode(codeId);
    }
};

// Upload code to GitHub
async function uploadToGitHub() {
    const code = window.editor.getValue();
    const token = document.getElementById('github-token').value;
    const repo = document.getElementById('repo-name').value;
    const path = document.getElementById('file-path').value;

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: "Add code file",
            content: btoa(code) // Base64 encode the content
        })
    });

    if (response.ok) {
        alert('File uploaded to GitHub successfully!');
    } else {
        alert('Error uploading file to GitHub');
    }
    closeGitHubModal();
}

// Open Save Modal
function openSaveModal() {
    document.getElementById('save-modal').style.display = 'block';
    document.getElementById('file-name').focus(); // Focus on the file name input
}

// Close Save Modal
function closeSaveModal() {
    document.getElementById('save-modal').style.display = 'none';
}

// Open GitHub Modal
function openGitHubModal() {
    document.getElementById('github-modal').style.display = 'block';
}

// Close GitHub Modal
function closeGitHubModal() {
    document.getElementById('github-modal').style.display = 'none';
}
// Insert code templates into the editor
const insertTemplateButton = document.getElementById('insert-template');
const templateSelect = document.getElementById('template-select');

insertTemplateButton.addEventListener('click', function() {
    let templateCode = '';
    const selectedTemplate = templateSelect.value;

    if (selectedTemplate === 'basic-html') {
        templateCode = '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>';
    } else if (selectedTemplate === 'basic-css') {
        templateCode = 'body {\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: #333;\n}';
    } else if (selectedTemplate === 'basic-js') {
        templateCode = 'console.log("Hello, World!");';
    }

    editor.setValue(templateCode);
});
// Apply selected theme
const themeSelect = document.getElementById('theme-select');

themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value;
    monaco.editor.setTheme(selectedTheme);
});
// Auto-save functionality
const AUTO_SAVE_INTERVAL = 60000; // Save every 60 seconds

function autoSave() {
    const code = editor.getValue();
    const fileName = 'auto-saved-file.js'; // Default file name
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
document.getElementById('run-code').addEventListener('click', function() {
    const text = document.getElementById('editor').value;
    const results = eslint.verify(text, { rules: { semi: 'error' } });
    if (results.length > 0) {
        alert('Linting errors found:\n' + results.map(result => `${result.message} at line ${result.line}`).join('\n'));
    } else {
        alert('No linting errors found.'); 
    }
});

//basic funcionality done!!!