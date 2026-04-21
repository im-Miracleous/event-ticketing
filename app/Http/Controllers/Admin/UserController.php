<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'users'    => $users,
            'filters'  => $request->only(['role', 'search', 'per_page', 'sort', 'direction', 'registered_from', 'registered_to', 'user_status']),
            'authUser' => [
                'id'   => auth()->id(),
                'role' => auth()->user()->role,
            ],
        ]);
    }

    public function store(Request $request) 
    {
        $currentUser = auth()->user();
        
        $rules = [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
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
            'username' => $request->username,
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
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
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
            'username' => $request->username,
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
            'reason' => 'nullable|string|max:500',
        ]);

        $user = User::findOrFail($id);
        $currentUser = auth()->user();

        // Cannot change Root status
        if ($user->role === 'Root') {
            return back()->with('error', 'Cannot change the status of the Root account.');
        }

        // Admins cannot suspend/ban themselves
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'You cannot change your own account status.');
        }

        // Only Root can suspend/ban Admins
        if ($user->role === 'Admin' && $currentUser->role !== 'Root') {
            return back()->with('error', 'Only Root accounts can suspend or ban Admin users.');
        }

        // ── Ban: detach user from transactions & restore ticket stock ──
        if ($request->status === 'Banned' && $user->status !== 'Banned') {
            DB::transaction(function () use ($user) {
                $this->detachAndRestoreStock($user);
            });
        }

        $user->update([
            'status'        => $request->status,
            'status_reason' => $request->status === 'Active' ? null : $request->reason,
        ]);

        return back()->with('success', "User status updated to {$request->status}.");
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $currentUser = auth()->user();

        if ($user->role === 'Root') {
            return back()->with('error', 'Cannot delete a Root user.');
        }

        // Admins cannot delete themselves
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Only Root can delete Admins
        if ($user->role === 'Admin' && $currentUser->role !== 'Root') {
            return back()->with('error', 'Only Root accounts can delete Admin users.');
        }

        DB::transaction(function () use ($user) {
            $this->detachAndRestoreStock($user);
            $user->delete();
        });

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    // ─── Helper: Detach transactions & restore stock ─────────────────
    
    /**
     * For all Pending/Success transactions belonging to the user:
     *  1. Restore available_stock on each TicketType
     *  2. Set user_id = null so the user loses access but records are preserved
     */
    private function detachAndRestoreStock(User $user): void
    {
        $transactions = Transaction::with('details.ticketType')
            ->where('user_id', $user->id)
            ->whereIn('transaction_status', ['Pending', 'Success'])
            ->lockForUpdate()
            ->get();

        foreach ($transactions as $transaction) {
            foreach ($transaction->details as $detail) {
                if ($detail->ticketType) {
                    $detail->ticketType->increment('available_stock', $detail->quantity);
                }
            }

            // Detach user — transaction/ticket status stays as-is
            $transaction->update(['user_id' => null]);
        }
    }
}
