<?php

namespace Bluebird\Http\Controllers\Auth;

use Bluebird\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Socialite;
use Illuminate\Support\Facades\Auth;
use Bluebird\User;
use Bluebird\SocialAccount;

class OAuthController extends Controller
{
    public function createUser($provider, $oauthUser, $user)
    {
        if ($user) {
            // account exists
            SocialAccount::create([
            'user_id' => $user->id,
            'provider_id' => $oauthUser->getId(),
            'provider_name' => $provider
            ]);
        } else {
            $user = User::create([
            'name' => $provider === 'google' ? $oauthUser->getName() : $oauthUser->getNickname() ,
            'email' => $oauthUser->getEmail(),
            ]);
            SocialAccount::create([
            'user_id' => $user->id,
            'provider_id' => $oauthUser->getId(),
            'provider_name' => $provider
            ]);
        }
        return $user;
    }

    public function redirectToProviderGithub()
    {
        return Socialite::driver('github')->redirect();
    }

    public function handleProviderCallbackGithub()
    {
        $oauthUser = Socialite::driver('github')->stateless()->user();
        $user = $this->createUser("github", $oauthUser, User::where('email', $oauthUser->getEmail())->first());
        Auth::login($user);
        return redirect()->route('profile', $user->name);
    }

    public function redirectToProviderGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleProviderCallbackGoogle()
    {
        $oauthUser = Socialite::driver('google')->stateless()->user();
        $user = $this->createUser("google", $oauthUser, User::where('email', $oauthUser->getEmail())->first());
        Auth::login($user);
        return redirect()->route('profile', $user->name);
    }
}
