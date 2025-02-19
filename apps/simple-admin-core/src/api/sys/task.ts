import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseListReq,
  BaseResp,
} from '#/api/model/baseModel';

import type { TaskInfo, TaskListResp } from './model/taskModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateTask = '/sys-api/task/create',
  DeleteTask = '/sys-api/task/delete',
  GetTaskById = '/sys-api/task',
  GetTaskList = '/sys-api/task/list',
  UpdateTask = '/sys-api/task/update',
}

/**
 * @description: Get task list
 */

export const getTaskList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<TaskListResp>>(
    Api.GetTaskList,
    params,
  );
};

/**
 *  @description: Create a new task
 */
export const createTask = (params: TaskInfo) => {
  return requestClient.post<BaseResp>(Api.CreateTask, params);
};

/**
 *  @description: Update the task
 */
export const updateTask = (params: TaskInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateTask, params);
};

/**
 *  @description: Delete tasks
 */
export const deleteTask = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteTask, params);
};

/**
 *  @description: Get task By ID
 */
export const getTaskById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<TaskInfo>>(Api.GetTaskById, params);
};
