import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseResp,
} from '#/api/model/baseModel';

import type {
  ChapterInfo,
  GetChapterReq,
  PsChapterInfo,
  PsChapterListResp,
} from './model/psChapterModel';

import { requestClient } from '#/api/request';

enum Api {
  CreatePsChapter = '/question-api/ps_chapter/create',
  DeletePsChapter = '/question-api/ps_chapter/delete',
  GetPsChapterById = '/question-api/ps_chapter',
  GetPsChapterList = '/question-api/ps_chapter/list',
  UpdatePsChapter = '/question-api/ps_chapter/update',
}

/**
 * @description: Get ps chapter list
 */

export const getPsChapterList = async (params: GetChapterReq) => {
  const cacheKey = `psChapterList_${JSON.stringify(params)}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { timestamp, data } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > 1 * 60 * 1000; // 1分钟过期

      if (!isExpired) {
        return data; // 直接返回缓存数据
      }
    } catch (error) {
      console.error('Failed to parse cache data:', error);
      localStorage.removeItem(cacheKey); // 解析失败时清除缓存
    }
  }

  try {
    const response = await requestClient.post<BaseDataResp<PsChapterListResp>>(
      Api.GetPsChapterList,
      params,
    );

    const responseData = response.data; // 确保存入的是解析后的数据

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: responseData, // 存储的是最终解析后的数据
      }),
    );

    return responseData;
  } catch (error) {
    console.error('Failed to fetch PS chapter list:', error);
    throw error;
  }
};

/**
 *  @description: Create a new ps chapter
 */
export const createPsChapter = (params: PsChapterInfo) => {
  return requestClient.post<BaseResp>(Api.CreatePsChapter, params);
};

/**
 *  @description: Update the ps chapter
 */
export const updatePsChapter = (params: PsChapterInfo) => {
  return requestClient.post<BaseResp>(Api.UpdatePsChapter, params);
};

/**
 *  @description: Delete ps chapters
 */
export const deletePsChapter = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeletePsChapter, params);
};

/**
 *  @description: Get ps chapter By ID
 */
export const getPsChapterById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PsChapterInfo>>(
    Api.GetPsChapterById,
    params,
  );
};

// 转换函数
export function transformChapters(psChapters: PsChapterInfo[]): ChapterInfo[] {
  // 创建一个映射表，方便快速查找节点
  const map = new Map<number, ChapterInfo>();
  const result: ChapterInfo[] = [];

  // 初始化所有节点
  psChapters.forEach((chapter) => {
    const node: ChapterInfo = {
      title: `${chapter.chapterName}(${chapter.count}题)`,
      key: chapter.id,
      children: [],
      count: chapter.count,
    };
    map.set(chapter.id, node);
  });

  // 构建树结构
  psChapters.forEach((chapter) => {
    const parentId = chapter.parentId;
    const node = map.get(chapter.id);

    if (node) {
      if (parentId && parentId !== 0) {
        const parentNode = map.get(parentId);
        if (parentNode) {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(node);
        }
      } else {
        // 如果没有父节点或者父节点是0，加入根节点
        result.push(node);
      }
    }
  });
  // 递归更新父节点的count字段
  const updateParentCount = (nodes: ChapterInfo[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        updateParentCount(node.children);
        if (node.count === 0) {
          node.count = node.children.reduce(
            (sum, child) => sum + child.count,
            0,
          );
          node.title = `${node.title.split('(')[0]}(${node.count}题)`;
        }
      }
    });
  };
  updateParentCount(result);

  // 移除空的 children 数组
  const cleanChildren = (nodes: ChapterInfo[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        cleanChildren(node.children);
      }
    });
  };
  cleanChildren(result);

  return result;
}

export async function fetchAndTransformChapterList(
  params: GetChapterReq,
): Promise<ChapterInfo[]> {
  if (!params.subjectId) {
    return [];
  }
  if (params.subjectId === 0) {
    return [];
  }
  try {
    const response = await getPsChapterList(params);
    const psChapterInfos = response.data || [];
    return transformChapters(psChapterInfos);
  } catch (error) {
    console.error('Failed to fetch chapter list:', error);
    throw error;
  }
}

// 找到指定 id 的上一个和下一个叶子节点
export function findSiblingLeafNodes(tree: ChapterInfo[], targetId: number) {
  const leafNodes: ChapterInfo[] = [];

  // 深度优先搜索，收集符合条件的叶子节点
  const collectLeafNodes = (nodes: ChapterInfo[]) => {
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) {
        if (node.count !== 0) {
          leafNodes.push(node);
        }
      } else {
        collectLeafNodes(node.children);
      }
    }
  };

  collectLeafNodes(tree);

  // 查找目标节点的位置
  const targetIndex = leafNodes.findIndex((node) => node.key === targetId);
  if (targetIndex === -1) {
    throw new Error(`Node with id ${targetId} not found.`);
  }

  // 获取上一个和下一个符合条件的叶子节点
  const previousLeaf = leafNodes[targetIndex - 1] || null;
  const nextLeaf = leafNodes[targetIndex + 1] || null;

  return { previousLeaf, nextLeaf };
}
