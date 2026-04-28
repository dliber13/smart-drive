"use client";
import { useState, useEffect } from "react";

type Dealer = { id: string; name: string; code: string; dealerNumber?: string; city?: string; state?: string; status: string; DealerUser?: any[]; DealerGroup?: any };
type User = { id: string; email: string; firstName?: string; lastName?: string; role: string; isActive: boolean; DealerUser?: any[] };
type Group = { id: string; groupNumber: string; name: string; contactName?: string; contactEmail?: string; Dealer?: any[] };

export default function AdminPage() {
  const [tab, setTab] = useState<"groups" | "dealers" | "users">("dealers");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [msg, setMsg] = useState("");

  const [newDealer, setNewDealer] = useState({ name: "", code: "", dealerNumber: "", phone: "", address: "", city: "", state: "", zip: "", groupId: "" });
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "TempPass2026!", role: "DEALER_USER", dealerId: "" });
  const [newGroup, setNewGroup] = useState({ name: "", groupNumber: "", contactName: "", contactEmail: "", contactPhone: "" });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [d, u, g] = await Promise.all([
      fetch("/api/admin/dealers").then(r => r.json()),
      fetch("/api/admin/users").then(r => r.json()),
      fetch("/api/admin/groups").then(r => r.json()),
    ]);
    setDealers(d.dealers || []);
    setUsers(u.users || []);
    setGroups(g.groups || []);
    setLoading(false);
  }

  async function addDealer() {
    const res = await fetch("/api/admin/dealers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newDealer) });
    if (res.ok) { setMsg("Dealer created!"); setShowAddDealer(false); loadAll(); }
    else setMsg("Error creating dealer");
  }

  async function addUser() {
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
    if (res.ok) { setMsg("User created!"); setShowAddUser(false); loadAll(); }
    else setMsg("Error creating user");
  }

  async function addGroup() {
    const res = await fetch("/api/admin/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newGroup) });
    if (res.ok) { setMsg("Group created!"); setShowAddGroup(false); loadAll(); }
    else setMsg("Error creating group");
  }

  const inputStyle = { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, marginBottom: 10 };
  const btnPrimary = { background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 };
  const btnSecondary = { background: "#f5f5f5", color: "#333", border: "1px solid #ddd", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#000", color: "#fff", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 2 }}>SMART DRIVE ELITE</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Admin Panel</div>
        </div>
        <a href="/dealer" style={{ color: "#fff", opacity: 0.7, fontSize: 13, textDecoration: "none" }}>← Back to Dealer</a>
      </div>

      {msg && <div style={{ background: "#d4edda", color: "#155724", padding: "12px 32px", fontSize: 14 }}>{msg} <span style={{ cursor: "pointer", marginLeft: 12 }} onClick={() => setMsg("")}>✕</span></div>}

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["dealers", "users", "groups"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btnSecondary, ...(tab === t ? { background: "#000", color: "#fff", border: "1px solid #000" } : {}) }}>
              {t === "dealers" ? `Dealers (${dealers.length})` : t === "users" ? `Users (${users.length})` : `Groups (${groups.length})`}
            </button>
          ))}
        </div>

        {loading ? <div>Loading...</div> : <>
          {tab === "dealers" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>Dealerships</h2>
                <button style={btnPrimary} onClick={() => setShowAddDealer(true)}>+ Add Dealer</button>
              </div>
              {showAddDealer && (
                <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ marginTop: 0 }}>New Dealer</h3>
                  <select style={inputStyle} value={newDealer.groupId} onChange={e => setNewDealer({ ...newDealer, groupId: e.target.value })}>
                    <option value="">Select Dealer Group</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.groupNumber})</option>)}
                  </select>
                  <input style={inputStyle} placeholder="Dealer Name" value={newDealer.name} onChange={e => setNewDealer({ ...newDealer, name: e.target.value })} />
                  <input style={inputStyle} placeholder="Dealer Code (e.g. GOOD-AUTOS-2)" value={newDealer.code} onChange={e => setNewDealer({ ...newDealer, code: e.target.value })} />
                  <input style={inputStyle} placeholder="Dealer Number (e.g. DA-0002)" value={newDealer.dealerNumber} onChange={e => setNewDealer({ ...newDealer, dealerNumber: e.target.value })} />
                  <input style={inputStyle} placeholder="Phone" value={newDealer.phone} onChange={e => setNewDealer({ ...newDealer, phone: e.target.value })} />
                  <input style={inputStyle} placeholder="Address" value={newDealer.address} onChange={e => setNewDealer({ ...newDealer, address: e.target.value })} />
                  <input style={inputStyle} placeholder="City" value={newDealer.city} onChange={e => setNewDealer({ ...newDealer, city: e.target.value })} />
                  <input style={inputStyle} placeholder="State (e.g. MO)" value={newDealer.state} onChange={e => setNewDealer({ ...newDealer, state: e.target.value })} />
                  <input style={inputStyle} placeholder="Zip" value={newDealer.zip} onChange={e => setNewDealer({ ...newDealer, zip: e.target.value })} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnPrimary} onClick={addDealer}>Create Dealer</button>
                    <button style={btnSecondary} onClick={() => setShowAddDealer(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <table style={{ width: "100%", background: "#fff", borderRadius: 8, borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr style={{ borderBottom: "2px solid #eee" }}>
                  {["Dealer #", "Name", "Code", "Group", "Location", "Users", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "#666" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {dealers.map(d => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.dealerNumber || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>{d.name}</td>
                      <td style={{ padding: "12px 16px", color: "#666", fontSize: 12 }}>{d.code}</td>
                      <td style={{ padding: "12px 16px", color: "#666" }}>{d.DealerGroup?.name || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#666" }}>{d.city && d.state ? `${d.city}, ${d.state}` : "—"}</td>
                      <td style={{ padding: "12px 16px" }}>{d.DealerUser?.length || 0}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: d.status === "ACTIVE" ? "#d4edda" : "#f8d7da", color: d.status === "ACTIVE" ? "#155724" : "#721c24", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>Users</h2>
                <button style={btnPrimary} onClick={() => setShowAddUser(true)}>+ Add User</button>
              </div>
              {showAddUser && (
                <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ marginTop: 0 }}>New User</h3>
                  <input style={inputStyle} placeholder="First Name" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} />
                  <input style={inputStyle} placeholder="Last Name" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} />
                  <input style={inputStyle} placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  <input style={inputStyle} placeholder="Temp Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  <select style={inputStyle} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="DEALER_USER">Sales (DEALER_USER)</option>
                    <option value="DEALER_MANAGER">Manager (DEALER_MANAGER)</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="UNDERWRITER">Underwriter</option>
                    <option value="ANALYST">Analyst</option>
                  </select>
                  <select style={inputStyle} value={newUser.dealerId} onChange={e => setNewUser({ ...newUser, dealerId: e.target.value })}>
                    <option value="">No Dealer (Internal User)</option>
                    {dealers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.dealerNumber || d.code})</option>)}
                  </select>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnPrimary} onClick={addUser}>Create User</button>
                    <button style={btnSecondary} onClick={() => setShowAddUser(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <table style={{ width: "100%", background: "#fff", borderRadius: 8, borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr style={{ borderBottom: "2px solid #eee" }}>
                  {["Name", "Email", "Role", "Dealer", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "#666" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: "12px 16px", color: "#666" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: "#e8e8e8", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>{u.role}</span></td>
                      <td style={{ padding: "12px 16px", color: "#666" }}>{u.DealerUser?.[0]?.Dealer?.name || "Internal"}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: u.isActive ? "#d4edda" : "#f8d7da", color: u.isActive ? "#155724" : "#721c24", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>{u.isActive ? "Active" : "Inactive"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "groups" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>Dealer Groups</h2>
                <button style={btnPrimary} onClick={() => setShowAddGroup(true)}>+ Add Group</button>
              </div>
              {showAddGroup && (
                <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ marginTop: 0 }}>New Dealer Group</h3>
                  <input style={inputStyle} placeholder="Group Name (e.g. Good Autos)" value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} />
                  <input style={inputStyle} placeholder="Group Number (e.g. GRP-0002)" value={newGroup.groupNumber} onChange={e => setNewGroup({ ...newGroup, groupNumber: e.target.value })} />
                  <input style={inputStyle} placeholder="Contact Name" value={newGroup.contactName} onChange={e => setNewGroup({ ...newGroup, contactName: e.target.value })} />
                  <input style={inputStyle} placeholder="Contact Email" value={newGroup.contactEmail} onChange={e => setNewGroup({ ...newGroup, contactEmail: e.target.value })} />
                  <input style={inputStyle} placeholder="Contact Phone" value={newGroup.contactPhone} onChange={e => setNewGroup({ ...newGroup, contactPhone: e.target.value })} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnPrimary} onClick={addGroup}>Create Group</button>
                    <button style={btnSecondary} onClick={() => setShowAddGroup(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <table style={{ width: "100%", background: "#fff", borderRadius: 8, borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr style={{ borderBottom: "2px solid #eee" }}>
                  {["Group #", "Name", "Contact", "Locations", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "#666" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {groups.map(g => (
                    <tr key={g.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{g.groupNumber}</td>
                      <td style={{ padding: "12px 16px" }}>{g.name}</td>
                      <td style={{ padding: "12px 16px", color: "#666" }}>{g.contactName}<br /><span style={{ fontSize: 12 }}>{g.contactEmail}</span></td>
                      <td style={{ padding: "12px 16px" }}>{g.Dealer?.length || 0}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: "#d4edda", color: "#155724", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>ACTIVE</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}
