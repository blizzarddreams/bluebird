<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = ['user_id', 'following_id'];

    public function follower()
    {
        return $this->belongsTo('Bluebird\User', 'user_id');
    }

    public function followed()
    {
        return $this->belongsTo('Bluebird\User', 'following_id');
    }
}
