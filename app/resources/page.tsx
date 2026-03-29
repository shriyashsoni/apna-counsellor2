import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowDown, ArrowRight, BookOpen, CheckCircle, FileText, List, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Resources – Cutoffs, Documents, Fee Structures & More",
  description:
    "Download updated PDFs, college cutoffs, priority lists, roadmap guides, and fee structure comparisons from Apna Counsellor's expert database.",
  keywords:
    "counselling resources, cutoff PDF, fee structure, college priority list, roadmap to admission, document checklist, free admission tools",
}

export default function ResourcesPage() {
  const mhtCetResources = [
    {
      name: "CAP Round Schedule 2025",
      type: "PDF",
      description: "Revised Tentative Schedule of CET AY 2025-26",
      link: "https://cetcell.mahacet.org/wp-content/uploads/2023/12/Revised-CET-2025-Schedule-.pdf",
      official: true,
    },
    {
      name: "Document Verification Checklist",
      type: "Guide",
      description: "Complete list of documents required for MHT CET Counselling 2025",
      link: "https://www.collegedekho.com/articles/documents-required-for-mht-cet-counselling/",
      official: false,
    },
    {
      name: "College Codes List - Maharashtra",
      type: "PDF",
      description: "List of MHT CET Colleges with Institute Code & Total Seat Intake",
      link: "https://www.shiksha.com/engineering/articles/list-of-mht-cet-colleges-with-institute-code-total-seat-intake-blogId-54951",
      official: false,
    },
    {
      name: "Choice Filling Strategy Guide",
      type: "Guide",
      description: "MHT CET 2025 Option Entry: How to Fill & Submit Online",
      link: "https://engineering.careers360.com/articles/mht-cet-option-entry",
      official: false,
    },
    {
      name: "Previous Year Cutoffs - All India Seats (2024)",
      type: "PDF",
      description: "MHT CET CAP Round 1 AI Cutoff 2024",
      link: "https://static.collegedekho.com/media/uploads/2024/08/16/mht-cet-cap-round-1-ai-cutoff-2024.pdf",
      official: true,
    },
    {
      name: "CAP Round III Cut Off List (2024)",
      type: "PDF",
      description: "Maharashtra & Minority Seats Cutoffs",
      link: "https://fe2024.mahacet.org/2023/2023ENGG_CAP3_CutOff.pdf",
      official: true,
    },
  ]

  const josaResources = [
    {
      name: "JoSAA Counselling Schedule 2025",
      type: "PDF",
      description: "Official schedule with registration dates starting June 3, 2025",
      link: "https://josaa.nic.in/schedule/",
      official: true,
    },
    {
      name: "IIT/NIT/IIIT/GFTI Seat Matrix 2025",
      type: "PDF",
      description: "Complete seat matrix for all participating institutes",
      link: "https://cdnbbsr.s3waas.gov.in/s313111c20aee51aeb480ecbd988cd8cc9/uploads/2025/05/2025052825.pdf",
      official: true,
    },
    {
      name: "CSAB Special Round Guide 2025",
      type: "PDF",
      description: "Guidelines for CSAB Special Rounds",
      link: "https://cdnbbsr.s3waas.gov.in/s305a70454516ecd9194c293b0e415777f/uploads/2025/05/2025052931.pdf",
      official: true,
    },
    {
      name: "CSAB Special Rounds FAQs",
      type: "PDF",
      description: "Frequently Asked Questions on CSAB-Special Rounds 2025",
      link: "https://cdnbbsr.s3waas.gov.in/s305a70454516ecd9194c293b0e415777f/uploads/2025/06/2025060128.pdf",
      official: true,
    },
    {
      name: "Documents Required for JoSAA",
      type: "Guide",
      description: "Complete document checklist for JoSAA Counselling 2025",
      link: "https://www.shiksha.com/engineering/articles/documents-required-for-josaa-counselling-blogId-200994",
      official: false,
    },
    {
      name: "Opening and Closing Ranks 2024",
      type: "PDF",
      description: "Branch-wise closing ranks for all institutes",
      link: "https://josaa.nic.in/document/opening-and-closing-ranks-2024/",
      official: true,
    },
    {
      name: "Choice Filling Strategy Guide",
      type: "Guide",
      description: "Step-by-step guide for JoSAA choice filling",
      link: "https://www.shiksha.com/b-tech/josaa-counselling-choice-filling",
      official: false,
    },
  ]

  const mpDteResources = [
    {
      name: "MP DTE Counselling Schedule 2025",
      type: "Official",
      description: "Registration started May 27, choice filling June 6-24, 2025",
      link: "https://dte.mponline.gov.in/",
      official: true,
    },
    {
      name: "MP College Codes List",
      type: "List",
      description: "Complete list of registered colleges in MP",
      link: "https://isms.mponline.gov.in/portal/Services/IMS/frm_RegisteredCollegeList.aspx",
      official: true,
    },
    {
      name: "Document Verification Guide",
      type: "Guide",
      description: "MP BE Counselling document requirements and dates",
      link: "https://engineering.careers360.com/articles/mp-be-admission-dates",
      official: false,
    },
    {
      name: "Previous Year Cutoffs & Analysis",
      type: "Guide",
      description: "MP DTE counselling trends and cutoff analysis",
      link: "https://engineering.careers360.com/articles/mp-be-admission-dates",
      official: false,
    },
    {
      name: "Choice Filling Strategy for MP DTE",
      type: "Guide",
      description: "Strategic approach to MP DTE choice filling",
      link: "https://engineering.careers360.com/articles/mp-be-admission-dates",
      official: false,
    },
  ]

  const generalResources = [
    {
      name: "Understanding Counselling Rounds",
      type: "PDF",
      description: "Universal guide to counselling process across all exams",
      link: "#",
      official: false,
    },
    {
      name: "College Research Checklist",
      type: "PDF",
      description: "How to research and evaluate colleges effectively",
      link: "#",
      official: false,
    },
    {
      name: "Branch Selection Guide",
      type: "PDF",
      description: "Comprehensive guide to choosing the right engineering branch",
      link: "#",
      official: false,
    },
    {
      name: "Hostel & Accommodation Guide",
      type: "PDF",
      description: "Everything you need to know about college accommodation",
      link: "#",
      official: false,
    },
    {
      name: "Scholarship Opportunities",
      type: "PDF",
      description: "Complete list of scholarships for engineering students",
      link: "#",
      official: false,
    },
    {
      name: "Post-Admission Formalities",
      type: "PDF",
      description: "Step-by-step guide for post-admission procedures",
      link: "#",
      official: false,
    },
  ]

  const resourceCategories = [
    {
      title: "MHT CET Resources",
      description: "Official documents and guides for Maharashtra's engineering and pharmacy admissions",
      resources: mhtCetResources,
      officialWebsite: "https://cetcell.mahacet.org",
      websiteName: "CET Cell Maharashtra",
    },
    {
      title: "JEE/JoSAA Resources",
      description: "Materials for JEE Main/Advanced students seeking IIT/NIT/IIIT admissions",
      resources: josaResources,
      officialWebsite: "https://josaa.nic.in/",
      websiteName: "JoSAA Official",
    },
    {
      title: "MP DTE Resources",
      description: "Guides and documents for engineering admissions in Madhya Pradesh",
      resources: mpDteResources,
      officialWebsite: "https://dte.mponline.gov.in/",
      websiteName: "DTE MP Online",
    },
    {
      title: "General Admission Resources",
      description: "Universal guides applicable to all counselling processes",
      resources: generalResources,
      officialWebsite: null,
      websiteName: null,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Resources & Documents</h1>
        <p className="text-lg mb-12">
          Access verified PDFs, guides, checklists, and resources to help you navigate the admission process smoothly.
          All resources are regularly updated to ensure accuracy and include official documents from government sources.
        </p>

        <div className="space-y-12">
          {resourceCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-primary" />
                  {category.title}
                </h2>
                {category.officialWebsite && (
                  <Link href={category.officialWebsite} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Visit {category.websiteName}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300">{category.description}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {category.resources.map((resource, idx) => (
                  <Card key={idx} className="border-primary/10 h-full flex flex-col">
                    <CardHeader className="pb-2 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            resource.official
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {resource.official ? "Official" : resource.type}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">{resource.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{resource.description}</p>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      {resource.link !== "#" ? (
                        <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" className="w-full">
                            {resource.type === "PDF" ? "Download PDF" : "View Resource"}
                            {resource.type === "PDF" ? (
                              <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                              <ExternalLink className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mt-12 mb-12">
          <h2 className="text-2xl font-bold mb-4">📋 Important Notes</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <p>
                <strong>Official Sources:</strong> Resources marked as "Official" are directly from government websites
                and examination authorities.
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <p>
                <strong>Regular Updates:</strong> All resources are updated annually to reflect the latest changes in
                counselling processes.
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
              <p>
                <strong>Fee Structures:</strong> Individual college fee structures are available on respective college
                websites.
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
              <p>
                <strong>Verification:</strong> Always cross-check important information with official websites before
                making decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Resource Request</h2>
          <p className="mb-6">
            Can't find what you're looking for? Let us know what resources would be helpful for your admission journey.
          </p>
          <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
            <Button>
              Request a Resource
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Why Our Resources Matter</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="h-8 w-8 mb-4 text-primary" />,
                title: "Verified Information",
                description: "All our resources contain verified data from official sources to ensure accuracy.",
              },
              {
                icon: <FileText className="h-8 w-8 mb-4 text-primary" />,
                title: "Comprehensive Guides",
                description: "Detailed step-by-step guides that cover every aspect of the admission process.",
              },
              {
                icon: <List className="h-8 w-8 mb-4 text-primary" />,
                title: "Regularly Updated",
                description:
                  "All resources are updated annually to reflect the latest changes in counselling processes.",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 border-primary/20">
                <CardContent className="p-0">
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h2>
          <p className="text-lg mb-6">
            For personalized assistance with using these resources or navigating the admission process, book a
            counselling call with our experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-call">
              <Button className="animated-gradient text-white hover:text-white">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://chat.whatsapp.com/LlfJI9MPk3834p4sUvRwaa" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                Join WhatsApp Group
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
