import { GoogleGenAI } from "@google/genai";
import { AIProvider, MatchAnalysisResult } from "./ai.interface";
import { matchResultZodSchema } from "./ai.schema";

export class GeminiProvider implements AIProvider {
  readonly name = "Google Gemini (Gemini 2.5 Flash)";

  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  async matchCvToJob(cvText: string, jdText: string): Promise<MatchAnalysisResult> {
    const client = this.getClient();

    if (client) {
      try {
        return await this.callGeminiModel(client, cvText, jdText);
      } catch (err: any) {
        console.warn(
          "[GeminiProvider] Warning: Gemini API call failed or rate-limited. Falling back to heuristic analysis. Error:",
          err?.message || err
        );
      }
    } else {
      console.info(
        "[GeminiProvider] Info: GEMINI_API_KEY is not set in api/.env. Using smart fallback analyzer. Set GEMINI_API_KEY to activate live Gemini 2.5 Flash."
      );
    }

    return this.fallbackHeuristicAnalysis(cvText, jdText);
  }

  private async callGeminiModel(
    client: GoogleGenAI,
    cvText: string,
    jdText: string
  ): Promise<MatchAnalysisResult> {
    const systemPrompt = `Bạn là một chuyên gia tuyển dụng nhân sự cấp cao và chuyên viên đánh giá hệ thống lọc hồ sơ ứng viên (ATS).
Nhiệm vụ của bạn là đọc và phân tích kỹ lưỡng CV của ứng viên so với Mô tả công việc (Job Description - JD) được cung cấp.

Hãy đánh giá khách quan, trung thực và trả về kết quả hoàn toàn bằng tiếng Việt theo định dạng JSON với cấu trúc bắt buộc như sau:
{
  "overallScore": <điểm số tổng thể từ 0 đến 100, kiểu số nguyên>,
  "summary": "<Đoạn văn tóm tắt nhận xét tổng quan khoảng 2-4 câu về độ phù hợp của ứng viên>",
  "matchedSkills": [
    {
      "skill": "<Tên kỹ năng đạt yêu cầu trong JD>",
      "evidence": "<Bằng chứng/dự án/vị trí tìm thấy trong CV chứng minh kỹ năng này>"
    }
  ],
  "missingSkills": [
    {
      "skill": "<Tên kỹ năng/yêu cầu trong JD mà CV còn thiếu hoặc chưa thể hiện rõ>",
      "importance": "HIGH" | "MEDIUM" | "LOW",
      "reason": "<Lý do tại sao kỹ năng này quan trọng đối với vị trí tuyển dụng>"
    }
  ],
  "recommendations": [
    "<Gợi ý hành động thực tế 1 để ứng viên sửa hoặc làm nổi bật trong CV>",
    "<Gợi ý hành động thực tế 2>",
    "<Gợi ý hành động thực tế 3>"
  ]
}

Quy tắc:
1. Đánh giá công tâm, không cho điểm ảo. Nếu CV thiếu nhiều yêu cầu cốt lõi, điểm nên dưới 60%. Nếu đáp ứng xuất sắc các tiêu chí, điểm từ 80-95%.
2. Phần recommendations phải thực chiến, chỉ ra từ khóa ATS cần bổ sung, cách diễn đạt lại kinh nghiệm hoặc dự án cần làm nổi bật.
3. Chỉ trả về JSON hợp lệ, không kèm bất kỳ lời dẫn giải nào ngoài khối JSON.`;

    const userPrompt = `--- NỘI DUNG JOB DESCRIPTION (JD) ---
${jdText}

--- NỘI DUNG CV ỨNG VIÊN ---
${cvText}`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text || "";
    return this.parseAndValidateJson(responseText);
  }

  private parseAndValidateJson(text: string): MatchAnalysisResult {
    let cleanJson = text.trim();

    // Remove markdown code fences if present (```json ... ```)
    const jsonMatch = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanJson = jsonMatch[1].trim();
    }

    const rawObj = JSON.parse(cleanJson);
    return matchResultZodSchema.parse(rawObj);
  }

  /**
   * Smart heuristic fallback when API key is missing or network unavailable.
   */
  private fallbackHeuristicAnalysis(
    cvText: string,
    jdText: string
  ): MatchAnalysisResult {
    const cvLower = cvText.toLowerCase();
    const jdLower = jdText.toLowerCase();

    // Common technical dictionary
    const commonTechs = [
      "react",
      "next.js",
      "vue",
      "angular",
      "typescript",
      "javascript",
      "html",
      "css",
      "tailwind",
      "node.js",
      "express",
      "nestjs",
      "python",
      "django",
      "fastapi",
      "java",
      "spring boot",
      "golang",
      "c#",
      ".net",
      "postgresql",
      "mysql",
      "mongodb",
      "redis",
      "prisma",
      "docker",
      "kubernetes",
      "aws",
      "gcp",
      "azure",
      "ci/cd",
      "git",
      "rest api",
      "graphql",
      "microservices",
      "unit test",
      "jest",
      "cypress",
      "linux",
    ];

    const matchedList: Array<{ skill: string; evidence: string }> = [];
    const missingList: Array<{
      skill: string;
      importance: "HIGH" | "MEDIUM" | "LOW";
      reason: string;
    }> = [];

    for (const tech of commonTechs) {
      const inJd = jdLower.includes(tech);
      if (inJd) {
        const inCv = cvLower.includes(tech);
        const displayName = tech.charAt(0).toUpperCase() + tech.slice(1);
        if (inCv) {
          matchedList.push({
            skill: displayName,
            evidence: `Được đề cập rõ trong phần kinh nghiệm/kỹ năng của hồ sơ ứng viên`,
          });
        } else {
          missingList.push({
            skill: displayName,
            importance:
              missingList.length < 2
                ? "HIGH"
                : missingList.length < 5
                ? "MEDIUM"
                : "LOW",
            reason: `JD yêu cầu kinh nghiệm với ${displayName} nhưng chưa thấy được nhấn mạnh trong CV`,
          });
        }
      }
    }

    // Default fallbacks if no specific keywords matched
    if (matchedList.length === 0 && missingList.length === 0) {
      matchedList.push({
        skill: "Software Engineering Fundamentals",
        evidence: "Ứng viên có kiến thức nền tảng về phát triển phần mềm",
      });
    }

    const totalTracked = matchedList.length + missingList.length;
    let score =
      totalTracked > 0
        ? Math.round((matchedList.length / totalTracked) * 100)
        : 70;

    // Normalize score into realistic band
    score = Math.min(95, Math.max(35, score));

    const recommendations = [
      `Tối ưu hóa các từ khóa kỹ thuật quan trọng của JD vào phần Kinh nghiệm làm việc để vượt qua bộ lọc ATS.`,
      missingList.length > 0
        ? `Bổ sung kinh nghiệm hoặc dự án thực tế liên quan đến ${missingList.slice(0, 3).map((s) => s.skill).join(", ")}.`
        : `Làm nổi bật các con số định lượng (KPI, hiệu năng, số lượng người dùng) trong các dự án chính.`,
      `Đảm bảo định dạng tiêu đề và mục kỹ năng rõ ràng, xúc tích theo chuẩn quốc tế.`,
    ];

    return {
      overallScore: score,
      summary: `Hồ sơ của bạn đáp ứng ${matchedList.length} trên tổng số ${totalTracked || 1} yêu cầu kỹ năng được phát hiện trong JD. Ứng viên thể hiện nền tảng tốt, tuy nhiên cần bổ sung một số từ khóa trọng yếu để tối đa hóa khả năng đậu vòng duyệt hồ sơ.`,
      matchedSkills: matchedList,
      missingSkills: missingList,
      recommendations,
    };
  }
}
