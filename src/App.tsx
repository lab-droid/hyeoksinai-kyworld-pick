import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Settings, Info, ExternalLink, Mail, X, CheckCircle2, AlertCircle, Loader2, History, Coins } from 'lucide-react';

const PATCH_NOTES = [
  { date: '2026-05-03', content: '심층 퍼플/인디고 배경 테마 적용 및 텍스트 시인성 최적화' },
  { date: '2026-05-03', content: '혁신적인 애니메이션 배경 적용 및 패치노트 실시간 업데이트 반영' },
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
          src="https://picsum.photos/seed/data-analysis/1920/1080?grayscale" 
          alt="Innovation Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-10000"
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
              <input 
                type="text" 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="예: 2030 직장인, 마케터"
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">마케팅 목적</label>
              <input 
                type="text" 
                value={marketingGoal}
                onChange={(e) => setMarketingGoal(e.target.value)}
                placeholder="예: 브랜드 인지도 향상, 신규 가입자 유치"
                className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-500"
              />
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
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              추천 키워드 전략 리포트
            </h2>
            <div className="bg-neutral-950/50 p-6 rounded-xl border border-white/5 min-h-[200px] shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-neutral-100 text-sm leading-relaxed select-none pointer-events-none">
                {output}
              </pre>
            </div>
            <div className="flex justify-between items-center mt-4 text-[10px] sm:text-xs">
              <p className="text-indigo-400 font-mono tracking-tighter uppercase opacity-70">※ Generated by Innovation AI Engine</p>
              <p className="text-neutral-400 italic">결과물 보호 시스템 작동 중 (복사 방지)</p>
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
            <input 
              type="password" 
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-neutral-600 mb-6"
            />
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
