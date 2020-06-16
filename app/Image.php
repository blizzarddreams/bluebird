<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;


class Image extends Model
{
    use Notifiable;

    protected $fillable = ['user_id', 'image_url', 'thumbnail_url'];


    public function tags()
    {
        return $this->belongsToMany('Bluebird\Tag', 'image_tag');//->using('Bluebird\ImageTag', 'pivot_image_id');
    }

    public function featureUser()
    {
        return $this->belongsTo('Bluebird\User', 'id', 'feature_user_id');
    }

    public function user()
    {
        return $this->belongsTo('Bluebird\User');
    }

    public function favorites()
    {
        return $this->hasMany('Bluebird\Favorite');
    }

    public function comments()
    {
        return $this->hasMany('Bluebird\Comment');
    }

    public function getCleanAttribute()
    {
        return Helpers::updateData($this->description);
    }
}
