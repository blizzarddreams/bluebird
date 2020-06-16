<?php

namespace Bluebird;

use Illuminate\Database\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;

class ImageTag extends Model
{
    //protected $table = 'image_tag';
    protected $fillable = ['image_id', 'user_id'];
}
