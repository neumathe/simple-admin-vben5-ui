<script lang="ts" setup>
import { fetchAndTransformChapterList } from '#/api/qbms/psChapter';
import { getPsSubjectList } from '#/api/qbms/psSubject';
import { Page } from '@vben/common-ui';
import { Select, SelectOption, Tree } from 'ant-design-vue';
import { ref } from 'vue';

defineOptions({
  name: 'ChapterManagement',
});

const subjects = ref();
const treeData = ref();
const checkedSubject = ref();

getPsSubjectList().then((res) => {
  subjects.value = res.data.data;
});

const getChapterTree = async (value: any) => {
  setTimeout(async () => {
    try {
      const res = await fetchAndTransformChapterList({
        subjectId: value,
      });
      treeData.value = res;
    } catch (error) {
      console.error(error);
    }
  }, 0);
};
</script>

<template>
  <Page auto-content-height class="bg-card h-full rounded-md">
    <Select
      v-model:value="checkedSubject"
      class="mb-6"
      style="width: 120px"
      @change="getChapterTree"
    >
      <SelectOption
        v-for="subject in subjects"
        :key="subject.id"
        :value="subject.id"
      >
        {{ subject.name }}
      </SelectOption>
    </Select>
    <Tree :tree-data="treeData" />
  </Page>
</template>
