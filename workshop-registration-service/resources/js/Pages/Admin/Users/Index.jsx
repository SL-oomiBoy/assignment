import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function Index({ users, filters, roles }) {
    const authUser = usePage().props.auth.user;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form for creating user
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staff',
    });

    // Form for editing user
    const editForm = useForm({
        name: '',
        email: '',
        role: 'staff',
        password: '',
    });

    const openEditModal = (user) => {
        setUserToEdit(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateModalOpen(false);
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.users.update', userToEdit.id), {
            onSuccess: () => {
                setUserToEdit(null);
                editForm.reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        router.delete(route('admin.users.destroy', userToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setUserToDelete(null);
            },
        });
    };

    const handleFilterChange = (newSearch, newRole) => {
        router.get(
            route('admin.users.index'),
            {
                search: newSearch !== undefined ? newSearch : search,
                role: newRole !== undefined ? newRole : roleFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'manager':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'staff':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Staff & User Management
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Administrator panel to provision staff credentials and configure operational roles.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create User Account
                    </button>
                </div>
            }
        >
            <Head title="Staff & User Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search & Filter Bar */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(e.target.value, roleFilter)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    handleFilterChange(search, e.target.value);
                                }}
                                className="py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => handleFilterChange(search, roleFilter)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
                            >
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-6">Name</th>
                                        <th className="py-3.5 px-6">Email Address</th>
                                        <th className="py-3.5 px-6">Assigned Role</th>
                                        <th className="py-3.5 px-6">Created On</th>
                                        <th className="py-3.5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {user.name}
                                                {user.id === authUser.id && (
                                                    <span className="ms-2 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                        You
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(user)}
                                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>

                                                {user.id !== authUser.id && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setUserToDelete(user)}
                                                        className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                        Create Staff / Manager Account
                    </h3>

                    <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g. Alex Morgan"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {createForm.errors.name && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="alex.morgan@centre.test"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {createForm.errors.email && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Role Assignment <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={createForm.data.role}
                                onChange={(e) => createForm.setData('role', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            >
                                <option value="staff">Staff (Register & Cancel Attendees, View Workshops)</option>
                                <option value="manager">Manager (Create/Edit Workshops, Register Attendees)</option>
                                <option value="admin">Admin (Manage Staff Accounts)</option>
                            </select>
                            {createForm.errors.role && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.role}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {createForm.errors.password && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.password}</p>
                            )}
                        </div>

                        <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm disabled:opacity-50"
                            >
                                {createForm.processing ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={Boolean(userToEdit)} onClose={() => setUserToEdit(null)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                        Edit User: {userToEdit?.name}
                    </h3>

                    <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {editForm.errors.name && (
                                <p className="text-xs text-rose-600 mt-1">{editForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {editForm.errors.email && (
                                <p className="text-xs text-rose-600 mt-1">{editForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Role Assignment <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={editForm.data.role}
                                onChange={(e) => editForm.setData('role', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            >
                                <option value="staff">Staff</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            {editForm.errors.role && (
                                <p className="text-xs text-rose-600 mt-1">{editForm.errors.role}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Reset Password <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
                            </label>
                            <input
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="New password"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                            />
                            {editForm.errors.password && (
                                <p className="text-xs text-rose-600 mt-1">{editForm.errors.password}</p>
                            )}
                        </div>

                        <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setUserToEdit(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editForm.processing}
                                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm disabled:opacity-50"
                            >
                                {editForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Custom Delete Confirmation Modal */}
            <Modal show={Boolean(userToDelete)} onClose={() => setUserToDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900">
                            Delete User Account?
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                            Are you sure you want to delete <span className="font-semibold text-slate-800">{userToDelete?.name}</span> ({userToDelete?.email})? This action cannot be undone.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setUserToDelete(null)}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition shadow-sm disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
