import { CliCommandInterface } from '../core/cli-command/cli-command.interface';

type ParsedCommand = Record<string, string[]>;

export default class CLIApplication {
  private commands: {
    [propertyName: string]: CliCommandInterface;
  } = {};

  public registerCommands(commandList: CliCommandInterface[]) {
    commandList.reduce((acc, command) => {
      const cliCommand = command;
      acc[cliCommand.name] = cliCommand;
      return acc;
    }, this.commands);
  }

  public parseCommand(cliArguments: string[]): ParsedCommand {
    const parseCommand: ParsedCommand = {};

    let command = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }

      return acc;
    }, parseCommand);
  }
}
