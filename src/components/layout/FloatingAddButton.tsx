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
            className="fixed right-4 bottom-20 z-40 md:hidden w-12 h-12 bg-[#1E5E35] hover:bg-green-800 active:scale-95 text-white rounded-full shadow-lg shadow-green-900/20 flex items-center justify-center transition-all cursor-pointer border border-green-700/30"
        >
            <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
    );
}
