<?php

namespace Bluebird\Http\Controllers\Auth;

use Bluebird\Http\Controllers\Controller;
use Bluebird\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Socialite;
use Bluebird\User;
use Bluebird\SocialAccount;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/'; //RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function redirectToProvider()
    {
      return Socialite::driver('github')->redirect();
    }

    public function handleProviderCallback()
    {
      $oauthUser = Socialite::drive('github')->user();

      if (User::where('email', '=', $oauthUser->getEmail())->first())
      {
        // account exists
        $user = User::where('email', $oauthUser->getEmail())->first();
        $socialAccount = SocialAccount::create([
          'user_id' => $user->id,
          'provider_id' => $oauthUser->getId(),
          'provider_name' => 'github'
        ])->save();

      }
      else
      {
        $user = User::create([
          'name' => $user->getNickname(),
          'email' => $user->getEmail(),

        ])->save();
        $socialAccount = SocialAccount::create([
          'user_id' => $user->id,
          'provider_id' => $oauthUser->getId(),
          'provider_name' => 'github'
        ])->save();
      }
    }
}
