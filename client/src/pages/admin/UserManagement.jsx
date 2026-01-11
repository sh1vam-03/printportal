import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import AlertModal from "../../components/ui/AlertModal";
import { ToastContext } from "../../context/ToastContext";

const UserManagement = () => {
    const { showToast } = useContext(ToastContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null }); // type: 'DELETE' | 'TERMINATE'
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "" });

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
            showToast("Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post("/users", newUser);
            showToast("User account created successfully", "success");
            setIsCreateModalOpen(false);
            setNewUser({ name: "", email: "", password: "", role: "EMPLOYEE" });
            fetchUsers();
            fetchUsers();
        } catch (err) {
            if (err.response?.status === 403) {
                setIsCreateModalOpen(false); // Close create modal to show alert clearly
                setAlertModal({
                    isOpen: true,
                    title: "Plan Limit Reached",
                    message: err.response.data.message
                });
            } else {
                showToast(err.response?.data?.message || "Failed to create user", "error");
            }
        }
    };

    const handleAction = async () => {
        if (!confirmModal.id) return;

        try {
            if (confirmModal.type === 'DELETE') {
                await api.delete(`/users/${confirmModal.id}`);
                showToast("User deleted successfully", "success");
            } else if (confirmModal.type === 'TERMINATE') {
                await api.put(`/users/${confirmModal.id}/terminate`);
                showToast("User session terminated", "success");
            }
            fetchUsers();
        } catch (err) {
            showToast(`Failed to ${confirmModal.type === 'DELETE' ? 'delete user' : 'terminate session'}`, "error");
        } finally {
            setConfirmModal({ isOpen: false, id: null, type: null });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage system access and employee accounts</p>
                </div>

                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-lg shadow-brand-500/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </Button>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <Card key={user._id} className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 font-bold text-lg shadow-sm border border-white ring-1 ring-gray-100">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${user.role === 'ADMIN'
                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                : user.role === 'EMPLOYEE'
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-400' : user.role === 'EMPLOYEE' ? 'bg-blue-400' : 'bg-orange-400'
                                    }`}></span>
                                {user.role}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-gray-50">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {user.isActive ? 'Active' : 'Disabled'}
                            </span>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500">Last seen</span>
                                <span className="text-xs font-medium text-gray-700">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'TERMINATE' })}
                                className="text-xs py-2 px-4 h-auto"
                            >
                                Terminate
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'DELETE' })}
                                className="text-xs py-2 px-4 h-auto"
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Activity</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 italic">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="group hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 font-bold text-lg shadow-sm border border-white ring-1 ring-gray-100">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{user.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${user.role === 'ADMIN'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : user.role === 'TEACHER'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-400' : user.role === 'EMPLOYEE' ? 'bg-blue-400' : 'bg-orange-400'
                                                    }`}></span>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.isActive
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'TERMINATE' })}
                                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                    title="Terminate Session"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'DELETE' })}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add New User"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreateUser} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Employee Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="john@school.edu"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="PRINTING">Printing Staff</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="shadow-lg shadow-brand-500/20">Create Account</Button>
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleAction}
                title={confirmModal.type === 'DELETE' ? "Delete User?" : "Terminate Session?"}
                message={confirmModal.type === 'DELETE'
                    ? "This will permanently delete the user account and they will no longer be able to log in. This action cannot be undone."
                    : "This will log the user out of all active sessions immediately. They will need to log in again."}
                confirmText={confirmModal.type === 'DELETE' ? "Delete User" : "Terminate Session"}
                variant={confirmModal.type === 'DELETE' ? "danger" : "secondary"}
            />

            {/* Assessment Alert Modal */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
                title={alertModal.title}
                message={alertModal.message}
            />
        </div>
    );
};

export default UserManagement;
