import "dotenv/config";
import { openai } from "../config/openai";
import { AssistantService } from "../utils/assistant";

async function testOpenAIConnection() {
  console.log("🔍 OpenAI 연결 테스트 시작...");

  try {
    // 1. 기본 API 연결 테스트
    console.log("1️⃣ 기본 API 연결 테스트...");
    const models = await openai.models.list();
    console.log("✅ API 연결 성공! 사용 가능한 모델 수:", models.data.length);

    // 2. Assistant 서비스 테스트
    console.log("\n2️⃣ Assistant 서비스 테스트...");
    const assistant = new AssistantService();

    // 간단한 메시지 전송 테스트
    console.log("📤 테스트 메시지 전송 중...");
    const response = await assistant.sendMessage(
      "안녕하세요! 간단한 테스트 메시지입니다. 1+1은 얼마인가요?"
    );
    console.log("📥 Assistant 응답:", response);

    // 정리
    console.log("\n🧹 리소스 정리 중...");
    await assistant.cleanup();
    console.log("✅ 테스트 완료!");
  } catch (error) {
    console.error("❌ 테스트 실패:", error);
    throw error;
  }
}

// 테스트 실행
console.log("🚀 OpenAI 환경 테스트 시작\n");
testOpenAIConnection()
  .then(() => console.log("\n✨ 모든 테스트가 성공적으로 완료되었습니다."))
  .catch((error) =>
    console.error("\n💥 테스트 중 오류가 발생했습니다:", error)
  );
