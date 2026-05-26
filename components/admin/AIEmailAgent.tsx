"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Mail, Send, Copy, RefreshCw, Loader2, Search, Edit3, User, Globe, Phone, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  name: string;
  url: string;
  description: string;
  type: string;
}

export function AIEmailAgent() {
  const [activeTab, setActiveTab] = useState<"ai-pitch" | "direct-compose" | "lead-finder">("ai-pitch");

  // AI Pitch Form State
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    recipientEmail: "",
    purpose: "partnership",
    additionalContext: "",
    emailLength: "medium"
  });

  // Custom Sender Signature State (Request: Name, Role, Website, Contact - all custom)
  const [senderDetails, setSenderDetails] = useState({
    name: "Shriyash Soni",
    role: "Founder",
    website: "apnacounsellor.in",
    contact: "+91 99999 99999"
  });

  // Direct Email Composer State (Request: Custom email without AI)
  const [directEmail, setDirectEmail] = useState({
    recipientEmail: "",
    subject: "",
    body: ""
  });

  // Lead Finder State (Request: Search agent for colleges/companies/funding partners)
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingLeads, setIsSearchingLeads] = useState(false);
  const [discoveredLeads, setDiscoveredLeads] = useState<Lead[]>([]);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [useColorfulTemplate, setUseColorfulTemplate] = useState(false);
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
      toast.success("AI Outbound ideas suggested successfully!");
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

  // Direct send email handler (Request: Custom email without AI)
  const handleSendDirectEmail = async () => {
    if (!directEmail.recipientEmail || !directEmail.subject || !directEmail.body) {
      toast.error("Please fill in recipient email, subject, and body");
      return;
    }

    setIsSendingEmail(true);
    try {
      // Wrap manual body in our custom signature template too!
      const formattedBody = directEmail.body.replace(/\n/g, "<br/>");
      const htmlContent = convertToPlainTemplate(formattedBody);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: directEmail.recipientEmail,
          subject: directEmail.subject,
          html: htmlContent
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Failed to send custom email");

      toast.success("Custom Email sent successfully!");
      setDirectEmail({ recipientEmail: "", subject: "", body: "" });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to send custom email: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Search Lead finder handler (Request: Live search agent)
  const handleSearchLeads = async () => {
    if (!searchQuery) {
      toast.error("Please enter a search query/region");
      return;
    }

    setIsSearchingLeads(true);
    try {
      const response = await fetch("/api/search-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Failed to find leads");

      setDiscoveredLeads(data.leads || []);
      toast.success(`Discovered ${data.leads?.length || 0} matching partnership leads!`);
    } catch (err) {
      console.error(err);
      toast.error(`Search failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSearchingLeads(false);
    }
  };

  const stripHtml = (html: string): string => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Converts HTML content to a 100% hand-written personal email format (looks exactly like Gmail/Outlook)
  const convertToPlainTemplate = (htmlContent: string): string => {
    return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #222222; line-height: 1.6; text-align: left; background-color: #ffffff; padding: 5px;">
  <div style="margin-bottom: 25px;">
    ${htmlContent}
  </div>

  <!-- Hand-written Style Signature -->
  <div style="margin-top: 30px; border: none; padding: 0;">
    <p style="margin: 0; font-size: 14px; color: #222222;">Best regards,</p>
    <br/>
    <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111111;">${senderDetails.name}</p>
    <p style="margin: 0; font-size: 13px; color: #555555;">${senderDetails.role} | Apna Counsellor</p>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #555555;">
      Website: <a href="https://${senderDetails.website}" style="color: #1155cc; text-decoration: underline;">${senderDetails.website}</a>
    </p>
    <p style="margin: 2px 0 0 0; font-size: 13px; color: #555555;">
      Contact: ${senderDetails.contact}
    </p>
  </div>
</div>
    `.trim();
  };

  const loadLeadIntoPitcher = (lead: Lead) => {
    setFormData({
      ...formData,
      companyName: lead.name,
      companyWebsite: lead.url,
      purpose: lead.type === "College" ? "college" : lead.type === "School" ? "school" : "partnership"
    });
    setWebsiteUrl(lead.url);
    setActiveTab("ai-pitch");
    toast.success(`Lead "${lead.name}" loaded into AI Pitcher!`);
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
    toast.info(`Preset "${template.name}" loaded!`);
  };

  const handleScrapeWebsite = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsScrapingWebsite(true);
    try {
      const response = await fetch(`https://r.jina.ai/${websiteUrl}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!response.ok) throw new Error("Failed to fetch site data");
      
      const text = await response.text();
      const titleMatch = text.match(/Title:\s*(.*)/i);
      const title = titleMatch ? titleMatch[1].trim() : "";
      
      setFormData({
        ...formData,
        companyName: title || websiteUrl.replace(/https?:\/\/(www\.)?/, "").split("/")[0],
        companyWebsite: websiteUrl,
        additionalContext: text.slice(0, 1000) ? `Extracted site summary:\n${text.slice(0, 500)}` : formData.additionalContext
      });

      toast.success("Site data extracted successfully!");
    } catch (err) {
      console.error(err);
      const parsedName = websiteUrl.replace(/https?:\/\/(www\.)?/, "").split(".")[0];
      setFormData({
        ...formData,
        companyName: parsedName.charAt(0).toUpperCase() + parsedName.slice(1),
        companyWebsite: websiteUrl
      });
      toast.success("Data loaded from domain name!");
    } finally {
      setIsScrapingWebsite(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="bg-[#0f0f0f] border-white/5 shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-white tracking-tight">
              <Sparkles className="h-6 w-6 text-[#00FF88] animate-pulse" />
              Apna Counsellor Outreach Command Center
            </CardTitle>
            <CardDescription className="text-slate-400">
              Discover verified partnership leads, generate AI campaigns, or write manual custom pitches instantly.
            </CardDescription>
          </div>
          {/* Custom Tabs */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
            <Button
              onClick={() => setActiveTab("ai-pitch")}
              className={`rounded-lg h-9 text-xs font-black transition-all ${activeTab === "ai-pitch" ? "bg-purple-600 text-white" : "bg-transparent text-slate-400 hover:text-white"}`}
            >
              🤖 AI Email Pitcher
            </Button>
            <Button
              onClick={() => setActiveTab("direct-compose")}
              className={`rounded-lg h-9 text-xs font-black transition-all ${activeTab === "direct-compose" ? "bg-purple-600 text-white" : "bg-transparent text-slate-400 hover:text-white"}`}
            >
              ✍️ Direct Composer
            </Button>
            <Button
              onClick={() => setActiveTab("lead-finder")}
              className={`rounded-lg h-9 text-xs font-black transition-all ${activeTab === "lead-finder" ? "bg-purple-600 text-white border-none" : "bg-transparent text-slate-400 hover:text-white"}`}
            >
              🔍 Live Lead Finder
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Inputs & Configs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Signature panel (Request: Name, Role, Website, Contact) */}
          <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#00FF88]" /> Sender Details (Signature)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-500 font-bold uppercase">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                  <Input
                    value={senderDetails.name}
                    onChange={(e) => setSenderDetails({ ...senderDetails, name: e.target.value })}
                    className="pl-9 h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-500 font-bold uppercase">Role Title</Label>
                <div className="relative">
                  <Edit3 className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                  <Input
                    value={senderDetails.role}
                    onChange={(e) => setSenderDetails({ ...senderDetails, role: e.target.value })}
                    className="pl-9 h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-500 font-bold uppercase">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                  <Input
                    value={senderDetails.website}
                    onChange={(e) => setSenderDetails({ ...senderDetails, website: e.target.value })}
                    className="pl-9 h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-500 font-bold uppercase">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                  <Input
                    value={senderDetails.contact}
                    onChange={(e) => setSenderDetails({ ...senderDetails, contact: e.target.value })}
                    className="pl-9 h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content Rendering */}
          <AnimatePresence mode="wait">
            
            {/* T1: AI Pitch Pitcher Form */}
            {activeTab === "ai-pitch" && (
              <motion.div
                key="ai-pitch-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" /> AI Outbound Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Website Link Extractor */}
                    <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#00FF88]" /> Auto-Fill Website Link
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://college.edu"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="flex-1 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                        />
                        <Button
                          onClick={handleScrapeWebsite}
                          disabled={isScrapingWebsite}
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold"
                          size="sm"
                        >
                          {isScrapingWebsite ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Extract"}
                        </Button>
                      </div>
                    </div>

                    {/* Presets */}
                    <div>
                      <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Outreach Presets</Label>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {emailTemplates.map((t) => (
                          <Button
                            key={t.name}
                            variant="outline"
                            size="sm"
                            onClick={() => loadTemplate(t)}
                            className="text-[10px] rounded-lg border-white/5 bg-white/5 text-slate-300 hover:text-white px-2.5 h-7"
                          >
                            {t.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Target name */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Target Organization Name *</Label>
                      <Input
                        placeholder="e.g. COEP Pune"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                      />
                    </div>

                    {/* Target Email */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Recipient Outbox Email *</Label>
                      <Input
                        type="email"
                        placeholder="placement@college.edu"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                      />
                    </div>

                    {/* Purpose selection */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Partnership Purpose *</Label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#00FF88] text-xs"
                      >
                        {purposeOptions.map((o) => (
                          <option key={o.value} value={o.value} className="bg-slate-950">
                            {o.icon} {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Context */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Additional Context (Optional)</Label>
                      <Textarea
                        placeholder="Explain dates, timelines, slots, or details you specifically want included..."
                        rows={3}
                        value={formData.additionalContext}
                        onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs resize-none"
                      />
                    </div>

                    {/* AI Pitch Trigger */}
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-[#00FF88] text-black font-black text-sm h-11 rounded-xl hover:bg-[#00e077] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Suggesting Templates...</>
                      ) : (
                        <><Sparkles className="h-4 w-4" /> Suggest 3 AI Templates</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* T2: Direct manual composer (Request: Custom email without AI) */}
            {activeTab === "direct-compose" && (
              <motion.div
                key="direct-compose-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-purple-400" /> Direct Composer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Recipient Email *</Label>
                      <Input
                        type="email"
                        placeholder="someone@domain.com"
                        value={directEmail.recipientEmail}
                        onChange={(e) => setDirectEmail({ ...directEmail, recipientEmail: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Subject Line *</Label>
                      <Input
                        placeholder="Proposal for collaboration / partnership"
                        value={directEmail.subject}
                        onChange={(e) => setDirectEmail({ ...directEmail, subject: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Custom Pitch Message Body *</Label>
                      <Textarea
                        placeholder="Dear Principal/Director,\n\nWe would like to propose a tie-up between Apna Counsellor and your organization..."
                        rows={8}
                        value={directEmail.body}
                        onChange={(e) => setDirectEmail({ ...directEmail, body: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs resize-none font-sans"
                      />
                    </div>

                    <Button
                      onClick={handleSendDirectEmail}
                      disabled={isSendingEmail}
                      className="w-full bg-[#00FF88] text-black font-black text-sm h-11 rounded-xl hover:bg-[#00e077] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                    >
                      {isSendingEmail ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Delivering Email...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Send Direct Email</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* T3: Live Search Finder Agent (Request: Search matching partners agent) */}
            {activeTab === "lead-finder" && (
              <motion.div
                key="lead-finder-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Search className="h-5 w-5 text-purple-400" /> Lead Finder Search Agent
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300">Search keywords (e.g. Colleges in Pune, Schools in Delhi)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Colleges / companies / funding groups..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] text-xs h-10"
                        />
                        <Button
                          onClick={handleSearchLeads}
                          disabled={isSearchingLeads}
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold"
                        >
                          {isSearchingLeads ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      * Uses real-time crawling to extract matching institutions and their websites instantly!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Output display & Lead Finder Output */}
        <div className="lg:col-span-3">
          
          <AnimatePresence mode="wait">
            
            {/* Lead Finder Search Results list */}
            {activeTab === "lead-finder" ? (
              <motion.div
                key="lead-finder-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-[#00FF88]" />
                        Discovered Partners Leads
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {discoveredLeads.length} matches found
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {discoveredLeads.length > 0 ? (
                      <div className="grid gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                        {discoveredLeads.map((lead, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  lead.type === "College" ? "bg-blue-500/10 text-blue-400" :
                                  lead.type === "School" ? "bg-amber-500/10 text-amber-400" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {lead.type}
                                </span>
                                <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-2">{lead.description}</p>
                              <a
                                href={lead.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-purple-400 hover:underline inline-block font-mono mt-1"
                              >
                                {lead.url.replace(/https?:\/\/(www\.)?/, "")} ↗
                              </a>
                            </div>
                            <Button
                              onClick={() => loadLeadIntoPitcher(lead)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs shrink-0 font-bold"
                            >
                              📥 Pitch Lead
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500 text-center">
                        <Search className="h-14 w-14 mb-3 opacity-10 text-white" />
                        <p className="text-base text-slate-400 font-bold">Search Search Finder Agent</p>
                        <p className="text-xs text-slate-600 mt-1 max-w-xs">
                          Type keywords in the search panel on the left (e.g. "Engineering colleges in Pune") to discover partner leads.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : activeTab === "direct-compose" ? (
              
              // Direct Compose Live Output Preview
              <motion.div
                key="direct-compose-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#00FF88]" /> Outbox Preview (Direct Composer)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Live Outbox Subject and HTML rendering */}
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold">Subject Line</Label>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-bold text-white text-xs">
                        {directEmail.subject || "(Subject will appear here)"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-300 font-bold">Outbound Email Structure</Label>
                      <div
                        className="p-5 bg-white/5 border border-white/5 rounded-xl min-h-[300px] text-xs leading-relaxed text-slate-300"
                        dangerouslySetInnerHTML={{
                          __html: convertToPlainTemplate(directEmail.body.replace(/\n/g, "<br/>") || "Message body written in composer will appear here...")
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              
              // Standard AI Outbox Suggestion Panel
              <motion.div
                key="ai-pitch-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl">
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
                    {generatedEmail ? (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Style Selectors */}
                        {generatedEmail.templates && (
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-bold">Select Template Style</Label>
                            <div className="flex gap-2">
                              {["formal", "friendly", "creative"].map((style) => (
                                <Button
                                  key={style}
                                  variant={selectedTemplate === style ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedTemplate(style as any)}
                                  className={`flex-1 rounded-xl h-9 text-xs capitalize ${selectedTemplate === style ? "bg-purple-600 text-white hover:bg-purple-700" : "border-white/5 bg-white/5 text-slate-300 hover:text-white"}`}
                                >
                                  {style === "formal" ? "📄 Formal" : style === "friendly" ? "😊 Friendly" : "✨ Creative"}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subject */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300 font-bold">Subject Line</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(
                                generatedEmail.templates?.[selectedTemplate]?.subject || generatedEmail.subject,
                                "Subject"
                              )}
                              className="text-slate-400 hover:text-white h-6 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3 mr-1" /> Copy
                            </Button>
                          </div>
                          <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-bold text-white text-xs">
                            {generatedEmail.templates?.[selectedTemplate]?.subject || generatedEmail.subject}
                          </div>
                        </div>

                        {/* Body Preview */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300 font-bold">Email Body</Label>
                            <div className="flex gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(
                                  generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content,
                                  "HTML"
                                )}
                                className="text-slate-400 hover:text-white h-6 px-2 text-[10px]"
                              >
                                <Copy className="h-3 w-3 mr-1" /> Copy HTML
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(
                                  stripHtml(generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content),
                                  "Plain text"
                                )}
                                className="text-slate-400 hover:text-white h-6 px-2 text-[10px]"
                              >
                                <Copy className="h-3 w-3 mr-1" /> Copy Text
                              </Button>
                            </div>
                          </div>
                          <div
                            className="p-5 bg-white/5 border border-white/5 rounded-xl min-h-[250px] max-h-[350px] overflow-y-auto text-xs leading-relaxed text-slate-300"
                            dangerouslySetInnerHTML={{
                              __html: convertToPlainTemplate(generatedEmail.templates?.[selectedTemplate]?.content || generatedEmail.content)
                            }}
                          />
                        </div>

                        {/* Outbound Delivery button */}
                        <div className="space-y-2 pt-2">
                          <Button
                            onClick={handleSendEmail}
                            disabled={isSendingEmail}
                            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs"
                          >
                            {isSendingEmail ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                            ) : (
                              <><Send className="h-4 w-4" /> Send Pitch Outbox Instantly</>
                            )}
                          </Button>
                          <p className="text-[9px] text-slate-500 text-center flex items-center justify-center gap-1">
                            <CheckCircle className="h-3 w-3 text-[#00FF88]" /> Delivered live via <strong>shriyash.soni@apnacounsellor.in</strong>. Full reply support.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[350px] text-center text-slate-500">
                        <Mail className="h-16 w-16 mb-4 opacity-10 text-white animate-pulse" />
                        <p className="text-base text-slate-400 font-bold">No outbound suggestions yet</p>
                        <p className="text-xs text-slate-600 mt-1 max-w-xs">Fill in your campaign details on the left and click "Suggest 3 AI Templates".</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
