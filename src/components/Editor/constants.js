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
  javascript: `'use strict';\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\n\nlet inputString = '';\nlet currentLine = 0;\n\nprocess.stdin.on('data', inputStdin => {\n    inputString += inputStdin;\n});\n\nprocess.stdin.on('end', _ => {\n    inputString = inputString.trim()\n.split('\\n')\n.map(string => {\n        return string.replace(/\\s+/g, " ").trim();\n    });\n    main();\n});\n\nfunction readLine() {\n    return inputString[currentLine++];\n}\n\nfunction readIntArr() {\n    let str = readLine();\n    str = str.split(" ");\n    let arr = [];\n    for ( let i = 0; i < str.length; i++ ) {\n        arr.push(parseInt(str[i], 10));\n    }\n    return arr;\n}\n\nfunction print(x) {\n    process.stdout.write(x + "");\n}\n\nfunction main() {\n    // Input logic here\n    // Example: \n    // const n = parseInt(readLine(), 10);\n \n}

  `,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction Main(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\nMain({ name: "Test" });\n`,
  python: `\ndef Main(name):\n\tprint("Hello, " + name + "!")\n\nMain("Test")\n`,
  java: `\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace Main\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Test';\necho $name;\n",
  c: `#include <stdio.h>\n\nint main() {\n\tprintf("Hello, world!\\n");\n\treturn 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n\t\n    return 0;\n}\n`,
};
