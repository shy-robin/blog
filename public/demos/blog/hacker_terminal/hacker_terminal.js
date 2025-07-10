const output = document.getElementById('output');

const lines = [
    { text: 'Booting system...', type: 'response' },
    { text: 'Connecting to network...', type: 'response' },
    { text: 'Connection established.', type: 'response' },
    { text: ' ', type: 'response' },
    { text: 'cat blog_post.txt', type: 'command' },
    { text: 'Title: The Command Line Life', type: 'response' },
    { text: 'Author: 0xDEADBEEF', type: 'response' },
    { text: '--------------------------------', type: 'response' },
    { text: 'For some, the command line is a relic of the past. A black screen with cryptic text. But for us, it is home. It is a place of power, precision, and unparalleled efficiency.', type: 'response' },
    { text: ' ', type: 'response' },
    { text: 'There is a certain beauty in the simplicity of it all. No distractions, no clutter. Just you and the machine, speaking the same language. Every command is a conversation, every script a story.', type: 'response' },
    { text: ' ', type: 'response' },
    { text: 'This is not just about nostalgia. It is about control. It is about understanding the tools you use, and bending them to your will. Welcome to the terminal.', type: 'response' },
];

let lineIndex = 0;

function typeLine() {
    if (lineIndex < lines.length) {
        const p = document.createElement('p');
        const line = lines[lineIndex];
        p.className = line.type;

        if (line.type === 'command') {
            p.textContent = `user@localhost:~$ ${line.text}`;
        } else {
            p.textContent = line.text;
        }
        
        output.appendChild(p);
        lineIndex++;
        setTimeout(typeLine, Math.random() * 200 + 50);
        output.scrollTop = output.scrollHeight;
    }
}

typeLine();
