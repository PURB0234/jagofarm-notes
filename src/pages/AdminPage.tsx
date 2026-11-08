export default function AdminPage() {
    return (
        <main className="w-full p-6 bg-white dark:bg-[#141c19] border border-gray-200 dark:border-[#1e2d27] rounded-xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                Halaman ini hanya dapat diakses oleh Admin.
            </p>
        </main>
    );
}
