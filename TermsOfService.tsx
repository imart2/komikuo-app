
import React from 'react';
import { FileText, ArrowLeft, Scale, AlertOctagon, UserCheck, HelpCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#0b0e14] pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase text-[10px] tracking-widest">KEMBALI KE BERANDA</span>
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-bebas text-white tracking-widest leading-none">Terms of Service</h1>
            <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-wider">Syarat & Ketentuan Penggunaan</p>
          </div>
        </div>

        <div className="bg-[#161b22]/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-blue-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">1. Penerimaan Ketentuan</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Dengan mengakses atau menggunakan platform <strong>KomikUo</strong>, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">2. Penggunaan yang Diizinkan</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Layanan kami ditujukan semata-mata untuk penggunaan pribadi dan non-komersial. Anda setuju untuk tidak:
            </p>
            <ul className="list-disc list-inside text-slate-400 font-light space-y-2 ml-4">
              <li>Menggunakan platform untuk tujuan ilegal atau melanggar hukum.</li>
              <li>Melakukan scraping massal atau otomatisasi tanpa izin tertulis.</li>
              <li>Mencoba mengganggu integritas teknis atau keamanan server kami.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">3. Batasan Tanggung Jawab</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              KomikUo adalah platform agregator konten. Kami tidak meng-host konten komik di server kami secara permanen dan tidak bertanggung jawab atas isi konten yang bersumber dari pihak ketiga. Semua risiko penggunaan layanan berada pada pengguna.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">4. Perubahan Ketentuan</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Kami berhak memperbarui Ketentuan Layanan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan Anda terhadap ketentuan yang baru.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
