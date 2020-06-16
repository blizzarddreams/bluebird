<?php

namespace Bluebird\Http\Controllers;
use Bluebird\Image;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    /**
     * Show the welcome page
     *
     * @return Illuminate\Http\Response
     */
    public function welcome()
    {
        $images = [];
        if (Auth::check())
        {
            $user = Auth::user();
            if ($user->age < 18)
            {
                $images = Image::where('nsfw', False)->orderByDesc('created_at')->get();
            }
            else
            {
                $images = Image::all()->sortByDesc('created_at');
            }
            return view("home", ["images" => $images]);
        }
        /*else
        {
            $images = Image::where('nsfw', False)->orderByDesc('created_at')->get();
        }*/
        return view('welcome', ['images' => $images]);
    }
}
