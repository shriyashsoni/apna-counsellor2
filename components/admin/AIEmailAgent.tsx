"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Sparkles, Mail, Send, Copy, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIEmailAgent() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    recipientEmail: "",
    recipientName: "",
    purpose: "partnership",
    additionalContext: "",
    emailLength: "medium"
  });

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [useColorfulTemplate, setUseColorfulTemplate] = useState(false); // Default to false (simple template)
  const [generatedEmail, setGeneratedEmail] = useState<{
    subject: string;
    content: string;
    templates?: {
      formal: { subject: string; content: string };
      friendly: { subject: string; content: string };
      creative: { subject: string; content: string };
    };
  } | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<"formal" | "friendly" | "creative">("formal");

  const purposeOptions = [
    { value: "partnership", label: "General Partnership", icon: "🤝" },
    { value: "college", label: "College Tie-up", icon: "🎓" },
    { value: "school", label: "School Seminars", icon: "🏫" },
    { value: "sponsor", label: "Sponsorship / Event", icon: "💰" },
    { value: "collaboration", label: "Mentorship Collaboration", icon: "👥" }
  ];

  const emailLengthOptions = [
    { value: "short", label: "Short (100-150 words)", description: "Quick and concise pitch" },
    { value: "medium", label: "Medium (200-300 words)", description: "Balanced details and proposal" },
    { value: "long", label: "Long (350-450 words)", description: "Comprehensive collaboration plan" }
  ];

  const emailTemplates = [
    {
      name: "🎓 College Tie-up",
      companyName: "COEP Technological University",
      purpose: "college",
      context: "Proposing a seminar on career guidance and MHT-CET counselling for students."
    },
    {
      name: "🏫 School Seminar",
      companyName: "St. Xavier's High School",
      purpose: "school",
      context: "Want to host a free session on engineering and medical roadmap planning for 11th-12th graders."
    },
    {
      name: "🤝 Corporate Partner",
      companyName: "TechCorp Labs",
      purpose: "partnership",
      context: "Collaborating for student internship opportunities and project-based learning support."
    },
    {
      name: "👥 Expert Mentor",
      companyName: "IIT-B Alumni Network",
      purpose: "collaboration",
      context: "Inviting distinguished alumni to onboard as verified mentors on our counselling platform."
    }
  ];

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.recipientEmail) {
      toast.error("Please fill in company/organization name and recipient email");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-ai-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formData.companyWebsite || websiteUrl,
          companyName: formData.companyName,
          purpose: formData.purpose,
          additionalContext: formData.additionalContext,
          emailLength: formData.emailLength
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Failed to generate email");

      setGeneratedEmail(data.data);
      toast.success("AI Email templates suggested!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to generate email: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!generatedEmail || !formData.recipientEmail) {
      toast.error("No email generated or recipient missing");
      return;
    }

    setIsSendingEmail(true);
    try {
      const currentTemplate = generatedEmail.templates?.[selectedTemplate] || generatedEmail;
      
      const htmlContent = useColorfulTemplate 
        ? currentTemplate.content 
        : convertToPlainTemplate(currentTemplate.content);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.recipientEmail,
          subject: currentTemplate.subject,
          html: htmlContent
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Failed to send email");

      toast.success("Email sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to send email: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const stripHtml = (html: string): string => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const convertToPlainTemplate = (htmlContent: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px;">
    
    <!-- Email Body -->
    <div style="font-size: 15px;">
      ${htmlContent}
    </div>

    <!-- Signature -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee;">
      <p style="margin: 0 0 5px 0; font-size: 14px; color: #444; font-weight: bold;">Shriyash Soni</p>
      <p style="margin: 0 0 15px 0; font-size: 13px; color: #777;">Founder, Apna Counsellor</p>
      
      <p style="margin: 0 0 5px 0; font-size: 12px; color: #888;">
        <strong>Email:</strong> <a href="mailto:shriyash.soni@apnacounsellor.in" style="color: #7c3aed; text-decoration: none;">shriyash.soni@apnacounsellor.in</a>
      </p>
      <p style="margin: 0 0 5px 0; font-size: 12px; color: #888;">
        <strong>Website:</strong> <a href="https://apnacounsellor.in" style="color: #7c3aed; text-decoration: none;">apnacounsellor.in</a>
      </p>
    </div>

  </div>
</body>
</html>
    `.trim();
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const loadTemplate = (template: typeof emailTemplates[0]) => {
    setFormData({
      ...formData,
      companyName: template.companyName,
      purpose: template.purpose,
      additionalContext: template.context
    });
    toast.info(`Template "${template.name}" loaded!`);
  };

  const handleScrapeWebsite = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsScrapingWebsite(true);
    try {
      // Just scrape basic metadata using standard API or mock scrape
      const response = await fetch(`https://r.jina.ai/${websiteUrl}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!response.ok) throw new Error("Failed to fetch site data");
      
      const text = await response.text();
      // Extract title as name
      const titleMatch = text.match(/Title:\s*(.*)/i);
      const title = titleMatch ? titleMatch[1].trim() : "";
      
      setFormData({
        ...formData,
        companyName: title || websiteUrl.replace(/https?:\/\/(www\.)?/, "").split("/")[0],
        companyWebsite: websiteUrl,
        additionalContext: text.slice(0, 1000) ? `Extracted site summary:\n${text.slice(0, 500)}` : formData.additionalContext
      });

      toast.success("Site data extracted!");
    } catch (err) {
      console.error(err);
      // If direct jina fetch fails, parse domain name
      const parsedName = websiteUrl.replace(/https?:\/\/(www\.)?/, "").split(".")[0];
      setFormData({
        ...formData,
        companyName: parsedName.charAt(0).toUpperCase() + parsedName.slice(1),
        companyWebsite: websiteUrl
      });
      toast.success("Data filled from domain name!");
    } finally {
      setIsScrapingWebsite(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#0f0f0f] border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Sparkles className="h-6 w-6 text-[#00FF88]" />
            AI Partnership Agent
          </CardTitle>
          <CardDescription className="text-slate-400">
            Generate simple, professional outbound email proposals for colleges, schools, and organizations. Direct Resend delivery.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <Card className="bg-[#0f0f0f] border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-base">
              <Mail className="h-5 w-5 text-purple-400" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Website Scraper */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00FF88]" />
                Auto-Fill from Website Link
              </Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://college.edu"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                  disabled={isScrapingWebsite}
                />
                <Button
                  onClick={handleScrapeWebsite}
                  disabled={isScrapingWebsite}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 px-3"
                  size="sm"
                >
                  {isScrapingWebsite ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Extract"
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Quick Themes</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {emailTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="text-xs rounded-lg border-white/5 bg-white/5 text-slate-300 hover:text-white"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-xs text-slate-300">Target Name *</Label>
              <Input
                id="companyName"
                placeholder="e.g. COEP Pune"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>

            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-xs text-slate-300">Website URL (Optional)</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://website.com"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>

            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-xs text-slate-300">Recipient Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="principal@college.edu"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-xs text-slate-300">Partnership Purpose *</Label>
              <select
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#00FF88] text-sm"
              >
                {purposeOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-950">
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Context */}
            <div className="space-y-2">
              <Label htmlFor="additionalContext" className="text-xs text-slate-300">Additional Context (Optional)</Label>
              <Textarea
                id="additionalContext"
                placeholder="Mention specific dates, slots or courses you want to offer..."
                rows={3}
                value={formData.additionalContext}
                onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#00FF88] text-black font-black text-base h-12 rounded-xl hover:bg-[#00e077] shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Suggest 3 AI Templates
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Email Preview */}
        <Card className="bg-[#0f0f0f] border-white/5 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white text-base">
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#00FF88]" />
                Generated Outbox Suggestions
              </span>
              {generatedEmail && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="text-slate-400 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-1 text-[#00FF88]" />
                  Regenerate
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {generatedEmail ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-4"
                >
                  {/* Template Selector */}
                  {generatedEmail.templates && (
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold">Select Template Style</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedTemplate === "formal" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTemplate("formal")}
                          className={`flex-1 rounded-xl h-10 ${selectedTemplate === "formal" ? "bg-purple-600 text-white hover:bg-purple-700" : "border-white/5 bg-white/5 text-slate-300 hover:text-white"}`}
                        >
                          📄 Formal
                        </Button>
                        <Button
                          variant={selectedTemplate === "friendly" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTemplate("friendly")}
                          className={`flex-1 rounded-xl h-10 ${selectedTemplate === "friendly" ? "bg-purple-600 text-white hover:bg-purple-700" : "border-white/5 bg-white/5 text-slate-300 hover:text-white"}`}
                        >
                          😊 Friendly
                        </Button>
                        <Button
                          variant={selectedTemplate === "creative" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTemplate("creative")}
                          className={`flex-1 rounded-xl h-10 ${selectedTemplate === "creative" ? "bg-purple-600 text-white hover:bg-purple-700" : "border-white/5 bg-white/5 text-slate-300 hover:text-white"}`}
                        >
                          ✨ Creative
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Subject Line */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-300 font-bold">Subject Line</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          generatedEmail.templates?.[selectedTemplate]?.subject || generatedEmail.subject,
                          "Subject"
                        )}
                        className="text-slate-400 hover:text-white h-7 px-2"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <p className="font-bold text-white text-sm">
                        {generatedEmail.templates?.[selectedTemplate]?.subject || generatedEmail.subject}
                      </p>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-300 font-bold">Email Body</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content,
                            "HTML"
                          )}
                          className="text-slate-400 hover:text-white h-7 px-2"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy HTML
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            stripHtml(generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content),
                            "Plain text"
                          )}
                          className="text-slate-400 hover:text-white h-7 px-2"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy Text
                        </Button>
                      </div>
                    </div>
                    <div
                      className="p-5 bg-white/5 border border-white/5 rounded-xl min-h-[300px] max-h-[450px] overflow-y-auto text-sm leading-relaxed text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content
                      }}
                    />
                  </div>

                  {/* Send Options */}
                  <div className="space-y-3 pt-2">
                    {/* Primary Send Button */}
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail}
                      className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      {isSendingEmail ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending Outbox...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Selected Template Instantly
                        </>
                      )}
                    </Button>
                    
                    <p className="text-[10px] text-slate-500 text-center">
                      * Will be delivered instantly from <strong>shriyash.soni@apnacounsellor.in</strong>. Replying is supported.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[450px] text-center text-slate-500"
                >
                  <Mail className="h-16 w-16 mb-4 opacity-10 text-white" />
                  <p className="text-base text-slate-400 font-bold">No generated templates yet</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">Fill in your campaign details on the left and click "Suggest 3 AI Templates".</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
