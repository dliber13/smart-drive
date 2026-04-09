"use client"

import { useEffect, useState } from "react"

type Team = {
  id: string
  name: string
  _count?: {
    users: number
    applications: number
  }
}

type User = {
  id: string
  email: string
  fullName: string
  role: "ADMIN" | "SALES"
  teamId: string | null
  teamName: string | null
}

type Me = {
  id: string
  email: string
  fullName: string
  role: "ADMIN" | "SALES"
  teamId: string | null
  teamName: string | null
}

export default function AdminPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [teamName, setTeamName] = useState("")
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "SALES",
    teamId: "",
  })
  const [message, setMessage] = useState("")

  async function loadData() {
    const meRes = await fetch("/api/auth/me", { cache: "no-store" })
    if (!meRes.ok) {
      window.location.href = "/login"
      return
    }

    const meData = await meRes.json()
    setMe(meData.user)

    if (meData.user.role !== "ADMIN") {
      window.location.href = "/dealer"
      return
    }

    const [teamsRes, usersRes] = await Promise.all([
      fetch("/api/admin/teams", { cache: "no-store" }),
      fetch("/api/admin/users", { cache: "no-store" }),
    ])

    const teamsData = await teamsRes.json()
    const usersData = await usersRes.json()

    setTeams(Array.isArray(teamsData) ? teamsData : [])
    setUsers(Array.isArray(usersData) ? usersData : [])
  }

  useEffect(() => {
    loadData()
  }, [])

  async function createTeam(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")

    const res = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    })

    const data = await res.json()
    if (!res.ok) {
      setMessage(data?.error || "Failed to create team")
      return
    }

    setTeamName("")
    setMessage("Team created.")
    await loadData()
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        teamId: userForm.teamId || null,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setMessage(data?.error || "Failed to create user")
      return
    }

    setUserForm({
      fullName: "",
      email: "",
      password: "",
      role: "SALES",
      teamId: "",
    })
    setMessage("User created.")
    await loadData()
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-8 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
              SmartDrive Financial
            </div>
            <h1 className="mt-3 text-[46px] font-semibold leading-none tracking-[-0.05em]">
              Admin Settings
            </h1>
            <p className="mt-3 text-[16px] text-black/60">
              {me ? `Signed in as ${me.fullName}` : "Loading..."}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold text-black/70"
          >
            Log Out
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-[18px] border border-black/8 bg-white px-5 py-4 text-[14px] text-black/70">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
              Team management
            </div>
            <h2 className="text-[32px] font-semibold tracking-[-0.04em]">
              Sales Teams
            </h2>

            <form onSubmit={createTeam} className="mt-6 flex gap-3">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
                className="flex-1 rounded-[18px] border border-black/10 px-5 py-4 outline-none"
              />
              <button className="rounded-[18px] bg-[#111111] px-5 py-4 font-semibold text-white">
                Add Team
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-[22px] border border-black/8 bg-[#fcfbf8] px-5 py-4"
                >
                  <div className="text-[18px] font-semibold">{team.name}</div>
                  <div className="mt-2 text-sm text-black/55">
                    Users: {team._count?.users ?? 0} · Deals: {team._count?.applications ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
              User management
            </div>
            <h2 className="text-[32px] font-semibold tracking-[-0.04em]">
              Platform Users
            </h2>

            <form onSubmit={createUser} className="mt-6 space-y-4">
              <input
                value={userForm.fullName}
                onChange={(e) => setUserForm((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Full name"
                className="w-full rounded-[18px] border border-black/10 px-5 py-4 outline-none"
              />
              <input
                value={userForm.email}
                onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                className="w-full rounded-[18px] border border-black/10 px-5 py-4 outline-none"
              />
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Password"
                className="w-full rounded-[18px] border border-black/10 px-5 py-4 outline-none"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                >
                  <option value="SALES">Sales</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <select
                  value={userForm.teamId}
                  onChange={(e) => setUserForm((p) => ({ ...p, teamId: e.target.value }))}
                  className="w-full rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                >
                  <option value="">No team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="rounded-[18px] bg-[#111111] px-5 py-4 font-semibold text-white">
                Create User
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-[22px] border border-black/8 bg-[#fcfbf8] px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[18px] font-semibold">{user.fullName}</div>
                      <div className="mt-1 text-sm text-black/55">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                        {user.role}
                      </div>
                      <div className="mt-2 text-sm text-black/50">
                        {user.teamName || "No team"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
