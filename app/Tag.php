<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name'];

    public function images()
    {
        return $this->belongsToMany('Bluebird\Image', 'image_tag');//->using('Bluebird\ImageTag', 'pivot_tag_id');
    }
}
