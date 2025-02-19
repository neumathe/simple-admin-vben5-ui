import type { BaseDataResp, BaseIDReq, BaseResp } from '#/api/model/baseModel';

import type {
  MenuInfoPlain,
  MenuPlainListResp,
  RoleMenuResp,
} from './model/menuModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateMenu = '/sys-api/menu/create',
  DeleteMenu = '/sys-api/menu/delete',
  GetMenuById = '/sys-api/menu',
  GetMenuList = '/sys-api/menu/list',
  GetMenuListByRole = '/sys-api/menu/role/list',
  UpdateMenu = '/sys-api/menu/update',
}

/**
 * @description: Get user menu list by role id
 */

export const getMenuListByRole = () => {
  return requestClient.get<BaseDataResp<RoleMenuResp>>(Api.GetMenuListByRole);
};

/**
 * @description: Get menu list
 */

export const getMenuList = () => {
  return requestClient.get<BaseDataResp<MenuPlainListResp>>(Api.GetMenuList);
};

/**
 *  @description: Create a new menu
 */
export const createMenu = (params: MenuInfoPlain) => {
  return requestClient.post<BaseResp>(Api.CreateMenu, params);
};

/**
 *  @description: Update the menu
 */
export const updateMenu = (params: MenuInfoPlain) => {
  return requestClient.post<BaseResp>(Api.UpdateMenu, params);
};

/**
 *  @description: Delete menus
 */
export const deleteMenu = (params: BaseIDReq) => {
  return requestClient.post<BaseResp>(Api.DeleteMenu, params);
};

/**
 *  @description: Get menu By ID
 */
export const getMenuById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<MenuInfoPlain>>(
    Api.GetMenuById,
    params,
  );
};
