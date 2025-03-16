var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { openai, assistantConfig } from "../config/openai";
export class AssistantService {
    constructor() {
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Assistant 생성
                this.assistant = yield openai.beta.assistants.create({
                    name: "Custom Assistant",
                    description: "A custom assistant for specific tasks",
                    model: assistantConfig.model,
                    tools: [{ type: "code_interpreter" }],
                    instructions: "You are a helpful assistant that provides clear and concise responses.",
                });
                // Thread 생성
                this.thread = yield openai.beta.threads.create();
            }
            catch (error) {
                console.error("Assistant initialization failed:", error);
                throw error;
            }
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 메시지 추가
                yield openai.beta.threads.messages.create(this.thread.id, {
                    role: "user",
                    content: message,
                });
                // 실행
                const run = yield openai.beta.threads.runs.create(this.thread.id, {
                    assistant_id: this.assistant.id,
                });
                // 실행 완료 대기
                let runStatus = yield openai.beta.threads.runs.retrieve(this.thread.id, run.id);
                while (runStatus.status === "queued" ||
                    runStatus.status === "in_progress") {
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                    runStatus = yield openai.beta.threads.runs.retrieve(this.thread.id, run.id);
                }
                // 응답 가져오기
                const messages = yield openai.beta.threads.messages.list(this.thread.id);
                return messages.data[0].content[0];
            }
            catch (error) {
                console.error("Message processing failed:", error);
                throw error;
            }
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Assistant와 Thread 정리
                if (this.assistant) {
                    yield openai.beta.assistants.del(this.assistant.id);
                }
                if (this.thread) {
                    yield openai.beta.threads.del(this.thread.id);
                }
            }
            catch (error) {
                console.error("Cleanup failed:", error);
                throw error;
            }
        });
    }
}
