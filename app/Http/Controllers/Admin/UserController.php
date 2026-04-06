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

        if ($request->filled('role') && $request->role !== 'All') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('registered_from')) {
            $query->whereDate('created_at', '>=', $request->registered_from);
        }
        if ($request->filled('registered_to')) {
            $query->whereDate('created_at', '<=', $request->registered_to);
        }
        if ($request->filled('user_status') && $request->user_status !== 'All') {
            $query->where('status', $request->user_status);
        }

        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        $sortMap = [
            'name'     => 'name',
            'role'     => 'role',
            'status'   => 'status',
            'joinedAt' => 'created_at',
        ];

        $dbColumn = $sortMap[$sortColumn] ?? 'created_at';
        $query->orderBy($dbColumn, $sortDirection);

        $users = $query
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
            'filters' => $request->only(['role', 'search', 'per_page', 'sort', 'direction', 'registered_from', 'registered_to', 'user_status']),
        ]);
    }

    public function store(Request $request) 
    {
        $currentUser = auth()->user();
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Admin,Organizer,User',
        ];

        // Ensure Admins can only create Users and Organizers. Restrict Root creation.
        if ($currentUser->role === 'Admin' && $request->role === 'Admin') {
            return back()->with('error', 'Only Root users can create new Admins.');
        }

        $request->validate($rules);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Active',
            'email_verified_at' => now(), // Auto verify created users by admin
        ]);

        return back()->with('success', 'User created successfully.');
    }

    public function show(string $id)
    {
        $user = User::findOrFail($id);
        
        // Let's get tickets/events from user transactions if they exist 
        $transactions = \App\Models\Transaction::where('user_id', $user->id)
            ->with(['details.ticketType.event'])
            ->get();
            
        $events = [];
        foreach($transactions as $t) {
            foreach($t->details as $d) {
                if ($d->ticketType && $d->ticketType->event) {
                    $events[] = [
                        'event_name' => $d->ticketType->event->title,
                        'ticket_name' => $d->ticketType->name,
                        'quantity' => $d->quantity,
                        'purchased_at' => $t->created_at->format('M d, Y')
                    ];
                }
            }
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'joinedAt' => $user->created_at ? $user->created_at->format('M d, Y') : '—',
            ],
            'events' => $events
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:Admin,Organizer,User',
        ]);
        
        $currentUser = auth()->user();

        if ($user->id === $currentUser->id && $request->role !== $currentUser->role) {
            return back()->with('error', 'You cannot change your own role.');
        }

        if ($currentUser->role === 'Admin') {
            if ($request->role === 'Admin' || $user->role === 'Admin' || $user->role === 'Root') {
                return back()->with('error', 'Admins can only manage Users and Organizers.');
            }
        }

        if ($user->role === 'Root') {
            return back()->with('error', 'Cannot change the role of the Root account.');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return back()->with('success', 'User details updated successfully.');
    }

    public function updateRole(Request $request, string $id)
    {
        $request->validate([
            'role' => 'required|in:Admin,Organizer,User',
        ]);

        $user = User::findOrFail($id);
        $currentUser = auth()->user();

        if ($user->id === $currentUser->id && $request->role !== $currentUser->role) {
            return back()->with('error', 'You cannot change your own role.');
        }

        if ($currentUser->role === 'Admin') {
            if ($request->role === 'Admin' || $user->role === 'Admin' || $user->role === 'Root') {
                return back()->with('error', 'Admins can only manage roles for Users and Organizers.');
            }
        }
        
        if ($user->role === 'Root') {
             return back()->with('error', 'Cannot change the role of the Root account.');
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', "User role updated to {$request->role}.");
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Active,Suspended,Banned',
        ]);

        $user = User::findOrFail($id);
        
        if ($user->role === 'Root') {
            return back()->with('error', 'Cannot change the status of the Root account.');
        }

        $user->update(['status' => $request->status]);

        return back()->with('success', "User status updated to {$request->status}.");
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'Root') {
            return back()->with('error', 'Cannot delete a Root user.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
