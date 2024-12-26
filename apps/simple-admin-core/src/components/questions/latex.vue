<script lang="ts" setup>
import { type PropType } from 'vue';

import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

const props = defineProps({
  value: {
    type: String as PropType<string>,
    default: '',
  },
});
function compiledMarkdown(val: string) {
  const isLoad = MM.loadMathJax();
  if (isLoad) {
    return MM.markdownToHTML(val, {
      htmlTags: true,
      codeHighlight: {
        auto: true,
        code: true,
      },
    });
  }
}
</script>
<template>
  <div v-dompurify-html="compiledMarkdown(props.value)"></div>
</template>
