<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Support\Facades\Notification;
use Bluebird\Notifications\NewFollow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Bluebird\Http\Requests\UserRequest;
use Bluebird\Http\Requests\PasswordRequest;
use Bluebird\User;
use Bluebird\Image;
use Bluebird\Helpers;
use Bluebird\Journal;
use Bluebird\Comment;
use Bluebird\Follow;
use Bluebird\Favorite;

class UserController extends Controller
{


    public function __construct()
    {
        $this->middleware('auth', ['only' => ['token', 'follow', 'settings', 'update']]);
    }
    /**
     * Generate a new API token for the user
    *
    * @return \Illuminate\Http\Response
    */
    public function token()
    {
        $user = Auth::user();
        $user->tokens()->delete();
        $token = $user->createToken($user->name);
        return response()->json(['token' => $token->plainTextToken]);
    }

    /**
     * Display the users the user is currently following
    *
    * @return \Illuminate\Http\Response
    */
    public function following($username)
    {
        $user = User::where('name', 'ILIKE', $username)->firstOrFail();
        return view('following', ['user' => $user]);
    }

    /**
     * Display the users that are following the user
    *
    * @return \Illuminate\Http\Response
    */
    public function followers($username)
    {
        $user = User::where('name', 'ILIKE', $username)->firstOrFail();
        return view('followers', ['user' => $user]);
    }

    /**
     * Display the user's images
    *
    * @return \Illuminate\Http\Response
    */
    public function gallery(Request $request, $name)
    {
        $page = $request->query('page');
        $offset = 0;

        if ($page > 1) {
            $offset = 40 * $page;
        }

        $user = User::where('name', 'ILIKE', $name)->firstOrFail();
        if (Auth::user()) {
            if (Auth::user()->age < 18) {
                $user->images = Image::with('user:id,name')
                    ->where([
                        ['user_id', $user->id],
                        ['nsfw', false],
                    ])
                    ->orderByDesc('created_at')
                    ->limit(40)
                    ->offset($offset)
                    ->get();
            } else {
                $user->images = Image::with('user:id,name')
                    ->where([
                        ['user_id', $user->id],
                    ])
                    ->orderByDesc('created_at')
                    ->limit(40)
                    ->offset($offset)
                    ->get();
            }
        } else {
            $user->images = Image::with('user:id,name')
                ->where([
                    ['user_id', $user->id],
                    ['nsfw', false],
                ])
                ->orderByDesc('created_at')
                ->limit(40)
                ->offset($offset)
                ->get();
        }

        if (Auth::user() && Auth::user()->id !== $user->id) {
            $authUser = Auth::user();
            return $user->followers->contains($authUser);
        }

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function notificationsLength()
    {
        $notificationsLength = count(Auth::user()->unreadNotifications);
        return ['notifications' => $notificationsLength];
    }

    /**
      * Display the user's notifications
     *
     * @return Response
     */

    public function notifications()
    {
        $user = Auth::user();
        $notifications = $user->unreadNotifications->map(function ($item, $key) {
            if (array_key_exists("comment_id", $item->data)) {
                $item->comment = Comment
                    ::with('user:id,name,email')
                    ->with(['image:id,title', 'journal:id,title', 'profile:id'])
                    ->find($item->data["comment_id"]);
            } elseif (array_key_exists('image_id', $item->data)) {
                $item->image = Image
                    ::with('user:id,name,email')
                    ->find($item->data["image_id"]);
            } elseif (array_key_exists("journal_id", $item->data)) {
                $item->journal = Journal::find($item->data["journal_id"])->with('user:id,name,email');
            } elseif (array_key_exists("favorite_id", $item->data)) {
                $item->favorite = Favorite
                    ::with('user:id,name,email')
                    ->with('image:id,title')
                    ->find($item->data["favorite_id"]);
            } elseif (array_key_exists("follow_id", $item->data)) {
                $item->follow = Follow
                ::with('follower:id,name,email')
                ->find($item->data["follow_id"]);
            }
            return $item;
        });
        return response()->json(['notifications' => $notifications]);
    }

    public function deleteNotifications(Request $request)
    {
        Auth::user()
            ->notifications()
            ->whereIn('id', $request->notifications)->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Display the user's journals
    *
    * @return \Illuminate\Http\Response
    *
    */
    public function journals(Request $request, $username)
    {
        $page = intval($request->query('page'));
        $skip = 0;
        // if $page is 2
        // skip the first 10 results
        // so
        // (2 - 1) * 10 = 10
        if ($page !== 1) {
            $skip = ($page - 1) * 10;
        }

        $user = User
            ::where('name', 'ILIKE', $username)
            ->with(['journals' => function ($query) use ($skip) {
                $query->with('comments')->orderByDesc('created_at')->skip($skip)->take(10);
            }])
            //->with('journals.comments')
            ->first();

        if ($page === 1) {
            $user->journalCount = Journal::where('user_id', '=', $user->id)->count();
        }

        if (Auth::user() && Auth::user()->id !== $user->id) {
            $authUser = Auth::user();
            return $user->followers->contains($authUser);
        }

        return response()->json(['success' => true, 'user' => $user]);
    }

    /**
     * Display the user's favorites
    *
    * @return \Illuminate\Http\Response
    *
    */
    public function favorites($username)
    {
        $user = User::where('name', 'ILIKE', $username)->firstOrFail();
        return view('favorites', ['user' => $user]);
    }


    public function follow(Request $request)
    {
        $user = Auth::user();
        $userThatWillBeFollowed = User::find($request->id);

        $this->authorize('follow', $userThatWillBeFollowed);

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
    }

    /**
     * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function settings()
    {
        return view('settings', ['user' => Auth::user()]);
    }

    /**
     * Display the specified resource.
    *
    * @param  string $name
    * @return \Illuminate\Http\Response
    */
    public function show($name)
    {
        $user = User
            ::with([
                'followers',
                'following',
            ])
            ->where('name', 'ILIKE', $name)
            ->firstOrFail();

        $user->profile_comments = Comment
            ::where('profile_id', $user->id)
            ->with('user')
            ->orderBy('created_at', 'DESC')
            ->take(10)
            ->get();


        if ($user->feature_image_id !== null) {
            $user->feature_image = Image::find($user->feature_image_id);
            if (Auth::check()) {
                if (Auth::user()->age < 18 && $user->featureImage->nsfw) {
                    $user->feature_image = null;
                }
            } else {
                if ($user->feature_image->nsfw) {
                    $user->feature_image = null;
                }
            }
        }
        if (Auth::check() && Auth::user()->id !== $user->id) {
            $user->isFollowedByAuthUser = $user->followers->contains(Auth::user());
        }
       // $user->comments = $user->comments->sortByDesc('created_at');
        return response()->json(["success" => true, "user" => $user]);
    }

  /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\UserRequest  $request
  * @return \Illuminate\Http\Response
  */

    public function update(UserRequest $request)
    {

        $validated = $request->validated();
        $user = Auth::user();

        $user->name = $validated->name;
        $user->tagline = $validated->tagline;
        $user->description = $validated->description;
        $user->birthday = $validated->birthday;
        $user->save();
        return redirect()->route('profile', [$user->name]);
    }

     /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\UserRequest  $request
  * @return \Illuminate\Http\Response
  */

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if ($user->password === null) {
            $user->password = Hash::make($request->newpassword);
            $user->save();
        } else {
            $request->validate([
                'newpassword' => 'required|min:6|same:confirmnewpassword',
                'confirmnewpassword' => 'required|same:newpassword'
            ]);
            if (Hash::check($request->oldpassword, $user->password)) {
                $user->password = Hash::make($request->newpassword);
                $user->save();
            } else {
                $request->session()->flash('oldpassword', 'error');
                return redirect()->route('settings');
            }
        }
        return redirect()->route('settings');
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
