import { OpenAI } from "openai";
// OpenAI 설정
export const openaiConfig = {
    apiKey: process.env.OPENAI_API_KEY, // API 키는 환경변수에서 가져옵니다
    organization: process.env.OPENAI_ORGANIZATION, // 선택적: 조직 ID
};
// OpenAI 클라이언트 인스턴스 생성
export const openai = new OpenAI({
    apiKey: openaiConfig.apiKey,
    organization: openaiConfig.organization,
});
// Assistant 관련 설정
export const assistantConfig = {
    model: "gpt-4-turbo-preview", // 사용할 모델
    temperature: 0.7,
    maxTokens: 2000,
};
