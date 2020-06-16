<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Bluebird\User;
use Bluebird\Notifications\NewFollow;

use Bluebird\Follow;

class FollowingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $userThatWillBeFollowed = User::find($request->id);
        $follow = Follow::where(['user_id' => $user->id, 'following_id' => $userThatWillBeFollowed->id]);
        if ($follow->exists()) {
            $follow->delete();
            return response()->json(["success" => true, "following" => false]);
        } else {
            $follow = Follow::create([
                'user_id' => $user->id,
                'following_id' => $request->id,
            ]);
            $follow->save();
            $userThatWillBeFollowed->notify(new NewFollow($follow));
            return response()->json(["success" => true, "following" => true]);
        }
        // the user the "$user" is following
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
