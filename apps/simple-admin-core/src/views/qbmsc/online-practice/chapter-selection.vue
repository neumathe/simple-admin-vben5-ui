<script lang="ts" setup>
import type { ChapterInfo } from '#/api/qbms/model/psChapterModel';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { RadioButton, RadioGroup, Slider, Spin, Tree } from 'ant-design-vue';

import { fetchAndTransformChapterList } from '#/api/qbms/psChapter';
import { createPsOnlinePractice } from '#/api/qbms/psOnlinePractice';
import { getPsSubjectList } from '#/api/qbms/psSubject';

defineOptions({
  name: 'ChapterSelection',
});

const router = useRouter();
const subjects = ref();
const treeData = ref();
const checkedSubject = ref<number>(1);
const checkedMode = ref<number>(1);
const selectedKeys = ref<string[]>([]);
const count = ref(25);
const loading = ref(false);
const modes = [
  {
    key: 1,
    label: '随机',
  },
  {
    key: 2,
    label: '全部',
  },
  {
    key: 3,
    label: '复习',
  },
  {
    key: 4,
    label: '高效',
  },
];

interface MenuItemType {
  key: string;
  icon?: any;
  children?: MenuItemType[];
  label: string;
  type?: 'divider' | 'group';
}

function getItem(
  label: string,
  key: string,
  icon?: any,
  children?: MenuItemType[],
  type?: 'group',
): MenuItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItemType;
}

getPsSubjectList().then((res) => {
  subjects.value = res.data.data;
});

const getChapterTree = async () => {
  setTimeout(async () => {
    try {
      const res = await fetchAndTransformChapterList({
        subjectId: checkedSubject.value,
      });
      const mapChapterToItem = (chapter: ChapterInfo): MenuItemType => {
        return getItem(
          chapter.title,
          chapter.key.toString(),
          null,
          chapter.children?.map(mapChapterToItem),
        );
      };

      treeData.value = res.map((element) => mapChapterToItem(element));
    } catch (error) {
      console.error(error);
    }
  }, 0);
};

onMounted(() => {
  getChapterTree();
});

const go = () => {
  loading.value = true;
  createPsOnlinePractice({
    subject: checkedSubject.value,
    chapters: selectedKeys.value.map((key) => Number.parseInt(key)),
    type: checkedMode.value,
    count: count.value,
  })
    .then((res) => {
      router.push(`/qbmsc/online-practice/${res.id}`);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div
    class="bg-card mx-auto my-5 flex max-w-4xl flex-col items-center divide-y rounded-xl"
  >
    <div class="m-2 w-full py-3 pl-5 text-lg">模拟考试</div>
    <div class="m-1 w-full justify-center">
      <Spin :spinning="loading" size="large">
        <div class="flex w-full justify-center py-5">
          <RadioGroup
            v-model:value="checkedSubject"
            class="w-auto"
            @change="getChapterTree"
          >
            <RadioButton
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }}
            </RadioButton>
          </RadioGroup>
        </div>
        <div class="flex w-full justify-center py-5">
          <Tree
            v-model:checked-keys="selectedKeys"
            :field-names="{
              children: 'children',
              title: 'label',
              key: 'key',
            }"
            :selectable="false"
            :tree-data="treeData"
            checkable
            class="border-none"
            mode="inline"
          />
        </div>
        <div
          class="m-auto flex max-w-lg items-center justify-center space-x-3 p-3"
        >
          <span class="flex items-center text-lg">模式</span>
          <RadioGroup
            v-model:value="checkedMode"
            class="flex w-auto items-center"
          >
            <RadioButton
              v-for="mode in modes"
              :key="mode.key"
              :value="mode.key"
            >
              {{ mode.label }}
            </RadioButton>
          </RadioGroup>
        </div>
        <div
          class="m-auto flex max-w-lg items-center justify-center space-x-3 p-3"
        >
          <span class="flex items-center text-lg">题数</span>
          <Slider v-model:value="count" :max="25" :min="10" class="w-1/2" />
        </div>
        <div class="flex w-full flex-row-reverse p-3">
          <button
            class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md border border-white/20 bg-blue-500/80 px-6 py-2 text-base font-semibold text-white backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-blue-600/50"
            @click="go"
          >
            <span class="text-lg">Go</span>
            <div
              class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
            >
              <div class="relative h-full w-10 bg-white/30"></div>
            </div>
          </button>
        </div>
      </Spin>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
