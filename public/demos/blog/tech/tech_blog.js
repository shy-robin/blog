document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    const terminalBody = document.getElementById('terminal-body');

    const articles = {
        'hello-world': {
            title: 'Hello World: My First Post',
            content: `This is my first post on my new terminal-style blog.
It's a bit different, isn't it?
I hope you like it.`
        },
        'tech-stack': {
            title: 'The Tech Stack Behind This Blog',
            content: `This blog is built with:
- HTML5
- CSS3 (with custom properties for theming)
- Vanilla JavaScript (no frameworks!)`
        }
    };

    const commands = {
        help: () => {
            return `Available commands:
- help: Show this help message
- ls: List all articles
- cat [article-name]: Read an article
- about: Show information about me
- clear: Clear the terminal screen`;
        },
        ls: () => {
            return Object.keys(articles).map(key => `- ${key}`).join('\n');
        },
        cat: (args) => {
            const articleName = args[0];
            if (articles[articleName]) {
                return `\n--- ${articles[articleName].title} ---\n\n${articles[articleName].content}`;
            }
            return `Error: Article '${articleName}' not found.`;
        },
        about: () => {
            return 'I am a developer who loves creating unique things. This blog is one of them.';
        },
        clear: () => {
            output.innerHTML = '';
            return '';
        }
    };

    const printToTerminal = (text, className = 'output-line') => {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        output.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const executeCommand = (command) => {
        printToTerminal(`> ${command}`, 'output-line command');
        const [cmd, ...args] = command.split(' ');
        if (commands[cmd]) {
            const result = commands[cmd](args);
            if (result) {
                printToTerminal(result);
            }
        }
        else {
            printToTerminal(`Error: Command not found: ${cmd}`, 'output-line error');
        }
        commandInput.value = '';
    };

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(commandInput.value.trim());
        }
    });

    // Initial welcome message
    printToTerminal('Welcome to my Digital Terminal!');
    printToTerminal('Type "help" to see available commands.');
});