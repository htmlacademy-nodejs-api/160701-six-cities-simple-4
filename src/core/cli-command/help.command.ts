import { CliCommandInterface } from './cli-command.interface';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  private commands = [
    {
      name: '--version',
      description: 'выводит номер версии',
    },
    {
      name: '--help',
      description: 'печатает этот текст',
    },
    {
      name: '--import <path>',
      description: 'импортирует данные из TSV',
    },
    {
      name: '--generate <n> <path> <url>',
      description: 'генерирует произвольное количество тестовых данных',
    },
  ];

  public async execute(): Promise<void> {
    console.log(`
    ${chalk.blue.bgRed.bold('Программа для подготовки данных для REST API сервера.')}

    Пример:
        ${chalk.inverse('main.js --<command> [--arguments]')}

    Команды:
    ${this.commands.map(({ name, description }) => `\t${chalk.inverse(name)}  # ${description}`).join('\n')}
    `);
  }
}
