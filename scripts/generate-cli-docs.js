const { spawnSync } = require('child_process');

function getHelp(command, sub) {
  const proc = runCommand(command, ['--help']);

  function render(data) {
    parsed = parseOutput(command, data.replace(/`/g, ''));
    console.log(markdownForCommand(parsed, sub));
    console.log(markdownForSubcommands(parsed.subcommands));

    parsed.subcommands.forEach(item => {
      getHelp(`${item.parent} ${item.command}`, item.parent !== 'hab');
    });
  }

  render(proc.stderr.toString() || proc.stdout.toString());
}

function runCommand(command, args) {
  return spawnSync(command, args, { shell: true });
}

function parseOutput(command, output) {
  const lines = output.split('\n');
  const sections = output.split('\n\n');

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
      .map(line => line.trim().replace(/^--/, '    --'));
  });

  return {
    command: command,
    name: result.name,
    description: result.description,
    aliases: result.ALIASES || [],
    args: result.ARGS || [],
    flags: result.FLAGS || [],
    subcommands_body: result.SUBCOMMANDS || [],
    subcommands: (result.SUBCOMMANDS || [])
      .filter(line => !line.match(/help/))
      .map(line => {
        const matched = line.match(/^(\w+) (.+)$/);
        return {
          parent: `${command}`,
          command: matched ? matched[1].trim() : '',
          description: matched ? matched[2].trim() : ''
        };
    }),
    usage: result.USAGE || [],
  };
}

function os() {
  return require('os');
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

* Version: ${runCommand('hab', ['--version']).stdout.toString()}
* Platform: ${os().platform}
* Generated: ${new Date().toString()}

`;
}

function markdownForCommand(parsed, sub) {
  return `##${sub ? '#' : ''} ${parsed.command}

${subsection('Description', parsed.description)}

${subsection('Usage', parsed.usage.join('\n').replace(/^hab-/, 'hab ').replace(/hab butterfly/, 'hab'))}

${subsection('Flags', parsed.flags.join('\n'))}

${subsection('Subcommands', parsed.subcommands_body.join('\n'))}

${subsection('Args', parsed.args.join('\n'))}

${subsection('Aliases', parsed.aliases.join('\n'))}

[&uarr; Top](#)`;
}

function markdownForSubcommands(subcommands) {
  return `
${subcommands.map(item => `* [${item.command}](#${anchor(`${item.parent} ${item.command}`)}): ${item.description}`).join('\n')
}
`;
}

function subsection(title, data) {
  if (data) {
    return `**${title.toUpperCase()}**

\`\`\`
${data}
\`\`\`
`
  }

  return '';
}

console.log(markdownForHeader());
getHelp('hab');
