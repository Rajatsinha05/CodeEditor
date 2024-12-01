export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "17",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "C17",
  cpp: "C++17",
};

export const CODE_SNIPPETS = {
  javascript: `'use strict';\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\n\nlet inputString = '';\nlet currentLine = 0;\n\nprocess.stdin.on('data', inputStdin => {\n    inputString += inputStdin;\n});\n\nprocess.stdin.on('end', _ => {\n    inputString = inputString.trim()\n.split('\\n')\n.map(string => {\n        return string.replace(/\\s+/g, " ").trim();\n    });\n    main();\n});\n\nfunction readLine() {\n    return inputString[currentLine++];\n}\n\nfunction solve() {\n    // Write the logic to solve each test case here\n}\n\nfunction main() {\n    const tc = parseInt(readLine(), 10);\n    while (tc-- > 0) {\n        solve();\n    }\n}\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction Main(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\nMain({ name: "Test" });\n`,
  python: `\ndef Main(name):\n\tprint("Hello, " + name + "!")\n\nMain("Test")\n`,
  java: `import java.util.Scanner;\n\npublic class Main {\n\n    public static void solve() {\n        // Write the logic to solve each test case here\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int tc = scanner.nextInt();\n        \n        while (tc-- > 0) {\n            solve();\n        }\n        \n        scanner.close();\n    }\n}\n`,

  csharp:
    'using System;\n\nnamespace Main\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Test';\necho $name;\n",
  c: `#include <stdio.h>\n\nvoid solve() {\n    // Write the logic to solve each test case here\n}\n\nint main() {\n    int tc;\n    scanf("%d", &tc);\n    \n    while (tc-- > 0) {\n        solve();\n    }\n    \n    return 0;\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Write the logic to solve each test case here\n}\n\nint main() {\n    int tc;\n    cin >> tc;\n    \n    while (tc-- > 0) {\n        solve();\n    }\n    \n    return 0;\n}\n`,
};
