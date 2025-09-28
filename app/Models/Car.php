<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = ['brand', 'model', 'year', 'price', 'description'];

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}
