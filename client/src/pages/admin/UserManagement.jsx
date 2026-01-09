import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { ToastContext } from "../../context/ToastContext";

const UserManagement = () => {
    const { showToast } = useContext(ToastContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null }); // type: 'DELETE' | 'TERMINATE'

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "TEACHER",
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
            setNewUser({ name: "", email: "", password: "", role: "TEACHER" });
            fetchUsers();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create user", "error");
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
        <Card
            title="User Management"
            action={
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Teacher
                </Button>
            }
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">User</th>
                            <th className="px-6 py-4 text-left font-semibold">Role</th>
                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                            <th className="px-6 py-4 text-left font-semibold">Last Login</th>
                            <th className="px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="py-8 text-center text-gray-500">No users found</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-orange-100 text-orange-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'TERMINATE' })}
                                                className="text-gray-400 hover:text-orange-600 p-1"
                                                title="Terminate Session"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, id: user._id, type: 'DELETE' })}
                                                className="text-gray-400 hover:text-red-600 p-1"
                                                title="Delete User"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add New Teacher"
            >
                <form onSubmit={handleCreateUser} className="space-y-4">
                    {/* Role selection removed - defaults to TEACHER */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                        <input
                            type="text"
                            required
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Teacher Account</Button>
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
                    ? "This will permanently delete the user account and they will no longer be able to log in."
                    : "This will log the user out of all active sessions immediately."}
                confirmText={confirmModal.type === 'DELETE' ? "Delete User" : "Terminate Session"}
                variant={confirmModal.type === 'DELETE' ? "danger" : "secondary"}
            />
        </Card>
    );
};

export default UserManagement;
