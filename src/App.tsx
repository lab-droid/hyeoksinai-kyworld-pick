import React, { useState, useEffect, useRef } from 'react';
import { Settings, Info, ExternalLink, Mail, X, CheckCircle2, AlertCircle, Loader2, History, Coins, Copy, Check, Eye, EyeOff } from 'lucide-react';

const AUDIENCE_OPTIONS = [
  { value: '2030 직장인', label: '2030 직장인' },
  { value: '대학생 및 청년층', label: '대학생 및 청년층' },
  { value: '소상공인 및 1인 자영업자', label: '소상공인 및 1인 자영업자' },
  { value: '3040 학부모 및 주부', label: '3040 학부모 및 주부' },
  { value: 'IT 기획자 및 개발자', label: 'IT 기획자 및 개발자' },
  { value: '뷰티 및 패션 관심층', label: '뷰티 및 패션 관심층' },
  { value: '은퇴 국가 유공자 및 실버 세대', label: '은퇴 국가 유공자 및 실버 세대' },
  { value: 'custom', label: '기타 (직접 입력)' },
];

const GOAL_OPTIONS = [
  { value: '브랜드 인지도 향상', label: '브랜드 인지도 향상' },
  { value: '신규 가입 및 회원 유치', label: '신규 가입 및 회원 유치' },
  { value: '매출 직접 증대 및 구매 전환 유도', label: '매출 직접 증대 및 구매 전환 유도' },
  { value: '웹사이트 트래픽 증가 및 클릭 유도', label: '웹사이트 트래픽 증가 및 클릭 유도' },
  { value: '기업/브랜드 이미지 신뢰도 구축', label: '기업/브랜드 이미지 신뢰도 구축' },
  { value: '오프라인 매장 방문 및 고객 유치', label: '오프라인 매장 방문 및 고객 유치' },
  { value: '앱 설치 및 가용 사용자 유도', label: '앱 설치 및 가용 사용자 유도' },
  { value: 'custom', label: '기타 (직접 입력)' },
];

const REQUIREMENT_OPTIONS = [
  { value: '구매 전환 확률이 높은 고관여/고단가 핵심 키워드 위주 추출 (수익력 중시)', label: '구매 전환 확률이 높은 고관여/고단가 핵심 키워드 (수익력 중심)' },
  { value: '경쟁 강도가 낮지만 꾸준한 수요가 있는 실속형 롱테일(Long-tail) 키워드 위주 추출 (안정성 중시)', label: '경쟁률이 낮고 꾸준히 유입되는 실속형 롱테일 키워드' },
  { value: '긴급하게 당장의 즉각적 해결을 원하는 직접 문제 해결형 키워드 추출 (즉각 반응성 중시)', label: '즉시 해결책을 검색하는 문제 해결 중심 키워드' },
  { value: '유행과 트렌드에 민감하고 SNS 확산 및 바이럴이 용이한 키워드 위주 추출 (화제성 중시)', label: '인스타그램/네이버 등 SNS 바이럴 및 트렌드 키워드' },
  { value: '지속적인 관계 유지 및 구독/재구매 유도에 적합한 정보 제공성 키워드 위주 추출 (지속성 중시)', label: '구독 및 재구매 확률을 높이는 정보 제공성 키워드' },
  { value: '경쟁사의 주요 트래픽을 효율적으로 우회하여 틈새 시장을 침투할 수 있는 키워드 추출 (공격성 중시)', label: '경쟁사를 피해 시장 틈새를 공략하는 우회 키워드' },
  { value: 'custom', label: '기타 (직접 요구사항 입력)' },
];

const PATCH_NOTES = [
  { date: '2026-06-09', content: '수익성 극대화를 위한 맞춤형 요구사항(드롭다운 및 직접 입력) 수집 기능 도입' },
  { date: '2026-06-09', content: '추출 키워드 개수 선택 기능 추가 및 상세 추천 사유 & 수익화 연관성 리포트 대폭 강화' },
  { date: '2026-06-09', content: '타겟 고객층 및 마케팅 목적 드롭다운 간편 선택 옵션 도입 & 메인 배너 개편' },
  { date: '2026-06-06', content: '키워드 추천 결과물 자유 선택 및 편의성 개선' },
  { date: '2026-05-03', content: '심층 퍼플/인디고 배경 테마 적용 및 텍스트 시인성 최적화' },
  { date: '2026-05-03', content: '혁신적인 애니메이션 배경 적용 및 패치노트 실시간 업데이트 반영' },
  { date: '2026-04-19', content: '패치노트 기능 추가, API 예상 비용 표시 기능 추가, 초기 팝업 비활성화' },
  { date: '2026-04-11', content: '상단 이미지 데이터 분석 테마로 변경' },
  { date: '2026-04-11', content: 'alert() 오류 수정 및 로딩 시각화 개선' },
  { date: '2026-04-11', content: '이미지 배너 최적화 및 복사 방지 기능 추가' },
  { date: '2026-04-11', content: '초기 빌드 생성 및 UI/UX 개선' },
];

export default function App() {
  const getInitialApiKey = () => {
    let key = '';
    try {
      key = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || '';
    } catch (e) {}
    
    if (!key) {
      try {
        key = (typeof process !== 'undefined' && process.env) ? (process.env.GEMINI_API_KEY || '') : '';
      } catch (e) {}
    }

    if (key === 'MY_GEMINI_API_KEY' || key === 'YOUR_GEMINI_API_KEY' || key.includes('placeholder')) {
      return '';
    }
    return key;
  };

  const [apiKey, setApiKey] = useState(getInitialApiKey());
  const [userApiKey, setUserApiKey] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [customAudience, setCustomAudience] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [customRequirement, setCustomRequirement] = useState('');
  const [keywordCount, setKeywordCount] = useState<number>(5);

  const targetAudience = selectedAudience === 'custom' ? customAudience : selectedAudience;
  const marketingGoal = selectedGoal === 'custom' ? customGoal : selectedGoal;
  const targetRequirement = selectedRequirement === 'custom' ? customRequirement : selectedRequirement;

  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showApiCost, setShowApiCost] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const hasApiKey = apiKey.trim().length > 0 || userApiKey.trim().length > 0;

  const handleGenerate = async () => {
    if (!productName || !targetAudience || !marketingGoal || !targetRequirement) {
      setAlertMessage('모든 입력 항목을 채워주세요.');
      return;
    }

    const currentKey = (userApiKey || apiKey).trim();
    if (/[^\x00-\x7F]/.test(currentKey)) {
      setAlertMessage('API Key에 올바르지 않은 문자(한글 등)가 포함되어 있습니다. 우측 상단 API Key 설정에서 올바른 Key를 영문/숫자로 입력해주세요.');
      setShowApiKeyModal(true);
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
      let data: any = null;
      let useClientFallback = false;

      // 1. Try Express backend first
      try {
        const response = await fetch('/api/generate-keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName,
            targetAudience,
            marketingGoal,
            targetRequirement,
            keywordCount,
            userApiKey: userApiKey || apiKey,
          }),
        });

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If the server returns HTML (Cloudflare Pages fallback for missing route) or returns 404/others
          if (response.status === 404 || (contentType && contentType.includes('text/html'))) {
            useClientFallback = true;
          } else {
            const text = await response.text().catch(() => '');
            throw new Error(text || `서버 오류 (${response.status})`);
          }
        }
      } catch (backendError) {
        console.warn('Backend request failed or not found, trying client-side fallback:', backendError);
        useClientFallback = true;
      }

      // 2. Client fallback direct call to Gemini API
      if (useClientFallback) {
        const activeKey = (userApiKey || apiKey || '').trim();
        if (!activeKey) {
          throw new Error('Cloudflare 배포 환경에서는 개별 API Key가 필요합니다. 우측 상단 [API Key 설정] 버튼을 클릭하여 유효한 Google Gemini API Key를 등록해주셔야 정상 작동합니다.');
        }

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

        const modelsToTry = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
        let lastGeminiErrorMsg = '';
        let generatedText = '';

        for (const modelName of modelsToTry) {
          try {
            console.log(`[Client Sandbox] Attempting direct response with model: ${modelName}`);
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`;
            const geminiResponse = await fetch(geminiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
              }),
            });

            if (!geminiResponse.ok) {
              const geminiErrorData = await geminiResponse.json().catch(() => ({}));
              const geminiErrorMsg = geminiErrorData?.error?.message || `HTTP ${geminiResponse.status}`;
              lastGeminiErrorMsg = geminiErrorMsg;
              
              // If API Key itself is invalid, fail fast
              const lowerMsg = geminiErrorMsg.toLowerCase();
              if (lowerMsg.includes('api key not valid') || lowerMsg.includes('invalid') || lowerMsg.includes('api_key_invalid')) {
                throw new Error(`Google Gemini API 오류: ${geminiErrorMsg}`);
              }
              
              console.warn(`Model ${modelName} failed, trying next. Error: ${geminiErrorMsg}`);
              continue;
            }

            const geminiData = await geminiResponse.json();
            const textResult = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResult) {
              generatedText = textResult;
              break;
            }
          } catch (modelErr: any) {
            lastGeminiErrorMsg = modelErr?.message || String(modelErr);
            const lowerMsg = lastGeminiErrorMsg.toLowerCase();
            if (lowerMsg.includes('api key not valid') || lowerMsg.includes('invalid') || lowerMsg.includes('api_key_invalid')) {
              throw modelErr;
            }
            console.warn(`Fetch error for model ${modelName}:`, modelErr);
          }
        }

        if (!generatedText) {
          throw new Error(`Google Gemini API 오류: ${lastGeminiErrorMsg || '모든 모델 시도에 실패했습니다.'}`);
        }

        data = { text: generatedText };
      }

      clearInterval(progressInterval);
      setProgress(100);
      setOutput(data?.text || '결과를 생성하지 못했습니다.');
    } catch (error: any) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setProgress(0);
      
      let msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('API Key') || msg.includes('API key') || msg.includes('KEY_INVALID') || msg.includes('not valid')) {
        setAlertMessage('API Key가 유효하지 않거나 필요합니다. 우측 상단 설정에서 유효한 API Key를 입력해주세요.');
        setShowApiKeyModal(true);
      } else {
        setAlertMessage('키워드 생성 중 오류가 발생했습니다. API Key가 유효한지 확인해주세요.\n\n상세 오류: ' + msg);
      }
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = userApiKey.trim();
    if (/[^\x00-\x7F]/.test(trimmed)) {
      setAlertMessage('API Key에 올바르지 않은 문자(한글 등)가 포함되어 있습니다. 영문/숫자로 구성된 올바른 Key를 입력해주세요.');
      return;
    }
    setApiKey(trimmed);
    setShowApiKeyModal(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        // System fallback for direct selection in frames/sandboxed contexts
        const textarea = document.createElement('textarea');
        textarea.value = output;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setAlertMessage('복사에 실패했습니다. 마우스 드래그를 이용해 직접 복사해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-neutral-100 font-sans flex flex-col relative overflow-x-hidden">
      {/* Dynamic Background Animation - Inspired by the User Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        {/* Soft Fluid Curves */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-indigo-900/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] bg-purple-900/20 rounded-full blur-[120px] animate-[pulse_10s_infinite_delay-2000]"></div>
        
        {/* Glowing Stars/Dots */}
        <div className="absolute top-[15%] left-[25%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
        <div className="absolute top-[45%] left-[85%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-pulse delay-700"></div>
        <div className="absolute top-[75%] left-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse delay-1000"></div>
        <div className="absolute top-[35%] left-[65%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-pulse delay-300"></div>

        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
      </div>

      {/* Top Image Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-neutral-800 overflow-hidden shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80" 
          alt="Innovation Search & Keyword Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 hover:scale-110 transition-transform duration-10000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-radial-[at_center] from-transparent to-[#0f0c29]/60 z-[1]"></div>
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
          className="flex items-center gap-2 px-3 py-2 bg-indigo-950/40 backdrop-blur-md border border-white/10 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">예상 비용</span>
        </button>
        <button 
          onClick={() => setShowPatchNotes(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-950/40 backdrop-blur-md border border-white/10 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">패치노트</span>
        </button>
        <button 
          onClick={() => setShowInstructions(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-950/40 backdrop-blur-md border border-white/10 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">사용방법</span>
        </button>
        <button 
          onClick={() => setShowApiKeyModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-950/40 backdrop-blur-md border border-white/10 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 transition-colors"
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
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-8 relative z-10">
        
        {/* Input Section */}
        <section className="bg-indigo-950/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
            키워드 추천 정보 입력
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">제품/서비스명</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="예: 혁신 AI 플랫폼"
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">타겟 고객</label>
              <select 
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white cursor-pointer"
              >
                <option value="" className="bg-[#0f0c29] text-neutral-400">타겟 고객층을 선택해주세요</option>
                {AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0f0c29] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              
              {selectedAudience === 'custom' && (
                <input 
                  type="text" 
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="예: 2535 미혼 남성, 반려동물 보유 가구 등 직접 입력"
                  className="w-full mt-2 px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500 animate-in fade-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">마케팅 목적</label>
              <select 
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white cursor-pointer"
              >
                <option value="" className="bg-[#0f0c29] text-neutral-400">마케팅 목적을 선택해주세요</option>
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0f0c29] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              
              {selectedGoal === 'custom' && (
                <input 
                  type="text" 
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="예: 보도자료 배포용 이슈 메이킹, 크라웃 펀딩 펀딩율 달성 등 직접 입력"
                  className="w-full mt-2 px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500 animate-in fade-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">추가 요구사항 (수익성 극대화 필터)</label>
              <select 
                value={selectedRequirement}
                onChange={(e) => setSelectedRequirement(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white cursor-pointer"
              >
                <option value="" className="bg-[#0f0c29] text-neutral-400">수익화에 적합한 키워드 추출 요구사항 선택</option>
                {REQUIREMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0f0c29] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              
              {selectedRequirement === 'custom' && (
                <input 
                  type="text" 
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  placeholder="예: 월간 검색 규모가 작더라도 실제 지불 장벽을 넘을 수 있는 키워드 직접 입력"
                  className="w-full mt-2 px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500 animate-in fade-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">추출할 키워드 개수</label>
              <select 
                value={keywordCount}
                onChange={(e) => setKeywordCount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white cursor-pointer hover:border-indigo-500/30"
              >
                <option value={1} className="bg-[#0f0c29] text-white">1개</option>
                <option value={5} className="bg-[#0f0c29] text-white">5개 (권장)</option>
                <option value={10} className="bg-[#0f0c29] text-white">10개</option>
                <option value={20} className="bg-[#0f0c29] text-white">20개</option>
                <option value={30} className="bg-[#0f0c29] text-white">30개</option>
              </select>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 group relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI 분석 중... {progress}%
                </>
              ) : (
                '지능형 키워드 전략 수립 시작'
              )}
            </button>
            
            {isGenerating && (
              <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-2 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </section>

        {/* Output Section */}
        {output && (
          <section className="bg-indigo-950/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                추천 키워드 전략 리포트
              </h2>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border shrink-0 ${
                  copied
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 hover:scale-102 active:scale-98 shadow-md shadow-indigo-600/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 animate-in zoom-in" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>전체 복사하기</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-neutral-950/50 p-6 rounded-xl border border-white/5 min-h-[200px] shadow-inner relative group">
              <pre className="whitespace-pre-wrap font-sans text-neutral-100 text-sm leading-relaxed select-text cursor-text">
                {output}
              </pre>
            </div>
            <div className="flex justify-between items-center mt-4 text-[10px] sm:text-xs">
              <p className="text-indigo-400 font-mono tracking-tighter uppercase opacity-70">※ Generated by Innovation AI Engine</p>
              <p className="text-emerald-400 select-none">드래그하거나 우측 상단 복사 버튼을 클릭하여 결과물을 저장할 수 있습니다.</p>
            </div>
          </section>
        )}

      </main>

      {/* Footer Controls */}
      <div className="fixed bottom-4 left-4 z-20">
        <div className="bg-indigo-950/40 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/10 text-[10px] sm:text-xs font-bold tracking-widest text-indigo-200 uppercase">
          Dev: 정혁신
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10 items-end">
        <a 
          href="https://hyeoksinai.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg shadow-indigo-500/20 text-xs sm:text-sm font-medium hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
          혁신AI 플랫폼 바로가기
        </a>
        <button 
          onClick={() => setShowContactModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-950/40 backdrop-blur-md text-white rounded-md shadow-md border border-white/10 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <Mail className="w-4 h-4" />
          오류/유지보수 문의
        </button>
      </div>

      {/* Modals */}
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Info className="w-5 h-5 text-indigo-400" />
              사용방법
            </h3>
            <div className="space-y-4 text-sm text-neutral-300">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">1</span>
                <p>우측 상단의 <strong>API Key</strong> 버튼을 눌러 Google Gemini API Key를 입력합니다.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">2</span>
                <p><strong>제품/서비스명</strong>을 구체적으로 입력합니다.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">3</span>
                <p><strong>타겟 고객</strong>의 연령, 직업, 관심사 등을 입력합니다.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">4</span>
                <p><strong>마케팅 목적</strong>을 입력합니다.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">5</span>
                <p><strong>키워드 전략 수립 시작</strong> 버튼을 클릭합니다.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowApiKeyModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-indigo-400" />
              API Key 설정
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              웹 배포 환경에서 사용하기 위해 Google Gemini API Key를 입력해주세요.
            </p>
            <div className="relative mb-6">
              <input 
                type={showApiKey ? "text" : "password"} 
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-12 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-white transition-colors"
                title={showApiKey ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/5"
              >
                취소
              </button>
              <button 
                onClick={handleSaveApiKey}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Mail className="w-5 h-5 text-indigo-400" />
              오류/유지보수 문의
            </h3>
            <div className="bg-indigo-950/50 p-6 rounded-xl border border-white/5 text-sm text-neutral-300 leading-relaxed shadow-inner">
              업데이트나 유지보수가 필요할 경우 아래 이메일로 어떤 부분이 필요한지 상세하게 작성 후 보내주세요.<br/><br/>
              <div className="bg-neutral-950/50 p-3 rounded-lg border border-white/5 text-center">
                <a href="mailto:info@nextin.ai.kr" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">info@nextin.ai.kr</a>
              </div>
            </div>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-red-500/20 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              경고
            </h3>
            <p className="text-sm text-neutral-300 mb-6 whitespace-pre-wrap leading-relaxed">
              {alertMessage}
            </p>
            <button 
              onClick={() => setAlertMessage('')}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Patch Notes Modal */}
      {showPatchNotes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPatchNotes(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <History className="w-5 h-5 text-indigo-400" />
              패치노트
            </h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-3 custom-scrollbar">
              {PATCH_NOTES.map((note, index) => (
                <div key={index} className="border-l-2 border-indigo-500/30 pl-5 py-2 group hover:border-indigo-500 transition-all">
                  <div className="text-[10px] font-bold text-indigo-400 mb-1 opacity-70 group-hover:opacity-100 uppercase tracking-widest">{note.date}</div>
                  <div className="text-sm text-neutral-200 group-hover:text-white transition-colors">{note.content}</div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowPatchNotes(false)}
              className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}

      {/* API Cost Modal */}
      {showApiCost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowApiCost(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
              <Coins className="w-5 h-5 text-amber-500" />
              API 예상 비용 안내
            </h3>
            <div className="space-y-6">
              <div className="bg-indigo-950/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-neutral-300">최소 비용 (짧은 문구)</span>
                  <span className="text-sm font-black text-amber-400 px-3 py-1 bg-amber-400/10 rounded-lg">약 5원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-300">최대 비용 (심층 리포트)</span>
                  <span className="text-sm font-black text-amber-400 px-3 py-1 bg-amber-400/10 rounded-lg">약 50원</span>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] text-neutral-400 leading-relaxed italic border-l-2 border-amber-500/30 pl-4">
                  • 비용은 Gemini 1.5 Pro 모델의 토큰 단가와 평균 생성량을 기준으로 산출되었습니다.<br/>
                  • 결과물의 길이나 입력의 복잡도에 따라 실제 청구 비용은 다를 수 있습니다.<br/>
                  • 원화 환율 및 모델 업데이트에 따라 변동될 수 있습니다.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowApiCost(false)}
              className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
            >
              내용 확인
            </button>
          </div>
        </div>
      )}

      {/* Extra CSS for Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
}
