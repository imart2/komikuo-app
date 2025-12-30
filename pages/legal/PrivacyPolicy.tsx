
import React from 'react';
import { Shield, ArrowLeft, Mail, Fingerprint, Database, Eye } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
            <Shield className="w-10 h-10 text-orange-500" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-bebas text-white tracking-widest leading-none">Privacy Policy</h1>
            <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-wider">Terakhir diperbarui: Januari 2024</p>
          </div>
        </div>

        <div className="bg-[#161b22]/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-12 backdrop-blur-sm">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">1. Pendahuluan</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Selamat datang di <strong>KomikUo</strong>. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengelola data saat Anda menggunakan layanan pembaca komik kami.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">2. Data yang Kami Kumpulkan</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Sebagai platform agregator komik, kami berupaya mengumpulkan data sesedikit mungkin:
            </p>
            <ul className="list-disc list-inside text-slate-400 font-light space-y-2 ml-4">
              <li>Data teknis otomatis (alamat IP, tipe browser) untuk optimasi performa.</li>
              <li>Riwayat baca lokal (tersimpan di browser Anda) untuk memudahkan navigasi.</li>
              <li>Informasi pencarian untuk memberikan rekomendasi yang relevan.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">3. Penggunaan Cookie</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Kami menggunakan cookie dan teknologi serupa untuk menyimpan preferensi Anda (seperti tema gelap/terang atau daftar komik favorit). Cookie membantu kami memahami bagaimana pengguna berinteraksi dengan situs kami agar kami dapat terus meningkatkan pengalaman Anda.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">4. Kontak Kami</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, Anda dapat menghubungi tim dukungan kami melalui email di <span className="text-orange-500 font-bold">privacy@komikuo.com</span>.
            </p>
          </section>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-orange-500/10 to-transparent rounded-3xl border border-white/5 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Dengan menggunakan layanan kami, Anda menyetujui syarat-syarat dalam kebijakan privasi ini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
