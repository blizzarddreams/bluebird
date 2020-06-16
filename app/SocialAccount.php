<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;
use Bluebird\User;

class SocialAccount extends Model
{
    protected $fillable = ['user_id', 'provider_name', 'provider_id'];


    public function user()
    {
      return $this->belongsTo('Bluebird\User');
    }
}
