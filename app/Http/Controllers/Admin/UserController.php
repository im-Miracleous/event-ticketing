<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * List all users with optional role and search filters.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Role filter
        if ($request->filled('role') && $request->role !== 'All') {
            $query->where('role', $request->role);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 10))
            ->through(fn($u) => [
                'id'       => $u->id,
                'name'     => $u->name,
                'email'    => $u->email,
                'role'     => $u->role ?? 'User',
                'status'   => $u->status ?? 'Active',
                'joinedAt' => $u->created_at ? $u->created_at->format('M d, Y') : '—',
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['role', 'search', 'per_page']),
        ]);
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, string $id)
    {
        $request->validate([
            'role' => 'required|in:Root,Admin,Organizer,User',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return back()->with('success', "User role updated to {$request->role}.");
    }

    /**
     * Update user status (suspend / reactivate / ban).
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Active,Suspended,Banned',
        ]);

        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);

        return back()->with('success', "User status updated to {$request->status}.");
    }

    /**
     * Delete a user.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting Root users
        if ($user->role === 'Root') {
            return back()->withErrors(['delete' => 'Cannot delete a Root user.']);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
