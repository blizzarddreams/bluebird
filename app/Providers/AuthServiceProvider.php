<?php

namespace Bluebird\Providers;

use Laravel\Passport\Passport;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Contracts\Auth\Access\Gate;
// use Illuminate\Support\Facades\Gate as GateProvider;

use Bluebird\Image;
//use Bluebird\Policies\ImagePolicy;
// use Bluebird\Policies\ImagePolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'Bluebird\Model' => 'Bluebird\Policies\ModelPolicy',
      // Image::class => ImagePolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot(Gate $gate)
    {
        $this->registerPolicies($gate);

        $gate->define('update-comment', function($user, $comment) {
          return $user->id === $comment->user->id;
        });

        Passport::routes();
    }

}
