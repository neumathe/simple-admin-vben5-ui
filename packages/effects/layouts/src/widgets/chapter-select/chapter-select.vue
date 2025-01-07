<script setup lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { TreeSelect } from 'ant-design-vue';

import { fetchAndTransformChapterList } from '#/api/qbms/psChapter';

const selectedChapter = ref<string>();
const treeData = ref<TreeSelectProps['treeData']>([]);
const route = useRoute();
const router = useRouter();

/**
 * 判断一个节点是否可以被选择
 * 如果父节点的 count 等于所有子节点 count 的加和，则认为父节点无数据，不可选择
 */
const markUnselectableNodes = (nodes: TreeSelectProps['treeData']) => {
  const markNode = (node: any) => {
    if (node.children && node.children.length > 0) {
      const childrenCountSum = node.children.reduce(
        (sum: number, child: any) => sum + (child.count || 0),
        0,
      );
      node.selectable = node.count !== childrenCountSum; // 如果父节点 count 等于子节点 count 之和，不可选
      node.children.forEach((element: any) => {
        markNode(element);
      }); // 递归处理子节点
    } else {
      node.selectable = true; // 叶子节点默认可选
    }
  };
  nodes?.forEach((element) => {
    markNode(element);
  });
};

const getChapterTree = async (subjectId: string) => {
  try {
    const res = await fetchAndTransformChapterList({
      subjectId: Number.parseInt(subjectId),
    });
    markUnselectableNodes(res); // 设置节点的 selectable 属性
    treeData.value = res;
    const chapterParam = route.params.chapter as string;
    if (chapterParam) {
      selectedChapter.value = chapterParam;
    }
  } catch (error) {
    console.error(error);
  }
};

const isSequentialRoute = computed(() => {
  const { subject, chapter } = route.params;
  return (
    route.path.startsWith('/qbmsc/sequential/') &&
    subject !== undefined &&
    chapter !== undefined
  );
});

watch(selectedChapter, (val) => {
  if (val && val !== '') {
    router.replace(`/qbmsc/sequential/${route.params.subject}/${val}`);
  }
});

const handleRouteChange = () => {
  const subjectParam = route.params.subject as string;
  if (subjectParam) {
    getChapterTree(subjectParam);
  }
};

watch(() => route.params.chapter, handleRouteChange);

onMounted(() => {
  handleRouteChange();
});
</script>

<template>
  <TreeSelect
    v-if="isSequentialRoute && treeData"
    v-model:value="selectedChapter"
    :dropdown-match-select-width="300"
    :field-names="{
      children: 'children',
      label: 'title',
      value: 'key',
    }"
    :tree-data="treeData"
    placeholder="选择一个章节"
    show-checked-strategy="SHOW_PARENT"
    show-search
    style="min-width: 150px; max-width: 240px"
    tree-default-expand-all
    tree-node-filter-prop="title"
  />
</template>
