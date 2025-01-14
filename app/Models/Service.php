<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'cost',
        'duration',
        'image', // Add image to fillable properties
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

      public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
