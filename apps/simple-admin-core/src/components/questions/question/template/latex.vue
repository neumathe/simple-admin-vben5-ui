<script lang="ts" setup>
import type { PropType } from 'vue';

import { useQuestionConfig } from '#/store/questionConfig';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

const props = defineProps({
  value: {
    type: String as PropType<string>,
    default: '',
  },
});
const questionConfig = useQuestionConfig();
// Compile Markdown using Mathpix
function compiledMarkdown(val: string) {
  const isLoad = MM.loadMathJax();
  if (isLoad) {
    return MM.render(val, {
      htmlTags: true,
      breaks: false,
      fontSize: 10 + questionConfig.fontSize,
    });
  }
}

// Helper to split text by character type
function splitTextByType(text: string) {
  const regex = /([\u4E00-\u9FA5]+)|([a-z]+)|(\d+)|([^\u4E00-\u9FA5a-z\d]+)/gi;
  const matches = text.matchAll(regex);
  return [...matches].map((match) => ({
    text: match[0],
    type: (() => {
      if (match[1]) return 'chinese';
      if (match[2]) return 'english';
      if (match[3]) return 'number';
      return 'other';
    })(),
  }));
}

function processHtml(html: string | undefined) {
  if (!html) return '';
  const container = document.createElement('div');
  container.innerHTML = html;

  function traverseNodes(node: Node): Node {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim() === '') return node;
      if (node.parentNode?.nodeName.toLowerCase() === 'text') {
        return node;
      }
      const segments = splitTextByType(text);
      const fragment = document.createDocumentFragment();
      segments.forEach((segment) => {
        const span = document.createElement('span');
        span.textContent = segment.text;
        switch (segment.type) {
          case 'chinese': {
            span.className = 'font-chinese';
            span.style.fontSize = `${questionConfig.fontSize + 10}px`;
            break;
          }
          case 'english': {
            span.className = 'font-english';
            span.style.fontSize = `${questionConfig.fontSize + 10}px`;

            break;
          }
          case 'number': {
            span.className = 'font-number';
            span.style.fontSize = `${questionConfig.fontSize + 10}px`;

            break;
          }
          default: {
            span.className = '';
          }
        }
        fragment.append(span);
      });
      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const childNodes = [...element.childNodes];
      childNodes.forEach((child) => {
        const processed = traverseNodes(child);
        if (processed !== child) {
          child.replaceWith(processed);
        }
      });
    }
    return node;
  }

  const childNodes = [...container.childNodes];
  childNodes.forEach((child) => {
    const processed = traverseNodes(child);
    if (processed !== child) {
      child.replaceWith(processed);
    }
  });
  return container.innerHTML;
}
</script>

<template>
  <div class="inline-block w-full">
    <!-- Render compiled Markdown if value contains '$' -->
    <div
      v-if="props.value.includes('$')"
      v-dompurify-html="processHtml(compiledMarkdown(props.value))"
    ></div>
    <div v-else>
      <template
        v-for="(segment, idx) in splitTextByType(props.value)"
        :key="idx"
      >
        <span
          :class="{
            'font-chinese': segment.type === 'chinese',
            'font-english': segment.type === 'english',
            'font-number': segment.type === 'number',
          }"
          :style="{ fontSize: `${questionConfig.fontSize + 10}px` }"
        >
          {{ segment.text }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.font-chinese {
  font-family: SimSun, serif;
}

.font-english {
  font-family: 'Times New Roman', serif;
}

.font-number {
  font-family: 'Times New Roman', serif;
}

.math-inline {
  max-width: none !important;
  vertical-align: middle;
}

svg {
  width: initial !important;
  max-width: none !important;
  height: initial !important;
  max-height: none !important;
}
</style>
