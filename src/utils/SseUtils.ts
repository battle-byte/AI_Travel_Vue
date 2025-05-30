import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ElMessage } from "element-plus";

// 定义消息回调类型
type MessageHandler = (data: any) => void;

export class SSEService {
  private abortController: AbortController | null = null;
  async connect(
    url: string,
    method: "GET" | "POST",
    body: object,
    onMessageHandler: MessageHandler,
    myHeader?: Record<string, string> // 键值对的形式
  ) {
    // 先取消之前的连接（如果有）
    // this.disconnect();
let count = 0
    // this.abortController = new AbortController();
    return await fetchEventSource(url, {
      method: method,
      headers: {
        // "Content-Type": "text/event-stream",
        "Content-Type": "application/json",
        // "Accept":"*/*",
        // "Connection	":"keep-alive",
        // "Cache-Control":"no-cache",
      },
      body: JSON.stringify(body),
      openWhenHidden: true,
      async onopen() {
        // 可以在这里添加连接成功逻辑
      },
      onmessage(event) {
        onMessageHandler(event);
      },
      onerror(error) {
        ElMessage.error("出错了:" + error);
        // 最多允许尝试重连3次
        count++
        if (count==3){
          throw error
        }
      },
      onclose(){

      }
    });
  }
  // disconnect() {
  //   if (this.abortController) {
  //     this.abortController.abort();
  //     this.abortController = null;
  //   }
  // }
}

