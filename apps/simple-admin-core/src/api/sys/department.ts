import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseListReq,
  BaseResp,
} from '#/api/model/baseModel';

import type {
  DepartmentInfo,
  DepartmentListResp,
} from './model/departmentModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateDepartment = '/sys-api/department/create',
  DeleteDepartment = '/sys-api/department/delete',
  GetDepartmentById = '/sys-api/department',
  GetDepartmentList = '/sys-api/department/list',
  UpdateDepartment = '/sys-api/department/update',
}

/**
 * @description: Get department list
 */

export const getDepartmentList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<DepartmentListResp>>(
    Api.GetDepartmentList,
    params,
  );
};

/**
 *  @description: Create a new department
 */
export const createDepartment = (params: DepartmentInfo) => {
  return requestClient.post<BaseResp>(Api.CreateDepartment, params);
};

/**
 *  @description: Update the department
 */
export const updateDepartment = (params: DepartmentInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateDepartment, params);
};

/**
 *  @description: Delete departments
 */
export const deleteDepartment = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteDepartment, params);
};

/**
 *  @description: Get department By ID
 */
export const getDepartmentById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<DepartmentInfo>>(
    Api.GetDepartmentById,
    params,
  );
};
