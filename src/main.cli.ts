import CLIApplication from './app/cli.js';
import HelpCommand from './core/cli-command/help.command';
import VersionCommand from './core/cli-command/version.command';

const myManager = new CLIApplication();

myManager.registerCommands([new HelpCommand(), new VersionCommand()]);
myManager.processCommand(process.argv);
