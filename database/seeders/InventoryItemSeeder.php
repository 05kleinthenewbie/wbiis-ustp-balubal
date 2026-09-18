<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'property_no' => 'USTP-ICT-DE-0001',
                'item_name' => 'Desktop - Dell OptiPlex 7090',
                'brand' => 'Dell',
                'model' => 'OptiPlex 7090',
                'serial_no' => 'DL8X7K2M',
                'location' => 'ICT Office - Room 101',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-06-15',
            ],
            [
                'property_no' => 'USTP-ICT-HP-0002',
                'item_name' => 'Laptop - HP ProBook 450 G8',
                'brand' => 'HP',
                'model' => 'ProBook 450 G8',
                'serial_no' => 'HP5N9R4T',
                'location' => 'Admin Office - Room 102',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-03-20',
            ],
            [
                'property_no' => 'USTP-ICT-LN-0003',
                'item_name' => 'Laptop - Lenovo ThinkPad E14',
                'brand' => 'Lenovo',
                'model' => 'ThinkPad E14',
                'serial_no' => 'LN3HJ8WQ',
                'location' => 'Faculty Room - Room 103',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-08-10',
            ],
            [
                'property_no' => 'USTP-ICT-DL-0004',
                'item_name' => 'Monitor - Dell P2422H',
                'brand' => 'Dell',
                'model' => 'P2422H',
                'serial_no' => 'DL7TY5VN',
                'location' => 'Computer Lab A - Room 201',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2023-11-05',
            ],
            [
                'property_no' => 'USTP-ICT-HP-0005',
                'item_name' => 'Printer - HP LaserJet Pro M404dn',
                'brand' => 'HP',
                'model' => 'LaserJet Pro M404dn',
                'serial_no' => 'HP2KQ9XJ',
                'location' => 'ICT Office - Room 101',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-01-22',
            ],
            [
                'property_no' => 'USTP-ICT-AC-0006',
                'item_name' => 'Laptop - Acer TravelMate P2',
                'brand' => 'Acer',
                'model' => 'TravelMate P2',
                'serial_no' => 'AC6WM3LP',
                'location' => 'Computer Lab B - Room 202',
                'condition' => 'defective',
                'status' => 'active',
                'purchase_date' => '2023-09-18',
            ],
            [
                'property_no' => 'USTP-ICT-EP-0007',
                'item_name' => 'Printer - Epson EcoTank L3150',
                'brand' => 'Epson',
                'model' => 'EcoTank L3150',
                'serial_no' => 'EP4RJ8BN',
                'location' => 'Library - Room 401',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-05-30',
            ],
            [
                'property_no' => 'USTP-ICT-LG-0008',
                'item_name' => 'Monitor - LG UltraFine 27UL500',
                'brand' => 'LG',
                'model' => 'UltraFine 27UL500',
                'serial_no' => 'LG9PD2KF',
                'location' => 'AV Room - Room 301',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-02-14',
            ],
            [
                'property_no' => 'USTP-ICT-LN-0009',
                'item_name' => 'Desktop - Lenovo ThinkCentre M70s',
                'brand' => 'Lenovo',
                'model' => 'ThinkCentre M70s',
                'serial_no' => 'LN5VG8HT',
                'location' => 'Computer Lab A - Room 201',
                'condition' => 'under_repair',
                'status' => 'active',
                'purchase_date' => '2023-07-25',
            ],
            [
                'property_no' => 'USTP-ICT-CN-0010',
                'item_name' => 'Printer - Canon PIXMA G3010',
                'brand' => 'Canon',
                'model' => 'PIXMA G3010',
                'serial_no' => 'CN3FL6WZ',
                'location' => 'Conference Room - Room 302',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-04-12',
            ],
            [
                'property_no' => 'USTP-ICT-AS-0011',
                'item_name' => 'Laptop - ASUS ZenBook 14',
                'brand' => 'ASUS',
                'model' => 'ZenBook 14',
                'serial_no' => 'AS7MQ4RP',
                'location' => 'ICT Office - Room 101',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-09-01',
            ],
            [
                'property_no' => 'USTP-ICT-HP-0012',
                'item_name' => 'Monitor - HP EliteDisplay E243',
                'brand' => 'HP',
                'model' => 'EliteDisplay E243',
                'serial_no' => 'HP8XN2LT',
                'location' => 'Admin Office - Room 102',
                'condition' => 'working',
                'status' => 'retired',
                'purchase_date' => '2021-06-10',
            ],
            [
                'property_no' => 'USTP-ICT-CA-0013',
                'item_name' => 'Projector - Canon V150H',
                'brand' => 'Canon',
                'model' => 'V150H',
                'serial_no' => 'CN4KJ7BG',
                'location' => 'AV Room - Room 301',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2024-01-08',
            ],
            [
                'property_no' => 'USTP-ICT-NW-0014',
                'item_name' => 'Network - Netgear GS308 Switch',
                'brand' => 'Netgear',
                'model' => 'GS308',
                'serial_no' => 'NG2TW9CV',
                'location' => 'Server Room - Room 105',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2023-12-01',
            ],
            [
                'property_no' => 'USTP-ICT-UP-0015',
                'item_name' => 'UPS - APC Smart-UPS 1500',
                'brand' => 'APC',
                'model' => 'Smart-UPS 1500',
                'serial_no' => 'AP6HN3XQ',
                'location' => 'Server Room - Room 105',
                'condition' => 'working',
                'status' => 'active',
                'purchase_date' => '2023-08-20',
            ],
        ];

        $endUsers = ['Prof. Maria Santos', 'Engr. John Dela Cruz', 'Ms. Ana Reyes', 'Mr. Carlo Bautista', 'Dr. Letty Ramos'];
        $departments = ['College of Engineering', 'College of Education', 'Administration', 'Library', 'Information Technology Services'];

        foreach ($items as $index => $item) {
            $category = ucfirst(strtolower((string) explode(' - ', $item['item_name'])[0]));
            $locationParts = explode(' - ', $item['location'] ?? '');

            $item['category'] = $category;
            $item['campus'] = 'Balubal Campus';
            $item['building'] = $locationParts[0] ?? null;
            $item['room'] = count($locationParts) > 1 ? $locationParts[1] : null;
            $item['end_user'] = $endUsers[$index % count($endUsers)];
            $item['department'] = $departments[$index % count($departments)];
            $item['unit_cost'] = 15000 + ($index * 4375.5);
            $item['purchase_order_no'] = 'USTP - Main/F/C/New/PO '.str_pad((string) (1000 + $index), 4, '0', STR_PAD_LEFT);
            $item['validation'] = 'Validated';
            $item['inspection_date'] = $item['purchase_date'];
            $item['inspection_remarks'] = 'Inspected and verified by the Property Custodian.';

            InventoryItem::updateOrCreate(
                ['property_no' => $item['property_no']],
                $item,
            );
        }
    }
}
