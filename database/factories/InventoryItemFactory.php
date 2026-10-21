<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    public function definition(): array
    {
        $brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Samsung', 'LG', 'Canon', 'Epson', 'Logitech', 'Netgear', 'Cisco', 'APC'];
        $types = [
            'Desktop' => ['OptiPlex 7090', 'ProDesk 400', 'ThinkCentre M70s', 'VivoPC', 'Veriton M4630G'],
            'Laptop' => ['Latitude 5520', 'ProBook 450 G8', 'ThinkPad E14', 'ZenBook 14', 'TravelMate P2'],
            'Printer' => ['LaserJet Pro M404dn', 'OfficeJet Pro 9015', 'imageCLASS MF743Cdw', 'PIXMA G3010', 'EcoTank L3150'],
            'Server' => ['PowerEdge T150', 'ProLiant ML110 Gen10', 'ThinkSystem ST250'],
            'Projector' => ['V150H', 'EliteDisplay LS', 'ZenBeam Latte', 'VE280'],
            'Router' => ['Aruba Instant On 14', 'Ubiquiti UniFi Dream Machine', 'Cisco RV340'],
            'Switch' => ['PowerConnect 2824', 'Netgear GS308', 'Aruba 1930-24G'],
            'Access Point' => ['UniFi U6 Lite', 'Aruba AP-11', 'Deco X20'],
            'Monitor' => ['P2422H', 'EliteDisplay E243', 'ThinkVision E24', 'ProArt PA278QV', 'UltraFine 27UL500'],
            'UPS' => ['Smart-UPS 1500', 'Back-UPS Pro 1500', 'Smart-UPS SMT1500', 'PowerWalker VI', 'CyberPower OR1500'],
            'Keyboard' => ['K120', 'MK270 Wireless', 'Elite Keyboard'],
            'Mouse' => ['M170 Wireless', 'Pro Mouse B100', 'G102 Lightsync'],
        ];
        $typeCategories = [
            'Desktop' => 'Hardware',
            'Laptop' => 'Hardware',
            'Printer' => 'Hardware',
            'Server' => 'Hardware',
            'Projector' => 'Hardware',
            'Router' => 'Network Equipment',
            'Switch' => 'Network Equipment',
            'Access Point' => 'Network Equipment',
            'Monitor' => 'ICT Peripherals',
            'UPS' => 'ICT Peripherals',
            'Keyboard' => 'ICT Peripherals',
            'Mouse' => 'ICT Peripherals',
        ];

        $type = fake()->randomElement(array_keys($types));
        $category = $typeCategories[$type];
        $brand = fake()->randomElement($brands);
        $model = fake()->randomElement($types[$type]);

        $conditions = ['working', 'defective', 'under_repair'];
        $statuses = ['active', 'retired', 'disposed'];
        $campuses = ['Balubal Campus', 'Main Campus'];
        $buildings = ['Academic Building', 'Administration Building', 'Library', 'DT Building'];
        $rooms = ['Room 101', 'Room 201', 'Computer Laboratory A', 'Computer Laboratory B'];
        $locations = [
            'ICT Office - Room 101', 'Computer Lab A - Room 201', 'Computer Lab B - Room 202',
            'AV Room - Room 301', 'Admin Office - Room 102', 'Library - Room 401',
            'Faculty Room - Room 103', 'Conference Room - Room 302', 'Server Room - Room 105',
        ];

        return [
            'property_no' => fake()->unique()->numerify('####-##-##-######-###'),
            'item_inventory_no' => fake()->optional(0.6)->numerify('INV-####'),
            'item_name' => "{$type} - {$brand} {$model}",
            'category' => $category,
            'brand' => $brand,
            'model' => $model,
            'serial_no' => strtoupper(fake()->lexify('??')).fake()->numerify('#######'),
            'specification' => implode(', ', [fake()->words(4, true), fake()->words(4, true)]),
            'description' => fake()->optional(0.7)->sentence(8),
            'location' => fake()->randomElement($locations),
            'purchase_date' => fake()->dateTimeBetween('-3 years', 'now'),
            'expiration_date' => fake()->optional(0.3)->dateTimeBetween('-1 year', '+2 years'),
            'unit_cost' => fake()->optional(0.8)->randomFloat(2, 5000, 150000),
            'purchase_order_no' => fake()->optional(0.8)->bothify('USTP - ##/C/???/PO ##-####'),
            'end_user' => fake()->optional(0.8)->name(),
            'department' => fake()->optional(0.7)->randomElement(['College of Engineering', 'College of Education', 'Administration', 'Library', 'Information Technology Services']),
            'campus' => fake()->randomElement($campuses),
            'building' => fake()->optional(0.8)->randomElement($buildings),
            'room' => fake()->optional(0.7)->randomElement($rooms),
            'specific_location' => fake()->optional(0.5)->randomElement(['Near the entrance', 'Back corner', 'Window side', 'Above the cabinet']),
            'condition' => fake()->randomElement($conditions),
            'status' => fake()->randomElement($statuses),
            'validation' => fake()->optional(0.7)->randomElement(['Validated', 'For Inspection', 'Pending']),
            'inspection_date' => fake()->optional(0.6)->dateTimeBetween('-1 year', 'now'),
            'inspection_remarks' => fake()->optional(0.5)->sentence(8),
        ];
    }
}
