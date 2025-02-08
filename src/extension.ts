// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { commands, window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 创建component或page页面
  const createCRP: any = commands.registerCommand(
    'vue3.createComponentOrPage',
    async (fileUri) => {
      if (!fileUri) {
        return;
      }

      const createDir = path.resolve(fileUri.fsPath);
      if (!createDir) {
        return;
      }
      const cRPName: any = await window.showInputBox({
        placeHolder: '页面名称'
      });
      const styleName: any = await window.showInputBox({
        value: 'scss',
        placeHolder: 'css文件名称'
      });

      const insertStyle = styleName ? styleName : 'scss';
      const namespace = cRPName[0].toUpperCase() + cRPName?.substring(1);
      const d = path.join(createDir, cRPName);
      const f = path.join(d, 'index.vue');
      if (fs.existsSync(f)) {
        window.showErrorMessage('文件已存在！');
        return;
      }
      const s = path.join(d, 'index.' + insertStyle);
      if (fs.existsSync(s)) {
        window.showErrorMessage(insertStyle + '文件已存在!');
        return;
      }

      fs.mkdirSync(d);
      fs.writeFileSync(
        f,
        `
<template>
  <div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject, onActivated } from "vue"

</script>

<style lang="${insertStyle}" scoped>
@import './index.${insertStyle}'
</style>
			`
      );

      fs.writeFileSync(s, `// use ${insertStyle} css standard`);
    }
  );

  context.subscriptions.push(createCRP);
}

// this method is called when your extension is deactivated
export function deactivate() {}
