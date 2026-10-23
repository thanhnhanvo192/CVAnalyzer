"use client";

import { useState } from "react";
import { Target, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from "../ui/Icons";
import { Button } from "../ui/Button";
import { createJobDescription, JobDescriptionItem, ApiClientError } from "@/src/lib/api";

interface JdInputCardProps {
  onSuccess: (jd: JobDescriptionItem) => void;
}

// Sample JD templates for quick 1-click testing
const JD_TEMPLATES = [
  {
    name: "Frontend React/Next.js",
    title: "Senior Frontend Engineer",
    company: "Tech Corp",
    text: `Job Description: Senior Frontend Engineer
Company: Tech Corp
Location: Hybrid (Hanoi / Remote)

Requirements:
- 3+ years of experience with React.js, Next.js, and modern TypeScript.
- Strong proficiency in HTML5, CSS3, Tailwind CSS, responsive design, and CSS animations.
- Experience with RESTful APIs, state management (Zustand, Redux), and React Query.
- Solid understanding of Web Performance, SEO optimization, and Core Web Vitals.
- Familiarity with Git, CI/CD pipelines, Docker, and Automated Testing (Jest, Playwright).
- Good communication and problem-solving mindset.`,
  },
  {
    name: "Backend Node.js/PostgreSQL",
    title: "Backend Software Engineer",
    company: "Fintech Innovations",
    text: `Job Description: Backend Software Engineer
Company: Fintech Innovations

Responsibilities & Requirements:
- 2+ years of professional experience with Node.js, Express, TypeScript, and NestJS.
- In-depth knowledge of relational databases (PostgreSQL, MySQL) and ORMs (Prisma, TypeORM).
- Experience designing and building secure RESTful and GraphQL APIs.
- Familiar with Redis caching, message brokers (Kafka/RabbitMQ), and JWT/OAuth2 authentication.
- Experience containerizing microservices with Docker and deploying to AWS/GCP.
- Strong foundation in data structures, algorithms, and system design principles.`,
  },
];

export function JdInputCard({ onSuccess }: JdInputCardProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleApplyTemplate = (tmpl: (typeof JD_TEMPLATES)[0]) => {
    setTitle(tmpl.title);
    setCompany(tmpl.company);
    setRawText(tmpl.text);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (rawText.trim().length < 30) {
      setError("Nội dung Job Description quá ngắn (tối thiểu 30 ký tự)");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createJobDescription({
        title: title.trim() || undefined,
        company: company.trim() || undefined,
        rawText: rawText.trim(),
      });

      setSuccessMsg(`Đã lưu Job Description: ${res.jobDescription.title}`);
      onSuccess(res.jobDescription);

      // Reset fields
      setTitle("");
      setCompany("");
      setRawText("");
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Không thể lưu Job Description. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Nhập Job Description (JD) mục tiêu
            </h3>
            <p className="text-xs text-slate-400">
              Dán nội dung yêu cầu tuyển dụng để chuẩn bị so khớp AI
            </p>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
            Dán nhanh mẫu:
          </span>
          {JD_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              + {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Vị trí tuyển dụng (Tùy chọn)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Senior Frontend Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Công ty / Doanh nghiệp (Tùy chọn)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="VD: Google, VNG, Shopee"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nội dung mô tả công việc (Yêu cầu bắt buộc) *
            </label>
            <span className="text-[11px] text-slate-500">
              {rawText.length} ký tự
            </span>
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={7}
            required
            placeholder="Dán toàn bộ nội dung Job Description (Yêu cầu công việc, kỹ năng, kinh nghiệm cần có)..."
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="md"
            loading={submitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {submitting ? "Đang lưu JD..." : "Lưu Job Description"}
          </Button>
        </div>
      </form>
    </div>
  );
}
