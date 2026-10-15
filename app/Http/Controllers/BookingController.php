<?php

namespace App\Http\Controllers;

use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = Booking::with(['user', 'facility', 'approver'])->latest();

        // Faculty/Staff only see their own bookings. Admins see everyone's.
        if ($user->role->role_name !== 'ict_admin') {
            $query->where('user_id', $user->id);
        }

        $bookings = $query->get();

        $statsQuery = Booking::query();
        if ($user->role->role_name !== 'ict_admin') {
            $statsQuery->where('user_id', $user->id);
        }

        $stats = [
            'total' => $statsQuery->count(),
            'pending' => (clone $statsQuery)->where('booking_status', 'pending')->count(),
            'approved' => (clone $statsQuery)->where('booking_status', 'approved')->count(),
            'rejected' => (clone $statsQuery)->where('booking_status', 'rejected')->count(),
        ];

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'isAdmin' => $user->role->role_name === 'ict_admin',
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->role->role_name === 'ict_admin') {
            abort(403, 'Only Faculty/Staff can book facilities.');
        }

        return Inertia::render('bookings/create', [
            'facilities' => Facility::where('availability_status', 'available')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role->role_name === 'ict_admin') {
            abort(403, 'Only Faculty/Staff can book facilities.');
        }

        $validated = $request->validate([
            'facility_id' => ['required', 'exists:facilities,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required'],
            'end_time' => ['required', 'after:start_time'],
            'purpose' => ['nullable', 'string'],
        ]);

        $overlap = Booking::where('facility_id', $validated['facility_id'])
            ->where('booking_date', $validated['booking_date'])
            ->whereIn('booking_status', ['pending', 'approved'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($overlap) {
            return back()->withErrors(['start_time' => 'This time slot overlaps with an existing booking.']);
        }

        Booking::create([
            ...$validated,
            'user_id' => Auth::id(),
            'booking_status' => 'pending',
        ]);

        return redirect()->route('bookings.index')
            ->with('status', 'Booking request submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::with(['user', 'facility', 'approver'])->findOrFail($id);

        return Inertia::render('bookings/show', [
            'booking' => $booking,
            'isAdmin' => Auth::user()->role->role_name === 'ict_admin',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $isAdmin = $user->role->role_name === 'ict_admin';

        $validated = $request->validate([
            'booking_status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ]);

        $booking = Booking::with(['user', 'facility'])->findOrFail($id);

        // Admins decide on any booking; owners may only cancel their own pending booking.
        if ($isAdmin) {
            //
        } elseif ($validated['booking_status'] !== 'cancelled'
            || $booking->user_id !== $user->id
            || $booking->booking_status !== 'pending') {
            abort(403, 'Only ICT Admins can approve or reject bookings.');
        }

        $oldStatus = $booking->booking_status;

        $booking->update([
            ...$validated,
            'approved_by' => $isAdmin ? Auth::id() : $booking->approved_by,
        ]);

        if ($oldStatus !== $booking->booking_status
            && in_array($booking->booking_status, ['approved', 'rejected'], true)) {
            $facilityName = $booking->facility?->facility_name ?? 'a facility';
            $bookingSummary = $booking->booking_date->format('M d, Y')
                .' · '.substr($booking->start_time, 0, 5).'-'.substr($booking->end_time, 0, 5);

            Notification::create([
                'user_id' => $booking->user_id,
                'message' => 'Your booking for '.$facilityName.' on '.$booking->booking_date->format('M d, Y').' has been '.$booking->booking_status.'.',
                'notification_type' => 'booking',
                'notification_status' => 'unread',
            ]);

            Mail::to($booking->user->email)->queue(
                new BookingStatusUpdated(
                    $booking->user->name,
                    $facilityName,
                    $bookingSummary,
                    $booking->booking_status,
                    $booking->id,
                )
            );
        }

        return redirect()->back()->with('status', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
