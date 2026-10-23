import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UploadCloud,
  History,
} from "../components/ui/Icons";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI-Powered CV Reviewer • Next-Gen Job Match</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Biến CV của bạn thành{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                tấm vé vàng
              </span>{" "}
              vào vòng phỏng vấn
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
              Trích xuất kỹ năng từ CV, đối chiếu tức thì với Job Description (JD),
              phát hiện từ khóa thiếu chuẩn ATS và nhận gợi ý chỉnh sửa chuyên sâu trong dưới 20 giây.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group">
                  Bắt đầu phân tích miễn phí
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Đăng nhập tài khoản
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hoàn toàn bảo mật</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Độ chính xác cao</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent shadow-2xl shadow-indigo-500/10">
              <div className="rounded-[22px] bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Fullstack_Engineer_Resume.pdf
                      </h3>
                      <p className="text-xs text-slate-400">
                        Đối chiếu với: <span className="text-indigo-400 font-medium">Senior Software Engineer @ TechCorp</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="md">
                      Chuẩn bị phỏng vấn
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">88%</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Điểm phù hợp</div>
                    </div>
                  </div>
                </div>

                {/* Score breakdown demo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Matched skills */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Kỹ năng đáp ứng tốt (7/8)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "REST API", "Git"].map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Cần bổ sung vào CV
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Docker & CI/CD", "Redis Caching", "Unit Testing (Jest)"].map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Advice */}
                <div className="mt-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-indigo-300">Gợi ý từ AI:</strong> Dự án của bạn thể hiện rất tốt năng lực Frontend và Backend, tuy nhiên JD yêu cầu kinh nghiệm triển khai container. Hãy nhấn mạnh việc bạn đã sử dụng Docker Compose trong môi trường dev để tăng điểm ATS!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Quy trình đơn giản
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Chỉ 3 bước để hoàn thiện CV chuẩn mực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-400 mb-1">BƯỚC 1</div>
              <h3 className="text-lg font-bold text-white mb-2">Tải lên file CV</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Hỗ trợ định dạng PDF và DOCX. Hệ thống tự động trích xuất nội dung text và lưu trữ an toàn trên đám mây.
              </p>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-400 mb-1">BƯỚC 2</div>
              <h3 className="text-lg font-bold text-white mb-2">Dán Job Description</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Copy và dán mô tả công việc của vị trí bạn đang mong muốn ứng tuyển từ LinkedIn, TopCV, ITviec.
              </p>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-400 mb-1">BƯỚC 3</div>
              <h3 className="text-lg font-bold text-white mb-2">Nhận kết quả AI</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Điểm phù hợp, bảng đối chiếu kỹ năng đạt/thiếu và gợi ý bổ sung thực chiến sẵn sàng áp dụng ngay.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Tại sao chọn CV Analyzer?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Không còn phải nộp CV trong sự hoang mang
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Rất nhiều ứng viên bị loại ngay từ vòng lọc hồ sơ tự động (ATS) vì thiếu các từ khóa kỹ năng mà nhà tuyển dụng yêu cầu. CV Analyzer giúp bạn nhận diện chính xác khoảng cách trước khi nhấn nút "Gửi hồ sơ".
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Phân tích chuyên sâu dựa trên mô hình AI mới nhất (Gemini 2.5 Flash)",
                  "Tối ưu từ khóa chuẩn hệ thống lọc hồ sơ tự động (ATS)",
                  "Bảo mật tuyệt đối thông tin cá nhân và dữ liệu CV",
                  "Lưu trữ lịch sử để theo dõi sự cải thiện của từng phiên bản CV",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <div className="text-3xl font-black text-indigo-400 mb-1">&lt; 20s</div>
                <div className="text-xs text-slate-400 font-medium">Thời gian AI phân tích</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-black text-blue-400 mb-1">&gt; 95%</div>
                <div className="text-xs text-slate-400 font-medium">Độ chính xác parse CV</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-black text-emerald-400 mb-1">100%</div>
                <div className="text-xs text-slate-400 font-medium">Miễn phí cho Junior</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-black text-purple-400 mb-1">24/7</div>
                <div className="text-xs text-slate-400 font-medium">Review CV tức thì</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-slate-800/80 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Sẵn sàng chinh phục cơ hội việc làm tiếp theo?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Đăng ký tài khoản trong 30 giây và bắt đầu tối ưu hóa hồ sơ xin việc ngay hôm nay.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" className="px-8 shadow-xl shadow-indigo-600/30">
                Tạo tài khoản miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
