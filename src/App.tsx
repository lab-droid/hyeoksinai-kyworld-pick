import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Settings, Info, ExternalLink, Mail, X, CheckCircle2, AlertCircle, Loader2, History, Coins } from 'lucide-react';

const PATCH_NOTES = [
  { date: '2026-04-19', content: '패치노트 기능 추가, API 예상 비용 표시 기능 추가, 초기 팝업 비활성화' },
  { date: '2026-04-11', content: '상단 이미지 데이터 분석 테마로 변경' },
  { date: '2026-04-11', content: 'alert() 오류 수정 및 로딩 시각화 개선' },
  { date: '2026-04-11', content: '이미지 배너 최적화 및 복사 방지 기능 추가' },
  { date: '2026-04-11', content: '초기 빌드 생성 및 UI/UX 개선' },
];

export default function App() {
  const [apiKey, setApiKey] = useState(process.env.GEMINI_API_KEY || '');
  const [userApiKey, setUserApiKey] = useState('');
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [marketingGoal, setMarketingGoal] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showApiCost, setShowApiCost] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const hasApiKey = apiKey.trim().length > 0;

  const handleGenerate = async () => {
    if (!hasApiKey) {
      setAlertMessage('API Key가 필요합니다. 우측 상단 설정에서 API Key를 입력해주세요.');
      setShowApiKeyModal(true);
      return;
    }
    if (!productName || !targetAudience || !marketingGoal) {
      setAlertMessage('모든 입력 항목을 채워주세요.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setOutput('');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
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

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      clearInterval(progressInterval);
      setProgress(100);
      try {
        setOutput(response.text || '결과를 생성하지 못했습니다.');
      } catch (e) {
        setOutput('결과를 생성하지 못했습니다. (응답이 차단되었거나 텍스트가 없습니다.)');
      }
    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setProgress(0);
      setAlertMessage('키워드 생성 중 오류가 발생했습니다. API Key가 유효한지 확인해주세요.\n\n상세 오류: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(userApiKey);
    setShowApiKeyModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col relative">
      {/* Top Image Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-neutral-800 overflow-hidden shrink-0">
        <img 
          src="https://picsum.photos/seed/data-analysis/1920/1080?grayscale" 
          alt="Innovation Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-10000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-radial-[at_center] from-transparent to-neutral-900/40 z-[1]"></div>
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter text-center px-4 drop-shadow-2xl">
            혁신 키워드 추천 AI
          </h1>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex flex-wrap justify-end gap-2 z-10">
        <button 
          onClick={() => setShowApiCost(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-sm font-medium hover:bg-white transition-colors"
        >
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">예상 비용</span>
        </button>
        <button 
          onClick={() => setShowPatchNotes(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-sm font-medium hover:bg-white transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">패치노트</span>
        </button>
        <button 
          onClick={() => setShowInstructions(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-sm font-medium hover:bg-white transition-colors"
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">사용방법</span>
        </button>
        <button 
          onClick={() => setShowApiKeyModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-sm font-medium hover:bg-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">API Key</span>
          {hasApiKey ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-8">
        
        {/* Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">키워드 추천 정보 입력</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">제품/서비스명</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="예: 혁신 AI 플랫폼"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-800 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">타겟 고객</label>
              <input 
                type="text" 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="예: 2030 직장인, 마케터"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-800 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">마케팅 목적</label>
              <input 
                type="text" 
                value={marketingGoal}
                onChange={(e) => setMarketingGoal(e.target.value)}
                placeholder="예: 브랜드 인지도 향상, 신규 가입자 유치"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-800 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 bg-neutral-900 text-white py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  생성 중... {progress}%
                </>
              ) : (
                '키워드 추천 받기'
              )}
            </button>
            
            {isGenerating && (
              <div className="w-full bg-neutral-200 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-neutral-900 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </section>

        {/* Output Section */}
        {output && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4">추천 키워드 결과</h2>
            <div className="bg-neutral-50 p-4 rounded-md border border-neutral-100 min-h-[200px]">
              <pre className="whitespace-pre-wrap font-sans text-neutral-800 select-none pointer-events-none">
                {output}
              </pre>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-right">※ 결과물은 복사할 수 없습니다.</p>
          </section>
        )}

      </main>

      {/* Footer Controls */}
      <div className="fixed bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border border-neutral-200 text-sm font-medium text-neutral-600">
          개발자: 정혁신
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10 items-end">
        <a 
          href="https://hyeoksinai.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md shadow-md text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          혁신AI 플랫폼 바로가기
        </a>
        <button 
          onClick={() => setShowContactModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-800 rounded-md shadow-md border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors"
        >
          <Mail className="w-4 h-4" />
          오류/유지보수 문의
        </button>
      </div>

      {/* Modals */}
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              사용방법
            </h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>1. 우측 상단의 <strong>API Key</strong> 버튼을 눌러 Google Gemini API Key를 입력합니다.</p>
              <p>2. <strong>제품/서비스명</strong>을 구체적으로 입력합니다.</p>
              <p>3. <strong>타겟 고객</strong>의 연령, 직업, 관심사 등을 입력합니다.</p>
              <p>4. <strong>마케팅 목적</strong>(예: 인지도 향상, 전환율 증가)을 입력합니다.</p>
              <p>5. <strong>키워드 추천 받기</strong> 버튼을 클릭하여 결과를 확인합니다.</p>
              <div className="mt-4 p-3 bg-neutral-50 rounded-md border border-neutral-100 text-xs">
                <p className="font-medium text-neutral-800 mb-1">업데이트 노트 (최신)</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>UI/UX 개선 및 진행률 표시 기능 추가</li>
                  <li>결과물 복사 방지 기능 적용</li>
                  <li>API Key 상태 시각화 추가</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowApiKeyModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Key 설정
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              웹 배포 환경에서 사용하기 위해 Google Gemini API Key를 입력해주세요.
            </p>
            <input 
              type="password" 
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-800 focus:border-transparent outline-none transition-all mb-4"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 bg-neutral-100 text-neutral-800 py-2 rounded-md font-medium hover:bg-neutral-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleSaveApiKey}
                className="flex-1 bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              오류/유지보수 문의
            </h3>
            <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-sm text-neutral-700 leading-relaxed">
              업데이트나 유지보수가 필요할 경우 아래 이메일로 어떤 부분이 필요한지 상세하게 작성 후 보내주세요.<br/><br/>
              <a href="mailto:info@nextin.ai.kr" className="font-bold text-blue-600 hover:underline">info@nextin.ai.kr</a>
            </div>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              알림
            </h3>
            <p className="text-sm text-neutral-700 mb-6 whitespace-pre-wrap leading-relaxed">
              {alertMessage}
            </p>
            <button 
              onClick={() => setAlertMessage('')}
              className="w-full bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Patch Notes Modal */}
      {showPatchNotes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPatchNotes(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              패치노트
            </h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
              {PATCH_NOTES.map((note, index) => (
                <div key={index} className="border-l-2 border-neutral-200 pl-4 py-1">
                  <div className="text-xs font-bold text-neutral-400 mb-1">{note.date}</div>
                  <div className="text-sm text-neutral-700">{note.content}</div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowPatchNotes(false)}
              className="w-full mt-6 bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* API Cost Modal */}
      {showApiCost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowApiCost(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-600">
              <Coins className="w-5 h-5" />
              API 예상 비용 안내
            </h3>
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">최소 비용 (짧은 요청/응답)</span>
                  <span className="text-sm font-bold text-amber-700">약 5원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">최대 비용 (긴 요청/응답)</span>
                  <span className="text-sm font-bold text-amber-700">약 50원</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed italic">
                * 위 비용은 Gemini 3.1 Pro 모델의 현재 토큰당 단가와 평균적인 마케팅 문구 생성량을 기준으로 계산되었습니다.<br/>
                * 결과물의 길이나 입력의 복잡도에 따라 실제 청구되는 비용에는 오차가 발생할 수 있습니다.<br/>
                * 비용은 원화(KRW) 환율에 따라 변동될 수 있습니다.
              </p>
            </div>
            <button 
              onClick={() => setShowApiCost(false)}
              className="w-full mt-6 bg-neutral-900 text-white py-2 rounded-md font-medium hover:bg-neutral-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
