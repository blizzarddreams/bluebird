<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Bluebird\Http\Requests\RegisterRequest;
use Bluebird\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:web', ['except' => ['login', 'logout']]);
    }

    /**
     * Authenticate and login the user.
     *
     * @return \Illuminate\Http\Response
     */

    public function login()
    {
        $credentials = request(['email', 'password']);
        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['invalid credentials.']
                ]], 401);
        }
        $user = Auth::user();
        Cookie::queue('token', $token, 200000000000000);
        return $this->respondWithToken($token);
    }

    /**
     * Logout the user.
     *
     * @return \Illuminate\Http\Response
     */

    public function logout()
    {
        auth()->logout();
        return response()->json(['success' => true]);
    }

    /**
     * Register the user.
     *
     * @param Bluebird\Http\Requests\RegisterRequest $request
     */
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();
        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'birthday' => $request['birthday'],
            'password' => Hash::make($request['password'])
        ]);
        $user->save();
        //Auth::login($user);
    }

    /**
     * Return JWT token and user details.
     *
     * @return \Illuminate\Http\Response
     */

    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'email' => Auth::user()->email,
            'name' => Auth::user()->name,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL(),
        ]);
    }
}
