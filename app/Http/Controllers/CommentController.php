<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Support\Facades\Notification;
use Bluebird\Notifications\NewComment;
use Bluebird\Http\Requests\CommentRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Bluebird\User;
use Bluebird\Image;
use Bluebird\Comment;
use Bluebird\Journal;
use Gate;

class CommentController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  Bluebird\Http\Requests\CommentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CommentRequest $request)
    {

        $validated = $request->validated();
        $user = Auth::user();
        $comment = Comment::create([
            'user_id' => $user->id,
            'data' => $validated['data'],
        ]);
        $owner = null;
        switch ($validated['comment_type']) {
            case 'image':
                $image = Image::find($validated['id']);
                $comment->image_id = $image->id;
                $owner = $image->user;
                break;
            case 'journal':
                $journal = Journal::find($validated['id']);
                $comment->journal_id = $journal->id;
                $owner = $journal->user;
                break;
            case 'profile':
                $profile = User::find($validated['id']);
                $comment->profile_id = $profile->id;
                $owner = $profile;
        }
        $comment->save();

        if ($owner->id !== $user->id) {
            $owner->notify(new NewComment($comment));
        }

        $comment = Comment::with('user:id,name,email')->find($comment->id);
        return response()->json(['success' => true, 'comment' => $comment]);
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
        $comment = Comment::find($id);
        $this->authorize('update-comment', $comment);

        $user = Auth::user();

        $request->validate([
          "data" => 'required'
        ]);
        $comment->data = $request->data;
        $comment->save();
        return redirect()->route('image.view', [$comment->image]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);
        $this->authorize('update-comment', $comment);

        $comment->delete();
        return redirect()->route('view-image', ['id' => $comment->image->id]);
    }
}
