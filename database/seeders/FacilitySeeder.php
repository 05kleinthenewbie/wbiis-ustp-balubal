<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    
    public function run(): void
    {
        $facilities = [
            [
                'facility_name' => 'Computer Laboratory',
                'facility_type' => 'computer_lab',
                'capacity' => 40,
                'location' => 'ICT Building',
                'availability_status' => 'available',
            ],
            [
                'facility_name' => 'AV Room',
                'facility_type' => 'av_room',
                'capacity' => 60,
                'location' => 'Main Building',
                'availability_status' => 'available',
            ],
        ];

        foreach ($facilities as $facility) {
            \App\Models\Facility::firstOrCreate(
                ['facility_name' => $facility['facility_name']],
                $facility
            );
        }
    }
}
