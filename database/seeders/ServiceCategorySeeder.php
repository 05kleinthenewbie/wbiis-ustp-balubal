<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'category_name' => 'Network Services',
                'description' => 'Network, internet, printer, and phone connection requests.',
            ],
            [
                'category_name' => 'Hardware Services',
                'description' => 'Computer, laptop, printer, scanner, and mobile device requests.',
            ],
            [
                'category_name' => 'Software Services',
                'description' => 'Operating system, office suites, anti-virus, and driver requests.',
            ],
            [
                'category_name' => 'Information System Services',
                'description' => 'Email account creation and other information system requests.',
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\ServiceCategory::firstOrCreate(
                ['category_name' => $category['category_name']],
                $category
            );
        }
    }
}
