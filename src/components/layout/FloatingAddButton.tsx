import { Plus } from "lucide-react";

type FloatingAddButtonProps = {
    onClick: () => void;
};

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Tambah Catatan"
            title="Tambah Catatan & Kegiatan Baru"
            className="fixed right-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.75rem)] z-40 md:hidden w-12 h-12 bg-linear-to-b from-[#188d5b] to-[#126b40] dark:from-[#22c55e] dark:to-[#15803d] text-white rounded-full shadow-lg shadow-green-950/30 flex items-center justify-center hover:scale-108 active:scale-90 hover:shadow-xl transition-all duration-200 cursor-pointer border-[2px] border-white/80 dark:border-[#141c19] ring-2 ring-emerald-500/20"
        >
            <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
    );
}
