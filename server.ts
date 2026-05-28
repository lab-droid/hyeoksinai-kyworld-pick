import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for keyword generation
  app.post('/api/generate-keywords', async (req, res) => {
    try {
      const { productName, targetAudience, marketingGoal, userApiKey } = req.body || {};

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

      const ai = new GoogleGenAI({ 
        apiKey: finalKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `당신은 마케팅 전문가입니다. 다음 정보를 바탕으로 마케팅용 키워드를 추천해주세요.
마크다운 문법(*, #, - 등)을 사용하지 말고 평문으로 작성해주세요.

제품/서비스명: ${productName}
타겟 고객: ${targetAudience}
마케팅 목적: ${marketingGoal}

출력 형식:
1. 핵심 키워드 (3개)
2. 연관 키워드 (5개)
3. 롱테일 키워드 (3개)
4. 해시태그 추천 (5개)`;

      // Using gemini-3.5-flash as the recommended model for text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      return res.json({ text: response.text || '결과를 생성하지 못했습니다.' });
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
