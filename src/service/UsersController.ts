import service from '@/request/request'
import type { ApiResponse } from '@/request/ApiResponse'
import type {
  CreateSysUserRequest,
  SysUserLoginRequest,
  SysUserLoginResponse,
  SysUserRegisterRequest,
  SysUserUpdateRequest
} from '@/types/users'

//管理员创建新用户
export const CreateUsersAPI = (data: CreateSysUserRequest): Promise<ApiResponse<string>> => {
  return service.post('/v1/user', data)
}

// SysUserDeleteAPI 删除普通用户
export const SysUserDeleteAPI = (uid: string): Promise<ApiResponse<string>> | Promise<never> => {
  return service.delete(`/v1/user/${uid}`)
}

// SysUserRegisterAPi 用户注册
export const SysUserRegisterAPi = (
  data: SysUserRegisterRequest
): Promise<ApiResponse<string>> | Promise<never> => {
  return service.post(`/v1/user/register`, data)
}

// SysUserLoginAPi 用户注册
export const SysUserLoginAPi = (
  data: SysUserLoginRequest
): Promise<ApiResponse<SysUserLoginResponse>> | Promise<never> => {
  return service.post(`/v1/user/login`, data)
}

// SysUserUpdateAPI 修改用户信息
export const SysUserUpdateAPI = (
  data: SysUserUpdateRequest
): Promise<ApiResponse<number>> | Promise<never> => {
  return service.post(`/v1/user/save`, data)
}
