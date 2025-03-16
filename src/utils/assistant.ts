import { openai, assistantConfig } from "../config/openai";

export class AssistantService {
  private assistant: any;
  private thread: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Assistant 생성
      this.assistant = await openai.beta.assistants.create({
        name: "Custom Assistant",
        description: "A custom assistant for specific tasks",
        model: assistantConfig.model,
        tools: [{ type: "code_interpreter" }],
        instructions:
          "You are a helpful assistant that provides clear and concise responses.",
      });

      // Thread 생성
      this.thread = await openai.beta.threads.create();
    } catch (error) {
      console.error("Assistant initialization failed:", error);
      throw error;
    }
  }

  async sendMessage(message: string) {
    try {
      // 메시지 추가
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: message,
      });

      // 실행
      const run = await openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.assistant.id,
      });

      // 실행 완료 대기
      let runStatus = await openai.beta.threads.runs.retrieve(
        this.thread.id,
        run.id
      );

      while (
        runStatus.status === "queued" ||
        runStatus.status === "in_progress"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(
          this.thread.id,
          run.id
        );
      }

      // 응답 가져오기
      const messages = await openai.beta.threads.messages.list(this.thread.id);

      return messages.data[0].content[0];
    } catch (error) {
      console.error("Message processing failed:", error);
      throw error;
    }
  }

  async cleanup() {
    try {
      // Assistant와 Thread 정리
      if (this.assistant) {
        await openai.beta.assistants.del(this.assistant.id);
      }
      if (this.thread) {
        await openai.beta.threads.del(this.thread.id);
      }
    } catch (error) {
      console.error("Cleanup failed:", error);
      throw error;
    }
  }
}
