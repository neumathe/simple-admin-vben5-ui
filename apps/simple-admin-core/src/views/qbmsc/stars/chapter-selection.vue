<script lang="ts" setup>
import type { ChapterInfo } from '#/api/qbms/model/psChapterModel';

import { fetchAndTransformChapterList } from '#/api/qbms/psChapter';
import { getPsSubjectList } from '#/api/qbms/psSubject';
import { Menu, RadioButton, RadioGroup } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'StarChapterSelection',
});

const router = useRouter();
const subjects = ref();
const treeData = ref();
const checkedSubject = ref<number>(0);
const selectedKeys = ref<string[]>(['1']);

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
  disabled?: boolean,
): { disabled?: boolean } & MenuItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
    disabled,
  };
}

getPsSubjectList().then((res) => {
  subjects.value = res.data.data;
});

const getChapterTree = async () => {
  setTimeout(async () => {
    try {
      const res = await fetchAndTransformChapterList({
        subjectId: checkedSubject.value,
        starCount: true,
      });
      const mapChapterToItem = (chapter: ChapterInfo): MenuItemType => {
        return getItem(
          chapter.title,
          chapter.key.toString(),
          null, // 图标
          chapter.children?.map(mapChapterToItem),
          undefined,
          chapter.count === 0,
        ) as { disabled?: boolean } & MenuItemType;
      };

      const prepareTreeData = (chapters: ChapterInfo[]): MenuItemType[] => {
        return chapters.map((chapter) => ({
          ...mapChapterToItem(chapter),
          disabled: chapter.count === 0,
        }));
      };

      treeData.value = prepareTreeData(res);
    } catch (error) {
      console.error(error);
    }
  }, 0);
};

watch(selectedKeys, (val) => {
  if (val && val.length > 0 && val[0] !== '') {
    router.push(`/qbmsc/stars/${checkedSubject.value}/${val[0]}?page=1`);
  }
});
</script>

<template>
  <div
    class="bg-card mx-auto my-5 flex max-w-4xl flex-col items-center divide-y rounded-xl"
  >
    <div class="m-2 w-full py-3 pl-5 text-lg">章节选择</div>
    <div class="m-1 w-full justify-center">
      <div class="m-5 flex w-full justify-center">
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
      <div class="my-5 flex w-full justify-center">
        <Menu
          v-model:selected-keys="selectedKeys"
          :items="treeData"
          class="w-full border-none"
          mode="inline"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-menu-inline .ant-menu-selected::after),
:deep(.ant-menu-inline .ant-menu-item-selected::after) {
  opacity: 0;
}

:deep(.ant-menu-inline),
:deep(.ant-menu-vertical),
:deep(.ant-menu-vertical-left) {
  border: none;
}

:deep(.ant-menu-light.ant-menu-root.ant-menu-inline),
:deep(.ant-menu-light.ant-menu-root.ant-menu-vertical) {
  border: none;
}
</style>
