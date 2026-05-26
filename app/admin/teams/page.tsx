"use client"

import { useEffect, useState } from "react"
import { getTeamMembersAction, addTeamMemberAction, updateTeamMemberAction, removeTeamMemberAction, TeamMember } from "@/lib/actions/team"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Users, Shield, Check, Plus, Trash2, Edit2, Loader2, Award, BookOpen, BarChart2, Megaphone, Sparkles, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

const AVAILABLE_PERMISSIONS = [
  { id: "courses", label: "Launch & Manage Courses", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10", desc: "Access to /admin/courses to edit syllabus, price and metadata" },
  { id: "analytics", label: "Analyze Dashboard & Metrics", icon: BarChart2, color: "text-blue-400 bg-blue-500/10", desc: "Access to audit overview metrics, graphs, and sales sheets" },
  { id: "students", label: "Manage Student Profiles", icon: Users, color: "text-purple-400 bg-purple-500/10", desc: "Access to /admin/students list and view academic details" },
  { id: "broadcast", label: "Send General Broadcasts", icon: Megaphone, color: "text-amber-400 bg-amber-500/10", desc: "Access to send system-wide notifications and bulk actions" },
  { id: "email-agent", label: "AI Email Outreach Agent", icon: Sparkles, color: "text-pink-400 bg-pink-500/10", desc: "Access to live search leads finder, AI generation and Resend outbox" },
]

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Add Member Modal / Form State
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<'mentor' | 'admin'>("mentor")
  const [newMemberPermissions, setNewMemberPermissions] = useState<string[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Editing State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editRole, setEditRole] = useState<'student' | 'mentor' | 'admin'>("mentor")

  const loadTeam = async () => {
    setIsLoading(true)
    const res = await getTeamMembersAction()
    if (res.success && res.team) {
      setTeam(res.team)
    } else {
      toast.error(res.error || "Failed to load team members")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSaving(true)
    const res = await addTeamMemberAction(newMemberEmail, newMemberRole, newMemberPermissions)
    if (res.success) {
      toast.success("Team member added and permissions assigned successfully!")
      setNewMemberEmail("")
      setNewMemberPermissions([])
      setIsAddOpen(false)
      loadTeam()
    } else {
      toast.error(res.error || "Failed to add team member")
    }
    setIsSaving(false)
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return

    setIsSaving(true)
    const res = await updateTeamMemberAction(editingMember.id, editRole, editPermissions)
    if (res.success) {
      toast.success("Permissions updated successfully!")
      setEditingMember(null)
      loadTeam()
    } else {
      toast.error(res.error || "Failed to update permissions")
    }
    setIsSaving(false)
  }

  const handleRemoveMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team? This will clear all their custom access permissions.`)) return

    const res = await removeTeamMemberAction(id)
    if (res.success) {
      toast.success(`${name} has been removed from the team.`)
      loadTeam()
    } else {
      toast.error(res.error || "Failed to remove member")
    }
  }

  const togglePermission = (id: string, isEdit: boolean) => {
    if (isEdit) {
      setEditPermissions(prev =>
        prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
      )
    } else {
      setNewMemberPermissions(prev =>
        prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
      )
    }
  }

  const selectAllPermissions = (isEdit: boolean) => {
    const all = AVAILABLE_PERMISSIONS.map(p => p.id)
    if (isEdit) {
      setEditPermissions(all)
    } else {
      setNewMemberPermissions(all)
    }
  }

  const clearAllPermissions = (isEdit: boolean) => {
    if (isEdit) {
      setEditPermissions([])
    } else {
      setNewMemberPermissions([])
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* Header Overview Card */}
      <Card className="bg-[#0f0f0f] border-white/5 shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-white tracking-tight">
              <Users className="h-6 w-6 text-purple-500 animate-pulse" />
              Role & Team Management Console
            </CardTitle>
            <CardDescription className="text-slate-400">
              Add team members, assign modular access rules, and delegate administrative tasks securely.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6 text-xs font-black shadow-[0_0_20px_rgba(124,58,237,0.2)] shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Team Member
          </Button>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT/CENTER LIST: Active Team Members */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0f0f0f] border-white/5 shadow-xl min-h-[450px]">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white text-base flex items-center justify-between">
                <span>Active Team & Staff</span>
                <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-md font-mono">
                  {team.length} members
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-2" />
                  <p className="text-xs">Fetching command center staff credentials...</p>
                </div>
              ) : team.length > 0 ? (
                <div className="grid gap-4">
                  {team.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <Avatar className="h-11 w-11 rounded-lg border border-white/10">
                          <AvatarImage src={member.image} />
                          <AvatarFallback className="bg-purple-900/50 text-purple-300 text-xs font-black rounded-lg">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm leading-none">{member.name}</h4>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              member.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono">{member.email}</p>
                          
                          {/* Permissions badged row */}
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {member.permissions.length > 0 ? (
                              member.permissions.map((p) => {
                                const config = AVAILABLE_PERMISSIONS.find(ap => ap.id === p)
                                if (!config) return null
                                return (
                                  <span
                                    key={p}
                                    className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1"
                                  >
                                    <config.icon className="h-2.5 w-2.5" />
                                    {config.label.split(" ").slice(0, 2).join(" ")}
                                  </span>
                                )
                              })
                            ) : (
                              <span className="text-[9px] text-slate-600 italic">No custom modular rules assigned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMember(member)
                            setEditPermissions(member.permissions)
                            setEditRole(member.role)
                          }}
                          className="h-8 rounded-lg border-white/5 bg-white/5 text-slate-300 hover:text-white px-3 text-xs"
                        >
                          <Edit2 className="h-3 w-3 mr-1.5" /> Edit Rules
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="h-8 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 text-center">
                  <Shield className="h-14 w-14 opacity-10 text-white mb-3" />
                  <p className="font-bold text-slate-400">No Staff Assigned</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">
                    Assign other registered students or mentors to the staff/admin console using the button above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Configuration Drawer (Add/Edit member permissions) */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            
            {/* 1. EDIT MODE */}
            {editingMember ? (
              <motion.div
                key="edit-member-card"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl border border-purple-500/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <CardTitle className="text-white text-base">Edit Team Access</CardTitle>
                      <CardDescription className="text-[11px] text-purple-400 font-bold">{editingMember.name}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMember(null)}
                      className="text-slate-400 hover:text-white h-7 w-7 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    {/* Role Title Selection */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Staff Console Role</Label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as any)}
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-purple-500"
                      >
                        <option value="mentor" className="bg-slate-950">Mentor / Content Creator</option>
                        <option value="admin" className="bg-slate-950">Admin / Manager</option>
                      </select>
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300 font-bold">Modular Access Rules</Label>
                        <div className="flex gap-1.5 text-[9px] font-black uppercase text-slate-500">
                          <button onClick={() => selectAllPermissions(true)} className="hover:text-purple-400 transition-all">All</button>
                          <span>|</span>
                          <button onClick={() => clearAllPermissions(true)} className="hover:text-purple-400 transition-all">Clear</button>
                        </div>
                      </div>

                      <div className="grid gap-2.5">
                        {AVAILABLE_PERMISSIONS.map((p) => {
                          const isChecked = editPermissions.includes(p.id)
                          return (
                            <div
                              key={p.id}
                              onClick={() => togglePermission(p.id, true)}
                              className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                                isChecked
                                  ? "bg-purple-950/20 border-purple-500/30 text-white"
                                  : "bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${p.color}`}>
                                <p.icon className="h-4 w-4" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-xs flex items-center gap-1.5">
                                  {p.label}
                                  {isChecked && <Check className="h-3 w-3 text-purple-400" />}
                                </h5>
                                <p className="text-[10px] text-slate-500 leading-tight">{p.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-2">
                      <Button
                        onClick={() => setEditingMember(null)}
                        variant="outline"
                        className="flex-1 rounded-xl h-10 border-white/5 bg-white/5 text-slate-300 hover:text-white text-xs font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateMember}
                        disabled={isSaving}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : isAddOpen ? (
              
              // 2. ADD MODE
              <motion.div
                key="add-member-card"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl border border-purple-500/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <CardTitle className="text-white text-base">Add Team Member</CardTitle>
                      <CardDescription className="text-[11px] text-slate-500">Provide staff login email to assign rules</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddOpen(false)}
                      className="text-slate-400 hover:text-white h-7 w-7 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">User Login Email *</Label>
                      <Input
                        type="email"
                        placeholder="team.member@apnacounsellor.in"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white rounded-xl text-xs h-10 placeholder:text-slate-600"
                      />
                    </div>

                    {/* Role Title Selection */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Staff Console Role</Label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as any)}
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-purple-500"
                      >
                        <option value="mentor" className="bg-slate-950">Mentor / Content Creator</option>
                        <option value="admin" className="bg-slate-950">Admin / Manager</option>
                      </select>
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300 font-bold">Modular Access Rules</Label>
                        <div className="flex gap-1.5 text-[9px] font-black uppercase text-slate-500">
                          <button onClick={() => selectAllPermissions(false)} className="hover:text-purple-400 transition-all">All</button>
                          <span>|</span>
                          <button onClick={() => clearAllPermissions(false)} className="hover:text-purple-400 transition-all">Clear</button>
                        </div>
                      </div>

                      <div className="grid gap-2.5">
                        {AVAILABLE_PERMISSIONS.map((p) => {
                          const isChecked = newMemberPermissions.includes(p.id)
                          return (
                            <div
                              key={p.id}
                              onClick={() => togglePermission(p.id, false)}
                              className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                                isChecked
                                  ? "bg-purple-950/20 border-purple-500/30 text-white"
                                  : "bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${p.color}`}>
                                <p.icon className="h-4 w-4" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-xs flex items-center gap-1.5">
                                  {p.label}
                                  {isChecked && <Check className="h-3 w-3 text-purple-400" />}
                                </h5>
                                <p className="text-[10px] text-slate-500 leading-tight">{p.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-2">
                      <Button
                        onClick={() => setIsAddOpen(false)}
                        variant="outline"
                        className="flex-1 rounded-xl h-10 border-white/5 bg-white/5 text-slate-300 hover:text-white text-xs font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        disabled={isSaving}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Staff"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              
              // 3. SELECTION PLACEHOLDER
              <motion.div
                key="placeholder-member-card"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
              >
                <Card className="bg-[#0f0f0f] border-white/5 shadow-xl min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Award className="h-14 w-14 opacity-10 text-white mb-3" />
                  <p className="font-bold text-slate-400">Modular Access Configurator</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
                    Select any team member from the left to edit their command center access permissions, or add new staff.
                  </p>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
