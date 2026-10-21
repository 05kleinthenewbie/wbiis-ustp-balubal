<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Booking;
use App\Models\Facility;
use App\Rules\NotSunday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends ApiController
{
    /**
     * List bookings.
     */
    public function index(): JsonResponse
    {
        $this->ensureNotStudent();

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
        $this->ensureNotStudent();

        return response()->json([
            'data' => Facility::where('availability_status', 'available')->get(),
        ]);
    }

    /**
     * Create a new facility booking.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureNotStudent();

        $validated = $request->validate([
            'facility_id' => ['required', 'exists:facilities,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today', new NotSunday],
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
        $this->ensureNotStudent();

        $booking = Booking::with(['user', 'facility', 'approver'])->findOrFail($id);

        if (! $this->isAdmin() && $booking->user_id !== $this->user()->id) {
            abort(403, 'You can only view your own bookings.');
        }

        return response()->json(['booking' => $booking]);
    }

    /**
     * Update a booking (admin approval or owner cancellation).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureNotStudent();

        $validated = $request->validate([
            'booking_status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ]);

        $booking = Booking::findOrFail($id);

        if (! $this->isAdmin()) {
            $isOwner = $booking->user_id === $this->user()->id;
            $isCancellation = $validated['booking_status'] === 'cancelled';
            $isCancellable = in_array($booking->booking_status, ['pending', 'approved'], true);

            if (! $isOwner || ! $isCancellation || ! $isCancellable) {
                abort(403, 'Only ICT Admins can approve or reject bookings.');
            }
        }

        $booking->update([
            ...$validated,
            'approved_by' => $this->isAdmin() ? $this->user()->id : $booking->approved_by,
        ]);

        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking->load(['user', 'facility', 'approver']),
        ]);
    }

    /**
     * Students do not have access to facility booking.
     */
    private function ensureNotStudent(): void
    {
        if ($this->roleName() === 'student') {
            abort(403, 'Students do not have access to facility booking.');
        }
    }
}
