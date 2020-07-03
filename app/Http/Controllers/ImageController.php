<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Notification;
use Bluebird\Notifications\NewFavorite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gates;
use Illuminate\Http\Request;
use Bluebird\Http\Requests\ImageRequest;
use Bluebird\User;
use Bluebird\Notifications\NewImage;
use Bluebird\Helpers;
use Bluebird\Tag;
use Bluebird\ImageTag;
use Bluebird\Image;
use Bluebird\Favorite;
use Carbon\Carbon;
use Storage;
use Intervention;

class ImageController extends Controller
{
    use DatabaseMigrations;
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['search', 'show', 'latest']]);
    }

    /**
     * Get latest images for homepage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    public function latest(Request $request)
    {
        $page = $request->query('page');
        $offset = 0;

        if ($page > 1) {
            $offset = 40 * $page;
        }

        $images = [];
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->age >= 18) {
                $images = Image::with('user:id,name')
                    ->orderByDesc('created_at')
                    ->limit(40)
                    ->offset($offset)
                    ->get();
            } else {
                $images = Image::with('user:id,name')
                    ->where('nsfw', false)
                    ->orderByDesc('created_at')
                    ->limit(40)
                    ->offset($offset)
                    ->get();
            }
        } else {
            $images = Image::with('user:id,name')
                ->where('nsfw', false)
                ->orderByDesc('created_at')
                ->offset($offset)
                ->limit(40)
                ->get();
        }
        return response()->json(['success' => true, 'images' => $images]);
    }

    /**
     * Adds the resource as the featured resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function feature(Request $request)
    {

        $image = Image::find($request->id);
        $this->authorize('feature', $image);

        $user = Auth::user();
        if ($user->feature_image_id !== null) {
            $user->feature_image_id = null;
        } else {
            $user->feature_image_id = $image->id;
        }
        $user->save();
        return response()->json(['success' => true, 'featured' => $user->feature_image_id !== null]);
    }


    /**
     * Display resources that have the tags.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    public function search(Request $request)
    {
        $page = $request->query('page');
        $offset = 0;

        if ($page > 1) {
            $offset = 40 * $page;
        }

        $tags = explode(' ', $request->query('qs'));
        $qs = $request->query('qs');

        $images = [];

        if (Auth::check() && Auth::user()->age >= 18) {
            $images = Image::with('user:id,name,email')
                ->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                })
                ->orWhere('title', 'ILIKE', '%'.$qs.'%')
                ->limit(40)
                //->offset($offset)
                ->get();
        } else {
            $images = Image::with('user:id,name,email')
                ->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                })
                ->orWhere('title', 'ILIKE', '%'.$qs.'%')
                ->where('nsfw', false)
                ->limit(40)
                ->offset($offset)
                ->get();
        }
        return response()->json(['success' => true, 'images' => $images]);//->images()->get()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Bluebird\Http\Requests\ImageRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ImageRequest $request)
    {
        //$this->authorize('create');

        $validated = $request->validated();

        $user = Auth::user();

        if ($user->age < 18 && $validated['rating'] === 'nsfw') {
            return response()->json([
                'success' => false,
                'errors' => [
                'image' => ['You cannot submit a NSFW image.'],
                ],
            ], 422);
        }

        $image = new Image;

        $tags = explode(',', str_replace('/\s+/', '', $validated['tags']));
        $image->image_url = $validated['image']->store($user->name);
        $image_extension = '.'.\File::extension($image->image_url);
        $image_url_no_extension = basename($image->image_url, $image_extension);

        $thumbnail = Intervention::make($validated['image']);
        $thumbnail->resize(200, 200, function ($i) {
            $i->aspectRatio();
        })->encode('png');

        $image->thumbnail_url = $user->name.'/'.$image_url_no_extension.'_thumbnail.png';
        Storage::put($image->thumbnail_url, $thumbnail->__toString());

        $image->user_id = $user->id;
        $image->description = $validated['description'];
        $image->title = $validated['title'];
        $image->nsfw = $validated['rating'] === 'nsfw' ? true : false;

        $image->save();

        foreach ($tags as $tag) {
            if (!Tag::where('name', $tag)->first()) {
                $tag_ = new Tag;
                $tag_->name = $tag;
                $tag_->save();
                $image->tags()->attach($tag_);
            } else {
                $image->tags()->attach(Tag::where('name', $tag)->first());
            }
        }
        $users = $user->followers();
        Notification::send($user->followers, new NewImage($image));

        return response()->json(['success' => true]);
    }



    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $image = Image::with('user:id,email,name')
            ->with(['comments', 'comments.user:id,email,name'])
            ->with(['tags:tag_id,name'])
            ->find($id);

        $this->authorize('view', $image);

        if (Auth::check()) {
            $image->favorited = Favorite::where([
                ['user_id', Auth::user()->id],
                ['image_id', $image->id]
            ])->exists();
            $user = Auth::user();

            if (Auth::user()->id === $image->user_id) {
                $image->isOwnedByViewingUser = true;
                $user = Auth::user();
                if ($user->feature_image_id !== null) {
                    $image->featured = Auth::user()->feature_image_id === $image->id;
                }
            }
        }

        return response()->json(['success' => true, 'image' => $image]);
    }

    public function favorite(Request $request)
    {
        $user = Auth::user();
        $image = Image::find($request->id);

        $this->authorize('favorite', $image);
        $favorite = Favorite::where([
            ['user_id', $user->id],
            ['image_id', $image->id]
        ]);
        if ($favorite->exists()) {
            $favorite->delete();
            return response()->json(["success" => true, "favorited" => false]);
        } else {
            $favorite = Favorite::create([
                'user_id' => $user->id,
                'image_id' => $image->id,
            ]);
            $favorite->save();
            $image->user->notify(new NewFavorite($favorite));
            return response()->json(["success" => true, "favorited" => true]);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\ImageRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(ImageRequest $request)
    {
        $validated = $request->validated();

        $image = Image::find($validated->id);
        $this->authorize('update', $image);

        $user = Auth::user();
        $tags = explode(',', str_replace('/\s+/', '', $validated->tags));
        $image->fill($validated->all());

        if ($validated->hasFile('image')) {
            $image_url = $validated->file('image')->store($user->name);

            $image_url_no_extension = explode('/', $image_url)[1];
            $image_url_no_extension = explode('.', $image_url_no_extension)[0];

            $thumbnail = Intervention::make($validated->file('image'));
            $thumbnail->resize(200, 200, function ($i) {
                $i->aspectRatio();
            })->encode("png");

            $image->image_url = $image_url;
            $image->thumbnail_url = $user->id.'/'.$image_url_no_extension.'_thumbnail.png';
            Storage::put($image->thumbnail_url, $thumbnail->__toString(), "public");
        }
        $image->description = $validated->description;
        $image->title =$validated->title;
        //$image->user_id = $user->id;
        $image->nsfw = $validated->nsfw === 'nsfw' ? true : false;
        $image->save();

        $tags_array = [];
        foreach ($tags as $tag) {
            if (Tag::where('name', 'ILIKE', $tag)->count() === 0) {
                $tag_ = new Tag;
                $tag_->name = $tag;
                $tag_->save();
                array_push($tags_array, $tag_->id);
            } else {
                $tag_ = Tag::where('name', 'ILIKE', $tag)->first();
                array_push($tags_array, $tag_->id);
            }
        }
        $image->tags()->sync($tags_array);
        $image->save();

        return response()->json(['success' => true, 'image' => $image]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $image = Image::find($request->id);

        $this->authorize('delete', $image);
        Storage::delete([$image->image_url, $image->thumbnail_url]);

        $image->delete();
        return response()->json(['success' => true]);
    }
}
