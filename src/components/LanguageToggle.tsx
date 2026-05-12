import { useTranslation } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation()

  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={`
        relative w-16 h-8 rounded-full
        transition-all duration-500 ease-out
        flex items-center justify-center
        backdrop-blur-md cursor-pointer
        text-xs font-semibold tracking-wider
        ${lang === 'zh'
          ? 'bg-white/50 border border-white/60 text-gray-700 hover:shadow-md'
          : 'bg-white/5 border border-white/10 text-gray-300 hover:shadow-md'
        }
      `}
      aria-label="切换语言"
    >
      <span className={`
        flex items-center justify-center gap-1
        transition-all duration-300
      `}>
        <span className={lang === 'zh' ? 'opacity-100' : 'opacity-40'}>中</span>
        <span className="text-[10px] opacity-30">/</span>
        <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
      </span>
    </button>
  )
}
