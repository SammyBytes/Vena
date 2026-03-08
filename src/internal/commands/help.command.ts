export const showHelp = () => {
  const cyan = "\x1b[36m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const gray = "\x1b[90m";
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  console.log(`
${cyan}${bold}V E N A${reset} ${gray}- Database Versioning CLI${reset}

${yellow}${bold}USAGE:${reset}
  $ vena <command> [arguments]

${yellow}${bold}COMMANDS:${reset}
  ${green}init${reset} <name> [engine] [host] [port] [user] [pass]
    ${gray}Initialize a new Vena project and local tracking database.${reset}

  ${green}branch${reset} <name>
    ${gray}Create a new physical database branch from the main schema.${reset}

  ${green}status${reset}
    ${gray}Show the current branch, sync status, and pending migrations.${reset}

  ${green}commit${reset} <name> [description]
    ${gray}Take a snapshot of the current schema and save it as a migration.${reset}

${yellow}${bold}EXAMPLES:${reset}
  ${gray}# Start a project${reset}
  $ vena init my_api mariadb localhost 3306 root 12345

  ${gray}# Create a feature branch database${reset}
  $ vena branch feat/add-users

  ${gray}# Save your schema changes${reset}
  $ vena commit add_profile_table "Added bio and avatar columns"
  `);
};
