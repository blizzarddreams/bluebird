<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = ['title', 'data', 'user_id'];

    public function comments()
    {
        return $this->hasMany('Bluebird\Comment');
    }

    public function user()
    {
      return $this->belongsTo('Bluebird\User');
    }

     public function featureUser()
    {
        return $this->belongsTo('Bluebird\User', 'id', 'feature_user_id');
    }

    public function getCleanAttribute()
    {
        return Helpers::updateData($this->data);
    }
}
