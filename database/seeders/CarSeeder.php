<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        $car = Car::create([
            'brand' => 'BMW',
            'model' => 'X5',
            'year' => 2022,
            'price' => 60000,
            'description' => 'Спортивний SUV',
        ]);

        $car->photos()->create(['photo_path' => 'cars/bmw_x5_1.jpg']);
        $car->photos()->create(['photo_path' => 'cars/bmw_x5_2.jpg']);
    }
}
