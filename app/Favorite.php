<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['image_id', 'user_id'];

    public function image()
    {
      return $this->belongsTo('Bluebird\Image');
    }

    public function user()
    {
      return $this->belongsTo('Bluebird\User');
    }
}
