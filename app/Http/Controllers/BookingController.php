<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('bookings/index', [
            'bookings' => $query->get(),
            'isAdmin' => $user->role->role_name === 'ict_admin',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        if (in_array($user->role->role_name, ['ict_admin', 'student'])) {
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

        if (in_array($user->role->role_name, ['ict_admin', 'student'])) {
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

        if ($user->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can approve or reject bookings.');
        }

        $validated = $request->validate([
            'booking_status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            ...$validated,
            'approved_by' => Auth::id(),
        ]);

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
