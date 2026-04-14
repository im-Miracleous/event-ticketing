<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get the authenticated user's notifications.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->paginate(10);
        $unreadCount = $request->user()->unreadNotifications()->count();

        // If it's an AJAX request (e.g. from the dropdown), return JSON
        if ($request->wantsJson()) {
            return response()->json([
                'notifications' => $notifications,
                'unreadCount' => $unreadCount,
            ]);
        }

        // If we want a dedicated notifications page later
        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read.',
            'unreadCount' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.',
            'unreadCount' => 0,
        ]);
    }
}
