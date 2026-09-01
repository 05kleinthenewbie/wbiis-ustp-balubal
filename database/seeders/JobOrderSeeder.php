<?php

namespace Database\Seeders;

use App\Models\JobOrder;
use Illuminate\Database\Seeder;

class JobOrderSeeder extends Seeder
{
    public function run(): void
    {
        $jobOrders = [
            [
                'request_id' => 5,
                'assigned_to' => 2,
                'status' => 'completed',
                'report' => 'Checked the Ethernet port and cable. Found a damaged cable pin. Replaced the Cat6 cable and tested connection for 30 minutes with no drops.',
                'resolution' => 'Cable replaced, connection stable.',
                'final_remarks' => 'task_completed',
                'action_taken' => 'Cable replacement and port testing',
                'date_assigned' => '2026-08-25 10:00:00',
                'date_completed' => '2026-08-25 14:30:00',
                'rating' => 5,
                'requester_comment' => 'Very fast response. Network has been stable since the fix. Thank you!',
                'responses' => [
                    [
                        'technician_id' => 2,
                        'response_report' => 'Inspected the workstation in Room 102. The Ethernet cable had a damaged RJ45 connector pin. Replaced with a new Cat6 cable.',
                        'date_responded' => '2026-08-25 11:00:00',
                    ],
                    [
                        'technician_id' => 2,
                        'response_report' => 'Cable replaced. Ran a 30-minute continuous ping test to gateway — 0% packet loss. Connection is stable.',
                        'date_responded' => '2026-08-25 14:00:00',
                    ],
                ],
            ],
            [
                'request_id' => 7,
                'assigned_to' => 1,
                'status' => 'closed',
                'report' => 'Opened the printer and found a small paper fragment stuck deep in the roller assembly. Removed the fragment and cleared the error. Ran test prints successfully.',
                'resolution' => 'Paper fragment removed, printer operational.',
                'final_remarks' => 'task_completed',
                'action_taken' => 'Deep cleaning of roller assembly',
                'date_assigned' => '2026-08-20 08:30:00',
                'date_completed' => '2026-08-20 10:15:00',
                'rating' => 4,
                'requester_comment' => 'Printer is working again. Would be nice if the lab staff could do basic paper jam checks first.',
                'responses' => [
                    [
                        'technician_id' => 1,
                        'response_report' => 'Arrived at Lab B. The printer display showed error 13.20.00 (paper jam). Opened the rear access panel and found a torn piece of paper wrapped around the fuser roller.',
                        'date_responded' => '2026-08-20 09:00:00',
                    ],
                    [
                        'technician_id' => 1,
                        'response_report' => 'Removed the paper fragment. Cleaned the roller assembly. Ran 5 test pages — all printed successfully. Error cleared.',
                        'date_responded' => '2026-08-20 10:00:00',
                    ],
                ],
            ],
            [
                'request_id' => 8,
                'assigned_to' => 2,
                'status' => 'in_progress',
                'report' => null,
                'resolution' => null,
                'final_remarks' => null,
                'action_taken' => 'Site inspection completed',
                'date_assigned' => '2026-08-29 11:00:00',
                'date_completed' => null,
                'rating' => null,
                'requester_comment' => null,
                'responses' => [
                    [
                        'technician_id' => 2,
                        'response_report' => 'Visited Room 305 for site inspection. The room has existing conduit runs from the ceiling. Will need to run 4 Cat6 cables from the IDF switch in Room 105. Estimated materials: 4x Cat6 cables (30m each), 1x 8-port switch, 4x wall plates.',
                        'date_responded' => '2026-08-29 14:00:00',
                    ],
                ],
            ],
        ];

        foreach ($jobOrders as $data) {
            $responses = $data['responses'] ?? [];
            unset($data['responses']);

            $jobOrder = JobOrder::create($data);

            foreach ($responses as $response) {
                $jobOrder->technicianResponses()->create($response);
            }
        }
    }
}
