<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    /**
     * Повертає список всіх авто з фото (відносні шляхи)
     */
    public function index()
    {
        $cars = Car::with('photos')->get();
        return response()->json($cars);
    }

    /**
     * Показує конкретне авто з фото (відносні шляхи)
     */
    public function show($id)
    {
        try {
            $car = Car::with('photos')->findOrFail($id);
            return response()->json($car);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }   

    /**
     * Додає нове авто
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'photos.*' => 'image|max:4096', // максимум 2 МБ
        ]);

        $car = Car::create($validated);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('cars', 'public');
                $car->photos()->create(['photo_path' => $path]);
            }
        }

        $car->load('photos');

        return response()->json($car, 201);
    }

    /**
     * Оновлює авто
     */
    public function update(Request $request, $id)
    {
    $car = Car::findOrFail($id);

    $validated = $request->validate([
        'brand' => 'required|string',
        'model' => 'required|string',
        'year' => 'required|integer',
        'price' => 'nullable|numeric',
        'description' => 'nullable|string',
        'photos.*' => 'image|max:4096',
        'removed_photos' => 'nullable', // приймаємо масив або одне значення
    ]);

    // дані авто без removed_photos
    $data = $validated;
    unset($data['removed_photos']);
    $car->update($data);

    // видалення фото
    $removed = $request->input('removed_photos', []);
    if (!is_array($removed)) {
        $removed = [$removed];
    }

    foreach ($removed as $photoId) {
        $photo = $car->photos()->find($photoId);
        if ($photo) {
            Storage::disk('public')->delete($photo->photo_path);
            $photo->delete();
        }
    }

    // додавання нових фото
    if ($request->hasFile('photos')) {
        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('cars', 'public');
            $car->photos()->create(['photo_path' => $path]);
        }
    }

    $car->load('photos');

    return response()->json($car);
}



    /**
     * Видаляє авто разом з його фото
     */
    public function destroy($id)
    {
        $car = Car::with('photos')->findOrFail($id);

        foreach ($car->photos as $photo) {
            if (Storage::disk('public')->exists($photo->photo_path)) {
                Storage::disk('public')->delete($photo->photo_path);
            }
        }

        $car->photos()->delete();
        $car->delete();

        return response()->json(['message' => 'Автомобіль видалений'], 200);
    }
}
