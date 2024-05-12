export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "C17", 
  cpp: "C++17", 
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction Main(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\nMain("Test");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction Main(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\nMain({ name: "Test" });\n`,
  python: `\ndef Main(name):\n\tprint("Hello, " + name + "!")\n\nMain("Test")\n`,
  java: `\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace Main\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Test';\necho $name;\n",
  c: `#include <stdio.h>\n\nint main() {\n\tprintf("Hello, world!\\n");\n\treturn 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n\t\n    return 0;\n}\n`,
};
