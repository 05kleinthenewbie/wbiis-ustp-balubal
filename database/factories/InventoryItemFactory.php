<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    public function definition(): array
    {
        $brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Samsung', 'LG', 'Canon', 'Epson', 'Logitech'];
        $categories = [
            'Desktop' => ['OptiPlex 7090', 'ProDesk 400', 'ThinkCentre M70s', 'VivoPC', 'Veriton M4630G'],
            'Laptop' => ['Latitude 5520', 'ProBook 450 G8', 'ThinkPad E14', 'ZenBook 14', 'TravelMate P2'],
            'Monitor' => ['P2422H', 'EliteDisplay E243', 'ThinkVision E24', 'ProArt PA278QV', 'UltraFine 27UL500'],
            'Printer' => ['LaserJet Pro M404dn', 'OfficeJet Pro 9015', 'imageCLASS MF743Cdw', 'PIXMA G3010', 'EcoTank L3150'],
            'Projector' => ['V150H', 'EliteDisplay LS', 'ThinkVision LT3053p', 'ZenBeam Latte', 'VE280'],
            'Network' => ['PowerConnect 2824', 'Aruba Instant On', 'Ubiquiti UniFi', 'Netgear GS308', 'Cisco SG110'],
            'UPS' => ['Smart-UPS 1500', 'Back-UPS Pro 1500', 'Smart-UPS SMT1500', 'PowerWalker VI', 'CyberPower OR1500'],
        ];

        $category = fake()->randomElement(array_keys($categories));
        $brand = fake()->randomElement($brands);
        $model = fake()->randomElement($categories[$category]);

        $conditions = ['working', 'defective', 'under_repair'];
        $statuses = ['active', 'retired', 'disposed'];
        $locations = [
            'ICT Office - Room 101', 'Computer Lab A - Room 201', 'Computer Lab B - Room 202',
            'AV Room - Room 301', 'Admin Office - Room 102', 'Library - Room 401',
            'Faculty Room - Room 103', 'Conference Room - Room 302', 'Server Room - Room 105',
        ];

        return [
            'property_no' => 'USTP-ICT-'.strtoupper(fake()->bothLetters(2)).'-'.fake()->unique()->numberBetween(1000, 9999),
            'item_name' => $category.' - '.$brand.' '.$model,
            'brand' => $brand,
            'model' => $model,
            'serial_no' => strtoupper(fake()->bothLetters(2)).fake()->numerify('#######'),
            'location' => fake()->randomElement($locations),
            'condition' => fake()->randomElement($conditions),
            'status' => fake()->randomElement($statuses),
            'purchase_date' => fake()->dateTimeBetween('-3 years', 'now'),
        ];
    }
}
