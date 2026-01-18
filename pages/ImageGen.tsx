import React, { useState, useEffect } from 'react';
import { generateAlbumArt, checkApiKey, openKeySelection } from '../services/geminiService';
import { ImageSize } from '../types';
import { Loader2, Wand2, Download, AlertCircle, KeyRound } from 'lucide-react';

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  // Initial check for key
  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, []);

  const handleKeySelect = async () => {
    try {
        await openKeySelection();
        // Assume success as per instructions, no delay
        setHasKey(true);
    } catch (e) {
        console.error("Key selection failed", e);
        setError("API 키를 선택하는데 실패했습니다.");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Double check key before starting high-cost operation
    const keySelected = await checkApiKey();
    if (!keySelected) {
        await handleKeySelect();
        return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const imageUrl = await generateAlbumArt(prompt, size);
      setResultImage(imageUrl);
    } catch (err: any) {
      setError(err.message || '이미지 생성에 실패했습니다. 다시 시도해주세요.');
      if (err.message && err.message.includes("Requested entity was not found")) {
          // Reset key state if specific error occurs
          setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pt-6 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-brand-blue/10 rounded-full mb-4">
                <Wand2 className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl font-bold mb-2">AI 앨범 아트 생성기</h1>
            <p className="text-gray-500 dark:text-gray-400">
                음악을 시각화하세요. 1K, 2K, 4K 고화질 커버 아트를 생성해보세요.
            </p>
        </div>

        {!hasKey ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-yellow-500/30 text-center">
                <KeyRound className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">API 키 필요</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    고품질 <b>Gemini 3 Pro Image</b> 모델을 사용하려면 결제가 가능한 프로젝트/API 키를 선택해야 합니다.
                </p>
                <button
                    onClick={handleKeySelect}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-brand-blue text-white font-bold hover:brightness-110 transition-all shadow-lg hover:shadow-brand-blue/20"
                >
                    API 키 선택하기
                </button>
                <div className="mt-4 text-xs text-gray-400">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-brand-blue">
                        결제 관련 문서 보기
                    </a>
                </div>
            </div>
        ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
            <div className="p-6 md:p-8">
                <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Prompt Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    앨범 커버 설명
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 네온 사인이 비치는 사이버펑크 도시, 로파이 애니메이션 스타일, 쓸쓸한 분위기..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-black focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none resize-none h-32"
                    required
                    />
                </div>

                {/* Size Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이미지 품질
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                    {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                        <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`py-3 px-4 rounded-xl border font-semibold transition-all ${
                            size === s
                            ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-brand-blue hover:text-brand-blue'
                        }`}
                        >
                        {s}
                        </button>
                    ))}
                    </div>
                    {size === '4K' && (
                        <p className="text-xs text-brand-blue mt-2 flex items-center gap-1">
                            <AlertCircle size={12} /> 4K 고화질 생성은 시간이 더 걸릴 수 있습니다.
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold text-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> 생성 중...
                    </>
                    ) : (
                    <>
                        아트 생성하기
                    </>
                    )}
                </button>
                </form>

                {/* Error Message */}
                {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                </div>
                )}
            </div>

            {/* Result Area */}
            {resultImage && (
                <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-black/50 p-6 md:p-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold mb-4 self-start">생성된 아트워크</h3>
                <div className="relative group rounded-lg overflow-hidden shadow-2xl max-w-full">
                    <img 
                    src={resultImage} 
                    alt={prompt} 
                    className="max-w-full h-auto max-h-[500px] object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <a 
                            href={resultImage} 
                            download={`generated-art-${Date.now()}.png`}
                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                            title="다운로드"
                        >
                            <Download size={24} />
                        </a>
                    </div>
                </div>
                <div className="mt-4 w-full text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">프롬프트</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{prompt}"</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-3 mb-1">품질</p>
                    <p className="text-sm text-brand-blue font-mono">{size}</p>
                </div>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGen;