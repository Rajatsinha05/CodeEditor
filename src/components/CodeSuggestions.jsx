import React from "react";

const CodeSuggestions = ({ monaco, language }) => {
  const getSuggestions = () => {
    let suggestions = [];
    switch (language) {
      case "javascript":
        
        suggestions = [
          {
            label: "console.log",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "console.log('${1:}')",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Log to console",
          },
        ];
        break;
      case "python":
        suggestions = [
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print('${1:}')",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Print to console",
          },
        ];
        break;
      default:
        suggestions = [];
    }
    return { suggestions };
  };

  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: () => getSuggestions(),
  });

  return null;
};

export default CodeSuggestions;
