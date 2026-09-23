<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Booking;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends ApiController
{
    /**
     * List bookings.
     */
    public function index(): JsonResponse
    {
        $query = Booking::with(['user', 'facility', 'approver'])->latest();

        if (! $this->isAdmin()) {
            $query->where('user_id', $this->user()->id);
        }

        return response()->json([
            'data' => $query->get(),
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    /**
     * List facilities available for booking.
     */
    public function facilities(): JsonResponse
    {
        return response()->json([
            'data' => Facility::where('availability_status', 'available')->get(),
        ]);
    }

    /**
     * Create a new facility booking.
     */
    public function store(Request $request): JsonResponse
    {
        if ($this->roleName() === 'ict_admin') {
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
            abort(422, 'This time slot overlaps with an existing booking.');
        }

        $booking = Booking::create([
            ...$validated,
            'user_id' => $this->user()->id,
            'booking_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking request submitted successfully.',
            'booking' => $booking->load(['user', 'facility', 'approver']),
        ], 201);
    }

    /**
     * Show a single booking.
     */
    public function show(string $id): JsonResponse
    {
        $booking = Booking::with(['user', 'facility', 'approver'])->findOrFail($id);

        if (! $this->isAdmin() && $booking->user_id !== $this->user()->id) {
            abort(403, 'You can only view your own bookings.');
        }

        return response()->json(['booking' => $booking]);
    }

    /**
     * Update a booking (admin approval).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'booking_status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            ...$validated,
            'approved_by' => $this->user()->id,
        ]);

        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking->load(['user', 'facility', 'approver']),
        ]);
    }
}
