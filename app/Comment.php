<?php

namespace Bluebird;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'image_id', 'journal_id', 'profile_id','data'];

    public function user()
    {
        return $this->belongsTo('Bluebird\User');
    }

    public function image()
    {
      return $this->belongsTo('Bluebird\Image');
    }

    public function journal()
    {
      return $this->belongsTo('Bluebird\Journal');
    }

    public function profile()
    {
      return $this->belongsTo('Bluebird\User', 'profile_id');
    }

    public function getCleanAttribute()
    {
        return Helpers::updateData($this->data);
    }
}
