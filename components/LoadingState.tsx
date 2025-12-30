import { Loader2, Sparkles } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
      </div>
      <p className="text-gray-400 font-medium text-center">
        O Llama 3 está a escrever o seu roteiro...<br />
        <span className="text-xs text-gray-500">Isto demora apenas alguns segundos.</span>
      </p>
    </div>
  );
}