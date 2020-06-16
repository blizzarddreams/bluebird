<?php

namespace Bluebird\Providers;

use Illuminate\Support\ServiceProvider;
use Bluebird\Image;
use Illumiante\Support\Facades\Gate;
use Bluebird\Policies\ImagePolicy;

class AppServiceProvider extends ServiceProvider
{

   /* protected $policies = [
        Image::class => ImagePolicy::class
    ];*/
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //$this->registerPolicies();
    }
}
