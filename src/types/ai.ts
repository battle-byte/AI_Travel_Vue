export type Conversations = {
  conversationId: string;
  userId: string;
  title: string;
  createdAt: string;
}

export type ConversationsGrpc = {
  conversation_id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export type MessagesGrpc = {
  message_id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

export type Messages = {
  messageId: string;
  conversationId: string;
  senderType: string;
  content: string;
  createdAt: string;
}

export type CreateConversationsRequest = {
  question: string;
  uid: string;
  conversionId: string;
}

// gin路由请求参数 不用驼峰命名
export type NewChatRequest = {
  question: string;
  uid: string;
  conversion_id: string;
}

export type GetConversationsResponse = {
  conversations: Conversations;
}

export type ListConversationsResponse = {
  conversations: Conversations[];
}

export type ListMessagesByConversationResponse = {
  messages: Messages[];
}

export const AI_SENDER_TYPE = {
  SYSTEM: "system",
  USER: "user",
};
