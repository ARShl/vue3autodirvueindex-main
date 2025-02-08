import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const createComponentOrPage = vscode.commands.registerCommand(
    'vue2.createComponentOrPage',
    async (fileUri: vscode.Uri) => {
      if (!fileUri) {
        vscode.window.showErrorMessage('未选择目录！');
        return;
      }

      const targetDir = path.resolve(fileUri.fsPath);
      const componentName = await vscode.window.showInputBox({
        placeHolder: '请输入组件或页面名称',
        validateInput: (value) => (value ? null : '名称不能为空')
      });

      if (!componentName) {
        return;
      }

      const styleType = await vscode.window.showInputBox({
        value: 'scss',
        placeHolder: '请输入样式文件类型（如 scss、css）'
      });

      const namespace = componentName[0].toUpperCase() + componentName.slice(1);
      const componentDir = path.join(targetDir, componentName);
      const vueFilePath = path.join(componentDir, 'index.vue');
      const styleFilePath = path.join(
        componentDir,
        `index.${styleType || 'scss'}`
      );

      if (fs.existsSync(vueFilePath)) {
        vscode.window.showErrorMessage('Vue 文件已存在！');
        return;
      }

      if (fs.existsSync(styleFilePath)) {
        vscode.window.showErrorMessage('样式文件已存在！');
        return;
      }

      try {
        fs.mkdirSync(componentDir, { recursive: true });

        const vueTemplate = `
<template>
  <div>
    <!-- ${namespace} 组件内容 -->
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted, inject, onActivated } from "vue"


</script>

<style lang="${styleType || 'scss'}" scoped>
@import './index.${styleType || 'scss'}';
</style>
        `;

        fs.writeFileSync(vueFilePath, vueTemplate);
        fs.writeFileSync(styleFilePath, `// ${namespace} 组件的样式文件`);

        vscode.window.showInformationMessage(`组件 ${namespace} 创建成功！`);
      } catch (error: any) {
        vscode.window.showErrorMessage(`创建组件失败: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(createComponentOrPage);
}

export function deactivate() {}
