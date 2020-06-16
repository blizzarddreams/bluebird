<?php

namespace Bluebird;

use Laravel\Airlock\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'birthday', 'provider_name', 'provider_id'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function images()
    {
        return $this->hasMany('Bluebird\Image');
    }

    public function profileComments()
    {
        return $this->hasMany("Bluebird\Comment", 'profile_id', 'id');
    }

    public function following()
    {
        return $this->hasManyThrough('Bluebird\User', 'Bluebird\Follow', 'user_id', 'id', 'id', 'following_id');
    }

    public function followers()
    {
        return $this->hasManyThrough('Bluebird\User', 'Bluebird\Follow', 'following_id', 'id', 'id', 'user_id');
    }

    public function favorites()
    {
        return $this->hasManyThrough('Bluebird\Image', 'Bluebird\Favorite', 'user_id', 'user_id', 'id', 'user_id');//, 'id', 'id');//, 'id', 'id');
    }

    public function journals()
    {
        return $this->hasMany('Bluebird\Journal');
    }

    public function comments()
    {
        return $this->hasMany('Bluebird\Comment', 'user_id', 'id');
    }

    public function featureImage()
    {
        return $this->hasOne('Bluebird\Image', 'feature_user_id');//, 'id');
    }

    public function featureJournal()
    {
        return $this->hasOne('Bluebird\Journal', 'feature_user_id', 'id');//, 'id');
    }

    public function socialAccounts()
    {
        return $this->hasMany('Bluebird\SocialAccount');
    }

    public function getAgeAttribute()
    {
        if ($this->attributes['birthday'] !== null)
        {
          return Carbon::parse($this->attributes['birthday'])->age;
        }
        return 0;
    }

    public function getGravatarAttribute()
    {
        return "https://www.gravatar.com/avatar/".md5($this->email);
    }

    public function getCleanAttribute()
    {
        return Helpers::updateData($this->description);
    }


    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'data' => 'array',
    ];
}
