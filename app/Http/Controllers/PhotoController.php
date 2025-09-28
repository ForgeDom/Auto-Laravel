<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function destroy($id)
    {
        $photo = Photo::findOrFail($id);

        // Видаляємо файл
        if (Storage::disk('public')->exists($photo->photo_path)) {
            Storage::disk('public')->delete($photo->photo_path);
        }

        // Видаляємо запис у БД
        $photo->delete();

        return response()->json(['message' => 'Фото видалено'], 200);
    }
}
