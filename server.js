require("dotenv").config();
const express = require("express");
const app = express();

// 정적 파일 제공
app.use(express.static("public"));

// 환경변수 API 엔드포인트
app.get("/api/config", (req, res) => {
  res.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
