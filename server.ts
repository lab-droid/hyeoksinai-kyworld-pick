import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API endpoint for keyword generation
  app.post('/api/generate-keywords', async (req, res) => {
    try {
      const { productName, targetAudience, marketingGoal, targetRequirement = '일반 수익화 기반 추천', keywordCount = 5, userApiKey } = req.body || {};

      if (!productName || !targetAudience || !marketingGoal) {
        return res.status(400).json({ error: '모든 입력 항목을 채워주세요.' });
      }

      // Determine API Key
      // If process.env.GEMINI_API_KEY is just a placeholder, ignore it
      let serverKey = process.env.GEMINI_API_KEY || '';
      if (serverKey === 'MY_GEMINI_API_KEY' || serverKey === 'YOUR_GEMINI_API_KEY' || serverKey.includes('placeholder')) {
        serverKey = '';
      }

      const finalKey = (userApiKey && userApiKey.trim()) ? userApiKey.trim() : serverKey;

      if (!finalKey) {
        return res.status(400).json({ 
          error: 'API Key가 설정되지 않았습니다. 우측 상단의 API Key 버튼을 클릭하여 입력하거나 설정 패널을 확인해주세요.' 
        });
      }

      // Check for non-ASCII characters in the API key (e.g. Korean letters) to prevent ByteString conversion errors in fetch headers
      if (/[^\x00-\x7F]/.test(finalKey)) {
        return res.status(400).json({
          error: 'API Key에 한글 등 올바르지 않은 문자나 설명용 텍스트가 포함되어 있습니다. 영어와 숫자로 구성된 유효한 Gemini API Key를 입력해주세요.'
        });
      }

      const ai = new GoogleGenAI({ 
        apiKey: finalKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `당신은 대한민국 최고의 마케팅 및 비즈니스 전략 전문가입니다. 다음 정보를 바탕으로 실전에서 즉시 사용할 수 있는 마케팅용 키워드를 총 ${keywordCount}개 추천하고, 분석 리포트를 작성해주세요.
가독성을 위해 깔끔한 줄바꿈과 띄어쓰기를 사용해 정돈된 텍스트로 답해주시고, 마크다운 특수문자(*, #, -, \` 등)를 전혀 사용하지 않는 일반 평문(Plain text) 형식으로 작성해주세요.

[입력 정보]
- 제품/서비스명: ${productName}
- 타겟 고객: ${targetAudience}
- 마케팅 목적: ${marketingGoal}
- 핵심 요구사항: ${targetRequirement}
- 요청 추출 키워드 개수: ${keywordCount}개

[작성 요구사항]
추천된 각 키워드별로 다음 두 가지 항목을 반드시 구체적이고 자세하게 서술해 주세요:
1) 왜 해당 키워드를 선정 및 추천하였는지에 대한 '추천 사유' (타겟 고객의 심리, 검색 의도, 시장 트렌드는 물론 우리 브랜드의 핵심 요구사항인 '${targetRequirement}'에 어떻게 부합하는지를 긴밀하게 반영)
2) 이 키워드를 어떻게 실제 비즈니스 매출 및 수익 창출과 유기적으로 연결시킬 수 있는지에 대한 '수익화 연관성' (구매 전환 경로, 락인 전략, 상품 구성과의 관계 등)

[출력 형식]
추천 키워드 리포트 (요청 개수: ${keywordCount}개)

[키워드 1] 키워드명
• 추천 사유: (상세 기재)
• 수익화 연관성: (상세 기재)

[키워드 2] 키워드명
• 추천 사유: (상세 기재)
• 수익화 연관성: (상세 기재)

... (지정한 ${keywordCount}번째 키워드까지 반복 작성)

※ 추가 해시태그 추천 (5개):
#해시태그1 #해시태그2 #해시태그3 #해시태그4 #해시태그5`;

      // Using gemini-3.5-flash as the default, but fall back to other robust models if overloaded/rate limited
      const modelsToTry = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let responseText = '';
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting keyword generation using model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });
          if (response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} failed or overloaded. Trying next model. Error details:`, err);
          
          // If the error seems to be due to wrong API key, do not try other models
          const errMsg = (err?.message || String(err)).toLowerCase();
          if (errMsg.includes('api key not valid') || errMsg.includes('invalid') || errMsg.includes('api_key_invalid')) {
            throw err;
          }
        }
      }

      if (!responseText) {
        throw lastError || new Error('추천 결과를 생성하는 데 실패했습니다.');
      }

      return res.json({ text: responseText });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const errorMessage = error?.message || String(error);
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false, // Explicitly disable HMR to avoid port 24678 conflicts
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite dev middleware loaded successfully.');
    } catch (viteError) {
      console.error('Failed to initialize Vite middleware:', viteError);
      // Fallback to serving dist in case of Vite middleware issues
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
