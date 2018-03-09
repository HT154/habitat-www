const { spawn, spawnSync } = require('child_process');

function runCommand(command, sub) {
  const p = spawnSync(command, ['--help'], { shell: true });
  let parsed;

  function render(data) {
    parsed = parse(command, data.replace(/`/g, ''));
    console.log(markdownForCommand(parsed, sub));
    console.log(markdownForSubcommands(parsed.subcommand_items));
  }

  render(p.stderr.toString() || p.stdout.toString());

  parsed.subcommand_items.forEach(item => {
    runCommand(`${item.parent} ${item.command}`, item.parent !== 'hab');
  });
}

function parse(command, out) {
  const lines = out.split('\n');
  const sections = out.split('\n\n');

  let result = {
    name: lines[0].trim(),
    description: lines[1].trim()
  };

  sections.forEach(s => {
    const c = s.indexOf(':');
    const heading = s.slice(0, c).trim();
    const body = s.slice(c + 1);
    result[heading.trim()] = body
      .trim()
      .replace(/(\n[ ]{5,})[\w]/gm, '$2')
      .split('\n')
      .map(line => line.trim());
  });

  return {
    command: command,
    name: result.name,
    description: result.description,
    usage: result.USAGE,
    flags: result.FLAGS || [],
    args: result.ARGS || [],
    subcommands: result.SUBCOMMANDS || [],
    subcommand_items: (result.SUBCOMMANDS || [])
      .filter(line => !line.match(/help/))
      .map(line => {
        const matched = line.match(/^(\w+) (.+)$/);
        return {
          parent: `${command}`,
          command: matched ? matched[1].trim() : '',
          description: matched ? matched[2].trim() : ''
        };
    }),
    aliases: result.ALIASES || []
  };
}

function anchor(str) {
  return str.replace(/ /g, '-');
}

function markdownForHeader() {
  return `---
title: Habitat CLI
draft: false
---

# Habitat Command-Line Interface (CLI) Reference

The commands for the Habitat CLI (\`hab\`) are listed below.

Version: ${spawnSync('hab', ['--version'], { shell: true }).stdout.toString()}

`;
}

function markdownForCommand(parsed, sub) {
  return `##${sub ? '#' : ''} ${parsed.command}

${parsed.description}

**USAGE**

\`\`\`
${parsed.usage}
\`\`\`

**FLAGS**

\`\`\`
${parsed.flags.join('\n') || 'None.'}
\`\`\`

**SUBCOMMANDS**

\`\`\`
${parsed.subcommands.join('\n') || 'None.'}
\`\`\`

**ARGS**

\`\`\`
${parsed.args.join('\n') || 'None.'}
\`\`\`

**ALIASES**

\`\`\`
${parsed.aliases.join('\n') || 'None.'}
\`\`\`
[&uarr; Top](#)`;
}

function markdownForSubcommands(subcommands) {
  return `
${subcommands.map(item => `* [${item.command}](#${anchor(`${item.parent} ${item.command}`)}): ${item.description}`).join('\n')
}
`;
}

console.log(markdownForHeader());
runCommand('hab');
