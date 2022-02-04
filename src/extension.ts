import * as vscode from 'vscode';

import { notEmpty, compareBy } from './utils';

interface QuickOpenOption extends vscode.QuickPickItem {
  label: string;
  filter: RegExp;
  glob: string;
  results?: number,
  sort?: 'ASC' | 'DESC'
}

interface OptionFile extends vscode.QuickPickItem {
  label: string;
  file: vscode.Uri;
}

const quickOpenOptions: QuickOpenOption[] = [
  {
    label: 'Unit - Entry Point',
    filter: RegExp(/app\/units\/(.*)\/entry_point\.rb$/),
    glob: 'app/units/**/entry_point.rb',
  },
  {
    label: 'Unit - Action',
    filter: RegExp(/app\/units\/(.*)\/action\.rb$/),
    glob: 'app/units/**/action.rb',
  },
  {
    label: 'Core - Form',
    filter: RegExp(/app\/units\/core\/forms\/(.*)$/),
    glob: 'app/units/core/forms/**/*.rb',
  },
  {
    label: 'Core - Query',
    filter: RegExp(/app\/units\/core\/queries\/(.*)$/),
    glob: 'app/units/core/queries/**/*.rb',
  },
  {
    label: 'Authorizer',
    filter: RegExp(/app\/authorizers\/(.*)$/),
    glob: 'app/authorizers/**/*.rb',
  },
  {
    label: 'Dependencies',
    filter: RegExp(/app\/dependencies\/(.*)$/),
    glob: 'app/dependencies/*.rb',
  },
  {
    label: 'Migration',
    filter: RegExp(/db\/migrate\/(.*)$/),
    glob: 'db/migrate/**/*.rb',
    results: 20,
    sort: 'DESC'
  },
  {
    label: 'Model',
    filter: RegExp(/app\/models\/(.*)$/),
    glob: 'app/models/**/*.rb',
  },
];

function fileToOption(option: QuickOpenOption) {
  return (file: vscode.Uri): OptionFile | undefined => {
    const match = option.filter.exec(file.path);
    if (match && match[1]) {
      return { label: match[1], file: file };
    }
  };
}

function itemSelected(item?: QuickOpenOption) {
  if (item) {
    vscode.workspace.findFiles(item.glob, '**/node_modules/**').then(files => {
      let items = files.map(fileToOption(item)).filter(notEmpty).sort(compareBy('label'));

      if (item.sort === 'DESC') {
        items = items.reverse();
      }

      if (item.results) {
        items = items.slice(0, item.results);
      }

      vscode.window.showQuickPick(items).then(option => {
        if (option) {
          vscode.window.showTextDocument(option.file);
        }
      });
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('smart-vscode.smartQuickOpen', () => {
      vscode.window.showQuickPick(quickOpenOptions).then(itemSelected);
    })
  );
}

export function deactivate() { }
