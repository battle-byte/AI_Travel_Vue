import service from '@/request/request'
import type { ApiResponse } from '@/request/ApiResponse'
import type {
  Conversations,
  CreateConversationsRequest, GetConversationsResponse,
  ListConversationsResponse,
  ListMessagesByConversationResponse
} from '@/types/ai'

//CreateConversations
export const CreateConversationsAPI = (
  data: CreateConversationsRequest
): Promise<ApiResponse<string>> => {
  return service.post('/v1/ai', data)
}

// GetConversations
export const GetConversationsAPI = (cid: string): Promise<ApiResponse<GetConversationsResponse>> => {
  return service.get(`/v1/ai/c/${cid}`)
}

// ListConversations
export const ListConversationsAPI = (uid: string): Promise<ApiResponse<ListConversationsResponse>> => {
  return service.get(`/v1/ai/cs/${uid}`)
}

// SysUserLoginAPi 用户注册
export const ListMessagesByConversationAPI = (
  cid: string
): Promise<ApiResponse<ListMessagesByConversationResponse>> => {
  return service.get(`/v1/ai/ms/${cid}`)
}
